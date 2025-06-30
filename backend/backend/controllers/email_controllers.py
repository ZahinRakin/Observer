import os
import base64
from fastapi import HTTPException
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from backend.models.email_model import Email

# ==============================
# 🔐 Load Environment Variables
# ==============================
GMAIL_CLIENT_ID = os.getenv("GMAIL_CLIENT_ID")
GMAIL_CLIENT_SECRET = os.getenv("GMAIL_CLIENT_SECRET")
GMAIL_REFRESH_TOKEN = os.getenv("GMAIL_REFRESH_TOKEN")

# ==============================
# 📧 Gmail API Scopes
# ==============================
SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
]

# ==============================
# 📤 Send Email Method
# ==============================
async def send_email(email_data: Email):
    # 1. Prepare Credentials for the sender
    creds = Credentials(
        None,
        refresh_token=GMAIL_REFRESH_TOKEN,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GMAIL_CLIENT_ID,
        client_secret=GMAIL_CLIENT_SECRET,
        scopes=SCOPES,
    )

    try:
        # 2. Build Gmail API client
        service = build("gmail", "v1", credentials=creds)

        # 3. Create the MIME email message
        message = MIMEText(email_data.body)
        message["to"] = email_data.receiver
        message["from"] = email_data.sender
        message["subject"] = email_data.subject

        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()

        # 4. Send the email
        send_result = service.users().messages().send(
            userId="me", body={"raw": raw}
        ).execute()

        # 5. Optionally save the email to DB
        await email_data.insert()

        return {"message": "Email sent", "id": send_result.get("id")}

    except HttpError as error:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {error}")
