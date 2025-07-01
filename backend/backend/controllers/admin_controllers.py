from fastapi import HTTPException
from backend.models.admin_model import Admin

# Admin CRUD
async def get_all_admins():
    return await Admin.find_all().to_list()

async def get_admin(admin_id: str):
    admin = await Admin.get(admin_id)
    return admin

async def create_admin(admin_data):
    admin = Admin(**admin_data.model_dump())
    await admin.insert()
    return admin

async def update_admin(admin_id: str, admin_data):
    admin = await Admin.get(admin_id)
    if not admin:
        return None
    for k, v in admin_data.model_dump(exclude_unset=True).items():
        setattr(admin, k, v)
    await admin.save()
    return admin

async def delete_admin(admin_id: str):
    admin = await Admin.get(admin_id)
    if not admin:
        return None
    await admin.delete()
    return {"message": "Admin deleted"}
