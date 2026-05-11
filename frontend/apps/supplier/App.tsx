/*
 * 供应商端应用主组件，负责供应商工作台、报价、订单、送货、退货和对账页面编排。
 */

import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { loginSupplier, logoutSupplier, registerSupplier } from '../../src/api/supplier/auth';
import { AppButton } from '../../src/components/form/AppButton';
import { Field, FormPreview } from '../../src/components/form/Field';
import { Pill } from '../../src/components/status-tag/Pill';
import { SimpleTable } from '../../src/components/table/SimpleTable';
import type { LoginResponse } from '../../src/types/common/auth';
import { clearSupplierSession, loadSupplierSession, saveSupplierSession } from './auth/session';
import { MainLayout } from './layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { supplierRouteMeta, supplierRoutes, type SupplierPageKey } from './routes';

type ModalState = { title: string; body: ReactNode; okText?: string } | null;
type DrawerState = { title: string; rows: Array<[string, string]>; actions?: ReactNode } | null;

export function App() {
  const [activePage, setActivePage] = useState<SupplierPageKey>('dashboard');
  const [session, setSession] = useState<LoginResponse | null>(() => loadSupplierSession());
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState<ModalState>(null);
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const meta = supplierRouteMeta[activePage];
  const currentUsername = session?.user.username || session?.user.phone || '-';

  const notify = (message: string) => {
    setToast(message);
    window.clearTimeout(window.__supplierToastTimer);
    window.__supplierToastTimer = window.setTimeout(() => setToast(''), 2200);
  };

  const handleLogin = async (phone: string, password: string) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const nextSession = await loginSupplier({ phone, password });
      saveSupplierSession(nextSession);
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
      const nextSession = await registerSupplier(payload);
      saveSupplierSession(nextSession);
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
      await logoutSupplier(session.user.phone).catch(() => undefined);
    }
    clearSupplierSession();
    setSession(null);
    setActivePage('dashboard');
    notify('已退出登录');
  };

  const openOrder = (orderNo: string) => {
    setDrawer({
      title: `订单 ${orderNo}`,
      rows: [
        ['物料', '冷轧钢板 SPCC'],
        ['数量', '200 KG'],
        ['交期', '2026-05-12'],
        ['送货模式', '送瑞利杰仓库']
      ],
      actions: (
        <div className="drawer-actions">
          <AppButton variant="primary" onClick={() => notify('订单已确认')}>
            确认订单
          </AppButton>
          <AppButton onClick={() => setModal({ title: '申请变更', body: <p>填写变更原因和新交期。</p>, okText: '提交变更' })}>
            申请变更
          </AppButton>
        </div>
      )
    });
  };

  if (!session) {
    return (
      <>
        <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
        <LoginPage loading={authLoading} error={authError} onSubmit={handleLogin} onRegister={handleRegister} />
      </>
    );
  }

  return (
    <>
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
      {modal && (
        <div className="modal-mask" onClick={() => setModal(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h2>{modal.title}</h2>
            <div>{modal.body}</div>
            <div className="modal-actions">
              <AppButton onClick={() => setModal(null)}>取消</AppButton>
              <AppButton
                variant="primary"
                onClick={() => {
                  setModal(null);
                  notify(`${modal.okText || '确认'}成功`);
                }}
              >
                {modal.okText || '确认'}
              </AppButton>
            </div>
          </div>
        </div>
      )}
      <aside className={`drawer ${drawer ? 'show' : ''}`}>
        {drawer && (
          <>
            <button className="drawer-close" onClick={() => setDrawer(null)} aria-label="关闭详情">
              <X size={18} />
            </button>
            <h2>{drawer.title}</h2>
            <p>这里展示供应商订单详情、状态流和下一步操作。</p>
            {drawer.rows.map(([label, value]) => (
              <div className="drawer-row" key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </div>
            ))}
            {drawer.actions}
          </>
        )}
      </aside>
      <MainLayout
        activePage={activePage}
        routes={supplierRoutes}
        title={meta.title}
        sub={meta.sub}
        currentUsername={currentUsername}
        onNavigate={setActivePage}
        onSearch={() => setModal({ title: '搜索结果', body: <p>模拟搜索到：询价单 INQ20260508001、订单 PO20260508001。</p>, okText: '打开结果' })}
        onNotifications={() =>
          setModal({
            title: '消息通知',
            body: <p>你有 9 个待确认订单、14 个待发货订单。</p>,
            okText: '全部已读'
          })
        }
        onUser={() =>
          setModal({
            title: '用户中心',
            body: (
              <div className="mini-profile">
                <p>当前用户：{currentUsername}</p>
                <p>登录账号：{session.user.phone}</p>
                <p>企业端：供应商门户</p>
                <AppButton variant="primary" onClick={handleLogout}>退出登录</AppButton>
              </div>
            ),
            okText: '关闭'
          })
        }
      >
        <PageContent page={activePage} notify={notify} setActivePage={setActivePage} setModal={setModal} setDrawer={setDrawer} openOrder={openOrder} />
      </MainLayout>
    </>
  );
}

function PageContent({
  page,
  notify,
  setActivePage,
  setModal,
  setDrawer,
  openOrder
}: {
  page: SupplierPageKey;
  notify: (message: string) => void;
  setActivePage: (page: SupplierPageKey) => void;
  setModal: (state: ModalState) => void;
  setDrawer: (state: DrawerState) => void;
  openOrder: (orderNo: string) => void;
}) {
  if (page === 'dashboard') {
    return (
      <>
        <div className="cards six">
          <Metric title="待报价" value="6" tone="warn" onClick={() => setActivePage('quote')} />
          <Metric title="待确认订单" value="9" tone="danger" onClick={() => setActivePage('order')} />
          <Metric title="待发货" value="14" tone="info" onClick={() => setActivePage('delivery')} />
          <Metric title="送货中" value="8" tone="info" onClick={() => setActivePage('delivery')} />
          <Metric title="待处理退货" value="2" tone="danger" onClick={() => setActivePage('return')} />
          <Metric title="待确认对账" value="3" tone="success" onClick={() => setActivePage('recon')} />
        </div>
        <div className="grid-half">
          <section className="card">
            <h2>待确认订单</h2>
            <div className="list">
              <ListAction label="PO20260508001 · 冷轧钢板 SPCC" pill={<Pill tone="warn">待确认</Pill>} onClick={() => openOrder('PO20260508001')} />
              <ListAction label="PO20260508005 · 镀锌板 DX51D" pill={<Pill tone="warn">待确认</Pill>} onClick={() => openOrder('PO20260508005')} />
            </div>
          </section>
          <section className="card">
            <h2>下一步建议</h2>
            <p className="muted-text">14 个订单可创建送货单。请优先处理今日到期订单。</p>
            <AppButton variant="primary" onClick={() => setActivePage('delivery')}>立即创建送货单</AppButton>
          </section>
        </div>
      </>
    );
  }

  if (page === 'quote') {
    return (
      <>
        <Toolbar>
          <AppButton
            variant="primary"
            onClick={() => setModal({ title: '提交报价', body: <FormPreview fields={['单价：8.20', '交期：5 天', 'MOQ：200 KG']} />, okText: '提交报价' })}
          >
            立即报价
          </AppButton>
          <AppButton onClick={() => notify('已上传报价附件')}>上传附件</AppButton>
        </Toolbar>
        <SimpleTable
          headers={['询价单', '物料', '数量', '截止时间', '状态', '操作']}
          rows={[[<b>INQ20260508001</b>, '冷轧钢板 SPCC', '200 KG', '2026-05-10', <Pill tone="warn">待报价</Pill>, <AppButton variant="primary" onClick={() => setModal({ title: '提交报价', body: <p>填写报价、交期、MOQ、付款条件和附件。</p>, okText: '提交报价' })}>报价</AppButton>]]}
          onRowClick={() => setDrawer({ title: '询价单 INQ20260508001', rows: [['物料', '冷轧钢板 SPCC'], ['数量', '200 KG'], ['截止', '2026-05-10']] })}
        />
      </>
    );
  }

  if (page === 'order') {
    return (
      <>
        <Toolbar>
          <AppButton variant="primary" onClick={() => notify('已批量确认订单')}>批量确认</AppButton>
          <AppButton onClick={() => notify('已导出订单')}>导出</AppButton>
        </Toolbar>
        <SimpleTable
          headers={['订单号', '物料', '数量', '交期', '送货模式', '状态', '操作']}
          rows={[[<b>PO20260508001</b>, '冷轧钢板 SPCC', '200 KG', '2026-05-12', '送瑞利杰仓库', <Pill tone="warn">待确认</Pill>, <AppButton variant="primary" onClick={() => notify('订单已确认')}>确认</AppButton>]]}
          onRowClick={() => openOrder('PO20260508001')}
        />
      </>
    );
  }

  if (page === 'delivery') {
    return (
      <div className="grid-half">
        <section className="card">
          <h2>创建送货单</h2>
          <div className="form-grid">
            <Field label="订单号" value="PO20260508001" />
            <Field label="本次送货数量" value="200 KG" />
            <Field label="预计到货" value="2026-05-12 10:00" />
            <Field label="物流公司" value="顺丰" />
            <Field label="车牌号" value="沪A12345" />
            <Field label="送货模式" value="送瑞利杰仓库" />
          </div>
          <AppButton variant="primary" onClick={() => notify('送货单 DL20260508018 已创建')}>提交送货单</AppButton>
        </section>
        <section className="card">
          <h2>签收结果</h2>
          <div className="list">
            <ListAction label="DL20260508009 · 短缺 5 KG" pill={<Pill tone="danger">差异</Pill>} onClick={() => setDrawer({ title: '签收结果 DL20260508009', rows: [['送货数量', '200 KG'], ['签收数量', '195 KG'], ['差异', '短缺 5 KG']] })} />
            <ListAction label="DL20260508011 · 已入库" pill={<Pill tone="success">完成</Pill>} onClick={() => notify('打开签收结果')} />
          </div>
        </section>
      </div>
    );
  }

  if (page === 'process') {
    return <SimpleTable headers={['任务号', '输入物料', '输出物料', '数量', '状态', '操作']} rows={[[<b>CUT20260508001</b>, '卷料 A', '规格 B/C', '500 KG', <Pill tone="info">待反馈</Pill>, <AppButton variant="primary" onClick={() => setModal({ title: '分切反馈', body: <p>录入产出数量、损耗和照片。</p>, okText: '提交反馈' })}>反馈</AppButton>]]} />;
  }

  if (page === 'return') {
    return <SimpleTable headers={['退货单', '原送货单', '物料', '原因', '状态', '操作']} rows={[[<b>RT20260508001</b>, 'DL20260507009', '包材纸箱', '包装破损', <Pill tone="danger">待确认</Pill>, <AppButton variant="primary" onClick={() => notify('已确认接收退货')}>确认接收</AppButton>]]} onRowClick={() => setDrawer({ title: '退货单 RT20260508001', rows: [['原送货单', 'DL20260507009'], ['原因', '包装破损'], ['退货数量', '20 PCS']] })} />;
  }

  if (page === 'recon') {
    return <SimpleTable headers={['对账单', '周期', '数量', '金额', '状态', '操作']} rows={[[<b>REC202605</b>, '2026-05', '12 单', '¥82,600', <Pill tone="warn">待确认</Pill>, <AppButton variant="primary" onClick={() => notify('对账已确认')}>确认</AppButton>]]} />;
  }

  return (
    <div className="grid-half">
      <section className="card">
        <h2>企业信息</h2>
        <div className="form-grid">
          <Field label="供应商名称" value="上海拓明材料" />
          <Field label="联系人" value="张经理" />
          <Field label="电话" value="13800000000" />
          <Field label="发货地址" value="上海市青浦区 XX 路" full />
        </div>
        <AppButton variant="primary" onClick={() => notify('资料已保存')}>保存资料</AppButton>
      </section>
      <section className="card">
        <h2>资质附件</h2>
        <div className="list">
          <ListAction label="营业执照" pill={<Pill tone="success">有效</Pill>} onClick={() => notify('打开营业执照')} />
          <ListAction label="质量认证" pill={<Pill tone="warn">30 天后到期</Pill>} onClick={() => notify('打开质量认证')} />
        </div>
      </section>
    </div>
  );
}

function Metric({ title, value, tone, onClick }: { title: string; value: string; tone: 'info' | 'warn' | 'danger' | 'success'; onClick: () => void }) {
  return (
    <button className="card click" onClick={onClick}>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      <Pill tone={tone}>待办</Pill>
    </button>
  );
}

function Toolbar({ children }: { children: ReactNode }) {
  return <div className="toolbar">{children}</div>;
}

function ListAction({ label, pill, onClick }: { label: string; pill: ReactNode; onClick: () => void }) {
  return (
    <button className="list-item" onClick={onClick}>
      <span>{label}</span>
      {pill}
    </button>
  );
}

declare global {
  interface Window {
    __supplierToastTimer?: number;
  }
}
