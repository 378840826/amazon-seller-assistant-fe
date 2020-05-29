/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { history } from 'umi';
import { stringify } from 'querystring';
import { notification } from 'antd';

// 异常处理程序
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const { status } = response;
    notification.error({
      message: `网络错误 ${status}`,
      description: '您的网络发生异常，无法连接服务器',
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

// 增加请求配置
const request = extend({
  // 默认错误处理
  errorHandler,
  // 默认请求是否带上 cookie
  credentials: 'include',
  // 超时
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

// response 拦截
request.interceptors.response.use(async response => {
  const resBody = await response.clone().json();
  const { code, message } = resBody;
  // 请求异常
  switch (code) {
  case 401:
    if (window.location.pathname !== '/user/login') {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
    }
    break;
  case 403:
    notification.error({
      message: message || '没有权限',
    });
    break; 
  default:
    break;
  }
  return response;
});

export default request;
