from fastapi import HTTPException
from backend.models.store_owner_model import StoreOwner
from backend.models.user_model import User
from backend.models.product_model import Product
from backend.models.store_model import Store
from backend.models.news_model import News
from typing import List


async def create_store(store_data):
    print(f"inside create store: {store_data}")  # debugging log
    store = await Store(**store_data.model_dump()).insert()
    return store


async def delete_store(store_id):
    store = await Store.get(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    await store.delete()
    return {"message": "Store deleted successfully"}


async def create_product(product_data):
    print(f"inside create product: {product_data}")  # debugging log
    product = await Product(**product_data.model_dump()).insert()
    return product


async def delete_product(product_id):
    print(f"inside delete product: {product_id}")  # debugging log
    product = await Product.get(product_id)
    if product:
        await product.delete()
        return {"message": "successfully deleted the product."}
    raise HTTPException(status_code=404, detail="product not found")


async def create_news(news_data):
    print(f"inside create news: {news_data}")  # debugging log
    news = await News(**news_data.model_dump()).insert()
    return news


async def delete_news(news_id):
    print(f"inside delete news: {news_id}")  # debugging log
    news = await News.get(news_id)
    if news:
        await news.delete()
        return {"message": "successfully deleted the news"}
    raise HTTPException(status_code=404, detail="news not found")


# GET /store-owners
async def get_store_owners():
    return await StoreOwner.find_all().to_list()


# GET /store-owners/:id
async def get_store_owner(store_owner_id: str):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    return owner


# POST /store-owners
async def create_store_owner(store_owner_data):
    owner = StoreOwner(**store_owner_data.model_dump())
    await owner.insert()
    return owner


# PUT /store-owners/:id
async def update_store_owner(store_owner_id: str, data):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(owner, k, v)
    await owner.save()
    return owner


# DELETE /store-owners/:id
async def delete_store_owner(store_owner_id: str):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    await owner.delete()
    return {"message": "Store owner deleted"}


# POST /store-owners/:id/add-user
async def add_user_to_store_owner(store_owner_id: str, user_id: str):
    owner = await StoreOwner.get(store_owner_id)
    user = await User.get(user_id)
    if not owner or not user:
        raise HTTPException(status_code=404, detail="Store owner or user not found")
    # Example: add user to a list of users (if such a field exists)
    if not hasattr(owner, 'users'):
        owner.users = []
    if user not in owner.users:
        owner.users.append(user)
        await owner.save()
    return owner


# DELETE /store-owners/:id/remove-subscriber/:userId
async def remove_subscriber(store_owner_id: str, user_id: str):
    owner = await StoreOwner.get(store_owner_id)
    if not owner or not hasattr(owner, 'users'):
        raise HTTPException(status_code=404, detail="Store owner or user list not found")
    owner.users = [u for u in owner.users if str(u.id) != user_id]
    await owner.save()
    return owner


# POST /store-owners/:id/create-product
async def create_product_for_owner(store_owner_id: str, product_data):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    product = Product(**product_data.model_dump())
    await product.insert()
    # Optionally link product to owner's store(s)
    return product


# POST /store-owners/:id/create-store
async def create_store_for_owner(store_owner_id: str, store_data):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    store = Store(**store_data.model_dump())
    await store.insert()
    if not hasattr(owner, 'stores'):
        owner.stores = []
    owner.stores.append(store)
    await owner.save()
    return store


# POST /store-owners/:id/publish-news
async def publish_news_for_owner(store_owner_id: str, news_data):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    news = News(**news_data.model_dump())
    await news.insert()
    return news

