// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    status: 0,
    data: {
      username: 'Serati Ma',
      userid: '00000001',
      email: 'antdesign@alipay.com',
    },
    msg: '成功',
  },
};
