import base64
from email.message import EmailMessage
import os
import pickle
from email.mime.text import MIMEText

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import logging
import requests
from google_auth_oauthlib.flow import Flow
from google.auth.exceptions import GoogleAuthError

from backend.models.OAuth2Creds import OAuthCredentials

'''
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
from apiclient.discovery import build

'''


CLIENTSECRETS_LOCATION = '<PATH/TO/CLIENT_SECRETS.JSON>'
REDIRECT_URI = 'http://localhost:5500'
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/gmail.send',
    # Add other requested scopes.
]

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
          "scopes": credentials.scopes
      }
  }
  existing = await OAuthCredentials.find_one(OAuthCredentials.user_id == user_id)
  if existing:
      await existing.set(data)
  else:
      await OAuthCredentials(**data).insert()
      

async def exchange_code(authorization_code: str):
    try:
        flow = Flow.from_client_secrets_file(
            'client_secrets.json',
            scopes=['https://www.googleapis.com/auth/gmail.send'],
            redirect_uri='REDIRECT_URI'
        )

        flow.fetch_token(code=authorization_code)

        return flow.credentials

    except GoogleAuthError as error:
        logging.error('An error occurred: %s', error)
        raise CodeExchangeException(str(error))

def get_user_info(credentials):
    user_info_endpoint = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {
        "Authorization": f"Bearer {credentials.token}"
    }

    try:
        response = requests.get(user_info_endpoint, headers=headers)
        response.raise_for_status()
        user_info = response.json()

        if user_info.get('id'):
            return user_info
        else:
            raise NoUserIdException()

    except requests.RequestException as e:
        logging.error('An error occurred: %s', e)
        raise NoUserIdException()

def get_authorization_url(email_address: str, state: str) -> str:
    flow = Flow.from_client_secrets_file(
        'client_secrets.json',    # Path to your OAuth client secret JSON
        scopes=['https://www.googleapis.com/auth/gmail.send'],
        redirect_uri='YOUR_REDIRECT_URI'  # Replace with your registered redirect URI
    )

    authorization_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent',
        state=state,
        login_hint=email_address  # Suggests the user's email during login
    )

    return authorization_url

async def get_credentials(authorization_code: str, state: str):
    email_address = ''
    try:
        credentials = await exchange_code(authorization_code)  # Make sure this returns google.oauth2.credentials.Credentials
        user_info = await get_user_info(credentials)           # Should return {'email': ..., 'id': ...}

        email_address = user_info.get('email')
        user_id = user_info.get('id')

        if not user_id:
            raise NoUserIdException()

        if credentials.refresh_token:
            await store_credentials(user_id, credentials)      # Save credentials to DB
            return credentials
        else:
            stored_credentials = await get_stored_credentials(user_id)
            if stored_credentials and stored_credentials.refresh_token:
                return stored_credentials

    except CodeExchangeException as error:
        logging.error('An error occurred during code exchange.')
        error.authorization_url = get_authorization_url(email_address, state)
        raise error

    except NoUserIdException:
        logging.error('No user ID could be retrieved.')

    # No valid refresh token found, ask user to re-auth.
    authorization_url = get_authorization_url(email_address, state)
    raise NoRefreshTokenException(authorization_url)



def get_gmail_credentials():
    SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
    creds = None

    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                './client-google-cloud.json',
                SCOPES
            )
            creds = flow.run_local_server(port=8080)
        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)

    return creds


def gmail_send_message():
    creds = get_gmail_credentials()
    try:
        service = build("gmail", "v1", credentials=creds)
        message = EmailMessage()

        message.set_content(
            "lorem igsam this is a beautiful river under a bridge. maple leaf, canada, "
            "moscoow, switzerland, do you mind? australian cow has big capacity of milk, "
            "in the future i will swim in river. next 20 april swimming pool will be open. "
            "I will swim inshallah."
        )

        message["To"] = "bsse1447@iit.du.ac.bd"
        message["From"] = "zahinabdullahrakin@gmail.com"
        message["Subject"] = "Hello email testing, email testing"

        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {"raw": encoded_message}

        send_message = (
            service.users().messages().send(userId="me", body=create_message).execute()
        )
        print(f'Message Id: {send_message["id"]}')
    except HttpError as error:
        print(f"An error occurred: {error}")
        send_message = None
    return send_message
