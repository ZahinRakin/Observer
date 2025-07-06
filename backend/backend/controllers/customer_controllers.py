from backend.models.customer_model import Customer
from backend.models.news_model import News
from fastapi import HTTPException
from backend.controllers.notification_controllers import send_notification
from backend.models.product_model import Product

async def notifiy_me(product_id: str, user_id: str, title: str, description: str):
  from backend.controllers.user_controllers import get_user_details
  from backend.controllers.product_controllers import get_product

  user = await get_user_details(user_id)
  product = await get_product(product_id)
  notification_data = {
    "product": product,
    "receiver": user,
    "title": title,
    "description": description
  }
  return await send_notification(notification_data)

async def get_customer(customer_id: str):
    customer = await Customer.get(customer_id)
    return customer

async def get_all_customers():
  customers = await Customer.find_all().to_list()
  return customers

async def update_customer(customer_id: str, customer_data):
    try:
        customer = await Customer.get(customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Update only the fields that were explicitly set in the request
        update_data = customer_data.model_dump(exclude_unset=True)
        
        # Validate that we have at least one field to update
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields provided for update")
        
        # Update only the provided fields
        for field_name, field_value in update_data.items():
            setattr(customer, field_name, field_value)
        
        # Save the updated customer
        await customer.save()
        return customer
        
    except HTTPException:
        # Re-raise HTTPExceptions (like 404, 400)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating customer: {str(e)}")


