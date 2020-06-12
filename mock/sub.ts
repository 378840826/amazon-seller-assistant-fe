import { Response, Request } from 'express';

export default {
  'GET /api/system/sam/store/list': (_: Request, res: Response) => {
    res.send({
      code: 200,
      data: {
        records: [{
          sellerId: '1',
          storeName: 'apple',
          marketplace: 'US',
        },
        {
          sellerId: '2',
          storeName: 'banana',
          marketplace: 'IT',
        },
        {
          sellerId: '3',
          storeName: 'apple1',
          marketplace: 'UK',
        },
        {
          sellerId: '4',
          storeName: 'banana1',
          marketplace: 'DE',
        }],
      },
    });
  },
  'GET /api/system/sam/user/list': (_: Request, res: Response) => {
    res.send({
      code: 200,
      data: [{
        id: 1,
        username: 'jam',
        email: '888@qq.com',
        stores: [{
          sellerId: '1',
          marketplace: 'US',
        },
        {
          sellerId: '2',
          marketplace: 'IT',
        },
        {
          sellerId: '3',
          marketplace: 'UK',
        },
        {
          sellerId: '4',
          marketplace: 'DE',
        }],
      }, {
        id: 2,
        username: 'kiss-kitty',
        email: '888444@qq.com',
        stores: [{
          sellerId: '1',
          marketplace: 'US',
        },
        
        {
          sellerId: '3',
          marketplace: 'UK',
        }],
      }],
    });
  },

  'POST /api/system/sam/user/add': (_: Request, res: Response) => {
    setTimeout(function () {
      res.send({
        code: 200,
        message: '成功',
      });
    }, 3000);
   
  },

  'POST /api/system/sam/user/delete': (_: Request, res: Response) => {
    res.send({
      code: 200,
      message: '成功',
    });
  },

  'POST /api/system/sam/user/modify/username': (_: Request, res: Response) => {
    res.send({
      code: 200,
      message: '修改失败',
    });
  },

  'POST /api/system/sam/user/modify/email': (_: Request, res: Response) => {
    res.send({
      code: 200,
      message: '修改失败',
    });
  },

  'POST /api/system/sam/user/modify/password': (_: Request, res: Response) => {
    res.send({
      code: 200,
      message: '修改成功',
    });
  },

  'POST /api/system/sam/user/modify/stores': (_: Request, res: Response) => {
    res.send({
      code: 200,
      message: '成功',
    });
  },
};
