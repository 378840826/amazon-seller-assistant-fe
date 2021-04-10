/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  广告组
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, Link } from 'umi';
import { Select, DatePicker, Button, Modal, Input } from 'antd';
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
import DataChartModal from '../components/DataChartModal';
import StateSelect, { stateOptions } from '../components/StateSelect';
import editable from '@/pages/components/EditableCell';
import { isArchived, getAssignUrl } from '../utils';
import {
  getShowPrice,
  strToMoneyStr,
  Iconfont,
  requestErrorFeedback,
  requestFeedback,
  storage,
} from '@/utils/utils';
import { getRangeDate as getTimezoneDateRange } from '@/utils/huang';
import moment from 'moment';
import { UpOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import commonStyles from '../common.less';
import styles from './index.less';

const Group: React.FC = function() {  
  const dispatch = useDispatch();
  // 店铺 id
  const {
    id: currentShopId, marketplace, currency,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  // loading
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['adManage/fetchGroupList'];
  const copyGroupLoading = loadingEffect['adManage/copyGroup'];
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    groupTab: { list, searchParams, filtrateParams, customCols, checkedIds },
    treeSelectedInfo,
  } = adManage;
  const { total, records, dataTotal } = list;
  const { current, size, sort, order } = searchParams;
  const { startTime, endTime, state } = filtrateParams;
  const [visibleFiltrate, setVisibleFiltrate] = useState<boolean>(false);
  const [visibleCopyGroup, setVisibleCopyGroup] = useState<boolean>(false);
  const [copyGroupState, setCopyGroupState] = useState({ id: '', name: '' });
  // 数据分析
  const [chartsState, setChartsState] = useState({
    visible: false,
    campaignId: '',
    campaignName: '',
    groupId: '',
    groupName: '',
  });

  useEffect(() => {
    if (currentShopId !== '-1') {
      // 广告组列表
      // 菜单树附带的筛选参数，格式为 "类型-广告活动状态-广告活动ID"
      const paramsArr = treeSelectedInfo.key.split('-');
      const { start, end } = storage.get('adManageDateRange') || getTimezoneDateRange(7, false);
      dispatch({
        type: 'adManage/fetchGroupList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { current: 1 },
          filtrateParams: {
            campaignId: paramsArr[2],
            startTime: start,
            endTime: end,
          },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId, treeSelectedInfo]);

  // 修改广告组数据(状态、名称、默认竞价、预算控制、时间范围)
  function modifyGroup(params: {[key: string]: string | number}) {
    dispatch({
      type: 'adManage/modifyGroup',
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
          modifyGroup({ state, id });
        },
      });
      return;
    }
    modifyGroup({ state, id });
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
      type: 'adManage/fetchGroupList',
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
            type: 'adManage/batchGroup',
            payload: {
              headersParams: { StoreId: currentShopId },
              groupIds: checkedIds,
              state,
            },
            callback: requestFeedback,
          });
        },
      });
      return;
    }
    dispatch({
      type: 'adManage/batchGroup',
      payload: {
        headersParams: { StoreId: currentShopId },
        groupIds: checkedIds,
        state,
      },
      callback: requestFeedback,
    });
  }

  // 筛选日期范围
  const handleDateRangeChange = useCallback((rangePickerDates: string[]) => {
    const [startTime, endTime] = rangePickerDates;
    dispatch({
      type: 'adManage/fetchGroupList',
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
      type: 'adManage/fetchGroupList',
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

  // 点击复制分组
  function handleClickCopyGroup(id: string, name: string) {
    setVisibleCopyGroup(true);
    setCopyGroupState({
      id,
      name: `${name}_副本`,
    });
  }

  // 复制分组
  function handleCopyGroup() {
    dispatch({
      type: 'adManage/copyGroup',
      payload: {
        headersParams: { StoreId: currentShopId },
        id: copyGroupState.id,
        name: copyGroupState.name,
      },
      callback: (code: number, msg: string) => {
        console.log(code, msg);
        if (code === 200) {
          setVisibleCopyGroup(false);
          handleSearch(copyGroupState.name);
        }
        requestFeedback(code, msg);
      },
    });
  }

  // 取消复制
  function handleCopyCancel() {
    setVisibleCopyGroup(false);
  }

  // 全部表格列
  const columns: ColumnProps<API.IAdGroup>[] = [
    {
      title: <span className="_selectColTh">状态</span>,
      children: [
        {
          dataIndex: 'state',
          align: 'left',
          width: 50,
          fixed: 'left',
          render: (state: string, record: API.IAdGroup) => (
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
      title: '广告活动',
      children: [
        {
          dataIndex: 'camId',
          align: 'left',
          width: 160,
          fixed: 'left',
          render: (_: string, record: API.IAdGroup) => (
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
          dataIndex: 'id',
          align: 'left',
          width: 200,
          fixed: 'left',
          render: (_: string, record: API.IAdGroup) => (
            <>{
              nameEditable({
                unchangeable: isArchived(record.state),
                inputValue: record.name,
                href: getAssignUrl({
                  campaignType: record.camType,
                  campaignState: record.camState,
                  campaignId: record.camId,
                  campaignName: record.camName,
                  groupId: record.id,
                  groupName: record.name,
                  groupType: record.groupType,
                }),
                maxLength: 128,
                confirmCallback: value => {
                  modifyGroup({ name: value, id: record.id });
                },
              })
            }</>
          ),
        },
      ] as any,
    }, {
      title: <>创建时间<Iconfont className={commonStyles.iconQuestion} type="icon-yiwen" title="北京时间" /></>,
      align: 'center',
      key: 'createdTime',
      children: [
        {
          dataIndex: 'createdTime',
          align: 'center',
          width: 100,
        },
      ] as any,
    }, {
      title: '默认竞价',
      align: 'right',
      key: 'defaultBid',
      children: [
        {
          dataIndex: 'defaultBid',
          align: 'right',
          width: 100,
          render: (value: number, record: API.IAdGroup) => (
            <>{
              editable({
                inputValue: getShowPrice(value),
                formatValueFun: strToMoneyStr,
                maxLength: 10,
                prefix: currency,
                ghostEditBtn: true,
                confirmCallback: value => {
                  modifyGroup({ defaultBid: value, id: record.id });
                },
              })
            }</>
          ),
        },
      ] as any,
    }, {
      title: '广告个数',
      align: 'center',
      key: 'productCount',
      children: [
        {
          dataIndex: 'productCount',
          align: 'center',
          width: 100,
          render: (value: number, record: API.IAdGroup) => (
            <a
              href={getAssignUrl({
                campaignType: record.camType,
                campaignState: record.camState,
                campaignId: record.camId,
                campaignName: record.camName,
                groupId: record.id,
                groupName: record.name,
                groupType: record.groupType,
              })}
            >{value}</a>
          ),
        },
      ] as any,
    }, {
      title: 'Targeting',
      align: 'center',
      key: 'targetCount',
      children: [
        {
          dataIndex: 'targetCount',
          align: 'center',
          width: 100,
          render: (value: number, record: API.IAdGroup) => (
            <a
              href={getAssignUrl({
                campaignType: record.camType,
                campaignState: record.camState,
                campaignId: record.camId,
                campaignName: record.camName,
                groupId: record.id,
                groupName: record.name,
                groupType: record.groupType,
                tab: record.groupType,
              })}
            >{value}</a>
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
          render: (value: number, record: API.IAdGroup) => (
            <a
              href={getAssignUrl({
                campaignType: record.camType,
                campaignState: record.camState,
                campaignId: record.camId,
                campaignName: record.camName,
                groupId: record.id,
                groupName: record.name,
                groupType: record.groupType,
                tab: 'negativeTargeting',
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
          render: (value: string, record: API.IAdGroup) => (
            <>{
              <DatePicker
                size="small"
                disabled={isArchived(record.state)}
                allowClear={false}
                showToday={false}
                value={moment(value)}
                onChange={(_, date) => modifyGroup({ startTime: date, id: record.id })}
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
          render: (value: string, record: API.IAdGroup) => (
            <>{
              <DatePicker
                size="small"
                disabled={isArchived(record.state)}
                allowClear={false}
                showToday={false}
                value={moment(value)}
                onChange={(_, date) => modifyGroup({ endTime: date, id: record.id })}
              />
            }</>
          ), 
        },
      ] as any,
    }, {
      title: '预算控制',
      align: 'right',
      key: 'budgetLimit',
      children: [
        {
          dataIndex: 'budgetLimit',
          align: 'right',
          width: 100,
          render: (value: number, record: API.IAdGroup) => (
            <>{
              isArchived(record.state)
                ? `${value}${currency}`
                : editable({
                  inputValue: getShowPrice(value),
                  formatValueFun: strToMoneyStr,
                  maxLength: 10,
                  prefix: currency,
                  ghostEditBtn: true,
                  confirmCallback: value => {
                    modifyGroup({ budgetLimit: value, id: record.id });
                  },
                })
            }</>
          ),
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
      children: [
        {
          width: 120,
          align: 'center',
          fixed: 'right',
          render: (_: string, record: API.IAdGroup) => (
            <>
              <Button disabled={isArchived(record.state)} type="link" className={commonStyles.tableOperationBtn}>
                定时
              </Button>
              <Button
                type="link"
                className={commonStyles.tableOperationBtn}
                onClick={() => handleClickCopyGroup(record.id, record.name)}
              >
                复制
              </Button>
              <Button
                type="link"
                className={commonStyles.tableOperationBtn}
                onClick={() => setChartsState({
                  visible: true,
                  campaignId: record.camId,
                  campaignName: record.camName,
                  groupId: record.id,
                  groupName: record.name,
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
    fetchListActionType: 'adManage/fetchGroupList',
    checkedChangeActionType: 'adManage/updateGroupChecked',
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
        type: 'adManage/fetchGroupList',
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
        type: 'adManage/fetchGroupList',
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
        <MySearch placeholder="输入广告组名称/ASIN/SKU" defaultValue="" handleSearch={handleSearch} />
        <Button
          type="primary"
          className={commonStyles.btnFiltrate}
          onClick={handleClickFiltrate}
        >
          高级筛选 { visibleFiltrate ? <UpOutlined /> : <DownOutlined /> }
        </Button>
        <StateSelect state={state} onChange={handleFiltrate} />
      </div>
      {/* 高级筛选和面包屑 */}
      { visibleFiltrate ? <Filtrate { ...filtrateProps } /> : <Crumbs { ...crumbsProps } /> }
      <div className={commonStyles.tableToolBar}>
        <div>
          <Link to="/">
            <Button type="primary">
              创建广告组<Iconfont type="icon-zhankai" className={commonStyles.iconZhankai} />
            </Button>
          </Link>
          <div className={classnames(commonStyles.batchState, !checkedIds.length ? commonStyles.disabled : '')}>
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
          <CustomCols colsItems={customCols} listType="group" />
        </div>
      </div>
      <AdManageTable { ...tableProps } />
      <Modal
        title=""
        closable={false}
        mask={false}
        centered
        footer={null}
        width={320}
        visible={visibleCopyGroup}
        className={styles.Modal}
        onOk={handleCopyGroup}
        onCancel={handleCopyCancel}
      >
        <>
          <div className={styles.groupName}>
            广告组名称：
            <Input
              placeholder="请输入广告组名称"
              defaultValue={copyGroupState.name}
              onBlur={(e) => setCopyGroupState({ id: copyGroupState.id, name: e.target.value })}
            />
          </div>
          <div className={styles.btns}>
            <Button className={styles.btnCancel} onClick={handleCopyCancel}>取消</Button>
            <Button
              type="primary"
              className={styles.btnConfirm}
              onClick={handleCopyGroup}
              loading={copyGroupLoading}
            >确定</Button>
          </div>
        </>
      </Modal>
      <DataChartModal
        type="group"
        visible={chartsState.visible}
        onCancel={() => setChartsState({ ...chartsState, visible: false })}
        campaignId={chartsState.campaignId}
        campaignName={chartsState.campaignName}
        groupId={chartsState.groupId}
        groupName={chartsState.groupName}
      />
    </div>
  );
};

export default Group;
