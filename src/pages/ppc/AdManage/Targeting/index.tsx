/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  Targeting（分类/商品投放）
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, Link } from 'umi';
import { Select, Button, Modal, message, Spin } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import { defaultFiltrateParams } from '@/models/adManage';
import AdManageTable from '../components/Table';
import MySearch from '../components/Search';
import Filtrate from '../components/Filtrate';
import CustomCols from '../components/CustomCols';
import Crumbs from '../components/Crumbs';
import BatchSetBid, { IComputedBidParams } from '../components/BatchSetBid';
import StateSelect, { stateOptions } from '../components/StateSelect';
import DataChartModal from '../components/DataChartModal';
import editable from '@/pages/components/EditableCell';
import DefinedCalendar from '@/components/DefinedCalendar';
import { matchTypeDict } from '@/pages/ppc/AdManage';
import {
  Iconfont,
  requestErrorFeedback,
  requestFeedback,
  getShowPrice,
  strToMoneyStr,
  storage,
  getDateCycleParam,
} from '@/utils/utils';
import { isArchived, getAssignUrl, getDefinedCalendarFiltrateParams } from '../utils';
import { add, minus, times, divide } from '@/utils/precisionNumber';
import { UpOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import commonStyles from '../common.less';
import styles from './index.less';

const { Option } = Select;

const Targeting: React.FC = function() {
  const dispatch = useDispatch();
  // 店铺 id
  const {
    id: currentShopId, marketplace, currency,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  // loading
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loadingTable = loadingEffect['adManage/fetchTargetingList'];
  const loadingSuggestedBid = loadingEffect['adManage/fetchTargetingSuggestedBid'];
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    targetingTab: { list, searchParams, filtrateParams, customCols, checkedIds },
  } = adManage;
  const { total, records, dataTotal } = list;
  const { current, size, sort, order } = searchParams;
  const { state, targetingType } = filtrateParams;
  const [visibleFiltrate, setVisibleFiltrate] = useState<boolean>(false);
  // 日期
  const calendarStorageBaseKey = 'adTargetingCalendar';
  const [calendarDefaultKey, setCalendarDefaultKey] = useState<string>(
    storage.get(`${calendarStorageBaseKey}_dc_itemKey`) || '7'
  );
  // 数据分析
  const [chartsState, setChartsState] = useState({
    visible: false,
    campaignId: '',
    campaignName: '',
    groupId: '',
    groupName: '',
    targetId: '',
    targetName: '',
  });

  useEffect(() => {
    if (currentShopId !== '-1') {
      // 列表
      const cycle = getDateCycleParam(calendarDefaultKey);
      let params;
      if (cycle) {
        params = { ...defaultFiltrateParams, cycle };
      } else {
        const { startTime, endTime } = storage.get(`${calendarStorageBaseKey}_dc_dateRange`);
        const timeMethod = storage.get(`${calendarStorageBaseKey}_dc_itemKey`);
        params = { ...defaultFiltrateParams, startTime, endTime, timeMethod };
      }
      dispatch({
        type: 'adManage/fetchTargetingList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { current: 1 },
          filtrateParams: params,
        },
        callback: requestErrorFeedback,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId]);

  // 修改数据
  function modifyTargeting(params: {[key: string]: string | number}) {
    dispatch({
      type: 'adManage/modifyTargeting',
      payload: {
        headersParams: { StoreId: currentShopId },
        record: params,
      },
      callback: requestFeedback,
    });
  }

  // 单个修改状态
  function handleStateChange(state: string, id: string) {
    if (isArchived(state)) {
      Modal.confirm({
        content: (
          <>
            <ExclamationCircleOutlined className={commonStyles.warnIcon} />归档后不可重新开启，确认归档吗？
          </>
        ),
        icon: null,
        className: commonStyles.modalConfirm,
        maskClosable: true,
        centered: true,
        onOk() {
          modifyTargeting({ state, id });
        },
      });
      return;
    }
    modifyTargeting({ state, id });
  }

  // 展开/收起筛选器
  function handleClickFiltrate() {
    setVisibleFiltrate(!visibleFiltrate);
  }

  // 执行筛选
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleFiltrate(values: { [key: string]: any }) {
    setVisibleFiltrate(false);
    dispatch({
      type: 'adManage/fetchTargetingList',
      payload: {
        headersParams: { StoreId: currentShopId },
        filtrateParams: { ...values },
        searchParams: { current: 1 },
      },
      callback: requestErrorFeedback,
    });
  }

  // 批量操作状态
  function handleBatchState(state: string) {
    if (isArchived(state)) {
      Modal.confirm({
        content: (
          <>
            <ExclamationCircleOutlined className={commonStyles.warnIcon} />归档后不可重新开启，确认归档吗？
          </>
        ),
        icon: null,
        className: commonStyles.modalConfirm,
        maskClosable: true,
        centered: true,
        onOk() {
          dispatch({
            type: 'adManage/batchTargeting',
            payload: {
              headersParams: { StoreId: currentShopId },
              adIds: checkedIds,
              state,
            },
            callback: requestFeedback,
          });
        },
      });
      return;
    }
    dispatch({
      type: 'adManage/batchTargeting',
      payload: {
        headersParams: { StoreId: currentShopId },
        adIds: checkedIds,
        state,
      },
      callback: requestFeedback,
    });
  }

  // 日期 change
  function handleRangeChange(dates: DefinedCalendar.IChangeParams) {
    const { selectItemKey } = dates;
    setCalendarDefaultKey(selectItemKey);
    dispatch({
      type: 'adManage/fetchTargetingList',
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: { current: 1 },
        filtrateParams: getDefinedCalendarFiltrateParams(dates),
      },
      callback: requestErrorFeedback,
    });
  }

  // 执行搜索
  function handleSearch(value: string) {
    setVisibleFiltrate(false);
    dispatch({
      type: 'adManage/fetchTargetingList',
      payload: {
        headersParams: { StoreId: currentShopId },
        filtrateParams: {
          // 重置筛选参数
          ...defaultFiltrateParams,
          search: value,
        },
      },
      callback: requestErrorFeedback,
    });
  }

  // 获取清空后的筛选条件
  function getEmptyFiltrateParams() {
    const params = { ...filtrateParams };
    Object.keys(params).forEach(key => {
      const keySuffix = key.slice(-3);
      if (keySuffix === 'Min' || keySuffix === 'Max' || key === 'search') {
        params[key] = undefined;
      }
    });
    return params;
  }

  // 按公式计算竞价
  function getComputedBid(params: IComputedBidParams, record: API.IAdTargeting) {
    let result = 0;
    const { type, unit, operator, exprValue } = params;
    const opDict = {
      '+': add,
      '-': minus,
    };
    // 建议竞价/最高/最低建议竞价
    const baseValue = record[type];
    if (unit === 'percent') {
      result = opDict[operator](baseValue, times(baseValue, divide(exprValue, 100)));
    } else if (unit === 'currency') {
      result = opDict[operator](baseValue, exprValue);
    }
    return result;
  }

  // 获取批量竞价按公式修改的实际结果
  function getBidExprVlaue(params: IComputedBidParams) {
    const { type, unit, operator, exprValue, price } = params;
    const data = [];
    const minValue = marketplace === 'JP' ? 2 : 0.02;
    // 值类型
    if (type === 'value' && price) {
      if (price < minValue) {
        message.error(`竞价不能低于${minValue}`);
        return;
      }
      for (let index = 0; index < checkedIds.length; index++) {
        data.push({
          id: checkedIds[index],
          bid: getShowPrice(price),
        });
      }
    } else {
      // 计算类型
      for (let index = 0; index < checkedIds.length; index++) {
        const id = checkedIds[index];
        const record = records.find(item => item.id === id) as API.IAdTargeting;
        const bid = getComputedBid({
          type,
          operator,
          unit,
          exprValue,
        }, record);
        if (bid < minValue) {
          message.error(`竞价不能低于${minValue}`);
          return;
        }
        data.push({
          id,
          bid: getShowPrice(bid),
        });
      }
    }
    return data;
  }

  // 批量设置竞价
  function setBatchBid (values: IComputedBidParams) {
    // 计算后的
    const data = getBidExprVlaue(values);
    if (data) {
      dispatch({
        type: 'adManage/batchTargeting',
        payload: {
          headersParams: { StoreId: currentShopId },
          records: data,
        },
        callback: requestFeedback,
      });
      // 用于指定关闭弹窗
      return true;
    }
  }

  // 应用建议竞价(单个/批量)
  function applySuggestedBid(ids: string[]) {
    const data: { id: string; bid: number }[] = [];
    records.forEach(item => {
      if (item.suggested === 0) {
        return;
      }
      if (ids.includes(item.id)) {
        data.push({
          id: item.id,
          bid: item.suggested,
        });
      }
    });
    dispatch({
      type: 'adManage/batchTargeting',
      payload: {
        headersParams: { StoreId: currentShopId },
        records: data,
      },
      callback: requestFeedback,
    });
  }

  // targeting 类型下拉框
  const targetingTypeOptions = (
    <>
      <Option key="classify" value="classify">分类</Option>
      <Option key="product" value="product">商品</Option>
    </>
  );

  // 全部表格列
  const columns: ColumnProps<API.IAdTargeting>[] = [
    {
      title: <span className="_selectColTh">状态</span>,
      children: [
        {
          dataIndex: 'state',
          width: 50,
          fixed: 'left',
          render: (state: string, record: API.IAdTargeting) => (
            <>{
              <Select
                size="small"
                disabled={isArchived(state)}
                className={styles.tableSelect}
                bordered={false}
                defaultValue={state}
                value={state}
                listHeight={330}
                onChange={state => {
                  handleStateChange(state, record.id);
                }}
              >
                { stateOptions }
              </Select>
            }</>
          ),
        },
      ] as any,
    }, {
      title: '广告活动',
      children: [
        {
          dataIndex: 'camId',
          width: 160,
          fixed: 'left',
          render: (_: string, record: API.IAdTargeting) => (
            <span className={commonStyles.breakAll}>
              <a
                href={
                  getAssignUrl({
                    campaignType: record.camType,
                    campaignState: record.camState,
                    campaignId: record.camId,
                    campaignName: record.camName,
                  })
                }
              >{record.camName}</a>
            </span>
          ),
        },
      ] as any,
    }, {
      title: '广告组',
      children: [
        {
          dataIndex: 'groupId',
          width: 200,
          fixed: 'left',
          render: (_: string, record: API.IAdTargeting) => (
            <span className={commonStyles.breakAll}>
              <a
                href={
                  getAssignUrl({
                    campaignType: record.camType,
                    campaignState: record.camState,
                    campaignId: record.camId,
                    campaignName: record.camName,
                    groupId: record.groupId,
                    groupName: record.groupName,
                    groupType: record.groupType,
                  })
                }
              >{record.groupName}</a>
            </span>
          ),
        },
      ] as any,
    }, {
      title: '关键词',
      children: [
        {
          title: '合计',
          dataIndex: 'targeting',
          width: 200,
          align: 'left',
          fixed: 'left',
          render: (value: string, record: API.IAdTargeting) => (
            <>
              {value}
              <div>{record.expression}</div>
            </>
          ),
        },
      ] as any,
    }, {
      title: '匹配方式',
      align: 'center',
      key: 'matchType',
      children: [
        {
          dataIndex: 'matchType',
          width: 100,
          align: 'center',
          render: (value: string) => matchTypeDict[value],
        },
      ] as any,
    }, {
      title: '建议竞价',
      align: 'center',
      key: 'suggested',
      children: [
        {
          dataIndex: 'suggested',
          width: 100,
          align: 'center',
          render: (value: string, record: API.IAdTargeting) => (
            <Spin spinning={loadingSuggestedBid} size="small">
              <div className={commonStyles.suggested}>
                {getShowPrice(value, marketplace, currency)}
                <Button
                  disabled={isArchived(record.state)}
                  onClick={() => applySuggestedBid([record.id])}
                >应用</Button>
              </div>
              <div>
                ({getShowPrice(record.suggestedMin, marketplace, currency)}
                -
                {getShowPrice(record.suggestedMax, marketplace, currency)})
              </div>
            </Spin>
          ),
        },
      ] as any,
    }, {
      title: '竞价',
      align: 'center',
      key: 'bid',
      children: [
        {
          dataIndex: 'bid',
          width: 100,
          align: 'center',
          render: (value: number, record: API.IAdCampaign) => (
            <>{
              isArchived(record.state)
                ? getShowPrice(value)
                :
                editable({
                  inputValue: getShowPrice(value),
                  formatValueFun: strToMoneyStr,
                  maxLength: 10,
                  prefix: currency,
                  ghostEditBtn: true,
                  confirmCallback: value => {
                    modifyTargeting({ bid: value, id: record.id });
                  },
                })
            }</>
          ),
        },
      ] as any,
    }, {
      title: <>添加时间<Iconfont className={commonStyles.iconQuestion} type="icon-yiwen" title="北京时间" /></>,
      align: 'center',
      key: 'addTime',
      children: [
        {
          dataIndex: 'addTime',
          width: 100,
          align: 'center',
        },
      ] as any,
    }, {
      title: '销售额',
      dataIndex: 'sales',
      key: 'sales',
      align: 'right',
      sorter: true,
      sortOrder: sort === 'sales' ? order : null,
      children: [
        {
          title: getShowPrice(dataTotal.sales, marketplace, currency),
          dataIndex: 'sales',
          width: 100,
          align: 'right',
          render: (value: number) => getShowPrice(value, marketplace, currency),
        },
      ] as any,
    }, {
      title: '订单量',
      dataIndex: 'orderNum',
      key: 'orderNum',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'orderNum' ? order : null,
      children: [
        {
          title: dataTotal.orderNum,
          dataIndex: 'orderNum',
          width: 80,
          align: 'center',
        },
      ] as any,
    }, {
      title: 'CPC',
      dataIndex: 'cpc',
      key: 'cpc',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'cpc' ? order : null,
      children: [
        {
          title: dataTotal.cpc,
          dataIndex: 'cpc',
          width: 80,
          align: 'center',
        },
      ] as any,
    }, {
      title: 'CPA',
      dataIndex: 'cpa',
      key: 'cpa',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'cpa' ? order : null,
      children: [
        {
          title: dataTotal.cpa,
          dataIndex: 'cpa',
          width: 80,
          align: 'center',
        },
      ] as any,
    }, {
      title: 'Spend',
      dataIndex: 'spend',
      key: 'spend',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'spend' ? order : null,
      children: [
        {
          title: dataTotal.spend,
          dataIndex: 'spend',
          width: 80,
          align: 'center',
        },
      ] as any,
    }, {
      title: 'ACoS',
      dataIndex: 'acos',
      key: 'acos',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'acos' ? order : null,
      children: [
        {
          title: dataTotal.acos,
          dataIndex: 'acos',
          width: 80,
          align: 'center',
        },
      ] as any,
    }, {
      title: 'RoAS',
      dataIndex: 'roas',
      key: 'roas',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'roas' ? order : null,
      children: [
        {
          title: dataTotal.roas,
          dataIndex: 'roas',
          align: 'center',
          width: 80,
        },
      ] as any,
    }, {
      title: 'Impressions',
      dataIndex: 'impressions',
      key: 'impressions',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'impressions' ? order : null,
      children: [
        {
          title: dataTotal.impressions,
          dataIndex: 'impressions',
          align: 'center',
          width: 100,
        },
      ] as any,
    }, {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'clicks' ? order : null,
      children: [
        {
          title: dataTotal.clicks,
          dataIndex: 'clicks',
          width: 80,
          align: 'center',
        },
      ] as any,
      
    }, {
      title: 'CTR',
      dataIndex: 'ctr',
      key: 'ctr',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'ctr' ? order : null,
      children: [
        {
          title: dataTotal.ctr,
          dataIndex: 'ctr',
          width: 80,
          align: 'center',
        },
      ] as any,
    }, {
      title: '转化率',
      dataIndex: 'conversionsRate',
      key: 'conversionsRate',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'conversionsRate' ? order : null,
      children: [
        {
          title: dataTotal.conversionsRate,
          dataIndex: 'conversionsRate',
          width: 80,
          align: 'center',
        },
      ] as any,
    }, {
      title: '操作',
      align: 'center',
      children: [
        {
          width: 40,
          align: 'center',
          fixed: 'right',
          render: (_: string, record: API.IAdTargeting) => (
            <Button
              type="link"
              className={commonStyles.tableOperationBtn}
              onClick={() => setChartsState({
                visible: true,
                campaignId: record.camId,
                campaignName: record.camName,
                groupId: record.groupId,
                groupName: record.groupName,
                targetId: record.id,
                targetName: record.targeting,
              })}
            >
              分析
            </Button>
          ),
        },
      ] as any,
    },
  ];

  // 表格组件 props
  const tableProps = {
    dataSource: records,
    customCols,
    columns,
    loading: loadingTable,
    total,
    current,
    size,
    checkedIds,
    fetchListActionType: 'adManage/fetchTargetingList',
    checkedChangeActionType: 'adManage/updateTargetingChecked',
  };

  // 高级筛选 props
  const filtrateProps = {
    handleFiltrate,
    handleClickFiltrate,
    filtrateParams,
  };

  // 面包屑 props
  const crumbsProps = {
    currency,
    filtrateParams,
    handleEmpty: () => {
      dispatch({
        type: 'adManage/fetchTargetingList',
        payload: {
          headersParams: { StoreId: currentShopId },
          filtrateParams: getEmptyFiltrateParams(),
          searchParams: { current: 1 },
        },
        callback: requestErrorFeedback,
      });
    },
    handleDelete: (key: string) => {
      const newFiltrateParams = { ...filtrateParams };
      newFiltrateParams[`${key}Min`] = undefined;
      newFiltrateParams[`${key}Max`] = undefined;
      dispatch({
        type: 'adManage/fetchTargetingList',
        payload: {
          headersParams: { StoreId: currentShopId },
          filtrateParams: newFiltrateParams,
          searchParams: { current: 1 },
        },
        callback: requestErrorFeedback,
      });
    },
  };

  return (
    <div>
      <div className={commonStyles.head}>
        <MySearch placeholder="输入广告活动、广告组、ASIN/SKU或关键词" defaultValue="" handleSearch={handleSearch} />
        <Button
          type="primary"
          className={commonStyles.btnFiltrate}
          onClick={handleClickFiltrate}
        >
          高级筛选 { visibleFiltrate ? <UpOutlined /> : <DownOutlined /> }
        </Button>
        <StateSelect state={state} onChange={handleFiltrate} />
        <div>
          Targeting类型：
          <Select
            className={styles.matchTypeSelect}
            dropdownClassName={commonStyles.headSelectDropdown}
            defaultValue=""
            value={targetingType}
            onChange={targetingType => {
              handleFiltrate({ targetingType });
            }}
          >
            <Option value="">全部</Option>
            { targetingTypeOptions }
          </Select>
        </div>
      </div>
      {/* 高级筛选和面包屑 */}
      { visibleFiltrate ? <Filtrate { ...filtrateProps } /> : <Crumbs { ...crumbsProps } /> }
      <div className={commonStyles.tableToolBar}>
        <div>
          <Link to="/">
            <Button type="primary">
              添加关键词<Iconfont type="icon-zhankai" className={commonStyles.iconZhankai} />
            </Button>
          </Link>
          <div className={classnames(commonStyles.batchState, !checkedIds.length ? commonStyles.disabled : '')}>
            批量操作：
            <Button onClick={() => handleBatchState('enabled')}>启动</Button>
            <Button onClick={() => handleBatchState('paused')}>暂停</Button>
            <Button onClick={() => handleBatchState('archived')}>归档</Button>
            <div>
              <Button onClick={() => applySuggestedBid(checkedIds)}>应用建议竞价</Button>
              <BatchSetBid
                currency={currency}
                marketplace={marketplace}
                callback={setBatchBid}
              />
            </div>
          </div>
        </div>
        <div>
          <DefinedCalendar 
            itemKey={calendarDefaultKey}
            storageKey={calendarStorageBaseKey}
            index={1}
            change={handleRangeChange}
            className={commonStyles.DefinedCalendar}
          />
          <CustomCols colsItems={customCols} listType="targeting" />
        </div>
      </div>
      <AdManageTable { ...tableProps } />
      <DataChartModal
        type="targeting"
        visible={chartsState.visible}
        onCancel={() => setChartsState({ ...chartsState, visible: false })}
        campaignId={chartsState.campaignId}
        campaignName={chartsState.campaignName}
        groupId={chartsState.groupId}
        groupName={chartsState.groupName}
        targetId={chartsState.targetId}
        targetName={chartsState.targetName}
      />
    </div>
  );
};

export default Targeting;
