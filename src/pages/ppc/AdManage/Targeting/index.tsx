/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  Targeting（分类/商品投放）
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Select, Button, Modal, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import { defaultFiltrateParams } from '@/models/adManage';
import AdManageTable from '../components/Table';
import MySearch from '../components/Search';
import Filtrate from '../components/Filtrate';
import CustomCols from '../components/CustomCols';
import Crumbs from '../components/Crumbs';
import BatchSetBid from '../components/BatchSetBid';
import StateSelect, { stateOptions } from '../components/StateSelect';
import DataChartModal from '../components/DataChartModal';
import SuggestedPrice from '../components/SuggestedPrice';
import editable from '@/pages/components/EditableCell';
import DefinedCalendar from '@/components/DefinedCalendar';
import AddModal from './AddModal';
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
import {
  isArchived,
  getAssignUrl,
  getDefinedCalendarFiltrateParams,
  getBidExprVlaue,
  getStatisticsCols,
  isOperableTargetingGroup,
} from '../utils';
import { UpOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { IComputedBidParams } from '../index.d';
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
  const loading = {
    table: loadingEffect['adManage/fetchTargetingList'],
    suggestedBid: loadingEffect['adManage/fetchTargetingSuggestedBid'],
    batchSet: loadingEffect['adManage/batchTargeting'],
  };
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    targetingTab: { list, searchParams, filtrateParams, customCols, checkedIds },
    treeSelectedInfo,
  } = adManage;
  const { total, records, dataTotal } = list;
  const { current, size, sort, order } = searchParams;
  const { state, targetingType, startTime, endTime } = filtrateParams;
  const [visibleFiltrate, setVisibleFiltrate] = useState<boolean>(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
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
        const {
          startDate: startTime,
          endDate: endTime,
        } = storage.get(`${calendarStorageBaseKey}_dc_dateRange`);
        const timeMethod = storage.get(`${calendarStorageBaseKey}_dc_itemKey`);
        params = { ...defaultFiltrateParams, startTime, endTime, timeMethod };
      }
      dispatch({
        type: 'adManage/fetchTargetingList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { current: 1 },
          filtrateParams: {
            ...params,
            campaignId: treeSelectedInfo.campaignId,
            groupId: treeSelectedInfo.groupId,
          },
        },
        callback: requestErrorFeedback,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId, treeSelectedInfo]);

  // 修改数据
  function modifyTargeting(params: {id: API.IAdTargeting['id']; [key: string]: string | number}) {
    dispatch({
      type: 'adManage/modifyTargeting',
      payload: {
        headersParams: { StoreId: currentShopId },
        ...params,
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
              targets: checkedIds.map(id => ({ id, state })),
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
        targets: checkedIds.map(id => ({ id, state })),
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
          startTime,
          endTime,
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

  // 批量设置竞价
  function setBatchBid (exprParams: IComputedBidParams) {
    // 计算后的
    const data = getBidExprVlaue({
      marketplace,
      exprParams,
      checkedIds,
      records,
    });
    if (data) {
      dispatch({
        type: 'adManage/batchTargeting',
        payload: {
          headersParams: { StoreId: currentShopId },
          targets: data,
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
      if (!item.suggested) {
        return;
      }
      if (ids.includes(item.id)) {
        data.push({
          id: item.id,
          bid: item.suggested,
        });
      }
    });
    if (data.length !== ids.length) {
      message.error('应用失败，建议竞价不正确！');
      return;
    }
    dispatch({
      type: 'adManage/batchTargeting',
      payload: {
        headersParams: { StoreId: currentShopId },
        targets: data,
      },
      callback: requestFeedback,
    });
  }

  // 点击添加targeting按钮
  function handleClickAddBtn() {
    const { targetingType } = treeSelectedInfo;
    if (!isOperableTargetingGroup(targetingType)) {
      message.warning('此广告活动/广告组不支持添加Targeting');
      return;
    }
    setVisibleAdd(true);
  }

  // targeting 类型下拉框
  const targetingTypeOptions = (
    <>
      <Option key="category" value="category">分类</Option>
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
      dataIndex: 'camName',
      sorter: true,
      sortOrder: sort === 'camName' ? order : null,
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
      dataIndex: 'groupName',
      sorter: true,
      sortOrder: sort === 'groupName' ? order : null,
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
                    targetingType: record.campaignTargetType,
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
            <SuggestedPrice
              loading={loading.suggestedBid}
              disabled={isArchived(record.state)}
              suggestedPrice={value}
              suggestedMin={record.rangeStart}
              suggestedMax={record.rangeEnd}
              marketplace={marketplace}
              currency={currency}
              onApply={() => applySuggestedBid([record.id])}
            />
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
      dataIndex: 'addTime',
      sorter: true,
      sortOrder: sort === 'addTime' ? order : null,
      children: [
        {
          dataIndex: 'addTime',
          width: 100,
          align: 'center',
        },
      ] as any,
    }, 
    
    ...getStatisticsCols({
      total: dataTotal,
      sort,
      order,
      marketplace,
      currency,
    }),
    
    {
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
    loading: loading.table,
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
      newFiltrateParams[key] = undefined;
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
        <MySearch
          placeholder="广告活动/广告组/ASIN/SKU/关键词"
          defaultValue=""
          width="300px"
          handleSearch={handleSearch}
        />
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
          <span>
            <Button type="primary" onClick={handleClickAddBtn}>
              添加Targeting<Iconfont type="icon-zhankai" className={commonStyles.iconZhankai} />
            </Button>
          </span>
          <div className={classnames(commonStyles.batchState,
            !checkedIds.length || loading.batchSet ? commonStyles.disabled : '')}>
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
        onCancel={() => setChartsState({ ...chartsState, visible: false })}
        { ...chartsState }
      />
      <AddModal visible={visibleAdd} setVisible={setVisibleAdd} />
    </div>
  );
};

export default Targeting;
