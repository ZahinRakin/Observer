from fastapi import HTTPException
from fastapi.responses import FileResponse
from backend.models.notification_model import Notification
from typing import Optional
import os


async def get_notifications():
    try:
        return await Notification.find_all().to_list()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching notifications: {str(e)}")

async def get_notification(notification_id: str):
    try:
        notification = await Notification.get(notification_id)
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        return notification
    except HTTPException:
        # Re-raise HTTPExceptions (like 404)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching notification: {str(e)}")

async def send_notification(notification_data):
    try:
        # Create notification from the provided data
        notification = Notification(**notification_data.model_dump())
        await notification.insert()
        return notification
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating notification: {str(e)}")

async def mark_notification_read(notification_id: str):
    try:
        notification = await get_notification(notification_id)
        notification.read = True
        await notification.save()
        return notification
    except HTTPException:
        # Re-raise HTTPExceptions (like 404)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error marking notification as read: {str(e)}")

async def get_notification_sound():
    try:
        # Define the path to the sound file in the public folder
        # Use absolute path to ensure we're looking in the right place
        current_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(current_dir)  # Go up one level from controllers
        sound_file_path = os.path.join(backend_dir, "public", "notification_sound.mp3")
        
        print(f"Looking for sound file at: {sound_file_path}")  # Debug log
        
        # Check if the file exists
        if not os.path.exists(sound_file_path):
            # Try alternative locations
            alternative_paths = [
                os.path.join("public", "notification_sound.mp3"),
                os.path.join("backend", "public", "notification_sound.mp3"),
                os.path.join(current_dir, "..", "public", "notification_sound.mp3"),
                os.path.join(current_dir, "..", "..", "public", "notification_sound.mp3")
            ]
            
            print(f"Trying alternative paths: {alternative_paths}")  # Debug log
            
            for alt_path in alternative_paths:
                if os.path.exists(alt_path):
                    sound_file_path = alt_path
                    print(f"Found sound file at: {sound_file_path}")  # Debug log
                    break
            else:
                # If file doesn't exist, return a simple response instead of error
                return {
                    "message": "Notification sound file not found",
                    "file_paths_checked": [sound_file_path] + alternative_paths,
                    "instructions": "Please place notification_sound.mp3 in the public folder"
                }
        
        # Return the file as a response
        return FileResponse(
            path=sound_file_path,
            media_type="audio/mpeg",
            filename="notification_sound.mp3"
        )
        
    except HTTPException:
        # Re-raise HTTPExceptions (like 404)
        raise
    except Exception as e:
        print(f"Error in get_notification_sound: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Error serving notification sound: {str(e)}")

