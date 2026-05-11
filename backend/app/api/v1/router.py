"""API v1 路由聚合，统一挂载各业务端接口。"""

from fastapi import APIRouter

from app.api.v1.ruilijie.auth import router as ruilijie_auth_router
from app.api.v1.supplier.auth import router as supplier_auth_router
from app.api.v1.warehouse.auth import router as warehouse_auth_router

api_v1_router = APIRouter()
api_v1_router.include_router(ruilijie_auth_router, prefix="/ruilijie/auth", tags=["瑞利杰内部端登录"])
api_v1_router.include_router(supplier_auth_router, prefix="/supplier/auth", tags=["供应商端登录"])
api_v1_router.include_router(warehouse_auth_router, prefix="/warehouse/auth", tags=["仓库端登录"])
