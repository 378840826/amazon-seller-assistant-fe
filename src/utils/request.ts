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

// request 拦截
request.interceptors.request.use((url, options) => {
  const { headers, data } = options;
  if (data) {
    // 需要插入到 headers 中的参数
    const { headersParams } = data;
    Object.assign(headers, headersParams);
    // 如果是文件上传，删除上面 extend 加上的 Content-Type，让浏览器自己设置
    if (Object.prototype.toString.call(data) === '[object FormData]') {
      headers && delete headers['Content-Type'];
    }
  }
  return {
    url,
    options: { ...options, headers: { ...headers } },
  };
});

// response 拦截
request.interceptors.response.use(async (response, options) => {
  // 文件流不作处理 直接返回
  if ( options.responseType === 'blob') {
    return response;
  } 

  const resBody = await response.clone().json();
  const whiteList = [
    '/', 
    '/index/crx',
    '/index/privacy', 
    '/index/logs',
    '/vip/instructions',
  ];
  const { code, message } = resBody;
  // 请求异常
  switch (code) {
  case 401://用户未登录
    if (whiteList.indexOf(window.location.pathname) < 0 ) {
      history.replace({
        pathname: '/users/login',
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
