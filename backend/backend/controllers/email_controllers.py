import os
import base64
from fastapi import HTTPException
from backend.models.email_model import Email
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import requests
import logging
from google_auth_oauthlib.flow import Flow
from google.auth.exceptions import GoogleAuthError
from backend.models.OAuth2Creds import OAuthCredentials

# Load sensitive info from environment variables
GMAIL_CLIENT_ID = os.getenv("GMAIL_CLIENT_ID")
GMAIL_CLIENT_SECRET = os.getenv("GMAIL_CLIENT_SECRET")
GMAIL_REFRESH_TOKEN = os.getenv("GMAIL_REFRESH_TOKEN")
GMAIL_USER = os.getenv("GMAIL_USER")

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

CLIENTSECRETS_LOCATION = "backend.client-google-cloud.json"
REDIRECT_URI = "http://localhost:5500"


class GetCredentialsException(Exception):
    """Error raised when an error occurred while retrieving credentials.

    Attributes:
        authorization_url: Authorization URL to redirect the user to in order to
                          request offline access.
    """

    def __init__(self, authorization_url):
        """Construct a GetCredentialsException."""
        self.authorization_url = authorization_url


class CodeExchangeException(GetCredentialsException):
    """Error raised when a code exchange has failed."""


class NoRefreshTokenException(GetCredentialsException):
    """Error raised when no refresh token has been found."""


class NoUserIdException(Exception):
    """Error raised when no user ID could be retrieved."""


async def get_stored_credentials(user_id: str):
    try:
        result = await OAuthCredentials.find_one(OAuthCredentials.user_id == user_id)
        if result:
            return Credentials(**result.credentials_json)
        return None
    except Exception as e:
        print(f"Error retrieving credentials: {e}")
        return None


async def store_credentials(user_id: str, credentials: Credentials):
    data = {
        "user_id": user_id,
        "credentials_json": {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes,
        },
    }
    existing = await OAuthCredentials.find_one(OAuthCredentials.user_id == user_id)
    if existing:
        await existing.set(data)
    else:
        await OAuthCredentials(**data).insert()


async def exchange_code(authorization_code: str):
    try:
        flow = Flow.from_client_secrets_file(
            "client_secrets.json",
            scopes=["https://www.googleapis.com/auth/gmail.send"],
            redirect_uri="REDIRECT_URI",
        )

        flow.fetch_token(code=authorization_code)

        return flow.credentials

    except GoogleAuthError as error:
        logging.error("An error occurred: %s", error)
        raise CodeExchangeException(str(error))


def get_user_info(credentials):
    user_info_endpoint = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {
        "Authorization": f"Bearer {credentials.token}",
    }

    try:
        response = requests.get(user_info_endpoint, headers=headers)
        response.raise_for_status()
        user_info = response.json()

        if user_info.get("id"):
            return user_info
        else:
            raise NoUserIdException()

    except requests.RequestException as e:
        logging.error("An error occurred: %s", e)
        raise NoUserIdException()


def get_authorization_url(email_address: str, state: str) -> str:
    flow = Flow.from_client_secrets_file(
        "client_secrets.json",  # Path to your OAuth client secret JSON
        scopes=["https://www.googleapis.com/auth/gmail.send"],
        redirect_uri="YOUR_REDIRECT_URI",  # Replace with your registered redirect URI
    )

    authorization_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
        state=state,
        login_hint=email_address,  # Suggests the user's email during login
    )

    return authorization_url


async def get_credentials(authorization_code: str, state: str):
    email_address = ""
    try:
        credentials = await exchange_code(
            authorization_code
        )  # Make sure this returns google.oauth2.credentials.Credentials
        user_info = await get_user_info(
            credentials
        )  # Should return {'email': ..., 'id': ...}

        email_address = user_info.get("email")
        user_id = user_info.get("id")

        if not user_id:
            raise NoUserIdException()

        if credentials.refresh_token:
            await store_credentials(user_id, credentials)  # Save credentials to DB
            return credentials
        else:
            stored_credentials = await get_stored_credentials(user_id)
            if stored_credentials and stored_credentials.refresh_token:
                return stored_credentials

    except CodeExchangeException as error:
        logging.error("An error occurred during code exchange.")
        error.authorization_url = get_authorization_url(email_address, state)
        raise error

    except NoUserIdException:
        logging.error("No user ID could be retrieved.")

    # No valid refresh token found, ask user to re-auth.
    authorization_url = get_authorization_url(email_address, state)
    raise NoRefreshTokenException(authorization_url)


async def send_email(email_data: Email):
    creds = Credentials(
        None,
        refresh_token=GMAIL_REFRESH_TOKEN,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GMAIL_CLIENT_ID,
        client_secret=GMAIL_CLIENT_SECRET,
        scopes=SCOPES,
    )
    try:
        service = build("gmail", "v1", credentials=creds)
        message = MIMEText(email_data.body)
        message["to"] = email_data.receiver
        message["from"] = GMAIL_USER
        message["subject"] = email_data.subject
        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
        send_message = service.users().messages().send(userId="me", body={"raw": raw}).execute()
        # Save to DB
        await email_data.insert()
        return {"message": "Email sent", "id": send_message.get("id")}
    except HttpError as error:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {error}")


async def get_email_status(email_id: str):
    email = await Email.get(email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return email

