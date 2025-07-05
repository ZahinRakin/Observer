from fastapi import HTTPException
from backend.models.settings_model import SystemSettings
from datetime import datetime

async def get_system_settings():
    """Get current system settings"""
    try:
        # Get the first (and should be only) settings document
        settings = await SystemSettings.find_one()
        if not settings:
            # Create default settings if none exist
            settings = SystemSettings()
            await settings.insert()
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching settings: {str(e)}")

async def update_system_settings(settings_data: dict):
    """Update system settings"""
    try:
        # Get current settings
        current_settings = await SystemSettings.find_one()
        if not current_settings:
            # Create new settings if none exist
            current_settings = SystemSettings()
        
        # Update fields
        for key, value in settings_data.items():
            if hasattr(current_settings, key):
                setattr(current_settings, key, value)
        
        # Update timestamp
        current_settings.updated_at = datetime.utcnow()
        
        # Save changes
        await current_settings.save()
        return current_settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating settings: {str(e)}")

async def reset_system_settings():
    """Reset system settings to defaults"""
    try:
        # Delete existing settings
        await SystemSettings.delete_all()
        
        # Create new default settings
        default_settings = SystemSettings()
        await default_settings.insert()
        return default_settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting settings: {str(e)}") 