from fastapi import HTTPException
from backend.models.product_model import Product
from backend.models.news_model import News
from backend.models.store_model import Store
from backend.models.customer_model import Customer
from backend.models.notification_model import Notification

# Product CRUD
async def get_all_products():
    return await Product.find_all().to_list()

async def get_product(product_id: str):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

async def create_product(product_data):
    product = Product(**product_data.model_dump())
    await product.insert()
    return product

async def update_product(product_id: str, product_data):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for k, v in product_data.model_dump(exclude_unset=True).items():
        setattr(product, k, v)
    await product.save()
    return product

async def delete_product(product_id: str):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await product.delete()
    return {"message": "Product deleted"}

# News CRUD
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

# Store CRUD
async def get_all_stores():
    return await Store.find_all().to_list()

async def get_store(store_id: str):
    store = await Store.get(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store

async def create_store(store_data):
    store = Store(**store_data.model_dump())
    await store.insert()
    return store

async def update_store(store_id: str, store_data):
    store = await Store.get(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    for k, v in store_data.model_dump(exclude_unset=True).items():
        setattr(store, k, v)
    await store.save()
    return store

async def delete_store(store_id: str):
    store = await Store.get(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    await store.delete()
    return {"message": "Store deleted"}

# Customer CRUD
async def get_all_customers():
    return await Customer.find_all().to_list()

async def get_customer(customer_id: str):
    customer = await Customer.get(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

async def create_customer(customer_data):
    customer = Customer(**customer_data.model_dump())
    await customer.insert()
    return customer

async def update_customer(customer_id: str, customer_data):
    customer = await Customer.get(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    for k, v in customer_data.model_dump(exclude_unset=True).items():
        setattr(customer, k, v)
    await customer.save()
    return customer

async def delete_customer(customer_id: str):
    customer = await Customer.get(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    await customer.delete()
    return {"message": "Customer deleted"}

# Notification CRUD
async def get_all_notifications():
    return await Notification.find_all().to_list()

async def get_notification(notification_id: str):
    notification = await Notification.get(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

async def send_notification(notification_data):
    notification = Notification(**notification_data.model_dump())
    await notification.insert()
    return notification

async def delete_notification(notification_id: str):
    notification = await Notification.get(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    await notification.delete()
    return {"message": "Notification deleted"} 