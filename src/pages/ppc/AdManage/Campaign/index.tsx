/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  广告活动
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, Link } from 'umi';
import { Select, message, DatePicker, Input, Button, Modal } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import { defaultFiltrateParams } from '@/models/adManage';
import AdManageTable from '../components/Table';
import nameEditable from '../components/EditableCell';
import MySearch from '../components/Search';
import Filtrate from '../components/Filtrate';
import DateRangePicker from '../components/DateRangePicker';
import CustomCols from '../components/CustomCols';
import Crumbs from '../components/Crumbs';
import { stateOptions } from '../components/StateSelect';
import DataChartModal from '../components/DataChartModal';
import PortfoliosManage from './PortfoliosManage';
import editable from '@/pages/components/EditableCell';
import {
  Iconfont,
  requestErrorFeedback,
  requestFeedback,
  storage,
  getShowPrice,
  strToMoneyStr,
} from '@/utils/utils';
import { isArchived, targetingTypeDict, getAssignUrl, disabledDate, getStatisticsCols } from '../utils';
import { getRangeDate as getTimezoneDateRange } from '@/utils/huang';
import moment from 'moment';
import { UpOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import commonStyles from '../common.less';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;

const Campaign: React.FC = function() {
  const dispatch = useDispatch();
  // 店铺 id
  const {
    id: currentShopId, marketplace, currency,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  // loading
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['adManage/fetchCampaignList'];
  const loadingBatchSet = loadingEffect['adManage/batchCampaign'];
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    campaignTab: { list, searchParams, filtrateParams, portfolioList, customCols, checkedIds },
    treeSelectedInfo,
  } = adManage;
  const { total, records, dataTotal } = list;
  const { current, size, sort, order } = searchParams;
  const { startTime, endTime, portfolioId, targetingType } = filtrateParams;
  const [visibleFiltrate, setVisibleFiltrate] = useState<boolean>(false);
  // 数据分析
  const [chartsState, setChartsState] = useState({
    visible: false,
    campaignId: '',
    campaignName: '',
  });

  useEffect(() => {
    if (currentShopId !== '-1') {
      const { start, end } = storage.get('adManageDateRange') || getTimezoneDateRange(7, false);
      // Portfolios
      dispatch({
        type: 'adManage/fetchPortfolioList',
        payload: {
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
      // 广告活动列表
      dispatch({
        type: 'adManage/fetchCampaignList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { current: 1 },
          filtrateParams: {
            adType: treeSelectedInfo.campaignType,
            state: treeSelectedInfo.campaignState,
            startTime: start,
            endTime: end,
          },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId, treeSelectedInfo]);

  // 修改广告活动数据(状态、portfolio、名称、竞价策略 、Top of Search、Product page、日限额	、时间范围)
  function modifyCampaign(params: {[key: string]: string | number}) {
    dispatch({
      type: 'adManage/modifyCampaign',
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
          modifyCampaign({ state, id });
        },
      });
      return;
    }
    modifyCampaign({ state, id });
  }

  // 新建 Portfolio 并应用到当前广告活动
  function handleNewPortfolio(name: string, id: string) {
    dispatch({
      type: 'adManage/newPortfolio',
      payload: {
        headersParams: { StoreId: currentShopId },
        record: { id, name },
      },
      callback: requestFeedback,
    });
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
      type: 'adManage/fetchCampaignList',
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
            type: 'adManage/batchCampaign',
            payload: {
              headersParams: { StoreId: currentShopId },
              ids: checkedIds,
              state,
            },
            callback: requestFeedback,
          });
        },
      });
      return;
    }
    dispatch({
      type: 'adManage/batchCampaign',
      payload: {
        headersParams: { StoreId: currentShopId },
        ids: checkedIds,
        state,
      },
      callback: requestFeedback,
    });
  }

  // 筛选日期范围
  const handleDateRangeChange = useCallback((rangePickerDates: string[]) => {
    const [startTime, endTime] = rangePickerDates;
    dispatch({
      type: 'adManage/fetchCampaignList',
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: { current: 1 },
        filtrateParams: { startTime, endTime },
      },
      callback: requestErrorFeedback,
    });
  }, [currentShopId, dispatch]);

  // 执行搜索
  function handleSearch(value: string) {
    setVisibleFiltrate(false);
    dispatch({
      type: 'adManage/fetchCampaignList',
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

  // Portfoli 下拉选择
  const portfoliosOptions = (
    <>
      {
        portfolioList.map((portfolio: API.IPortfolio) => (
          <Option key={portfolio.id} value={portfolio.id}>{portfolio.name}</Option>
        ))
      }
    </>
  );

  // 竞价策略下拉选择
  const strategOptions = (
    <>
      {
        [
          { key: 'legacyForSales', name: 'Down Only' },
          { key: 'autoForSales', name: 'Up and Down' },
          { key: 'manual', name: 'Fixed Bid' },
        ].map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)
      }
    </>
  );

  // 全部表格列
  const columns: ColumnProps<API.IAdCampaign>[] = [
    {
      title: <span className="_selectColTh">状态</span>,
      children: [
        {
          dataIndex: 'state',
          align: 'left',
          width: 50,
          fixed: 'left',
          render: (state: string, record: API.IAdCampaign) => (
            <>{
              <Select
                size="small"
                disabled={isArchived(state)}
                className={styles.tableSelect}
                dropdownClassName={styles.selectDropdown}
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
      title: <span className="_selectColTh">Portfolios</span>,
      key: 'portfolios',
      children: [
        {
          dataIndex: 'portfolioId',
          width: 140,
          fixed: 'left',
          render: (_: string, record: API.IAdCampaign) => (
            <>{
              <Select
                size="small"
                disabled={isArchived(record.state)}
                className={styles.tableSelect}
                dropdownClassName={styles.selectDropdown}
                dropdownMatchSelectWidth={false}
                bordered={false}
                defaultValue={record.portfolioId}
                value={record.portfolioId}
                listHeight={330}
                onChange={value => {
                  modifyCampaign({ portfolioId: value, id: record.id });
                }}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <div className={styles.tableAddPortfolio}>
                      <div className={styles.tableAddPortfolioTitle}>新建Portfolios</div>
                      <Search
                        // 用 Search 组件改造的新建
                        placeholder="请输入Portfolios名称"
                        enterButton="保存"
                        size="small"
                        maxLength={40}
                        onSearch={value => handleNewPortfolio(value, record.id)}
                      />
                    </div>
                  </div>
                )}
              >
                { portfoliosOptions }
              </Select>
            }</>
          ),
        },
      ] as any,
    }, {
      title: '广告活动',
      dataIndex: 'name',
      sorter: true,
      sortOrder: sort === 'name' ? order : null,
      children: [
        {
          title: '合计',
          dataIndex: 'id',
          width: 200,
          align: 'left',
          fixed: 'left',
          render: (_: string, record: API.IAdCampaign) => (
            <>{
              nameEditable({
                unchangeable: isArchived(record.state),
                inputValue: record.name,
                href: getAssignUrl({
                  campaignType: record.adType,
                  campaignState: record.state,
                  campaignId: record.id,
                  campaignName: record.name,
                }),
                maxLength: 128,
                confirmCallback: value => {
                  modifyCampaign({ name: value, id: record.id });
                },
              })
            }</>
          ),
        },
      ] as any,
    }, {
      title: '广告类型',
      key: 'adType',
      dataIndex: 'adType',
      sorter: true,
      sortOrder: sort === 'adType' ? order : null,
      children: [
        {
          dataIndex: 'adType',
          align: 'center',
          width: 80,
          // render: (value: string) => value.toUpperCase(),
        },
      ] as any,
    }, {
      title: '投放方式',
      key: 'targetingType',
      children: [
        {
          dataIndex: 'targetingType',
          align: 'center',
          width: 70,
          render: (targetingType: string) => targetingTypeDict[targetingType],
        },
      ] as any,
    }, {
      title: <>创建时间<Iconfont className={commonStyles.iconQuestion} type="icon-yiwen" title="北京时间" /></>,
      align: 'center',
      key: 'createdTime',
      dataIndex: 'createdTime',
      sorter: true,
      sortOrder: sort === 'createdTime' ? order : null,
      children: [
        {
          dataIndex: 'createdTime',
          align: 'center',
          width: 100,
        },
      ] as any,
    }, {
      title: '广告组数量',
      align: 'center',
      key: 'adGroupCount',
      children: [
        {
          dataIndex: 'groupCount',
          align: 'center',
          width: 90,
          render: (groupCount: number, record: API.IAdCampaign) => (
            <a
              href={getAssignUrl({
                campaignType: record.adType,
                campaignState: record.state,
                campaignId: record.id,
                campaignName: record.name,
              })}
            >{groupCount}</a>
          ),
        },
      ] as any,
    }, {
      title: <span className="_selectColTh">竞价策略</span>,
      align: 'left',
      key: 'biddingStrategy',
      children: [
        {
          dataIndex: 'biddingStrategy',
          align: 'left',
          width: 106,
          render: (biddingStrategy: string, record: API.IAdCampaign) => (
            <>{
              <Select
                size="small"
                disabled={isArchived(record.state)}
                className={styles.tableSelect}
                dropdownClassName={styles.selectDropdown}
                bordered={false}
                dropdownMatchSelectWidth={false}
                defaultValue={biddingStrategy}
                value={biddingStrategy}
                onChange={value => {
                  modifyCampaign({ biddingStrategy: value, id: record.id });
                }}
              >
                { strategOptions }
              </Select>
            }</>
          ),
        },
      ] as any,
    }, {
      title: 'Top of Search',
      align: 'center',
      key: 'topOfSearch',
      children: [
        {
          dataIndex: 'biddingPlacementTop',
          align: 'center',
          width: 100,
          render: (value: number, record: API.IAdCampaign) => (
            <>{
              editable({
                inputValue: getShowPrice(value),
                formatValueFun: strToMoneyStr,
                maxLength: 10,
                suffix: '%',
                ghostEditBtn: true,
                confirmCallback: value => {
                  modifyCampaign({ biddingPlacementTop: value, id: record.id });
                },
              })
            }</>
          ),
        },
      ] as any,
    }, {
      title: 'Product page',
      align: 'center',
      key: 'productPage',
      children: [
        {
          dataIndex: 'biddingPlacementProductPage',
          align: 'center',
          width: 100,
          render: (value: number, record: API.IAdCampaign) => (
            <>{
              editable({
                inputValue: getShowPrice(value),
                formatValueFun: strToMoneyStr,
                maxLength: 10,
                suffix: '%',
                ghostEditBtn: true,
                confirmCallback: value => {
                  modifyCampaign({ biddingPlacementProductPage: value, id: record.id });
                },
              })
            }</>
          ),
        },
      ] as any,
    }, {
      title: '日预算',
      align: 'right',
      key: 'dailyBudget',
      dataIndex: 'dailyBudget',
      sorter: true,
      sortOrder: sort === 'dailyBudget' ? order : null,
      children: [
        {
          dataIndex: 'dailyBudget',
          align: 'right',
          width: 100,
          render: (value: number, record: API.IAdCampaign) => (
            <>{
              editable({
                inputValue: getShowPrice(value, marketplace),
                formatValueFun: strToMoneyStr,
                maxLength: 10,
                prefix: currency,
                ghostEditBtn: true,
                confirmCallback: value => {
                  const min = marketplace === 'JP' ? 200 : 1;
                  if (Number(value) < min) {
                    message.error(`每日预算至少${currency}${min}`);
                    return;
                  }
                  modifyCampaign({ dailyBudget: value, id: record.id });
                },
              })
            }</>
          ),
        },
      ] as any,
    }, {
      title: '否定Targeting',
      align: 'center',
      key: 'negativeTargetCount',
      children: [
        {
          dataIndex: 'negativeTargetCount',
          align: 'center',
          width: 100,
          render: (value: number, record: API.IAdCampaign) => (
            <a
              href={getAssignUrl({
                campaignType: record.adType,
                campaignState: record.state,
                campaignId: record.id,
                campaignName: record.name,
                tab: 'negativeKeyword',
              })}
            >{value}</a>
          ),
        },
      ] as any,
    }, {
      title: '开始日期',
      align: 'center',
      key: 'date',
      children: [
        {
          dataIndex: 'startTime',
          align: 'center',
          width: 140,
          render: (value: number, record: API.IAdCampaign) => (
            <>{
              <DatePicker
                size="small"
                disabled={isArchived(record.state)}
                allowClear={false}
                showToday={false}
                value={value ? moment(value) : null}
                onChange={(_, date) => modifyCampaign({ startTime: date, id: record.id })}
              />
            }</>
          ),
        },
      ] as any,
    }, {
      title: '结束日期',
      align: 'center',
      key: 'date',
      children: [
        {
          dataIndex: 'endTime',
          align: 'center',
          width: 140,
          render: (value: number, record: API.IAdCampaign) => (
            <>{
              <DatePicker
                size="small"
                disabled={isArchived(record.state)}
                showToday={false}
                value={value ? moment(value) : null}
                onChange={(_, date) => modifyCampaign({ endTime: date, id: record.id })}
                disabledDate={disabledDate}
              />
            }</>
          ),
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
          render: (_: any, record: API.IAdCampaign) => (
            <>
              <Button
                type="link"
                className={commonStyles.tableOperationBtn}
                onClick={() => setChartsState({
                  visible: true, campaignName: record.name, campaignId: record.id,
                })}
              >
                分析
              </Button>
            </>
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
    loading,
    total,
    current,
    size,
    checkedIds,
    fetchListActionType: 'adManage/fetchCampaignList',
    checkedChangeActionType: 'adManage/updateCampaignChecked',
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
        type: 'adManage/fetchCampaignList',
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
        type: 'adManage/fetchCampaignList',
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
        <MySearch placeholder="广告活动名称/ASIN/SKU" defaultValue="" handleSearch={handleSearch} />
        <Button
          type="primary"
          className={commonStyles.btnFiltrate}
          onClick={handleClickFiltrate}
        >
          高级筛选 { visibleFiltrate ? <UpOutlined /> : <DownOutlined /> }
        </Button>
        <div className={styles.selectContainer}>
          Portfolios：
          <Select
            className={styles.portfoliosSelect}
            dropdownClassName={commonStyles.headSelectDropdown}
            defaultValue=""
            value={portfolioId}
            onChange={portfolioId => {
              handleFiltrate({ portfolioId });
            }}
          >
            <Option value="">全部</Option>
            {
              portfolioList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))
            }
          </Select>
          <PortfoliosManage />
        </div>
        <div className={styles.selectContainer}>
          投放方式：
          <Select
            className={styles.targetingTypeSelect}
            dropdownClassName={commonStyles.headSelectDropdown}
            defaultValue=""
            value={targetingType}
            onChange={targetingType => {
              handleFiltrate({ targetingType });
            }}
          >
            <Option value="">全部</Option>
            {
              Object.keys(targetingTypeDict).map(key => (
                <Option key={key} value={key}>{targetingTypeDict[key]}</Option>
              ))
            }
          </Select>
        </div>
      </div>
      {/* 高级筛选和面包屑 */}
      { visibleFiltrate ? <Filtrate { ...filtrateProps } /> : <Crumbs { ...crumbsProps } /> }
      <div className={commonStyles.tableToolBar}>
        <div>
          <Link to="/ppc/campaign/add">
            <Button type="primary">
              创建广告活动<Iconfont type="icon-zhankai" className={commonStyles.iconZhankai} />
            </Button>
          </Link>
          <div className={classnames(commonStyles.batchState,
            !checkedIds.length || loadingBatchSet ? commonStyles.disabled : '')}>
            批量操作：
            <Button onClick={() => handleBatchState('enabled')}>启动</Button>
            <Button onClick={() => handleBatchState('paused')}>暂停</Button>
            <Button onClick={() => handleBatchState('archived')}>归档</Button>
          </div>
        </div>
        <div>
          <DateRangePicker
            startDate={startTime}
            endDate={endTime}
            callback={handleDateRangeChange}
          />
          <CustomCols colsItems={customCols} listType="campaign" />
        </div>
      </div>
      <AdManageTable { ...tableProps } />
      <DataChartModal
        type="campaign"
        onCancel={() => setChartsState({ ...chartsState, visible: false })}
        { ...chartsState }
      />
    </div>
  );
};

export default Campaign;
