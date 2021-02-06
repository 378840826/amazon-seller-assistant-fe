import { Response, Request } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'GET /api/system/user/logined': (_: Request, res: Response) => {
    setTimeout(() => {
      res.header({
        Token: 'aaaaa',
      });
      res.send({
        code: 200,
        token: 'test-token',
        message: '成功',
        data: {
          id: 1,
          username: 'Serati Ma',
          email: 'a@b.com',
          phone: '10000',
          topAccount: true,
          memberExpirationDate: '',
          memberExpired: false,
          memberFunctionalSurplus: [
            { functionName: '绑定店铺', frequency: 0 },
            { functionName: '广告授权店铺', frequency: 0 },
            { functionName: '子账号', frequency: 10 },
            { functionName: '智能调价', frequency: 0 },
            { functionName: 'ASIN报表导出', frequency: 0 },
            { functionName: 'ASIN动态监控', frequency: 0 },
            { functionName: '跟卖监控', frequency: 0 },
            { functionName: 'Review监控', frequency: 0 },
            { functionName: '搜索排名监控', frequency: 0 },
            { functionName: '自动邮件', frequency: 0 },
            { functionName: '补货计划导出', frequency: 0 },
            { functionName: 'PPC托管', frequency: 0 },
          ],
        },
      });
    }, 1000);
  },

  'POST /api/system/user/modify/username': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '修改成功',
      });
    }, 5000);
  },

  'POST /api/system/user/modify/password': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '修改成功',
      });
    }, 5000);
  },

  'GET /api/system/user/exist/username': (_: Request, res: Response) => {
    res.send({
      code: 200,
      data: {
        exist: false,
      },
    });
  },

  'GET /api/system/user/exist/email': (_: Request, res: Response) => {
    res.send({
      code: 200,
      data: {
        exist: false,
      },
    });
  },
  'GET /api/system/user/pre-login': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          code: false,
        },
      });
    }, 6000);
  },
  'POST /api/system/user/login': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '错误的其他',
        data: {
          action: 'login',
          user: {
            id: 1,
            username: 'kfjdkf',
            email: 'fdjlj@qq.com',
            topAccount: true,
          },
        },
      });
    }, 1000);
  },
  'GET /api/system/user/logout': (_: Request, res: Response) => {
    res.send({
      code: 200,
      message: '退出成功',
    });
  },
  'POST /api/system/user/forget-password': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '验证码错误',
      });
    }, 1000);
  },
  'GET /api/system/user/active': (_: Request, res: Response) => {
    res.send({
      code: 200,
      message: '激活成功',
    });
  },
};
