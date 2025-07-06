from fastapi import HTTPException
from backend.models.store_owner_model import StoreOwner
from backend.models.user_model import User
from backend.models.store_model import Store
from backend.models.product_model import Product
from backend.models.news_model import News
from beanie.odm.fields import Link
from typing import Dict, Any, Optional, Union, List
from datetime import datetime, timedelta

# Helper function to safely add products to store
async def add_product_to_store(store: Store, product: Product) -> None:
    """Safely add a product to a store's products list"""
    # Ensure products list is initialized
    if not store.products:
        store.products = []
    
    # Clean up any invalid product IDs
    if store.products:
        cleaned_products = []
        for product_id in store.products:
            try:
                # Verify the product exists
                product_obj = await Product.get(product_id)
                if product_obj:
                    cleaned_products.append(product_id)
                else:
                    print(f"Skipping invalid product ID: {product_id}")
            except Exception as e:
                print(f"Error fetching product, skipping: {e}")
                continue
        store.products = cleaned_products
    
    # Add the product ID to the store's products list
    if not product.id:
        raise ValueError("Product must be saved before adding to store")
    store.products.append(str(product.id))  # type: ignore

# Helper function to convert models to dict for JSON serialization
def model_to_dict(obj) -> Union[Dict[str, Any], str]:
    """Convert a Beanie model to a dictionary, handling DBRef objects"""
    if hasattr(obj, 'model_dump'):
        # Use model_dump for Pydantic v2 models
        data = obj.model_dump()
        # Ensure ID is included
        if hasattr(obj, 'id'):
            data['id'] = str(obj.id)
        
        # Handle Link objects in the data
        for key, value in data.items():
            if hasattr(value, 'ref') and hasattr(value, 'collection'):  # This is a Link/DBRef object
                # Convert Link to string ID
                data[key] = str(value.ref.id) if hasattr(value.ref, 'id') else str(value.ref)
            elif isinstance(value, list):
                # Handle lists that might contain Link objects
                for i, item in enumerate(value):
                    if hasattr(item, 'ref') and hasattr(item, 'collection'):
                        value[i] = str(item.ref.id) if hasattr(item.ref, 'id') else str(item.ref)
        
        return data
    elif hasattr(obj, 'dict'):
        # Use dict for Pydantic v1 models
        data = obj.dict()
        # Ensure ID is included
        if hasattr(obj, 'id'):
            data['id'] = str(obj.id)
        return data
    else:
        # Fallback for other objects
        if hasattr(obj, '__dict__'):
            data = obj.__dict__.copy()
            # Ensure ID is included
            if hasattr(obj, 'id'):
                data['id'] = str(obj.id)
            return data
        else:
            return str(obj)

# GET /store-owners
async def get_store_owners():
    store_owners = await StoreOwner.find_all().to_list()
    return [model_to_dict(owner) for owner in store_owners]

async def get_store_owner(store_owner_id: str):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    return model_to_dict(owner)

async def update_store_owner(store_owner_id: str, data):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(owner, k, v)
    await owner.save()
    return model_to_dict(owner)

async def get_stores(store_owner_id: str):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    if not owner.stores:
        return []
    
    # Fetch all stores and convert to dictionaries
    stores = []
    for store_id in owner.stores:
        try:
            store = await Store.get(store_id)
            if store and isinstance(store, Store):
                # Convert store to dict and ensure products field is handled properly
                store_dict_result = model_to_dict(store)
                
                # Ensure we have a dictionary
                if isinstance(store_dict_result, dict):
                    store_dict = store_dict_result
                    
                    # Products are now string IDs, so they should be valid
                    if 'products' in store_dict and store_dict['products']:
                        # Verify all product IDs are valid
                        valid_products = []
                        for product_id in store_dict['products']:
                            try:
                                product = await Product.get(product_id)
                                if product:
                                    valid_products.append(product_id)
                            except Exception:
                                print(f"Invalid product ID in store {store.id}: {product_id}")
                        store_dict['products'] = valid_products
                    
                    stores.append(store_dict)
                else:
                    print(f"Store {store.id} could not be converted to dict, skipping")
                    continue
        except Exception as e:
            print(f"Error fetching store: {e}")
            continue
    
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
    products_this_week = 0
    news_this_week = 0
    now = datetime.now()
    start_of_week = now - timedelta(days=now.weekday())
    current_month = now.month

    if owner.stores:
        for store_id in owner.stores:
            try:
                store = await Store.get(store_id)
                if store and isinstance(store, Store):
                    stores.append(store)

                    if store.products:
                        for product_id in store.products:
                            try:
                                product = await Product.get(product_id)
                                if product and isinstance(product, Product):
                                    total_products += 1

                                    if product.created_at and start_of_week.date() <= product.created_at.date() <= now.date():
                                        products_this_week += 1

                                    all_news = News.find({"product": product_id})
                                    total_news += await all_news.count()

                                    async for news_item in all_news:
                                        if news_item.created_at and start_of_week.date() <= news_item.created_at.date() <= now.date():
                                            news_this_week += 1
                            except Exception as e:
                                print(f"Error fetching product: {e}")
                                continue
            except Exception as e:
                print(f"Error fetching store: {e}")
                continue

    stores_this_month = len([
        s for s in stores
        if s.created_at and s.created_at.month == current_month
    ])

    result = {
        "total_stores": len(stores),
        "total_products": total_products,
        "total_news": total_news,
        "stores_this_month": stores_this_month,
        "products_this_week": products_this_week,
        "news_this_week": news_this_week,
        "business_status": "active",
        "stores_managed": len(stores)
    }
    print(result) # debugging log
    return result

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
    
    owner.stores.append(str(store.id)) # type: ignore
    await owner.save()
    
    return model_to_dict(store)

async def update_store_for_owner(store_owner_id: str, store_id: str, store_data):
    """Update a store that belongs to the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Verify the store belongs to this owner
    store_belongs_to_owner = False
    if owner.stores:
        store_belongs_to_owner = store_id in owner.stores
    
    if not store_belongs_to_owner:
        raise HTTPException(status_code=403, detail="Store does not belong to this owner")
    
    # Update the store
    store = await Store.get(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    for k, v in store_data.model_dump(exclude_unset=True).items():
        setattr(store, k, v)
    await store.save()
    
    # Convert store to dict and handle DBRef objects safely
    store_dict_result = model_to_dict(store)
    
    if isinstance(store_dict_result, dict):
        store_dict = store_dict_result
        
        # If products field contains DBRef objects, replace with empty array
        if 'products' in store_dict and store_dict['products']:
            try:
                import json
                json.dumps(store_dict['products'])
            except (TypeError, ValueError):
                print(f"Found invalid products in updated store {store.id}, replacing with empty array")
                store_dict['products'] = []
        
        return store_dict
    else:
        # Fallback: return basic store info without products
        return {
            'id': str(store.id),
            'name': store.name,
            'description': store.description,
            'location': store.location,
            'phone': store.phone,
            'email': store.email,
            'website': store.website,
            'facebook': store.facebook,
            'instagram': store.instagram,
            'products': []
        }

async def delete_store_for_owner(store_owner_id: str, store_id: str):
    """Delete a store that belongs to the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Verify the store belongs to this owner
    store_belongs_to_owner = False
    store_to_remove = None
    if owner.stores:
        if store_id in owner.stores:
            store_belongs_to_owner = True
            store_to_remove = owner.stores.index(store_id)
    
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
    if owner.stores and store_id in owner.stores:
        store_belongs_to_owner = True
        target_store = await Store.get(store_id)
    
    if not store_belongs_to_owner:
        raise HTTPException(status_code=403, detail="Store does not belong to this owner")
    
    # Get products from the store
    products = []
    if target_store and hasattr(target_store, 'products') and target_store.products:
        for product_id in target_store.products:
            try:
                product = await Product.get(product_id)
                if product and isinstance(product, Product):
                    product_dict_result = model_to_dict(product)
                    if isinstance(product_dict_result, dict):
                        products.append(product_dict_result)
                    else:
                        print(f"Product {product.id} could not be converted to dict, skipping")
            except Exception as e:
                print(f"Error fetching product: {e}")
                continue
    
    return products

async def create_product_for_store(store_owner_id: str, store_id: str, product_data):
    """Create a new product for a store owned by the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Verify the store belongs to this owner
    store_belongs_to_owner = False
    target_store = None
    if owner.stores and store_id in owner.stores:
        store_belongs_to_owner = True
        target_store = await Store.get(store_id)
    
    if not store_belongs_to_owner:
        raise HTTPException(status_code=403, detail="Store does not belong to this owner")
    
    # Create the product
    product = Product(**product_data.model_dump())
    await product.insert()
    
    # Add product to store's products list
    if target_store and isinstance(target_store, Store):
        await add_product_to_store(target_store, product)
        await target_store.save()
    
    # Convert product to dict safely
    product_dict_result = model_to_dict(product)
    if isinstance(product_dict_result, dict):
        return product_dict_result
    else:
        # Fallback: return basic product info
        return {
            'id': str(product.id),
            'name': product.name,
            'description': product.description,
            'image': product.image,
            'category': product.category,
            'tags': product.tags or []
        }

async def delete_product_for_store(store_owner_id: str, store_id: str, product_id: str):
    """Delete a product from a store owned by the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    # Verify the store belongs to this owner
    store_belongs_to_owner = False
    target_store = None
    if owner.stores and store_id in owner.stores:
        store_belongs_to_owner = True
        target_store = await Store.get(store_id)
    
    if not store_belongs_to_owner:
        raise HTTPException(status_code=403, detail="Store does not belong to this owner")
    
    # Verify the product belongs to this store
    product_belongs_to_store = False
    product_to_remove = None
    if target_store and hasattr(target_store, 'products') and target_store.products:
        if product_id in target_store.products:
            product_belongs_to_store = True
            product_to_remove = target_store.products.index(product_id)
    
    if not product_belongs_to_store:
        raise HTTPException(status_code=403, detail="Product does not belong to this store")
    
    # Remove product from store's products list
    if product_to_remove is not None and isinstance(target_store, Store) and target_store.products:
        target_store.products.pop(product_to_remove)
        await target_store.save()
    
    # Delete the product
    product = await Product.get(product_id)
    if product:
        await product.delete()
    
    return {"message": "Product deleted successfully"}

# News Management
async def get_store_owner_news(store_owner_id: str):
    """Get all news published by the store owner"""
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    
    news = await News.find({"author_id": store_owner_id}).to_list()
    return [model_to_dict(news_item) for news_item in news]

async def create_news_for_store_owner(store_owner_id: str, news_data):
    """Create a new news article for the store owner"""
    try:
        print(f"🔍 DEBUG - Controller received store_owner_id: {store_owner_id}")
        print(f"🔍 DEBUG - Controller received news_data: {news_data}")
        print(f"🔍 DEBUG - News data model dump: {news_data.model_dump()}")
        
        owner = await StoreOwner.get(store_owner_id)
        if not owner:
            raise HTTPException(status_code=404, detail="Store owner not found")
        
        print(f"🔍 DEBUG - Found owner: {owner.username}")
        
        # Verify the product exists and get it as a Link
        product_id = news_data.product
        print(f"🔍 DEBUG - Product ID from news_data: {product_id}")
        product = await Product.get(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        print(f"🔍 DEBUG - Found product: {product.name}")
        
        # Create news with all required fields
        # Pass the product ID as string - the model now accepts string IDs
        news = News(
            product=product_id,  # Pass as string, model accepts this now
            title=news_data.title,
            description=news_data.description,
            author_id=store_owner_id,
            author_name=owner.username
        )
        print(f"🔍 DEBUG - Created news object: {news}")
        await news.insert()
        print(f"🔍 DEBUG - News inserted successfully")
        
        # Create a clean response without Link objects
        result = {
            'id': str(news.id),
            'product': product_id,  # Use the original product ID string
            'title': news.title,
            'description': news.description,
            'author_id': news.author_id,
            'author_name': news.author_name,
            'created_at': news.created_at,
            'updated_at': news.updated_at
        }
        print(f"🔍 DEBUG - Returning clean result: {result}")
        return result
        
    except Exception as e:
        print(f"❌ ERROR in create_news_for_store_owner: {e}")
        print(f"❌ ERROR type: {type(e)}")
        import traceback
        print(f"❌ ERROR traceback: {traceback.format_exc()}")
        raise