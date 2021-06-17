/**
 * 自动广告组的 target 设置
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, Link } from 'umi';
import { Button, Table, Switch, message, Dropdown, Checkbox, Row, Col } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import DateRangePicker from '../components/DateRangePicker';
import SuggestedPrice from '../components/SuggestedPrice';
import {
  getPageQuery,
  getShowPrice,
  Iconfont,
  numberToPercent,
  requestErrorFeedback,
  storage,
} from '@/utils/utils';
import { getRangeDate as getTimezoneDateRange } from '@/utils/huang';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import styles from './index.less';
import { getAssignUrl, isArchived } from '../utils';

const TargetingGroupsDict = {
  queryHighRelMatches: 'Close-match',
  queryBroadRelMatches: 'Loose-match',
  asinSubstituteRelated: 'Substitutes',
  asinAccessoryRelated: 'Complements',
};

const cols = {
  sales: false,
  orderNum: false,
  cpc: false,
  cpa: false,
  spend: false,
  acos: false,
  roas: false,
  impressions: false,
  clicks: false,
  ctr: false,
  conversionsRate: false,
};

const colsNameDict = {
  sales: '销售额',
  orderNum: '订单量',
  cpc: 'CPC',
  cpa: 'CPA',
  spend: 'Spend',
  acos: 'ACoS',
  roas: 'RoAS',
  impressions: 'Impressions',
  clicks: 'Clicks',
  ctr: 'CTR',
  conversionsRate: '转化率',
};

const customColsLocalStorageKey = 'adAutoGroupTargetCustomCols';

const AutoGroupTarget: React.FC = function() {
  const dispatch = useDispatch();
  const [list, setList] = useState<API.IAdAutoGroupTarget[]>([]);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });
  // 自定义列
  const [customCols, setCustomCols] = useState({
    visible: false,
    cols: storage.get(customColsLocalStorageKey) || cols,
  });
  // 店铺
  const {
    id: currentShopId, marketplace, currency,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  const loadingEffect = useSelector((state: IConnectState) => state.loading);
  const loading = loadingEffect.effects['adManage/fetchAutoGroupTargetList'];
  const {
    groupId, groupName, campaignId, campaignName, campaignType, campaignState,
  } = getPageQuery();

  useEffect(() => {
    if (currentShopId !== '-1') {
      const { start, end } = storage.get('adManageDateRange') || getTimezoneDateRange(7, false);
      dispatch({
        type: 'adManage/fetchAutoGroupTargetList',
        payload: {
          headersParams: { StoreId: currentShopId },
          groupId,
          startTime: start,
          endTime: end,
        },
        callback: (code: number, msg: string, data: API.IAdAutoGroupTarget[]) => {
          requestErrorFeedback(code, msg);
          setList(data);
        },
      });
    }
  }, [currentShopId, dispatch, groupId]);

  // 应用建议竞价
  function handleSelectedApplySuggestedBid(record: API.IAdAutoGroupTarget) {
    if (record.state === 'archived') {
      message.error('已归档，不允许修改');
      return;
    }
    dispatch({
      type: 'adManage/updateAutoGroupTarget',
      payload: {
        headersParams: { StoreId: currentShopId },
        targetId: record.id,
        bid: record.recommendBid,
      },
      callback: (code: number, msg: string) => {
        requestErrorFeedback(code, msg);
        // 修改列表
        const newList = list.map(item => {
          if (item.id === record.id) {
            item.bid = record.recommendBid;
          }
          return item;
        });
        setList(newList);
      },
    });
  }

  // 状态开关
  function handleSwitch(state: boolean, record: API.IAdAutoGroupTarget) {
    dispatch({
      type: 'adManage/updateAutoGroupTarget',
      payload: {
        headersParams: { StoreId: currentShopId },
        targetId: record.id,
        state: state ? 'enabled' : 'paused',
      },
      callback: (code: number, msg: string) => {
        requestErrorFeedback(code, msg);
        // 修改列表
        const newList = list.map(item => {
          if (item.id === record.id) {
            item.state = state ? 'enabled' : 'paused';
          }
          return item;
        });
        setList(newList);
      },
    });
  }

  // 自定义列勾选
  function handleColsChange({ target: { value, checked } }: CheckboxChangeEvent) {
    const newCols = { ...customCols.cols };
    newCols[value] = checked;
    setCustomCols({ ...customCols, cols: newCols });
  }

  // 自定义列下拉框显示/隐藏 (隐藏时保存数据到 localStorage)
  function handleVisibleChange(visible: boolean) {
    setCustomCols({ ...customCols, visible });
    if (!visible) {
      storage.set(customColsLocalStorageKey, customCols.cols);
    }
  }

  // 筛选日期范围
  const handleDateRangeChange = useCallback((rangePickerDates: string[]) => {
    const [startTime, endTime] = rangePickerDates;
    setDateRange({ start: startTime, end: endTime });
    dispatch({
      type: 'adManage/fetchAutoGroupTargetList',
      payload: {
        headersParams: { StoreId: currentShopId },
        groupId,
        startTime,
        endTime,
      },
      callback: (code: number, msg: string, data: API.IAdAutoGroupTarget[]) => {
        requestErrorFeedback(code, msg);
        setList(data);
      },
    });
  }, [currentShopId, dispatch, groupId]);

  // 全部列
  const columns: ColumnProps<API.IAdAutoGroupTarget>[] = [
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      width: 60,
      render: (value, record) => (
        value !== 'archived'
          ?
          <Switch
            className={styles.Switch}
            checked={value === 'enabled'}
            onClick={checked => handleSwitch(checked, record)}
          />
          : '已归档'
      ),
    }, {
      title: 'Targeting Groups',
      dataIndex: 'target',
      align: 'center',
      width: 120,
      render: (value) => TargetingGroupsDict[value],
    }, {
      title: '建议竞价',
      dataIndex: 'recommendBid',
      align: 'center',
      width: 110,
      render: (value, record) => (
        <SuggestedPrice
          disabled={isArchived(record.state)}
          suggestedPrice={value}
          suggestedMin={record.recommendBidStart}
          suggestedMax={record.recommendBidEnd}
          marketplace={marketplace}
          currency={currency}
          onApply={() => handleSelectedApplySuggestedBid(record)}
        />
      ),
    }, {
      title: '竞价',
      dataIndex: 'bid',
      align: 'center',
      width: 80,
      render: value => getShowPrice(value, marketplace, currency),
    }, {
      title: '销售额',
      dataIndex: 'sales',
      align: 'right',
      width: 100,
      render: value => getShowPrice(value, marketplace, currency),
    }, {
      title: '订单量',
      dataIndex: 'orderNum',
      align: 'center',
      width: 70,
    }, {
      title: 'CPC',
      dataIndex: 'cpc',
      align: 'right',
      width: 60,
      render: value => getShowPrice(value, marketplace, currency),
    }, {
      title: 'CPA',
      dataIndex: 'cpa',
      align: 'right',
      width: 60,
      render: value => getShowPrice(value, marketplace, currency),
    }, {
      title: 'Spend',
      dataIndex: 'spend',
      align: 'center',
      width: 80,
      render: value => getShowPrice(value, marketplace, currency),
    }, {
      title: 'ACoS',
      dataIndex: 'acos',
      align: 'center',
      width: 50,
      render: value => numberToPercent(value),
    }, {
      title: 'RoAS',
      dataIndex: 'roas',
      align: 'center',
      width: 60,
      render: value => value ? value.toFixed(2) : '—',
    }, {
      title: 'Impressions',
      dataIndex: 'impressions',
      align: 'center',
      width: 90,
    }, {
      title: 'Clicks',
      dataIndex: 'clicks',
      align: 'center',
      width: 70,
    }, {
      title: 'CTR',
      dataIndex: 'ctr',
      align: 'center',
      width: 60,
      render: value => numberToPercent(value),
    }, {
      title: '转化率',
      dataIndex: 'conversionsRate',
      align: 'center',
      width: 60,
      render: value => numberToPercent(value),
    },
  ];

  // 获取需要显示的列（按自定义列显示）
  function getShowCols() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const showCols: any = [];
    columns.forEach(col => {
      if (cols[col.dataIndex as string] === undefined || customCols.cols[col.dataIndex as string]) {
        showCols.push(col);
      }
    });
    return showCols;
  }

  // 获取自定义列选中的项目
  function getCustomColsValue() {
    const customColsValue: string[] = [];
    Object.keys(customCols.cols).forEach((key: string) => {
      customCols.cols[key] ? customColsValue.push(key) : null;
    });
    return customColsValue;
  }

  return (
    <div className={styles.page}>
      <div className={styles.crumbs}>
        <Link to="/ppc/manage?tab=group">广告组</Link>
        <Iconfont type="icon-zhankai" className={styles.separator} />
        <Link to={
          getAssignUrl({
            campaignType: campaignType as API.CamType,
            campaignState: campaignState as API.AdState,
            campaignId: campaignId as string,
            campaignName: campaignName as string,
          })
        }>
          {groupName}
        </Link>
        <Iconfont type="icon-zhankai" className={styles.separator} />
        <span>目标设置</span>
      </div>
      <div className={styles.tableToolBar}>
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          callback={handleDateRangeChange}
        />
        <Dropdown
          overlay={
            <div className={styles.customColumnContainer}>
              <Checkbox.Group defaultValue={getCustomColsValue()}>
                {
                  Object.keys(cols).map(key => (
                    <Row key={key} gutter={[0, 6]}>
                      <Col>
                        <Checkbox key={key} onChange={handleColsChange} value={key}>
                          {colsNameDict[key]}
                        </Checkbox>
                      </Col>
                    </Row>
                  ))
                }
              </Checkbox.Group>
            </div>
          }
          trigger={['click']}
          visible={customCols.visible}
          onVisibleChange={handleVisibleChange}
        >
          <Button>
            自定义列 { customCols.visible ? <UpOutlined className="anticon-down" /> : <DownOutlined /> }
          </Button>
        </Dropdown>
      </div>
      <Table
        rowKey="id"
        className={styles.Table}
        loading={loading}
        dataSource={list} 
        columns={getShowCols()}
        scroll={{ x: 'max-content' }}
        pagination={false}
      />
    </div>
  );
};

export default AutoGroupTarget;
