from backend.models.store_model import Store
from beanie import Document, Link
from typing import Optional, List
from pydantic import Field
from .user_model import User
from backend.models.product_model import Product


class Customer(User):

    class Settings:
        name = "customers"
