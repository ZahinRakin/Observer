from backend.models.user_model import User
from backend.models.customer_model import Customer
from fastapi import HTTPException


async def notifiy_me(product_id: str, user_id: str, title: str, description: str):
  try:
    await Notification(
      product=product_id,
      receiver=user_id,
      title=title,
      description=description
    ).insert()
  except Exception as e:
    print(f"inside notifyme. Error: {e}")

async def get_customer(customer_id: str):
    customer = await Customer.get(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer