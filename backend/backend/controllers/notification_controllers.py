from fastapi import HTTPException
from backend.models.notification_model import Notification
from typing import Optional


async def get_notifications():
    return await Notification.find_all().to_list()

async def get_notification(notification_id: str):
    notification = await Notification.get(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

async def send_notification(notification_data):
    notification = Notification(**notification_data.model_dump())
    await notification.insert()
    return notification

async def mark_notification_read(notification_id: str):
    notification = await get_notification(notification_id)
    # Example: add a 'read' field if not present
    if not hasattr(notification, 'read'):
        setattr(notification, 'read', True)
    else:
        notification.read = True
    await notification.save()
    return notification

async def get_notification_sound(notification_id: str):
    notification = await get_notification(notification_id)
    # Example: return a sound URL or flag (customize as needed)
    return {"sound": "default_notification_sound.mp3", "notification_id": notification_id}

