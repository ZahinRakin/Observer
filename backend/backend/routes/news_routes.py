from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import Optional
from backend.models.news_model import News
from backend.controllers.news_controllers import (
    get_all_news,
    get_news,
    create_news,
    update_news,
    delete_news,
    get_customer_news,
    get_product_news
)

# Model for creating news
class NewsCreate(BaseModel):
    product: str
    title: str
    description: str
    author_id: Optional[str] = None
    author_name: Optional[str] = None

# Model for partial updates
class NewsUpdate(BaseModel):
    product: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    author_id: Optional[str] = None
    author_name: Optional[str] = None

router = APIRouter()

@router.get("")
async def list_news():
    return await get_all_news()

@router.get("/product/{product_id}")
async def get_product_news_route(product_id: str):
    """Get all news for a specific product"""
    print(f"🔍 DEBUG - Backend route called with product_id: {product_id}")
    result = await get_product_news(product_id)
    print(f"🔍 DEBUG - Backend route returning: {result}")
    return result

@router.get("/{customer_id}/news")
async def get_customer_news_route(customer_id: str):
    return await get_customer_news(customer_id)

@router.post("")
async def create_news_route(news: NewsCreate = Body(...)):
    return await create_news(news)

@router.put("/{news_id}")
async def update_news_route(news_id: str, news_update: NewsUpdate = Body(...)):
    return await update_news(news_id, news_update)

@router.delete("/{news_id}")
async def delete_news_route(news_id: str):
    return await delete_news(news_id)

@router.get("/{news_id}")
async def get_news_route(news_id: str):
    return await get_news(news_id)

