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
import GoodsIcon from '@/pages/components/GoodsIcon';
import { day, strToMoneyStr } from '@/utils/utils';
import editable from '@/pages/components/EditableCell';
import GoodsImg from '@/pages/components/GoodsImg';
import DropdownSortTh from '@/pages/components/DropdownSortTh';
import { IRule } from '@/models/goodsList';
import classnames from 'classnames';
import { MenuClickEventHandler } from 'rc-menu/lib/interface.d';
import styles from './index.less';

const { Option } = Select;
const { Item: MenuItem } = Menu;
const { Paragraph, Text } = Typography;
const { Search } = Input;

export const listingStatusDict = {
  Active: <span>在售</span>,
  Inactive: <span className={styles.disabled}>不可售</span>,
  Incomplete: <span>禁止显示</span>,
  Remove: <span className={styles.disabled}>已移除</span>,
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
    handleAddMonitor,
    groups,
    rules,
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

  // 调价规则下拉选择
  const rulesOptions = (
    <>
      {
        rules.map((rule: IRule) => (
          <Option key={rule.id} value={rule.id}>{rule.name}</Option>
        ))
      }
    </>
  );
  
  // 全部列
  const columns: ColumnProps<API.IGoods>[] = [
    {
      title: () => <span className={styles.selectThTitle}>分组</span>,
      dataIndex: 'groupId',
      key: 'group',
      align: 'left',
      width: 130,
      fixed: 'left',
      render: (_, record) => (
        <Select
          size="small"
          className={styles.tableSelect}
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
      width: 316,
      fixed: 'left',
      render: (title, record) => (
        <div className={styles.goodsInfoContainer}>
          <GoodsImg src={record.imgUrl} alt="商品" width={46} />
          <div className={styles.goodsInfoContent}>
            {
              customCols.title
              &&
              <Paragraph ellipsis className={styles.goodsTitle}>
                { GoodsIcon.link() }
                <a title={title} href={record.url} target="_blank" rel="noopener noreferrer">{title}</a>
              </Paragraph>
            }
            {
              customCols.asin
              &&
              <div className={styles.asin}>
                <Link to={`/asin/base?asin=${record.asin}`} title="跳转到ASIN总览">{record.asin}</Link>
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
                  { record.isPrime && GoodsIcon.prime() }
                  { record.isPromotion && GoodsIcon.promotion() }
                  { record.isCoupon && GoodsIcon.coupon(record.coupon) }
                </>
              }
              <div className={styles.sellNum}>
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
                    { record.isBuyBox && GoodsIcon.buyBoxcart() }
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      ),
    }, {
      title: () => (
        <span title="点击可按上架时间排序">
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
            <div className={styles.sku}>{record.sku}</div>
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
              { listingStatusDict[listingStatus] }
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
        return (
          <DropdownSortTh
            sort={sort}
            order={order}
            handleSortMenuClick={handleSortMenuClick}
            content={
              <span
                className={classnames(styles.sortMenuBtn, 'sort-menu-btn')}
                title="可售库存，等同于后台available库存"
              >
                可售库存
                { GoodsIcon.question('可售库存，等同于后台available库存') }
              </span>
            }
            sortItems={[
              { name: '库存', key: 'sellable' },
              { name: '可售天数', key: 'sellableDays' },
            ]}
          />
        );
      },
      dataIndex: 'sellable',
      key: 'sellable-sellableDays',
      align: 'center',
      width: 118,
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
                    { GoodsIcon.redFlag() }
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
        <span title="售价+配送费">
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
              inputValue: price && price.toFixed(2),
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
          inputValue: price && price.toFixed(2),
          formatValueFun: strToMoneyStr,
          prefix: price === null ? '' : currency,
          maxLength: 20,
          confirmCallback: value => {
            updateGoodsUserDefined(record, {
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
          inputValue: freight && freight.toFixed(2),
          formatValueFun: strToMoneyStr,
          prefix: freight === null ? '' : currency,
          maxLength: 20,
          confirmCallback: value => {
            updateGoodsUserDefined(record, {
              id: record.id,
              sku: record.sku,
              freight: parseFloat(value).toFixed(2),
            });
          },
        })
      ),
    }, {
      title: () => (
        <span title="佣金+FBA fee">
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
                <div>{currency}{commission && commission.toFixed(2)}</div>
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
                  +{currency}{record.fbaFee.toFixed(2)}
                </Text>
                :
                '—'
            )
          }
        </Space>
      ),
    }, {
      title: () => {
        return (
          <DropdownSortTh
            sort={sort}
            order={order}
            handleSortMenuClick={handleSortMenuClick}
            content={
              <span
                className={classnames(styles.sortMenuBtn, 'sort-menu-btn')}
                title="利润=售价-成本-头程-FBA fee-佣金-推广-仓储-其他费用；利润率=利润/售价*100%"
              >
                利润
                { GoodsIcon.question('利润=售价-成本-头程-FBA fee-佣金-推广-仓储-其他费用；利润率=利润/售价*100%') }
              </span>
            }
            sortItems={[
              { name: '利润', key: 'profit' },
              { name: '利润率', key: 'profitMargin' },
            ]}
          />
        );
      },
      dataIndex: 'profit',
      key: 'profit-profitMargin',
      align: 'right',
      width: 94,
      render: (profit, record) => (
        profit
          ?
          <Space direction="vertical">
            {
              customCols.profit
              &&
              <div>{currency}{profit.toFixed(2)}</div>
            }
            {
              customCols.profitMargin
              &&
              <Text type="secondary">
                ({ record.profitMargin && record.profitMargin.toFixed(2) }%)
              </Text>
            }
          </Space>
          :
          null
      ),
    }, {
      title: () => {
        return (
          <DropdownSortTh
            sort={sort}
            order={order}
            handleSortMenuClick={handleSortMenuClick}
            content={
              <span
                className={classnames(styles.sortMenuBtn, 'sort-menu-btn')}
                title={`周期：${dateRange7[0]}-${dateRange7[1]}`}
              >
                7天订单
                { GoodsIcon.question(`周期：${dateRange7[0]}-${dateRange7[1]}`) }
              </span>
            }
            sortItems={[
              { name: '7天订单', key: 'dayOrder7Count' },
              { name: '7天环比', key: 'dayOrder7Ratio' },
            ]}
          />
        );
      },
      dataIndex: 'dayOrder7Count',
      key: 'dayOrder7Count-dayOrder7Ratio',
      align: 'center',
      width: 110,
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
        return (
          <DropdownSortTh
            sort={sort}
            order={order}
            handleSortMenuClick={handleSortMenuClick}
            content={
              <span
                className={classnames(styles.sortMenuBtn, 'sort-menu-btn')}
                title={`周期：${dateRange30[0]}-${dateRange30[1]}`}
              >
                30天订单
                { GoodsIcon.question(`周期：${dateRange30[0]}-${dateRange30[1]}`) }
              </span>
            }
            sortItems={[
              { name: '30天订单', key: 'dayOrder30Count' },
              { name: '30天环比', key: 'dayOrder30Ratio' },
            ]}
          />
        );
      },
      dataIndex: 'dayOrder30Count',
      key: 'dayOrder30Count-dayOrder30Ratio',
      align: 'center',
      width: 120,
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
        return (
          <DropdownSortTh
            sort={sort}
            order={order}
            handleSortMenuClick={handleSortMenuClick}
            content="Review"
            sortItems={[
              { name: '评分', key: 'reviewScore' },
              { name: '评轮数', key: 'reviewCount' },
            ]}
          />
        );
      },
      dataIndex: 'reviewScore',
      key: 'reviewScore-reviewCount',
      align: 'center',
      width: 80,
      render: (reviewScore, record) => (
        <Space direction="vertical">
          { customCols.reviewScore && reviewScore && reviewScore.toFixed(1) }
          {
            customCols.reviewCount
            &&
            <Text type="secondary">
              (<Link to={`/review/monitor?asin=${record.asin}`}>{record.reviewCount}</Link>)
            </Text>
          }
        </Space>
      ),
    }, {
      title: () => (
        <span title="必须设定最低价和最高价，才能开启智能调价">
          最低价 { GoodsIcon.question('必须设定最低价和最高价，才能开启智能调价')}
        </span>
      ),
      sorter: true,
      sortOrder: sort === 'minPrice' ? order : null,
      dataIndex: 'minPrice',
      key: 'minPrice',
      align: 'right',
      width: 90,
      render: (minPrice, record) => (
        editable({
          inputValue: minPrice && minPrice.toFixed(2),
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
            updateGoodsUserDefined(record, {
              id: record.id,
              sku: record.sku,
              minPrice: minPrice.toFixed(2),
            });
          },
        })
      ),
    }, {
      title: () => (
        <span title="必须设定最低价和最高价，才能开启智能调价">
          最高价 { GoodsIcon.question('必须设定最低价和最高价，才能开启智能调价')}
        </span>
      ),
      sorter: true,
      sortOrder: sort === 'maxPrice' ? order : null,
      dataIndex: 'maxPrice',
      key: 'maxPrice',
      align: 'right',
      width: 90,
      render: (maxPrice, record) => (
        editable({
          inputValue: maxPrice && maxPrice.toFixed(2),
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
            updateGoodsUserDefined(record, {
              id: record.id,
              sku: record.sku,
              maxPrice: maxPrice.toFixed(2),
            });
          },
        })
      ),
    }, {
      title: () => (
        <span title="必须设定竞品，才能使用根据竞品价格调价功能">
          竞品 { GoodsIcon.question('必须设定竞品，才能使用根据竞品价格调价功能') }
        </span>
      ),
      dataIndex: 'competingCount',
      key: 'competingCount',
      align: 'center',
      width: 60,
      render: (competingCount, record) => (
        <Link to={`/product/cp?id=${record.id}`}>{competingCount || 0}</Link>
      ),
    }, {
      title: () => <span className={styles.selectThTitle}>调价规则</span>,
      dataIndex: 'ruleName',
      key: 'ruleName',
      align: 'left',
      width: 136,
      render: (_, record) => (
        <Select
          size="small"
          className={styles.tableSelect}
          dropdownClassName={styles.SelectDropdown}
          bordered={false}
          defaultValue={record.ruleId}
          value={record.ruleId}
          listHeight={330}
          onChange={newRuleId => {
            updateGoodsUserDefined(record, {
              ruleId: newRuleId,
            });
          }}
        >
          { rulesOptions }
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
        const handleMonitorClick: MenuClickEventHandler = param => {
          if (param.key) {
            handleAddMonitor(param.key, record.asin);
          }
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
            <MenuItem key="follow">添加跟卖监控</MenuItem>
            <MenuItem key="asin">添加ASIN动态监控</MenuItem>
            <MenuItem key="review">添加评论监控</MenuItem>
            <MenuItem key="">
              <Link to="/dynamic/rank-monitor" target="_blank">添加搜索排名监控</Link>
            </MenuItem>
          </Menu>
        );
        return (
          <Space direction="vertical" className={styles.options}>
            <Space>
              <Dropdown overlay={priceMenu} placement="bottomCenter">
                <span className={styles.optionsItem}>改价</span>
              </Dropdown>
              <Link to={`/dynamic/asin-overview?asin=${record.asin}`}>动态</Link>
            </Space>
            <Space>
              <Link to={`/order?asin=${record.asin}`}>订单</Link>
              <Dropdown overlay={monitorMenu} placement="bottomCenter">
                <span className={styles.optionsItem}>监控</span>
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
