/*
 * 前端总入口，根据访问路径加载瑞利杰内部端、供应商端或仓库 H5 备用端。
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App as RuilijieApp } from '../apps/ruilijie/App';
import { App as SupplierApp } from '../apps/supplier/App';
import { App as WarehouseApp } from '../apps/warehouse/App';
import '../apps/ruilijie/styles/ruilijie.css';
import '../apps/supplier/styles/supplier.css';
import '../apps/warehouse/styles/warehouse.css';

const pathname = window.location.pathname;
const CurrentApp = pathname.startsWith('/supplier')
  ? SupplierApp
  : pathname.startsWith('/warehouse')
    ? WarehouseApp
    : RuilijieApp;

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CurrentApp />
  </React.StrictMode>
);
