"""FastAPI 应用入口，负责创建应用、注册 CORS 和 API 路由。"""

import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1_router
from app.core.config.settings import settings
from app.core.logging.setup import setup_logging

error_logger = logging.getLogger("app.error")


def create_app() -> FastAPI:
    setup_logging()

    app = FastAPI(
        title=settings.app_name,
        debug=settings.app_debug,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_v1_router, prefix="/api/v1")

    @app.middleware("http")
    async def error_logging_middleware(request: Request, call_next):
        try:
            return await call_next(request)
        except Exception:
            error_logger.exception(
                "unhandled_exception",
                extra={
                    "extra_fields": {
                        "method": request.method,
                        "path": request.url.path,
                        "client": request.client.host if request.client else None,
                    }
                },
            )
            return JSONResponse(
                status_code=500,
                content={"detail": "服务器内部错误，请查看后端错误日志"},
            )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        error_logger.exception(
            "unhandled_exception",
            extra={
                "extra_fields": {
                    "method": request.method,
                    "path": request.url.path,
                    "client": request.client.host if request.client else None,
                }
            },
        )
        return JSONResponse(
            status_code=500,
            content={"detail": "服务器内部错误，请查看后端错误日志"},
        )

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
