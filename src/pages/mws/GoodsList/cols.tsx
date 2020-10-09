import React from 'react';
import { Link } from 'umi';
import {
  Switch,
  message,
  Select,
  Menu,
  Dropdown,
  Space,
  Tooltip,
  Typography,
  Input,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import GoodsIcon from './GoodsIcon';
import { day, strToMoneyStr } from '@/utils/utils';
import { renderSortIcon } from './utils';
import editable from '@/pages/components/EditableCell';
import GoodsImg from '@/pages/components/GoodsImg';
import styles from './index.less';

const { Option } = Select;
const { Item: MenuItem } = Menu;
const { Paragraph, Text } = Typography;
const { Search } = Input;

export const listingStatusDict = {
  Active: '在售',
  Inactive: '不可售',
  Incomplete: '禁止显示',
  Remove: '已移除',
};

const dateRange7 = day.getDateRange({ start: 7 });
const dateRange30 = day.getDateRange({ start: 30 });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFullColumns = (params: any) => {
  const {
    loadingAdjustSwitch,
    updatePrice,
    handleGroupChange,
    handleNewGroup,
    updateGoodsUserDefined,
    handleAdjustSwitchClick,
    handleSortChange,
    handleFastPrice,
    groups,
    customCols,
    sort,
    order,
    currency,
  } = params;

  // 点击下拉排序
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSortMenuClick = ({ key }: any) => {
    const [newSort, newOrder] = key.split('-');
    handleSortChange(newSort, newOrder);
  };

  // 分组下拉选择
  const groupsOptions = (
    <>
      {
        groups.map((group: API.IGroup) => (
          <Option key={group.id} value={group.id}>{group.groupName}</Option>
        ))
      }
    </>
  );
  
  // 全部列
  const columns: ColumnProps<API.IGoods>[] = [
    {
      title: '分组',
      dataIndex: 'groupId',
      key: 'group',
      align: 'center',
      width: 156,
      fixed: 'left',
      render: (_, record) => (
        <Select
          size="small"
          style={{ minWidth: '100%', textAlign: 'center' }}
          dropdownClassName={styles.SelectDropdown}
          bordered={false}
          defaultValue={record.groupId}
          value={record.groupId}
          listHeight={330}
          onChange={newGroupId => {
            handleGroupChange(newGroupId, record);
          }}
          dropdownRender={menu => (
            <div>
              {menu}
              <div className={styles.tableAddGroup}>
                <div className={styles.tableAddGroupTitle}>新建分组</div>
                <Search
                  // 用 Search 组件改造的新建分组
                  placeholder="请输入分组名称"
                  enterButton="保存"
                  size="small"
                  maxLength={6}
                  onSearch={value => handleNewGroup(value, record.id)}
                />
              </div>
            </div>
          )}
        >
          { groupsOptions }
        </Select>
      ),
    }, {
      title: '商品信息',
      dataIndex: 'title',
      key: '',
      align: 'center',
      width: 330,
      fixed: 'left',
      render: (title, record) => (
        <div className={styles.goodsInfoContainer}>
          <GoodsImg src={record.imgUrl} alt="商品图" width={46} />
          <div className={styles.goodsInfoContent}>
            {
              customCols.title
              &&
              <Paragraph ellipsis className={styles.goodsTitle}>
                { GoodsIcon.link }
                <a title={title} href={record.url} target="_blank" rel="noopener noreferrer">{title}</a>
              </Paragraph>
            }
            {
              customCols.asin
              &&
              <div>
                <Text>{record.asin}</Text>
              </div>
            }
            <div className={styles.iconContainer}>
              {
                customCols.tag
                &&
                <>
                  { record.idAdd && GoodsIcon.add(record.addOnItem) }
                  { record.isAc && GoodsIcon.ac(record.acKeyword) }
                  { record.isBs && GoodsIcon.bs(record.bsCategory) }
                  { record.isNr && GoodsIcon.nr(record.nrCategory) }
                  { record.isPrime && GoodsIcon.prime }
                  { record.isPromotion && GoodsIcon.promotion }
                  { record.isCoupon && GoodsIcon.coupon(record.coupon) }
                </>
              }
              <div style={{ float: 'right' }}>
                {
                  customCols.usedNewSellNum
                  &&
                  <span style={{ marginRight: 8 }} title="卖家数">
                    {record.usedNewSellNum ? GoodsIcon.seller(record.usedNewSellNum) : null}
                  </span>
                }
                {
                  customCols.isBuyBox
                  &&
                  <span
                    style={{ display: 'inline-block', width: 16 }}
                    title="已占有黄金购物车，非实时数据，如需实时监控，请使用跟卖监控功能"
                  >
                    { record.isBuyBox && GoodsIcon.buyBoxcart }
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      ),
    }, {
      title: () => (
        <span>
          SKU
          { GoodsIcon.question('点击可按上架时间排序') }
        </span>
      ),
      sorter: true,
      sortOrder: sort === 'openDate' ? order : null,
      dataIndex: 'openDate',
      key: 'sku-openDate',
      align: 'center',
      width: 120,
      render: (openDate, record) => (
        <>
          {
            customCols.sku
            &&
            <div style={{ marginBottom: 2 }}>{record.sku}</div>
          }
          {
            customCols.openDate
            &&
            <Text type="secondary">{openDate}</Text>
          }
        </>
      ),
    }, {
      title: '状态',
      dataIndex: 'listingStatus',
      key: 'listingStatus-fulfillmentChannel',
      align: 'center',
      width: 70,
      render: (listingStatus, record) => (
        <Space direction="vertical">
          {
            customCols.listingStatus
            &&
            <div>
              {
                listingStatus === 'Active' || listingStatus === 'Incomplete'
                  ? <Text>{listingStatusDict[listingStatus]}</Text>
                  : <Text disabled>{listingStatusDict[listingStatus]}</Text>
              }
            </div>
          }
          {
            customCols.fulfillmentChannel
            &&
            <div>
              {
                <Text
                  className={styles[`Text-${record.fulfillmentChannel}`]}
                >{record.fulfillmentChannel}</Text>
              }
            </div>
          }
        </Space>
      ),
    }, {
      title: () => {
        const menu = (
          <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
            <MenuItem key="sellable-ascend">
              库存升序
            </MenuItem>
            <MenuItem key="sellable-descend">
              库存降序
            </MenuItem>
            <MenuItem key="sellableDays-ascend">
              可售天数升序
            </MenuItem>
            <MenuItem key="sellableDays-descend">
              可售天数降序
            </MenuItem>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} placement="bottomRight">
            <span style={{ cursor: 'pointer' }}>
              可售库存
              { GoodsIcon.question('可售库存，等同于后台available库存') }
              {
                (sort === 'sellable' || sort === 'sellableDays') ? renderSortIcon(order) : null
              }
            </span>
          </Dropdown>
        );
      },
      dataIndex: 'sellable',
      key: 'sellable-sellableDays',
      align: 'center',
      width: 100,
      render: (sellable, record) => (
        <Space direction="vertical">
          {
            customCols.sellable
            &&
            sellable
          }
          {
            customCols.sellableDays
            &&
            <div>
              {
                record.sellableDays
                  ?
                  <div title={`预计可售${record.sellableDays}天`}>
                    { GoodsIcon.hongqi }
                    <Text type="secondary">{record.sellableDays}天</Text>
                  </div>
                  : null
              }
            </div>
          }
        </Space>
      ),
    }, {
      title: 'inbound',
      sorter: true,
      sortOrder: sort === 'inbound' ? order : null,
      dataIndex: 'inbound',
      key: 'inbound',
      align: 'center',
      width: 76,
    }, {
      title: () => (
        <span>
          售价
          { GoodsIcon.question('售价+配送费')}
        </span>
      ),
      sorter: true,
      sortOrder: sort === 'price' ? order : null,
      dataIndex: 'price',
      key: 'price-postage',
      align: 'right',
      width: 90,
      render: (price, record) => (
        <Space direction="vertical">
          {
            customCols.price
            &&
            editable({
              inputValue: price,
              formatValueFun: strToMoneyStr,
              prefix: currency,
              maxLength: 20,
              confirmCallback: value => {
                if (!Number(value)) {
                  message.error('售价不能为空或0');
                  return;
                }
                updatePrice({
                  type: 1,
                  ids: [record.id],
                  price: parseFloat(value).toFixed(2),
                });
              },
            })
          }
          {
            customCols.postage && record.postage
              ?
              <Text type="secondary" style={{ marginRight: 17 }}>
                +{currency}{record.postage}
              </Text>
              :
              null
          }
        </Space>
      ),
    }, {
      title: '成本',
      sorter: true,
      sortOrder: sort === 'cost' ? order : null,
      dataIndex: 'cost',
      key: 'cost',
      align: 'right',
      width: 90,
      render: (price, record) => (
        editable({
          inputValue: price,
          formatValueFun: strToMoneyStr,
          prefix: price === null ? '' : currency,
          maxLength: 20,
          confirmCallback: value => {
            updateGoodsUserDefined({
              id: record.id,
              sku: record.sku,
              cost: parseFloat(value).toFixed(2),
            });
          },
        })
      ),
    }, {
      title: '头程',
      sorter: true,
      sortOrder: sort === 'freight' ? order : null,
      dataIndex: 'freight',
      key: 'freight',
      align: 'right',
      width: 90,
      render: (freight, record) => (
        editable({
          inputValue: freight,
          formatValueFun: strToMoneyStr,
          prefix: freight === null ? '' : currency,
          maxLength: 20,
          confirmCallback: value => {
            updateGoodsUserDefined({
              id: record.id,
              sku: record.sku,
              freight: parseFloat(value).toFixed(2),
            });
          },
        })
      ),
    }, {
      title: () => (
        <span>
          平台费用
          { GoodsIcon.question('佣金+FBA fee')}
        </span>
      ),
      dataIndex: 'commission',
      key: 'commission-fbaFee',
      align: 'right',
      width: 90,
      render: (commission, record) => (
        <Space direction="vertical">
          {
            customCols.commission
            &&
            (
              commission
                ?
                <div>{currency}{commission}</div>
                :
                '—'
            )
          }
          {
            customCols.fbaFee
            &&
            (
              record.fbaFee
                ?
                <Text type="secondary">
                  +{currency}{record.fbaFee}
                </Text>
                :
                '—'
            )
          }
        </Space>
      ),
    }, {
      title: () => {
        const menu = (
          <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
            <MenuItem key="profit-ascend">
              利润升序
            </MenuItem>
            <MenuItem key="profit-descend">
              利润降序
            </MenuItem>
            <MenuItem key="profitMargin-ascend">
              利润率升序
            </MenuItem>
            <MenuItem key="profitMargin-descend">
              利润率降序
            </MenuItem>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} placement="bottomRight">
            <span style={{ cursor: 'pointer' }}>
              利润
              {GoodsIcon.question('利润=售价-成本-头程-FBA fee-佣金-推广-仓储-其他费用；利润率=利润/售价*100%')}
              {
                (sort === 'profit' || sort === 'profitMargin') ? renderSortIcon(order) : null
              }
            </span>
          </Dropdown>
        );
      },
      dataIndex: 'profit',
      key: 'profit-profitMargin',
      align: 'right',
      width: 80,
      render: (profit, record) => (
        profit
          ?
          <Space direction="vertical">
            {
              customCols.profit
              &&
              <div>{currency}{profit}</div>
            }
            {
              customCols.profitMargin
              &&
              <Text type="secondary">
                ({ record.profitMargin }%)
              </Text>
            }
          </Space>
          :
          null
      ),
    }, {
      title: () => {
        const menu = (
          <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
            <MenuItem key="dayOrder7Count-ascend">
              7天订单升序
            </MenuItem>
            <MenuItem key="dayOrder7Count-descend">
              7天订单降序
            </MenuItem>
            <MenuItem key="dayOrder7Ratio-ascend">
              7天环比升序
            </MenuItem>
            <MenuItem key="dayOrder7Ratio-descend">
              7天环比降序
            </MenuItem>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} placement="bottomRight">
            <span style={{ cursor: 'pointer' }}>
              7天订单
              { GoodsIcon.question(`周期：${dateRange7[0]}-${dateRange7[1]}`) }
              {
                (sort === 'dayOrder7Count' || sort === 'dayOrder7Ratio') ? renderSortIcon(order) : null
              }
            </span>
          </Dropdown>
        );
      },
      dataIndex: 'dayOrder7Count',
      key: 'dayOrder7Count-dayOrder7Ratio',
      align: 'center',
      width: 96,
      render: (orderCount, record) => (
        <Space direction="vertical">
          { customCols.dayOrder7Count && orderCount }
          {
            customCols.dayOrder7Ratio
            &&
            record.dayOrder7Ratio
            &&
            (
              record.dayOrder7Ratio < 0
                ? <span className={styles.down}>{record.dayOrder7Ratio}%</span>
                : <span className={styles.up}>+{record.dayOrder7Ratio}%</span>
            )
          }
        </Space>
      ),
    }, {
      title: () => {
        const menu = (
          <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
            <MenuItem key="dayOrder30Count-ascend">
              30天订单升序
            </MenuItem>
            <MenuItem key="dayOrder30Count-descend">
              30天订单降序
            </MenuItem>
            <MenuItem key="dayOrder30Ratio-ascend">
              30天环比升序
            </MenuItem>
            <MenuItem key="dayOrder30Ratio-descend">
              30天环比降序
            </MenuItem>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} placement="bottomRight">
            <span style={{ cursor: 'pointer' }}>
              30天订单
              { GoodsIcon.question(`周期：${dateRange30[0]}-${dateRange30[1]}`) }
              {
                (sort === 'dayOrder30Count' || sort === 'dayOrder30Ratio') ? renderSortIcon(order) : null
              }
            </span>
          </Dropdown>
        );
      },
      dataIndex: 'dayOrder30Count',
      key: 'dayOrder30Count-dayOrder30Ratio',
      align: 'center',
      width: 100,
      render: (orderCount, record) => (
        <Space direction="vertical">
          { customCols.dayOrder30Count && orderCount }
          {
            customCols.dayOrder30Ratio
            &&
            record.dayOrder30Ratio
            &&
            (
              record.dayOrder30Ratio < 0
                ? <span className={styles.down}>{record.dayOrder30Ratio}%</span>
                : <span className={styles.up}>+{record.dayOrder30Ratio}%</span>
            )
          }
        </Space>
      ),
    }, {
      title: '排名',
      sorter: true,
      sortOrder: sort === 'ranking' ? order : null,
      dataIndex: 'ranking',
      key: 'ranking',
      align: 'center',
      width: 80,
      render: (ranking, record) => {
        if (!ranking.length) {
          return <span className={styles.ranking}>—</span>;
        }
        const top = record.ranking.filter(rank => rank.isTopCategory)[0];
        const minCategory = record.ranking.filter(rank => !rank.isTopCategory);
        const titleArr = minCategory.map(category => (
          <div key={category.categoryRanking}>
            #{category.categoryRanking} {category.categoryName}
          </div>
        ));
        const title = (<div>#{top.categoryRanking} {top.categoryName} {titleArr}</div>);
        return (
          top
            ?
            <Tooltip placement="top" title={title}>
              <span className={styles.ranking}>#{top.categoryRanking}</span>
            </Tooltip>
            :
            <span className={styles.ranking}>—</span>
        );
      },
    }, {
      title: () => {
        const menu = (
          <Menu className={styles.titleMenu} onClick={handleSortMenuClick}>
            <MenuItem key="reviewScore-ascend">
              评分升序
            </MenuItem>
            <MenuItem key="reviewScore-descend">
              评分降序
            </MenuItem>
            <MenuItem key="reviewCount-ascend">
              评论数升序
            </MenuItem>
            <MenuItem key="reviewCount-descend">
              评论数降序
            </MenuItem>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} placement="bottomRight">
            <span style={{ cursor: 'pointer' }}>
              Review
              {
                (sort === 'reviewScore' || sort === 'reviewCount') ? renderSortIcon(order) : null
              }
            </span>
          </Dropdown>
        );
      },
      dataIndex: 'reviewScore',
      key: 'reviewScore-reviewCount',
      align: 'center',
      width: 80,
      render: (reviewScore, record) => (
        <Space direction="vertical">
          { customCols.reviewScore && reviewScore }
          {
            customCols.reviewCount
            &&
            <Text type="secondary">
              (<span className={styles.reviewCount}>{record.reviewCount}</span>)
            </Text>
          }
        </Space>
      ),
    }, {
      title: '最低价',
      sorter: true,
      sortOrder: sort === 'minPrice' ? order : null,
      dataIndex: 'minPrice',
      key: 'minPrice',
      align: 'right',
      width: 90,
      render: (minPrice, record) => (
        editable({
          inputValue: minPrice,
          formatValueFun: strToMoneyStr,
          prefix: minPrice === null ? '' : currency,
          maxLength: 20,
          confirmCallback: value => {
            const minPrice = parseFloat(value);
            if (minPrice === 0) {
              message.error('最低价不能为0');
              return;
            }
            if (record.maxPrice && minPrice >= record.maxPrice) {
              message.error('最低价必须小于最高价');
              return;
            }
            updateGoodsUserDefined({
              id: record.id,
              sku: record.sku,
              minPrice: minPrice.toFixed(2),
            });
          },
        })
      ),
    }, {
      title: '最高价',
      sorter: true,
      sortOrder: sort === 'maxPrice' ? order : null,
      dataIndex: 'maxPrice',
      key: 'maxPrice',
      align: 'right',
      width: 90,
      render: (maxPrice, record) => (
        editable({
          inputValue: maxPrice,
          formatValueFun: strToMoneyStr,
          prefix: maxPrice === null ? '' : currency,
          maxLength: 20,
          confirmCallback: value => {
            const maxPrice = parseFloat(value);
            if (maxPrice === 0) {
              message.error('最高价不能为0');
              return;
            }
            if (maxPrice <= record.minPrice) {
              message.error('最高价必须大于最低价');
              return;
            }
            updateGoodsUserDefined({
              id: record.id,
              sku: record.sku,
              maxPrice: maxPrice.toFixed(2),
            });
          },
        })
      ),
    }, {
      title: () => (
        <span>
          竞品
          { GoodsIcon.question('必须设定竞品，才能使用根据竞品价格调价功能') }
        </span>
      ),
      dataIndex: 'competingCount',
      key: 'competingCount',
      align: 'center',
      width: 60,
      render: competingCount => (
        <Link to="/review/monitor">{competingCount}</Link>
      ),
    }, {
      title: '调价规则',
      dataIndex: 'ruleName',
      key: 'ruleName',
      align: 'center',
      width: 136,
      render: () => (
        <Select defaultValue="未开发的功能0" style={{ width: 136 }} bordered={false}>
          <Option value="未开发的功能0">未开发的功能0</Option>
          <Option value="未开发的功能1">未开发的功能1</Option>
          <Option value="未开发的功能2">未开发的功能2</Option>
        </Select>
      ),
    }, {
      title: '调价开关',
      dataIndex: 'adjustSwitch',
      key: 'adjustSwitch',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (adjustSwitch, record) => (
        <Switch
          className={styles.Switch}
          loading={loadingAdjustSwitch}
          checked={adjustSwitch}
          onClick={() => handleAdjustSwitchClick(adjustSwitch, record)}
        />
      ),
    }, {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (_, record) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleMonitorClick = (param: any) => {
          console.log('handleMonitorClick', param, record);
        };
        const priceMenu = (
          <Menu className={styles.titleMenu} onClick={(event) => handleFastPrice(record, event)}>
            <MenuItem key="maxPrice">最高价=售价</MenuItem>
            <MenuItem key="minPrice">最低价=佣金+FBA Fee</MenuItem>
            <MenuItem key="price">售价=佣金+FBA Fee</MenuItem>
          </Menu>
        );
        const monitorMenu = (
          <Menu className={styles.titleMenu} onClick={handleMonitorClick}>
            <MenuItem key="sell">跟卖监控</MenuItem>
            <MenuItem key="asin">ASIN动态监控</MenuItem>
            <MenuItem key="review">Review监控</MenuItem>
            <MenuItem key="keyword">关键词监控</MenuItem>
          </Menu>
        );
        return (
          <Space direction="vertical" className={styles.options}>
            <Space>
              <Dropdown overlay={priceMenu} placement="bottomCenter">
                <span className={styles.optionsItem}>
                  改价
                </span>
              </Dropdown>
              <Link to="/">
                动态
              </Link>
            </Space>
            <Space>
              <Link to="/">
                订单
              </Link>
              <Dropdown overlay={monitorMenu} placement="bottomCenter">
                <span className={styles.optionsItem}>
                  监控
                </span>
              </Dropdown>
            </Space>
          </Space>
        );
      },
    },
  ];

  // 按自定义列数据
  const cols: ColumnProps<API.IGoods>[] = [];
  columns.forEach(col => {
    !col.key && cols.push(col);
    const colKey = (col.key || '').toString();
    const keys = colKey.split('-');
    let isHidden = true;
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      if (customCols[key]) {
        isHidden = false;
      }
    }
    !isHidden && cols.push(col);
  });

  return cols;
};
