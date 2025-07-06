from backend.models.product_model import Product
from fastapi import HTTPException
from backend.models.news_model import News

async def get_all_news():
    return await News.find_all().to_list()

async def get_news(news_id: str):
    news = await News.get(news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

async def create_news(news_data):
    try:
        news = News(**news_data.model_dump())
        await news.insert()
        return news
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating news: {str(e)}")

async def update_news(news_id: str, news_data):
    try:
        # Get the existing news
        news = await News.get(news_id)
        if not news:
            raise HTTPException(status_code=404, detail="News not found")
        
        # Get only the fields that were explicitly set in the request
        update_data = news_data.model_dump(exclude_unset=True)
        
        # Validate that we have at least one field to update
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields provided for update")
        
        # Update only the provided fields
        for field_name, field_value in update_data.items():
            setattr(news, field_name, field_value)
        
        # Save the updated news
        await news.save()
        return news
        
    except HTTPException:
        # Re-raise HTTPExceptions (like 404, 400)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating news: {str(e)}")

async def delete_news(news_id: str):
    try:
        news = await News.get(news_id)
        if not news:
            raise HTTPException(status_code=404, detail="News not found")
        await news.delete()
        return {"message": "News deleted successfully"}
    except HTTPException:
        # Re-raise HTTPExceptions (like 404)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting news: {str(e)}")

async def get_customer_news(customer_id: str):
    products = await Product.find({"subscribers": customer_id}).to_list()
    all_news = []
    for product in products:
        news_items = await News.find({"product": str(product._id)}).to_list()
        all_news.extend(news_items)
    return all_news

async def get_product_news(product_id: str):
    """Get all news for a specific product"""
    try:
        print(f"🔍 DEBUG - get_product_news called with product_id: {product_id}")
        
        # Verify the product exists
        product = await Product.get(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        print(f"🔍 DEBUG - Found product: {product.name}")
        
        # Get all news for this product using string product ID
        news_items = await News.find({"product": product_id}).to_list()
        
        print(f"🔍 DEBUG - Found {len(news_items)} news items for product {product_id}")
        
        # Convert to clean response format
        clean_news_items = []
        for news in news_items:
            # Create a clean response
            clean_news = {
                'id': str(news.id),
                'product': news.product,  # Already a string
                'title': news.title,
                'description': news.description,
                'author_id': news.author_id or "Unknown",  # Handle None values
                'author_name': news.author_name or "Unknown",  # Handle None values
                'created_at': news.created_at,
                'updated_at': news.updated_at
            }
            clean_news_items.append(clean_news)
        
        print(f"🔍 DEBUG - Returning {len(clean_news_items)} clean news items")
        return clean_news_items
    except HTTPException:
        # Re-raise HTTPExceptions (like 404)
        raise
    except Exception as e:
        print(f"❌ ERROR in get_product_news: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching product news: {str(e)}")