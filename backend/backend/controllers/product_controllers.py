from fastapi import HTTPException
from backend.models.product_model import Product
from backend.utils.crud_utils import (
    get_all_products as shared_get_all_products,
    get_product as shared_get_product,
    create_product as shared_create_product,
    update_product as shared_update_product,
    delete_product as shared_delete_product
)

get_all_products = shared_get_all_products
get_product = shared_get_product
create_product = shared_create_product
update_product = shared_update_product
delete_product = shared_delete_product

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

