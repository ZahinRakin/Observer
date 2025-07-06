from fastapi import APIRouter, Body, Query
from backend.models.customer_model import Customer
from backend.controllers.customer_controllers import (
    get_all_customers,
    get_customer,
    update_customer,
    get_customer_dashboard_stats,
    get_customer_recent_news
)
from pydantic import BaseModel
from typing import Optional

# Pydantic model for customer updates (without password requirement)
class CustomerUpdate(BaseModel):
    fname: Optional[str] = None
    lname: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    account_type: Optional[str] = None
    avatar: Optional[str] = None
    cover_image: Optional[str] = None

router = APIRouter()

@router.get("/")
async def list_customers():
    return await get_all_customers()

@router.get("/{customer_id}")
async def get_customer_route(customer_id: str):
    return await get_customer(customer_id)

@router.put("/{customer_id}")
async def update_customer_route(customer_id: str, customer: CustomerUpdate = Body(...)):
    return await update_customer(customer_id, customer)

@router.get("/{customer_id}/dashboard/stats")
async def get_customer_dashboard_stats_route(customer_id: str):
    """Get dashboard statistics for a customer"""
    print("inside the customer_routes.py returning the customer stats.") # debugging log
    return await get_customer_dashboard_stats(customer_id)

@router.get("/{customer_id}/dashboard/recent-news")
async def get_customer_recent_news_route(customer_id: str, limit: int = Query(10, ge=1, le=50)):
    """Get recent news for products the customer is subscribed to"""
    print("inside the customer_router.py returning the recent-news") # debugging log
    return await get_customer_recent_news(customer_id, limit)

# @router.post("/")
# async def create_customer_route(customer: Customer = Body(...)):
#     return await create_customer(customer)

# @router.delete("/{customer_id}")
# async def delete_customer_route(customer_id: str):
#     return await delete_customer(customer_id)

# @router.post("/{customer_id}/subscribe/{product_id}")
# async def subscribe_route(customer_id: str, product_id: str):
#     return await subscribe(customer_id, product_id)

# @router.delete("/{customer_id}/unsubscribe/{product_id}")
# async def unsubscribe_route(customer_id: str, product_id: str):
#     return await unsubscribe(customer_id, product_id)

# @router.get("/{customer_id}/search")
# async def search_products_route(customer_id: str, query: str = Query(...)):
#     return await search_products_for_customer(customer_id, query)
