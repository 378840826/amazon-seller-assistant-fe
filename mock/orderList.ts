import Mock from 'mockjs';

const random = Mock.Random;

export default {
  'GET /api/mws/order/lists': Mock.mock({
    code: 200,
    name: 123,
    data: {
      'total|500-200': 1,
      name: 456,
      size: function() {
        return 50;
      }, // 分页大写
      'current|1-10': 1, // 当前页
      'pages|500-1000': 1,
      'recores|1-20': [
        {
          purchaseDate: random.now(),
          orderId: random.natural().toString(),
          orderStatus: 'Shipping',
          'isBusinessOrder|1': true,
          'orderDetails|1-10': [
            {
              deliverStatus: 'Cancelled', // 发货状态
              deliverMethod: 'FBA', // 发货方式
              productName: random.upper(random.title(5, 200)), // 标题
              asin: random.word(10, 14),
              sku: random.word(10, 14),
              'quantity|1-99999': 2222, // 商品数量
              'price|1-299999': 252525, // 价格合计
              'itemPromotionDiscount|2-200.2-3': 1, // 价格优惠
              'shippingPrice|1-5000': 1, // 配送费
              'shipPromotionDiscount|5-2000': 1, // 配送费优惠
              'actualAmount|50-99999999': 1, // 实付金额
              'unitPrice|1-10000': 1, // 单价
              shipServiceLevel: 'Expedited', // 配送服务
              imgUrl: random.image('80x80'),
            },
          ],
          'buyerMessage': {
            buyerName: random.name(),	// 买家名称
            addresseeName: random.cname(),	// 收件人名称
            detailedAddress: '中华人民共和国',	// 详细地址
            shipCity: random.city(),	// 收货地址   市
            shipState: random.county(),	// 收货地址   州	
            shipCountry: '中国',	// 收货地址    国
            tel: random.natural(),
            shipPostalCode: random.zip(), // 邮编
          },
        },
      ],
    },
  }),
};
