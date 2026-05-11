// 仓库微信小程序登录注册页，负责调用后端仓库认证接口。
const { loginWarehouse, registerWarehouse } = require('../../api/auth');

Page({
  data: {
    mode: 'login',
    phone: '',
    username: '',
    password: '',
    position: 'warehouse_staff'
  },
  switchMode(event) {
    this.setData({ mode: event.currentTarget.dataset.mode });
  },
  updateField(event) {
    this.setData({ [event.currentTarget.dataset.field]: event.detail.value });
  },
  async submit() {
    try {
      const payload = {
        phone: this.data.phone,
        password: this.data.password
      };
      const session = this.data.mode === 'login'
        ? await loginWarehouse(payload)
        : await registerWarehouse({
          ...payload,
          username: this.data.username,
          position: this.data.position
        });
      wx.setStorageSync('warehouse_session', session);
      wx.showToast({
        title: this.data.mode === 'login' ? '登录成功' : '注册成功',
        icon: 'success'
      });
      wx.switchTab({ url: '/pages/dashboard/index' });
    } catch (error) {
      wx.showToast({
        title: error.message || '认证失败',
        icon: 'none'
      });
    }
  }
});
