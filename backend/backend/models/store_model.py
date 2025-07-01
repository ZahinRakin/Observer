from beanie import Document # type:ignore
from beanie.odm.fields import Link # type:ignore
from typing import List, Optional
from pydantic import Field

from .product_model import Product


class Store(Document):
  name: str
  description: str
  image: Optional[str] = None
  location: Optional[str] = None
  phone: Optional[str] = None
  email: Optional[str] = None
  website: Optional[str] = None
  facebook: Optional[str] = None
  instagram: Optional[str] = None
  products: Optional[List[Link[Product]]] = Field(default_factory=list)
  
  class Settings:
    name = "stores"