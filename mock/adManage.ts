import { Response, Request } from 'express';
import { IPutKeyword, INegateKeyword } from '@/pages/ppc/AdManage/SearchTerm';

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

  // 广告活动简表
  'GET /api/gd/ad/campaign/simpleList': (_: Request, res: Response) => {
    const records = [{
      name: '广告活动-B073DY9671 B073DXX8PS B073CGP25H',
      campaignId: '0',
      campaignType: 'sp',
      targetingType: 'auto',
    }];
    for (let i = 1; i < 10; i++) {
      records.push({
        campaignId: String(i),
        name: `广告活动-${i}-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H`,
        campaignType: 'sp',
        targetingType: 'auto',
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: records,
      });
    }, 100);
  },

  // 广告组简表
  'GET /api/gd/ad/group/simpleList': (_: Request, res: Response) => {
    const records = [{
      name: '广告组-B073DY9671 B073DXX8PS B073CGP25H',
      id: '10',
      defaultBid: 1,
    }];
    for (let i = 11; i < 20; i++) {
      records.push({
        id: String(i),
        name: `广告组-${i}-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H`,
        defaultBid: Math.floor(Math.random() * 100),
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: records,
      });
    }, 0);
  },

  // 菜单树-广告活动
  'GET /api/gd/management/campaign/simple-list': (_: Request, res: Response) => {
    const records = [{
      id: 0,
      name: '广告活动-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H',
      state: 'enabled',
    }];
    for (let i = 1; i < 10; i++) {
      records.push({
        id: i,
        name: `广告活动-${i}-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H`,
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
    }, 100);
  },

  // 菜单树-广告组
  'GET /api/gd/management/campaign/simple-list/group': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          records: [
            {
              // id: String(Math.random()),
              id: '0',
              name: '广告组-530091_12_B07T7LYSBV_190620_hoseclamps',
              state: 'enabled',
              groupType: 'keyword',
            },
            {
              // id: String(Math.random()),
              id: '1',
              name: '广告组-2',
              state: 'paused',
              groupType: 'targeting',
            },
            {
              // id: String(Math.random()),
              id: '2',
              name: '广告组-3',
              state: 'archived',
              groupType: 'keyword',
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
          keywordCount: Math.floor(Math.random() * 10000),
          targetCount: Math.floor(Math.random() * 10000),
          neTargetCount: Math.floor(Math.random() * 100),
        },
      });
    }, 100);
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
        adType: 'sp',
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
    }, 100);
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
        camState: 'enabled',
        camType: 'sp',
        groupType: index % 2 === 0 ? 'keyword' : 'targeting',
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
    }, 100);
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
        camId: String(index),
        camName: `广告活动-${index}-Headline_530032_530028_530031_530029_手套`,
        camState: 'enabled',
        camType: 'sp',
        groupId: String(index),
        groupName: `广告组-${index}-Headline_530032_530028_530031_530029_手套`,
        groupType: index % 2 === 0 ? 'keyword' : 'targeting',
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
    }, 100);
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

  // 广告-查询商品
  'POST /api/gd/management/product/search-goods': (_: Request, res: Response) => {
    setTimeout(() => {
      const goodsCell = {
        title: 'ier Reading manyReadingReading pos ier Reading many pos ier Reading many posReading',
        id: '1',
        sku: 'sku-1',
        asin: 'B000000000',
        url: 'https://www.baidu.com',
        fulfillmentChannel: 'FBA',
        sellable: 100,
        price: 999.99,
        postage: 3.99,
        competingCount: 20,
        reviewScore: 4.5,
        reviewCount: 770,
        commission: 1.88,
        fbaFee: 2.77,
        cost: 222.22,
        freight: 2.56,
        minPrice: null,
        maxPrice: 1099.99,
        dayOrder7Count: 70,
        dayOrder7Ratio: 777.77,
        dayOrder30Count: 3000,
        dayOrder30Ratio: -8.88,
        ruleId: '10',
        ruleName: '调价规则-1',
        adjustSwitch: true,
        acKeyword: 'keywordxx',
        acUrl: 'https://www.baidu.com',
        groupId: '1',
        groupName: '商品分组-1',
        ranking: [
          {
            categoryId: '11',
            categoryName: '分类名称11',
            categoryRanking: 55,
            isTopCategory: false,
          }, {
            categoryId: '1',
            categoryName: '分类名称1',
            categoryRanking: 955,
            isTopCategory: true,
          },
        ],
        listingStatus: 'Active',
        profitMargin: 33.33,
        profit: 101.58,
        openDate: '2020-06-06',
        sellableDays: 999,
        inbound: 500,
        imgUrl: 'https://images-na.ssl-images-amazon.com/images/I/512lGnVReaL.jpg',
        idAdd: true,
        isAc: false,
        isBs: true,
        isNr: false,
        isPrime: true,
        isPromotion: false,
        isCoupon: true,
        usedNewSellNum: 66,
        isBuyBox: true,
        addOnItem: 'addOnItemxx',
        bsCategory: 'bsCategoryxx',
        specialOffersProductPromotions: '促销说明xx',
        coupon: '-50%xx',
        sellerName: 'buybox卖家名称xx',
        nrCategory: 'nrCategoryxx',
      };
      const records = [];
      for (let index = 1; index < 21; index++) {
        const cell = { ...goodsCell, asin: `B00000000${index}` };
        if (index % 2 > 0) {
          cell.sku = `150919USFBA${index}`;
          cell.listingStatus = 'Remove';
          cell.fulfillmentChannel = 'FBM';
          cell.adjustSwitch = false;
          cell.idAdd = !cell.idAdd;
          cell.isAc = !cell.isAc;
          cell.isPrime = !cell.isPrime;
        } else {
          cell.sku = `070323_5x_150919USFBA${index}`;
          cell.sellableDays = 0;
          cell.dayOrder7Ratio = 0 - cell.dayOrder7Ratio;
          cell.isBuyBox = false;
          cell.usedNewSellNum = 0;
          cell.ranking = [];
        }
        cell.id = `${index * 2}`;
        records.push(cell);
      }
      res.send({
        code: 200,
        data: {
          total: 1234,
          size: 20,
          current: 1,
          pages: 62,
          records,
        },
      });
    }, 300);
  },

  // 广告-添加广告
  'POST /api/gd/management/product/add': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '添加成功',
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
        keywordName: `关键词${index}`,
        camId: String(index),
        camName: `广告活动-${index}-Headline_530032_530028_530031_530029_手套`,
        camState: 'enabled',
        camType: 'sp',
        groupId: String(index),
        groupName: `广告组-${index}-Headline_530032_530028_530031_530029_手套`,
        groupType: index % 2 === 0 ? 'keyword' : 'targeting',
        state: 'enabled',
        targeting: `关键词-${index}`,
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
    }, 100);
  },
  
  // 关键词-获取建议竞价
  'POST /api/gd/management/keyword/suggested': (req: Request, res: Response) => {
    const { body: { keywords } } = req;
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const records = keywords.map((kw: any) => ({
        id: kw.id,
        suggested: Math.floor(Math.random() * 10),
        suggestedMin: 0.33,
        suggestedMax: 3.33,
        keywordText: kw.keywordText,
        matchType: kw.matchType,
      }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 1000);
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

  // 关键词-建议关键词
  'GET /ad/keyword/suggestedKeywordsByGroup': (_: Request, res: Response) => {
    const data = ['suggestedKeyword'];
    for (let index = 1; index < 20; index++) {
      data.push(`suggestedKeyword-${index}`);      
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data,
      });
    }, 0);
  },

  // Targeting
  // Targeting-列表
  'POST /api/gd/management/targeting/list': (_: Request, res: Response) => {
    const records: API.IAdTargeting[] = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        id: String(index),
        keywordName: `关键词${index}`,
        camId: String(index),
        camName: `广告活动-${index}-Headline_530032_530028_530031_530029_手套`,
        camState: 'enabled',
        camType: 'sp',
        groupId: String(index),
        groupName: `广告组-${index}-Headline_530032_530028_530031_530029_手套`,
        groupType: index % 2 === 0 ? 'keyword' : 'targeting',
        state: 'enabled',
        targeting: `Targeting-${index}`,
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
    }, 100);
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

  // Targeting-建议分类
  'GET /api/gd/management/target/suggested-categories': (_: Request, res: Response) => {
    const data = [{
      categoryId: '0',
      categoryName: '分类-0',
      path: '路径',
    }];
    for (let index = 1; index < 3; index++) {
      data.push({
        categoryId: String(index),
        categoryName: `分类-${index}`,
        path: '路径路径路径路径路径路径>路径路径路径路径路径路径路径路径路径路径路径路径路径路径路径路径>路径路径',
      });      
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data,
      });
    }, 0);
  },

  // Targeting-建议品牌
  'GET /api/gd/management/target/suggested-brands': (_: Request, res: Response) => {
    const records = [{
      brandId: '0',
      brandName: '品牌0',
    }];
    for (let index = 1; index < 20; index++) {
      records.push({
        brandId: String(index),
        brandName: `品牌品牌品牌${index}`,
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: { records },
      });
    }, 0);
  },

  // Targeting-建议商品
  'GET /api/gd/management/target/suggested-goods': (_: Request, res: Response) => {
    const data = [{
      asin: 'B000000000',
      title: '商品名称-0',
      imgUrl: null,
      price: 1.1,
      reviewScore: 4.5,
      reviewCount: 2333,
    }];
    for (let index = 1; index < 4; index++) {
      data.push({
        asin: `B000000000${index}`,
        title: `商品名称-${index}`,
        imgUrl: null,
        price: index,
        reviewScore: 4.5,
        reviewCount: 2333,
      });      
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data,
      });
    }, 0);
  },

  
  // Targeting-获取建议竞价-分类
  'POST /api/gd/management/target/category/bid-recommendations': (req: Request, res: Response) => {
    const { body: { categories } } = req;
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const records = categories.map((item: any) => ({
        suggested: Math.floor(Math.random() * 10),
        rangeStart: 0.33,
        rangeEnd: 3.33,
        categoryId: item.categoryId,
        brandId: item.brandId,
        priceLessThan: item.priceLessThan,
        priceGreaterThan: item.priceGreaterThan,
        reviewRatingLessThan: item.reviewRatingLessThan,
        reviewRatingGreaterThan: item.reviewRatingGreaterThan,
      }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 500);
  },

  // Targeting-获取建议竞价-商品
  'POST /api/gd/management/target/product/bid-recommendations': (req: Request, res: Response) => {
    const { body: { asins } } = req;
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const records = asins.map((item: any) => ({
        suggested: Math.floor(Math.random() * 10),
        rangeStart: 0.33,
        rangeEnd: 3.33,
        asin: item,
      }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 500);
  },

  // 否定Targeting
  // 否定Targeting-列表
  'POST /api/gd/management/group/ne-target/list': (_: Request, res: Response) => {
    const records: API.IAdNegativeTargeting[] = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        neTargetId: String(index),
        targetText: `否定targeting-${index}`,
        addTime: '2020-01-02 12:13:56',
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          page: {
            total: 111,
            size: 20,
            current: 3,
            records,
          },
        },
      });
    }, 100);
  },

  // 否定Targeting-批量归档
  'POST /api/gd/management/group/ne-target/archive': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '成功',
      });
    }, 500);
  },

  // 否定Targeting-添加
  'POST /api/gd/management/gruop/netarget/add': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '成功',
      });
    }, 500);
  },

  // 否定关键词
  // 否定关键词-广告活动的-列表
  'GET /api/gd/management/campaign/ne-keyword/list': (_: Request, res: Response) => {
    const records: API.IAdNegativeKeyword[] = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        neKeywordId: String(index),
        keywordText: `活动-keyword-${index}`,
        matchType: 'negativeExact',
        addTime: '2020-01-02 12:13:56',
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          page: {
            total: 111,
            size: 20,
            current: 3,
            records,
          },
        },
      });
    }, 100);
  },

  // 否定关键词-广告活动的-批量归档
  'POST /api/gd/management/campaign/ne-keyword/archive': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '成功',
      });
    }, 500);
  },

  // 否定关键词-广告活动的-添加
  'POST /api/gd/management/campaign/ne-keyword/add': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '成功',
      });
    }, 500);
  },

  // 否定关键词-广告活动的-建议关键词
  'GET /api/gd/management/campaign/suggested-negativeKeyword/list': (_: Request, res: Response) => {
    const data = [{
      keywordText: '活动建议关键词-0',
      matchType: 'phrase',
      clicks: '100',
      orders: '10',
      conversionsRate: '1',
    }];
    for (let index = 1; index < 20; index++) {
      data.push({
        keywordText: `活动建议关键词-${index}`,
        matchType: 'phrase',
        clicks: String(Math.floor(Math.random() * 1000)),
        orders: String(Math.floor(Math.random() * 100)),
        conversionsRate: String(Math.floor(Math.random() * 10)),
      }, {
        keywordText: `活动建议关键词-${index}`,
        matchType: 'exact',
        clicks: String(Math.floor(Math.random() * 1000)),
        orders: String(Math.floor(Math.random() * 100)),
        conversionsRate: String(Math.floor(Math.random() * 10)),
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data,
      });
    }, 0);
  },

  // 否定关键词-广告组的-列表
  'GET /api/gd/management/group/ne-keyword/list': (_: Request, res: Response) => {
    const records: API.IAdNegativeKeyword[] = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        neKeywordId: String(index),
        keywordText: `组-keyword-${index}`,
        matchType: 'negativeExact',
        addTime: '2020-01-02 12:13:56',
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          page: {
            total: 111,
            size: 20,
            current: 3,
            records,
          },
        },
      });
    }, 100);
  },

  // 否定关键词-广告组的-批量归档
  'POST /api/gd/management/group/ne-keyword/archive': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '成功',
      });
    }, 500);
  },

  // 否定关键词-广告组的-建议关键词
  'GET /api/gd/management/group/suggested-negativeKeyword/list': (_: Request, res: Response) => {
    const data = [{
      keywordText: '组建议关键词-0',
      matchType: 'phrase',
      clicks: '100',
      orders: '10',
      conversionsRate: '1',
    }];
    for (let index = 1; index < 20; index++) {
      data.push({
        keywordText: `组建议关键词-${index}`,
        matchType: 'phrase',
        clicks: String(Math.floor(Math.random() * 1000)),
        orders: String(Math.floor(Math.random() * 100)),
        conversionsRate: String(Math.floor(Math.random() * 10)),
      }, {
        keywordText: `组建议关键词-${index}`,
        matchType: 'exact',
        clicks: String(Math.floor(Math.random() * 1000)),
        orders: String(Math.floor(Math.random() * 100)),
        conversionsRate: String(Math.floor(Math.random() * 10)),
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data,
      });
    }, 0);
  },

  // 否定关键词-广告组的-添加
  'POST /api/gd/management/group/ne-keyword/add': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '成功',
      });
    }, 500);
  },

  // SearchTerm报表
  // SearchTerm报表-列表
  'POST /api/gd/management/st/list': (_: Request, res: Response) => {
    const records: API.IAdSearchTerm[] = [];
    for (let index = 1; index < 21; index++) {
      records.push({
        id: String(index),
        camId: String(index),
        camName: `广告活动-${index}-Headline_530032_530028_530031_530029_手套`,
        camState: 'enabled',
        camType: 'sp',
        campaignTargetType: index % 2 === 0 ? 'auto' : 'manual',
        groupId: String(index * 10),
        groupName: `广告组-${index * 10}-Headline_530032_530028_530031_530029_手套`,
        groupType: index % 2 === 0 ? 'keyword' : 'targeting',
        groupBid: index + 0.22,
        matchType: 'exact',
        keywordText: `投放词-${index}`,
        keywordId: `${index}`,
        deliveryStatus: 'alreadyLive',
        queryKeyword: index % 3 === 0 ? 'B000000000' : `搜索词-${index}`,
        queryKeywordType: index % 3 === 0 ? true : false,
        existQueryKeyword: index % 3 === 0 ? undefined : [
          {
            keyword: 'apple',
            exist: false,
          },
          {
            keyword: 'pencil',
            exist: true,
          },
          {
            keyword: 'box',
            exist: false,
          },
        ],
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
        queryKeywordBid: 2.22,
        // queryKeywordSuggested: 2,
        // queryKeywordSuggestedMin: 1,
        // queryKeywordSuggestedMax: 3,
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

  // SearchTerm报表-获取建议竞价
  'POST /api/gd/management/st/suggested': (req: Request, res: Response) => {
    const { body: { keywords } } = req;
    setTimeout(() => {
      const records = keywords.map((keywordInfo: API.IAdSearchTerm) => ({
        keywordText: keywordInfo.keywordText,
        suggested: Math.floor(Math.random() * 100),
        rangeStart: 0.33, 
        rangeEnd: 3.33,
        camId: keywordInfo.camId,
        groupId: keywordInfo.groupId,
        keywordId: keywordInfo.id,
        matchType: keywordInfo.matchType,
      }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 1000);
  },

  // SearchTerm报表-投放搜索词时，获取可供选择的广告活动
  'GET /api/gd/management/st/cam': (req: Request, res: Response) => {
    const records = [{
      id: '100',
      name: '广告活动-100-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H',
      state: 'enabled',
    }];
    const { query: { camType } } = req;
    const n = camType ? 105 : 103;
    for (let i = 101; i < n; i++) {
      records.push({
        id: `${i}`,
        name: `广告活动-${i}-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H`,
        state: 'enabled',
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 500);
  },

  // SearchTerm报表-投放搜索词时，获取可供选择的广告组
  'GET /api/gd/management/st/group/simple-list': (_: Request, res: Response) => {
    const records = [{
      id: '200',
      name: '广告组-100-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H',
      defaultBid: 200,
    }];
    for (let i = 201; i < 205; i++) {
      records.push({
        id: `${i}`,
        name: `广告组-${i}-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H`,
        defaultBid: i + 22,
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 500);
  },
  
  // SearchTerm报表-投放搜索词为关键词
  'POST /api/gd/management/st/add/keyword': (req: Request, res: Response) => {
    const { body: { keywordTexts } } = req;
    setTimeout(() => {
      res.send({
        code: 200,
        data: keywordTexts.map((item: IPutKeyword) => {
          return {
            ...item,
            state: Math.random() > 0.5 ? 'fail' : 'success',
            failMsg: item.groupId ? '关键词已存在！' : '广告组不能为空!',
          };
        }),
      });
    }, 500);
  },

  // SearchTerm报表-投放搜索词为否定关键词
  'POST /api/gd/management/st/add/ne-keyword': (req: Request, res: Response) => {
    const { body: { neKeywords } } = req;
    setTimeout(() => {
      res.send({
        code: 200,
        data: neKeywords.map((item: INegateKeyword) => {
          return {
            ...item,
            state: Math.random() > 0.5 ? 'fail' : 'success',
            failMsg: item.groupId ? '否定关键词已存在！' : '广告组不能为空!',
          };
        }),
      });
    }, 500);
  },

  // SearchTerm报表-投放词联想
  'GET /api/gd/management/st/like/keyword-text': (req: Request, res: Response) => {
    const { query: { keywordText } } = req;
    const data = ['联想词'];
    for (let i = 1; i <= 10; i++) {
      data.push(`${keywordText}-${i}`);      
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data,
      });
    }, 500);
  },

  // 操作记录-获取列表
  'GET /api/gd/management/history/list': (req: Request, res: Response) => {
    const { query: { current } } = req;
    const records: API.IAdOperationRecord[] = [{
      id: '0',
      behaviorDate: '2021-03-03 22:22:22',
      objectType: '广告组',
      objectInfo: 'campaign2>ad group2',
      behaviorInfo: '日预算',
      oldValue: '$10.00',
      newValue: '$12.00',
      behaviorExecutor: '子账号：123456789@outlook.com',
    }];
    for (let i = 1; i <= 50; i++) {
      records.push({
        id: `${i}`,
        behaviorDate: '2021-03-03 11:11:11',
        objectType: '否定Targeting',
        objectInfo: '广告活动Headline_530032_530028_530031_530029_手套 > 广告组Headline_530032_530028_530031_530029 > B000000000',
        behaviorInfo: '日预算',
        oldValue: `$${Math.random().toFixed(2)}`,
        newValue: '$12.00',
        behaviorExecutor: '子账号：123456789@outlook.com',
      });      
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          total: 51,
          current: Number(current),
          records,
        },
      });
    }, 1000);
  },

  // 数据分析
  // 数据分析-广告活动-统计数据（左侧菜单数据）
  'GET /api/gd/management/campaign-analysis/tofu': (_: Request, res: Response) => {
    const getRandom = () => Math.floor(Math.random() * 100);
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          impressions: getRandom() * 100,
          firstHalfImpressions: getRandom() * 100,
          impressionsRatio: -getRandom(),
          clicks: getRandom(),
          firstHalfClicks: getRandom(),
          clicksRatio: getRandom(),
          spend: getRandom(),
          firstHalfSpend: getRandom(),
          spendRatio: getRandom(),
          acos: getRandom(),
          firstHalfAcos: getRandom(),
          acosRatio: -getRandom(),
          roas: getRandom(),
          firstHalfRoas: getRandom(),
          roasRatio: getRandom(),
          ctr: getRandom(),
          firstHalfCtr: getRandom(),
          ctrRatio: getRandom(),
          cpc: getRandom(),
          firstHalfCpc: getRandom(),
          cpcRatio: -getRandom(),
          cpa: getRandom(),
          firstHalfCpa: getRandom(),
          cpaRatio: getRandom(),
          sales: getRandom() * 10000000 + 0.99,
          firstHalfSales: getRandom() * 10000000 + 0.99,
          salesRatio: getRandom(),
          orderNum: getRandom(),
          firstHalfOrderNum: getRandom(),
          orderNumRatio: getRandom(),
          conversionsRate: getRandom(),
          firstHalfConversionsRate: getRandom(),
          conversionsRateRatio: getRandom(),
        },
      });
    }, 500);
  },

  // 数据分析-广告活动-折线图
  'GET /api/gd/management/campaign-analysis/polyline': (req: Request, res: Response) => {
    const { query: { dispAttribute } } = req;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr: any[] = Array.isArray(dispAttribute) ? dispAttribute : [dispAttribute];
    const getRandom = () => Math.floor(Math.random() * 1000000);
    const getRandom1 = () => Math.floor(Math.random() * 1000000);
    const list: {value: number; time: string}[] = [];
    const list1: {value: number; time: string}[] = [];
    const length = Math.floor(Math.random() * 100);
    for (let i = 0; i < length; i++) {
      list.push({
        value: getRandom(),
        time: `2021-01-${i}`,
      });
      list1.push({
        value: getRandom1(),
        time: `2021-01-${i}`,
      });
    }
    const result = {};
    result[arr[0]] = list;
    arr[1] && (result[arr[1]] = list1);
    setTimeout(() => {
      res.send({
        code: 200,
        data: result,
      });
    }, 500);
  },

  // 数据分析-广告活动-表格
  'GET /api/gd/management/campaign-analysis/list': (req: Request, res: Response) => {
    const { query: { size } } = req;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: any = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        statisticTime: `2020-01-${index}`,
        impressions: 10010,
        clicks: 10010,
        spend: 10010,
        acos: 100,
        roas: 10010,
        ctr: 99.99,
        cpc: 10010,
        cpa: 10010,
        sales: 10010,
        orderNum: 10010,
        conversionsRate: 99.99,
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          total: 10010,
          size,
          records,
        },
      });
    }, 500);
  },

  // 数据分析-广告组-统计数据（左侧菜单数据）
  'GET /api/gd/management/group-analysis/tofu': (_: Request, res: Response) => {
    const getRandom = () => Math.floor(Math.random() * 100);
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          impressions: getRandom() * 100,
          firstHalfImpressions: getRandom() * 100,
          impressionsRatio: -getRandom(),
          clicks: getRandom(),
          firstHalfClicks: getRandom(),
          clicksRatio: getRandom(),
          spend: getRandom(),
          firstHalfSpend: getRandom(),
          spendRatio: getRandom(),
          acos: getRandom(),
          firstHalfAcos: getRandom(),
          acosRatio: -getRandom(),
          roas: getRandom(),
          firstHalfRoas: getRandom(),
          roasRatio: getRandom(),
          ctr: getRandom(),
          firstHalfCtr: getRandom(),
          ctrRatio: getRandom(),
          cpc: getRandom(),
          firstHalfCpc: getRandom(),
          cpcRatio: -getRandom(),
          cpa: getRandom(),
          firstHalfCpa: getRandom(),
          cpaRatio: getRandom(),
          sales: getRandom() * 10000000 + 0.99,
          firstHalfSales: getRandom() * 10000000 + 0.99,
          salesRatio: getRandom(),
          orderNum: getRandom(),
          firstHalfOrderNum: getRandom(),
          orderNumRatio: getRandom(),
          conversionsRate: getRandom(),
          firstHalfConversionsRate: getRandom(),
          conversionsRateRatio: getRandom(),
        },
      });
    }, 500);
  },

  // 数据分析-广告组-折线图
  'GET /api/gd/management/group-analysis/polyline': (req: Request, res: Response) => {
    const { query: { dispAttribute } } = req;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr: any[] = Array.isArray(dispAttribute) ? dispAttribute : [dispAttribute];
    const getRandom = () => Math.floor(Math.random() * 1000000);
    const getRandom1 = () => Math.floor(Math.random() * 1000000);
    const list: {value: number; time: string}[] = [];
    const list1: {value: number; time: string}[] = [];
    const length = Math.floor(Math.random() * 100);
    for (let i = 0; i < length; i++) {
      list.push({
        value: getRandom(),
        time: `2021-01-${i}`,
      });
      list1.push({
        value: getRandom1(),
        time: `2021-01-${i}`,
      });
    }
    const result = {};
    result[arr[0]] = list;
    arr[1] && (result[arr[1]] = list1);
    setTimeout(() => {
      res.send({
        code: 200,
        data: result,
      });
    }, 500);
  },

  // 数据分析-广告组-表格
  'GET /api/gd/management/group-analysis/list': (req: Request, res: Response) => {
    const { query: { size } } = req;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: any = [];
    for (let index = 0; index < 20; index++) {
      records.push({
        statisticTime: `2020-01-${index}`,
        impressions: 10010,
        clicks: 10010,
        spend: 10010,
        acos: 100,
        roas: 10010,
        ctr: 99.99,
        cpc: 10010,
        cpa: 10010,
        sales: 10010,
        orderNum: 10010,
        conversionsRate: 99.99,
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          total: 10010,
          size,
          records,
        },
      });
    }, 500);
  },
};
