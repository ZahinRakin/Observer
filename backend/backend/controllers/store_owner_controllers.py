from fastapi import HTTPException
from backend.models.store_owner_model import StoreOwner
from backend.models.user_model import User

# GET /store-owners
async def get_store_owners():
    return await StoreOwner.find_all().to_list()

async def get_store_owner(store_owner_id: str):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    return owner

async def update_store_owner(store_owner_id: str, data):
    owner = await StoreOwner.get(store_owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Store owner not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(owner, k, v)
    await owner.save()
    return owner

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

async def remove_subscriber(store_owner_id: str, user_id: str):
    owner = await StoreOwner.get(store_owner_id)
    if not owner or not hasattr(owner, 'users'):
        raise HTTPException(status_code=404, detail="Store owner or user list not found")
    owner.users = [u for u in owner.users if str(u.id) != user_id]
    await owner.save()
    return owner
