from fastapi import HTTPException
from backend.models.store_owner_model import StoreOwner
from backend.models.user_model import User
from backend.models.store_model import Store
from backend.models.product_model import Product
from backend.models.news_model import News
from typing import Dict, Any
from datetime import datetime, timedelta

# GET /store-owners
async def get_store_owners():
    return await StoreOwner.find_all().to_list()

async def get_store_owner(store_owner_id: str):
    owner = await StoreOwner.get(store_owner_id)
    return owner

async def update_store_owner(store_owner_id: str, data):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(owner, k, v)
    await owner.save()
    return owner

async def get_stores(store_owner_id: str):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    if not owner.stores:
        return []
    # Fetch all linked stores
    stores = []
    for store_link in owner.stores:
        store = await store_link.fetch()
        if store:
            stores.append(store)
    return stores

# Dashboard Statistics
async def get_store_owner_dashboard_stats(store_owner_id: str) -> Dict[str, Any]:
    """Get comprehensive dashboard statistics for a store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Get all stores
    stores = []
    total_products = 0
    total_news = 0
    
    if owner.stores:
        for store_link in owner.stores:
            store = await store_link.fetch()
            if store:
                stores.append(store)
                # Count products in this store
                if hasattr(store, 'products') and store.products:
                    for product_link in store.products:
                        product = await product_link.fetch()
                        if product:
                            total_products += 1
    
    # Count news published by this store owner
    news_count = await News.find({"author_id": store_owner_id}).count()
    
    # Calculate growth metrics (demo data for now)
    current_month = datetime.now().month
    stores_this_month = len([s for s in stores if hasattr(s, 'created_at') and s.created_at and s.created_at.month == current_month])
    products_this_week = total_products // 4  # Demo calculation
    news_this_week = news_count // 2  # Demo calculation
    
    return {
        "total_stores": len(stores),
        "total_products": total_products,
        "total_news": news_count,
        "stores_this_month": stores_this_month,
        "products_this_week": products_this_week,
        "news_this_week": news_this_week,
        "business_status": "active",
        "stores_managed": len(stores)
    }

# Store Management
async def create_store_for_owner(store_owner_id: str, store_data):
    """Create a new store and associate it with the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Create the store
    store = Store(**store_data.model_dump())
    await store.insert()
    
    # Add store to owner's stores list
    if not owner.stores:
        owner.stores = []
    owner.stores.append(store)
    await owner.save()
    
    return store

async def update_store_for_owner(store_owner_id: str, store_id: str, store_data):
    """Update a store that belongs to the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Verify the store belongs to this owner
    store_belongs_to_owner = False
    if owner.stores:
        for store_link in owner.stores:
            store = await store_link.fetch()
            if store and hasattr(store, 'id') and str(store.id) == store_id:
                store_belongs_to_owner = True
                break
    
    if not store_belongs_to_owner:
        raise HTTPException(status_code=403, detail="Store does not belong to this owner")
    
    # Update the store
    store = await Store.get(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    for k, v in store_data.model_dump(exclude_unset=True).items():
        setattr(store, k, v)
    await store.save()
    
    return store

async def delete_store_for_owner(store_owner_id: str, store_id: str):
    """Delete a store that belongs to the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Verify the store belongs to this owner
    store_belongs_to_owner = False
    store_to_remove = None
    if owner.stores:
        for i, store_link in enumerate(owner.stores):
            store = await store_link.fetch()
            if store and hasattr(store, 'id') and str(store.id) == store_id:
                store_belongs_to_owner = True
                store_to_remove = i
                break
    
    if not store_belongs_to_owner:
        raise HTTPException(status_code=403, detail="Store does not belong to this owner")
    
    # Remove store from owner's list
    if store_to_remove is not None and owner.stores:
        owner.stores.pop(store_to_remove)
        await owner.save()
    
    # Delete the store
    store = await Store.get(store_id)
    if store:
        await store.delete()
    
    return {"message": "Store deleted successfully"}

# Product Management
async def get_store_products(store_owner_id: str, store_id: str):
    """Get all products for a specific store owned by the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Verify the store belongs to this owner
    store_belongs_to_owner = False
    target_store = None
    if owner.stores:
        for store_link in owner.stores:
            store = await store_link.fetch()
            if store and hasattr(store, 'id') and str(store.id) == store_id:
                store_belongs_to_owner = True
                target_store = store
                break
    
    if not store_belongs_to_owner:
        raise HTTPException(status_code=403, detail="Store does not belong to this owner")
    
    # Get products from the store
    products = []
    if target_store and hasattr(target_store, 'products') and target_store.products:
        for product_link in target_store.products:
            product = await product_link.fetch()
            if product:
                products.append(product)
    
    return products

async def create_product_for_store(store_owner_id: str, store_id: str, product_data):
    """Create a new product for a store owned by the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Verify the store belongs to this owner
    store_belongs_to_owner = False
    target_store = None
    if owner.stores:
        for store_link in owner.stores:
            store = await store_link.fetch()
            if store and hasattr(store, 'id') and str(store.id) == store_id:
                store_belongs_to_owner = True
                target_store = store
                break
    
    if not store_belongs_to_owner:
        raise HTTPException(status_code=403, detail="Store does not belong to this owner")
    
    # Create the product
    product = Product(**product_data.model_dump())
    await product.insert()
    
    # Add product to store's products list
    if not target_store.products:
        target_store.products = []
    target_store.products.append(product)
    await target_store.save()
    
    return product

# News Management
async def get_store_owner_news(store_owner_id: str):
    """Get all news published by the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    news = await News.find({"author_id": store_owner_id}).to_list()
    return news

async def create_news_for_store_owner(store_owner_id: str, news_data):
    """Create a new news article for the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Add author_id to news data
    news_dict = news_data.model_dump()
    news_dict["author_id"] = store_owner_id
    news_dict["author_name"] = owner.username
    
    news = News(**news_dict)
    await news.insert()
    
    return news

    
