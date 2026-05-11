// 扫码收货页面，负责识别送货单码并进入签收流程。
Page({
  scan() {
    wx.showModal({
      title: '扫码识别',
      content: '模拟扫码成功：DL20260508001',
      confirmText: '进入签收'
    });
  }
});
