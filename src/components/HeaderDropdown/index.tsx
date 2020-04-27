import { DropDownProps } from 'antd/es/dropdown';
import { Dropdown } from 'antd';
import React from 'react';
import styles from './index.less';

declare type OverlayFunc = () => React.ReactNode;

export interface IHeaderDropdownProps extends Omit<DropDownProps, 'overlay'> {
  overlayClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overlay: React.ReactNode | OverlayFunc | any;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
}

const HeaderDropdown: React.FC<IHeaderDropdownProps> = ({ ...restProps }) => {
  return (
    <Dropdown overlayClassName={styles.container} {...restProps} />
  );
};

export default HeaderDropdown;
