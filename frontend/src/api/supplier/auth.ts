/*
 * 供应商端认证 API，复用三端通用认证 API 工厂。
 */

import { createAuthApi } from '../common/auth';

const supplierAuthApi = createAuthApi('supplier');

export const loginSupplier = supplierAuthApi.login;
export const registerSupplier = supplierAuthApi.register;
export const logoutSupplier = supplierAuthApi.logout;
