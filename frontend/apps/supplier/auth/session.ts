/*
 * 供应商端登录态管理，复用通用 session 存储工厂。
 */

import { createSessionStorage } from '../../../src/utils/session';

const storage = createSessionStorage('supplier_portal_session');

export const loadSupplierSession = storage.load;
export const saveSupplierSession = storage.save;
export const clearSupplierSession = storage.clear;
