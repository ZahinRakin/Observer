from fastapi import APIRouter, Body
from backend.models.notification_model import Notification
from backend.controllers.notification_controllers import (
    get_notifications,
    get_notification,
    send_notification,
    mark_notification_read,
    get_notification_sound
)

router = APIRouter()

@router.get("/")
async def list_notifications():
    return await get_notifications()

@router.get("/download-notification-sound")
async def notification_sound_route():
    return await get_notification_sound()

@router.post("/send")
async def send_notification_route(notification: Notification = Body(...)):
    return await send_notification(notification)

@router.get("/{notification_id}")
async def get_notification_route(notification_id: str):
    return await get_notification(notification_id)

@router.put("/{notification_id}/mark-read")
async def mark_read_route(notification_id: str):
    return await mark_notification_read(notification_id)



