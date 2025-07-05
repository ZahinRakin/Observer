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
    products = await Product.find({"subscribers.$id": customer_id}).to_list()
    all_news = []
    for product in products:
        news_items = await News.find({"product.$id": product._id}).to_list()
        for news in news_items:
            await news.fetch_link("product")  # This populates the linked product
            all_news.append(news)
    return all_news