// 质检处理页面，负责录入合格、不合格和异常结果。
Page({
  pass() {
    wx.showToast({ title: '质检合格', icon: 'success' });
  }
});
