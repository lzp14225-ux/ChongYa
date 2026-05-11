/*
 * 瑞利杰内部端应用主组件，负责页面状态、登录后工作台交互、弹窗和抽屉编排。
 */

import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { AppButton } from '../../src/components/form/AppButton';
import { Field, FormPreview } from '../../src/components/form/Field';
import { Pill, type PillTone } from '../../src/components/status-tag/Pill';
import { SimpleTable } from '../../src/components/table/SimpleTable';
import { loginRuilijie, logoutRuilijie, registerRuilijie } from '../../src/api/ruilijie/auth';
import type { LoginResponse } from '../../src/types/ruilijie/auth';
import { clearRuilijieSession, loadRuilijieSession, saveRuilijieSession } from './auth/session';
import { MainLayout } from './layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { ruilijieRouteMeta, ruilijieRoutes, type RuilijiePageKey } from './routes';

type PageKey = RuilijiePageKey;

type DrawerState = {
  title: string;
  rows: Array<[string, string]>;
  actions?: ReactNode;
} | null;

type ModalState = {
  title: string;
  body: ReactNode;
  okText?: string;
  onOk?: () => void;
} | null;

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('缺少必填环境变量：VITE_API_BASE_URL，请在 frontend/.env 中配置');
}

export function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [session, setSession] = useState<LoginResponse | null>(() => loadRuilijieSession());
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState<ModalState>(null);
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const meta = ruilijieRouteMeta[activePage];
  const currentUsername = session?.user.username || session?.user.phone || '-';

  const notify = (message: string) => {
    setToast(message);
    window.clearTimeout(window.__ruilijieToastTimer);
    window.__ruilijieToastTimer = window.setTimeout(() => setToast(''), 2200);
  };

  const openOrder = (orderNo: string) => {
    setDrawer({
      title: `采购订单 ${orderNo}`,
      rows: [
        ['供应商', '上海拓明材料'],
        ['物料', '冷轧钢板 SPCC'],
        ['数量', '200 KG'],
        ['送货模式', '送瑞利杰仓库'],
        ['状态', '待供应商确认']
      ],
      actions: (
        <div className="drawer-actions">
          <AppButton variant="primary" onClick={() => notify('已发送催确认通知')}>
            催确认
          </AppButton>
          <AppButton onClick={() => notify('已打开订单变更')}>订单变更</AppButton>
        </div>
      )
    });
  };

  const context = useMemo(
    () => ({
      notify,
      setActivePage,
      setModal,
      setDrawer,
      openOrder
    }),
    []
  );

  const handleLogin = async (phone: string, password: string) => {
    setLoginError('');
    setLoginLoading(true);
    try {
      const nextSession = await loginRuilijie({ phone, password });
      saveRuilijieSession(nextSession);
      setSession(nextSession);
      notify('登录成功');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : '登录失败，请稍后重试');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (payload: { phone: string; username: string; password: string; position: string }) => {
    setLoginError('');
    setLoginLoading(true);
    try {
      const nextSession = await registerRuilijie(payload);
      saveRuilijieSession(nextSession);
      setSession(nextSession);
      notify('注册成功');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : '注册失败，请稍后重试');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (session?.user.phone) {
      await logoutRuilijie(session.user.phone).catch(() => undefined);
    }
    clearRuilijieSession();
    setSession(null);
    setActivePage('dashboard');
    setModal(null);
    notify('已退出登录');
  };

  if (!session) {
    return (
      <>
        <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
        <LoginPage loading={loginLoading} error={loginError} onSubmit={handleLogin} onRegister={handleRegister} />
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
                  if (modal.onOk) {
                    modal.onOk();
                    return;
                  }
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
            <p>这里展示状态流、操作记录和下一步动作，后续可对接真实接口。</p>
            <div>
              {drawer.rows.map(([label, value]) => (
                <div className="drawer-row" key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                </div>
              ))}
            </div>
            {drawer.actions}
          </>
        )}
      </aside>
      <MainLayout
        activePage={activePage}
        routes={ruilijieRoutes}
        title={meta.title}
        sub={meta.sub}
        currentUsername={currentUsername}
        onNavigate={setActivePage}
        onSearch={() =>
          setModal({
            title: '搜索结果',
            body: <p>模拟搜索到：采购订单 PO20260508001、送货单 DL20260508001、供应商 上海拓明材料。</p>,
            okText: '打开结果'
          })
        }
        onNotifications={() =>
          setModal({
            title: '消息通知',
            body: <p>你有 2 个订单超时未确认、1 个退货待审批。</p>,
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
                <p>用户名：{currentUsername}</p>
                <p>接口地址：{apiBaseUrl}</p>
              </div>
            ),
            okText: '退出登录',
            onOk: handleLogout
          })
        }
      >
        <PageContent page={activePage} ctx={context} />
      </MainLayout>
    </>
  );
}

function PageContent({
  page,
  ctx
}: {
  page: PageKey;
  ctx: {
    notify: (message: string) => void;
    setActivePage: (page: PageKey) => void;
    setModal: (state: ModalState) => void;
    setDrawer: (state: DrawerState) => void;
    openOrder: (orderNo: string) => void;
  };
}) {
  if (page === 'dashboard') return <Dashboard ctx={ctx} />;
  if (page === 'requisition') return <Requisition ctx={ctx} />;
  if (page === 'decision') return <Decision ctx={ctx} />;
  if (page === 'inquiry') return <Inquiry ctx={ctx} />;
  if (page === 'approval') return <Approval ctx={ctx} />;
  if (page === 'order') return <Orders ctx={ctx} />;
  if (page === 'delivery') return <Delivery ctx={ctx} />;
  if (page === 'outsourcing') return <Outsourcing ctx={ctx} />;
  if (page === 'exception') return <ExceptionPage ctx={ctx} />;
  if (page === 'report') return <Reports ctx={ctx} />;
  return <SettingsPage ctx={ctx} />;
}

function Dashboard({ ctx }: PageProps) {
  return (
    <>
      <div className="cards four">
        <MetricCard title="待采购处理" value="18" tone="info" pill="较昨日 +3" onClick={() => ctx.setActivePage('requisition')} />
        <MetricCard title="待价格审批" value="7" tone="warn" pill="需今日处理" onClick={() => ctx.setActivePage('approval')} />
        <MetricCard title="待供应商确认" value="12" tone="danger" pill="2 单已超时" onClick={() => ctx.setActivePage('delivery')} />
        <MetricCard title="异常待处理" value="5" tone="danger" pill="含 1 单退货" onClick={() => ctx.setActivePage('exception')} />
      </div>
      <div className="grid-2">
        <section className="card">
          <div className="section-title">
            <div>
              <h2>送货执行看板</h2>
              <p>跟踪订单从供应商确认到仓库签收入库</p>
            </div>
            <AppButton variant="primary" onClick={() => ctx.setActivePage('delivery')}>
              查看全部
            </AppButton>
          </div>
          <div className="state-grid">
            {[
              ['12', '待确认'],
              ['24', '待发货'],
              ['16', '送货中'],
              ['9', '待签收'],
              ['38', '已入库']
            ].map(([value, label]) => (
              <button className="state" key={label} onClick={() => ctx.notify(`筛选${label}`)}>
                <b>{value}</b>
                <span>{label}</span>
              </button>
            ))}
          </div>
          <OrdersTable openOrder={ctx.openOrder} compact />
        </section>
        <section className="card">
          <h2>风险预警</h2>
          <div className="list">
            <ListAction
              label="供应商超时未确认"
              pill={<Pill tone="danger">2 单</Pill>}
              onClick={() =>
                ctx.setDrawer({
                  title: '供应商超时未确认',
                  rows: [
                    ['数量', '2 单'],
                    ['建议', '立即催办供应商']
                  ]
                })
              }
            />
            <ListAction label="预计今日到货" pill={<Pill tone="warn">9 单</Pill>} onClick={() => ctx.notify('已筛选今日到货')} />
            <ListAction label="分切数量待校验" pill={<Pill tone="info">3 单</Pill>} onClick={() => ctx.setActivePage('outsourcing')} />
            <ListAction label="退货待审批" pill={<Pill tone="danger">1 单</Pill>} onClick={() => ctx.setActivePage('exception')} />
          </div>
        </section>
      </div>
    </>
  );
}

type PageProps = {
  ctx: {
    notify: (message: string) => void;
    setActivePage: (page: PageKey) => void;
    setModal: (state: ModalState) => void;
    setDrawer: (state: DrawerState) => void;
    openOrder: (orderNo: string) => void;
  };
};

function Requisition({ ctx }: PageProps) {
  return (
    <>
      <Toolbar>
        <AppButton
          variant="primary"
          onClick={() =>
            ctx.setModal({
              title: '新建请购',
              body: <FormPreview fields={['物料：冷轧钢板 SPCC', '数量：200 KG', '需求日期：2026-05-12']} />,
              okText: '提交请购'
            })
          }
        >
          新建请购
        </AppButton>
        <AppButton onClick={() => ctx.notify('已导入 Excel')}>导入需求</AppButton>
        <AppButton onClick={() => ctx.notify('已导出列表')}>导出</AppButton>
        <span className="filter">状态：待采购处理</span>
        <span className="filter">部门：全部</span>
      </Toolbar>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>请购单号</th>
              <th>申请部门</th>
              <th>物料</th>
              <th>数量</th>
              <th>需求日期</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              onClick={() =>
                ctx.setDrawer({
                  title: '请购单 REQ20260508001',
                  rows: [
                    ['申请部门', '计划部'],
                    ['物料', '冷轧钢板 SPCC'],
                    ['数量', '200 KG'],
                    ['状态', '待采购处理']
                  ]
                })
              }
            >
              <td>
                <b>REQ20260508001</b>
              </td>
              <td>计划部</td>
              <td>冷轧钢板 SPCC</td>
              <td>200 KG</td>
              <td>2026-05-12</td>
              <td>
                <Pill tone="info">待采购处理</Pill>
              </td>
              <td>
                <AppButton onClick={() => ctx.setActivePage('decision')}>转采购决策</AppButton>
              </td>
            </tr>
            <tr>
              <td>
                <b>REQ20260508002</b>
              </td>
              <td>生产部</td>
              <td>半成品 A1</td>
              <td>120 PCS</td>
              <td>2026-05-18</td>
              <td>
                <Pill tone="warn">资料待补充</Pill>
              </td>
              <td>
                <AppButton onClick={() => ctx.notify('已退回补充')}>退回</AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function Decision({ ctx }: PageProps) {
  return (
    <div className="grid-half">
      <section className="card">
        <h2>待决策物料</h2>
        <div className="list">
          <ListAction
            label="冷轧钢板 SPCC · 200 KG"
            pill={<Pill tone="warn">待决策</Pill>}
            onClick={() =>
              ctx.setDrawer({
                title: '冷轧钢板 SPCC 决策详情',
                rows: [
                  ['历史采购', '有'],
                  ['推荐供应商', '上海拓明材料'],
                  ['库存', '不足'],
                  ['建议', '重新询价或沿用历史供应商']
                ]
              })
            }
          />
          <ListAction label="半成品 A1 · 120 PCS" pill={<Pill tone="info">客户指定</Pill>} onClick={() => ctx.notify('已选择客户指定流程')} />
        </div>
      </section>
      <section className="card">
        <h2>采购策略</h2>
        <div className="form-grid">
          <Field label="来源判断" value="自行购买" />
          <Field label="下单方式" value="发起询价" />
          <Field label="风险等级" value="中" />
          <Field label="决策说明" value="历史价格波动较大，建议询价后进入价格审批。" full />
        </div>
        <AppButton variant="primary" onClick={() => ctx.setActivePage('inquiry')}>
          发起询价
        </AppButton>
      </section>
    </div>
  );
}

function Inquiry({ ctx }: PageProps) {
  return (
    <>
      <Toolbar>
        <AppButton
          variant="primary"
          onClick={() =>
            ctx.setModal({
              title: '新建询价',
              body: <p>将冷轧钢板 SPCC 发送给 3 家候选供应商。</p>,
              okText: '发布询价'
            })
          }
        >
          新建询价
        </AppButton>
        <AppButton onClick={() => ctx.notify('已催报价')}>催报价</AppButton>
        <span className="filter">报价截止：3 天内</span>
      </Toolbar>
      <div className="grid-half">
        <section className="card">
          <h2>询价单列表</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>询价单号</th>
                  <th>物料</th>
                  <th>候选供应商</th>
                  <th>已报价</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  onClick={() =>
                    ctx.setDrawer({
                      title: '询价单 INQ20260508001',
                      rows: [
                        ['物料', '冷轧钢板 SPCC'],
                        ['候选供应商', '3 家'],
                        ['已报价', '2 家'],
                        ['截止', '2026-05-10']
                      ]
                    })
                  }
                >
                  <td>
                    <b>INQ20260508001</b>
                  </td>
                  <td>冷轧钢板 SPCC</td>
                  <td>3</td>
                  <td>2</td>
                  <td>
                    <Pill tone="warn">待报价</Pill>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="card">
          <h2>报价比价</h2>
          <SimpleTable
            headers={['供应商', '单价', '交期', '建议']}
            rows={[
              ['上海拓明', '¥8.20', '5 天', <Pill tone="success">推荐</Pill>],
              ['苏州精密', '¥8.45', '4 天', <Pill tone="info">备选</Pill>]
            ]}
          />
          <AppButton variant="primary" onClick={() => ctx.setActivePage('approval')}>
            提交价格审批
          </AppButton>
        </section>
      </div>
    </>
  );
}

function Approval({ ctx }: PageProps) {
  return (
    <>
      <Toolbar>
        <span className="filter">状态：待审批</span>
        <span className="filter">风险：中高</span>
      </Toolbar>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>审批单</th>
              <th>物料</th>
              <th>供应商</th>
              <th>价格</th>
              <th>风险</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              onClick={() =>
                ctx.setDrawer({
                  title: '价格审批 PA20260508001',
                  rows: [
                    ['物料', '冷轧钢板 SPCC'],
                    ['供应商', '上海拓明'],
                    ['价格', '¥8.20/KG'],
                    ['历史价', '¥7.95/KG'],
                    ['风险', '上涨 3.1%']
                  ]
                })
              }
            >
              <td>
                <b>PA20260508001</b>
              </td>
              <td>冷轧钢板 SPCC</td>
              <td>上海拓明</td>
              <td>¥8.20/KG</td>
              <td>
                <Pill tone="warn">中</Pill>
              </td>
              <td>
                <AppButton variant="primary" onClick={() => ctx.notify('审批通过')}>
                  通过
                </AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function Orders({ ctx }: PageProps) {
  return (
    <>
      <Toolbar>
        <AppButton
          variant="primary"
          onClick={() =>
            ctx.setModal({
              title: '新建采购订单',
              body: <p>从已审批价格生成采购订单。</p>,
              okText: '生成订单'
            })
          }
        >
          新建订单
        </AppButton>
        <AppButton onClick={() => ctx.notify('已批量下发供应商')}>批量下发</AppButton>
      </Toolbar>
      <OrdersTable openOrder={ctx.openOrder} />
    </>
  );
}

function Delivery({ ctx }: PageProps) {
  const lanes = [
    ['待确认', 'PO20260508001', '上海拓明 · 冷轧钢板', '待确认', 'warn'],
    ['待发货', 'PO20260508005', '镀锌板 · 500 KG', '待发货', 'info'],
    ['送货中', 'DL20260508002', '顺丰 SF123456', '在途', 'info'],
    ['待签收', 'DL20260508003', '送分切厂，已超时', '待签收', 'danger']
  ] as const;

  return (
    <div className="kanban">
      {lanes.map(([lane, code, desc, status, tone]) => (
        <section className="lane" key={lane}>
          <h3>{lane}</h3>
          <button className="mini-card" onClick={() => (code.startsWith('PO') ? ctx.openOrder(code) : ctx.notify(`打开${code}`))}>
            <b>{code}</b>
            <span>{desc}</span>
            <Pill tone={tone}>{status}</Pill>
          </button>
        </section>
      ))}
    </div>
  );
}

function Outsourcing({ ctx }: PageProps) {
  return (
    <>
      <Toolbar>
        <AppButton
          variant="primary"
          onClick={() =>
            ctx.setModal({
              title: '新建分切任务',
              body: <p>原材料卷料 A 分切为规格 B/C。</p>,
              okText: '创建任务'
            })
          }
        >
          新建分切任务
        </AppButton>
        <AppButton onClick={() => ctx.notify('已校验数量平衡')}>批量校验</AppButton>
      </Toolbar>
      <SimpleTable
        headers={['任务号', '母件', '子件', '分切厂', '损耗率', '状态']}
        rows={[[<b>CUT20260508001</b>, '卷料 A', '规格 B/C', '苏州分切厂', '1%', <Pill tone="success">平衡</Pill>]]}
        onRowClick={() =>
          ctx.setDrawer({
            title: '分切任务 CUT20260508001',
            rows: [
              ['母件', '卷料 A 500KG'],
              ['子件', '规格 B 300KG / 规格 C 195KG'],
              ['损耗', '5KG'],
              ['损耗率', '1%']
            ]
          })
        }
      />
    </>
  );
}

function ExceptionPage({ ctx }: PageProps) {
  return (
    <>
      <div className="cards three">
        <MetricCard title="数量异常" value="3" />
        <MetricCard title="质量异常" value="1" />
        <MetricCard title="退货中" value="1" />
      </div>
      <SimpleTable
        headers={['异常单', '来源单据', '原因', '责任方', '状态', '操作']}
        rows={[
          [
            <b>EX20260508001</b>,
            'DL20260507009',
            '包装破损',
            '供应商',
            <Pill tone="danger">待审批退货</Pill>,
            <AppButton variant="primary" danger onClick={() => ctx.notify('退货审批通过')}>
              审批退货
            </AppButton>
          ]
        ]}
        onRowClick={() =>
          ctx.setDrawer({
            title: '异常单 EX20260508001',
            rows: [
              ['来源', 'DL20260507009'],
              ['原因', '包装破损'],
              ['责任方', '供应商'],
              ['处理建议', '退货']
            ]
          })
        }
      />
    </>
  );
}

function Reports({ ctx }: PageProps) {
  return (
    <>
      <div className="cards three">
        <MetricCard title="准时交付率" value="92%" onClick={() => ctx.notify('打开采购履约报表')} />
        <MetricCard title="供应商平均分" value="86" onClick={() => ctx.notify('打开供应商绩效')} />
        <MetricCard title="本月异常率" value="3.2%" onClick={() => ctx.notify('打开异常分析')} />
      </div>
      <div className="report-panel">
        <div className="chart-bars">
          {[58, 76, 64, 88, 70, 92, 84].map((height, index) => (
            <span key={height} style={{ height: `${height}%` }}>
              {index + 1}
            </span>
          ))}
        </div>
        <div>
          <h2>供应商履约趋势</h2>
          <p>后续可接入采购履约、供应商绩效、异常原因统计等真实报表接口。</p>
        </div>
      </div>
    </>
  );
}

function SettingsPage({ ctx }: PageProps) {
  return (
    <div className="grid-half">
      <section className="card">
        <h2>配置项</h2>
        <div className="list">
          {['角色权限', '审批流', '原因码字典', '送货模式'].map((item) => (
            <ListAction key={item} label={item} pill={<span>›</span>} onClick={() => ctx.notify(`打开${item}配置`)} />
          ))}
        </div>
      </section>
      <section className="card">
        <h2>新增配置</h2>
        <div className="form-grid">
          <Field label="配置名称" value="退货原因" />
          <Field label="状态" value="启用" />
          <Field label="说明" value="用于异常退货原因归类" full />
        </div>
        <AppButton variant="primary" onClick={() => ctx.notify('配置已保存')}>
          保存配置
        </AppButton>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  pill,
  tone = 'info',
  onClick
}: {
  title: string;
  value: string;
  pill?: string;
  tone?: PillTone;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      {pill && <Pill tone={tone}>{pill}</Pill>}
    </>
  );

  if (onClick) {
    return (
      <button className="card click" onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className="card">{content}</div>;
}

function OrdersTable({ openOrder, compact }: { openOrder: (orderNo: string) => void; compact?: boolean }) {
  return (
    <div className="table-wrap order-table">
      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>供应商</th>
            <th>物料</th>
            {!compact && <th>订单数量</th>}
            <th>送货模式</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr onClick={() => openOrder('PO20260508001')}>
            <td>
              <b>PO20260508001</b>
            </td>
            <td>上海拓明材料</td>
            <td>冷轧钢板 SPCC</td>
            {!compact && <td>200 KG</td>}
            <td>送瑞利杰仓库</td>
            <td>
              <Pill tone="warn">待供应商确认</Pill>
            </td>
          </tr>
          <tr onClick={() => openOrder('PO20260508002')}>
            <td>
              <b>PO20260508002</b>
            </td>
            <td>昆山宏达冲压</td>
            <td>半成品 A1</td>
            {!compact && <td>120 PCS</td>}
            <td>送其他供应商</td>
            <td>
              <Pill tone="info">送货中</Pill>
            </td>
          </tr>
          <tr onClick={() => openOrder('PO20260508003')}>
            <td>
              <b>PO20260508003</b>
            </td>
            <td>苏州精密金属</td>
            <td>原材料卷料</td>
            {!compact && <td>500 KG</td>}
            <td>送分切厂</td>
            <td>
              <Pill tone="danger">待签收</Pill>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
    __ruilijieToastTimer?: number;
  }
}
