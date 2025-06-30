from fastapi import HTTPException
from backend.models.store_model import Store

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

