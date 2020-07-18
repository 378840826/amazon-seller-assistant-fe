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

### 新增页面步骤
1. 创建页面级组件
2. 在 ```config/config.routes.ts``` 添加路由
3. 如果是功能页需要添加导航，在 ```src/layouts/BasicLayout/navigation``` 中添加到对应导航菜单
4. 如果是需要高亮一级导航但是不需要二级导航的页面(例如商品管理>错误报告)，在上一条的基础上并增加字段 ```hide: true```
5. 如果是 index 或 user 等页面需要添加导航，在 ```src/layouts/``` 下对应的布局中添加导航菜单
6. 如果页面需要隐藏或禁用店铺选择器，在 ```src/model/global``` 下的 hiddenShopSelectorUrl 或 disabledShopSelectorUrl 添加页面的路由
7. 如果页面不需要渲染统一样式的页面标题，参考上一条， 在 unshownPageTitleUrl 中添加页面路由

### 分支管理说明
* 遵循新的 git 代码管理流程
* 每个功能分支/修复分支都必须从 master 分支检出
* git 功能分支以 feature/ 开头命名, 修复分支以 fix/ 开头命名
* 环境分支不能直接提交代码，只能接受合并
* 其他详情： https://con.workics.cn/pages/viewpage.action?pageId=127572006
  
### 开发流程
1. 从最新的 master 分支检出分支（以下简称 f 分支）
    * 功能分支命名：feature/xxx
    * 修复分支命名：fix/xxx
2. 在 f 分支上进行开发
3. 开发完成，并本地测试后，提交带有任务前缀的 commit
   * 如： git commit -m "AM-0 增加日本站点"
4. 合并 f 分支到 develop 分支
    * 合并后将触发部署联调环境， 在联调环境上可进行联调测试
    * 如果联调发现问题，继续在当前 f 分支进行修改，修改完成后回到第 3 步
5. 联调完成后， 把 f 分支合并到 test 分支
    * 合并后将触发测试环境部署， 测试人员将进行相关测试
    * 如果测试阶段发现问题，继续在 f 分支进行修改，修改完成后回到第 3 步
6. 测试人员测试没有问题后，把 f 分支合并到 master 分支
    * 合并后将触发正式环境部署。功能开发完成，立即删除 f 分支
  
### 代码风格和规范说明
* 使用了 ESlint 规范 js 代码，现有 lint 规则：
    *  eslint 官方推荐规则
    *  eslint-plugin-react 规则
    *  .eslintrc.js 中的自定义 rules
* 使用了 stylelint 规范 css 代码，现有规则:
    *  stylelint-config-standard
* 使用了 husky 和 lint-staged 提交代码时进行检查
* 所有 interface 以大写字母 I 开头
* 减少图片的使用，用 iconfont 代替
* 减少 class 组件的使用，使用函数组件或 hooks
* TS 避免使用 any，如果必须使用，则只在这一行代码前注释 eslint disable
* 开启了 immer，可简写 reducers

### 其他说明
* 使用了 Less 作为 css 处理器
* 使用了 Jest 作为测试工具
* 测试用例统一放在 ```src/*/**/__test__``` 目录
* yarn test 会匹配所有 .test.ts|tsx 和 .e2e.ts|tsx 结尾的文件
* iconfont 使用 Symbol 方式，引用在 ```utils/utils``` 工具中
* 使用新的 iconfont 项目（Amzics），图标居中放置， padding 和大小设置为基本相同
* 别名 '@' 指向 /src 目录
* 全局数据放在 ```models/global```
* api 相关的通用数据类型定义在 service/API.d.ts
* 若接口中需要 Headers 参数，在 request payload 中添加 headersParams 字段，并在其中定义具体参数
* 谨慎修改全局配置和全局数据类型格式，修改前与相关人员沟通
