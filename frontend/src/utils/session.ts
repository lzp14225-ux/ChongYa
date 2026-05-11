/*
 * 前端通用登录态存储工厂，负责按端隔离保存、读取和清除 session。
 */

import type { LoginResponse } from '../types/common/auth';

export function createSessionStorage(sessionKey: string) {
  return {
    load(): LoginResponse | null {
      const raw = window.localStorage.getItem(sessionKey);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as LoginResponse;
      } catch {
        window.localStorage.removeItem(sessionKey);
        return null;
      }
    },
    save(session: LoginResponse) {
      window.localStorage.setItem(sessionKey, JSON.stringify(session));
    },
    clear() {
      window.localStorage.removeItem(sessionKey);
    }
  };
}
