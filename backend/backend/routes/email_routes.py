from fastapi import APIRouter, Body
from backend.models.email_model import Email
from backend.controllers.email_controllers import send_email, get_email_status

router = APIRouter()

@router.post("/send")
async def send_email_route(email: Email = Body(...)):
    return await send_email(email)

@router.get("/status/{email_id}")
async def get_email_status_route(email_id: str):
    return await get_email_status(email_id)

