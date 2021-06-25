/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-08 17:19:09
 * 
 * 手动广告组  - 关键词的所有都在这里
 */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { createIdKeyword } from '@/utils/huang';
import { DownOutlined } from '@ant-design/icons';
import { matchTypeDict } from '../config';
import {
  Table,
  Form,
  Button,
  Input,
  Tabs,
  message,
  Dropdown,
  Checkbox,
} from 'antd';
import { useDispatch, ConnectProps, useSelector } from 'umi';
import { ICreateGampaignState } from '../../../models/campaign';
import { FormInstance } from 'antd/lib/form';
import ShowData from '@/components/ShowData';
import EditBox from '../../../components/EditBox';
import BatchSetBidMenu from '../BatchSetBidMenu';

interface IProps {
  form: FormInstance;
  currency: API.Site;
  marketplace: string;
  storeId: number|string;
}

interface IPage extends ConnectProps {
  createGroup: ICreateGampaignState;
}

const { Item } = Form;
const { TabPane } = Tabs;

// 右边已选关键词的勾选的 id 集合
let selectedRowKeys: string[] = [];

// 按匹配方式生成关键词
function createKeywords(
  stringList: string[] | CampaignCreate.IKeyword[], types: string[], bid: number
) {
  const keywordList: CampaignCreate.IKeyword[] = [];
  stringList.forEach((kw: string | CampaignCreate.IKeyword) => {
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

// 关键词去重(同一个关键词+同一个匹配方式=重复)
function getUniqueKeywordList(list: CampaignCreate.IKeyword[]) {
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

const SPManual: React.FC<IProps> = props => {
  const { form, currency, marketplace, storeId } = props;
  const dispatch = useDispatch();
  const selectProducts = useSelector((state: IPage) => state.createGroup.selectProduct);
  
  const [keywordType, setKeyword] = useState<'suggest'|'import'>('suggest'); 
  const [importKeyword, setImportKeyword] = useState<string[]>([]); // 输入关键词内容
  const [batchSetBidVisible, setBatchSetBidVisible] = useState<boolean>(false); // 批量设置建议竞价显隐
  const [matchingVisible, setMatchingVisible] = useState<boolean>(false); // 批量修改匹配方式显隐
  const [loading, setLoading] = useState<boolean>(false); // 左边关键词的loading
  const [keywordHint, setKeywordHint] = useState<string>('请先添加商品'); // 左边表格的提示语 
  // 左边待选建议关键词的匹配方式,默认全选
  const [candidateMatchTypes, setCandidateMatchType] = useState([
    'broad', 'phrase', 'exact', 
  ]);
  // 左边的建议关键词（原始关键词数据）
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  // 右边已选关键词
  const [selectedKeywordsList, setSelectedKeywordsList] = useState<CampaignCreate.IKeyword[]>([]);

  const defaultBidMin = marketplace === 'JP' ? 2 : 0.02;

  // 请求建议关键词
  useEffect(() => {
    const asins: string[] = [];
    selectProducts.forEach(item => asins.push(item.asin));

    if (asins.length === 0) {
      setSuggestedKeywords([]);
      return;
    }

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'createGroup/getKeywords',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: storeId,
          },
          asins,
        },
      });
    }).then(datas => {
      setLoading(false);
      const {
        code,
        message: msg,
        data,
      } = datas as {
        code: number;
        message?: string;
        data?: {
          keywords: string[];
        };
      };

      if (code === 200) {
        setSuggestedKeywords(data?.keywords || []);
        data?.keywords.length ? setKeywordHint('请先添加商品') : setKeywordHint('该模式下没有建议关键词');
        return;
      } 
      message.error(msg);
    });
  }, [dispatch, selectProducts, storeId]); // eslint-disable-line


  // 收集数据
  useEffect(() => {
    const newArray: CreateCampaign.IKeywords[] = [];
    const tem = JSON.stringify(selectedKeywordsList);
    const tem1: CampaignCreate.IKeyword[] = JSON.parse(tem);
    tem1.forEach(item => {
      const obj = {
        keywordText: item.keywordText,
        matchType: item.matchType || '',
        bid: item.bid as number,
      };
      newArray.push(obj);
    });

    dispatch({
      type: 'createGroup/setKeywords',
      payload: newArray,
    });
  }, [dispatch, selectedKeywordsList]);

  // 其它地方隐藏
  useEffect(() => {
    document.addEventListener('click', () => {
      batchSetBidVisible && setBatchSetBidVisible(false);
      matchingVisible && setMatchingVisible(false);
    });
  });

  // base
  let keywordCount = 0;

  // 删除单个关键词
  const deleteItemKeyword = (record: CampaignCreate.IKeyword) => {
    const id = record.id;
    const newList = selectedKeywordsList.filter(item => {
      return item.id !== id;
    });
    setSelectedKeywordsList(newList);
    // 更新勾选
    const index = selectedRowKeys.findIndex(key => key === id);
    selectedRowKeys.splice(index, 1);
  };

  // 修改已选关键词竞价
  const editBoxCallback = (val: number, record: CampaignCreate.IKeyword) => {
    if (val < defaultBidMin) {
      message.error(`竞价不能小于${defaultBidMin}`);
      return Promise.resolve(false);
    }
    const newList = [...selectedKeywordsList];
    const index = newList.findIndex(item => (
      item.keywordText === record.keywordText && item.matchType === record.matchType
    ));
    newList[index].bid = Number(val);
    setSelectedKeywordsList(newList);
    return Promise.resolve(true);
  };

  // 建议关键词全部添加
  const addAllKeyword = () => {
    const defaultBid = form.getFieldValue('defaultBid');
    // 按已选匹配方式生成关键词列表
    const all = createKeywords(suggestedKeywords, candidateMatchTypes, Number(defaultBid));
    // 去重
    const newList = getUniqueKeywordList([...all, ...selectedKeywordsList]);
    setSelectedKeywordsList(newList);
  };

  // 建议关键词单个添加
  function handleSelectKeyword(record: CampaignCreate.IKeyword) {
    const defaultBid = form.getFieldValue('defaultBid');
    if ([undefined, null, ''].includes(defaultBid)) {
      message.error('关键词竞价不能为空，请填写默认竞价');
      return;
    }
    if (Number(defaultBid) < defaultBidMin) {
      message.error(`关键词竞价必须大于等于${defaultBidMin}`);
      return;
    }
    const newList = [
      // 加在前面是为了显示在表格第一行
      createIdKeyword({
        keywordText: record.keywordText,
        matchType: record.matchType,
        bid: Number(defaultBid),
      }),
      ...selectedKeywordsList,
    ];
    setSelectedKeywordsList(newList);
  }

  // 输入关键词添加
  const addImportKeyword = () => {
    if (importKeyword.length === 0) {
      message.error('请输入关键词');
      return;
    }
    const defaultBid = form.getFieldValue('defaultBid');
    if ([undefined, null, ''].includes(defaultBid)) {
      message.error('关键词竞价不能为空，请填写默认竞价');
      return;
    }
    // 按选中的匹配方式生成已选关键词
    const all = createKeywords(importKeyword, candidateMatchTypes, Number(defaultBid));
    // 去重
    const newList = getUniqueKeywordList([...all, ...selectedKeywordsList]);
    setSelectedKeywordsList(newList);
  };

  // 输入关键词改变时、改变添加按钮的状态
  const importChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();
    const keywords = value.split('\n');
    if (value.length === 0) {
      setImportKeyword([]);
      return;
    }

    for (let i = 0; i < keywords.length; i++ ) {
      const item = keywords[i];
      if (item.length > 80) {
        message.error(`第${i + 1}行关键词已超过80个字符`);
        setImportKeyword([]);
        return;
      }
    }

    setImportKeyword([...keywords]);
  };

  // 批量删除
  const batchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warn(`当前选中关键词为${selectedRowKeys.length}个`);
      return;
    }
    message.destroy();
    const newList: CampaignCreate.IKeyword[] = selectedKeywordsList.filter(item => {
      let result = true;
      for (let i = 0; i < selectedRowKeys.length; i++) {
        const id = selectedRowKeys[i];
        if (item.id === id) {
          result = false;
          break;
        }
      }
      return result;
    });
    selectedRowKeys = [];
    setSelectedKeywordsList(newList);
  };

  // 顶部的批量建议竞价
  const batchSuggestBid = () => {
    if (selectedRowKeys.length === 0) {
      message.warn(`当前选中关键词为${selectedRowKeys.length}个`);
      return;
    }

    message.warn('暂无建议竞价');
  };

  // 批量设置竞价确定回调
  const batchsetBidConfire = (data: CreateCampaign.ICallbackDataType) => {
    if (selectedRowKeys.length === 0) {
      message.warn(`当前选中关键词为${selectedRowKeys.length}个`);
      return;
    }
    if (Number(data.value) < defaultBidMin) {
      message.error(`竞价不能小于${defaultBidMin}`);
      return;
    }
    // 因为目前只有一个固定值，其它建议竞价都拿不到，所以只写了固定值的修改
    if (data.oneSelect === 'a') {
      const newList = [...selectedKeywordsList];
      for (let i = 0; i < selectedRowKeys.length; i++) {
        const key = selectedRowKeys[i];
        newList.forEach(newItem => {
          if (key === newItem.id) {
            newItem.bid = Number(data.value);
          }
        });
      }
      setSelectedKeywordsList(newList);
    } else {
      message.warn('选中关键词无建议竞价，无法设置该选项');
    }
  };

  // 右边的关键词表格
  const addTableConfig = {
    pagination: false as false,
    rowKey: (record: CampaignCreate.IKeyword) => record.id as string,
    rowSelection: {
      type: 'checkbox',
      columnWidth: 70,
      // 点击复选框时
      onChange: (selectRecord: React.Key[], record: {id: string}[]) => {
        const temArr: string[] = [];
        record.forEach(item => {
          temArr.push(item.id);
        });
        // setSelectedRowKeys([...temArr]);
        selectedRowKeys = temArr;
      },
    } as any, // eslint-disable-line
    columns: [
      {
        title: '关键词',
        dataIndex: 'keywordText',
        width: 200,
      },
      {
        title: '匹配方式',
        dataIndex: 'matchType',
        align: 'center',
        render: (value: string) => matchTypeDict[value],
      },
      {
        title: '建议竞价',
        align: 'center',
        dataIndex: 'b',
        render() {
          return <ShowData value={null} />;
          // 现在后端暂时拿不到建议竞价
          // return <div className={styles.suggestBidCol}>
          //   <div className={styles.oneRow}>
          //     <span><ShowData value={222} isCurrency /></span>
          //     <Button size="small">应用</Button>
          //   </div>
          //   <p className={styles.secondary}>
          //     （<ShowData value={2} isCurrency />-<ShowData value={58.2} isCurrency />）
          //   </p>
          // </div>;
        },
      },
      {
        title: '关键词竞价',
        dataIndex: 'bid',
        align: 'right',
        width: 120,
        className: styles.thKeywordCol,
        render(value: string, record: CampaignCreate.IKeyword) {
          return (
            <EditBox 
              value={String(value)} 
              currency={currency} 
              marketplace={marketplace as API.Site}
              chagneCallback={val => editBoxCallback(val, record)}
            />
          );
        },
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'id',
        render(val: string, record: CampaignCreate.IKeyword) {
          return <span 
            className={styles.handleCol}
            onClick={() => deleteItemKeyword(record)}
          >删除</span>;
        },
      },
    ] as any, // eslint-disable-line
    dataSource: selectedKeywordsList,
    locale: { emptyText: <span className="secondaryText">请选择或输入关键词</span> },
    scroll: { y: 226 },
  };

  return <>
    <main className={classnames(
      styles.keywordMain,
    )}>
      <div className={styles.leftLayout}>
        <header>
          <Tabs 
            className={styles.tab} 
            activeKey={keywordType} 
            onChange={val => setKeyword(val as 'suggest'|'import')}
          >
            <TabPane tab="建议关键词" key="suggest">
            </TabPane>
            <TabPane tab="输入关键词" key="import">
            </TabPane>
          </Tabs>
          <div className={styles.twoLayoutRow}>
            <Item name="keywords" label="匹配方式：" initialValue={candidateMatchTypes}>
              <Checkbox.Group
                options={
                  Object.keys(matchTypeDict).map(key => (
                    { label: matchTypeDict[key], value: key }
                  ))
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(values) => setCandidateMatchType(values as any)}
              />
            </Item>
            <span
              style={{ paddingRight: 40 }}
              className={classnames(
                styles.allBtn,
                suggestedKeywords.length ? '' : styles.active,
                keywordType === 'suggest' ? '' : 'none',
              )}
              onClick={addAllKeyword}
            >全选</span>
          </div>
        </header>
        <Table
          className={classnames( keywordType === 'suggest' ? '' : 'none',)}
          pagination={false}
          rowKey={() => keywordCount++}
          loading={loading}
          columns={[
            {
              title: '关键词',
              dataIndex: 'keywordText',
              width: 240,
            },
            {
              title: '匹配方式',
              dataIndex: 'matchType',
              align: 'center',
              width: 80,
              render: () => {
                return candidateMatchTypes.map(type => (
                  <div key={type} className={styles.matchType}>{matchTypeDict[type]}</div>
                ));
              },
            },
            {
              title: '操作',
              dataIndex: '',
              align: 'center',
              width: 60,
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
                      className={styles.keywordSelectItem}
                      disabled={isSelected}
                      onClick={() => handleSelectKeyword({ ...record, matchType: type })}
                    >选择</Button>
                  );
                });
              },
            },
          ]}
          scroll={{ x: 'max-content', y: 226 }}
          locale={{ emptyText: <span className="secondaryText">{keywordHint}</span> }}
          dataSource={suggestedKeywords.map(kw => ({ keywordText: kw }))}
        />
        <div className={classnames(
          styles.import,
          keywordType === 'suggest' ? 'none' : ''
        )}>
          <Item name="importTextarea">
            <Input.TextArea 
              placeholder="请输入关键词，每行一个"
              onChange={importChange}
              className={styles.textarea}/>
          </Item>
          <Button
            disabled={importKeyword.length ? false : true}
            onClick={addImportKeyword}
          >添加</Button>
        </div>
      </div>
      
      {/* 右边 */}
      <div className={styles.rightLayout}>
        <header>
          <Button onClick={batchDelete}>批量删除</Button>
          <Button onClick={batchSuggestBid}>应用建议竞价</Button>
          <Dropdown 
            overlay={<BatchSetBidMenu 
              currency={currency as API.Site}
              onCancel={() => setBatchSetBidVisible(false)}
              onConfire={batchsetBidConfire}
              marketplace={marketplace}
            />} 
            visible={batchSetBidVisible}
            placement="bottomCenter"
            arrow
          >
            <Button onClick={e => {
              e.nativeEvent.stopImmediatePropagation();
              setBatchSetBidVisible(!batchSetBidVisible);
              setMatchingVisible(false);
            }}>
              设置竞价<DownOutlined />
            </Button>
          </Dropdown>
        </header>
        <Table {...addTableConfig}/>
      </div>
    </main>
  </>;
};

export default SPManual;
