from fastapi import HTTPException 
# from fastapi.encoders import jsonable_encoder 
from fastapi.responses import JSONResponse 

from backend.controllers.admin_controllers import get_admin
from backend.controllers.customer_controllers import get_customer
from backend.controllers.store_owner_controllers import get_store_owner
from backend.models import StoreOwner, Customer
from jose import jwt 
from backend.utils.token import gen_refresh_token
from backend.utils.token import gen_access_token
from passlib.context import CryptContext
import os
from backend.models.user_model import User
from backend.models.admin_model import Admin


pass_context = CryptContext(schemes="bcrypt", deprecated="auto")

# veteran
async def register(user: User):
  print(f"inside register : user = {user}")  # debugging log
  try:
    does_exist = bool(await StoreOwner.find_one({
      "$or": [
        {"username": user.username},
        {"email": user.email}
      ]
    })) or bool(await Customer.find_one({
      "$or": [
        {"username": user.username},
        {"email": user.email}
      ]
    })) or bool(await Admin.find_one({
      "$or": [
        {"username": user.username},
        {"email": user.email}
      ]
    }))
    if does_exist:
      raise HTTPException(status_code=400, detail="Username or email already in use")
    # based on type account is created below
    if user.account_type == "storeowner":
      await StoreOwner(**user.model_dump(exclude={"id"})).insert()
    elif user.account_type == "client":
      await Customer(**user.model_dump(exclude={"id"})).insert()
    elif user.account_type == "admin":
      await Admin(**user.model_dump(exclude={"id"})).insert()
    else:
      raise HTTPException(status_code=400, detail="Invalid account type. Valid types are 'storeowner' and 'client'")

  except Exception as e:
    print(e)
    raise HTTPException(status_code=400, detail=str(e))
    
  return {"message": "successfully created user"}

async def login(login_data):
  try:
    # Find user across all collections
    user = await Customer.find_one(User.username == login_data.username)
    if not user:
      user = await StoreOwner.find_one(User.username == login_data.username)
    if not user:
      user = await Admin.find_one(User.username == login_data.username)
    if not user:
      raise HTTPException(status_code=404, detail="User not found")
    
    # Verify password
    if not pass_context.verify(login_data.password, user.password):
      raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate tokens
    refresh_token = await gen_refresh_token(str(user.id))
    access_token = await gen_access_token(user)
    
    # Update user's refresh token
    user.refresh_token = refresh_token
    await user.save()
    
    # Set cookie parameters
    max_age = int(os.getenv("COOKIE_MAX_AGE", "3600"))
    secure = os.getenv("ENVIRONMENT", "development") == "production"

    # Create response
    res = JSONResponse(
      content={
        "message": "Login successful",
        "user": {
          "id": str(user.id),
          "username": user.username,
          "email": user.email,
          "account_type": user.account_type,
          "fname": user.fname,
          "lname": user.lname
        }
      },
      headers={"Authorization": f"Bearer {access_token}"}
    )
    
    # Set refresh token cookie
    res.set_cookie(
      key="refreshToken",
      value=refresh_token,
      httponly=True,
      secure=secure,
      samesite="lax",
      max_age=max_age
    )
    
    return res
    
  except HTTPException:
    # Re-raise HTTPExceptions (like 404, 401)
    raise
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

#veteran
async def list_users():
  try:
    customers = await Customer.find_all().to_list()
    store_owners = await StoreOwner.find_all().to_list()
    admins = await Admin.find_all().to_list()
    users = customers + store_owners + admins
    return [user.dict() for user in users]
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

# veteran
async def delete_user(user_id: str):
  user = await Customer.get(user_id)
  if not user:
    user = await StoreOwner.get(user_id)
  if not user:
    user = await Admin.get(user_id)
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  return {"message": "User deleted successfully"} if await user.delete() else {"message": "Failed to delete user"}


#test later
async def dummy_protected_route(user):
  return {"user": user.username}
  
async def refresh_access_token(access_token: str):
  decoded_token = jwt.get_unverified_claims(access_token)

  user = await User.get(decoded_token.get("id"))
  if not user:
    raise HTTPException(status_code=404, detail="No user found. Is this a fabricated token?")

  new_access_token = await gen_access_token(user)

  return JSONResponse(
    content={
      "message": "Successfully refreshed the access token. token in header",
    },
    headers={"Authorization": f"Bearer {new_access_token}"}
  )

# veteran
async def update_user(user_id: str, user_data):
    try:
        user = await get_user_details(user_id)
        for k, v in user_data.model_dump(exclude_unset=True).items():
            setattr(user, k, v)
        await user.save()
        return user
    except HTTPException as e:
        # Re-raise HTTPExceptions (like 404) from get_user_details
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")
# veteran
async def get_user_details(user_id: str):
  print(f"inside get_user_details : user_id = {user_id}")  # debugging log
  user = await get_customer(user_id)
  if not user:
    user = await get_store_owner(user_id)
  if not user:
    user = await get_admin(user_id)
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  return user