from fastapi import APIRouter, Body
from backend.models.store_owner_model import StoreOwner
from backend.controllers.store_owner_controllers import (
    get_store_owners,
    get_store_owner,
    update_store_owner
)

router = APIRouter()

@router.get("")
async def list_store_owners():
    return await get_store_owners()

@router.get("/{store_owner_id}")
async def get_store_owner_route(store_owner_id: str):
    return await get_store_owner(store_owner_id)

@router.put("/{store_owner_id}")
async def update_store_owner_route(store_owner_id: str, store_owner: StoreOwner = Body(...)):
    return await update_store_owner(store_owner_id, store_owner)

