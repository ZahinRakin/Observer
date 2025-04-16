from fastapi import APIRouter, Request, Depends
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from backend.models.user_model import User
from backend.controllers.user_controllers import (
  register,
  login,
  dummy_protected_route,
  refresh_access_token
)
from backend.middlewares.auth import get_user, get_active_user    #   this get active user demamds another attribute(disabled) in the User model
from backend.constants import oauth2_scheme

router = APIRouter()

@router.post("/register")
async def register_user(user: User):
  return await register(user)
  
  
@router.get("/login")
async def login_user(login_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
  return await login(login_data)

@router.get("/dummy_protected_route")   # needs testing. modified.
async def dummy(user: Annotated[User, Depends(get_user)]):
  return await dummy_protected_route(user)

@router.get("/refresh-token")
async def refresh_token_(req: Request):
  access_token = req.headers["Authorization"].removeprefix("Bearer ")
  return await refresh_access_token(access_token)
