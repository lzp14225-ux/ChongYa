"""用户登录、权限和菜单相关存量表的 ORM 映射。"""

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.infrastructure.orm.common.base import Base


class Permission(Base):
    __tablename__ = "permission"

    permission_code: Mapped[str] = mapped_column(String(100), primary_key=True)
    permission_name: Mapped[str | None] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(String(255))
    created_at = mapped_column(DateTime, server_default=func.current_timestamp())


class Menu(Base):
    __tablename__ = "menu"

    menu_code: Mapped[str] = mapped_column(String(100), primary_key=True)
    menu_name: Mapped[str | None] = mapped_column(String(100))
    menu_name_en: Mapped[str | None] = mapped_column(String(100))
    icon: Mapped[str | None] = mapped_column(String(50))
    parent_code: Mapped[str | None] = mapped_column(String(100))
    sort_order: Mapped[int | None] = mapped_column(Integer, default=0)
    permission_code: Mapped[str | None] = mapped_column(
        String(100),
        ForeignKey("permission.permission_code"),
    )
    created_at = mapped_column(DateTime, server_default=func.current_timestamp())


class PositionPermission(Base):
    __tablename__ = "position_permission"

    position: Mapped[str] = mapped_column(String(50), primary_key=True)
    permission_code: Mapped[str] = mapped_column(
        String(100),
        ForeignKey("permission.permission_code"),
        primary_key=True,
    )
    created_at = mapped_column(DateTime, server_default=func.current_timestamp())


class User(Base):
    __tablename__ = "user"

    phone: Mapped[str] = mapped_column(String(20), primary_key=True)
    username: Mapped[str | None] = mapped_column(String(50))
    password: Mapped[str | None] = mapped_column(String(255))
    position: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[int | None] = mapped_column(Integer, default=1)
    created_at = mapped_column(DateTime, server_default=func.current_timestamp())
    updated_at = mapped_column(DateTime, server_default=func.current_timestamp())
    company: Mapped[str | None] = mapped_column(String(255))
    openid: Mapped[str | None] = mapped_column(String(255))
    biz_type: Mapped[str | None] = mapped_column(String(255))
