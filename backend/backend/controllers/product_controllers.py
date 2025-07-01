from fastapi import HTTPException
from backend.models.product_model import Product


async def get_all_products():
    return await Product.find_all().to_list()

async def get_product(product_id: str):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

async def create_product(product_data):
    product = Product(**product_data.model_dump())
    await product.insert()
    return product

async def update_product(product_id: str, product_data):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for k, v in product_data.model_dump(exclude_unset=True).items():
        setattr(product, k, v)
    await product.save()
    return product

async def delete_product(product_id: str):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await product.delete()
    return {"message": "Product deleted"}

async def search_product(query: str):
    # Search for products where the title contains the query (case-insensitive)
    products = await Product.find({"title": {"$regex": query, "$options": "i"}}).to_list()
    if not products:
        raise HTTPException(status_code=404, detail="No product with the given query")
    return products

async def subscribe(customer_id: str, product_id: str):
    from backend.controllers.customer_controllers import get_customer
    customer = await get_customer(customer_id)
    product = await get_product(product_id)
    if not customer or not product:
        raise HTTPException(status_code=404, detail="Customer or Product not found")

    # Ensure lists are initialized
    if customer.monitor_products is None:
        customer.monitor_products = []
    if product.subscribers is None:
        product.subscribers = []

    if product not in customer.monitor_products:
        customer.monitor_products.append(product._id)
        await customer.save()
    if customer not in product.subscribers:
        product.subscribers.append(customer._id)
        await product.save()
    return {"message": "Subscribed"}

async def unsubscribe(customer_id: str, product_id: str):
    from backend.controllers.customer_controllers import get_customer
    customer = await get_customer(customer_id)
    product = await get_product(product_id)
    if not customer or not product:
        raise HTTPException(status_code=404, detail="Customer or Product not found")

    if customer.monitor_products is None:
        customer.monitor_products = []
    if product.subscribers is None:
        product.subscribers = []

    # Remove by id
    customer.monitor_products = [p for p in customer.monitor_products if str(p.ref.id) != product_id]
    await customer.save()
    product.subscribers = [u for u in product.subscribers if str(u.ref.id) != customer_id]
    await product.save()
    return {"message": "Unsubscribed"}

