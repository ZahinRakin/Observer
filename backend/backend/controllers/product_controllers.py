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

