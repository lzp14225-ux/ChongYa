// 收货任务页面，展示待签收任务并提供签收入口。
Page({
  data: {
    tasks: [
      { code: 'DL20260508001', desc: '冷轧钢板 SPCC · 200 KG', status: '待签收' },
      { code: 'DL20260508002', desc: '半成品 A1 · 120 PCS', status: '待质检' }
    ]
  },
  receive() {
    wx.showToast({ title: '签收成功', icon: 'success' });
  }
});
