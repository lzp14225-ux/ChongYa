"""三端通用认证路由工厂，统一生成登录、注册和退出接口。"""

from dataclasses import dataclass

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit.login_audit import write_login_audit
from app.infrastructure.database.session import get_db_session
from app.schemas.common.auth import LoginRequest, LoginResponse, LogoutRequest, RegisterRequest
from app.services.common.auth_service import CommonAuthService


@dataclass(frozen=True)
class AuthRouterConfig:
    client: str
    company_code: str
    biz_type: str
    match_biz_type: bool
    login_failed_detail: str
    login_failed_reason: str


def _client_ip(request: Request) -> str | None:
    return request.client.host if request.client else None


def create_auth_router(config: AuthRouterConfig) -> APIRouter:
    router = APIRouter()

    def auth_service(db: AsyncSession) -> CommonAuthService:
        return CommonAuthService(
            db,
            client=config.client,
            company_code=config.company_code,
            biz_type=config.biz_type,
            match_biz_type=config.match_biz_type,
        )

    @router.post("/login", response_model=LoginResponse)
    async def login(
        payload: LoginRequest,
        request: Request,
        db: AsyncSession = Depends(get_db_session),
    ) -> LoginResponse:
        result = await auth_service(db).login(payload.phone, payload.password)
        if result is None:
            write_login_audit(
                client=config.client,
                action="login",
                result="failed",
                phone=payload.phone,
                ip=_client_ip(request),
                reason=config.login_failed_reason,
            )
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=config.login_failed_detail)

        write_login_audit(
            client=config.client,
            action="login",
            result="success",
            phone=result.user.phone,
            username=result.user.username,
            ip=_client_ip(request),
        )
        return result

    @router.post("/register", response_model=LoginResponse)
    async def register(
        payload: RegisterRequest,
        request: Request,
        db: AsyncSession = Depends(get_db_session),
    ) -> LoginResponse:
        result = await auth_service(db).register(
            phone=payload.phone,
            username=payload.username,
            password=payload.password,
            position=payload.position,
        )
        if result is None:
            write_login_audit(
                client=config.client,
                action="register",
                result="failed",
                phone=payload.phone,
                username=payload.username,
                ip=_client_ip(request),
                reason="phone_already_registered",
            )
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="该手机号已注册")

        write_login_audit(
            client=config.client,
            action="register",
            result="success",
            phone=result.user.phone,
            username=result.user.username,
            ip=_client_ip(request),
        )
        return result

    @router.post("/logout")
    async def logout(payload: LogoutRequest, request: Request) -> dict[str, str]:
        write_login_audit(
            client=config.client,
            action="logout",
            result="success",
            phone=payload.phone,
            ip=_client_ip(request),
        )
        return {"status": "ok"}

    return router
