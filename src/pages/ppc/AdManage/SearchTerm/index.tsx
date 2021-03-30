/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  Search Term 报表
 */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Button, Modal, Table, Input, Select, Spin, message, AutoComplete } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import { defaultFiltrateParams } from '@/models/adManage';
import AdManageTable from '../components/Table';
import Filtrate from '../components/Filtrate';
import Crumbs from '../components/Crumbs';
import CustomCols from '../components/CustomCols';
import ContainTitleSelect from '../components/ContainTitleSelect';
import editable from '@/pages/components/EditableCell';
import DefinedCalendar from '@/components/DefinedCalendar';
import { matchTypeDict } from '@/pages/ppc/AdManage';
import {
  Iconfont,
  requestErrorFeedback,
  requestFeedback,
  getShowPrice,
  getAmazonAsinUrl,
  strToMoneyStr,
  storage,
  getDateCycleParam,
} from '@/utils/utils';
import {
  getAssignUrl,
  getTableColumns,
  isValidKeywordBid,
  getDefinedCalendarFiltrateParams,
} from '../utils';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import commonStyles from '../common.less';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;

// 否定弹窗的关键词信息
export interface INegateKeyword {
  /** 此 id 为 searchTerm 列表(IAdSearchTerm)中的 id，用于查找 */
  id: API.IAdSearchTerm['id'];
  camId: API.IAdSearchTerm['camId'];
  groupId: API.IAdSearchTerm['groupId'];
  groupName: API.IAdSearchTerm['groupName'];
  matchType: API.IAdSearchTerm['matchType'] | 'negativeExact' | 'negativePhrase';
  /* 投放失败后的提示 */
  errorMsg?: string;
  /* 投放成功后的提示 */
  successMsg?: string;
  /* 投放列表的关键词等于 searchTerm 列表的搜索词 */
  keywordText: API.IAdSearchTerm['queryKeyword'];
}

// 投放弹窗的关键词信息
export interface IPutKeyword extends INegateKeyword {
  campaignTargetType: API.IAdSearchTerm['campaignTargetType'];
  queryKeywordType: API.IAdSearchTerm['queryKeywordType'];
  matchType: API.IAdSearchTerm['matchType'];
  // 除基本信息和否定相同外，增加建议竞价和竞价
  /** 投放词的建议竞价 */
  suggested: number;
  suggestedRangeStart: number;
  suggestedRangeEnd: number;
  bid: API.IAdSearchTerm['groupBid'];
}

const SearchTerm: React.FC = function() {
  const dispatch = useDispatch();
  // 店铺
  const {
    id: currentShopId, currency, marketplace,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  // loading
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    table: loadingEffect['adManage/fetchSearchTermList'],
    suggestedBid: loadingEffect['adManage/fetchQueryKeywordSuggestedBid'],
    putCampaignList: loadingEffect['adManage/fetchUsablePutCampaignList'],
    putGroupList: loadingEffect['adManage/fetchUsablePutGroupList'],
    negateCampaignList: loadingEffect['adManage/fetchUsableNegateCampaignList'],
    negateGroupList: loadingEffect['adManage/fetchUsableNegateGroupList'],
  };
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    treeSelectedInfo: {
      campaignId: treeSelectedCampaignId,
      groupId: treeSelectedGroupId,
    },
    searchTermTab: { 
      list,
      searchParams,
      checkedIds,
      putKeywords,
      negateKeywords,
      customCols,
      filtrateParams,
      usablePutCampaignList,
      usableNegateCampaignList,
    },
  } = adManage;
  const { total, records, dataTotal } = list;
  const { current, size, sort, order } = searchParams;
  // 投放词和搜索词输入框
  const [keywordTextValue, setKeywordTextValue] = useState<string>('');
  const [queryKeywordValue, setQueryKeywordValue] = useState<string>('');
  // ASIN input value
  const [asinKeyword, setAsinKeyword] = useState<string>('');
  // 弹窗
  const [visibleFiltrate, setVisibleFiltrate] = useState<boolean>(false);
  const [visiblePut, setVisiblePut] = useState<boolean>(false);
  const [visibleNegate, setVisibleNegate] = useState<boolean>(false);
  // 投放词联想
  const [keywordTextOptions, setKeywordTextOptions] = useState<{ value: string }[]>([]);
  const [queryKeywordOptions, setQueryKeywordOptions] = useState<{ value: string }[]>([]);
  // 日期选择器
  const calendarStorageBaseKey = 'adSearchTermCalendar';
  const [calendarDefaultKey, setCalendarDefaultKey] = useState<string>(
    storage.get(`${calendarStorageBaseKey}_dc_itemKey`) || '30'
  );
  
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
        type: 'adManage/fetchSearchTermList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { current: 1 },
          filtrateParams: params,
        },
        callback: requestErrorFeedback,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShopId, treeSelectedCampaignId, treeSelectedGroupId]);

  useEffect(() => {
    // 打开投放/否定弹窗时，生成 putKeywords/negateKeywords
    if (visiblePut || visibleNegate) {
      dispatch({
        type: 'adManage/updateSearchTermChecked',
        payload: checkedIds,
      });
    }
    // 初始化 usablePutCampaignList 和 usableNegateCampaignList
    const putCampaignList: { id: string; name: string }[] = [];
    const negateCampaignList: { id: string; name: string }[] = [];
    records.forEach(item => {
      negateCampaignList.push({
        id: item.camId,
        name: item.camName,
      });
      // 投放词不提供自动广告活动选择
      item.campaignTargetType === 'manual' && putCampaignList.push({
        id: item.camId,
        name: item.camName,
      });
    });
    dispatch({
      type: 'adManage/saveUsablePutCampaignList',
      payload: putCampaignList,
    });
    dispatch({
      type: 'adManage/saveUsableNegateCampaignList',
      payload: negateCampaignList,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, records, visiblePut, visibleNegate]);

  // 打开投放弹窗时获取建议竞价
  useEffect(() => {
    visiblePut && dispatch({
      type: 'adManage/fetchQueryKeywordSuggestedBid',
      payload: {
        headersParams: { StoreId: currentShopId },
        keywords: putKeywords,
      },
      callback: requestErrorFeedback,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiblePut]);

  // 全部投放或否定成功后关闭弹窗
  useEffect(() => {
    if (checkedIds.length === 0) {
      setVisiblePut(false);
      setVisibleNegate(false);
    }
  }, [checkedIds]);

  // 执行搜索
  function handleSearch(
    params: { keywordText: string; queryKeyword: string; asinKeyword: string }
  ) {
    const { keywordText, queryKeyword, asinKeyword } = params;
    dispatch({
      type: 'adManage/fetchSearchTermList',
      payload: {
        headersParams: { StoreId: currentShopId },
        filtrateParams: {
          // 重置筛选参数
          ...defaultFiltrateParams,
          keywordText,
          queryKeyword,
          asinKeyword,
        },
      },
      callback: requestErrorFeedback,
    });
  }

  // 执行筛选
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleFiltrate(values: { [key: string]: any }) {
    setVisibleFiltrate(false);
    dispatch({
      type: 'adManage/fetchSearchTermList',
      payload: {
        headersParams: { StoreId: currentShopId },
        filtrateParams: { ...values },
        searchParams: { current: 1 },
      },
      callback: requestErrorFeedback,
    });
  }

  // 投放词输入 change
  function handleKeywordTextInputChange(value: string) {
    setKeywordTextValue(value);
  }

  // 搜索词输入 chenge
  function handleQueryKeywordInputChange(value: string) {
    setQueryKeywordValue(value);
  }

  // 搜索搜索词和投放词
  function handleKeywordSearch(_: string, event: any) {
    // 点击清空按钮时，不执行搜索
    if (event.currentTarget.tagName === 'INPUT' && event.currentTarget.value === '') {
      return;
    }
    setAsinKeyword('');
    handleSearch({
      keywordText: keywordTextValue,
      queryKeyword: queryKeywordValue,
      asinKeyword: '',
    });
  }

  // 获取联想词
  function getKeywordAssociate(value: string, type: 'keywordText' | 'queryKeyword') {
    value.trim() && dispatch({
      type: 'adManage/fetchKeywordAssociate',
      payload: {
        headersParams: { StoreId: currentShopId },
        keywordText: value,
      },
      callback: (code: number, msg: string, data?: string[]) => {
        requestErrorFeedback(code, msg);
        const setStateDict = {
          keywordText: setKeywordTextOptions,
          queryKeyword: setQueryKeywordOptions,
        };
        data && setStateDict[type](data.map(item => {
          return { value: item };
        }));
      },
    });
  }

  // 搜索 ASIN
  function handleAsinSearch(_: string, event: any) {
    // 点击清空按钮时，不执行搜索
    if (event.currentTarget.tagName === 'INPUT' && event.currentTarget.value === '') {
      return;
    }
    setKeywordTextValue('');
    setQueryKeywordValue('');
    handleSearch({
      keywordText: '',
      queryKeyword: '',
      asinKeyword,
    });
  }

  // 展开/收起筛选器
  function handleClickFiltrate() {
    setVisibleFiltrate(!visibleFiltrate);
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

  // 日期 change
  function handleRangeChange(dates: DefinedCalendar.IChangeParams) {
    const { selectItemKey } = dates;
    setCalendarDefaultKey(selectItemKey);
    dispatch({
      type: 'adManage/fetchSearchTermList',
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: { current: 1 },
        filtrateParams: getDefinedCalendarFiltrateParams(dates),
      },
      callback: requestErrorFeedback,
    });
  }

  // 投放弹窗点击展开选择广告活动时 获取可供选择的广告活动
  function getUsablePutCampaignList() {
    dispatch({
      type: 'adManage/fetchUsablePutCampaignList',
      payload: {
        headersParams: { StoreId: currentShopId },
      },
      callback: requestErrorFeedback,
    });
  }

  // 投放弹窗点击展开选择广告组时 获取可供选择的广告组
  function getUsablePutGroupList(camId: string, searchTermId: string,) {
    // 当前选中的广告活动为自动广告活动时，不获取广告组 (初始状态下的广告活动有可能是自动广告组)
    const putKeyword = putKeywords.find(item => item.id === searchTermId);
    if (putKeyword?.campaignTargetType === 'auto') {
      return;
    }
    const campaign = usablePutCampaignList.find(item => item.id === camId);
    !(campaign?.groupList && campaign?.groupList.length) && dispatch({
      type: 'adManage/fetchUsablePutGroupList',
      payload: {
        headersParams: { StoreId: currentShopId },
        camId,
      },
      callback: requestErrorFeedback,
    });
  }

  // 否定弹窗点击展开选择广告活动时 获取可供选择的广告活动
  function getUsableNegateCampaignList() {
    dispatch({
      type: 'adManage/fetchUsableNegateCampaignList',
      payload: {
        headersParams: { StoreId: currentShopId },
      },
      callback: requestErrorFeedback,
    });
  }

  // 否定弹窗点击展开选择广告组时 获取可供选择的广告组
  function getUsableNegateGroupList(camId: string) {
    const campaign = usableNegateCampaignList.find(item => item.id === camId);
    !(campaign?.groupList && campaign?.groupList.length) && dispatch({
      type: 'adManage/fetchUsableNegateGroupList',
      payload: {
        headersParams: { StoreId: currentShopId },
        camId,
      },
      callback: requestErrorFeedback,
    });
  }

  // 投放词修改信息(参数中必须包含 id)
  function modifyPutKeywordInfo(
    params: { id: string; [key: string]: string | number | string[] },
    // 是否需要更新建议竞价，如为 true，则 params 中需要包含请求建议竞价所需的参数
    refreshSuggestedBid = false
  ) {
    dispatch({
      type: 'adManage/updateSearchTermPutKeywords',
      payload: params,
    });
    // 获取建议竞价
    if (refreshSuggestedBid) {
      const { id, groupId, matchType, keywords } = params;
      dispatch({
        type: 'adManage/fetchQueryKeywordSuggestedBid',
        payload: {
          headersParams: { StoreId: currentShopId },
          id,
          groupId,
          matchType,
          keywords,
        },
        callback: requestErrorFeedback,
      });
    }
  }

  // 否定词修改信息(参数中必须包含 id)
  function modifyNegateKeywordInfo(params: { id: string; [key: string]: string | number }) {
    dispatch({
      type: 'adManage/updateSearchTermNegateInfo',
      payload: params,
    });
  }

  // 获取投放可用的广告组选择下拉框的内容
  function renderPutGroupOptions(
    camId: string, searchTermId: string, initialPutKeyword: IPutKeyword
  ) {
    // 若默认的广告活动是自动广告活动，则不提供广告组选择
    const putKeyword = putKeywords.find(item => item.id === searchTermId);
    if (putKeyword?.campaignTargetType === 'auto') {
      return <Option key="" value="">无</Option>;
    }
    const groupList = usablePutCampaignList.find(cam => cam.id === camId)?.groupList;
    if (groupList && groupList.length > 0) {
      return (
        <>
          <Option key="" value="">无</Option>
          {
            groupList.map(item => (
              <Option key={item.id} value={item.id}>{item.name}</Option>)
            )
          }
        </>
      );
    }
    return (
      <>
        <Option key="" value="">无</Option>
        <Option
          key={initialPutKeyword.id}
          value={initialPutKeyword.groupId}
        >
          { initialPutKeyword.groupName }
        </Option>
      </>
    );
  }

  // 获取否定可用的广告组选择下拉框的内容
  function renderNegateGroupOptions(camId: string, initialNegateKeyword: INegateKeyword) {
    const groupList = usableNegateCampaignList.find(cam => cam.id === camId)?.groupList;
    if (groupList && groupList.length > 0) {
      return (
        <>
          <Option key="" value="">无</Option>
          {
            groupList.map(item => (
              <Option key={item.id} value={item.id}>{item.name}</Option>)
            )
          }
        </>
      );
    }
    return (
      <>
        <Option key="" value="">无</Option>
        <Option
          key={initialNegateKeyword.id}
          value={initialNegateKeyword.groupId}
        >
          { initialNegateKeyword.groupName }
        </Option>
      </>
    );
  }

  // 投放关键词
  function handlePut(keywords?: IPutKeyword[]) {
    const keywordTexts = keywords || putKeywords;
    dispatch({
      type: 'adManage/putQueryKeywords',
      payload: {
        headersParams: { StoreId: currentShopId },
        keywordTexts,
      },
      callback: requestFeedback,
    });
  }

  // 否定关键词
  function handleNegate(keywords?: INegateKeyword[]) {
    const neKeywords = keywords || negateKeywords;
    dispatch({
      type: 'adManage/putNegateQueryKeywords',
      payload: {
        headersParams: { StoreId: currentShopId },
        neKeywords,
      },
      callback: requestFeedback,
    });
  }

  // 匹配方式下拉框
  const matchTypeOptions = (
    <>
      {
        Object.keys(matchTypeDict).map(key => (
          <Option key={key} value={key}>{matchTypeDict[key]}</Option>)
        )
      }
    </>
  );

  // 投放可用的广告活动选择下拉框
  const usablePutCampaignOptions = (
    <>
      {
        usablePutCampaignList.map(item => (
          <Option key={item.id} value={item.id}>{item.name}</Option>)
        )
      }
    </>
  );

  // 否定可用的广告活动选择下拉框
  const usableNegateCampaignOptions = (
    <>
      {
        usableNegateCampaignList.map(item => (
          <Option key={item.id} value={item.id}>{item.name}</Option>)
        )
      }
    </>
  );

  // 全部列
  const allColumns: ColumnProps<API.IAdSearchTerm>[] = [
    {
      title: '搜索词',
      children: [
        {
          title: '合计',
          dataIndex: 'queryKeyword',
          key: 'queryKeyword',
          width: 260,
          fixed: 'left',
          render: (value: string, record: API.IAdSearchTerm) => {
            const { queryKeywordType } = record;
            if (queryKeywordType) {
              // 如果是 asin 
              return (
                <a
                  title={value}
                  href={getAmazonAsinUrl(value, marketplace)}
                  target="_blank"
                  rel="noopener noreferrer"
                >{ value }</a>
              );
            }
            // 区分搜索词中 listing 未包含的新单词
            return (
              <>
                {
                  record.existQueryKeyword?.map(item => (
                    item.exist 
                      ? `${item.keyword} ` 
                      : <span key={item.keyword} className={styles.exclusion}>{item.keyword} </span>
                  ))
                }
              </>
            );
          },
        },
      ] as any,
    }, 
    {
      title: <>投放状态<Iconfont className={commonStyles.iconQuestion} type="icon-yiwen" title="同一广告组是否已投放此搜索词" /></>,
      key: 'deliveryStatus',
      children: [
        {
          dataIndex: 'deliveryStatus',
          key: 'deliveryStatus',
          align: 'center',
          width: 80,
          render: (value: string) => value === 'alreadyLive' ? <Iconfont type="icon-dui" /> : null,
        },
      ] as any,
    },
    {
      title: '投放词',
      key: 'keywordText',
      children: [
        {
          dataIndex: 'keywordText',
          key: 'keywordText',
          width: 260,
          render: (value: string) => value ? <a target="_blank">{value}</a> : '——',
        },
      ] as any,
    },
    {
      title: '匹配方式',
      key: 'matchType',
      align: 'center',
      children: [
        {
          dataIndex: 'matchType',
          key: 'matchType',
          align: 'center',
          width: 80,
          render: (value: string) => {
            value ? matchTypeDict[value] : '——';
          },
        },
      ] as any,
    },
    {
      title: '广告活动',
      children: [
        {
          dataIndex: 'camId',
          width: 220,
          render: (_: string, record: API.IAdSearchTerm) => (
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
          width: 220,
          render: (_: string, record: API.IAdSearchTerm) => (
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
          width: 88,
          align: 'center',
          fixed: 'right',
          render: (_: undefined, record: API.IAdSearchTerm) => (
            <>
              <Button
                type="link"
                className={commonStyles.tableOperationBtn}
                onClick={() => {
                  dispatch({
                    type: 'adManage/updateSearchTermChecked',
                    payload: [record.id],
                  });
                  setVisibleNegate(true);
                }}
              >
                否定
              </Button>
              <Button
                type="link"
                disabled={record.queryKeywordType}
                className={commonStyles.tableOperationBtn}
                onClick={() => {
                  dispatch({
                    type: 'adManage/updateSearchTermChecked',
                    payload: [record.id],
                  });
                  setVisiblePut(true);
                }}
              >
                投放
              </Button>
            </>
          ),
        },
      ] as any,
    },
  ];

  // 所需列
  const columns: ColumnProps<API.IAdSearchTerm>[] = useMemo(() => {
    return getTableColumns(allColumns, !treeSelectedCampaignId, !treeSelectedGroupId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeSelectedCampaignId, treeSelectedGroupId, list, searchParams]);

  // 投放弹窗列
  const putColumns: ColumnProps<IPutKeyword>[] = [
    {
      title: '关键词',
      dataIndex: 'keywordText',
      width: 200,
    }, {
      title: '广告活动',
      dataIndex: 'camId',
      width: 280,
      render: (value, record) => (
        <Select
          placeholder="请选择"
          size="small"
          className={styles.tableSelect}
          bordered={false}
          loading={loading.putCampaignList}
          dropdownMatchSelectWidth={false}
          // defaultValue={record.campaignTargetType === 'manual' ? value : undefined}
          value={record.campaignTargetType === 'manual' ? value : undefined}
          listHeight={280}
          onChange={camId => {
            // groupId: undefined 重置广告组，只能用 undefined，用空字符串不能正确显示
            modifyPutKeywordInfo({
              id: record.id,
              camId,
              groupId: undefined as any,
              // 切换后广告活动的类型必定为手动，因为只提供手动广告活动以选择(修改为手动，以免广告组下拉框不渲染)
              campaignTargetType: 'manual',
            });
          }}
          onDropdownVisibleChange={
            // 请求可用的广告活动
            isOpen => isOpen && getUsablePutCampaignList()
          }
        >
          { usablePutCampaignOptions }
        </Select>
      ),
    }, {
      title: '广告组',
      dataIndex: 'groupId',
      width: 280,
      render: (value, record) => {
        return (
          <Select
            placeholder="请选择"
            size="small"
            className={styles.tableSelect}
            loading={loading.putGroupList}
            bordered={false}
            dropdownMatchSelectWidth={false}
            value={record.campaignTargetType === 'manual' ? value : undefined}
            listHeight={330}
            onChange={groupId => {
              // 修改广告组后，修改竞价为修改后的广告组的默认竞价
              const campaign = usablePutCampaignList.find(item => item.id === record.camId);
              const group = campaign?.groupList.find(item => item.id === groupId) as API.IAdGroup;
              const bid = group?.defaultBid;
              modifyPutKeywordInfo({
                id: record.id,
                groupId,
                keywords: [record.keywordText],
                bid,
              }, true);
            }}
            onDropdownVisibleChange={
              isOpen => isOpen && getUsablePutGroupList(record.camId, record.id)
            }
          >
            { renderPutGroupOptions(record.camId, record.id, record) }
          </Select>);
      },
    }, {
      title: '匹配方式',
      dataIndex: 'matchType',
      align: 'center',
      width: 100,
      render: (value, record) => (
        <Select
          size="small"
          className={styles.tableSelect}
          bordered={false}
          defaultValue={value}
          value={value}
          listHeight={330}
          onChange={matchType => {
            modifyPutKeywordInfo({
              matchType,
              id: record.id,
              groupId: record.groupId,
              keywords: [record.keywordText],
            }, true);
          }}
        >
          { matchTypeOptions }
        </Select>
      ),
    }, {
      title: '建议竞价',
      dataIndex: 'suggested',
      align: 'center',
      width: 130,
      render: (value, record) => (
        <Spin spinning={loading.suggestedBid} size="small">
          <div className={commonStyles.suggested}>
            {getShowPrice(value, marketplace, currency)}
            <Button onClick={
              () => modifyPutKeywordInfo({ bid: record.suggested, id: record.id })
            }>应用</Button>
          </div>
          <div>
            ({getShowPrice(record.suggestedRangeStart, marketplace, currency)}
            -
            {getShowPrice(record.suggestedRangeEnd, marketplace, currency)})
          </div>
        </Spin>
      ),
    }, {
      title: '竞价',
      align: 'center',
      key: 'bid',
      dataIndex: 'bid',
      width: 100,
      render: (value, record) => (
        editable({
          inputValue: getShowPrice(value),
          formatValueFun: strToMoneyStr,
          maxLength: 10,
          prefix: currency,
          ghostEditBtn: true,
          confirmCallback: value => {
            const [isValid, minBid] = isValidKeywordBid(Number(value), marketplace);
            if (isValid) {
              modifyPutKeywordInfo({ id: record.id, bid: value });
            } else {
              message.error(`竞价不能低于${minBid}`);
            }
          },
        })
      ),
    }, {
      title: '操作',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <>
          <Button
            type="link"
            className={classnames(styles.operationBtn, styles.deleteBtn)}
            onClick={() => {
              const keywordList = [...putKeywords];
              const index = keywordList.findIndex((item) => item.id === record.id);
              keywordList.splice(index, 1);
              dispatch({
                type: 'adManage/saveSearchTermPutKeywords',
                payload: keywordList,
              });
            }}
          >删除</Button>
          <Button
            type="link"
            className={styles.operationBtn}
            onClick={() => {
              handlePut([record]);
            }}
          >投放</Button>
          <div className={styles.errorMsg}>
            {record.errorMsg}
          </div>
          <div className={styles.successMsg}>
            {record.successMsg}
          </div>
        </>
      ),
    },
  ];

  // 否定弹窗列
  const negateColumns: ColumnProps<INegateKeyword>[] = [
    {
      title: '关键词',
      // 投放列表的关键词是原列表的搜索词
      dataIndex: 'keywordText',
      width: 200,
    }, {
      title: '广告活动',
      dataIndex: 'camId',
      width: 280,
      render: (value, record) => (
        <Select
          size="small"
          className={styles.tableSelect}
          bordered={false}
          loading={loading.negateCampaignList}
          dropdownMatchSelectWidth={false}
          value={value}
          listHeight={330}
          onChange={camId => {
            // groupId: undefined 重置广告组，只能用 undefined，用空字符串不能正确显示
            modifyNegateKeywordInfo({ id: record.id, camId, groupId: undefined as any });
            // 再请求广告组
          }}
          onDropdownVisibleChange={
            isOpen => isOpen && getUsableNegateCampaignList()
          }
        >
          { usableNegateCampaignOptions }
        </Select>
      ),
    }, {
      title: '广告组',
      dataIndex: 'groupId',
      width: 280,
      render: (value, record) => (
        <Select
          placeholder="请选择"
          size="small"
          className={styles.tableSelect}
          loading={loading.negateGroupList}
          bordered={false}
          dropdownMatchSelectWidth={false}
          defaultValue={value}
          value={value}
          listHeight={330}
          onChange={groupId => {
            modifyNegateKeywordInfo({ id: record.id, groupId });
          }}
          onDropdownVisibleChange={
            isOpen => isOpen && getUsableNegateGroupList(record.camId)
          }
        >
          { renderNegateGroupOptions(record.camId, record) }
        </Select>
      ),
    }, {
      title: '匹配方式',
      dataIndex: 'matchType',
      width: 100,
      render: (value, record) => (
        <Select
          size="small"
          className={styles.tableSelect}
          bordered={false}
          defaultValue="negativeExact"
          value={value}
          listHeight={330}
          onChange={matchType => {
            modifyNegateKeywordInfo({ id: record.id, matchType });
          }}
        >
          <Option key="negativeExact" value="negativeExact">精准否定</Option>
          <Option key="negativePhrase" value="negativePhrase">词组否定</Option>
        </Select>
      ),
    }, {
      title: '操作',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <>
          <Button
            type="link"
            className={classnames(styles.operationBtn, styles.deleteBtn)}
            onClick={() => {
              const keywordList = [...negateKeywords];
              const index = keywordList.findIndex((item) => item.id === record.id);
              keywordList.splice(index, 1);
              dispatch({
                type: 'adManage/saveSearchTermNegateKeywords',
                payload: keywordList,
              });
            }}
          >删除</Button>
          <Button
            type="link"
            className={styles.operationBtn}
            onClick={() => {
              handleNegate([record]);
            }}
          >否定</Button>
          <div className={styles.errorMsg}>
            {record.errorMsg}
          </div>
          <div className={styles.successMsg}>
            {record.successMsg}
          </div>
        </>
      ),
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
    fetchListActionType: 'adManage/fetchSearchTermList',
    checkedChangeActionType: 'adManage/updateSearchTermChecked',
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
        type: 'adManage/fetchSearchTermList',
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
        type: 'adManage/fetchSearchTermList',
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
    <div className={styles.page}>
      <div className={classnames(commonStyles.head, styles.head)}>
        <AutoComplete
          allowClear
          className={styles.Input}
          value={keywordTextValue}
          options={keywordTextOptions}
          placeholder="搜索投放词"
          onSearch={value => getKeywordAssociate(value, 'keywordText')}
          onSelect={handleKeywordTextInputChange}
          onChange={handleKeywordTextInputChange}
        />
        <AutoComplete
          className={styles.Search}
          value={queryKeywordValue}
          options={queryKeywordOptions}
          onSearch={value => getKeywordAssociate(value, 'queryKeyword')}
          onSelect={handleQueryKeywordInputChange}
          onChange={handleQueryKeywordInputChange}
        >
          <Input.Search
            allowClear
            placeholder="搜索搜索词"
            enterButton={<Iconfont type="icon-sousuo" className={styles.enterButton} />}
            onSearch={handleKeywordSearch}
          />
        </AutoComplete>
        <Search
          allowClear
          enterButton={<Iconfont type="icon-sousuo" className={styles.enterButton} />}
          className={styles.Search}
          value={asinKeyword}
          onChange={e => setAsinKeyword(e.target.value)}
          placeholder="搜索ASIN,找到ASIN相关的搜索词"
          onSearch={handleAsinSearch}
        />
        <Button
          type="primary"
          className={commonStyles.btnFiltrate}
          onClick={handleClickFiltrate}
        >
          高级筛选 { visibleFiltrate ? <UpOutlined /> : <DownOutlined /> }
        </Button>
        <div className={classnames(styles.batchBtnContainer, !checkedIds.length ? styles.disabled : '')}>
          <Button onClick={() => setVisiblePut(true)}>批量投放</Button>
          <Button onClick={() => setVisibleNegate(true)}>批量否定</Button>
        </div>
        <ContainTitleSelect
          title="投放状态"
          value={filtrateParams.deliveryStatus}
          options={[
            { value: 'alreadyLive', element: '已投放' },
            { value: 'noAlready', element: '未投放' },
          ]}
          changeCallback={(deliveryStatus: string) => handleFiltrate({ deliveryStatus })}
        />
      </div>
      {/* 高级筛选和面包屑 */}
      { visibleFiltrate ? <Filtrate { ...filtrateProps } /> : <Crumbs { ...crumbsProps } /> }
      <div className={classnames(commonStyles.tableToolBar, styles.tableToolBar)}>
        <span className={styles.tips}>
          <Iconfont type="icon-tishi2" className={styles.iconTips} />
          红色是该广告组的listing未包含的新单词
        </span>
        <div>
          <DefinedCalendar 
            itemKey={calendarDefaultKey}
            storageKey={calendarStorageBaseKey}
            index={1}
            change={handleRangeChange}
            className={commonStyles.DefinedCalendar}
          />
          <CustomCols colsItems={customCols} listType="searchTerm" />
        </div>
      </div>
      <AdManageTable { ...tableProps } />
      <Modal
        visible={visiblePut}
        width={1300}
        keyboard={false}
        footer={false}
        maskClosable={false}
        className={styles.Modal}
        onCancel={() => setVisiblePut(false)}
      >
        <div className={styles.modalContent}>
          <div className={styles.tips}>自动广告组不能投放关键词，请另行选择手动广告组后再投放</div>
          <Table
            rowKey="id"
            dataSource={putKeywords}
            columns={putColumns}
            scroll={{ x: 'max-content', y: '380px' }}
            pagination={false}
            className={styles.Table}
          />
        </div>
        <div className={styles.modalFooter}>
          <Button onClick={() => setVisiblePut(false)}>取消</Button>
          <Button type="primary" disabled={putKeywords.length === 0} onClick={() => handlePut()}>全部投放</Button>
        </div>
      </Modal>
      <Modal
        visible={visibleNegate}
        width={1150}
        keyboard={false}
        footer={false}
        maskClosable={false}
        className={styles.Modal}
        onCancel={() => setVisibleNegate(false)}
      >
        <div className={styles.modalContent}>
          <Table
            rowKey="id"
            dataSource={negateKeywords}
            columns={negateColumns}
            scroll={{ x: 'max-content', y: '380px' }}
            pagination={false}
            className={styles.Table}
          />
        </div>
        <div className={styles.modalFooter}>
          <Button onClick={() => setVisibleNegate(false)}>取消</Button>
          <Button type="primary" disabled={negateKeywords.length === 0} onClick={() => handleNegate()}>全部否定</Button>
        </div>
      </Modal>
    </div>
  );
};

export default SearchTerm;
