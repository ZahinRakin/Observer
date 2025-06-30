from beanie import Document # type:ignore
from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime, timezone
from passlib.context import CryptContext # type: ignore

pass_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Document):
  fname: str
  lname: str
  email: EmailStr
  username: str
  password: str
  account_type: str  # "client", "storeowner".
  avatar: Optional[str] = None
  cover_image: Optional[str] = None
  refresh_token: Optional[str] = None
  created_at: datetime = Field(default_factory=lambda : datetime.now(timezone.utc))
  updated_at: datetime = Field(default_factory=lambda : datetime.now(timezone.utc))
    
  async def insert(self, *args, **kwargs):
    if not pass_context.identify(self.password):
      self.password = pass_context.hash(self.password)
    return await super().insert(*args, **kwargs)
  
  async def save(self, *args, **kwargs):
    if not pass_context.identify(self.password):
      self.password = pass_context.hash(self.password)
    self.updated_at = datetime.now(timezone.utc)
    return await super().save(*args, **kwargs)
  
  def __init_subclass__(cls, **kwargs):
    if cls.__name__ == "AbstractBaseModel":
      raise TypeError("AbstractBaseModel is abstract and cannot be used directly")
    super().__init_subclass__(**kwargs)
  

  class Settings:
    name = None  