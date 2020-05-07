# amzics-react
* 原 amzics 项目的 react@16.8+ 技术栈重构

* 项目基于 TypeScript + umijs + dva + antd

* 使用 yarn 作为包管理工具

### 项目技术基础
* TypeScript："强"类型的 JS。https://www.typescriptlang.org/docs/handbook/basic-types.html

* umijs：
  底层框架，集成 react 、webpack、react-router、babel、jest 等。https://umijs.org/

* dav：
  纯数据流解决方案，基于 redux 和 redux-saga。https://dvajs.com/

* antd@4.x：React UI 组件库。https://ant.design/docs/react/introduce-cn


### 目录结构
```
├── config                   # 项目配置目录，路由、主题、代理、构建等
├── mock                     # mock 文件目录，基于 express
├── public                   # 静态资源
│   └── favicon.png          # favicon
├── src
│   ├── assets               # 本地资源
│   ├── components           # 项目通用组件，如 PageLoading 等
│   ├── layouts              # 通用页面布局
│   ├── models               # 全局 dva model
│   ├── pages                # 页面和常用模板
│   │   ├── __tests__        # 测试用例文件目录
│   │   ├── 404.tsx          # 404页面
│   │   └── .umi/            # dev 临时目录，已添加到 .gitignore
│   ├── services             # 后台接口
│   │   └── API.d.ts         # 各接口的类型定义
│   ├── utils                # 工具库
│   ├── app.ts               # 运行时配置,可扩展运行时的能力如修改路由、修改 render 等
│   ├── global.less          # 全局样式
│   └── global.ts            # 全局 JS 文件，加载补丁或做一些初始化的操作
├── .eslintrc.js             # ESlint 配置
├── .stylelintrc.json        # stylelint 配置
├── .env.js                  # 环境变量，定义的环境变量在整个umi-build-dev的生命周期里都可以被使用
├── typings.d.ts             # 全局模块类型声明
├── README.md
└── package.json
```

### 其他说明
* 使用 Jest 作为测试工具
* 测试用例统一放在 ```src/*/**/__test__``` 目录
* yarn test 会匹配所有 .test.ts|tsx 和 .e2e.ts|tsx 结尾的文件
* 使用 Less 作为 css 处理器
* TS 避免使用 any，如果因为某些原因必须用，则只在这一行代码前注释 eslint disable
* 所有 interface 以大写字母 I 开头
* iconfont 使用 Symbol 方式，引用在 utils/utils 工具中
* 使用新的 iconfont 项目（Amzics），图标居中放置， padding 和大小设置为基本相同
* 减少图片的使用，用 iconfont 代替
* 别名 '@' 指向 /src 目录
* 减少 class 组件的使用
* 使用函数调用方式使用函数组件
* 使用 hooks
* 使用 gitflow 方式提交代码
* 无需兼容 IE
* 使用 ESlint 规范 js 代码，现有 lint 规则：
    *  eslint 官方推荐规则
    *  eslint-plugin-react 规则
    *  .eslintrc.js 中的自定义 rules
* 使用 stylelint 规范 css 代码，现有规则:
    *  stylelint-config-standard
* 使用 husky 和 lint-staged 提交代码时进行检查
* 谨慎修改全局配置和全局数据格式

