from fastapi import APIRouter, Body
from backend.models.store_owner_model import StoreOwner
from backend.models.store_model import Store
from backend.models.product_model import Product
from backend.models.news_model import News
from backend.controllers.store_owner_controllers import (
    get_store_owners,
    get_store_owner,
    update_store_owner,
    get_stores,
    get_store_owner_dashboard_stats,
    create_store_for_owner,
    update_store_for_owner,
    delete_store_for_owner,
    get_store_products,
    create_product_for_store,
    delete_product_for_store,
    get_store_owner_news,
    create_news_for_store_owner
)
from pydantic import BaseModel

# Pydantic model for news creation (without auto-generated fields)
class NewsCreate(BaseModel):
    product: str
    title: str
    description: str

router = APIRouter()

@router.get("")
async def list_store_owners():
    return await get_store_owners()

@router.get("/{store_owner_id}")
async def get_storeowner(store_owner_id: str):
    return await get_store_owner(store_owner_id)

@router.get("/{store_owner_id}/stores")
async def get_stores_route(store_owner_id: str):
    return await get_stores(store_owner_id)

@router.put("/{store_owner_id}")
async def update_store_owner_route(store_owner_id: str, store_owner: StoreOwner = Body(...)):
    return await update_store_owner(store_owner_id, store_owner)

# Dashboard Statistics
@router.get("/{store_owner_id}/dashboard/stats")
async def get_dashboard_stats(store_owner_id: str):
    """Get dashboard statistics for a store owner"""
    return await get_store_owner_dashboard_stats(store_owner_id)

# Store Management
@router.post("/{store_owner_id}/stores")
async def create_store_route(store_owner_id: str, store: Store = Body(...)):
    """Create a new store for a store owner"""
    return await create_store_for_owner(store_owner_id, store)

@router.put("/{store_owner_id}/stores/{store_id}")
async def update_store_route(store_owner_id: str, store_id: str, store: Store = Body(...)):
    """Update a store that belongs to a store owner"""
    return await update_store_for_owner(store_owner_id, store_id, store)

@router.delete("/{store_owner_id}/stores/{store_id}")
async def delete_store_route(store_owner_id: str, store_id: str):
    """Delete a store that belongs to a store owner"""
    return await delete_store_for_owner(store_owner_id, store_id)

# Product Management
@router.get("/{store_owner_id}/stores/{store_id}/products")
async def get_store_products_route(store_owner_id: str, store_id: str):
    """Get all products for a specific store owned by the store owner"""
    return await get_store_products(store_owner_id, store_id)

@router.post("/{store_owner_id}/stores/{store_id}/products")
async def create_product_route(store_owner_id: str, store_id: str, product: Product = Body(...)):
    """Create a new product for a store owned by the store owner"""
    return await create_product_for_store(store_owner_id, store_id, product)

@router.delete("/{store_owner_id}/stores/{store_id}/products/{product_id}")
async def delete_product_route(store_owner_id: str, store_id: str, product_id: str):
    """Delete a product from a store owned by the store owner"""
    return await delete_product_for_store(store_owner_id, store_id, product_id)

# News Management
@router.get("/{store_owner_id}/news")
async def get_store_owner_news_route(store_owner_id: str):
    """Get all news published by the store owner"""
    return await get_store_owner_news(store_owner_id)

@router.post("/{store_owner_id}/news")
async def create_news_route(store_owner_id: str, news: NewsCreate = Body(...)):
    """Create a new news article for the store owner"""
    print(f"🔍 DEBUG - Backend received store_owner_id: {store_owner_id}")
    print(f"🔍 DEBUG - Backend received news data: {news}")
    print(f"🔍 DEBUG - News model dump: {news.model_dump()}")
    return await create_news_for_store_owner(store_owner_id, news)

# Test endpoint to debug the issue
@router.post("/{store_owner_id}/news-test")
async def test_news_route(store_owner_id: str, news: dict = Body(...)):
    """Test endpoint to see what data is being received"""
    print(f"🔍 DEBUG - Test endpoint received store_owner_id: {store_owner_id}")
    print(f"🔍 DEBUG - Test endpoint received raw news data: {news}")
    return {"message": "Test successful", "received_data": news}

