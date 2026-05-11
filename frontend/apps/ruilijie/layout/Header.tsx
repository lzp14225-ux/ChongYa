/*
 * 瑞利杰内部端顶部栏组件，负责标题、搜索、消息和用户入口。
 */

import { Bell, Search, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';

type HeaderProps = {
  title: string;
  sub: string;
  currentUsername: string;
  onSearch: () => void;
  onNotifications: () => void;
  onUser: () => void;
};

export function Header({ title, sub, currentUsername, onSearch, onNotifications, onUser }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <div className="title">{title}</div>
        <div className="sub">{sub}</div>
      </div>
      <div className="header-actions">
        <button className="search" onClick={onSearch}>
          <Search size={18} />
          <span>搜索订单、供应商、送货单</span>
        </button>
        <button className="icon-btn" onClick={onNotifications} aria-label="消息通知">
          <Bell size={19} />
        </button>
        <button className="user-btn" onClick={onUser}>
          <UserRound size={18} />
          <span>{currentUsername}</span>
        </button>
      </div>
    </header>
  );
}

export type HeaderModalBody = ReactNode;
