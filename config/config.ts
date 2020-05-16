import { IConfig } from 'umi-types';
import routesConfig from './config.routes';
import themeConfig from './config.theme';

const config: IConfig =  {
  theme: themeConfig,
  routes: routesConfig,
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
          webpackChunkName: true,
          level: 3,
        },
        favicon: '/favicon.ico',
        title: '安知助手',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      }
    ],
  ],
  proxy: {
    '/api': {
      target: 'https://amzics.workics.cn',
      changeOrigin: true,
      pathRewrite: { "^/api": "" }
    },
  },
}

export default config;
