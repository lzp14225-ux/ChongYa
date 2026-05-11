/*
 * 瑞利杰内部端认证 API，复用三端通用认证 API 工厂。
 */

import { createAuthApi } from '../common/auth';

const ruilijieAuthApi = createAuthApi('ruilijie');

export const loginRuilijie = ruilijieAuthApi.login;
export const registerRuilijie = ruilijieAuthApi.register;
export const logoutRuilijie = ruilijieAuthApi.logout;
