/**
 * ESlint 配置
 * 前面的变量方便某些时候更改
 */

const error = 2;
const warn = 1;
const off = 0;

module.exports = {
  extends: [
    // eslint 官方推荐的规则
    'eslint:recommended',
    // eslint-plugin-react 的规则
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 7,
    //指定来源的类型
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      // 自动检查 react 版本
      version: 'detect',
    }
  },
  env: {
    // 预设全局变量的支持
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    jest: true
  },
  rules: {
    // 避免每个 class 组件下的方法都需要写返回类型
    "@typescript-eslint/explicit-function-return-type": off,
    // 要求 interface 以大写字母 I 开头
    '@typescript-eslint/interface-name-prefix': [error, 'always'],
    "react/display-name": off,
    // 关闭 props 验证(已有 TS)
    'react/prop-types': off,
    'default-case': error,
    'no-else-return': error,
    'no-empty-function': error,
    'no-implicit-globals': warn,
    'no-lone-blocks': error,
    'no-loop-func': error,
    'no-script-url': error,
    'no-self-compare': error,
    'no-sequences': error,
    'no-unmodified-loop-condition': error,
    'no-useless-return': error,
    'yoda': error,
    'handle-callback-err': error,
    // 禁止使用 var
    'no-var': 'error',
    // 使用 const 定义常量
    'prefer-const': error,
    // 使用模版字符串
    'prefer-template': error,
    // 优先使用 interface 而不是 type
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    'jsx-a11y/heading-has-content': 'off',

    // 代码风格相关
    // 缩进
    'indent': [error, 2],
    // 一行代码的最大长度
    'max-len': [
      error,
      { 'code': 100, 'ignoreUrls': true, 'ignoreStrings': true, 'ignoreRegExpLiterals': true }
    ],
    // 不允许多个空格
    'no-multi-spaces': warn,
    // 浮点数写全
    'no-floating-decimal': warn,
    // 必须使用全等
    'eqeqeq': error,
    // 必须使用花括号
    'curly': error,
    // 点语法优先
    'dot-notation': warn,
    // 文件末尾需要空行
    'eol-last': error,
    // 数组空格一致
    'array-bracket-spacing': warn,
    // 花括号前后需要空格
    'block-spacing': [warn, 'always'],
    // 大括号的位置一致
    'brace-style': error,
    // 驼峰命名, 解构不受限制
    'camelcase': [warn, { 'ignoreDestructuring': true }],
    // 拖尾逗号, 不同行时使用，同一行时不使用
    'comma-dangle': [warn, 'always-multiline'],
    // 逗号空格统一
    'comma-spacing': warn,
    // 函数名后不能空格
    'func-call-spacing': error,
    // jsx 双引号
    'jsx-quotes': error,
    // 键值对的空格
    'key-spacing': error,
    // 关键字前后的空格必须一致
    'keyword-spacing': error,
    // 类成员之间要空行
    'lines-between-class-members': error,
    // 回调函数最大嵌套
    'max-nested-callbacks': [warn, { 'max': 3 }],
    // 函数最多 3 个参数
    'max-params': warn,
    // 构造函数首字母大写
    'new-cap': error,
    // 最大连续空行 2
    'no-multiple-empty-lines': error,
    // 禁止三元表达式嵌套
    'no-nested-ternary': error,
    // 花括号中需要空格
    'object-curly-spacing': [error, 'always'],
    // 优先使用单引号
    'quotes': [error, 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
    // 使用分号
    'semi': [error, 'always'],
    // 操作符两边需要空格
    'space-infix-ops': error,
    // 箭头函数箭头前后空格
    'arrow-spacing': error,
  }
}