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
  hash: true,
  ignoreMomentLocale: true,
  favicon: '/favicon.ico',
  title: '安知助手',
}

export default config;
