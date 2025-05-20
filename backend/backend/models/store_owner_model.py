from beanie.odm.fields import Link # type:ignore
from typing import List, Optional
from .store_model import Store
from backend.models.user_model import User
from pydantic import Field


class StoreOwner(User):
  stores: Optional[List[Link[Store]]] = Field(default_factory=List)
  class Settings:
    name = "storeowners"