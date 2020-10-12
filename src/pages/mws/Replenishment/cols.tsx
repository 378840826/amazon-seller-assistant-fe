import React from 'react';
import {
  Menu,
  Dropdown,
  Space,
  Typography,
  Button,
  Tag,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Link } from 'umi';
import GoodsImg from '@/pages/components/GoodsImg';
import { Order } from '@/models/replenishment';
import { Iconfont } from '@/utils/utils';
import TransitDetails from './TransitDetails';
import classnames from 'classnames';
import Setting from './Setting';
import GoodsIcon from '../GoodsList/GoodsIcon';
import styles from './index.less';

const { Item: MenuItem } = Menu;
const { Paragraph, Text } = Typography;

const listingStatusDict = {
  Active: '在售',
  Inactive: '不可售',
  Incomplete: '禁止显示',
  Remove: '已移除',
};

const skuStatusDict = {
  stop: '停发',
  normal: '正常',
};

const shippingMethodsDict = {
  byAir: '空运',
  seaTransport: '海运',
  airPie: '空派',
  seaPie: '海派',
};

// 表格空数据占位符
const nullPlaceholder = '—';

// 表格中可以为空的字段
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderCouldNullTd = (value: any) => {
  return value === null ? nullPlaceholder : value;
};

// 排序图标
const renderSortIcon = (order: Order) => {
  let className = '';
  if (order === 'ascend') {
    className = 'ant-table-column-sorter-up';
  } else {
    className = 'ant-table-column-sorter-down';
  }
  return (
    <span className="ant-table-column-sorter">
      <span className={className}></span>
    </span>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFullColumns = (params: any) => {
  const {
    setting,
    switchSettingVisible,
    handleSortChange,
    customCols,
    sort,
    order,
    compareType,
  } = params;

  // 获取自定义排序下拉框的 menuItem
  const getMenuItem = (menuItemSort: string, menuItemOrder: string, name: string) => {
    const key = `${menuItemSort}-${menuItemOrder}`;
    const className = (menuItemOrder === order && menuItemSort === sort) ? styles.active : null;
    return <MenuItem key={key} className={className}>{name}</MenuItem>;
  };

  // 点击下拉排序
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSortMenuClick = ({ key }: any) => {
    const [newSort, newOrder] = key.split('-');
    handleSortChange(newSort, newOrder);
  };

  // 环比单元格： 百分比和数值
  const compareTd = function (obj: { [key: string]: string | number }) {
    // 要显示的环比是百分比还是数值
    const { value, percentValue, numberValue } = obj;
    let compareValue = percentValue;
    let suffix = '%';
    if (compareType === 'number') {
      compareValue = numberValue;
      suffix = '';
    }
    // 上升还是下降
    let className = styles.up;
    let prefix = '+';
    if (compareValue < 0) {
      className = styles.down;
      // 负号后端数据自带
      prefix = '';
    }
    return (
      <Space direction="vertical">
        { value }
        {
          compareValue !== null
            ?
            <Text type="secondary">
              <span className={className}>{prefix}{compareValue}{suffix}</span>
            </Text>
            :
            nullPlaceholder
        }
      </Space>
    );
  };

  // 全部列
  const columns: ColumnProps<API.IInventoryReplenishment>[] = [
    {
      title: '上次修改',
      dataIndex: 'lastModifiedTime',
      sorter: true,
      sortOrder: sort === 'lastModifiedTime' ? order : null,
      align: 'center',
      width: 94,
      fixed: 'left',
      render: value => renderCouldNullTd(value),
    }, {
      title: '状态',
      dataIndex: 'skuStatus',
      key: 'skuStatus',
      align: 'center',
      width: 50,
      fixed: 'left',
      render: skuStatus => {
        return (
          <Text>{skuStatusDict[skuStatus]}</Text>
        );
      },
    }, {
      title: () => <>商品信息{ GoodsIcon.question('标题 / ASIN / SKU / FNSKU') }</>,
      dataIndex: 'title',
      align: 'center',
      width: 310,
      fixed: 'left',
      render: (title, record) => (
        <div className={styles.goodsInfoContainer}>
          <GoodsImg src={record.img} alt="商品图" width={46} />
          <div className={styles.goodsInfoContent}>
            <Paragraph ellipsis className={styles.goodsTitle}>
              {
                record.newProduct ? <span className={styles.newProduct}>新品</span> : null
              }
              <Iconfont className={styles.link} type="icon-lianjie" />
              <a title={title} href={record.url} target="_blank" rel="noopener noreferrer">{title}</a>
            </Paragraph>
            <div className={styles.goodsInfoRow}>
              <Text>{record.sku}</Text>
              <Text>{record.fnSku}</Text>
            </div>
            <div className={styles.goodsInfoRow}>
              <Link to={`/asin/base?asin=${record.asin}`} title="跳转到ASIN总览">{record.asin}</Link>
              {
                record.listingStatus === 'Active' || record.listingStatus === 'Incomplete'
                  ? <Text>{listingStatusDict[record.listingStatus]}</Text>
                  : <Text disabled>{listingStatusDict[record.listingStatus]}</Text>
              }
            </div>
              
          </div>
        </div>
      ),
    }, {
      title: () => (
        <span>上架时间</span>
      ),
      sorter: true,
      sortOrder: sort === 'openDate' ? order : null,
      dataIndex: 'openDate',
      key: 'openDate',
      align: 'center',
      width: 100,
      render: openDate => (openDate ? <Text>{openDate}</Text> : nullPlaceholder),
    }, {
      title: () => {
        const menu = (
          <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
            { getMenuItem('reviewScore', 'ascend', '评分升序') }
            { getMenuItem('reviewScore', 'descend', '评分降序') }
            { getMenuItem('reviewCount', 'ascend', '评论数升序') }
            { getMenuItem('reviewCount', 'descend', '评论数降序') }
          </Menu>
        );
        return (
          <Dropdown overlay={menu} placement="bottomRight">
            <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn')}>
              Review
              {
                (sort === 'reviewScore' || sort === 'reviewCount') ? renderSortIcon(order) : null
              }
            </span>
          </Dropdown>
        );
      },
      dataIndex: 'reviewScore',
      key: 'review',
      align: 'center',
      width: 80,
      render: (reviewScore, record) => (
        <Space direction="vertical">
          {
            record.reviewCount !== null
              ?
              <>
                { reviewScore }
                <Text type="secondary">
                  (<span className={styles.reviewCount}>{record.reviewCount}</span>)
                </Text>
              </>
              : nullPlaceholder
          }
        </Space>
      ),
    }, {
      title: '总库存',
      sorter: true,
      sortOrder: sort === 'totalInventory' ? order : null,
      dataIndex: 'totalInventory',
      key: 'totalInventory',
      align: 'center',
      width: 86,
      render: (totalInventory, record) => (
        <Space direction="vertical">
          { totalInventory }
          {
            record.sharedState
              ?
              <span className={styles.up}>共享</span>
              : null
          }
        </Space>
      ),
    }, {
      title: '现有库存',
      key: 'existingInventory',
      children: [
        {
          title: () => <span className="leftTitle">available</span>,
          sorter: true,
          sortOrder: sort === 'sellable' ? order : null,
          dataIndex: 'sellable',
          align: 'center',
          width: 80,
        }, {
          title: () => <span className="rightTitle">reserved可售</span>,
          sorter: true,
          sortOrder: sort === 'reservedAvailable' ? order : null,
          dataIndex: 'reservedAvailable',
          align: 'center',
          width: 100,
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    }, {
      title: '在途库存',
      sorter: true,
      sortOrder: sort === 'inTransitInventory' ? order : null,
      dataIndex: 'inTransitInventory',
      key: 'inTransitInventory',
      align: 'center',
      width: 86,
      render: (_, record) => {
        return <TransitDetails sku={record.sku} inTransitInventory={record.inTransitInventory} />;
      },
    }, {
      title: () => <>订单量<Text type="secondary">（环比）</Text></>,
      key: 'orderCount',
      children: [
        {
          title: () => {
            const menu = (
              <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
                { getMenuItem('orderCount7day', 'ascend', '7天订单量升序') }
                { getMenuItem('orderCount7day', 'descend', '7天订单量降序') }
                { getMenuItem('orderFluctuation_7', 'ascend', '7天环比升序') }
                { getMenuItem('orderFluctuation_7', 'descend', '7天环比降序') }
              </Menu>
            );
            return (
              <Dropdown overlay={menu} placement="bottomRight">
                <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'leftTitle')}>
                  7天
                  {
                    (sort === 'orderCount7day' || sort === 'orderFluctuation_7') ? renderSortIcon(order) : null
                  }
                </span>
              </Dropdown>
            );
          },
          dataIndex: 'orderCount7day',
          align: 'center',
          width: 80,
          render: (orderCount7day: string, record: API.IInventoryReplenishment) => (
            compareTd({
              value: orderCount7day,
              percentValue: record.orderCount7dayRatio,
              numberValue: record.orderSevenNumRatioSub,
            })
          ),
        }, {
          title: () => {
            const menu = (
              <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
                { getMenuItem('orderCount15day', 'ascend', '15天订单量升序') }
                { getMenuItem('orderCount15day', 'descend', '15天订单量降序') }
                { getMenuItem('orderFluctuation_15', 'ascend', '15天环比升序') }
                { getMenuItem('orderFluctuation_15', 'descend', '15天环比降序') }
              </Menu>
            );
            return (
              <Dropdown overlay={menu} placement="bottomRight">
                <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'middleTitle')}>
                  15天
                  {
                    (sort === 'orderCount15day' || sort === 'orderFluctuation_15') ? renderSortIcon(order) : null
                  }
                </span>
              </Dropdown>
            );
          },
          dataIndex: 'orderCount15day',
          align: 'center',
          width: 80,
          render: (orderCount15day: string, record: API.IInventoryReplenishment) => (
            compareTd({
              value: orderCount15day,
              percentValue: record.orderCount15dayRatio,
              numberValue: record.orderFifteenNumRatioSub,
            })
          ),
        }, {
          title: () => {
            const menu = (
              <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
                { getMenuItem('orderCount30day', 'ascend', '30天订单量升序') }
                { getMenuItem('orderCount30day', 'descend', '30天订单量降序') }
                { getMenuItem('orderFluctuation_30', 'ascend', '30天环比升序') }
                { getMenuItem('orderFluctuation_30', 'descend', '30天环比降序') }
              </Menu>
            );
            return (
              <Dropdown overlay={menu} placement="bottomRight">
                <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'rightTitle')}>
                  30天
                  {
                    (sort === 'orderCount30day' || sort === 'orderFluctuation_30') ? renderSortIcon(order) : null
                  }
                </span>
              </Dropdown>
            );
          },
          dataIndex: 'orderCount30day',
          align: 'center',
          width: 80,
          render: (orderCount30day: string, record: API.IInventoryReplenishment) => (
            compareTd({
              value: orderCount30day,
              percentValue: record.orderCount30dayRatio,
              numberValue: record.orderThirtyNumRatioSub,
            })
          ),
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    }, {
      title: () => <>销量<Text type="secondary">（环比）</Text></>,
      key: 'salesCount',
      children: [
        {
          title: () => {
            const menu = (
              <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
                { getMenuItem('orderSalesCount7day', 'ascend', '7天销量升序') }
                { getMenuItem('orderSalesCount7day', 'descend', '7天销量降序') }
                { getMenuItem('salesFluctuation_7', 'ascend', '7天环比升序') }
                { getMenuItem('salesFluctuation_7', 'descend', '7天环比降序') }
              </Menu>
            );
            return (
              <Dropdown overlay={menu} placement="bottomRight">
                <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'leftTitle')}>
                  7天
                  {
                    (sort === 'orderSalesCount7day' || sort === 'salesFluctuation_7') ? renderSortIcon(order) : null
                  }
                </span>
              </Dropdown>
            );
          },
          dataIndex: 'orderSalesCount7day',
          align: 'center',
          width: 80,
          render: (orderSalesCount7day: string, record: API.IInventoryReplenishment) => (
            compareTd({
              value: orderSalesCount7day,
              percentValue: record.orderSalesCount7dayRatio,
              numberValue: record.salesSevenNumRatioSub,
            })
          ),
        }, {
          title: () => {
            const menu = (
              <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
                { getMenuItem('orderSalesCount15day', 'ascend', '15天销量升序') }
                { getMenuItem('orderSalesCount15day', 'descend', '15天销量降序') }
                { getMenuItem('salesFluctuation_15', 'ascend', '15天环比升序') }
                { getMenuItem('salesFluctuation_15', 'descend', '15天环比降序') }
              </Menu>
            );
            return (
              <Dropdown overlay={menu} placement="bottomRight">
                <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'middleTitle')}>
                  15天
                  {
                    (sort === 'orderSalesCount15day' || sort === 'salesFluctuation_15') ? renderSortIcon(order) : null
                  }
                </span>
              </Dropdown>
            );
          },
          dataIndex: 'orderSalesCount15day',
          align: 'center',
          width: 80,
          render: (orderSalesCount15day: string, record: API.IInventoryReplenishment) => (
            compareTd({
              value: orderSalesCount15day,
              percentValue: record.orderSalesCount15dayRatio,
              numberValue: record.salesFifteenNumRatioSub,
            })
          ),
        }, {
          title: () => {
            const menu = (
              <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
                { getMenuItem('orderSalesCount30day', 'ascend', '30天销量升序') }
                { getMenuItem('orderSalesCount30day', 'descend', '30天销量降序') }
                { getMenuItem('salesFluctuation_30', 'ascend', '30天环比升序') }
                { getMenuItem('salesFluctuation_30', 'descend', '30天环比降序') }
              </Menu>
            );
            return (
              <Dropdown overlay={menu} placement="bottomRight">
                <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'rightTitle')}>
                  30天
                  {
                    (sort === 'orderSalesCount30day' || sort === 'salesFluctuation_30') ? renderSortIcon(order) : null
                  }
                </span>
              </Dropdown>
            );
          },
          dataIndex: 'orderSalesCount30day',
          align: 'center',
          width: 80,
          render: (orderSalesCount30day: string, record: API.IInventoryReplenishment) => (
            compareTd({
              value: orderSalesCount30day,
              percentValue: record.orderSalesCount30dayRatio,
              numberValue: record.salesThirtyNumRatioSub,
            })
          ),
        },
      ],
    }, {
      title: '备货周期',
      sorter: true,
      sortOrder: sort === 'stockingCycle' ? order : null,
      dataIndex: 'stockingCycle',
      key: 'stockingCycle',
      align: 'center',
      width: 86,
    }, {
      title: '头程天数',
      sorter: true,
      sortOrder: sort === 'firstPass' ? order : null,
      dataIndex: 'firstPass',
      key: 'firstPass',
      align: 'center',
      width: 86,
    }, {
      title: () => (<>总库存<br/>可售天数</>),
      sorter: true,
      sortOrder: sort === 'totalInventoryAvailableDays' ? order : null,
      dataIndex: 'totalInventoryAvailableDays',
      key: 'totalInventoryAvailableDays',
      align: 'center',
      width: 86,
      render: value => renderCouldNullTd(value),
    }, {
      title: () => (<>现有库存<br />可售天数</>),
      sorter: true,
      sortOrder: sort === 'availableDaysOfExistingInventory' ? order : null,
      dataIndex: 'availableDaysOfExistingInventory',
      key: 'availableDaysOfExistingInventory',
      align: 'center',
      width: 86,
      render: value => renderCouldNullTd(value),
    }, {
      title: () => (<>现有库存<br />预计售罄</>),
      sorter: true,
      sortOrder: sort === 'estimatedOutOfStockTime' ? order : null,
      dataIndex: 'estimatedOutOfStockTime',
      key: 'estimatedOutOfStockTime',
      align: 'center',
      width: 100,
      render: value => renderCouldNullTd(value),
    }, {
      title: '建议补货量',
      sorter: true,
      sortOrder: sort === 'recommendedReplenishmentVolume' ? order : null,
      dataIndex: 'recommendedReplenishmentVolume',
      key: 'recommendedReplenishmentVolume',
      align: 'center',
      width: 96,
      className: styles.recommendedReplenishmentVolumeTd,
      render: value => renderCouldNullTd(value),
    }, {
      title: '物流方式',
      dataIndex: 'shippingMethodsList',
      key: 'shippingMethodsList',
      align: 'center',
      width: 90,
      render: shippingMethodsList => {
        const lastSub = shippingMethodsList.length - 1;
        return shippingMethodsList.map((element: string, i: number) => {
          const item = `${shippingMethodsDict[element]}`;
          return i === lastSub ? item : `${item}、`;
        });
      },
    }, {
      title: '标签',
      dataIndex: 'labels',
      key: 'labels',
      align: 'center',
      width: 110,
      render: labels => {
        return labels.map((label: { id: string; labelName: string }) => {
          return <Tag key={label.id} className={styles.label}>{label.labelName}</Tag>;
        });
      },
    }, {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 40,
      fixed: 'right',
      render: (_, record) => {
        let activeClassName = '';
        const visible = setting.visible && setting.sku === record.sku;
        if (visible) {
          activeClassName = styles.activeSettingBtn;
        }
        return (
          <Dropdown
            // 批量和单个是一起用的，避免 form initialValue 混乱，关闭弹窗后取消弹窗内容
            overlay={visible ? <Setting /> : <></>}
            visible={visible}
            placement="bottomRight"
            trigger={['click']}
            arrow
            onVisibleChange={visible => {
              switchSettingVisible(visible, record.sku);
            }}
          >
            <Button type="link" className={classnames(styles.settingBtn, activeClassName)}>
              设置
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  // 按自定义列返回数据
  const cols: ColumnProps<API.IInventoryReplenishment>[] = [];
  columns.forEach(col => {
    !col.key && cols.push(col);
    if (customCols[col.key || '']) {
      cols.push(col);
    }
  });
  
  return cols;
};
