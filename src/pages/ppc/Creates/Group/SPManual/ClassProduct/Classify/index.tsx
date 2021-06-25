import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { createUUID } from '@/utils/huang';
import {
  Table,
  Button,
  Dropdown,
  message,
} from 'antd';
import {
  ConnectProps,
  ICreateGampaignState,
  useSelector,
  useDispatch,
} from 'umi';
import { FormInstance } from 'antd/lib/form';
import { DownOutlined } from '@ant-design/icons';
import BatchSetBidMenu from '../../BatchSetBidMenu';
import ShowData from '@/components/ShowData';
import EditBox from '../../../../components/EditBox';
import ThiningModal from './ThiningModal';

interface IProps {
  campaignType: CreateCampaign.ICampaignType; // 广告活动类型 sp sb 
  tactic: string;
  form: FormInstance;
  currency: API.Site;
  marketplace: string;
  storeId: string|number;
  putMathod: CreateCampaign.putMathod;
}

interface IRecord {
  categoryName: string;
  path: string;
  categoryId: string;
  isChecked: boolean;
}

interface IAddRecord {
  categoryId: string;
  categoryName: string;
  brandName?: string;
  priceLessThan?: number;
  priceGreaterThan?: number;
  reviewRatingLessThan?: number;
  reviewRatingGreaterThan?: number;
}


interface IPage extends ConnectProps {
  createGroup: ICreateGampaignState;
}


let selectedRowKeys: string[] = [];
const ClassProduct: React.FC<IProps> = props => {
  const { form, currency, marketplace, storeId, putMathod, campaignType, tactic } = props;
  const dispatch = useDispatch();
  const selectProducts = useSelector((state: IPage) => state.createGroup.selectProduct);
  
  const [nav, setNav] = useState<'suggestClass' |'searchClass'>('suggestClass'); // 
  const [batchSetBidVisible, setBatchSetBidVisible] = useState<boolean>(false); // 批量设置建议竞价显隐
  // 是否全选建议分类
  const [isSelectAllSuggestClass, setIsSelectAllSuggestClass] = useState<boolean>(false);
  const [isHaveScroll, setisHaveScroll] = useState<boolean>(false); // 左边建议分类表格是格有滚动条
  const [loading, setLoading] = useState<boolean>(false); 
  const [hint, setHint] = useState<string>('请先添加商品'); // 左边表格无数据的提示

  // 左边的建议分类列表
  const [suggestClass, setSuggestClass] = useState<CreateCampaign.ISuggestClassType[]>([
    // {
    //   categoryName: 'lorem111',
    //   path: '/TBits',
    //   categoryId: '3116541',
    //   isChecked: false,
    //   id: createUUID(),
    // },
  ]);
  // 右边已添加的分类列表
  const [suggestedClass, setSuggestedClass] = useState<CreateCampaign.ISuggestedClassType[]>([
    // {
    //   categoryId: '31162252541',
    //   categoryName: 'lorem32424',
    //   isChecked: true,
    //   id: createUUID(),
    //   bid: 225,
    // },
  ]);

  let keywordCount = 0;
  const defaultBidMin = marketplace === 'JP' ? 2 : 0.02;


  // 请求建议分类
  useEffect(() => {
    const asins: string[] = [];
    selectProducts.forEach(item => asins.push(item.asin));

    if (putMathod && putMathod === 'classProduct') {
      setHint('SD展示广告暂无建议分类');
      return;
    }

    if (asins.length === 0) {
      setSuggestClass([...[]]);
      return;
    }

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'createGroup/getClassifys',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: storeId,
          },
          asins,
          tactic,
          campaignType,
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
        message: string;
        data: {
          categories: {
            categoryId: string;
            categoryName: string;
            path: string;
          }[];
        };
      };

      if (code === 200) {
        const temArray: CreateCampaign.ISuggestClassType[] = [];
        data.categories.forEach(item => {
          const obj: CreateCampaign.ISuggestClassType = {
            categoryName: item.categoryName,
            path: item.path,
            categoryId: item.categoryId,
            isChecked: false,
            id: createUUID(),
          };
          temArray.push(obj);
          setSuggestClass([...temArray]);
        });
        return;
      }
      message.error(msg);
    });
  }, [storeId, selectProducts, dispatch]); // eslint-disable-line

  // 收集数据
  useEffect(() => {
    const jsonString = JSON.stringify(suggestedClass);
    const newArray: CreateCampaign.ISuggestedClassType = JSON.parse(jsonString);
    dispatch({
      type: 'createGroup/setClassifys',
      payload: newArray,
    });
  }, [dispatch, suggestedClass]);

  useEffect(() => {
    const el = document.querySelector('#id-suggest-classify');
    let isAllSelct = true;
    if (el) {
      const tbody = el.querySelector('.ant-table-body') as HTMLElement;
      const tbodyTable = el.querySelector('.ant-table-body>table') as HTMLElement;
      const tableHeight = Number(getComputedStyle(tbodyTable, null).height.slice(0, -2));
      const bodyHeight = Number(getComputedStyle(tbody, null).height.slice(0, -2));
      
      tableHeight >= bodyHeight ? setisHaveScroll(true) : setisHaveScroll(false);
    }

    // 是否已全选
    for (let i = 0; i < suggestClass.length; i++ ) {
      const item = suggestClass[i];
      if (item.isChecked === false) {
        isAllSelct = false;
        break;
      }
    }
    setIsSelectAllSuggestClass(isAllSelct);
  }, [suggestClass]);


  // 修改左边建议分类按钮的状态（取消选中）
  const setKeywordDataState = (classText: string) => {
    for (let i = 0; i < suggestClass.length; i++) {
      const item = suggestClass[i];
      if (item.categoryName === classText) {
        item.isChecked = false;
        break;
      }
    }
  };

  // 全部添加
  const addAllSuggestClass = () => {
    const defaultBid = form.getFieldValue('defaultBid');
    if ([undefined, null, ''].includes(defaultBid)) {
      message.error('默认竞价不能为空，请填写默认竞价');
      return;
    } 

    if (Number(defaultBid) < defaultBidMin) {
      message.error(`默认竞价必须大于等于${defaultBidMin}`);
      return;
    }

    suggestClass.forEach(item => {
      if (item.isChecked) {
        return;
      }
      item.isChecked = true;
      const data: CreateCampaign.ISuggestedClassType = Object.assign({}, item, { bid: defaultBid });
      suggestedClass.push(data);
    });
    
    setSuggestedClass([...suggestedClass]);
    setSuggestClass([...suggestClass]);
  };

  // 添加单个建议分类
  const addOneSuggestClass = (classText: string, isChecked: boolean) => {
    let data: any = {}; // eslint-disable-line
    const defaultBid = form.getFieldValue('defaultBid');

    if ([undefined, null, ''].includes(defaultBid)) {
      message.error('默认竞价不能为空，请填写默认竞价');
      return;
    } 

    if (Number(defaultBid) < defaultBidMin) {
      message.error(`默认竞价必须大于等于${defaultBidMin}`);
      return;
    }

    if (isChecked) {
      return;
    }

    for (let i = 0; i < suggestClass.length; i++) {
      const item = suggestClass[i];
      if (item.categoryName === classText) {
        item.isChecked = true;
        data = item;
        break;
      }
    }

    data.bid = defaultBid;
    
    suggestedClass.push(data);
    setSuggestClass([...suggestClass]);
    setSuggestedClass([...suggestedClass]);
  };

  // 添加细化弹窗
  const thiningCallback = (data: CreateCampaign.IThiningConfirmCallback) => {
    const defaultBid = form.getFieldValue('defaultBid');
    let flag = false;
    const checkedBrands = data.checkedBrands || [];
    const priceMin = data.priceLessThan;
    const priceMax = data.priceGreaterThan;
    const scoreMin = data.reviewRatingLessThan;
    const scoreMax = data.reviewRatingGreaterThan;

    if ([undefined, null, ''].includes(defaultBid)) {
      message.error('默认竞价不能为空，请填写默认竞价');
      return Promise.resolve(false);
    } 
    
    if (defaultBid < defaultBidMin) {
      message.error(`默认竞价不能小于${defaultBidMin}`);
      return Promise.resolve(false);
    }

    for ( let i = 0; i < suggestedClass.length; i++ ) {
      const item = suggestedClass[i];
      if (checkedBrands.length) {
        for (let j = 0; j < checkedBrands.length; j++) {
          const childItem = checkedBrands[j];
          if (
            item.categoryName === data.classText
            && item.brandName === childItem
            && item.priceLessThan === priceMin
            && item.priceGreaterThan === priceMax
            && item.reviewRatingLessThan === scoreMin
            && item.reviewRatingGreaterThan === scoreMax
          ) {
            flag = true;
            break;
          }
        }
      } else {
        if (
          item.categoryName === data.classText
          && item.priceLessThan === priceMin
          && item.priceGreaterThan === priceMax
          && item.reviewRatingLessThan === scoreMin
          && item.reviewRatingGreaterThan === scoreMax
        ) {
          flag = true;
          break;
        }
      }
    }

    if (flag) {
      message.error('细化条件已存在');
      return Promise.resolve(false);
    }
    
    if (checkedBrands.length) {
      // 多个品牌
      checkedBrands.forEach(item => {
        const obj: any = { // eslint-disable-line
          categoryId: data.classId,
          categoryName: data.classText,
          isChecked: false,
          id: createUUID(),
          bid: defaultBid,
          brandId: item.brandId,
          brandName: item,
          priceLessThan: priceMin,
          priceGreaterThan: priceMax,
          reviewRatingLessThan: scoreMin,
          reviewRatingGreaterThan: scoreMax,
        };
        suggestedClass.unshift(obj);
      });
    } else {
      const obj: any = { // eslint-disable-line
        categoryId: data.classId,
        categoryName: data.classText,
        isChecked: false,
        id: createUUID(),
        bid: defaultBid,
        brandId: undefined,
        brandName: undefined,
        priceLessThan: priceMin,
        priceGreaterThan: priceMax,
        reviewRatingLessThan: scoreMin,
        reviewRatingGreaterThan: scoreMax,
      };
      suggestedClass.unshift(obj);
    }

    setSuggestedClass([...suggestedClass]);
    return Promise.resolve(true);
  };

  // 批量删除
  const batchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warn(`当前选中分类为${selectedRowKeys.length}个`);
      return;
    }
    message.destroy();

    selectedRowKeys.forEach(item => {
      for (let i = 0; i < suggestedClass.length; i++) {
        const addItem = suggestedClass[i];
        if (item === addItem.id) {
          suggestedClass.splice(i, 1);
          setKeywordDataState(addItem.categoryName);
          break;
        }
      }
    });
    selectedRowKeys = [];
    setSuggestClass([...suggestClass]);
    setSuggestedClass([...suggestedClass]);
  };

  // 顶部的批量建议竞价
  const batchSuggestBid = () => {
    if (selectedRowKeys.length === 0) {
      message.warn(`当前选中分类为${selectedRowKeys.length}个`);
      return;
    }

    message.warn('暂时建议竞价');
  };

  // 批量设置竞价确定回调
  const batchsetBidConfire = (data: CreateCampaign.ICallbackDataType) => {
    if (selectedRowKeys.length === 0) {
      message.warn(`当前选中分类为${selectedRowKeys.length}个`);
      return;
    }
    setBatchSetBidVisible(false);

    // 因为目前只有一个固定值，其它建议竞价都拿不到，所以只写了固定值的修改
    if (data.oneSelect === 'a') {
      suggestedClass.forEach(item => {
        if (selectedRowKeys.indexOf(item.id) > -1) {
          item.bid = Number(data.value);
        }
      });
      setSuggestedClass([...suggestedClass]);
    }
  };

  // 删除单个分类
  const deleteItemClassify = (id: string) => {
    let removeId = '';
    for (let i = 0 ; i < suggestedClass.length; i++ ) {
      const item = suggestedClass[i];
      if (item.id === id) {
        suggestedClass.splice(i, 1);
        removeId = item.id;
        break;
      }
    }

    // 左边按钮状态
    for (let i = 0; i < suggestClass.length; i++) {
      const item = suggestClass[i];
      if (item.id === removeId) {
        item.isChecked = false;
        break;
      }
    }

    setSuggestClass([...suggestClass]);
    setSuggestedClass([...suggestedClass]);
  };

  // 右边添加的分类修改竞价的回调
  const bidCallback = (val: number, index: number) => {
    suggestedClass[index].bid = val;
    setSuggestedClass([...suggestedClass]);
    return Promise.resolve(true as true);
  };

  // 右边已添加的分类列表
  const addTableConfig = {
    pagination: false as false,
    rowKey: (record: {id: string; brand: string}) => record.id + (record.brand ? record.brand : ''),
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
        title: '分类',
        dataIndex: 'categoryName',
        key: createUUID(),
        width: 200,
        render(val: string, record: IAddRecord) {
          return <div className={styles.classCol}>
            <p>{val}</p>
            <div>
              <p className={classnames(record.brandName ? '' : 'none')}>
                品牌=&rdquo;{record.brandName}&rdquo;
              </p>
              <p className={classnames(
                record.priceLessThan || record.priceGreaterThan ? '' : 'none'
              )}>
                价格=&rdquo;{record.priceLessThan}-{record.priceGreaterThan}&rdquo;
              </p>
              <p className={classnames(
                [0, undefined].includes(record.reviewRatingLessThan)
                && [5, undefined].includes(record.reviewRatingGreaterThan) ? 'none' : ''
              )}>
                评分=&rdquo;{record.reviewRatingLessThan}-{record.reviewRatingGreaterThan}&rdquo;</p>
            </div>
          </div>;
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
        title: '分类竞价',
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
              chagneCallback={val => bidCallback(val, index)}
            />
          );
        },
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'id',
        render(val: string) {
          return <span 
            className={styles.handleCol}
            onClick={() => deleteItemClassify(val)}
          >删除</span>;
        },
      },
    ] as any, // eslint-disable-line
    dataSource: suggestedClass as [],
    locale: {
      emptyText: <span className="secondaryText">请选择分类词</span>,
    },
    scroll: {
      y: 226,
    },
  };

  return <>
    {/* 分类 */}
    <main className={classnames(
      styles.classBox,
    )}>
      <div className={styles.leftLayout}>
        <div className={styles.threeNav}>
          <nav>
            <span 
              onClick={() => setNav('suggestClass')}
              className={classnames(nav === 'suggestClass' ? styles.active : '')}
            >建议分类</span>
            <span 
              onClick={() => setNav('searchClass')}
              className={classnames(nav === 'searchClass' ? styles.active : '')}
            >搜索分类</span>
          </nav>
          <span className={classnames(
            styles.allBtn,
            isHaveScroll ? styles.paddingRight : '',
            nav === 'suggestClass' ? '' : 'none',
            isSelectAllSuggestClass ? styles.disable : ''
          )}
          onClick={addAllSuggestClass}
          >全选</span>
        </div>
      
            
        {/* 建议分类  */}
        <Table
          className={classnames(nav === 'suggestClass' ? '' : 'none')}
          pagination={false}
          rowKey={() => keywordCount++}
          id="id-suggest-classify"
          columns={[
            { 
              title: '分类', 
              key: 'categoryName', 
              dataIndex: 'categoryName', 
              width: 340,
              render(val: string, record: IRecord) {
                return <div className={styles.classCol}>
                  <div className={styles.oneLayoutRow}>
                    {val}
                    <ThiningModal 
                      currency={currency} 
                      classText={val} 
                      classId={record.categoryId}
                      onConfirm={thiningCallback}
                      storeId={storeId}
                    />
                  </div>
                  <div className={styles.path}>
                    {record.path}
                  </div>
                </div>;
              },
            },
            { 
              title: '操作', 
              key: 'handle', 
              dataIndex: 'isChecked',
              width: 60, 
              render(val: boolean, record: IRecord) {
                return <><span 
                  className={classnames(
                    styles.handleCol, 
                    val ? styles.active : '',
                  )}
                  onClick={() => addOneSuggestClass(record.categoryName, record.isChecked)}
                >{val ? '已选' : '选择'}</span></>;
              },
            },
          ]}
          scroll={{
            y: 226,
          }}
          locale={{
            emptyText: <span className="secondaryText">{hint}</span>,
          }}
          loading={loading}
          dataSource={suggestClass as []}
        />

        {/* 搜索分类 */}
        <div className={classnames(
          styles.searchClass,
          nav === 'searchClass' ? '' : 'none',
        )}>
          <span>功能开发中....</span>
        </div>

      </div>
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

export default ClassProduct;
