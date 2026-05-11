/*
 * 仓库端认证 API，复用三端通用认证 API 工厂。
 */

import { createAuthApi } from '../common/auth';

const warehouseAuthApi = createAuthApi('warehouse');

export const loginWarehouse = warehouseAuthApi.login;
export const registerWarehouse = warehouseAuthApi.register;
export const logoutWarehouse = warehouseAuthApi.logout;
