/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  广告
 */
import React, { useEffect, useState } from 'react';
import { Select, Button, Modal, Typography } from 'antd';
import { IConnectState } from '@/models/connect';
import { defaultFiltrateParams } from '@/models/adManage';
import { ColumnProps } from 'antd/es/table';
import { useSelector, useDispatch, Link } from 'umi';
import AdManageTable from '../components/Table';
import { Iconfont, requestErrorFeedback, requestFeedback, getAmazonAsinUrl } from '@/utils/utils';
import MySearch from '../components/Search';
import Filtrate from '../components/Filtrate';
import DateRangePicker from '../components/DateRangePicker';
import CustomCols from '../components/CustomCols';
import Crumbs from '../components/Crumbs';
import StateSelect, { stateOptions } from '../components/StateSelect';
import { isArchived, getAssignUrl } from '../utils';
import { getShowPrice } from '@/utils/utils';
import GoodsImg from '@/pages/components/GoodsImg';
import GoodsIcon from '@/pages/components/GoodsIcon';
import { UpOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import styles from './index.less';
import commonStyles from '../common.less';

const { Option } = Select;
const { Text, Paragraph } = Typography;

const Ad: React.FC = function() {
  const dispatch = useDispatch();
  // 店铺 id
  const {
    id: currentShopId, marketplace, currency,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  // loading
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['adManage/fetchAdList'];
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    adTab: { list, searchParams, filtrateParams, customCols, checkedIds },
    treeSelectedInfo,
  } = adManage;
  const { total, records, dataTotal } = list;
  const { current, size, sort, order } = searchParams;
  const { startDate, endDate, state, qualification } = filtrateParams;
  const [visibleFiltrate, setVisibleFiltrate] = useState<boolean>(false);

  useEffect(() => {
    if (currentShopId !== '-1') {
      // 广告列表
      // 菜单树附带的筛选参数，格式为 "类型-广告活动状态-广告活动ID-广告组ID"
      const paramsArr = treeSelectedInfo.key.split('-');
      dispatch({
        type: 'adManage/fetchAdList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { current: 1 },
          filtrateParams: {
            // adType: paramsArr[0],
            // camState: paramsArr[1],
            campaignId: paramsArr[2],
            groupId: paramsArr[3],
          },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId, treeSelectedInfo]);

  // 修改广告数据(状态)
  function modifyAd(params: {[key: string]: string | number}) {
    dispatch({
      type: 'adManage/modifyAd',
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
          modifyAd({ state, id });
        },
      });
      return;
    }
    modifyAd({ state, id });
  }

  // 展开/收起筛选器
  function handleClickFiltrate() {
    setVisibleFiltrate(!visibleFiltrate);
  }

  // 执行筛选
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleFiltrate(values: { [key: string]: any }) {
    setVisibleFiltrate(false);
    console.log('handleFiltrate', values);
    dispatch({
      type: 'adManage/fetchAdList',
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
            type: 'adManage/batchAd',
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
      type: 'adManage/batchAd',
      payload: {
        headersParams: { StoreId: currentShopId },
        adIds: checkedIds,
        state,
      },
      callback: requestFeedback,
    });
  }

  // 筛选日期范围
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDateRangeChange(rangePickerDates: any) {
    dispatch({
      type: 'adManage/fetchAdList',
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: { current: 1 },
        filtrateParams: {
          startDate: rangePickerDates[0],
          endDate: rangePickerDates[1],
        },
      },
      callback: requestErrorFeedback,
    });
  }

  // 执行搜索
  function handleSearch(value: string) {
    setVisibleFiltrate(false);
    dispatch({
      type: 'adManage/fetchAdList',
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

  // 投放资格下拉框
  const qualificationOptions = (
    <>
      {
        [
          { key: 'delivery', name: 'Delivery' },
          { key: 'ineligible', name: 'Ineligible' },
        ].map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)
      }
    </>
  );

  // 全部表格列
  const columns: ColumnProps<API.IAd>[] = [
    {
      title: <span className="_selectColTh">状态</span>,
      children: [
        {
          dataIndex: 'state',
          width: 50,
          fixed: 'left',
          render: (state: string, record: API.IAd) => (
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
          width: 160,
          fixed: 'left',
          render: (_: string, record: API.IAd) => (
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
      ],
    }, {
      title: '广告组',
      children: [
        {
          dataIndex: 'groupId',
          width: 200,
          fixed: 'left',
          render: (_: string, record: API.IAd) => (
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
      ],
    }, {
      title: '广告',
      children: [
        {
          title: '合计',
          dataIndex: 'id',
          width: 260,
          align: 'left',
          fixed: 'left',
          render: (_: string, record: API.IAd) => (
            <div className={styles.goodsInfoContainer}>
              <GoodsImg src={record.img} alt="商品" width={40} />
              <div className={styles.goodsInfoContent}>
                <Paragraph ellipsis className={styles.goodsTitle}>
                  { GoodsIcon.link() }
                  <a title={record.title} href={getAmazonAsinUrl(record.asin, marketplace)} target="_blank" rel="noopener noreferrer">{record.title}</a>
                </Paragraph>
                <div>
                  <Link to={`/asin/base?asin=${record.asin}`} title="跳转到ASIN总览">{record.asin}</Link>
                </div>
                <Paragraph ellipsis>
                  <Text title={record.sku}>{record.sku}</Text>
                </Paragraph>
              </div>
            </div>
          ),
        },
      ] as any,
    }, {
      title: '投放资格',
      align: 'center',
      children: [
        {
          dataIndex: 'qualification',
          width: 100,
          align: 'center',
          render: (value: string, record: API.IAd) => (
            <>
              {
                record.qualificationMessage
                  ?
                  <>
                    { value }
                    <div className={commonStyles.red}>{record.qualificationMessage}</div>
                  </>
                  :
                  <div className={commonStyles.green}>{ value }</div>
              }
            </>
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
          render: () => (
            <>
              <Button type="link" className={commonStyles.tableOperationBtn}>
                分析
              </Button>
            </>
          ),
        },
      ],
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
    fetchListActionType: 'adManage/fetchAdList',
    checkedChangeActionType: 'adManage/updateAdChecked',
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
        type: 'adManage/fetchAdList',
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
        type: 'adManage/fetchAdList',
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
        <MySearch placeholder="输入商品名称/ASIN/SKU" defaultValue="" handleSearch={handleSearch} />
        <Button
          type="primary"
          className={commonStyles.btnFiltrate}
          onClick={handleClickFiltrate}
        >
          高级筛选 { visibleFiltrate ? <UpOutlined /> : <DownOutlined /> }
        </Button>
        <StateSelect state={state} onChange={handleFiltrate} />
        <div>
          投放资格：
          <Select
            className={styles.qualificationSelect}
            dropdownClassName={commonStyles.headSelectDropdown}
            defaultValue=""
            value={qualification}
            onChange={qualification => {
              handleFiltrate({ qualification });
            }}
          >
            <Option value="">全部</Option>
            { qualificationOptions }
          </Select>
        </div>
      </div>
      {/* 高级筛选和面包屑 */}
      { visibleFiltrate ? <Filtrate { ...filtrateProps } /> : <Crumbs { ...crumbsProps } /> }
      <div className={commonStyles.tableToolBar}>
        <div>
          <Link to="/">
            <Button type="primary">
              添加广告<Iconfont type="icon-zhankai" className={commonStyles.iconZhankai} />
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
            startDate={startDate}
            endDate={endDate}
            callback={handleDateRangeChange}
          />
          <CustomCols colsItems={customCols} listType="ad" />
        </div>
      </div>
      <AdManageTable { ...tableProps } />
    </div>
  );
};

export default Ad;
