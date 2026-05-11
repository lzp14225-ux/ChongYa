/*
 * 通用状态标签组件，用于展示信息、警告、危险、成功等状态。
 */

import type { ReactNode } from 'react';

export type PillTone = 'info' | 'warn' | 'danger' | 'success' | 'gray';

export function Pill({ tone, children }: { tone: PillTone; children: ReactNode }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}
