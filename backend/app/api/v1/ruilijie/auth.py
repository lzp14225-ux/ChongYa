"""瑞利杰内部端认证路由配置。"""

from app.api.v1.common.auth import AuthRouterConfig, create_auth_router
from app.core.config.settings import settings

router = create_auth_router(
    AuthRouterConfig(
        client="ruilijie",
        company_code=settings.ruilijie_company_code,
        biz_type=settings.ruilijie_biz_type,
        match_biz_type=False,
        login_failed_detail="手机号或密码错误，或该用户不属于瑞利杰内部端",
        login_failed_reason="invalid_ruilijie_user",
    )
)
