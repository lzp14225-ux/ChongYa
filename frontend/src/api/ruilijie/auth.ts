/*
 * 瑞利杰内部端登录 API，负责调用后端登录接口。
 */

import { apiRequest } from '../client';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../../types/ruilijie/auth';

export function loginRuilijie(payload: LoginRequest) {
  return apiRequest<LoginResponse>('/ruilijie/auth/login', {
    method: 'POST',
    body: payload
  });
}

export function registerRuilijie(payload: RegisterRequest) {
  return apiRequest<LoginResponse>('/ruilijie/auth/register', {
    method: 'POST',
    body: payload
  });
}

export function logoutRuilijie(phone: string) {
  return apiRequest<{ status: string }>('/ruilijie/auth/logout', {
    method: 'POST',
    body: { phone }
  });
}
