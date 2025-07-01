from backend.models.customer_model import Customer
from fastapi import HTTPException
from backend.controllers.notification_controllers import send_notification

async def notifiy_me(product_id: str, user_id: str, title: str, description: str):
  from backend.controllers.user_controllers import get_user_details
  from backend.controllers.product_controllers import get_product

  user = await get_user_details(user_id)
  product = await get_product(product_id)
  return await send_notification(product._id, user._id, title, description)

async def get_customer(customer_id: str):
    customer = await Customer.get(customer_id)
    return customer

async def get_all_customers():
  customers = await Customer.find_all().to_list()
  return customers