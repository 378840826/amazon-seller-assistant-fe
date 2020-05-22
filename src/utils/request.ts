/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
  // 200: '请求成功',
  // 201: '新建或修改数据成功。',
  // 202: '一个请求已经进入后台排队（异步任务）。',
  // 204: '删除成功。',
  400: '发出的请求有错误，服务器没有进行数据的操作。',
  401: '没有权限（令牌、用户名、密码错误）。',
  403: '访问被禁止。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器内部发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 异常处理程序
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const { status: status1 } = response;
    const errorText = codeMessage[status1] || response.statusText;
    const { status } = response;
    notification.error({
      message: `请求错误 ${status}`,
      description: errorText,
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
  // 带上 token
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

// request 拦截
request.interceptors.request.use((url, options) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headers: any = options.headers;
  const token = localStorage.getItem('Token');
  token ? headers.Token = token : delete headers.Token;
  return {
    url,
    options: { ...options, headers: { ...headers } },
  };
});

// response 拦截
request.interceptors.response.use(async response => {
  const resBody = await response.clone().json();
  const { code, message } = resBody;
  const token = response.headers.get('Token');
  // 存储或更新 token
  if (token !== null) {
    localStorage.setItem('Token', token);
  } else {
    delete localStorage.Token;
  }
  // 请求异常
  if (code !== 200) {
    notification.error({
      message: message || codeMessage[code],
    });
  }
  return response;
});

export default request;
