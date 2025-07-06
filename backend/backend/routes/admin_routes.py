from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from backend.controllers.admin_controllers import (
    get_all_admins,
    get_admin,
    create_admin,
    update_admin,
    delete_admin
)
from backend.controllers.user_controllers import list_users, delete_user, get_user_details
# from backend.controllers.settings_controllers import get_system_settings, update_system_settings
# from backend.controllers.activity_controllers import get_recent_activities, get_activity_statistics
from backend.controllers.store_controllers import get_all_stores, get_store
from backend.controllers.product_controllers import get_all_products
# from backend.middlewares.auth import get_user

router = APIRouter()

# Request/Response Models
class AdminCreateRequest(BaseModel):
    user_id: str

class AdminUpdateRequest(BaseModel):
    user_id: Optional[str] = None

class SystemSettings(BaseModel):
    siteName: str
    siteDescription: str
    maintenanceMode: bool
    allowRegistration: bool
    emailNotifications: bool
    maxProductsPerStore: int
    maxStoresPerOwner: int
    sessionTimeout: int

class UserUpdateRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    status: Optional[str] = None
    role: Optional[str] = None

class DashboardStats(BaseModel):
    totalUsers: int
    activeStores: int
    totalProducts: int
    recentActivity: List[dict]

# System Settings Routes
# @router.get("/settings", tags=["admin"])
# async def get_system_settings_route():
#     """Get current system settings"""
#     try:
#         return await get_system_settings()
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.put("/settings", tags=["admin"])
# async def update_system_settings_route(settings: SystemSettings):
#     """Update system settings"""
#     try:
#         updated_settings = await update_system_settings(settings.model_dump())
#         return {"message": "Settings updated successfully", "settings": updated_settings}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# Admin CRUD Routes
@router.get("/", tags=["admin"])
async def list_admins():
    """Get all admin users"""
    return await get_all_admins()

@router.get("/{admin_id}", tags=["admin"])
async def get_admin_route(admin_id: str):
    """Get a specific admin by ID"""
    return await get_admin(admin_id)

@router.post("/", tags=["admin"])
async def create_admin_route(admin: AdminCreateRequest):
    """Create a new admin user"""
    return await create_admin(admin)

@router.put("/{admin_id}", tags=["admin"])
async def update_admin_route(admin_id: str, admin: AdminUpdateRequest):
    """Update an admin user"""
    return await update_admin(admin_id, admin)

@router.delete("/{admin_id}", tags=["admin"])
async def delete_admin_route(admin_id: str):
    """Delete an admin user"""
    return await delete_admin(admin_id)

# User Management Routes
# @router.get("/users/all", tags=["admin"])
# async def get_all_users():
#     """Get all users (customers, store owners, admins)"""
#     try:
#         return await list_users()
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/users/{user_id}", tags=["admin"])
# async def get_user_by_id(user_id: str):
#     """Get a specific user by ID"""
#     try:
#         user = await get_user_details(user_id)
#         if not user:
#             raise HTTPException(status_code=404, detail="User not found")
#         return user
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.put("/users/{user_id}", tags=["admin"])
# async def update_user(user_id: str, user_data: UserUpdateRequest):
#     """Update a user's information"""
#     try:
#         # TODO: Implement user update logic in user_controllers
#         # This would update user details like status, role, etc.
#         return {"message": "User updated successfully", "user_id": user_id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.delete("/users/{user_id}", tags=["admin"])
# async def delete_user_route(user_id: str):
#     """Delete a user"""
#     try:
#         result = await delete_user(user_id)
#         if result:
#             return {"message": "User deleted successfully"}
#         else:
#             raise HTTPException(status_code=404, detail="User not found")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/users/{user_id}/activate", tags=["admin"])
# async def activate_user(user_id: str):
#     """Activate a user account"""
#     try:
#         # TODO: Implement user activation logic
#         return {"message": "User activated successfully", "user_id": user_id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/users/{user_id}/deactivate", tags=["admin"])
# async def deactivate_user(user_id: str):
#     """Deactivate a user account"""
#     try:
#         # TODO: Implement user deactivation logic
#         return {"message": "User deactivated successfully", "user_id": user_id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# features to be developed later.
# Dashboard Statistics Routes
@router.get("/dashboard/stats", tags=["admin"])
async def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        # Get actual data from database
        users = await list_users()
        stores = await get_all_stores()
        products = await get_all_products()
        # activities = await get_recent_activities(limit=5)
        
        stats = {
            "totalUsers": len(users) if users else 0,
            "activeStores": len(stores) if stores else 0,
            "totalProducts": len(products) if products else 0,
            # "recentActivity": [
            #     {
            #         "type": activity.activity_type,
            #         "message": activity.description,
            #         "timestamp": activity.created_at.isoformat(),
            #         "status": activity.level
            #     } for activity in activities
            # ] if activities else []
        }
        print(f"Dashboard stats: {stats}") # debugging log
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.get("/dashboard/activity", tags=["admin"])
# async def get_recent_activity(limit: int = 10):
#     """Get recent system activity"""
#     try:
#         activities = await get_recent_activities(limit=limit)
#         return activities
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# System Health Routes
# +

# the following routes are not needed.
# Store Management Routes (Admin can manage all stores)
# @router.get("/stores/all", tags=["admin"])
# async def get_all_stores_admin():
#     """Get all stores (admin view)"""
#     try:
#         stores = await get_all_stores()
#         return stores
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/stores/{store_id}", tags=["admin"])
# async def get_store_admin(store_id: str):
#     """Get a specific store (admin view)"""
#     try:
#         store = await get_store(store_id)
#         if not store:
#             raise HTTPException(status_code=404, detail="Store not found")
#         return store
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # Product Management Routes (Admin can manage all products)
# @router.get("/products/all", tags=["admin"])
# async def get_all_products_admin():
#     """Get all products (admin view)"""
#     try:
#         products = await get_all_products()
#         return products
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))