/*
 * 仓库 H5 备用端应用主组件，模拟微信小程序仓库收货、质检、入库和库存查询流程。
 */

import type { ReactNode } from 'react';
import { useState } from 'react';
import { AlertTriangle, Camera, PackageSearch, ScanLine } from 'lucide-react';
import { loginWarehouse, logoutWarehouse, registerWarehouse } from '../../src/api/warehouse/auth';
import { AppButton } from '../../src/components/form/AppButton';
import { Field } from '../../src/components/form/Field';
import { Pill } from '../../src/components/status-tag/Pill';
import type { LoginResponse } from '../../src/types/common/auth';
import { clearWarehouseSession, loadWarehouseSession, saveWarehouseSession } from './auth/session';
import { LoginPage } from './pages/LoginPage';
import { warehouseRouteMeta, warehouseRoutes, type WarehousePageKey } from './routes';

type PanelState = { title: string; body: ReactNode } | null;

export function App() {
  const [activePage, setActivePage] = useState<WarehousePageKey>('home');
  const [session, setSession] = useState<LoginResponse | null>(() => loadWarehouseSession());
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [toast, setToast] = useState('');
  const [panel, setPanel] = useState<PanelState>(null);
  const meta = warehouseRouteMeta[activePage];

  const notify = (message: string) => {
    setToast(message);
    window.clearTimeout(window.__warehouseToastTimer);
    window.__warehouseToastTimer = window.setTimeout(() => setToast(''), 2000);
  };

  const handleLogin = async (phone: string, password: string) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const nextSession = await loginWarehouse({ phone, password });
      saveWarehouseSession(nextSession);
      setSession(nextSession);
      notify('登录成功');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : '登录失败，请稍后重试');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (payload: { phone: string; username: string; password: string; position: string }) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const nextSession = await registerWarehouse(payload);
      saveWarehouseSession(nextSession);
      setSession(nextSession);
      notify('注册成功');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : '注册失败，请稍后重试');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (session?.user.phone) {
      await logoutWarehouse(session.user.phone).catch(() => undefined);
    }
    clearWarehouseSession();
    setSession(null);
    setActivePage('home');
    notify('已退出登录');
  };

  const showPanel = (title: string, body: ReactNode) => setPanel({ title, body });
  const closePanel = () => setPanel(null);

  const receipt = () =>
    showPanel(
      '签收确认',
      <PanelForm
        description="冷轧钢板 SPCC · 应收 200 KG"
        primaryText="确认签收"
        onPrimary={() => {
          notify('签收成功，进入待质检');
          closePanel();
        }}
        secondaryText="登记异常"
        onSecondary={() => exceptionForm()}
      >
        <Field label="本次签收数量" value="200 KG" />
      </PanelForm>
    );

  const quality = () =>
    showPanel(
      '质检处理',
      <PanelForm
        description="半成品 A1 · 签收 120 PCS"
        primaryText="合格"
        onPrimary={() => {
          notify('质检合格，进入待入库');
          closePanel();
        }}
        secondaryText="不合格"
        onSecondary={() => exceptionForm()}
      />
    );

  const inbound = () =>
    showPanel(
      '入库确认',
      <PanelForm
        description="选择库位并确认入库"
        primaryText="确认入库"
        onPrimary={() => {
          notify('入库成功，库存已更新');
          closePanel();
        }}
      >
        <Field label="库位" value="A-01-03" />
      </PanelForm>
    );

  const returnOut = () =>
    showPanel(
      '退货出库',
      <PanelForm
        description="RT20260508001 · 包装破损退货"
        primaryText="确认退货出库"
        danger
        onPrimary={() => {
          notify('退货出库成功');
          closePanel();
        }}
      />
    );

  const exceptionForm = () =>
    showPanel(
      '异常登记',
      <PanelForm
        description="登记数量短缺、包装破损或质量异常"
        primaryText="提交异常"
        danger
        onPrimary={() => {
          notify('异常单已提交');
          closePanel();
        }}
      >
        <Field label="异常类型" value="数量短缺" />
        <Field label="说明" value="短缺 5 KG" />
      </PanelForm>
    );

  if (!session) {
    return (
      <>
        <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
        <LoginPage loading={authLoading} error={authError} onSubmit={handleLogin} onRegister={handleRegister} />
      </>
    );
  }

  return (
    <div className="warehouse-wrap">
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
      <div className="phone">
        <div className="screen">
          <div className="notch" />
          <header className="mini-header">
            <div className="mini-sub">瑞利杰一号仓</div>
            <div className="mini-title">{meta.title}</div>
            <div className="stats">
              <button className="stat" onClick={() => setActivePage('tasks')}>
                <b>12</b>
                <span>待收货</span>
              </button>
              <button className="stat" onClick={() => quality()}>
                <b>5</b>
                <span>待质检</span>
              </button>
              <button className="stat" onClick={() => inbound()}>
                <b>9</b>
                <span>待入库</span>
              </button>
            </div>
          </header>
          <main className="mini-main">
            <WarehouseContent
              page={activePage}
              setActivePage={setActivePage}
              notify={notify}
              receipt={receipt}
              quality={quality}
              inbound={inbound}
              returnOut={returnOut}
              exceptionForm={exceptionForm}
              showPanel={showPanel}
              currentUsername={session.user.username || session.user.phone}
              onLogout={handleLogout}
            />
          </main>
          <footer className="tabbar">
            {warehouseRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <button className={`tab ${activePage === route.key ? 'active' : ''}`} key={route.key} onClick={() => setActivePage(route.key)}>
                  <Icon size={18} />
                  <span>{route.label}</span>
                </button>
              );
            })}
          </footer>
          <section className={`panel ${panel ? 'show' : ''}`}>
            {panel && (
              <>
                <AppButton onClick={closePanel}>关闭</AppButton>
                <h2>{panel.title}</h2>
                {panel.body}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function WarehouseContent({
  page,
  setActivePage,
  notify,
  receipt,
  quality,
  inbound,
  returnOut,
  exceptionForm,
  showPanel,
  currentUsername,
  onLogout
}: {
  page: WarehousePageKey;
  setActivePage: (page: WarehousePageKey) => void;
  notify: (message: string) => void;
  receipt: () => void;
  quality: () => void;
  inbound: () => void;
  returnOut: () => void;
  exceptionForm: () => void;
  showPanel: (title: string, body: ReactNode) => void;
  currentUsername: string;
  onLogout: () => void;
}) {
  if (page === 'scan') {
    return (
      <>
        <button
          className="scan-main"
          onClick={() =>
            showPanel(
              '扫码识别',
              <PanelForm description="模拟扫码成功：DL20260508001" primaryText="进入签收" onPrimary={receipt} />
            )
          }
        >
          <ScanLine size={22} />
          启动摄像头扫码
        </button>
        <section className="mini-card">
          <h3>支持识别</h3>
          <p>送货单码、物料码、箱码、批次码、库位码、退货单码、分切任务码。</p>
        </section>
      </>
    );
  }

  if (page === 'tasks') {
    return (
      <>
        <div className="mini-tabs">
          <button className="active">待收货</button>
          <button>待质检</button>
          <button>待入库</button>
        </div>
        <TaskCard title="DL20260508001" desc="冷轧钢板 SPCC · 200 KG" tone="warn" status="待签收" action="签收" onClick={receipt} />
        <TaskCard title="DL20260508002" desc="半成品 A1 · 120 PCS" tone="info" status="待质检" action="质检" onClick={quality} />
      </>
    );
  }

  if (page === 'inventory') {
    return (
      <>
        <Field label="物料/批次/库位" value="SPCC-20260508" />
        <AppButton variant="primary" onClick={() => notify('查询到库存：可用 195 KG')}>查询库存</AppButton>
        <TaskCard
          title="冷轧钢板 SPCC"
          desc="库位 A-01-03 · 可用 195 KG · 冻结 5 KG"
          tone="success"
          status="有库存"
          action="库存追溯"
          onClick={() => showPanel('库存追溯', <p className="mini-muted">来源：PO20260508001 → DL20260508001 → 签收 → 入库</p>)}
        />
      </>
    );
  }

  if (page === 'mine') {
    return (
      <section className="mini-card">
        <h3>{currentUsername}</h3>
        <p>当前仓库：瑞利杰一号仓<br />今日已处理：18 单</p>
        <AppButton danger variant="primary" onClick={onLogout}>退出登录</AppButton>
      </section>
    );
  }

  return (
    <>
      <button className="scan-main" onClick={() => setActivePage('scan')}>
        <ScanLine size={22} />
        扫码收货
      </button>
      <div className="quick">
        <button onClick={() => setActivePage('scan')}><ScanLine size={18} />扫码</button>
        <button onClick={() => notify('模拟拍照上传成功')}><Camera size={18} />拍照</button>
        <button onClick={exceptionForm}><AlertTriangle size={18} />异常</button>
        <button onClick={() => setActivePage('inventory')}><PackageSearch size={18} />库存</button>
      </div>
      <h2>今日待办</h2>
      <TaskCard title="DL20260508001" desc="上海拓明材料 · 冷轧钢板 SPCC · 200 KG" tone="warn" status="待签收" action="扫码签收" onClick={receipt} />
      <TaskCard title="DL20260508002" desc="昆山宏达冲压 · 半成品 A1 · 120 PCS" tone="info" status="待质检" action="录入质检" onClick={quality} />
      <TaskCard title="RT20260508001" desc="包装破损退货" tone="danger" status="退货" action="退货出库" onClick={returnOut} />
    </>
  );
}

function TaskCard({
  title,
  desc,
  tone,
  status,
  action,
  onClick
}: {
  title: string;
  desc: string;
  tone: 'info' | 'warn' | 'danger' | 'success';
  status: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <section className="task-card">
      <div className="task-title">{title}</div>
      <div className="task-sub">{desc}</div>
      <Pill tone={tone}>{status}</Pill>
      <button onClick={onClick}>{action}</button>
    </section>
  );
}

function PanelForm({
  description,
  children,
  primaryText,
  secondaryText,
  onPrimary,
  onSecondary,
  danger
}: {
  description: string;
  children?: ReactNode;
  primaryText: string;
  secondaryText?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  danger?: boolean;
}) {
  return (
    <div className="panel-form">
      <p>{description}</p>
      {children}
      <AppButton danger={danger} variant="primary" onClick={onPrimary}>{primaryText}</AppButton>
      {secondaryText && onSecondary && <AppButton onClick={onSecondary}>{secondaryText}</AppButton>}
    </div>
  );
}

declare global {
  interface Window {
    __warehouseToastTimer?: number;
  }
}
