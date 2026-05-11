// 退货处理页面，负责退货签收和退货出库。
const { logoutWarehouse } = require('../../api/auth');

Page({
  returnOut() {
    wx.showToast({ title: '退货出库成功', icon: 'success' });
  },
  async logout() {
    const session = wx.getStorageSync('warehouse_session');
    if (session && session.user && session.user.phone) {
      await logoutWarehouse(session.user.phone).catch(() => undefined);
    }
    wx.removeStorageSync('warehouse_session');
    wx.redirectTo({ url: '/pages/login/index' });
  }
});
