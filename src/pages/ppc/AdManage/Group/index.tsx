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
import { isArchived, getAssignUrl, disabledDate, getStatisticsCols } from '../utils';
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
  const loading = {
    table: loadingEffect['adManage/fetchGroupList'],
    copyGroup: loadingEffect['adManage/copyGroup'],
    batchSet: loadingEffect['adManage/batchGroup'],
  };
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
      const { start, end } = storage.get('adManageDateRange') || getTimezoneDateRange(7, false);
      dispatch({
        type: 'adManage/fetchGroupList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { current: 1 },
          filtrateParams: {
            campaignId: treeSelectedInfo.campaignId,
            startTime: start,
            endTime: end,
          },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId, treeSelectedInfo]);

  // 修改广告组数据(状态、名称、默认竞价、预算控制、时间范围)
  function modifyGroup(params: {id: API.IAdGroup['id']; [key: string]: string | number}) {
    dispatch({
      type: 'adManage/modifyGroup',
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
      type: 'adManage/batchGroup',
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
      dataIndex: 'camName',
      key: 'campaign',
      sorter: true,
      sortOrder: sort === 'camName' ? order : null,
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
                    targetingType: record.campaignTargetType,
                  })
                }
              >{record.camName}</a>
            </span>
          ),
        },
      ] as any,
    }, {
      title: '广告组',
      dataIndex: 'name',
      sorter: true,
      sortOrder: sort === 'name' ? order : null,
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
                  targetingType: record.campaignTargetType,
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
                editBtnInFlow: true,
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
                targetingType: record.campaignTargetType,
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
                targetingType: record.campaignTargetType,
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
                tab: record.groupType === 'targeting' ? 'negativeTargeting' : 'negativeKeyword',
                targetingType: record.campaignTargetType,
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
                value={value ? moment(value) : null}
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
                showToday={false}
                value={value ? moment(value) : null}
                onChange={(_, date) => modifyGroup({ endTime: date, id: record.id })}
                disabledDate={disabledDate}
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
                  editBtnInFlow: true,
                  confirmCallback: value => {
                    modifyGroup({ budgetLimit: value, id: record.id });
                  },
                })
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
      children: [
        {
          width: 120,
          align: 'center',
          fixed: 'right',
          render: (_: string, record: API.IAdGroup) => (
            <>
              <Button disabled={isArchived(record.state)} type="link" className={commonStyles.tableOperationBtn}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    getAssignUrl({
                      baseUrl: '/ppc/manage/group/time',
                      campaignType: record.camType,
                      campaignState: record.camState,
                      campaignId: record.camId,
                      campaignName: record.camName,
                      groupId: record.id,
                      groupName: record.name,
                      targetingType: record.campaignTargetType,
                    })
                  }
                >定时</a>
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
              <Button
                type="link"
                className={commonStyles.tableOperationBtn}
                disabled={record.campaignTargetType !== 'auto'}
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    getAssignUrl({
                      baseUrl: '/ppc/manage/group/target',
                      campaignType: record.camType,
                      campaignState: record.camState,
                      campaignId: record.camId,
                      campaignName: record.camName,
                      groupId: record.id,
                      groupName: record.name,
                      targetingType: record.campaignTargetType,
                    })
                  }
                >target设置</a>
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
    loading: loading.table,
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
      newFiltrateParams[key] = undefined;
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
        <MySearch placeholder="广告活动/广告组/ASIN/SKU" defaultValue="" handleSearch={handleSearch} />
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
          <Link to={`/ppc/group/add?camId=${treeSelectedInfo.campaignId}`}>
            <Button type="primary">
              创建广告组<Iconfont type="icon-zhankai" className={commonStyles.iconZhankai} />
            </Button>
          </Link>
          <div className={classnames(commonStyles.batchState,
            !checkedIds.length || loading.batchSet ? commonStyles.disabled : '')}>
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
        // 用于重置 Input 的 defaultValue
        destroyOnClose
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
              loading={loading.copyGroup}
            >确定</Button>
          </div>
        </>
      </Modal>
      <DataChartModal
        type="group"
        onCancel={() => setChartsState({ ...chartsState, visible: false })}
        { ...chartsState }
      />
    </div>
  );
};

export default Group;
