from datetime import datetime, timezone
from beanie import Document # type:ignore
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
  products: Optional[List[str]] = Field(default_factory=list)  # Product IDs as strings
  created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
  updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
  
  class Settings:
    name = "stores"