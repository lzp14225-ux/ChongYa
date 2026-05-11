/*
 * 瑞利杰内部端主布局，组合侧边栏、顶部栏和内容区域。
 */

import type { ReactNode } from 'react';
import type { RuilijiePageKey, RuilijieRouteMeta } from '../routes';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

type MainLayoutProps = {
  activePage: RuilijiePageKey;
  routes: RuilijieRouteMeta[];
  title: string;
  sub: string;
  currentUsername: string;
  children: ReactNode;
  onNavigate: (page: RuilijiePageKey) => void;
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
    <div className="page">
      <div className="shell">
        <Sidebar activePage={activePage} routes={routes} onNavigate={onNavigate} />
        <main className="main">
          <Header
            title={title}
            sub={sub}
            currentUsername={currentUsername}
            onSearch={onSearch}
            onNotifications={onNotifications}
            onUser={onUser}
          />
          <section className="content">{children}</section>
        </main>
      </div>
    </div>
  );
}
