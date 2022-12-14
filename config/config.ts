// import { IConfig } from 'umi-types';
import routesConfig from './config.routes';
import themeConfig from './config.theme';

const config =  {
  theme: themeConfig,
  routes: routesConfig,
  locale:{
    default: 'zh-CN',
  },
  antd: {},
  dva: {
    hmr: true,
    immer: true,
  },
  terserOptions:{ compress: { drop_console:process.env.NODE_ENV==='production'?true:false, } },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  outputPath: './dist',
  publicPath: '/',
  hash: true,
  ignoreMomentLocale: true,
  favicon: '/favicon.ico',
  title: '安知助手',
  mock: false,
  // mock: {},
 /*  devServer:{
    host:'localhost.charlesproxy.com'
  }, */
  proxy: {
    '/api': {
      'target': 'http://dev.workics.cn',
      // 'target': 'https://test.workics.cn',
      'changeOrigin': true,
        secure: false,   
      // 'pathRewrite': { '^/api' : '' },
    },
    // 竞品设定的
    '/compete/search': {
      target: 'https://amzics.workics.cn',
      changeOrigin: true
    }
  },
}

export default config;
