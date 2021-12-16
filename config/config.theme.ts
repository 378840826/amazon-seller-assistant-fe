/*
  主题配置(全局 less 变量)
*/
export default {
  /* 基础设置 */
  // 基础行高
  '@height-base': '30px',
  // 全局主色
  '@primary-color': '#2f99fd',
  // 全局背景
  '@body-background': '#f5f5f5',
  // 布局背景
  '@layout-body-background': '#f5f5f5',
  //footer文字颜色
  '@body-footer': '#dbddff',

  /* 场景颜色 */
  // 成功色
  '@success-color': '#0dc757',
  // 警告色
  '@warning-color': '#ff9800',
  // 错误色
  '@error-color': '#ff5958',
  // 失效色
  // '@disabled-color': '#f8f8f8',
  // 边框色
  '@border-color-base': '#d9d9d9',
  // 分割线色
  '@divider-line-color': '#eee',
  // 分隔线
  '@divider-line': '1px solid #eee',

  /* 文本颜色 */
  // 标题色
  '@heading-color': '#222',
  // 副标题色
  '@heading-color-secondary': '#444',
  // 文本色
  '@text-color': '#555',
  // 次文本色
  '@text-color-secondary': '#888',
  // 失效文本色
  '@text-color-disabled': '#bbb', 
  // 重要文本色 / 警告文本色
  '@text-color-warning': '#ff8c00', 
  // 上升文本色
  '@text-color-up': '#0dc757', 
  // 下降文本色
  '@text-color-down': '#ff5958', 
  // 链接文本色
  '@link-color': '#0083ff',
  // 反白色
  '@text-color-inverse': '#fff',
  // 面包屑导航
  '@breadcrumb-base-color': '@primary-color',
  '@breadcrumb-link-color': '@breadcrumb-base-color',

  /* 文本相关 */
  // 主字号
  '@font-size-base': '14px',
  // 小字号
  '@font-size-sm': '12px',
  // 大字号
  '@font-size-lg': '16px',
  // 组件/浮层圆角
  '@border-radius-base': '4px',
  '@border-radius-sm': '2px',
  // 行高
  '@li-line-height-base': '32px',

  /* 其他 */
  // 小按钮
  '@btn-width-sm': '50px',
  '@btn-height-sm': '20px',
  '@btn-font-size-sm':'12px',
  // 长按钮宽度
  '@btn-long-width': '106px',
  // 自定文字按钮颜色
  '@btn-text-color': '#09c2a6',
  // 自定文字按钮 hover 颜色
  '@btn-text-hover-color': '#009881',
  // 失效按钮
  '@btn-disable-color': 'rgba(0,0,0,0.25)',
  // 输入框 padding
  '@input-padding-horizontal': '14px',
  // 表格头
  '@table-header-bg': '#f2f6fb',
  // 简单表格表格头
  '@simple-table-header-bg': '#fafafa',
  // 表格行 hover 背景色, 和表头一样
  '@table-row-hover-bg': '@table-header-bg',
  // 排序后的表头不需要改变颜色
  '@table-header-sort-bg': 'null',
  // 排序后的列不需要改变颜色
  '@table-body-sort-bg': 'null',
  // 全局 Header 相关
  '@layout-header-padding': '0 30px',
  '@layout-header-height': '52px',
  '@layout-header-background': '#fff',
  '@layout-header-inputBackgroundColor': '#f5f5f5',
  // xl 屏幕
  '@screen-xl': '1400px',
  //table
  '@table-font-size':'12px',
}
