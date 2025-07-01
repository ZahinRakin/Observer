from fastapi import HTTPException
from backend.models.store_owner_model import StoreOwner
from backend.models.user_model import User

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

    
