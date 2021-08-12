/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-09 11:57:51
 * 
 * 商品
 * 
 */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { createUUID, moneyFormat } from '@/utils/huang';
import {
  Table,
  Button,
  Dropdown,
  message,
  Input,
} from 'antd';
import {
  useDispatch,
  useSelector,
  ICreateGampaignState,
  ConnectProps,
} from 'umi';
import { FormInstance } from 'antd/lib/form';
import { DownOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import BatchSetBidMenu from '../../BatchSetBidMenu';
import ShowData from '@/components/ShowData';
import EditBox from '../../../../../components/EditBox';
import GoodsImg from '@/pages/components/GoodsImg';
import { getAmazonAsinUrl, Iconfont } from '@/utils/utils';
import { asinPandectBaseRouter } from '@/utils/routes';

interface IProps {
  campaignType: CreateCampaign.ICampaignType; // 广告活动类型 sp sb 
  form: FormInstance;
  currency: API.Site;
  marketplace: string;
  storeId: string|number;
  putMathod: CreateCampaign.putMathod;
  /** 广告活动日预算 */
  campaignDailyBudget: string;
}

interface ISuggestedProduct extends CreateCampaign.IProductAwaitType {
  bid: number;
}

interface IPage extends ConnectProps {
  createCampagin: ICreateGampaignState;
}

let selectedRowKeys: string[] = [];
const ClassProduct: React.FC<IProps> = props => {
  const {
    form,
    currency,
    marketplace,
    storeId,
    putMathod,
    campaignType,
    campaignDailyBudget,
  } = props;
  const selectProducts = useSelector((state: IPage) => state.createCampagin.selectProduct);
  const dispatch = useDispatch();
  

  const [nav, setNav] = useState<'suggestProduct' |'searchProduct'|'batchImport'>('suggestProduct'); // 
  const [batchSetBidVisible, setBatchSetBidVisible] = useState<boolean>(false); // 批量设置建议竞价显隐
  const [isHaveScroll, setisHaveScroll] = useState<boolean>(false); // 左边建议商品表格是格有滚动条
  // 是否全选建议商品
  const [isSelectAllSuggestProduct, setIsSelectAllSuggestProduct] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [importAsin, setImportAsin] = useState<string[]>([]); // 输入商品内容
  const [hint, setHint] = useState<string>('请先添加商品'); // 左边表格无数据的提示
  
  // 左边的建议商品列表
  const [suggestProduct, setSuggestProduct] = useState<CreateCampaign.IProductAwaitType[]>([
    // {
    //   asin: 'B00IG34VFS',
    //   sku: 'skuskusku',
    //   title: 'Lil.',
    //   price: Math.random() * 1000,
    //   reviewNum: Math.random() * 10000,
    //   reviewStars: Math.random() * 5,
    //   imgUrl: 'xx',
    //   sellable: Math.random() * 50000,
    //   ranking: 200,
    //   isChecked: false,
    //   id: createUUID(),
    // },
  ]);
  // 右边已添加的商品列表
  const [products, setProducts] = useState<ISuggestedProduct[]>([
    // {
    //   asin: 'B00IG34VFB',
    //   sku: 'skuskusku',
    //   title: 'Ll.',
    //   price: Math.random() * 1000,
    //   reviewNum: Math.random() * 10000,
    //   reviewStars: Math.random() * 5,
    //   imgUrl: 'xx',
    //   sellable: Math.random() * 50000,
    //   ranking: 200,
    //   isChecked: false,
    //   id: createUUID(),
    //   bid: 5,
    // },
  ]);
  // // 搜索商品的列表
  // const [searchProducs, setSearchProducts] = useState<CreateCampaign.IProductAwaitType[]>([
  //   {
  //     asin: 'B00IG34VFS',
  //     sku: 'skuskusku',
  //     title: 'tibus cupi,
  //     price: Math.random() * 1000,
  //     reviewNum: Math.random() * 10000,
  //     reviewStars: Math.random() * 5,
  //     imgUrl: 'xx',
  //     sellable: Math.random() * 50000,
  //     ranking: 200,
  //     isChecked: false,
  //     id: createUUID(),
  //   },
  // ]);


  let keywordCount = 0;
  const defaultBidMin = marketplace === 'JP' ? 2 : 0.02;

  // 请求商品数据
  useEffect(() => {
    const asins: string[] = [];
    selectProducts.forEach(item => asins.push(item.asin));

    if (putMathod && putMathod === 'classProduct') {
      setHint('SD展示广告暂无推荐商品');
      return;
    }

    if (asins.length === 0) {
      setProducts([...[]]);
      return;
    }

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'createCampagin/getProductAsins',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: storeId,
          },
          asins,
          tactic: form.getFieldsValue().outer?.sdPutMathod || null,
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
          records: {
          asin: string;
          imgUrl: string;
          price: number;
          review: number;
          status: number;
          title: string;
          }[];
        };
      };

      if (code === 200) {
        const newArray: CreateCampaign.IProductAwaitType[] = [];
        data.records.forEach(item => {
          const obj: CreateCampaign.IProductAwaitType = {
            asin: item.asin,
            sku: '',
            title: item.title,
            price: item.price,
            reviewNum: null,
            reviewStars: null,
            imgUrl: item.imgUrl,
            sellable: null,
            ranking: null,
            isChecked: false,
            id: createUUID(),
          };
          newArray.push(obj);
        });
        setSuggestProduct([...newArray]);
        return;
      }
      message.error(msg);
    });
  }, [storeId, dispatch, selectProducts]); // eslint-disable-line

  // 收集数据
  useEffect(() => {
    const jsonString = JSON.stringify(products);
    const newArray = JSON.parse(jsonString);
    dispatch({
      type: 'createCampagin/setSaveProducts',
      payload: newArray,
    });
  }, [dispatch, products]);

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
    for (let i = 0; i < suggestProduct.length; i++ ) {
      const item = suggestProduct[i];
      if (item.isChecked === false) {
        isAllSelct = false;
        break;
      }
    }
    setIsSelectAllSuggestProduct(isAllSelct);
  }, [suggestProduct]);
  
  // 修改左边建议分类按钮的状态
  const updateKeywordDataState = (asin: string) => {
    for (let i = 0; i < suggestProduct.length; i++) {
      const item = suggestProduct[i];
      if (item.asin === asin) {
        item.isChecked = false;
        break;
      }
    }
  };

  // 全部添加
  const addAllSuggestProduct = () => {
    // 默认竞价填写错误时，禁止选择关键词
    const defaultBidError = form.getFieldsError(['defaultBid'])[0];
    if (defaultBidError.errors.length) {
      message.warning('请先输入正确的默认竞价');
      return;
    }
    const defaultBid = form.getFieldValue('defaultBid');
    if ([undefined, null, ''].includes(defaultBid)) {
      message.error('关键词竞价不能为空，请填写默认竞价');
      return;
    } 

    if (Number(defaultBid) < defaultBidMin) {
      message.error(`关键词竞价不能低于${defaultBidMin}`);
      return;
    }

    suggestProduct.forEach(item => {
      if (item.isChecked) {
        return;
      }
      item.isChecked = true;
      const data = Object.assign({}, item, { bid: defaultBid });
      products.push(data);
    });
    
    setProducts([...products]);
    setSuggestProduct([...suggestProduct]);
  };

  // 添加单个建议商品
  const addOneSuggestProduct = (asin: string, isChecked: boolean) => {
    // 默认竞价填写错误时，禁止选择关键词
    const defaultBidError = form.getFieldsError(['defaultBid'])[0];
    if (defaultBidError.errors.length) {
      message.warning('请先输入正确的默认竞价');
      return;
    }
    let data: any = {}; // eslint-disable-line
    const defaultBid = form.getFieldValue('defaultBid');

    if ([undefined, null, ''].includes(defaultBid)) {
      message.error('关键词竞价不能为空，请填写默认竞价');
      return;
    } 

    if (Number(defaultBid) < defaultBidMin) {
      message.error(`关键词竞价不能低于${defaultBidMin}`);
      return;
    }

    if (isChecked) {
      return;
    }

    for (let i = 0; i < suggestProduct.length; i++) {
      const item = suggestProduct[i];
      if (item.asin === asin) {
        item.isChecked = true;
        data = item;
        break;
      }
    }

    data.bid = defaultBid;
    
    products.push(data);
    setSuggestProduct([...suggestProduct]);
    setProducts([...products]);
  };

  // 批量删除
  const batchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warn(`当前选中关键词为${selectedRowKeys.length}个`);
      return;
    }
    message.destroy();

    selectedRowKeys.forEach(item => {
      for (let i = 0; i < products.length; i++) {
        const addItem = products[i];
        if (item === addItem.id) {
          products.splice(i, 1);
          updateKeywordDataState(addItem.asin);
          break;
        }
      }
    });
    selectedRowKeys = [];
    setSuggestProduct([...suggestProduct]);
    setProducts([...products]);
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
    // 不能超过广告活动的日预算
    if (Number(data.value) > Number(campaignDailyBudget)) {
      message.error(`竞价不能超过广告活动日预算`);
      return;
    }
    setBatchSetBidVisible(false);

    // 因为目前只有一个固定值，其它建议竞价都拿不到，所以只写了固定值的修改
    if (data.oneSelect === 'a') {
      products.forEach(item => {
        if (selectedRowKeys.indexOf(item.id) > -1) {
          item.bid = Number(data.value);
        }
      });
      setProducts([...products]);
    }
  };

  // 删除单个关键词
  const deleteItemKeyword = (asin: string) => {
    for (let i = 0; i < products.length; i++ ) {
      const item = products[i];
      if (item.asin === asin) {
        products.splice(i, 1);
        break;
      }
    }
    updateKeywordDataState(asin);
    setSuggestProduct([...suggestProduct]);
    setProducts([...products]);
  };

  // // 搜索商品
  // const searchProduct = () => {
    
  // };

  // 输入ASIN改变时、改变添加按钮的状态
  const importChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();
    let asins = value.split(/[\n+|\s+|\\,+]/);
    asins = Array.from(new Set(asins));
    if (value.length === 0) {
      setImportAsin([]);
      return;
    }

    setImportAsin([...asins]);
  };

  // 批量ASIN添加
  const addImportKeyword = () => {
    const defaultBid = form.getFieldValue('defaultBid');
    if (importAsin.length === 0) {
      return;
    }

    // 默认竞价填写错误时，禁止选择关键词
    const defaultBidError = form.getFieldsError(['defaultBid'])[0];
    if (defaultBidError.errors.length) {
      message.warning('请先输入正确的默认竞价');
      return;
    }

    if ([undefined, null, ''].includes(defaultBid)) {
      message.error('关键词竞价不能为空，请填写默认竞价');
      return;
    } 

    if (Number(defaultBid) < defaultBidMin) {
      message.error(`关键词竞价不能低于${defaultBidMin}`);
      return;
    }

    for (let i = 0; i < importAsin.length; i++) {
      const asin = importAsin[i];
      let flag = false;
      // 判断 asin 格式；B开头，10个字母或数字的组合，不区分大小写
      if (asin.length !== 10 || asin[0].toUpperCase() !== 'B') {
        message.error('部分ASIN格式输入有误，请重新输入');
        return;
      }

      // 判断是否已添加
      for (let j = 0; j < products.length; j++) {
        const item = products[j];
        if (item.asin === asin) {
          message.error('ASIN已经添加！');
          flag = true;
          return;
        }
      }

      if (flag) {
        continue;
      }

      const data: any = { // eslint-disable-line
        asin,
        bid: defaultBid,
        title: '',
        sku: '',
        price: undefined,
        imgUrl: null,
        isChecked: false,
        id: createUUID(),
      };

      products.push(data);
    }
    setProducts([...products]);
  };

  // 右边添加的修改竞价的回调
  const bidCallback = (val: number, index: number) => {
    // 不能超过广告活动的日预算
    if (val > Number(campaignDailyBudget)) {
      message.error(`竞价不能超过广告活动日预算`);
      return Promise.resolve(false);
    }
    products[index].bid = val;
    setProducts([...products]);
    return Promise.resolve(true as true);
  };


  // 右边已添加的商品列表
  const addTableConfig = {
    pagination: false as false,
    rowKey: (record: {id: string}) => record.id,
    rowSelection: {
      type: 'checkbox',
      columnWidth: 38,
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
        title: '商品信息',
        dataIndex: 'title',
        align: 'center',
        key: createUUID(),
        width: 340,
        className: styles.tdProductCol,
        render(val: string, record: CreateCampaign.IProductAwaitType) {
          return <div className={styles.productCol}>
            <GoodsImg src={record.imgUrl} alt="" width={36} className={styles.img} />
            <div>
              <a 
                href={getAmazonAsinUrl(record.asin, marketplace as API.Site)}
                title={val}
                target="_blank"
                rel="noreferrer"
                className={styles.title}
              >
                <Iconfont type="icon-lianjie" className={styles.linkIcon} />
                {val}
              </a>
              <footer>
                <Link 
                  to={`${asinPandectBaseRouter}?asin=${record.asin}`}
                  target="_blank"
                  className={styles.asin}
                >{record.asin}</Link>
                <div className={styles.review}>
                  <ShowData value={record.reviewStars} fillNumber={1}/>
                  <span>
                    （{record.reviewNum ? moneyFormat(record.reviewNum, 0, ',', '.', false) : <ShowData value={null} /> }）
                  </span>
                </div>
                <span className={styles.stockpile}>
                  库存：{record.sellable ? moneyFormat(record.sellable, 0, ',', '.', false) : <ShowData value={null} /> }
                </span>
                <span className={styles.price}>
                  <ShowData value={record.price} isCurrency/>
                </span>
              </footer>
            </div>
          </div>;
        },
      },

      {
        title: '建议竞价',
        align: 'center',
        dataIndex: 'b',
        width: 90,
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
        title: '商品竞价',
        dataIndex: 'bid',
        align: 'right',
        width: 95,
        className: styles.thKeywordCol,
        render(value: string, record: {}, index: number) {
          return (
            <EditBox 
              value={String(value)} 
              currency={currency} 
              marketplace={marketplace as API.Site}
              chagneCallback={(val) => bidCallback(val, index)}
            />
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'asin',
        width: 60,
        align: 'center',
        render(asin: string) {
          return <span 
            className={styles.handleCol}
            onClick={() => deleteItemKeyword(asin)}
          >删除</span>;
        },
      },
    ] as any, // eslint-disable-line
    dataSource: products,
    locale: {
      emptyText: <span className="secondaryText">请选择商品</span>,
    },
    scroll: {
      y: 226,
    },
  };

  return <>
    <main className={classnames(
      styles.productBox,
    )}>
      {/* 左边 */}
      <div className={styles.leftLayout}>
        <div className={styles.threeNav}>
          <nav>
            <span 
              onClick={() => setNav('suggestProduct')}
              className={classnames(nav === 'suggestProduct' ? styles.active : '')}
            >建议商品</span>
            <span 
              onClick={() => setNav('searchProduct')}
              className={classnames(nav === 'searchProduct' ? styles.active : '')}
            >搜索商品</span>
            <span 
              onClick={() => setNav('batchImport')}
              className={classnames(nav === 'batchImport' ? styles.active : '')}
            >批量输入</span>
          </nav>
          <span className={classnames(
            styles.allBtn,
            isHaveScroll ? styles.paddingRight : '',
            nav === 'suggestProduct' ? '' : 'none',
            isSelectAllSuggestProduct ? styles.disable : ''
          )}
          onClick={addAllSuggestProduct}
          >全选</span>
        </div>

        {/* 建议商品  */}
        <div className={classnames(
          styles.suggestProductBox,
          nav === 'suggestProduct' ? '' : 'none',
        )}>
          <Table
            pagination={false}
            rowKey={() => keywordCount++}
            id="id-suggest-classify"
            loading={loading}
            columns={[
              { 
                title: '商品信息', 
                key: 'title', 
                dataIndex: 'title', 
                align: 'center',
                width: 340,
                render(val: string, record: CreateCampaign.IProductAwaitType) {
                  return <div className={styles.productCol}>
                    <GoodsImg src={record.imgUrl} alt="" width={36} className={styles.img} />
                    <div>
                      <a 
                        href={getAmazonAsinUrl(record.asin, marketplace as API.Site)}
                        title={val}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.title}
                      >
                        <Iconfont type="icon-lianjie" className={styles.linkIcon} />
                        {val}
                      </a>
                      <footer>
                        <Link 
                          to={`${asinPandectBaseRouter}?asin=${record.asin}`}
                          target="_blank"
                          className={styles.asin}
                        >{record.asin}</Link>
                        <div className={styles.review}>
                          <ShowData value={record.reviewStars} fillNumber={1}/>
                          <span>（{ record.reviewNum ? moneyFormat(record.reviewNum, 0, ',', '.', false ) : <ShowData value={null} />}）</span>
                        </div>
                        <span className={styles.price}>
                          <ShowData value={record.price} isCurrency/>
                        </span>
                      </footer>
                    </div>
                  </div>;
                },
              },
              { 
                title: '操作', 
                key: 'handle', 
                dataIndex: 'isChecked',
                width: 60, 
                render(val: boolean, record: CreateCampaign.IProductAwaitType) {
                  return <><span 
                    className={classnames(
                      styles.handleCol, 
                      val ? styles.active : '',
                    )}
                    onClick={() => addOneSuggestProduct(record.asin, val)}
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
            dataSource={suggestProduct}
          />

        </div>

        {/* 搜索商品 */}
        <div className={classnames(
          styles.suggestProductBox,
          nav === 'searchProduct' ? '' : 'none',
        )}>
          <span className={styles.hint}>功能开发中...</span>
          {/* 功能暂时做不了， 后端说：因为这些数据不在我们自己的数据库里面 */}
          {/* <Input.Search
            allowClear
            className={classnames(
              'h-search',
              styles.search
            )}
            placeholder="请输入标题或ASIN"
            enterButton={<Iconfont type="icon-sousuo" />}
            onSearch={searchProduct}
            autoComplete="off"
          />
          <div className={styles.list}>
            {searchProducs.map((item, i ) => {
              return <div key={i} className={styles.itemBox}>
                <div className={styles.listItem}>
                  <GoodsImg src={item.imgUrl} alt="" width={36} className={styles.img} />
                  <div>
                    <a 
                      href={getAmazonAsinUrl(item.asin, marketplace as API.Site)}
                      title={item.title}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.title}
                    >
                      <Iconfont type="icon-lianjie" className={styles.linkIcon} />
                      {item.title}
                    </a>
                    <footer>
                      <Link 
                        to={`${asinPandectBaseRouter}?asin=${item.asin}`}
                        target="_blank"
                        className={styles.asin}
                      >{item.asin}</Link>
                      <div className={styles.review}>
                        <ShowData value={5.0} fillNumber={1}/>
                        <span>（{moneyFormat(50000, 0, ',', '.', false)}）</span>
                      </div>
                      <span className={styles.stockpile}>
                        库存：{moneyFormat(50000, 0, ',', '.', false)}
                      </span>
                      <span className={styles.price}>
                        <ShowData value={item.price} isCurrency/>
                      </span>
                    </footer>
                  </div>
                </div>
                <Button className={styles.selctBtn}>选择</Button>
              </div>;
            })}
          </div> */}
        </div>

        {/* 批量输入 */}
        <div className={classnames(
          styles.batchImport,
          nav === 'batchImport' ? '' : 'none',
        )}>
          <Input.TextArea
            className={styles.textarea}
            onChange={importChange}
            placeholder="请输入多个ASIN，用英文逗号，空格或者换行分割" />
          <Button
            disabled={importAsin.length ? false : true}
            onClick={addImportKeyword}
          >添加</Button>
        </div>
      </div>

      {/* 右边已选的商品  */}
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
