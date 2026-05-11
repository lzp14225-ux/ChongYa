// 仓库工作台页面，展示待收货、待质检、待入库统计和今日任务。
Page({
  data: {
    stats: [
      { label: '待收货', value: 12 },
      { label: '待质检', value: 5 },
      { label: '待入库', value: 9 }
    ],
    tasks: [
      { code: 'DL20260508001', desc: '上海拓明材料 · 冷轧钢板 SPCC · 200 KG', status: '待签收' },
      { code: 'DL20260508002', desc: '昆山宏达冲压 · 半成品 A1 · 120 PCS', status: '待质检' }
    ]
  },
  goScan() {
    wx.switchTab({ url: '/pages/scan-receipts/index' });
  }
});
