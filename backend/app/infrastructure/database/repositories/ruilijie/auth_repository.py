"""瑞利杰内部端登录所需的用户、权限和菜单查询仓储。"""

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.orm.common.auth import Menu, Permission, PositionPermission, User


class RuilijieAuthRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_active_ruilijie_user_by_phone(self, phone: str) -> User | None:
        result = await self.db.execute(
            select(User).where(
                User.phone == phone,
                User.status == 1,
                User.company == "1",
            )
        )
        return result.scalar_one_or_none()

    async def get_user_by_phone(self, phone: str) -> User | None:
        result = await self.db.execute(select(User).where(User.phone == phone))
        return result.scalar_one_or_none()

    async def create_ruilijie_user(
        self,
        *,
        phone: str,
        username: str,
        password: str,
        position: str,
        biz_type: str | None,
    ) -> User:
        user = User(
            phone=phone,
            username=username,
            password=password,
            position=position,
            status=1,
            company="1",
            biz_type=biz_type,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def list_permission_codes_by_position(self, position: str | None) -> list[str]:
        if not position:
            return []
        result = await self.db.execute(
            select(PositionPermission.permission_code)
            .where(PositionPermission.position == position)
            .order_by(PositionPermission.permission_code)
        )
        return list(result.scalars().all())

    async def list_menus_by_permission_codes(self, permission_codes: list[str]) -> list[Menu]:
        if permission_codes:
            condition = or_(Menu.permission_code.is_(None), Menu.permission_code.in_(permission_codes))
        else:
            condition = Menu.permission_code.is_(None)

        result = await self.db.execute(
            select(Menu)
            .where(condition)
            .order_by(Menu.sort_order.asc(), Menu.menu_code.asc())
        )
        return list(result.scalars().all())

    async def list_permissions_by_codes(self, permission_codes: list[str]) -> list[Permission]:
        if not permission_codes:
            return []
        result = await self.db.execute(
            select(Permission)
            .where(Permission.permission_code.in_(permission_codes))
            .order_by(Permission.permission_code.asc())
        )
        return list(result.scalars().all())
