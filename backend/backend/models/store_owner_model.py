from beanie import Document # type:ignore
from beanie.odm.fields import Link # type:ignore
from typing import List, Optional
from .store_model import Store
from backend.models.user_model import User


class StoreOwner(Document):
  user: Link[User]
  email_password: str
  stores: Optional[List[Link[Store]]] = None
  
  class Settings:
    name = "storeowners"