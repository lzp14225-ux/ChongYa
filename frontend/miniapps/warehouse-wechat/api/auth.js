// 仓库微信小程序认证 API，负责登录、注册和退出。
const { request } = require('./request');

function loginWarehouse(data) {
  return request('/warehouse/auth/login', {
    method: 'POST',
    data
  });
}

function registerWarehouse(data) {
  return request('/warehouse/auth/register', {
    method: 'POST',
    data
  });
}

function logoutWarehouse(phone) {
  return request('/warehouse/auth/logout', {
    method: 'POST',
    data: { phone }
  });
}

module.exports = {
  loginWarehouse,
  registerWarehouse,
  logoutWarehouse
};
