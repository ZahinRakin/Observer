from beanie import Document
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ActivityType(str, Enum):
    USER_LOGIN = "user_login"
    USER_LOGOUT = "user_logout"
    USER_CREATED = "user_created"
    USER_UPDATED = "user_updated"
    USER_DELETED = "user_deleted"
    STORE_CREATED = "store_created"
    STORE_UPDATED = "store_updated"
    STORE_DELETED = "store_deleted"
    PRODUCT_CREATED = "product_created"
    PRODUCT_UPDATED = "product_updated"
    PRODUCT_DELETED = "product_deleted"
    SETTINGS_UPDATED = "settings_updated"
    SYSTEM_MAINTENANCE = "system_maintenance"

class ActivityLevel(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"

class ActivityLog(Document):
    activity_type: ActivityType
    user_id: Optional[str] = None
    username: Optional[str] = None
    description: str
    details: Optional[Dict[str, Any]] = None
    level: ActivityLevel = ActivityLevel.INFO
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime = datetime.utcnow()
    
    class Settings:
        name = "activity_logs"
        indexes = [
            "activity_type",
            "user_id", 
            "created_at",
            "level"
        ]
    
    class Config:
        schema_extra = {
            "example": {
                "activity_type": "user_login",
                "user_id": "user123",
                "username": "john_doe",
                "description": "User logged in successfully",
                "level": "info",
                "ip_address": "192.168.1.1",
                "user_agent": "Mozilla/5.0..."
            }
        } 