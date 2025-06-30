from backend.models.user_model import User
from backend.models.product_model import Product
from backend.models.notification_model import Notification
from backend.models.customer_model import Customer
from fastapi import HTTPException
from backend.utils.crud_utils import (
    get_all_customers as shared_get_all_customers,
    get_customer as shared_get_customer,
    create_customer as shared_create_customer,
    update_customer as shared_update_customer,
    delete_customer as shared_delete_customer
)

get_all_customers = shared_get_all_customers
get_customer = shared_get_customer
create_customer = shared_create_customer
update_customer = shared_update_customer
delete_customer = shared_delete_customer

async def subscribe(customer_id: str, product_id: str):
    customer = await get_customer(customer_id)
    if not customer or not product:
        raise HTTPException(status_code=404, detail="Customer or Product not found")
    if product not in customer.monitor_products:
        customer.monitor_products.append(product)
        await customer.save()
    if customer not in product.subscribers:
        product.subscribers.append(customer)
        await product.save()
    return {"message": "Subscribed"}

async def unsubscribe(customer_id: str, product_id: str):
    customer = await get_customer(customer_id)
    if not customer or not product:
        raise HTTPException(status_code=404, detail="Customer or Product not found")
    customer.monitor_products = [p for p in customer.monitor_products if str(p.id) != product_id]
    await customer.save()
    product.subscribers = [u for u in product.subscribers if str(u.id) != customer_id]
    await product.save()
    return {"message": "Unsubscribed"}

async def search_products_for_customer(customer_id: str, query: str):
    customer = await get_customer(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    # Simple search by product name in monitored products
    results = []
    for product in customer.monitor_products:
        prod = await Product.get(product.id)
        if prod and query.lower() in prod.name.lower():
            results.append(prod)
    return results

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

