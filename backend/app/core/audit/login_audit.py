"""三端登录审计日志，统一记录登录、注册、退出等认证事件。"""

import logging
from datetime import datetime, timezone

login_logger = logging.getLogger("auth.login")


def write_login_audit(
    *,
    client: str,
    action: str,
    result: str,
    phone: str,
    ip: str | None,
    username: str | None = None,
    reason: str | None = None,
) -> None:
    login_logger.info(
        "auth_event",
        extra={
            "extra_fields": {
                "event_time": datetime.now(timezone.utc).isoformat(),
                "client": client,
                "action": action,
                "result": result,
                "phone": phone,
                "username": username,
                "ip": ip,
                "reason": reason,
            }
        },
    )
