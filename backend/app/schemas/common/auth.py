"""三端共用登录注册接口的请求和响应模型。"""

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    phone: str = Field(..., min_length=1, max_length=20)
    password: str = Field(..., min_length=1, max_length=255)


class RegisterRequest(BaseModel):
    phone: str = Field(..., min_length=1, max_length=20)
    username: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=1, max_length=255)
    position: str = Field(..., min_length=1, max_length=50)


class LogoutRequest(BaseModel):
    phone: str = Field(..., min_length=1, max_length=20)


class LoginUser(BaseModel):
    phone: str
    username: str | None = None
    position: str | None = None
    company: str | None = None
    biz_type: str | None = None


class LoginPermission(BaseModel):
    permission_code: str
    permission_name: str | None = None


class LoginMenu(BaseModel):
    menu_code: str
    menu_name: str | None = None
    menu_name_en: str | None = None
    icon: str | None = None
    parent_code: str | None = None
    sort_order: int | None = 0
    permission_code: str | None = None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: LoginUser
    permissions: list[LoginPermission]
    menus: list[LoginMenu]
