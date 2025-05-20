from fastapi import APIRouter, Body
from backend.models.store_model import Store
from backend.controllers.store_controllers import (
    get_all_stores,
    get_store,
    create_store,
    update_store,
    delete_store
)

router = APIRouter()

@router.get("/")
async def list_stores():
    return await get_all_stores()

@router.get("/{store_id}")
async def get_store_route(store_id: str):
    return await get_store(store_id)

@router.post("/")
async def create_store_route(store: Store = Body(...)):
    return await create_store(store)

@router.put("/{store_id}")
async def update_store_route(store_id: str, store: Store = Body(...)):
    return await update_store(store_id, store)

@router.delete("/{store_id}")
async def delete_store_route(store_id: str):
    return await delete_store(store_id)

