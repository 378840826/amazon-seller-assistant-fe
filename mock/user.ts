// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    status: 0,
    data: {
      id: 1,
      username: 'Serati Ma',
      email: 'a@b.com',
      phone: '10000',
      isMainAccount: false,
    },
    msg: '成功',
  },
};
