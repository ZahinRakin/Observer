from beanie import Document # type:ignore
from datetime import datetime, timezone
from pydantic import Field
from typing import Optional

class News(Document):
  product: str  # Product ID as string
  title: str
  description: str
  author_id: Optional[str] = None  # Made optional for backward compatibility
  author_name: Optional[str] = None  # Made optional for backward compatibility
  created_at: datetime = Field(default_factory=lambda : datetime.now(timezone.utc))
  updated_at: datetime = Field(default_factory = lambda : datetime.now(timezone.utc))
  
  async def save(self, *args, **kwargs):
    self.updated_at = datetime.now(timezone.utc)
    return await super().save(*args, **kwargs)
  
  class Settings:
    name = "news"