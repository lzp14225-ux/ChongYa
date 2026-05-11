/*
 * 供应商端路由元数据，集中维护菜单、页面标题和导航图标。
 */

import { Building2, ClipboardCheck, FileText, Home, PackageCheck, ReceiptText, RefreshCcw, Truck, Wrench } from 'lucide-react';
import type { ComponentType } from 'react';

export type SupplierPageKey = 'dashboard' | 'quote' | 'order' | 'delivery' | 'process' | 'return' | 'recon' | 'profile';

export type SupplierRouteMeta = {
  key: SupplierPageKey;
  label: string;
  title: string;
  sub: string;
  icon: ComponentType<{ size?: number }>;
};

export const supplierRoutes: SupplierRouteMeta[] = [
  { key: 'dashboard', label: '工作台', title: '供应商工作台', sub: '报价、接单、送货、退货与对账协同', icon: Home },
  { key: 'quote', label: '询价报价', title: '询价报价', sub: '待报价、已报价和报价历史', icon: FileText },
  { key: 'order', label: '订单确认', title: '订单确认', sub: '确认订单、申请变更或拒绝接单', icon: ClipboardCheck },
  { key: 'delivery', label: '送货管理', title: '送货管理', sub: '创建送货单、上传物流和查看签收', icon: Truck },
  { key: 'process', label: '加工分切', title: '加工分切', sub: '加工反馈、分切反馈和产出记录', icon: Wrench },
  { key: 'return', label: '退货处理', title: '退货处理', sub: '确认退货、填写接收结果和上传凭证', icon: RefreshCcw },
  { key: 'recon', label: '对账确认', title: '对账确认', sub: '待确认对账、已确认对账和差异处理', icon: ReceiptText },
  { key: 'profile', label: '企业资料', title: '企业资料', sub: '维护联系人、地址、资质和供货范围', icon: Building2 }
];

export const supplierRouteMeta = Object.fromEntries(supplierRoutes.map((route) => [route.key, route])) as Record<
  SupplierPageKey,
  SupplierRouteMeta
>;
