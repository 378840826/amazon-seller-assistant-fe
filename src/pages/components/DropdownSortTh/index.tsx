/**
 * 下拉排序表头的内容和下拉箭头
 */

import React, { ReactElement } from 'react';
import { Dropdown, Menu } from 'antd';
import { Order } from '@/models/goodsList';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import styles from './index.less';

interface ISortItem {
  name: string;
  key: string;
  order: Order;
}

interface IProps {
  // 表格目前排序项目的 key
  sort: string;
  // 表格目前排序项目的排序状态。升序/降序/不排序 ('ascend'/'descend'/undefined)
  order: Order;
  // 此表头的下拉排序项
  sortItems: { name: string; key: string }[];
  // 表头内容
  content: ReactElement | string;
  // 点击下拉菜单回调
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSortMenuClick: any;
}

// 排序图标
const renderSortIcon = function (targetOrder: Order) {
  return (
    <span className="ant-table-column-sorter ant-table-column-sorter-full">
      <span className="ant-table-column-sorter-inner">
        <CaretUpOutlined
          className={`anticon anticon-caret-up ant-table-column-sorter-up ${targetOrder === 'ascend' ? 'active' : ''}`}
        />
        <CaretDownOutlined
          className={`anticon anticon-caret-down ant-table-column-sorter-down  ${targetOrder === 'descend' ? 'active' : ''}`}
        />
      </span>
    </span>
  );
};

const DropdownSortTh: React.FC<IProps> = props => {
  const { sortItems, sort, order, content, handleSortMenuClick } = props;
  // 此表头是否正在排序
  const isTargetSort = sortItems.some(item => item.key === sort);
  // 此表头的排序状态
  const targetOrder = isTargetSort ? order : undefined;
  // 由于 map 必须指定 key，造成 map 一次只能返回一个元素, 所以先展开 sortItems
  const expansionSortItems: ISortItem[] = [];
  sortItems.forEach(item => {
    const { name, key } = item;
    expansionSortItems.push(
      {
        key,
        name: `${name}升序`,
        order: 'ascend',
      }, {
        key,
        name: `${name}降序`,
        order: 'descend',
      }
    );
  });

  // 下拉框的 Menu.Item
  const getMenuItem = (sortItem: ISortItem) => {
    const { name, key: itemKey, order: itemOrder } = sortItem;
    const className = (itemOrder === targetOrder && itemKey === sort) ? styles.active : null;
    const key = `${itemKey}-${itemOrder}`;
    return <Menu.Item key={key} className={className}>{name}</Menu.Item>;
  };

  const menu = (
    <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
      { expansionSortItems.map(sortItem => getMenuItem(sortItem)) }
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight" className={styles.Dropdown}>
      <div className="ant-table-column-sorters">
        <span>{content}</span>
        { renderSortIcon(targetOrder) }
      </div>
    </Dropdown>
  );
};

export default DropdownSortTh;
