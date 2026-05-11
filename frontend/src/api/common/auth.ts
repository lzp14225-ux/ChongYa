/*
 * 三端共用认证 API 工厂，根据端前缀生成登录、注册和退出请求。
 */

import { apiRequest } from '../client';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../../types/common/auth';

export function createAuthApi(prefix: 'ruilijie' | 'supplier' | 'warehouse') {
  return {
    login(payload: LoginRequest) {
      return apiRequest<LoginResponse>(`/${prefix}/auth/login`, { method: 'POST', body: payload });
    },
    register(payload: RegisterRequest) {
      return apiRequest<LoginResponse>(`/${prefix}/auth/register`, { method: 'POST', body: payload });
    },
    logout(phone: string) {
      return apiRequest<{ status: string }>(`/${prefix}/auth/logout`, { method: 'POST', body: { phone } });
    }
  };
}
