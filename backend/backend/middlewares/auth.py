from fastapi import Request, HTTPException, Depends  # type: ignore
from jose import jwt  # type: ignore
import os
from backend.models.user_model import User
from typing import Annotated
from backend.constants import oauth2_scheme

async def get_user(token = Annotated[str, Depends(oauth2_scheme)]) -> User:
    try:
        decoded_token = jwt.decode(
            token,
            key=os.getenv("ACCESS_TOKEN_SECRET"),
            algorithms=[os.getenv("JWT_ALGORITHM")]
        )
        user_id = decoded_token.get('id')
        user = await User.get(user_id)
        if not user:
            raise HTTPException(
                status_code=404,
                detail=f"user[{user_id}] not found"                
            )
        
        return user
    except jwt.JWTError as e:
        print(e)
        raise HTTPException(status_code=401, detail=f"{e}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=f"{e}")
    
async def get_active_user(user: Annotated[User, Depends(get_user)]) -> User:
    if user.disabled:
        raise HTTPException(status_code=401, detail="User is disabled")
    return user