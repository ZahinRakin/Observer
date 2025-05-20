from fastapi import APIRouter, Request # type: ignore
from backend.controllers.healthcheck_controllers import check_all

router = APIRouter()


@router.post("/all")
async def do():
  return await check_all()