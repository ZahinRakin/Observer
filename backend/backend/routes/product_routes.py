from fastapi import APIRouter, Body
from backend.models.product_model import Product
from backend.controllers.product_controllers import (
    get_all_products,
    get_product,
    create_product,
    update_product,
    delete_product
)

router = APIRouter()

@router.get("")
async def list_products():
    return await get_all_products()

@router.get("/{product_id}")
async def get_product_route(product_id: str):
    return await get_product(product_id)

@router.post("")
async def create_product_route(product: Product = Body(...)):
    return await create_product(product)

@router.put("/{product_id}")
async def update_product_route(product_id: str, product: Product = Body(...)):
    return await update_product(product_id, product)

@router.delete("/{product_id}")
async def delete_product_route(product_id: str):
    return await delete_product(product_id)
