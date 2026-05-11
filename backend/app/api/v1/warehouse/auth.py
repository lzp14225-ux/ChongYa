"""仓库端认证路由配置。"""

from app.api.v1.common.auth import AuthRouterConfig, create_auth_router
from app.core.config.settings import settings

router = create_auth_router(
    AuthRouterConfig(
        client="warehouse",
        company_code=settings.warehouse_company_code,
        biz_type=settings.warehouse_biz_type,
        match_biz_type=True,
        login_failed_detail="手机号或密码错误，或该用户不属于仓库端",
        login_failed_reason="invalid_warehouse_user",
    )
)
