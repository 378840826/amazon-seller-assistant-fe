// import { IConfig } from 'umi-types';
import routesConfig from './config.routes';
import themeConfig from './config.theme';

const config =  {
  theme: themeConfig,
  routes: routesConfig,
  antd: {},
  dva: {
    hmr: true,
    immer: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  outputPath: './dist',
  publicPath: '/',
  hash: true,
  ignoreMomentLocale: true,
  favicon: '/favicon.ico',
  title: '安知助手',
  // mock: false,
  proxy: {
    '/api': {
      'target': 'http://dev.workics.cn',
      'changeOrigin': true,
      // 'pathRewrite': { '^/api' : '' },
    },
  },

}

export default config;
