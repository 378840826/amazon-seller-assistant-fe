// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/queryNotices': {
    status: 0,
    data: {
      unreadNotices: {
        reviewRemindCount: 10,
        stockRemindCount: 2,
      },
    },
    msg: '成功',
  },
};
