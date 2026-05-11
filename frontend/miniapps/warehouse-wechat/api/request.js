// 仓库微信小程序请求封装，统一拼接 API 地址和处理 JSON 响应。
const { API_BASE_URL } = require('../config/env');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${path}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'content-type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      },
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.data);
          return;
        }
        reject(new Error(response.data && response.data.detail ? response.data.detail : `请求失败：${response.statusCode}`));
      },
      fail(error) {
        reject(error);
      }
    });
  });
}

module.exports = {
  request
};
