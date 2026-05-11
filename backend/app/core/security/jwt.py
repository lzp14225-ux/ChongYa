"""JWT 令牌生成工具。"""

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt

from app.core.config.settings import settings


def create_access_token(subject: str, extra: dict[str, Any] | None = None) -> str:
    expire_at = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload: dict[str, Any] = {
        "sub": subject,
        "exp": expire_at,
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
