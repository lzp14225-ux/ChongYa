"""瑞利杰内部端登录服务，负责校验用户并组装令牌、权限和菜单。"""

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.jwt import create_access_token
from app.core.security.password import hash_password, verify_password
from app.infrastructure.database.repositories.ruilijie.auth_repository import RuilijieAuthRepository
from app.schemas.ruilijie.auth import LoginMenu, LoginPermission, LoginResponse, LoginUser


class RuilijieAuthService:
    def __init__(self, db: AsyncSession) -> None:
        self.repository = RuilijieAuthRepository(db)

    async def login(self, phone: str, password: str) -> LoginResponse | None:
        user = await self.repository.get_active_ruilijie_user_by_phone(phone)
        if user is None or not verify_password(password, user.password):
            return None
        return await self._build_login_response(user)

    async def register(
        self,
        *,
        phone: str,
        username: str,
        password: str,
        position: str,
        biz_type: str | None,
    ) -> LoginResponse | None:
        existing_user = await self.repository.get_user_by_phone(phone)
        if existing_user is not None:
            return None

        user = await self.repository.create_ruilijie_user(
            phone=phone,
            username=username,
            password=hash_password(password),
            position=position,
            biz_type=biz_type,
        )
        return await self._build_login_response(user)

    async def _build_login_response(self, user) -> LoginResponse:
        permission_codes = await self.repository.list_permission_codes_by_position(user.position)
        permissions = await self.repository.list_permissions_by_codes(permission_codes)
        menus = await self.repository.list_menus_by_permission_codes(permission_codes)

        access_token = create_access_token(
            subject=user.phone,
            extra={
                "company": user.company,
                "position": user.position,
                "client": "ruilijie",
            },
        )

        return LoginResponse(
            access_token=access_token,
            user=LoginUser(
                phone=user.phone,
                username=user.username,
                position=user.position,
                company=user.company,
                biz_type=user.biz_type,
            ),
            permissions=[
                LoginPermission(
                    permission_code=item.permission_code,
                    permission_name=item.permission_name,
                )
                for item in permissions
            ],
            menus=[
                LoginMenu(
                    menu_code=item.menu_code,
                    menu_name=item.menu_name,
                    menu_name_en=item.menu_name_en,
                    icon=item.icon,
                    parent_code=item.parent_code,
                    sort_order=item.sort_order,
                    permission_code=item.permission_code,
                )
                for item in menus
            ],
        )
