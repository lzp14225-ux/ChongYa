/*
 * 瑞利杰内部端 React 入口，负责挂载应用和加载内部端样式。
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/ruilijie.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
