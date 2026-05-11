/*
 * 供应商端 React 入口，负责单独挂载供应商应用。
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '../ruilijie/styles/ruilijie.css';
import './styles/supplier.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
