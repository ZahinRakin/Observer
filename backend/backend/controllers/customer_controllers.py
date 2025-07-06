from backend.models.customer_model import Customer
from backend.models.news_model import News
from backend.models.product_model import Product
from fastapi import HTTPException
from backend.controllers.notification_controllers import send_notification
from datetime import datetime, timedelta
from typing import Dict, Any, List

async def notifiy_me(product_id: str, user_id: str, title: str, description: str):
  from backend.controllers.user_controllers import get_user_details
  from backend.controllers.product_controllers import get_product

  user = await get_user_details(user_id)
  product = await get_product(product_id)
  notification_data = {
    "product": product,
    "receiver": user,
    "title": title,
    "description": description
  }
  return await send_notification(notification_data)

async def get_customer(customer_id: str):
    customer = await Customer.get(customer_id)
    return customer

async def get_all_customers():
  customers = await Customer.find_all().to_list()
  return customers

async def get_customer_dashboard_stats(customer_id: str) -> Dict[str, Any]:
    """Get comprehensive dashboard statistics for a customer"""
    try:
        customer = await Customer.get(customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Get subscribed products count
        subscribed_products = await Product.find({"subscribers": {"$in": [customer_id]}}).to_list()
        subscribed_products_count = len(subscribed_products)
        
        # Get total news count for subscribed products
        total_news = 0
        unread_news = 0
        
        for product in subscribed_products:
            product_news = await News.find({"product": str(product.id)}).to_list()
            total_news += len(product_news)
            
            # Count unread news (assuming news has a read_by field or similar)
            # For now, we'll count all news as potentially unread
            unread_news += len(product_news)
        
        # Get last activity (customer's last login or activity)
        last_activity = customer.updated_at or customer.created_at
        
        result = {
            "subscribedProducts": subscribed_products_count,
            "unreadNews": unread_news,
            "totalNews": total_news,
            "lastActivity": last_activity.isoformat() if last_activity else None
        }
        
        print(f"🔍 DEBUG - Customer dashboard stats for {customer_id}:", result)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting customer dashboard stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting dashboard stats: {str(e)}")

async def get_customer_recent_news(customer_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Get recent news for products the customer is subscribed to"""
    try:
        customer = await Customer.get(customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Get subscribed products
        subscribed_products = await Product.find({"subscribers": {"$in": [customer_id]}}).to_list()
        
        if not subscribed_products:
            return []
        
        # Get product IDs
        product_ids = [str(product.id) for product in subscribed_products]
        
        # Get recent news for these products
        recent_news = await News.find({"product": {"$in": product_ids}}).to_list(limit)
        # Sort by created_at descending (most recent first)
        recent_news.sort(key=lambda x: x.created_at, reverse=True)
        
        # Format the news data
        formatted_news = []
        for news in recent_news:
            # Find the product for this news
            product = next((p for p in subscribed_products if str(p.id) == news.product), None)
            
            formatted_news.append({
                "id": str(news.id),
                "title": news.title,
                "description": news.description,
                "product": product.name if product else "Unknown Product",
                "productId": news.product,
                "time": news.created_at.isoformat() if news.created_at else None,
                "isRead": False  # TODO: Implement read status tracking
            })
        
        print(f"🔍 DEBUG - Recent news for customer {customer_id}:", len(formatted_news))
        return formatted_news
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting customer recent news: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting recent news: {str(e)}")

async def update_customer(customer_id: str, customer_data):
    try:
        customer = await Customer.get(customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Update only the fields that were explicitly set in the request
        update_data = customer_data.model_dump(exclude_unset=True)
        
        # Validate that we have at least one field to update
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields provided for update")
        
        # Update only the provided fields
        for field_name, field_value in update_data.items():
            setattr(customer, field_name, field_value)
        
        # Save the updated customer
        await customer.save()
        return customer
        
    except HTTPException:
        # Re-raise HTTPExceptions (like 404, 400)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating customer: {str(e)}")


