/*
 * 仓库 H5 备用端登录态管理，复用通用 session 存储工厂。
 */

import { createSessionStorage } from '../../../src/utils/session';

const storage = createSessionStorage('warehouse_h5_session');

export const loadWarehouseSession = storage.load;
export const saveWarehouseSession = storage.save;
export const clearWarehouseSession = storage.clear;
