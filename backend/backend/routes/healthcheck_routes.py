from fastapi import APIRouter, Request # type: ignore
from backend.controllers.healthcheck_controllers import check_all

router = APIRouter()


@router.get("/")
async def do():
  return await check_all()