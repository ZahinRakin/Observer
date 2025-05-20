from fastapi import APIRouter, Request, Depends
from pydantic import BaseModel
from typing import Annotated

from backend.models.user_model import User
from backend.controllers.user_controllers import (
  register,
  login,
  dummy_protected_route,
  refresh_access_token,
  list_users,
  delete_user,
  get_user_details
)
from backend.middlewares.auth import get_user

router = APIRouter()
class LoginData(BaseModel):
  username: str
  password: str
  rememberMe: bool



@router.get("/")
async def list_users_route():
  return await list_users()

@router.post("/")
async def user_register(user: User):
  return await register(user)

@router.delete("/{user_id}")
async def delete_user_route(user_id: str):
  return await delete_user(user_id)

@router.get("/{user_id}")
async def get_user_details_route(user_id: str):
  return await get_user_details(user_id)

@router.put("/{user_id}")
async def update_user(user_id: str, user_data: User):
  from backend.controllers.user_controllers import update_user
  return await update_user(user_id, user_data)
  
@router.post("/login")
async def login_user(login_data: LoginData):
  return await login(login_data)

@router.get("/dummy_protected_route")   # needs testing. modified.
async def dummy(user: Annotated[User, Depends(get_user)]):
  return await dummy_protected_route(user)

@router.get("/refresh-token")
async def refresh_token_(req: Request):
  access_token = req.headers["Authorization"].removeprefix("Bearer ")
  return await refresh_access_token(access_token)

