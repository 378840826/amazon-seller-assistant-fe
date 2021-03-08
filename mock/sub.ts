import { Response, Request } from 'express';
import Mock from 'mockjs';
const random = Mock.Random;

const common = (_: Request, res: Response) => {
  res.send({
    code: 200,
    message: '修改成功',
  });
};

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
        state: true,
        username: 'jam',
        email: '888@qq.com',
        roleList: ['12', '13'],
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
        state: false,
        username: 'kiss-kitty',
        email: '888444@qq.com',
        roleList: ['12', '13'],
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
  'GET /api/system/sam/sam/user/role-list': (_: Request, res: Response) => {
    res.send({
      code: 200,
      data: [
        { id: '12', roleName: '开发' },
        { id: '13', roleName: '产品' },
        { id: '14', roleName: '运营' },
        { id: '15', roleName: '运营' },
        { id: '16', roleName: '运营' },
        { id: '17', roleName: '运营' },
        { id: '18', roleName: '运营' },
        { id: '19', roleName: '运营' },
      ],
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

  //======角色权限管理
  //所有子账号
  'GET /api/system/role-permission/sam-list': Mock.mock({
    code: 200,
    'data|5-20': [{
      'id|+1': 1001,
      'username': '我是什么的东西呀，为什么现在好像越来越不是很开心，想早点遇到我的那个人了',
    }],
  }),
  
  //角色权限列表
  'GET /api/system/role-permission/list': Mock.mock({
    code: 200,
    'data|1-20': [{
      roleState: random.boolean(),
      roleName: 'happy in the house',
      roleDescription: 'i am yours',
      samList: [1001, 1002],
      gmtCreate: '2019-01-02 12:23:54',
      updateTime: '2020-01-30 12:34:45',
      permissionList: ['10', '11', '12'],
      'id|+1': 100,
    }],
  }),
  //修改状态
  'POST /api/system/role-permission/update-state': Mock.mock({
    code: 200,
    message: '修改成功',
  }),

  //删除角色
  'POST /api/system/role-permission/delete-role': Mock.mock({
    code: 200,
    message: '修改成功',
  }),

  //添加角色
  'POST /api/system/role-permission/add-role': Mock.mock({
    code: 200,
    message: '修改成功',
  }),

  //修改角色
  'POST /api/system/role-permission/update-role': Mock.mock({
    code: 200,
    message: '修改成功',
  }),

  //修改角色的子账号分配
  'POST /api/system/role-permission/update-sam': Mock.mock({
    code: 200,
    message: '修改成功',
  }),

  //所有权限
  'POST /api/system/role-permission/permission-list': Mock.mock({
    code: 200,
    data: [
      {
        permissionName: 'name1',
        id: '10',
        permissionKey: '01',
        children: [
          {
            permissionName: 'name2',
            id: '11',
            permissionKey: '02',
          },
          {
            permissionName: 'name3',
            id: '12',
            permissionKey: '03',
          },
        ],
      },
    ],
  }),

  //子账号-修改角色
  'POST /api/system/sam/sam/user/update-role': Mock.mock({
    code: 200,
    message: '修改成功',
  }),
};
