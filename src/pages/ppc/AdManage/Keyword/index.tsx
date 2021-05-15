/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  Keyword 关键词
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Select, Button, Modal, message, Spin, Table, Tabs, Input, Checkbox } from 'antd';
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
import editable from '@/pages/components/EditableCell';
import DefinedCalendar from '@/components/DefinedCalendar';
import Rate from '@/components/Rate';
import { matchTypeDict } from '@/pages/ppc/AdManage';
import {
  Iconfont,
  requestErrorFeedback,
  requestFeedback,
  storage,
  getShowPrice,
  strToMoneyStr,
  getDateCycleParam,
  objToQueryString,
  getPageQuery,
  numberToPercent,
} from '@/utils/utils';
import {
  isArchived,
  getAssignUrl,
  getDefinedCalendarFiltrateParams,
  isValidTargetingBid,
  getBidExprVlaue,
  createIdKeyword,
} from '../utils';
import { UpOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { IKeyword, ISimpleGroup, IComputedBidParams } from '../index.d';
import classnames from 'classnames';
import commonStyles from '../common.less';
import styles from './index.less';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 一次最多添加的关键词数量
const keywordsMaxLimit = 1000;

const Keyword: React.FC = function() {
  const dispatch = useDispatch();
  // 店铺 id
  const {
    id: currentShopId, marketplace, currency,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  // loading
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    table: loadingEffect['adManage/fetchKeywordList'],
    suggestedBid: loadingEffect['adManage/fetchKeywordSuggestedBid'],
    suggestedKeyword: loadingEffect['adManage/fetchSuggestedKeywords'],
    addKeyword: loadingEffect['adManage/addKeyword'],
    fetchGroupList: loadingEffect['adManage/fetchSimpleGroupList'],
    batchSet: loadingEffect['adManage/batchKeyword'],
  };
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    keywordTab: { list, searchParams, filtrateParams, customCols, checkedIds },
    treeSelectedInfo,
    campaignSimpleList,
  } = adManage;
  const { total, records, dataTotal } = list;
  const { current, size, sort, order } = searchParams;
  const { state, matchType, startTime, endTime } = filtrateParams;
  const [visibleFiltrate, setVisibleFiltrate] = useState<boolean>(false);
  // 日期
  const calendarStorageBaseKey = 'adKeywordCalendar';
  const [calendarDefaultKey, setCalendarDefaultKey] = useState<string>(
    storage.get(`${calendarStorageBaseKey}_dc_itemKey`) || '7'
  );
  // 添加关键词弹窗
  const [addState, setAddState] = useState({
    visible: false,
    campaignId: '',
    groupId: '',
    groupDefaultBid: 0,
  });
  // 添加关键词时，提供选择的广告组
  const [groupSimpleList, setGroupSimpleList] = useState<ISimpleGroup[]>([]);
  // 建议关键词
  const [suggestedKeywords, setSuggestedKeywords] = useState<IKeyword[]>([]);
  // 输入的关键词
  const [textAreaKeywords, setTextAreaKeywords] = useState<string>('');
  // 已选关键词
  const [selectedKeywordsList, setSelectedKeywordsList] = useState<IKeyword[]>([]);
  // 已选关键词的勾选，形式为 keywordText-matchType，和 Table 的 rowKey 一致
  const [checkedSelectedIds, setCheckedSelectedIds] = useState<string[]>([]);
  // 待选关键词的匹配方式,默认全选
  const [candidateMatchTypes, setCandidateMatchType] = useState<API.AdKeywordMatchType[]>([
    'broad', 'phrase', 'exact', 
  ]);
  // 数据分析
  const [chartsState, setChartsState] = useState({
    visible: false,
    campaignId: '',
    campaignName: '',
    groupId: '',
    groupName: '',
    keywordId: '',
    keywordName: '',
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
      // 获取 url qs 参数， 是否需要查询关键词，此做法待优化
      const qsParams = getPageQuery();
      const { 
        campaignId, campaignName, groupId, groupName, keywordId, search,
      } = qsParams as { [key: string]: string };
      if (search) {
        window.history.replaceState(null, '', '/ppc/manage');
        setChartsState({
          visible: true,
          campaignId,
          campaignName,
          groupId,
          groupName,
          keywordId,
          keywordName: search,
        });
      }
      dispatch({
        type: 'adManage/fetchKeywordList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { current: 1 },
          filtrateParams: {
            ...params,
            campaignId: treeSelectedInfo.campaignId,
            groupId: treeSelectedInfo.groupId,
            search: qsParams.search,
          },
        },
        callback: requestErrorFeedback,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId]);

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
            callback: (code: number, msg: string, data: ISimpleGroup[]) => {
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

  // 获取建议关键词
  useEffect(() => {
    if (currentShopId !== '-1' && addState.groupId) {
      dispatch({
        type: 'adManage/fetchSuggestedKeywords',
        payload: {
          headersParams: { StoreId: currentShopId },
          campaignId: addState.campaignId,
          groupId: addState.groupId,
        },
        callback: (code: number, msg: string, data: string[]) => {
          requestErrorFeedback(code, msg);
          setSuggestedKeywords(data.map(item => ({ keywordText: item })));
        },
      });
      // 切换广告组后清空已选表格
      setSelectedKeywordsList([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId, addState.groupId]);

  // 修改数据
  function modifyKeyword(params: {[key: string]: string | number}) {
    dispatch({
      type: 'adManage/modifyKeyword',
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
          modifyKeyword({ state, id });
        },
      });
      return;
    }
    modifyKeyword({ state, id });
  }

  // 展开/收起筛选器
  function handleClickFiltrate() {
    setVisibleFiltrate(!visibleFiltrate);
  }

  // 执行筛选
  function handleFiltrate(values: { [key: string]: any }) {
    setVisibleFiltrate(false);
    dispatch({
      type: 'adManage/fetchKeywordList',
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
            type: 'adManage/batchKeyword',
            payload: {
              headersParams: { StoreId: currentShopId },
              keywords: checkedIds.map(id => ({ id, state })),
            },
            callback: requestFeedback,
          });
        },
      });
      return;
    }
    dispatch({
      type: 'adManage/batchKeyword',
      payload: {
        headersParams: { StoreId: currentShopId },
        keywords: checkedIds.map(id => ({ id, state })),
      },
      callback: requestFeedback,
    });
  }

  // 日期 change
  function handleRangeChange(dates: DefinedCalendar.IChangeParams) {
    const { selectItemKey } = dates;
    setCalendarDefaultKey(selectItemKey);
    dispatch({
      type: 'adManage/fetchKeywordList',
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
      type: 'adManage/fetchKeywordList',
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
        type: 'adManage/batchKeyword',
        payload: {
          headersParams: { StoreId: currentShopId },
          keywords: data,
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
      type: 'adManage/batchKeyword',
      payload: {
        headersParams: { StoreId: currentShopId },
        keywords: data,
      },
      callback: requestFeedback,
    });
  }

  // 选择广告活动
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
      callback: (code: number, msg: string, data: ISimpleGroup[]) => {
        requestErrorFeedback(code, msg);
        setGroupSimpleList(data);
      },
    });
  }

  // 选择广告组
  function handleGroupChange(groupId: string) {
    // 默认竞价
    const group = groupSimpleList.find(group => group.id === groupId);
    const groupDefaultBid = group?.defaultBid || 0;
    setAddState({
      ...addState,
      groupId: groupId,
      groupDefaultBid,
    });
  }

  // 添加关键词时的广告活动选择器
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
        onChange={value => handleGroupChange(value)}
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

  /**
   * 获取已选关键词的建议竞价
   * @param records 要获取建议竞价的关键词
   * @param list 已选的关键词
   */
  function getSelectedKeywordsSuggestedBid(records: IKeyword[], list: IKeyword[]) {
    dispatch({
      type: 'adManage/fetchSuggestedKeywordSuggestedBid',
      payload: {
        headersParams: { StoreId: currentShopId },
        keywords: records.map(item => ({
          keywordText: item.keywordText,
          matchType: item.matchType,
          campaignId: addState.campaignId,
          groupId: addState.groupId,
        })),
      },
      callback: (code: number, msg: string, records: IKeyword[]) => {        
        requestErrorFeedback(code, msg);
        const newList = [...list];
        for (let i = 0; i < newList.length; i++) {
          const keywordItem = newList[i];
          for (let j = 0; j < records.length; j++) {
            const resItem = records[j];
            if (
              keywordItem.keywordText === resItem.keywordText &&
              keywordItem.matchType === resItem.matchType
            ) {
              keywordItem.suggested = resItem.suggested;
              keywordItem.rangeStart = resItem.rangeStart;
              keywordItem.rangeEnd = resItem.rangeEnd;
              records.splice(j, 1);
              j--;
              break;
            }
          }
        }
        console.log('newList', newList);
        
        // setSelectedKeywordsList(newList);
      },
    });
  }

  /**
   * 已选关键词应用建议竞价
   * @param keyword 需要应用建议竞价的已选关键词
   */
  function handleSelectedApplySuggestedBid(keyword: IKeyword) {
    const newList = [...selectedKeywordsList];
    for (let i = 0; i < newList.length; i++) {
      const kw = newList[i];
      if ( kw.keywordText === keyword.keywordText && kw.matchType === keyword.matchType) {
        kw.bid = kw.suggested;
      }
    }
    setSelectedKeywordsList(newList);
  }

  // 按匹配方式生成关键词
  function createKeywords(
    stringList: string[] | IKeyword[], types: API.AdKeywordMatchType[], bid: number
  ) {
    const keywordList: IKeyword[] = [];
    stringList.forEach((kw: string | IKeyword) => {
      // 按匹配方式逐个生成
      const ks = types.map(matchType => (createIdKeyword({
        keywordText: typeof kw === 'string' ? kw : kw.keywordText,
        matchType,
        bid,
      })));
      keywordList.push(...ks);
    });
    return keywordList;
  }

  // 关键词去重
  function getUniqueKeywordList(list: IKeyword[]) {
    const newList = [];
    const obj = {};
    for (let i = 0; i < list.length; i++){
      if (!obj[`${list[i].keywordText}-${list[i].matchType}`]){
        newList.push(list[i]);
        obj[`${list[i].keywordText}-${list[i].matchType}`] = true;
      }
    }
    return newList;
  }

  // 选择建议关键词
  function handleSelectKeyword(record: IKeyword) {
    const newList = [
      // 加在前面是为了显示在表格第一行
      createIdKeyword({
        keywordText: record.keywordText,
        matchType: record.matchType,
        bid: addState.groupDefaultBid,
      }),
      ...selectedKeywordsList,
    ];
    if (newList.length > keywordsMaxLimit) {
      message.error('最多添加1000个关键词');
      return;
    }
    setSelectedKeywordsList(newList);
    getSelectedKeywordsSuggestedBid([record], newList);
  }

  // 全选关键词
  function handleSelectAllKeyword() {
    // 按已选匹配方式生成关键词列表
    const all = createKeywords(
      suggestedKeywords, candidateMatchTypes, addState.groupDefaultBid
    );
    // 去重
    const newList = getUniqueKeywordList([...all, ...selectedKeywordsList]);
    if (newList.length > keywordsMaxLimit) {
      message.error('最多添加1000个关键词');
      return;
    }
    setSelectedKeywordsList(newList);
    getSelectedKeywordsSuggestedBid(all, newList);
  }

  // 删除已选的关键词
  function handleDeleteKeyword(record: IKeyword) {
    const newList = selectedKeywordsList.filter(item => {
      // 关键词和匹配方式只要有一个不匹配就不是删除的目标
      return item.id !== record.id;
    });
    setSelectedKeywordsList(newList);
    // 更新勾选
    const newChecked = checkedSelectedIds.filter(id => id !== record.id);
    setCheckedSelectedIds(newChecked);
  }

  // 批量操作已选关键词（删除、应用建议竞价）
  function handleBatchSetSelectedKeywords(type: 'delete' | 'applyBid') {
    let newList: IKeyword[] = [];
    switch (type) {
    case 'delete':
      newList = selectedKeywordsList.filter(item => {
        let result = true;
        for (let i = 0; i < checkedSelectedIds.length; i++) {
          const id = checkedSelectedIds[i];
          if (item.id === id) {
            result = false;
            break;
          }
        }
        return result;
      });
      // 更新勾选
      setCheckedSelectedIds([]);
      break;
    case 'applyBid':
      newList = selectedKeywordsList.map(item => {
        let kw = item;
        checkedSelectedIds.forEach(id => {
          if (item.id === id) {
            kw = { ...item, bid: item.suggested };
          }
        });
        return kw;
      });
      break;
    default:
      console.error('handleBatchSetSelectedKeywords 参数错误');
      break;
    }
    setSelectedKeywordsList(newList);
  }

  // 批量操作已选关键词（批量设置竞价）
  function handleBatchSetSelectedKeywordsBid (exprParams: IComputedBidParams) {
    // 获取计算后的值和id
    const data = getBidExprVlaue({
      marketplace,
      exprParams,
      checkedIds: checkedSelectedIds,
      records: selectedKeywordsList,
    });
    if (data) {
      const newList = [...selectedKeywordsList];
      for (let i = 0; i < data.length; i++) {
        const computationItem = data[i];
        newList.forEach(newItem => {
          if (computationItem.id === newItem.id) {
            newItem.bid = Number(computationItem.bid);
          }
        });
      }
      setSelectedKeywordsList(newList);
      // 用于指定关闭弹窗
      return true;
    }
  }

  // 选择输入的关键词
  function handleSelectTextAreaKeyword() {
    // 需要选择广告组才能获取建议竞价
    if (!addState.groupId) {
      message.error('请先选择广告活动和广告组');
      return;
    }
    const lineArr = textAreaKeywords.split(/\r\n|\r|\n/);
    const keywordTextArr: string[] = [];
    for (let i = 0; i < lineArr.length; i++) {
      const line = lineArr[i];
      const kw = line.trim();
      if (kw.length > 80) {
        message.error('关键词不能超过80个字符');
        return;
      }
      kw !== '' && keywordTextArr.push(kw);
    }
    if (keywordTextArr.length === 0) {
      message.error('请输入关键词');
      return;
    }
    // 按选中的匹配方式生成已选关键词
    const all = createKeywords(keywordTextArr, candidateMatchTypes, addState.groupDefaultBid);
    // 去重
    const newList = getUniqueKeywordList([...all, ...selectedKeywordsList]);
    if (newList.length > keywordsMaxLimit) {
      message.error('最多添加1000个关键词');
      return;
    }
    setSelectedKeywordsList(newList);
    getSelectedKeywordsSuggestedBid(all, newList);
  }

  // 添加关键词
  function handleAdd() {
    if (!addState.campaignId || !addState.groupId) {
      message.error('请选择广告活动和广告组！');
      return;
    }
    dispatch({
      type: 'adManage/addKeyword',
      payload: {
        headersParams: { StoreId: currentShopId },
        keywordList: selectedKeywordsList,
        camId: addState.campaignId,
        groupId: addState.groupId,
      },
      callback: (code: number, msg: string) => {
        requestFeedback(code, msg);
        if (code === 200) {
          setTimeout(() => {
            const params = {
              ...treeSelectedInfo,
              tab: 'keyword',
            };
            window.location.replace(`./manage?${objToQueryString(params)}`);
          }, 1000);
        }
      },
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

  // 建议关键词表格列
  const suggestedKeywordsColumns: ColumnProps<IKeyword>[] = [
    {
      title: '建议关键词',
      dataIndex: 'keywordText',
      width: 240,
    }, {
      title: '匹配方式',
      dataIndex: 'matchType',
      align: 'center',
      width: 100,
      render: () => {
        return candidateMatchTypes.map(type => (
          <div key={type} className={styles.keywordSelectItem}>{matchTypeDict[type]}</div>
        ));
      },
    }, {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 40,
      render: (_, record) => {
        return candidateMatchTypes.map(type => {
          const isSelected = selectedKeywordsList.some(item => (
            // 关键词和匹配方式都匹配才算一条唯一的记录
            item.keywordText === record.keywordText && item.matchType === type
          ));
          if (isSelected) {
            return <Button type="link" key={type} disabled className={styles.keywordSelectItem}>已选</Button>;
          }
          return (
            <Button
              type="link"
              key={type}
              className={classnames(commonStyles.selectBtn, styles.keywordSelectItem)}
              disabled={isSelected}
              onClick={() => handleSelectKeyword({ ...record, matchType: type })}
            >选择</Button>
          );
        });
      },
    },
  ];

  // 已选关键词
  const selectedKeywordsColumns: ColumnProps<IKeyword>[] = [
    {
      title: '关键词',
      dataIndex: 'keywordText',
      width: 240,
    }, {
      title: '匹配方式',
      dataIndex: 'matchType',
      align: 'center',
      width: 100,
      render: value => matchTypeDict[value],
    }, {
      title: '建议竞价',
      dataIndex: 'suggested',
      align: 'center',
      width: 100,
      render: (value, record) => (
        <>
          <div className={commonStyles.suggested}>
            {getShowPrice(value, marketplace, currency)}
            <Button
              disabled={!value}
              onClick={() => handleSelectedApplySuggestedBid(record)}
            >应用</Button>
          </div>
          <div>
            ({getShowPrice(record.rangeStart, marketplace, currency)}
            -
            {getShowPrice(record.rangeEnd, marketplace, currency)})
          </div>
        </>
      ),
    }, {
      title: '竞价',
      dataIndex: 'bid',
      align: 'right',
      width: 100,
      render: (value, record) => (
        editable({
          inputValue: getShowPrice(value),
          formatValueFun: strToMoneyStr,
          maxLength: 10,
          prefix: currency,
          ghostEditBtn: true,
          confirmCallback: newBid => {
            const [isValid, minBid] = isValidTargetingBid(Number(newBid), marketplace);
            if (isValid) {
              const newList = [...selectedKeywordsList];
              const index = newList.findIndex(item => (
                item.keywordText === record.keywordText && item.matchType === record.matchType
              ));
              newList[index].bid = Number(newBid);
              setSelectedKeywordsList(newList);
            } else {
              message.error(`关键词竞价不能低于${minBid}`);
            }
          },
        })
      ),
    }, {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 40,
      render: (_, record) => (
        <Button
          type="link"
          className={commonStyles.deleteBtn}
          onClick={() => handleDeleteKeyword(record)}
        >删除</Button>
      ),
    },
  ];

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
            <Spin spinning={loading.suggestedBid} size="small">
              <div className={commonStyles.suggested}>
                {getShowPrice(value, marketplace, currency)}
                <Button
                  disabled={isArchived(record.state)}
                  onClick={() => applySuggestedBid([record.id])}
                >应用</Button>
              </div>
              <div>
                ({getShowPrice(record.rangeStart, marketplace, currency)}
                -
                {getShowPrice(record.rangeEnd, marketplace, currency)})
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
                    modifyKeyword({ bid: value, id: record.id });
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
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { getShowPrice(value, marketplace, currency) }
              <div><Rate value={record.salesRatio} decimals={2} /></div>
            </>
          ),
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
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { getShowPrice(value, marketplace, currency) }
              <div><Rate value={record.orderNumRatio} decimals={2} /></div>
            </>
          ),
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
          title: getShowPrice(dataTotal.cpc, marketplace, currency),
          dataIndex: 'cpc',
          width: 80,
          align: 'center',
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { getShowPrice(value, marketplace, currency) }
              <div><Rate value={record.cpcRatio} decimals={2} /></div>
            </>
          ),
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
          title: getShowPrice(dataTotal.cpa, marketplace, currency),
          dataIndex: 'cpa',
          width: 80,
          align: 'center',
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { getShowPrice(value, marketplace, currency) }
              <div><Rate value={record.cpaRatio} decimals={2} /></div>
            </>
          ),
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
          title: getShowPrice(dataTotal.spend, marketplace, currency),
          dataIndex: 'spend',
          width: 80,
          align: 'center',
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { getShowPrice(value, marketplace, currency) }
              <div><Rate value={record.spendRatio} decimals={2} /></div>
            </>
          ),
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
          title: numberToPercent(dataTotal.acos),
          dataIndex: 'acos',
          width: 80,
          align: 'center',
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { numberToPercent(value) }
              <div><Rate value={record.acosRatio} decimals={2} /></div>
            </>
          ),
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
          title: dataTotal.roas ? dataTotal.roas.toFixed(2) : '—',
          dataIndex: 'roas',
          align: 'center',
          width: 80,
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { value ? value.toFixed(2) : '—' }
              <div><Rate value={record.roasRatio} decimals={2} /></div>
            </>
          ),
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
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { value }
              <div><Rate value={record.impressionsRatio} decimals={2} /></div>
            </>
          ),
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
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { value }
              <div><Rate value={record.clicksRatio} decimals={2} /></div>
            </>
          ),
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
          title: numberToPercent(dataTotal.ctr),
          dataIndex: 'ctr',
          width: 80,
          align: 'center',
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { numberToPercent(value) }
              <div><Rate value={record.ctrRatio} decimals={2} /></div>
            </>
          ),
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
          title: numberToPercent(dataTotal.conversionsRate),
          dataIndex: 'conversionsRate',
          width: 80,
          align: 'center',
          render: (value: number, record: API.IAdTargeting) => (
            <>
              { numberToPercent(value) }
              <div><Rate value={record.conversionsRateRatio} decimals={2} /></div>
            </>
          ),
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
                keywordId: record.id,
                keywordName: record.keywordName,
              })}
            >
              分析
            </Button>
          ),
        },
      ] as any,
    },
  ];

  // 已选关键词表格的勾选配置
  const selectedKeywordsRowSelection = {
    fixed: true,
    selectedRowKeys: checkedSelectedIds,
    columnWidth: 36,
    onChange: (selectedRowKeys: any[]) => {
      setCheckedSelectedIds(selectedRowKeys);
    },
  };

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
    fetchListActionType: 'adManage/fetchKeywordList',
    checkedChangeActionType: 'adManage/updateKeywordChecked',
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
        type: 'adManage/fetchKeywordList',
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
        type: 'adManage/fetchKeywordList',
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
          匹配方式：
          <Select
            className={styles.matchTypeSelect}
            dropdownClassName={commonStyles.headSelectDropdown}
            defaultValue=""
            value={matchType}
            onChange={matchType => {
              handleFiltrate({ matchType });
            }}
          >
            <Option value="">全部</Option>
            { matchTypeOptions }
          </Select>
        </div>
      </div>
      {/* 高级筛选和面包屑 */}
      { visibleFiltrate ? <Filtrate { ...filtrateProps } /> : <Crumbs { ...crumbsProps } /> }
      <div className={commonStyles.tableToolBar}>
        <div>
          <span>
            <Button type="primary" onClick={() => setAddState({ ...addState, visible: true })}>
              添加关键词<Iconfont type="icon-zhankai" className={commonStyles.iconZhankai} />
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
          <CustomCols colsItems={customCols} listType="keyword" />
        </div>
      </div>
      <AdManageTable { ...tableProps } />
      <DataChartModal
        type="keyword"
        visible={chartsState.visible}
        onCancel={() => setChartsState({ ...chartsState, visible: false })}
        campaignId={chartsState.campaignId}
        campaignName={chartsState.campaignName}
        groupId={chartsState.groupId}
        groupName={chartsState.groupName}
        keywordId={chartsState.keywordId}
        keywordName={chartsState.keywordName}
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
        <div className={styles.modalContainer}>
          <div className={commonStyles.addModalTitle}>添加关键词</div>
          <div className={commonStyles.addModalContent}>
            <div className={commonStyles.addSelectContainer}>
              { renderCampaignSelect() }
              { renderGroupSelect() }
            </div>
            <div className={commonStyles.addTableContainer}>
              <div className={styles.tableContent}>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="建议关键词" key="1">
                    <div className={styles.addToolbar}>
                      <div>
                        匹配方式：
                        <Checkbox.Group
                          value={candidateMatchTypes}
                          options={
                            Object.keys(matchTypeDict).map(key => (
                              { label: matchTypeDict[key], value: key }
                            ))
                          }
                          defaultValue={['Apple']}
                          onChange={(values) => setCandidateMatchType(values as any)}
                        />
                      </div>
                      <span
                        className={classnames(
                          suggestedKeywords.length ? commonStyles.selectBtn : styles.disabled,
                          styles.selectAllBtn
                        )}
                        // onClick={() => handleSelectKeyword({ ...record, matchType: type })}
                        onClick={() => handleSelectAllKeyword()}
                      >
                        全选
                      </span>
                    </div>
                    <Table
                      loading={loading.suggestedKeyword}
                      className={styles.suggestedKeywordTable}
                      columns={suggestedKeywordsColumns}
                      scroll={{ x: 'max-content', y: '350px' }}
                      rowKey="keywordText"
                      dataSource={suggestedKeywords}
                      locale={{ emptyText: '未查询到建议关键词，请重新选择广告组' }}
                      pagination={false}
                    />
                  </TabPane>
                  <TabPane tab="输入关键词" key="2">
                    <div>
                      匹配方式：
                      <Checkbox.Group
                        value={candidateMatchTypes}
                        options={
                          Object.keys(matchTypeDict).map(key => (
                            { label: matchTypeDict[key], value: key }
                          ))
                        }
                        defaultValue={['Apple']}
                        onChange={(values) => setCandidateMatchType(values as any)}
                      />
                    </div>
                    <TextArea
                      placeholder="请输入关键词，每行一个"
                      value={textAreaKeywords}
                      className={styles.addTextArea}
                      onChange={e => setTextAreaKeywords(e.target.value)}
                    />
                    <div className={styles.textAreaBtnContainer}>
                      <Button onClick={handleSelectTextAreaKeyword}>选择</Button>
                    </div>
                  </TabPane>
                </Tabs>                
              </div>
              <div className={styles.tableContent}>
                <div className={classnames(styles.batchToolbar, !checkedSelectedIds.length ? styles.disabled : '')}>
                  <Button onClick={() => handleBatchSetSelectedKeywords('delete')}>批量删除</Button>
                  <Button onClick={() => handleBatchSetSelectedKeywords('applyBid')}>应用建议竞价</Button>
                  <BatchSetBid
                    currency={currency}
                    marketplace={marketplace}
                    callback={handleBatchSetSelectedKeywordsBid}
                  />
                </div>
                <Table
                  loading={loading.addKeyword}
                  className={styles.selectedKeywordTable}
                  columns={selectedKeywordsColumns}
                  scroll={{ x: 'max-content', y: '350px' }}
                  rowKey={record => createIdKeyword(record).id as string}
                  dataSource={selectedKeywordsList}
                  locale={{ emptyText: '请选择建议关键词或手动输入关键词添加' }}
                  pagination={false}
                  rowSelection={selectedKeywordsRowSelection}
                />
              </div>
            </div>
            <div className={commonStyles.addModalfooter}>
              <Button onClick={() => setAddState({ ...addState, visible: false })}>取消</Button>
              <Button 
                type="primary"
                disabled={!selectedKeywordsList.length}
                loading={loading.addKeyword}
                onClick={handleAdd}
              >添加</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Keyword;
