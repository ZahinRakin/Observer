from beanie import Document
from typing import Optional
from datetime import datetime

class SystemSettings(Document):
    siteName: str = "Observer Platform"
    siteDescription: str = "A comprehensive store management and customer engagement platform"
    maintenanceMode: bool = False
    allowRegistration: bool = True
    emailNotifications: bool = True
    maxProductsPerStore: int = 1000
    maxStoresPerOwner: int = 5
    sessionTimeout: int = 30
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
    
    class Settings:
        name = "system_settings"
    
    class Config:
        schema_extra = {
            "example": {
                "siteName": "Observer Platform",
                "siteDescription": "A comprehensive store management and customer engagement platform",
                "maintenanceMode": False,
                "allowRegistration": True,
                "emailNotifications": True,
                "maxProductsPerStore": 1000,
                "maxStoresPerOwner": 5,
                "sessionTimeout": 30
            }
        } 