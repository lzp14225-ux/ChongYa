/*
 * 仓库 H5 备用端路由元数据，集中维护底部导航和页面标题。
 */

import { ClipboardCheck, Home, PackageSearch, ScanLine, UserRound } from 'lucide-react';
import type { ComponentType } from 'react';

export type WarehousePageKey = 'home' | 'scan' | 'tasks' | 'inventory' | 'mine';

export type WarehouseRouteMeta = {
  key: WarehousePageKey;
  label: string;
  title: string;
  icon: ComponentType<{ size?: number }>;
};

export const warehouseRoutes: WarehouseRouteMeta[] = [
  { key: 'home', label: '首页', title: '仓库作业台', icon: Home },
  { key: 'scan', label: '扫码', title: '扫码', icon: ScanLine },
  { key: 'tasks', label: '任务', title: '任务', icon: ClipboardCheck },
  { key: 'inventory', label: '库存', title: '库存', icon: PackageSearch },
  { key: 'mine', label: '我的', title: '我的', icon: UserRound }
];

export const warehouseRouteMeta = Object.fromEntries(warehouseRoutes.map((route) => [route.key, route])) as Record<
  WarehousePageKey,
  WarehouseRouteMeta
>;
