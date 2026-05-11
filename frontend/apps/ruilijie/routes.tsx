/*
 * 瑞利杰内部端路由元数据，集中维护菜单、页面标题和导航图标。
 */

import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Factory,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  Truck
} from 'lucide-react';
import type { ComponentType } from 'react';

export type RuilijiePageKey =
  | 'dashboard'
  | 'requisition'
  | 'decision'
  | 'inquiry'
  | 'approval'
  | 'order'
  | 'delivery'
  | 'outsourcing'
  | 'exception'
  | 'report'
  | 'settings';

export type RuilijieRouteMeta = {
  key: RuilijiePageKey;
  label: string;
  title: string;
  sub: string;
  icon: ComponentType<{ size?: number }>;
};

export const ruilijieRoutes: RuilijieRouteMeta[] = [
  { key: 'dashboard', label: '工作台', title: '内部工作台', sub: '采购、审批、送货、异常统一管控', icon: LayoutDashboard },
  { key: 'requisition', label: '请购管理', title: '请购管理', sub: '创建、提交、拆分和处理请购单', icon: ClipboardList },
  { key: 'decision', label: '采购决策', title: '采购决策', sub: '判断采购策略、历史价格、供应商风险', icon: ShieldCheck },
  { key: 'inquiry', label: '询价比价', title: '询价比价', sub: '发起询价、催报价、报价汇总和比价', icon: FileText },
  { key: 'approval', label: '价格审批', title: '价格审批', sub: '审批价格、供应商和单一来源', icon: CheckCircle2 },
  { key: 'order', label: '采购订单', title: '采购订单', sub: '订单创建、下发、变更和关闭', icon: Package },
  { key: 'delivery', label: '送货执行', title: '送货执行', sub: '跟踪待确认、待发货、送货中和待签收', icon: Truck },
  { key: 'outsourcing', label: '委外分切', title: '委外分切', sub: '委外任务、分切任务和临时 BOM', icon: Factory },
  { key: 'exception', label: '异常退货', title: '异常退货', sub: '异常处理、退货审批和原因统计', icon: AlertTriangle },
  { key: 'report', label: '报表中心', title: '报表中心', sub: '采购履约、供应商绩效和异常分析', icon: BarChart3 },
  { key: 'settings', label: '系统配置', title: '系统配置', sub: '用户、角色、权限、审批流和字典', icon: Settings }
];

export const ruilijieRouteMeta = Object.fromEntries(ruilijieRoutes.map((route) => [route.key, route])) as Record<
  RuilijiePageKey,
  RuilijieRouteMeta
>;
