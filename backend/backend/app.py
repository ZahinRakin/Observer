from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import os
from backend.DB.db_connection import connect_db, disconnect_db
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from backend.routes.user_routes import router as user_router
from backend.routes.store_owner_routes import router as store_owner_router
from backend.routes.customer_routes import router as customer_router
from backend.routes.admin_routes import router as admin_router
from backend.routes.product_routes import router as product_router
from backend.routes.news_routes import router as news_router
from backend.routes.notification_routes import router as notification_router
from backend.routes.healthcheck_routes import router as healthcheck_router
from backend.routes.g_auth_routes import router as g_auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_dotenv()
    await connect_db()
    yield
    await disconnect_db()

app = FastAPI(lifespan=lifespan)


origins=[
  "*"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(healthcheck_router, prefix="/api/v1/healthcheck", tags=["healthcheck"])
app.include_router(user_router, prefix="/api/v1/user", tags=["user"])
app.include_router(store_owner_router, prefix="/api/v1/storeowner", tags=["storeowner"])
app.include_router(customer_router, prefix="/api/v1/customer", tags=["customer"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["admin"])
# app.include_router(store_router, prefix="/api/v1/store")this is still under consideration.
app.include_router(product_router, prefix="/api/v1/product", tags=["product"])
app.include_router(news_router, prefix="/api/v1/news", tags=["news"])
app.include_router(notification_router, prefix="/api/v1/notification", tags=["notification"])
app.include_router(g_auth_router, prefix="/auth/google", tags=["auth"])

