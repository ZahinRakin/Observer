from fastapi import APIRouter
from backend.controllers.customer_controllers import (
    get_all_customers,
    get_customer
)


router = APIRouter()

@router.get("/")
async def list_customers():
    return await get_all_customers()

@router.get("/{customer_id}")
async def get_customer_route(customer_id: str):
    return await get_customer(customer_id)



# @router.post("/")
# async def create_customer_route(customer: Customer = Body(...)):
#     return await create_customer(customer)

# @router.put("/{customer_id}")
# async def update_customer_route(customer_id: str, customer: Customer = Body(...)):
#     return await update_customer(customer_id, customer)

# @router.delete("/{customer_id}")
# async def delete_customer_route(customer_id: str):
#     return await delete_customer(customer_id)

# @router.post("/{customer_id}/subscribe/{product_id}")
# async def subscribe_route(customer_id: str, product_id: str):
#     return await subscribe(customer_id, product_id)

# @router.delete("/{customer_id}/unsubscribe/{product_id}")
# async def unsubscribe_route(customer_id: str, product_id: str):
#     return await unsubscribe(customer_id, product_id)

# @router.get("/{customer_id}/search")
# async def search_products_route(customer_id: str, query: str = Query(...)):
#     return await search_products_for_customer(customer_id, query)
