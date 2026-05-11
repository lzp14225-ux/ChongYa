/*
 * 瑞利杰内部端侧边栏导航组件，负责渲染菜单并切换页面。
 */

import type { RuilijiePageKey, RuilijieRouteMeta } from '../routes';

type SidebarProps = {
  activePage: RuilijiePageKey;
  routes: RuilijieRouteMeta[];
  onNavigate: (page: RuilijiePageKey) => void;
};

export function Sidebar({ activePage, routes, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">R</div>
        <div>
          <div className="brand-title">瑞利杰供应链</div>
          <div className="brand-sub">内部管理端</div>
        </div>
      </div>
      <nav className="menu" aria-label="主导航">
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
  );
}
