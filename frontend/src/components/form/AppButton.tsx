/*
 * 通用按钮组件，统一前端主要按钮和次要按钮的样式类。
 */

import type { ReactNode } from 'react';

type AppButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  danger?: boolean;
};

export function AppButton({ children, variant = 'secondary', onClick, danger }: AppButtonProps) {
  return (
    <button className={`${variant} ${danger ? 'red' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}
