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
import { createUUID } from '@/utils/huang';
import { DownOutlined } from '@ant-design/icons';
import {
  matchTransition,
} from '../config';
import {
  Table,
  Radio,
  Form,
  Button,
  Input,
  Tabs,
  message,
  Dropdown,
} from 'antd';
import { useDispatch, ConnectProps, ICreateGampaignState, useSelector } from 'umi';
import { FormInstance } from 'antd/lib/form';
import ShowData from '@/components/ShowData';
import EditBox from '../../../../components/EditBox';
import TableNotData from '@/components/TableNotData';
import BatchSetBidMenu from '../BatchSetBidMenu';
import MatchSelect from '../MatchSelect';

interface IProps {
  form: FormInstance;
  currency: API.Site;
  marketplace: string;
  storeId: number|string;
}

interface IKeywordsType {
  id: string;
  keyword: string;
  bid: number;
  match: string;
  broad: boolean; // 广泛关键词是否已选
  phrase: boolean; // 词组。。。
  exact: boolean; // 精准 。。。。
}

interface IAwaitKeywordsType {
  keyword: string;
  id: string;
  broad: boolean; // 广泛关键词是否已选
  phrase: boolean; // 词组。。。
  exact: boolean; // 精准 。。。。
  
}

interface IMatchingProps {
  onCancel: () => void;
  onConfire: (type: string) => void;
}

interface IPage extends ConnectProps {
  createCampagin: ICreateGampaignState;
}


const { Item } = Form;
const { TabPane } = Tabs;
let selectedRowKeys: string[] = [];
// 批量修改的 匹配方式
const Matching: React.FC<IMatchingProps> = props => {
  const { onCancel, onConfire } = props;
  const [value, setValue] = useState<string>('broad');

  return <div className={styles.matching} onClick={e => e.nativeEvent.stopImmediatePropagation()}>
    <Radio.Group value={value} onChange={e => setValue(e.target.value)}>
      <Radio value="broad">广泛</Radio>
      <Radio value="phrase">词组</Radio>
      <Radio value="exact">精准</Radio>
    </Radio.Group>
    <footer>
      <Button onClick={onCancel}>取消</Button>
      <Button type="primary" onClick={() => onConfire(value)}>确定</Button>
    </footer>
  </div>;
};

const SPManual: React.FC<IProps> = props => {
  const { form, currency, marketplace, storeId } = props;
  const dispatch = useDispatch();
  const selectProducts = useSelector((state: IPage) => state.createCampagin.selectProduct);
  

  const [keywordType, setKeyword] = useState<'suggest'|'import'>('suggest'); 
  const [importKeyword, setImportKeyword] = useState<string[]>([]); // 输入关键词内容
  const [batchSetBidVisible, setBatchSetBidVisible] = useState<boolean>(false); // 批量设置建议竞价显隐
  const [matchingVisible, setMatchingVisible] = useState<boolean>(false); // 批量修改匹配方式显隐
  const [match, setMatch] = useState<string>('broad'); // 左边的匹配方式
  const [loading, setLoading] = useState<boolean>(false); // 左边关键词的loading
  const [keywordHint, setKeywordHint] = useState<string>('请先添加商品'); // 左边表格的提示语 
  const [keywordAllBtnState, setKeywordAllBtnState] = useState<boolean>(false); // 全选按钮是否变成全选
  // 左边的建议关键词
  const [keywordDada, setKeywordData] = useState<IAwaitKeywordsType[]>([
    // { keyword: 'aaaa', id: createUUID(), exact: false, phrase: false, broad: false },
  ]);
  // 所有已添加的关键词
  const [addKeyword, setAddKeyword] = useState<IKeywordsType[]>([
    // { 
    //   id: createUUID(), 
    //   keyword: '', 
    //   bid: 1, 
    //   match: 'broad', 
    //   exact: false, 
    //   phrase: false, 
    //   broad: true,
    // },
  ]);

  const defaultBidMin = marketplace === 'JP' ? 2 : 0.02;


  // 请求建议关键词
  useEffect(() => {
    const asins: string[] = [];
    selectProducts.forEach(item => asins.push(item.asin));

    if (asins.length === 0) {
      setKeywordData([...[]]);
      return;
    }

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'createCampagin/getKeywords',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: storeId,
          },
          asins,
          matchType: match,
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
        data?.keywords.length ? setKeywordHint('请先添加商品') : setKeywordHint('该模式下没有建议关键词');
        const array: IAwaitKeywordsType[] = [];

        data?.keywords.forEach(item => {
          let flag = false;
          // 判断是否已选
          for (let i = 0; i < addKeyword.length; i++) {
            const addItem = addKeyword[i];
            if (addItem.keyword === item) {
              flag = addItem[match];
              break;
            }
          }

          const obj: IAwaitKeywordsType = {
            keyword: item, 
            id: createUUID(), 
            exact: false, 
            phrase: false, 
            broad: false,
          };
          obj[match] = flag;
          array.push(obj);
        });
        setKeywordData([...array]);
        return;
      } 
      message.error(msg);
    });
  }, [dispatch, selectProducts, storeId, match]); // eslint-disable-line


  // 收集数据
  useEffect(() => {
    const newArray: CreateCampaign.IKeywords[] = [];
    const tem = JSON.stringify(addKeyword);
    const tem1: IKeywordsType[] = JSON.parse(tem);
    
    tem1.forEach(item => {
      const obj = {
        keywordText: item.keyword,
        matchType: item.match,
        bid: item.bid,
      };
      newArray.push(obj);
    });

    dispatch({
      type: 'createCampagin/setKeywords',
      payload: newArray,
    });
  }, [dispatch, addKeyword]);


  // 其它地方隐藏
  useEffect(() => {
    document.addEventListener('click', () => {
      batchSetBidVisible && setBatchSetBidVisible(false);
      matchingVisible && setMatchingVisible(false);
    });
  });

  // 匹配选中的匹配方式，判断当前按钮是否需要全选
  useEffect(() => {
    let tem = true;
    for (let i = 0; i < keywordDada.length; i++) {
      const item = keywordDada[i];
      if (item[match] === false) {
        tem = false;
        break;
      }
    }
    setKeywordAllBtnState(tem);
  }, [match, keywordDada]);

  // base
  let keywordCount = 0;

  // 添加关键词到右边的主函数
  const addKeywordfn = (keyword: string) => {
    const defaultBid = form.getFieldValue('defaultBid');

    if ([undefined, null, ''].includes(defaultBid)) {
      message.error('关键词竞价不能为空，请填写默认竞价');
      return;
    } 

    if (Number(defaultBid) < defaultBidMin) {
      message.error(`关键词竞价必须大于等于${defaultBidMin}`);
      return;
    }

    let flag = false;
    for (let i = 0; i < addKeyword.length; i++) {
      const item = addKeyword[i];
      if (item.keyword === keyword && item[match]) {
        flag = true;
        break;
      }
    }
    if (flag) {
      return;
    }

    for (let i = 0; i < keywordDada.length; i++ ) {
      const item = keywordDada[i];
      if (item.keyword === keyword) {
        item[match] = true;
      }
    }

    const data = {
      id: createUUID(),
      keyword, 
      bid: Number(defaultBid), 
      match,
      exact: false, 
      phrase: false, 
      broad: false,
    };
    data[match] = true;
    addKeyword.unshift(data);
  };

  // 修改左边建议关键词按钮的状态
  const updateKeywordDataState = (keyword: string, match: string) => {
    for (let i = 0; i < keywordDada.length; i++) {
      const item = keywordDada[i];
      if (item.keyword === keyword) {
        item[match] = false;
        break;
      }
    }
  };
  

  // 删除单个关键词
  const deleteItemKeyword = (keyword: string, match: string) => {
    for (let i = 0; i < addKeyword.length; i++ ) {
      const item = addKeyword[i];
      if (item.keyword === keyword && item.match === match) {
        addKeyword.splice(i, 1);
        break;
      }
    }
    updateKeywordDataState(keyword, match);
    setKeywordData([...keywordDada]);
    setAddKeyword([...addKeyword]);
  };

  // 修改右边关键词表格的匹配方式
  const matchSelectCallback = (match: string, keyword: string) => {
    let flag = true;

    for (let i = 0; i < addKeyword.length; i++) {
      const item = addKeyword[i];
      
      if (item.keyword === keyword && item[match]) {
        flag = false;
        break;
      }
    }

    !flag && message.warn(`关键词 {${keyword}} 在 {${matchTransition(match)}} 中已存在！`);

    return Promise.resolve(flag);
  };

  const editBoxCallback = (val: number, index: number) => {
    if (val < defaultBidMin) {
      message.error(`竞价不能小于${defaultBidMin}`);
      return Promise.resolve(false);
    }
    addKeyword[index].bid = val;
    setAddKeyword([...addKeyword]);
    return Promise.resolve(true);
  };

  // 右边的关键词表格
  const addTableConfig = {
    pagination: false as false,
    rowKey: (record: {id: string}) => record.id,
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
        dataIndex: 'keyword',
        key: createUUID(),
        width: 200,
      },
      {
        title: '匹配方式',
        dataIndex: 'match',
        align: 'center',
        render(value: string, record: { keyword: string}) {
          return <MatchSelect 
            value={value} keyword={record.keyword} 
            changeCallback={matchSelectCallback} 
          />;
        },
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
        render(value: string, record: {}, index: number) {
          return (
            <EditBox 
              value={String(value)} 
              currency={currency} 
              marketplace={marketplace as API.Site}
              chagneCallback={val => editBoxCallback(val, index)}
            />
          );
        },
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'id',
        render(val: string, record: { keyword: string; match: string }) {
          return <span 
            className={styles.handleCol}
            onClick={() => deleteItemKeyword(record.keyword, record.match)}
          >删除</span>;
        },
      },
    ] as any, // eslint-disable-line
    dataSource: addKeyword,
    locale: {
      emptyText: <TableNotData hint="请选择或输入关键词" style={{
        padding: '36px 0 0',
      }} />,
    },
    scroll: {
      y: 226,
    },
  };

  // 建议关键词全部添加
  const addAllKeyword = () => {
    keywordDada.forEach(item => {
      addKeywordfn(item.keyword);
    }); 
    setKeywordData([...keywordDada]);
    setAddKeyword([...addKeyword]);
  };

  // 建议关键词单个添加
  const addOneKeyword = (keyword: string, isChecked: boolean) => {
    if (isChecked){
      return;
    }

    addKeywordfn(keyword);

    setAddKeyword([...addKeyword]);
    setKeywordData([...keywordDada]);
  };

  // 输入关键词添加
  const addImportKeyword = () => {
    if (importKeyword.length === 0) {
      return;
    }

    importKeyword.forEach(importItem => {
      addKeywordfn(importItem);
    });
    setAddKeyword([...addKeyword]);
    setKeywordData([...keywordDada]);
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

    selectedRowKeys.forEach(item => {
      for (let i = 0; i < addKeyword.length; i++) {
        const addItem = addKeyword[i];
        if (item === addItem.id) {
          addKeyword.splice(i, 1);
          updateKeywordDataState(addItem.keyword, addItem.match);
          break;
        }
      }
    });

    selectedRowKeys = [];
    setKeywordData([...keywordDada]);
    setAddKeyword([...addKeyword]);
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
      addKeyword.forEach(item => {
        if (selectedRowKeys.indexOf(item.id) > -1) {
          item.bid = Number(data.value);
        }
      });
      setAddKeyword([...addKeyword]);
      setBatchSetBidVisible(false);

    } else {
      message.warn('选中行无建议竞价，无法设置该选项');
    }
  };

  // 批量修改关键词的匹配方式
  const batchMatchSetCallback = (type: string) => {
    if (selectedRowKeys.length === 0) {
      message.warn(`当前选中关键词为${selectedRowKeys.length}个`);
      return;
    }
    message.destroy();

    addKeyword.forEach(item => {
      if (selectedRowKeys.indexOf(item.id) > -1) {
        item.match = type;
      }
    });
    setAddKeyword([...addKeyword]);
    setMatchingVisible(false);
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
            <Item name="keywords" label="匹配方式：" initialValue={match}>
              <Radio.Group onChange={e => setMatch(e.target.value)}>
                <Radio value="broad">广泛</Radio>
                <Radio value="phrase">词组</Radio>
                <Radio value="exact">精准</Radio>
              </Radio.Group>
            </Item>
            <span style={{
              paddingRight: (keywordDada.length > 4 ? 46 : 30),
            }} className={classnames(
              styles.allBtn,
              match === 'broad' && keywordAllBtnState ? styles.active : '',
              match === 'phrase' && keywordAllBtnState ? styles.active : '',
              match === 'exact' && keywordAllBtnState ? styles.active : '',
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
            { title: '关键词', key: 'keyword', dataIndex: 'keyword', width: 352 - (keywordDada.length > 4 ? 16 : 0 ) },
            { 
              title: '操作', 
              key: 'handle', 
              dataIndex: 'keyword',
              width: 70, 
              render: (val: string, record: { }) => <span 
                className={classnames(
                  styles.handleCol, 
                  record[match] ? styles.active : '',
                )}
                onClick={() => addOneKeyword(val, record[match])}
              >{record[match] ? '已选' : '选择'}</span>,
            },
          ]}
          scroll={{
            y: 226,
          }}
          locale={{
            emptyText: <TableNotData hint={keywordHint} style={{
              padding: '36px 0 0',
            }}/>,
          }}
          dataSource={keywordDada}
        />
        <div className={classnames(
          styles.import,
          keywordType === 'suggest' ? 'none' : ''
        )}>
          <Input.TextArea 
            placeholder="请输入关键词，每行一个"
            onChange={importChange}
            className={styles.textarea}/>
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
          <Dropdown 
            overlay={<Matching 
              onCancel={() => setMatchingVisible(false)}
              onConfire={batchMatchSetCallback}
            />} 
            visible={matchingVisible}
            placement="bottomCenter"
            arrow
          >
            <Button onClick={e => {
              e.nativeEvent.stopImmediatePropagation();
              setMatchingVisible(!matchingVisible);
              setBatchSetBidVisible(false);
            }}>
              匹配方式<DownOutlined />
            </Button>
          </Dropdown>
        </header>
        <Table {...addTableConfig}/>
      </div>
    </main>
  </>;
};

export default SPManual;
