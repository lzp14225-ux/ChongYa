/*
 * 供应商端主布局，组合侧边栏、顶部栏和内容区域。
 */

import { Bell, Search, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import type { SupplierPageKey, SupplierRouteMeta } from '../routes';

type MainLayoutProps = {
  activePage: SupplierPageKey;
  routes: SupplierRouteMeta[];
  title: string;
  sub: string;
  currentUsername: string;
  children: ReactNode;
  onNavigate: (page: SupplierPageKey) => void;
  onSearch: () => void;
  onNotifications: () => void;
  onUser: () => void;
};

export function MainLayout({
  activePage,
  routes,
  title,
  sub,
  currentUsername,
  children,
  onNavigate,
  onSearch,
  onNotifications,
  onUser
}: MainLayoutProps) {
  return (
    <div className="page supplier-page">
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="logo green">S</div>
            <div>
              <div className="brand-title">供应商门户</div>
              <div className="brand-sub">上海拓明材料</div>
            </div>
          </div>
          <nav className="menu" aria-label="供应商导航">
            {routes.map((item) => {
              const Icon = item.icon;
              return (
                <button className={activePage === item.key ? 'active' : ''} key={item.key} onClick={() => onNavigate(item.key)}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>
        <main className="main">
          <header className="header">
            <div>
              <div className="title">{title}</div>
              <div className="sub">{sub}</div>
            </div>
            <div className="header-actions">
              <button className="search" onClick={onSearch}>
                <Search size={18} />
                <span>搜索询价、订单、送货单</span>
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
          <section className="content">{children}</section>
        </main>
      </div>
    </div>
  );
}
