/*
 * 瑞利杰内部端登录相关 TypeScript 类型。
 */

export type LoginRequest = {
  phone: string;
  password: string;
};

export type RegisterRequest = {
  phone: string;
  username: string;
  password: string;
  position: string;
  biz_type?: string | null;
};

export type LoginUser = {
  phone: string;
  username?: string | null;
  position?: string | null;
  company?: string | null;
  biz_type?: string | null;
};

export type LoginPermission = {
  permission_code: string;
  permission_name?: string | null;
};

export type LoginMenu = {
  menu_code: string;
  menu_name?: string | null;
  menu_name_en?: string | null;
  icon?: string | null;
  parent_code?: string | null;
  sort_order?: number | null;
  permission_code?: string | null;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: LoginUser;
  permissions: LoginPermission[];
  menus: LoginMenu[];
};
