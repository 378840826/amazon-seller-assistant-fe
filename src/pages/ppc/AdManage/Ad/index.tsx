/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  广告
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, Link } from 'umi';
import { Select, Button, Modal, Typography, Table, message, Tooltip } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import { defaultFiltrateParams } from '@/models/adManage';
import AdManageTable from '../components/Table';
import MySearch from '../components/Search';
import Filtrate from '../components/Filtrate';
import DateRangePicker from '../components/DateRangePicker';
import CustomCols from '../components/CustomCols';
import Crumbs from '../components/Crumbs';
import DataChartModal from '../components/DataChartModal';
import StateSelect, { stateOptions } from '../components/StateSelect';
import GoodsImg from '@/pages/components/GoodsImg';
import GoodsIcon from '@/pages/components/GoodsIcon';
import {
  Iconfont,
  requestErrorFeedback,
  requestFeedback,
  getAmazonAsinUrl,
  storage,
  getShowPrice,
  objToQueryString,
} from '@/utils/utils';
import { isArchived, getAssignUrl, getStatisticsCols } from '../utils';
import { getRangeDate as getTimezoneDateRange } from '@/utils/huang';
import { UpOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import commonStyles from '../common.less';
import styles from './index.less';

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
  const loading = {
    table: loadingEffect['adManage/fetchAdList'],
    searchGoods: loadingEffect['adManage/fetchGoodsList'],
    addAd: loadingEffect['adManage/addAd'],
    fetchGroupList: loadingEffect['adManage/fetchSimpleGroupList'],
    batchSet: loadingEffect['adManage/batchAd'],
  };
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    adTab: { list, searchParams, filtrateParams, customCols, checkedIds },
    treeSelectedInfo,
    campaignSimpleList,
  } = adManage;
  const { total, records, dataTotal } = list;
  const { current, size, sort, order } = searchParams;
  const { startTime, endTime, state, qualification } = filtrateParams;
  const [visibleFiltrate, setVisibleFiltrate] = useState<boolean>(false);
  // 添加广告
  const [addState, setAddState] = useState({
    visible: false,
    campaignId: '',
    campaignName: '',
    groupId: '',
    groupName: '',
  });
  // 添加广告时，提供选择的广告组
  const [groupSimpleList, setGroupSimpleList] = useState<{id: string; name: string}[]>([]);
  // 店铺下全部的商品
  const [shopGoodsList, setShopGoodsList] = useState<API.IGoods[]>([]);
  // 本地搜索商品时的虚拟loading，以便让用户明显看到表格的变化
  const [loadingSearchGoods, setLoadingSearchGoods] = useState<boolean>(false);
  // 商品的搜索结果
  const [goodsList, setGoodsList] = useState<API.IGoods[]>([]);
  // 已选商品
  const [selectedGoodsList, setSelectedGoodsList] = useState<API.IGoods[]>([]);
  // 数据分析
  const [chartsState, setChartsState] = useState({
    visible: false,
    campaignId: '',
    campaignName: '',
    groupId: '',
    groupName: '',
    adId: '',
    adName: '',
  });

  useEffect(() => {
    if (currentShopId !== '-1') {
      // 广告列表
      // 菜单树附带的筛选参数，格式为 "类型-广告活动状态-广告活动ID-广告组ID"
      const { start, end } = storage.get('adManageDateRange') || getTimezoneDateRange(7, false);
      dispatch({
        type: 'adManage/fetchAdList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { current: 1 },
          filtrateParams: {
            campaignId: treeSelectedInfo.campaignId,
            groupId: treeSelectedInfo.groupId,
            startTime: start,
            endTime: end,
          },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId, treeSelectedInfo]);
  
  useEffect(() => {
    // 获取简单广告活动列表或广告组简单列表
    if (currentShopId !== '-1') {
      // 判断菜单树是否选中广告活动或广告组
      const { campaignId, groupId } = treeSelectedInfo;
      // 没有选中任何菜单树的情况，获取广告活动列表
      if (!campaignId) {
        dispatch({
          type: 'adManage/fetchSimpleCampaignList',
          payload: {
            headersParams: { StoreId: currentShopId },
          },
          callback: requestErrorFeedback,
        });
      } else {
        // 选中广告活动且没选中广告组的情况，获取选中广告活动下的广告组
        if (!groupId) {
          dispatch({
            type: 'adManage/fetchSimpleGroupList',
            payload: {
              headersParams: { StoreId: currentShopId },
              campaignId,
            },
            callback: (code: number, msg: string, data: {id: string; name: string}[]) => {
              requestErrorFeedback(code, msg);
              setGroupSimpleList(data);
            },
          });
        }
      }
      // 如果已选中广告活动或广告组，设置 addState 
      setAddState({
        ...addState,
        campaignId: campaignId || '',
        groupId: groupId || '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId, treeSelectedInfo]);

  // 切换广告组后清空已选产品
  useEffect(() => {
    setSelectedGoodsList([]);
  }, [addState.groupId]);

  // 首次打开添加广告弹窗，获取全店商品
  useEffect(() => {
    if (addState.visible && goodsList.length === 0) {
      dispatch({
        type: 'adManage/fetchGoodsList',
        payload: {
          headersParams: { StoreId: currentShopId },
          code: '',
        },
        callback: (code: number, msg: string, data: API.IGoods[]) => {
          requestErrorFeedback(code, msg);
          setShopGoodsList(data);
          setGoodsList(data);
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addState.visible]);

  // 修改广告数据(状态)
  function modifyAd(params: {id: API.IAd['id']; [key: string]: string | number}) {
    dispatch({
      type: 'adManage/modifyAd',
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
      type: 'adManage/batchAd',
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
      type: 'adManage/fetchAdList',
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
      type: 'adManage/fetchAdList',
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

  // 选择广告活动(添加广告时)
  function handleCampaignChange(id: string) {
    setAddState({
      ...addState,
      campaignId: id,
      groupId: '',
    });
    setGroupSimpleList([]);
    dispatch({
      type: 'adManage/fetchSimpleGroupList',
      payload: {
        headersParams: { StoreId: currentShopId },
        campaignId: id,
      },
      callback: (code: number, msg: string, data: {id: string; name: string}[]) => {
        requestErrorFeedback(code, msg);
        setGroupSimpleList(data);
      },
    });
  }

  // 搜索 asin/sku
  function handleAddSearch(value: string) {
    // 虚拟 loading
    setLoadingSearchGoods(true);
    setTimeout(() => setLoadingSearchGoods(false), 200);
    const val = value.trim();
    // 从全部的商品中筛选
    const resultGoodsList = shopGoodsList.filter(goods => {
      if (
        goods.asin.toLowerCase().includes(val.toLowerCase()) ||
        goods.sku.toLowerCase().includes(val.toLowerCase())
      ) {
        return goods;
      }
    });
    setGoodsList(resultGoodsList);
  }

  // 添加广告时的广告活动选择器
  function renderCampaignSelect() {
    return !treeSelectedInfo.campaignId && (
      <Select
        showSearch
        // 空字符串时，placeholder不会显示
        value={addState.campaignId || undefined}
        className={commonStyles.addSelect}
        placeholder="选择广告活动"
        onChange={handleCampaignChange}
        filterOption={(input, option) => {
          return option?.children.toLowerCase().includes(input.toLowerCase());
        }}
      >
        {
          campaignSimpleList.map(item => (
            item.campaignType !== 'sb' && 
            <Option key={item.id} value={item.id}>{ item.name }</Option>)
          )
        }
      </Select>
    );
  }

  // 添加广告时的广告组选择器
  function renderGroupSelect() {
    // 已选中广告活动并且没选中广告组的情况才显示
    return addState.campaignId && !treeSelectedInfo.groupId && (
      <Select
        showSearch
        // 空字符串时，placeholder不会显示
        value={addState.groupId || undefined}
        className={commonStyles.addSelect}
        loading={loading.fetchGroupList}
        placeholder="选择广告组"
        onChange={value => setAddState({
          ...addState,
          groupId: value,
        })}
        filterOption={(input, option) => {
          return option?.children.toLowerCase().includes(input.toLowerCase());
        }}
      >
        {
          groupSimpleList.map(item => (
            <Option key={item.id} value={item.id}>{ item.name }</Option>)
          )
        }
      </Select>
    );
  }

  // 删除已选的商品
  function handleDeleteGoods(sku: string) {
    const newList = selectedGoodsList.filter(item => item.sku !== sku);
    setSelectedGoodsList(newList);
  }

  // 添加广告
  function handleAdd() {
    if (!addState.campaignId || !addState.groupId) {
      message.error('请选择广告活动和广告组！');
      return;
    }
    setAddState({
      ...addState,
      visible: false,
    });
    dispatch({
      type: 'adManage/addAd',
      payload: {
        headersParams: { StoreId: currentShopId },
        products: selectedGoodsList.map(goods => ({ asin: goods.asin, sku: goods.sku })),
        campaignId: addState.campaignId,
        groupId: addState.groupId,
      },
      callback: (code: number, msg: string) => {
        requestFeedback(code, msg);
        if (code === 200) {
          setTimeout(() => {
            const params = {
              ...treeSelectedInfo,
              tab: 'ad',
            };
            window.location.replace(`./manage?${objToQueryString(params)}`);
          }, 1000);
        }
      },
    });
  }

  // 商品表格基础列（添加弹窗，不含操作栏）
  const goodsTableColumns: ColumnProps<API.IGoods>[] = [
    {
      title: '商品信息',
      dataIndex: 'sku',
      align: 'center',
      width: 320,
      render: (sku, record) => (
        <div className={styles.goodsInfoContainer}>
          <GoodsImg src={record.imgUrl} alt="商品" width={46} />
          <div className={styles.goodsInfoContent}>
            <Paragraph ellipsis className={styles.goodsTitle}>
              { GoodsIcon.link() }
              <a title={record.title} href={record.url} target="_blank" rel="noopener noreferrer">{record.title}</a>
            </Paragraph>
            <div className={styles.goodsInfoLine}>
              <span className={styles.asin}>{record.asin}</span>
              <span className={styles.review}>
                <span className={styles.reviewScore}>{record.reviewScore}</span>
                <span className={styles.reviewCount}>({`${record.reviewCount || '—'}`})</span>
              </span>
              <span className={styles.price}>
                { getShowPrice(record.price, marketplace, currency) }
              </span>
            </div>
            <div>{sku}</div>
          </div>
        </div>
      ),
    }, {
      title: '库存',
      dataIndex: 'sellable',
      align: 'center',
      width: 40,
    }, {
      title: '排名',
      dataIndex: 'ranking',
      align: 'center',
      width: 40,
      render: (ranking, record) => record.dayOrder7Count,
    },
  ];

  // 待选商品列
  const candidateGoodsTableColumns: ColumnProps<API.IGoods>[] = goodsTableColumns.concat({
    title: '操作',
    dataIndex: '',
    align: 'center',
    width: 40,
    render: (_, record) => {
      const isSelected = selectedGoodsList.find(item => item.sku === record.sku);
      if (isSelected) {
        return <Button type="link" disabled>已选</Button>;
      }
      return (
        <Button
          type="link"
          className={commonStyles.selectBtn}
          onClick={() => {
            if (selectedGoodsList.length > 999) {
              message.error('一次最多添加1000个产品');
              return;
            }
            setSelectedGoodsList([
              record,
              ...selectedGoodsList,
            ]);
          }}
        >选择</Button>
      );
    },
  });

  // 已选商品列
  const selectedGoodsTableColumns: ColumnProps<API.IGoods>[] = goodsTableColumns.concat({
    title: '操作',
    dataIndex: '',
    align: 'center',
    width: 40,
    render: (_, record) => (
      <Button
        type="link"
        className={commonStyles.deleteBtn}
        onClick={() => handleDeleteGoods(record.sku)}
      >删除</Button>
    ),
  });

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
      dataIndex: 'camName',
      key: 'campaign',
      sorter: true,
      sortOrder: sort === 'camName' ? order : null,
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
      dataIndex: 'groupName',
      key: 'group',
      sorter: true,
      sortOrder: sort === 'groupName' ? order : null,
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
                    targetingType: record.campaignTargetType,
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
      key: 'qualification',
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
                    <Tooltip title={record.qualificationMessage}>
                      <div className={classnames(commonStyles.red, styles.qualificationMessage)}>
                        {record.qualificationMessage}
                      </div>
                    </Tooltip>
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
          render: (_: string, record: API.IAd) => (
            <Button
              type="link"
              className={commonStyles.tableOperationBtn}
              onClick={() => setChartsState({
                visible: true,
                campaignId: record.camId,
                campaignName: record.camName,
                groupId: record.groupId,
                groupName: record.groupName,
                adId: record.id,
                adName: record.asin,
              })}
            >
              分析
            </Button>
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
    loading: loading.table,
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
      newFiltrateParams[key] = undefined;
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
        <MySearch placeholder="ASIN/SKU" defaultValue="" handleSearch={handleSearch} />
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
          <Button type="primary" onClick={() => setAddState({ ...addState, visible: true })}>
            添加广告<Iconfont type="icon-zhankai" className={commonStyles.iconZhankai} />
          </Button>
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
          <CustomCols colsItems={customCols} listType="ad" />
        </div>
      </div>
      <AdManageTable { ...tableProps } />
      <DataChartModal
        type="ad"
        onCancel={() => setChartsState({ ...chartsState, visible: false })}
        { ...chartsState }
      />
      <Modal
        visible={addState.visible}
        width={1160}
        keyboard={false}
        footer={false}
        maskClosable={false}
        className={classnames(styles.Modal, commonStyles.addModal)}
        onCancel={() => setAddState({ ...addState, visible: false })}
      >
        <div className={commonStyles.addModalTitle}>添加广告</div>
        <div className={commonStyles.addModalContent}>
          <div className={commonStyles.addSelectContainer}>
            { renderCampaignSelect() }
            { renderGroupSelect() }
          </div>
          <div className={commonStyles.addTableContainer}>
            <div className={styles.tableContent}>
              <MySearch placeholder="请输入ASIN或SKU" defaultValue="" handleSearch={handleAddSearch} />
              <Table
                loading={loading.searchGoods || loadingSearchGoods}
                columns={candidateGoodsTableColumns}
                scroll={{ x: 'max-content', y: '450px' }}
                rowKey={record => record.asin}
                dataSource={goodsList}
                locale={{ emptyText: '请输入本店铺的ASIN、SKU进行查询' }}
                pagination={false}
              />
            </div>
            <div className={styles.tableContent}>
              <div className={styles.title}>已选产品</div>
              <Table
                loading={loading.addAd}
                columns={selectedGoodsTableColumns}
                scroll={{ x: 'max-content', y: '450px' }}
                rowKey={record => record.asin}
                dataSource={selectedGoodsList}
                locale={{ emptyText: '请从左侧表格选择产品' }}
                pagination={false}
              />
            </div>
          </div>
          <div className={commonStyles.addModalfooter}>
            <Button onClick={() => setAddState({ ...addState, visible: false })}>取消</Button>
            <Button type="primary" disabled={!selectedGoodsList.length} onClick={handleAdd}>确定</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Ad;
