from typing import List, Optional
from .store_model import Store
from backend.models.user_model import User
from pydantic import Field


class StoreOwner(User):
  stores: Optional[List[str]] = Field(default_factory=list)  # Store IDs as strings
  class Settings:
    name = "storeowners"