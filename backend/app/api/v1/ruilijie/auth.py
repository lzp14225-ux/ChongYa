"""瑞利杰内部端登录接口。"""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit.login_audit import write_login_audit
from app.infrastructure.database.session import get_db_session
from app.schemas.ruilijie.auth import LoginRequest, LoginResponse, LogoutRequest, RegisterRequest
from app.services.ruilijie.auth_service import RuilijieAuthService

router = APIRouter()


def _client_ip(request: Request) -> str | None:
    return request.client.host if request.client else None


@router.post("/login", response_model=LoginResponse)
async def login(
    payload: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db_session),
) -> LoginResponse:
    auth_service = RuilijieAuthService(db)
    result = await auth_service.login(payload.phone, payload.password)
    if result is None:
        write_login_audit(
            client="ruilijie",
            action="login",
            result="failed",
            phone=payload.phone,
            ip=_client_ip(request),
            reason="invalid_phone_or_password_or_not_ruilijie_user",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="手机号或密码错误，或该用户不属于瑞利杰内部端",
        )
    write_login_audit(
        client="ruilijie",
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
    auth_service = RuilijieAuthService(db)
    result = await auth_service.register(
        phone=payload.phone,
        username=payload.username,
        password=payload.password,
        position=payload.position,
        biz_type=payload.biz_type,
    )
    if result is None:
        write_login_audit(
            client="ruilijie",
            action="register",
            result="failed",
            phone=payload.phone,
            username=payload.username,
            ip=_client_ip(request),
            reason="phone_already_registered",
        )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="该手机号已注册",
        )
    write_login_audit(
        client="ruilijie",
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
        client="ruilijie",
        action="logout",
        result="success",
        phone=payload.phone,
        ip=_client_ip(request),
    )
    return {"status": "ok"}
