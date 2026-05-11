/*
 * 瑞利杰内部端登录态管理，复用通用 session 存储工厂。
 */

import { createSessionStorage } from '../../../src/utils/session';

const storage = createSessionStorage('ruilijie_internal_session');

export const loadRuilijieSession = storage.load;
export const saveRuilijieSession = storage.save;
export const clearRuilijieSession = storage.clear;
