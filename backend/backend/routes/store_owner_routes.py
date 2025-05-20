from fastapi import APIRouter, Body
from backend.models.store_owner_model import StoreOwner
from backend.models.user_model import User
from backend.models.product_model import Product
from backend.models.store_model import Store
from backend.models.news_model import News
from backend.controllers.store_owner_controllers import (
    get_store_owners,
    get_store_owner,
    create_store_owner,
    update_store_owner,
    delete_store_owner,
    add_user_to_store_owner,
    remove_subscriber,
    create_product_for_owner,
    create_store_for_owner,
    publish_news_for_owner
)

router = APIRouter()

@router.get("")
async def list_store_owners():
    return await get_store_owners()

@router.get("/{store_owner_id}")
async def get_store_owner_route(store_owner_id: str):
    return await get_store_owner(store_owner_id)

@router.post("")
async def create_store_owner_route(store_owner: StoreOwner = Body(...)):
    return await create_store_owner(store_owner)

@router.put("/{store_owner_id}")
async def update_store_owner_route(store_owner_id: str, store_owner: StoreOwner = Body(...)):
    return await update_store_owner(store_owner_id, store_owner)

@router.delete("/{store_owner_id}")
async def delete_store_owner_route(store_owner_id: str):
    return await delete_store_owner(store_owner_id)

@router.post("/{store_owner_id}/add-user")
async def add_user_route(store_owner_id: str, user_id: str = Body(...)):
    return await add_user_to_store_owner(store_owner_id, user_id)

@router.delete("/{store_owner_id}/remove-subscriber/{user_id}")
async def remove_subscriber_route(store_owner_id: str, user_id: str):
    return await remove_subscriber(store_owner_id, user_id)

@router.post("/{store_owner_id}/create-product")
async def create_product_route(store_owner_id: str, product: Product = Body(...)):
    return await create_product_for_owner(store_owner_id, product)

@router.post("/{store_owner_id}/create-store")
async def create_store_route(store_owner_id: str, store: Store = Body(...)):
    return await create_store_for_owner(store_owner_id, store)

@router.post("/{store_owner_id}/publish-news")
async def publish_news_route(store_owner_id: str, news: News = Body(...)):
    return await publish_news_for_owner(store_owner_id, news)

