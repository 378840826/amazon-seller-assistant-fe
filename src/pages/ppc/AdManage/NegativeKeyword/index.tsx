/**
 *  否定Targeting（否定关键词） 
 *  需要区分广告活动和广告组的否定关键词
 */
import React, { useEffect, ReactText, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Button, Modal, Table, Tabs, Input, message, Radio, Checkbox, Select } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import { negativeMatchTypeDict } from '@/pages/ppc/AdManage';
import ContainTitleSelect from '../components/ContainTitleSelect';
import { Iconfont, requestErrorFeedback, requestFeedback, objToQueryString } from '@/utils/utils';
import MySearch from '../components/Search';
import TableNotData from '@/components/TableNotData';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { INegativeKeyword } from '../index.d';
import { createIdKeyword } from '../utils';
import classnames from 'classnames';
import commonStyles from '../common.less';
import styles from './index.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

// 用于建议否定关键词得匹配方式(非否定方式，请求时需要修改成否定方式的值)，只有两个值
const matchTypeDict: {[key in API.AdKeywordMatchType]?: string} = {
  phrase: '词组',
  exact: '精准',
};

// 投放方式映射到否定方式
const negativeMatchTypeMap = {
  phrase: 'negativePhrase',
  exact: 'negativeExact',
};

const NegativeKeyword: React.FC = function() {
  const dispatch = useDispatch();
  // 店铺 id
  const {
    id: currentShopId,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  // loading
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    table: loadingEffect['adManage/fetchNegativeKeywordList'],
    suggestedKeyword: loadingEffect['adManage/fetchSuggestedNegativeKeywords'],
    addNegativeKeyword: loadingEffect['adManage/addNegativeKeyword'],
  };
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    negativeKeywordTab: { list, searchParams, checkedIds, type },
    treeSelectedInfo,
  } = adManage;
  const { total, records } = list;
  const { current, size, matchType } = searchParams;
  // 添加否定关键词
  const [addState, setAddState] = useState({
    visible: false,
    campaignId: '',
    groupId: '',
    groupDefaultBid: 0,
  });
  // 建议否定关键词
  const [suggestedKeywords, setSuggestedKeywords] = useState<INegativeKeyword[]>([]);
  // 输入的否定关键词和匹配方式
  const [textAreaKeywords, setTextAreaKeywords] = useState({
    text: '',
    matchType: 'exact',
  });
  // 已选否定感觉词
  const [selectedKeywordsList, setSelectedKeywordsList] = useState<INegativeKeyword[]>([]);
  // 已选否定关键词的勾选，形式为 keywordText-matchType，和 Table 的 rowKey 一致
  const [checkedSelectedIds, setCheckedSelectedIds] = useState<string[]>([]);
  // 待选否定关键词的匹配方式,默认全选
  const [candidateMatchTypes, setCandidateMatchType] = useState<API.AdKeywordMatchType[]>([
    'phrase', 'exact', 
  ]);

  useEffect(() => {
    if (currentShopId !== '-1') {
      // 列表
      dispatch({
        type: 'adManage/fetchNegativeKeywordList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { 
            camId: treeSelectedInfo.campaignId,
            groupId: treeSelectedInfo.groupId,
            code: '',
            matchType: undefined,
            current: 1,
          },
          // 区分广告活动和广告组的否定关键词
          type: treeSelectedInfo.groupId ? 'group' : 'campaign',
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId, treeSelectedInfo]);

  // 根据菜单树选中的广告活动或广告组，设置 addState 
  useEffect(() => {
    if (currentShopId !== '-1') {
      const { campaignId, groupId } = treeSelectedInfo;
      setAddState({
        ...addState,
        campaignId: campaignId || '',
        groupId: groupId || '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId, treeSelectedInfo]);

  // 获取建议否定关键词
  useEffect(() => {
    if (currentShopId !== '-1' && addState.campaignId && addState.visible) {
      dispatch({
        type: 'adManage/fetchSuggestedNegativeKeywords',
        payload: {
          headersParams: { StoreId: currentShopId },
          campaignId: addState.campaignId,
          groupId: addState.groupId,
          // 区分广告活动和广告组的否定关键词
          type: addState.groupId ? 'group' : 'campaign',
        },
        callback: (code: number, msg: string, data: INegativeKeyword[]) => {
          requestErrorFeedback(code, msg);
          setSuggestedKeywords(data);
        },
      });
      // 切换广告组后清空已选表格
      setSelectedKeywordsList([]);
    }
  }, [dispatch, currentShopId, addState]);

  // 批量归档
  function handleBatchArchive() {
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
          type: 'adManage/batchNegativeKeywordArchive',
          payload: {
            headersParams: { StoreId: currentShopId },
            neKeywordIds: checkedIds,
            type,
            groupId: treeSelectedInfo.groupId,
            camId: treeSelectedInfo.campaignId,
          },
          callback: requestFeedback,
        });
      },
    });
  }

  // 执行搜索和筛选
  function handleSearch(params: {[key in 'code' | 'matchType']?: string}) {
    dispatch({
      type: 'adManage/fetchNegativeKeywordList',
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: {
          ...params,
          current: 1,
        },
        type,
      },
      callback: requestErrorFeedback,
    });
  }

  // 全部表格列
  const columns: ColumnProps<API.IAdNegativeKeyword>[] = [
    {
      title: '否定关键词',
      dataIndex: 'neKeywordId',
      width: 300,
      render: (_, record) => (
        <div className={styles.keywordText}>{record.keywordText}</div>
      ),
    }, {
      title: '匹配方式',
      dataIndex: 'matchType',
      align: 'center',
      width: 200,
      render: value => negativeMatchTypeDict[value],
    }, {
      title: <>添加时间<Iconfont className={commonStyles.iconQuestion} type="icon-yiwen" title="北京时间" /></>,
      dataIndex: 'addTime',
      key: 'addTime',
      align: 'center',
      width: 220,
    },
  ];

  // 关键词去重
  function getUniqueKeywordList(list: INegativeKeyword[]) {
    const newList = [];
    const obj = {};
    for (let i = 0; i < list.length; i++){
      if (!obj[list[i].id as string]){
        newList.push(list[i]);
        obj[list[i].id as string] = true;
      }
    }
    return newList;
  }

  // 选择建议否定关键词
  function handleSelectKeyword(record: INegativeKeyword) {
    const newList = [
      // 加在前面是为了显示在表格第一行
      createIdKeyword(record),
      ...selectedKeywordsList,
    ];
    setSelectedKeywordsList(newList);
  }

  // 全选建议否定关键词
  function handleSelectAllKeyword() {
    // 生成id
    const all = suggestedKeywords.map(keyword => createIdKeyword(keyword));
    // 去重
    const newList = getUniqueKeywordList([...all, ...selectedKeywordsList]);
    setSelectedKeywordsList(newList);
  }

  // 删除已选的关键词
  function handleDeleteKeyword(record: INegativeKeyword) {
    const newList = selectedKeywordsList.filter(item => item.id !== record.id);
    setSelectedKeywordsList(newList);
    // 更新勾选
    const newChecked = checkedSelectedIds.filter(id => id !== record.id);
    setCheckedSelectedIds(newChecked);
  }

  // 表格参数变化
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleTableChange (pagination: any) {
    const { current, pageSize: size } = pagination;
    dispatch({
      type: 'adManage/fetchNegativeKeywordList',
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: { current, size },
        type,
      },
      callback: requestErrorFeedback,
    });
  }

  // 批量删除已选关键词
  function handleBatchDeleteSelectedKeywords() {
    let newList: INegativeKeyword[] = [];
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
    setSelectedKeywordsList(newList);
  }

  // 批量修改已选关键词的匹配方式
  function handleBatchMatchTypeSelectedKeywords(matchType: API.AdKeywordMatchType) {    
    // 按勾选和修改后的匹配方式获取最新的已选词列表
    const newList = [...selectedKeywordsList];
    // 需要同步修改 checkedSelectedKeywords 保证勾选不变
    const newCheckedIds = [...checkedSelectedIds];
    for (let i = 0; i < newList.length; i++) {
      const keyword = newList[i];
      if (checkedSelectedIds.includes(keyword.id as string)) {
        newList[i] = createIdKeyword({ keywordText: keyword.keywordText, matchType });
        // 修改后的关键词+匹配方式 是否存在于建议关键词中
        const suggested = suggestedKeywords.find(kw => createIdKeyword(kw).id === newList[i].id);
        if (suggested) {
          newList[i] = createIdKeyword({ ...suggested, matchType });
        }
      }
      const checkedIdIndex = checkedSelectedIds.findIndex(id => id === keyword.id);
      newCheckedIds.splice(
        checkedIdIndex - 1, 1, createIdKeyword({ ...keyword, matchType }).id as string
      );
    }
    // 判断是否重复
    let unique = true;
    const obj = {};
    for (let i = 0; i < newList.length; i++){
      if (!obj[newList[i].id as string]){
        obj[newList[i].id as string] = true;
      } else {
        unique = false;
        break;
      }
    }
    if (!unique) {
      message.error('关键词和匹配方式不能重复');
      return;
    }
    setSelectedKeywordsList(newList);
    setCheckedSelectedIds(newCheckedIds);
  }

  // 修改已选关键词匹配方式
  function modifyMatchType(record: INegativeKeyword, matchType: API.AdKeywordMatchType) {
    const newKeyword = createIdKeyword({ ...record, matchType });
    const isSelected = selectedKeywordsList.some(item => item.id === newKeyword.id);
    if (isSelected) {
      message.error('已经存在相同的关键词和匹配方式');
      return;
    }
    const newList = [...selectedKeywordsList];
    // 修改后的关键词+匹配方式 是否存在于建议关键词中
    const suggested = suggestedKeywords.find(item => createIdKeyword(item).id === newKeyword.id);
    for (let i = 0; i < newList.length; i++) {
      const keyword = newList[i];
      if (keyword.id === createIdKeyword(record).id) {
        if (suggested) {
          newList[i] = createIdKeyword({ ...suggested, matchType });
        } else {
          newList[i] = createIdKeyword({ keywordText: newList[i].keywordText, matchType });
        }
        break;
      }
    }
    setSelectedKeywordsList(newList);
    // 修改 checkedSelectedKeywords
    const newCheckedIds = [...checkedSelectedIds];
    for (let i = 0; i < newCheckedIds.length; i++) {
      const id = newCheckedIds[i];
      if (createIdKeyword(record).id === id) {
        newCheckedIds[i] = createIdKeyword({ ...record, matchType }).id as string;
        break;
      }
    }
    setCheckedSelectedIds(newCheckedIds);
  }
  
  // 添加选择的否定关键词
  function handleAdd() {
    dispatch({
      type: 'adManage/addNegativeKeyword',
      payload: {
        headersParams: { StoreId: currentShopId },
        negativeKeywords: selectedKeywordsList.map(kw => ({
          camId: addState.campaignId,
          groupId: addState.groupId,
          keywordText: kw.keywordText,
          matchType: negativeMatchTypeMap[kw.matchType as string],
        })),
      },
      callback: (code: number, msg: string, data: INegativeKeyword[]) => {
        const errKw: INegativeKeyword[] = [];
        data.forEach(kw => kw.failMsg && errKw.push(kw));
        requestFeedback(code, msg);
        if (errKw.length) {
          message.warn('部分否定关键词添加失败！');
          return;
        }
        if (code === 200) {
          setTimeout(() => {
            const params = {
              ...treeSelectedInfo,
              tab: 'negativeKeyword',
            };
            window.location.replace(`./manage?${objToQueryString(params)}`);
          }, 1000);
        }
      },
    });
  }

  // 添加输入的否定关键词
  function handleAddTextAreaKeyword() {
    const lineArr = textAreaKeywords.text.split(/\r\n|\r|\n/);
    const keywordArr: INegativeKeyword[] = [];
    for (let i = 0; i < lineArr.length; i++) {
      const line = lineArr[i];
      const kw = line.trim();
      if (kw.length > 80) {
        message.error('关键词不能超过80个字符');
        return;
      }
      kw !== '' && keywordArr.push({
        keywordText: kw,
        matchType: negativeMatchTypeMap[textAreaKeywords.matchType],
      });
    }
    if (keywordArr.length === 0) {
      message.error('请输入否定关键词');
      return;
    }
    dispatch({
      type: 'adManage/addNegativeKeyword',
      payload: {
        headersParams: { StoreId: currentShopId },
        negativeKeywords: keywordArr,
        campaignId: addState.campaignId,
        groupId: addState.groupId,
        type,
      },
      callback: (code: number, msg: string) => {
        requestFeedback(code, msg);
        if (code === 200) {
          setTimeout(() => {
            const params = {
              ...treeSelectedInfo,
              tab: 'negativeKeyword',
            };
            window.location.replace(`./manage?${objToQueryString(params)}`);
          }, 1000);
        }
      },
    });
  }

  // 勾选配置
  const rowSelection = {
    fixed: true,
    selectedRowKeys: checkedIds,
    columnWidth: 36,
    onChange: (selectedRowKeys: ReactText[]) => {
      dispatch({
        type: 'adManage/updateNegativeKeywordChecked',
        payload: selectedRowKeys,
      });
    },
  };

  // 建议否定关键词表格列
  const suggestedKeywordsColumns: ColumnProps<INegativeKeyword>[] = [
    {
      title: '关键词',
      dataIndex: 'keywordText',
      fixed: 'left',
      width: 200,
    }, {
      title: '匹配方式',
      dataIndex: 'matchType',
      align: 'center',
      width: 80,
      render: matchType => matchTypeDict[matchType],
    }, {
      title: '30天Clicks',
      dataIndex: 'clicks',
      align: 'center',
      width: 80,
    }, {
      title: '30天订单量',
      dataIndex: 'orders',
      align: 'center',
      width: 80,
    }, {
      title: '30天转化率',
      dataIndex: 'conversionsRate',
      align: 'center',
      width: 80,
    }, {
      title: '操作',
      dataIndex: '',
      align: 'center',
      fixed: 'right',
      width: 40,
      render: (_, record) => {
        const isSelected = selectedKeywordsList.some(item => (
          // 关键词和匹配方式都匹配才算一条唯一的记录
          item.keywordText === record.keywordText && item.matchType === record.matchType
        ));
        if (isSelected) {
          return <Button type="link" disabled className={styles.keywordSelectItem}>已选</Button>;
        }
        return (
          <Button
            type="link"
            className={classnames(commonStyles.selectBtn, styles.keywordSelectItem)}
            disabled={isSelected}
            onClick={() => handleSelectKeyword(record)}
          >选择</Button>
        );
      },
    },
  ];

  // 已选关键词
  const selectedKeywordsColumns: ColumnProps<INegativeKeyword>[] = [
    {
      title: '关键词',
      dataIndex: 'keywordText',
      width: 200,
    }, {
      title: '匹配方式',
      dataIndex: 'matchType',
      align: 'center',
      width: 80,
      render: (value, record) => (
        <Select
          size="small"
          className={styles.tableSelect}
          bordered={false}
          defaultValue={value}
          value={value}
          listHeight={330}
          onChange={matchType => {
            modifyMatchType(record, matchType);
          }}
        >
          {
            Object.keys(matchTypeDict).map(key => (
              <Option key={key} value={key}>{matchTypeDict[key]}</Option>)
            )
          }
        </Select>
      ),
    }, {
      title: '30天Clicks',
      dataIndex: 'clicks',
      align: 'center',
      width: 80,
      render: value => value || '—',
    }, {
      title: '30天订单量',
      dataIndex: 'orders',
      align: 'center',
      width: 80,
      render: value => value || '—',
    }, {
      title: '30天转化率',
      dataIndex: 'conversionsRate',
      align: 'center',
      width: 80,
      render: value => value || '—',
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

  // 已选否定关键词表格的勾选配置
  const selectedKeywordsRowSelection = {
    fixed: true,
    selectedRowKeys: checkedSelectedIds,
    columnWidth: 36,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (selectedRowKeys: any[]) => {
      setCheckedSelectedIds(selectedRowKeys);
    },
  };

  // 分页器配置
  const paginationProps = {
    current,
    pageSize: size,
    total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => (<>共 {total} 个</>),
  };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <Button type="primary" onClick={() => setAddState({ ...addState, visible: true })}>
          添加否定关键词
        </Button>
        <Button disabled={!checkedIds.length} onClick={() => handleBatchArchive()}>归档</Button>
        <MySearch placeholder="输入否定关键词" defaultValue="" handleSearch={val => handleSearch({ code: val })} />
        匹配方式:
        <Radio.Group onChange={e => handleSearch({ matchType: e.target.value })} value={matchType}>
          <Radio value={undefined}>不限</Radio>
          {
            Object.keys(negativeMatchTypeDict).map(key => (
              <Radio key={key} value={key}>{negativeMatchTypeDict[key]}</Radio>
            ))
          }
        </Radio.Group>
      </div>
      <div className={styles.tableContainer}>
        <Table
          size="middle"
          showSorterTooltip={false}
          rowSelection={{ ...rowSelection }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 290px)', scrollToFirstRowOnChange: true }}
          loading={loading.table}
          columns={columns}
          rowKey="neKeywordId"
          dataSource={records}
          locale={{ emptyText: <TableNotData style={{ padding: 50 }} hint="没有找到相关数据" /> }}
          pagination={{ ...paginationProps, size: 'default' }}
          onChange={handleTableChange}
        />
      </div>
      <Modal
        visible={addState.visible}
        width={1240}
        keyboard={false}
        footer={false}
        maskClosable={false}
        className={classnames(styles.Modal, commonStyles.addModal)}
        onCancel={() => setAddState({ ...addState, visible: false })}
      >
        <div className={styles.modalContainer}>
          <div className={commonStyles.addModalTitle}>添加否定关键词</div>
          <div className={commonStyles.addModalContent}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="建议否定" key="1">
                <div className={styles.suggestedTables}>
                  <div className={styles.addTableContainer}>
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
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onChange={(values) => setCandidateMatchType(values as any)}
                        />
                      </div>
                      <span
                        className={classnames(
                          suggestedKeywords.length ? commonStyles.selectBtn : styles.disabled,
                          styles.selectAllBtn
                        )}
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
                      rowKey={record => createIdKeyword(record).id as string}
                      dataSource={suggestedKeywords.filter(
                        kw => candidateMatchTypes.includes(kw.matchType as API.AdKeywordMatchType)
                      )}
                      locale={{ emptyText: '未查询到建议关键词，请重新选择广告组' }}
                      pagination={false}
                    />
                  </div>
                  <div className={styles.addTableContainer}>
                    <div className={classnames(styles.batchToolbar, !checkedSelectedIds.length ? styles.disabled : '')}>
                      <Button onClick={() => handleBatchDeleteSelectedKeywords()}>批量删除</Button>
                      <ContainTitleSelect
                        title="投放方式"
                        value=""
                        options={Object.keys(matchTypeDict).map(key => (
                          { value: key, element: matchTypeDict[key] }
                        ))}
                        changeCallback={value => (
                          handleBatchMatchTypeSelectedKeywords(value as API.AdKeywordMatchType)
                        )}
                      />
                    </div>
                    <Table
                      loading={loading.addNegativeKeyword}
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
                    loading={loading.addNegativeKeyword}
                    onClick={handleAdd}
                  >添加</Button>
                </div>
              </TabPane>
              <TabPane tab="输入关键词" key="2">
                <TextArea
                  placeholder="请输入关键词，每行一个"
                  value={textAreaKeywords.text}
                  className={styles.addTextArea}
                  onChange={e => setTextAreaKeywords({ ...textAreaKeywords, text: e.target.value })}
                />
                <Radio.Group
                  className={styles.inputNegativeKeywordMatchType}
                  onChange={
                    e => setTextAreaKeywords({ ...textAreaKeywords, matchType: e.target.value })
                  }
                  value={textAreaKeywords.matchType}>
                  {
                    Object.keys(matchTypeDict).map(key => (
                      <Radio key={key} value={key}>{matchTypeDict[key]}否定</Radio>
                    ))
                  }
                </Radio.Group>
                <div className={styles.textAreaBtnContainer}>
                  <Button onClick={handleAddTextAreaKeyword}>添加</Button>
                </div>
              </TabPane>
            </Tabs>                
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NegativeKeyword;
