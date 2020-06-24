import React from 'react';
import { Anchor } from 'antd';
import styles from './index.less';
interface IMenuItemProps {
  href: string;
  name: string;
  top: number;
}

const { Link } = Anchor;

const menuList: Array<IMenuItemProps> = [
  { href: '#home', name: '首页', top: 0 },
  { href: '#fun', name: '功能', top: 864 },
  { href: '#pay', name: '付费', top: 1644 },
  { href: '#fqa', name: 'FAQ', top: 2359 },
];

const MenuCom: React.FC = () => {
  return (
    <div className={styles.menu}>
      <Anchor affix={false}>
        {
          menuList.map((item: IMenuItemProps, key) => {
            const { href, name } = item;
            return (
              <Link className={`menu_${ key}` } key={href} href={href} title={name} />
            );
          })
        }
      </Anchor>
    </div>
  );
};
export default MenuCom;
