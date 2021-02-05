import { Response, Request } from 'express';

export default {
  // 更新时间
  'GET /api/gd/management/update-time': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: '2020-12-08 16:41:25 (太平洋时间)',
      });
    }, 500);
  },

  // 菜单树-广告活动
  'GET /api/gd/management/campaign/simple-list': (_: Request, res: Response) => {
    const records = [{
      id: 0,
      name: '广告活动-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H',
      state: 'enabled',
    }];
    for (let i = 1; i < 200; i++) {
      records.push({
        id: i,
        name: '广告活动-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H',
        state: 'enabled',
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          records,
          // records: [
          //   {
          //     id: String(Math.random()),
          //     name: '广告活动-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H',
          //     state: 'enabled',
          //   },
          //   {
          //     id: String(Math.random()),
          //     name: '广告活动-Headline_530032_530028_530031_530029_手套',
          //     state: 'paused',
          //   },
          //   {
          //     id: String(Math.random()),
          //     name: '广告活动3',
          //     state: 'archived',
          //   }, {
          //     id: String(Math.random()),
          //     name: '广告活动-530035-530039-530037-530036',
          //     state: 'archived',
          //   }, {
          //     id: String(Math.random()),
          //     name: '广告活动-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H',
          //     state: 'enabled',
          //   },
          //   {
          //     id: String(Math.random()),
          //     name: '广告活动-Headline_530032_530028_530031_530029_手套',
          //     state: 'paused',
          //   },
          //   {
          //     id: String(Math.random()),
          //     name: '广告活动3',
          //     state: 'archived',
          //   }, {
          //     id: String(Math.random()),
          //     name: '广告活动-530035-530039-530037-530036',
          //     state: 'archived',
          //   }, {
          //     id: String(Math.random()),
          //     name: '广告活动-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H',
          //     state: 'enabled',
          //   },
          //   {
          //     id: String(Math.random()),
          //     name: '广告活动-Headline_530032_530028_530031_530029_手套',
          //     state: 'paused',
          //   },
          //   {
          //     id: String(Math.random()),
          //     name: '广告活动3',
          //     state: 'archived',
          //   }, {
          //     id: String(Math.random()),
          //     name: '广告活动-530035-530039-530037-530036',
          //     state: 'archived',
          //   }, {
          //     id: String(Math.random()),
          //     name: '广告活动-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H',
          //     state: 'enabled',
          //   },
          //   {
          //     id: String(Math.random()),
          //     name: '广告活动-Headline_530032_530028_530031_530029_手套',
          //     state: 'paused',
          //   },
          //   {
          //     id: String(Math.random()),
          //     name: '广告活动3',
          //     state: 'archived',
          //   }, {
          //     id: String(Math.random()),
          //     name: '广告活动-530035-530039-530037-530036',
          //     state: 'archived',
          //   },
          // ],
        },
      });
    }, 0);
  },

  // 菜单树-广告组
  'GET /api/gd/management/campaign/simple-list/group': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          records: [
            {
              id: String(Math.random()),
              name: '广告组-530091_12_B07T7LYSBV_190620_hoseclamps',
              state: 'enabled',
            },
            {
              id: String(Math.random()),
              name: '广告组-2',
              state: 'paused',
            },
            {
              id: String(Math.random()),
              name: '广告组-3',
              state: 'archived',
            },
          ],
        },
      });
    }, 0);
  },

  // 标签页上的数目
  'GET /api/gd/management/campaign/child-count': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          campaignCount: Math.floor(Math.random() * 100),
          groupCount: Math.floor(Math.random() * 1000),
          adCount: Math.floor(Math.random() * 10000),
          keywordCount: 333,
          targetCount: 3333,
          neTargetCount: 33,
        },
      });
    }, 500);
  },
  
  // 广告活动
  // 广告活动-列表
  'POST /api/gd/management/campaign/list': (_: Request, res: Response) => {
    const records: API.IAdCampaign[] = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        id: String(index),
        name: `${index}-Headline_530032_530028_530031_530029_手套`,
        state: 'enabled',
        portfolioId: index % 2 + 1,
        portfolioName: '分组-1',
        groupCount: 10,
        type: 'SP',
        targetingType: 'manual',
        dailyBudget: 99999,
        negativeTargetCount: 12,
        impressions: 10010,
        clicks: 10010,
        spend: 10010,
        acos: 10010,
        roas: 10010,
        ctr: 10010,
        cpc: 10010,
        cpa: 10010,
        sales: 10010,
        orderNum: 10010,
        conversionsRate: 10010,
        biddingStrategy: 'autoForSales',
        biddingPlacementTop: 30,
        biddingPlacementProductPage: 31,
        createdTime: '2020-01-02 12:13:56',
        startTime: '2020-01-03 12:13:56',
        endTime: '2020-01-04 12:13:56',
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          page: {
            total: 122,
            size: 20,
            current: 3,
            records,
          },
          total: {
            impressions: 999999,
            clicks: 999999,
            spend: 999999,
            acos: 999999,
            roas: 999999,
            ctr: 999999,
            cpc: 999999,
            cpa: 999999,
            sales: 999999,
            orderNum: 999999,
            conversionsRate: 999999,
          },
        },
      });
    }, 500);
  },

  // 广告活动-portfolios
  'GET /api/gd/management/campaign/portfolio/list': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: [
          { id: 1, name: 'portfolio-1' },
          { id: 2, name: '字符字符字符字符字符字符字符字符字符字符' },
          { id: 3, name: 'portfolio-3' },
          { id: 4, name: 'portfolio-4' },
          { id: 5, name: 'portfolio-5' },
        ],
      });
    }, 500);
  },

  // 广告活动-批量修改状态
  'POST /api/gd/management/campaign/batchSetting': (req: Request, res: Response) => {
    const { body: { camIds, state } } = req;
    setTimeout(() => {
      const records = camIds.map((id: string) => ({ id, state }));
      res.send({
        code: 200,
        data: {
          records,
        },
        message: '修改成功',
      });
    }, 500);
  },

  // 广告活动-Portfolios添加
  'POST /api/gd/management/campaign/portfolio/add': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          id: 9,
          name: '新的分组',
        },
        message: '添加成功',
      });
    }, 500);
  },

  // 广告活动-Portfolios修改
  'POST /api/gd/management/campaign/portfolio/update': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '修改成功',
      });
    }, 500);
  },

  // 广告活动-修改
  'POST /api/gd/management/campaign/update': (req: Request, res: Response) => {
    const { body: { record } } = req;
    setTimeout(() => {
      res.send({
        code: 200,
        message: '修改成功',
        data: record,
      });
    }, 500);
  },

  // 广告组
  // 广告组-列表
  'POST /api/gd/management/group/list': (_: Request, res: Response) => {
    const records: API.IAdGroup[] = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        id: String(index),
        name: `广告组${index}-Headline_530032_530028_530031_530029`,
        camId: String(index),
        camName: `${index}-Headline_530032_530028_530031_530029_手套`,
        state: 'enabled',
        negativeTargetCount: 12,
        impressions: 10010,
        clicks: 10010,
        spend: 10010,
        acos: 10010,
        roas: 10010,
        ctr: 10010,
        cpc: 10010,
        cpa: 10010,
        sales: 10010,
        orderNum: 10010,
        conversionsRate: 10010,
        createdTime: '2020-01-02 12:13:56',
        startTime: '2020-01-03 12:13:56',
        endTime: '2020-01-04 12:13:56',
        targetCount: 10001,
        productCount: 10002,
        defaultBid: 0.99,
        budgetLimit: 2.5,
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          page: {
            total: 122,
            size: 20,
            current: 3,
            records,
          },
          total: {
            impressions: 899999,
            clicks: 899999,
            spend: 999999,
            acos: 999999,
            roas: 999999,
            ctr: 999999,
            cpc: 999999,
            cpa: 999999,
            sales: 999999,
            orderNum: 999999,
            conversionsRate: 999999,
          },
        },
      });
    }, 500);
  },

  // 广告组-修改
  'POST /api/gd/management/group/update': (req: Request, res: Response) => {
    const { body: { record } } = req;
    setTimeout(() => {
      res.send({
        code: 200,
        message: '修改成功',
        data: record,
      });
    }, 500);
  },

  // 广告组-批量修改状态
  'POST /api/gd/management/group/batchSetting': (req: Request, res: Response) => {
    const { body: { groupIds, state } } = req;
    setTimeout(() => {
      const records = groupIds.map((id: string) => ({ id, state }));
      res.send({
        code: 200,
        data: {
          records,
        },
        message: '修改成功',
      });
    }, 500);
  },

  // 广告组-复制
  'GET /api/gd/management/group/copy': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '复制成功',
      });
    }, 500);
  },

  // 广告
  // 广告-列表
  'POST /api/gd/management/product/list': (_: Request, res: Response) => {
    const records: API.IAd[] = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        id: String(index),
        name: `广告${index}-530032`,
        camId: String(index),
        camName: `广告活动-${index}-Headline_530032_530028_530031_530029_手套`,
        groupId: String(index),
        groupName: `广告组-${index}-Headline_530032_530028_530031_530029_手套`,
        state: 'enabled',
        qualification: 'Ineligible',
        qualificationMessage: 'message',
        asin: 'B000000000',
        // asin: 'B0MMMMMMMM',
        sku: 'sku-sku111111111111sku-sku111111111111sku-sku111111111111sku-sku111111111111sku-sku111111111111',
        title: 'title-title11111111title-title11111111title-title11111111title-title11111111title-title11111111',
        img: '',
        impressions: 10010,
        clicks: 10010,
        spend: 10010,
        acos: 10010,
        roas: 10010,
        ctr: 10010,
        cpc: 10010,
        cpa: 10010,
        sales: 10010,
        orderNum: 10010,
        conversionsRate: 10010,
        addTime: '2020-01-02 12:13:56',
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          page: {
            total: 122,
            size: 20,
            current: 3,
            records,
          },
          total: {
            impressions: 899999,
            clicks: 899999,
            spend: 999999,
            acos: 999999,
            roas: 999999,
            ctr: 999999,
            cpc: 999999,
            cpa: 999999,
            sales: 999999,
            orderNum: 999999,
            conversionsRate: 999999,
          },
        },
      });
    }, 500);
  },

  // 广告-批量修改状态
  'POST /api/gd/management/product/batchSetting': (req: Request, res: Response) => {
    const { body: { adIds, state } } = req;
    setTimeout(() => {
      const records = adIds.map((id: string) => ({ id, state }));
      res.send({
        code: 200,
        data: {
          records,
        },
        message: '修改成功',
      });
    }, 500);
  },

  // 关键词
  // 关键词-列表
  'POST /api/gd/management/keyword/list': (_: Request, res: Response) => {
    const records: API.IAdTargeting[] = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        id: String(index),
        name: `广告${index}-530032`,
        camId: String(index),
        camName: `广告活动-${index}-Headline_530032_530028_530031_530029_手套`,
        groupId: String(index),
        groupName: `广告组-${index}-Headline_530032_530028_530031_530029_手套`,
        state: 'enabled',
        target: `关键词-${index}`,
        matchType: 'exact',
        suggested: 0,
        suggestedMin: 0,
        suggestedMax: 0,
        bid: 1.11,
        impressions: 10010,
        clicks: 10010,
        spend: 10010,
        acos: 10010,
        roas: 10010,
        ctr: 10010,
        cpc: 10010,
        cpa: 10010,
        sales: 10010,
        orderNum: 10010,
        conversionsRate: 10010,
        addTime: '2020-01-02 12:13:56',
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          page: {
            total: 122,
            size: 20,
            current: 3,
            records,
          },
          total: {
            impressions: 899999,
            clicks: 899999,
            spend: 999999,
            acos: 999999,
            roas: 999999,
            ctr: 999999,
            cpc: 999999,
            cpa: 999999,
            sales: 999999,
            orderNum: 999999,
            conversionsRate: 999999,
          },
        },
      });
    }, 500);
  },
  
  // 关键词-获取建议竞价
  'POST /api/gd/management/keyword/suggested': (req: Request, res: Response) => {
    const { body: { ids } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({
        id, suggested: 2.2, suggestedMin: 0.33, suggestedMax: 3.33,
      }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 5000);
  },

  // 关键词-批量修改
  'POST /api/gd/management/keyword/batchSetting': (req: Request, res: Response) => {
    const { body: { records } } = req;
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          records,
        },
        message: '修改成功',
      });
    }, 500);
  },

  // Targeting
  // Targeting-列表
  'POST /api/gd/management/targeting/list': (_: Request, res: Response) => {
    const records: API.IAdTargeting[] = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        id: String(index),
        name: `广告${index}-530032`,
        camId: String(index),
        camName: `广告活动-${index}-Headline_530032_530028_530031_530029_手套`,
        groupId: String(index),
        groupName: `广告组-${index}-Headline_530032_530028_530031_530029_手套`,
        state: 'enabled',
        target: `Targeting-${index}`,
        expression: '品牌="APPLE“,价格="5-18.99",评分="4-5"',
        matchType: 'exact',
        suggested: 0,
        suggestedMin: 0,
        suggestedMax: 0,
        bid: 1.11,
        impressions: 10010,
        clicks: 10010,
        spend: 10010,
        acos: 10010,
        roas: 10010,
        ctr: 10010,
        cpc: 10010,
        cpa: 10010,
        sales: 10010,
        orderNum: 10010,
        conversionsRate: 10010,
        addTime: '2020-01-02 12:13:56',
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          page: {
            total: 122,
            size: 20,
            current: 3,
            records,
          },
          total: {
            impressions: 899999,
            clicks: 899999,
            spend: 999999,
            acos: 999999,
            roas: 999999,
            ctr: 999999,
            cpc: 999999,
            cpa: 999999,
            sales: 999999,
            orderNum: 999999,
            conversionsRate: 999999,
          },
        },
      });
    }, 500);
  },

  // Targeting-获取建议竞价
  'POST /api/gd/management/targeting/suggested': (req: Request, res: Response) => {
    const { body: { ids } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({
        id, suggested: 2.11, suggestedMin: 0.11, suggestedMax: 3.11,
      }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 3000);
  },

  // Targeting-批量修改
  'POST /api/gd/management/targeting/batchSetting': (req: Request, res: Response) => {
    const { body: { records } } = req;
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          records,
        },
        message: '修改成功',
      });
    }, 500);
  },
};
