from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.controllers.admin_controllers import (
    get_all_admins,
    get_admin,
    create_admin,
    update_admin,
    delete_admin
)

router = APIRouter()

class AdminCreateRequest(BaseModel):
    user_id: str

class AdminUpdateRequest(BaseModel):
    user_id: Optional[str] = None

@router.get("/", tags=["admin"])
async def list_admins():
    return await get_all_admins()

@router.get("/{admin_id}", tags=["admin"])
async def get_admin_route(admin_id: str):
    return await get_admin(admin_id)

@router.post("/", tags=["admin"])
async def create_admin_route(admin: AdminCreateRequest):
    return await create_admin(admin)

@router.put("/{admin_id}", tags=["admin"])
async def update_admin_route(admin_id: str, admin: AdminUpdateRequest):
    return await update_admin(admin_id, admin)

@router.delete("/{admin_id}", tags=["admin"])
async def delete_admin_route(admin_id: str):
    return await delete_admin(admin_id)