from beanie import Document # type:ignore
from beanie.odm.fields import Link # type:ignore
from datetime import datetime, timezone
from pydantic import Field
from typing import Optional, List
from backend.models.user_model import User
from decimal import Decimal

class Product(Document):
  name: str
  description: Optional[str] = None
  image: Optional[str] = None
  category: Optional[str] = None
  tags: Optional[List[str]] = Field(default_factory=list)
  subscribers: Optional[List[Link[User]]] = Field(default_factory=list)
  created_at: datetime = Field(default_factory = lambda : datetime.now(timezone.utc))
  updated_at: datetime = Field(default_factory = lambda : datetime.now(timezone.utc))
  
  async def save(self, *args, **kwargs):
    self.updated_at = datetime.now(timezone.utc)
    return await super().save(*args, **kwargs)
  
  class Settings:
    name = "products"