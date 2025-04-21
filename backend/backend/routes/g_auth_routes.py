from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

from backend.models.user_model import User
from backend.utils.token import gen_access_token, gen_refresh_token


GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")   # sometimes this don't retrieve the values from the .env file each time. so changing doesn't effect as expected.

class TokenRequest(BaseModel):
  token: str

router = APIRouter()

@router.post("/callback")  # full path is http://localhost:3000/auth/google/callback
async def callback(payload: TokenRequest, req: Request):
    print(f"inside callback method.")
    token = payload.token
    print(f"token: {token}")
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )

        user_data = {
            "email": idinfo['email'],
            "name": idinfo.get('name'),
            "picture": idinfo.get('picture'),
            "fname": idinfo.get('given_name'),
            "lname": idinfo.get('family_name')
        }

        existing_user = await User.find_one(User.email == user_data["email"])

        if existing_user:
            return {"message": "Logged In"}

        new_user = User(
            fname=user_data["fname"],
            lname=user_data["lname"],
            email=user_data["email"],
            username=user_data["name"],
            password="google-auth",
            avater=user_data["picture"]
        )
        await new_user.insert()

        refresh_token = await gen_refresh_token()
        access_token = await gen_access_token()

        new_user.refresh_token = refresh_token
        await new_user.save()

        res = JSONResponse(
            content={"message": "login successful"},
            headers={"Authorization": f"Bearer {access_token}"}
        )
        res.set_cookie(
            key="refreshToken",
            value=refresh_token,
            httponly=True,
            secure=(os.getenv("ENVIRONMENT") == "production"),
            samesite="Lax",
            max_age=int(os.getenv("COOKIE_MAX_AGE") or 3600)  # fallback 1 hour
        )
        return res

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")
      
      
      
