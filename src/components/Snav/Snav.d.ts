declare namespace Snav {
  interface INavList {
    label: string;
    path?: string;
    type?: 'Link' | 'a' | ''; // 路由Link 普通链接 普通文本    默认普通文本
    state?: {}; // Link 传给新路由的state
    search?: string;
    target?: '_blank' | '_self' | '_parent' | '_top'; // 链接打开方式（默认_self）
  }

  interface IProps {
    style?: React.CSSProperties;
    className?: React.CSSProperties;
    navList: Snav.INavList[];
  }
}
