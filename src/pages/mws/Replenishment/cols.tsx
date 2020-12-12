import React from 'react';
import {
  Dropdown,
  Space,
  Typography,
  Button,
  Tag,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Link } from 'umi';
import GoodsImg from '@/pages/components/GoodsImg';
import TransitDetails from './TransitDetails';
import classnames from 'classnames';
import Setting from './Setting';
import GoodsIcon from '@/pages/components/GoodsIcon';
import DropdownSortTh from '@/pages/components/DropdownSortTh';
import styles from './index.less';

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
    let compareValue: string | number = Number(percentValue).toFixed(2);
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
          <GoodsImg src={record.img} alt="商品" width={46} />
          <div className={styles.goodsInfoContent}>
            <Paragraph ellipsis className={styles.goodsTitle}>
              {
                record.newProduct ? <span className={styles.newProduct}>新品</span> : null
              }
              <Paragraph ellipsis className={styles.goodsTitle}>
                { GoodsIcon.link() }
                <a title={title} href={record.url} target="_blank" rel="noopener noreferrer">{title}</a>
              </Paragraph>
            </Paragraph>
            <div className={styles.goodsInfoRow}>
              <div className={styles.asin}>
                <Link to={`/asin/base?asin=${record.asin}`} title="跳转到ASIN总览">{record.asin}</Link>
              </div>
              <Text>{record.fnSku}</Text>
            </div>
            <div className={styles.goodsInfoRow}>
              <Text>{record.sku}</Text>
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
        return (
          <DropdownSortTh
            sort={sort}
            order={order}
            handleSortMenuClick={handleSortMenuClick}
            content="Review"
            sortItems={[
              { name: '评分', key: 'reviewScore' },
              { name: '评论数', key: 'reviewCount' },
            ]}
          />
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
                { reviewScore && reviewScore.toFixed(1) }
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
            return (
              <DropdownSortTh
                sort={sort}
                order={order}
                handleSortMenuClick={handleSortMenuClick}
                content={
                  <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'leftTitle')}>
                    7 天
                  </span>
                }
                sortItems={[
                  { name: '7天订单量', key: 'orderCount7day' },
                  { name: '7天环比', key: 'orderFluctuation_7' },
                ]}
              />
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
            return (
              <DropdownSortTh
                sort={sort}
                order={order}
                handleSortMenuClick={handleSortMenuClick}
                content={
                  <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'middleTitle')}>
                    15 天
                  </span>
                }
                sortItems={[
                  { name: '15天订单量', key: 'orderCount15day' },
                  { name: '15天环比', key: 'orderFluctuation_15' },
                ]}
              />
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
            return (
              <DropdownSortTh
                sort={sort}
                order={order}
                handleSortMenuClick={handleSortMenuClick}
                content={
                  <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'rightTitle')}>
                    30 天
                  </span>
                }
                sortItems={[
                  { name: '30天订单量', key: 'orderCount30day' },
                  { name: '30天环比', key: 'orderFluctuation_30' },
                ]}
              />
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
            return (
              <DropdownSortTh
                sort={sort}
                order={order}
                handleSortMenuClick={handleSortMenuClick}
                content={
                  <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'leftTitle')}>
                    7 天
                  </span>
                }
                sortItems={[
                  { name: '7天销量', key: 'orderSalesCount7day' },
                  { name: '7天环比', key: 'salesFluctuation_7' },
                ]}
              />
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
            return (
              <DropdownSortTh
                sort={sort}
                order={order}
                handleSortMenuClick={handleSortMenuClick}
                content={
                  <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'middleTitle')}>
                    15 天
                  </span>
                }
                sortItems={[
                  { name: '15天销量', key: 'orderSalesCount15day' },
                  { name: '15天环比', key: 'salesFluctuation_15' },
                ]}
              />
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
            return (
              <DropdownSortTh
                sort={sort}
                order={order}
                handleSortMenuClick={handleSortMenuClick}
                content={
                  <span className={classnames(styles.sortMenuBtn, 'sort-menu-btn', 'rightTitle')}>
                    30 天
                  </span>
                }
                sortItems={[
                  { name: '30天销量', key: 'orderSalesCount30day' },
                  { name: '30天环比', key: 'salesFluctuation_30' },
                ]}
              />
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
            // 多个商品一起用的，避免 form initialValue 等重复或混乱，关闭弹窗后卸载弹窗组件
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
