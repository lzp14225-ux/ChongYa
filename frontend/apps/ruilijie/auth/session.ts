/*
 * 瑞利杰内部端登录态管理，负责在浏览器本地保存和清除登录信息。
 */

import type { LoginResponse } from '../../../src/types/ruilijie/auth';

const SESSION_KEY = 'ruilijie_internal_session';

export function loadRuilijieSession(): LoginResponse | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveRuilijieSession(session: LoginResponse) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearRuilijieSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
