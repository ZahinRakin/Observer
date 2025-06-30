from fastapi import HTTPException
from backend.models.news_model import News
from backend.utils.crud_utils import (
    get_all_news as shared_get_all_news,
    get_news as shared_get_news,
    create_news as shared_create_news,
    update_news as shared_update_news,
    delete_news as shared_delete_news
)

get_all_news = shared_get_all_news
get_news = shared_get_news
create_news = shared_create_news
update_news = shared_update_news
delete_news = shared_delete_news

async def get_all_news():
    return await News.find_all().to_list()

async def get_news(news_id: str):
    news = await News.get(news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

async def create_news(news_data):
    news = News(**news_data.model_dump())
    await news.insert()
    return news

async def update_news(news_id: str, news_data):
    news = await News.get(news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    for k, v in news_data.model_dump(exclude_unset=True).items():
        setattr(news, k, v)
    await news.save()
    return news

async def delete_news(news_id: str):
    news = await News.get(news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    await news.delete()
    return {"message": "News deleted"}

