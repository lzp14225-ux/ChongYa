/*
 * 仓库 H5 备用端 React 入口，负责单独挂载仓库应用。
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '../ruilijie/styles/ruilijie.css';
import './styles/warehouse.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
