from beanie import Document, Link
from typing import Optional, List
from pydantic import Field
from .user_model import User
from backend.models.product_model import Product


class Customer(User):
    monitor_products: Optional[List[Link[Product]]] = Field(default_factory=list)

    class Settings:
        name = "customers"
