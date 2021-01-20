import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { 
  asinPandectBaseRouter,
} from '@/utils/routes';

import ShowData from '@/components/ShowData';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import GoodsImg from '@/pages/components/GoodsImg';
import classnames from 'classnames';
import { 
  useSelector,
  useDispatch,
  Link,
  ConnectProps,
  ICreateGampaignState,
} from 'umi';
import {
  Table,
  Input,
  message,
} from 'antd';

interface IPage extends ConnectProps {
  createCampagin: ICreateGampaignState;
}

interface IProps {
  getSelectProduct?: (data: CampaignCreate.IProductSelect[]) => void;
}

const ProductSelect: React.FC<IProps> = props => {
  const { getSelectProduct } = props;
  const dispatch = useDispatch();
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const products = useSelector((state: IPage) => state.createCampagin.products);
  const selectProduct = useSelector((state: IPage) => state.createCampagin.selectProduct);

  const selectsJsonString = JSON.stringify(selectProduct);
  const selectsArray = JSON.parse(selectsJsonString);

  const [asin, setAsin] = useState<string|'notRequest'>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<CampaignCreate.IProductSelect[]>(products);
  const [selects, setSelects] = useState<CampaignCreate.IProductSelect[]>(selectsArray);
  
  const {
    marketplace = 'US',
    id = 2,
  } = currentShop;

  useEffect(() => {
    setDataSource(products);
  }, [products]);

  // 请求数据
  useEffect(() => {
    // return;
    if (id === '-1' || asin === 'notRequest') {
      setLoading(false);
      return;
    }

    setLoading(true);
    const payload: any = { // eslint-disable-line
      headersParams: {
        StoreId: id,
      },
      country: '',
      sellerId: '',
      code: asin,
    };

    new Promise((resolve, reject) => {
      dispatch({
        type: 'createCampagin/getProductList',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      setLoading(false);
      const {
        code,
        message: msg,
      } = datas as {
        code: number;
        message: string;
        data: {
          records: CampaignCreate.IProductSelect[];
        };
      };
      if (code !== 200) {
        message.error(msg || '获取商品列表失败！');
      }
    });
  }, [id, dispatch, asin]);

  // 选中的数据放到dva中
  useEffect(() => {
    const temString = JSON.stringify(selects);
    const jsonArray = JSON.parse(temString);
    dispatch({
      type: 'createCampagin/setSelectProduct',
      payload: jsonArray,
    });
    getSelectProduct ? getSelectProduct(jsonArray as CampaignCreate.IProductSelect[]) : null;
  }, [dispatch, selects]); // eslint-disable-line
  
  // 删除单个
  const delItemSelect = (asin: string) => {
    for (let i = 0; i < selects.length; i++) {
      if (selects[i].asin === asin) {
        selects.splice(i, 1);
        setSelects([...selects]);
        break;
      }
    }
  };

  const getColumns = (type: 'leftColumns'|'rightColumns') => {
    return [
      {
        title: '商品信息',
        align: 'center',
        dataIndex: 'title',
        // key: 'title',
        width: 310,
        render(value: string, record: CampaignCreate.IProductSelect) {
          const {
            title = '',
            imgUrl = '',
            asin = '',
            price,
            sku,
          } = record;
          const titleLink = getAmazonAsinUrl(asin, marketplace);
  
          return <div className={styles.productCol}>
            <GoodsImg alt="商品" src={imgUrl} width={46}/>
            <div className={styles.details}>
              <a href={titleLink} className={styles.title} rel="noreferrer" target="_blank" title={title}>
                <Iconfont type="icon-lianjie" className={styles.linkIcon}/>
                {title}
              </a>
              <div className={styles.info}>
                <Link 
                  to={`${asinPandectBaseRouter}?asin=${asin}`} 
                  className={styles.asin}>
                  {asin}
                </Link>
                <span className={styles.ranking}>
                  <span className={styles.score}>
                    <ShowData value={record.reviewStars} fillNumber={1}/>
                  </span>
                  （<ShowData value={record.reviewNum} fillNumber={0}/>）
                </span>
                <span className={styles.price}><ShowData value={price} isCurrency/></span>
              </div>
              <p>{sku}</p>
            </div>
          </div>;
        },
      },
      {
        title: '库存',
        align: 'center',
        dataIndex: 'sellable',
        // key: 'sellable',
        render(val: number|string) {
          return <ShowData value={val} fillNumber={0}/>;
        },
      },
      {
        title: '排名',
        align: 'center',
        dataIndex: 'ranking',
        // key: 'ranking',
        render(val: string) {
          return <div>{[null, ''].includes(val) ? <ShowData value={null} /> : val}</div>;
        },
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'asin',
        // key: 'handle',
        width: 60,
        render(val: string, record: CampaignCreate.IProductSelect) {

          // 右边的表格
          if (type === 'rightColumns') {
            return <span 
              className={styles.handleCol}
              onClick={() => delItemSelect(val)}>
              删除
            </span>;
          }

          let flag = false;

          for (let i = 0; i < selects.length; i++) {
            const item = selects[i];
            if (item.asin === val) {
              flag = true;
              break;
            }
          }

          if (flag) {
            return <span 
              className={classnames(styles.handleCol, styles.selected)}>
              已选
            </span>;
          }
  
          return <span className={styles.handleCol} onClick={() => {
            selects.push(record);
            setSelects([...selects]);
          }}>选择</span>;
        },
      },
    ];
  };

  let leftCount = 0;
  const LeftTable = {
    columns: getColumns('leftColumns') as [],
    dataSource,
    rowKey(){
      return leftCount++;
    },
    loading,
    locale: {
      emptyText: <span className="secondaryText">店铺无商品</span>,
    },
    scroll: {
      y: 320,
    },
    pagination: false as false,
  };

  let rightCount = 0;
  const rightTable = {
    columns: getColumns('rightColumns') as [],
    dataSource: selects,
    rowKey(){
      // return record.asin;
      return rightCount++;
    },
    // loading,
    locale: {
      emptyText: <span className="secondaryText">左边添加商品</span>,
    },
    scroll: {
      y: 320,
    },
    pagination: false as false,
  };

  const searchProduct = (asin: string, event: any ) => { // eslint-disable-line
    // 这个条件限制当点击X图标时，不重新请求数据
    if (asin === '' && 'button' in event && event.target.className === 'ant-input') {
      setAsin('notRequest');
      return;
    }
    
    setAsin(asin);
  };

  // 全选
  const allSelect = () => {
    const maxSelect = 1000; // 商品最大选择的数量
    if (dataSource.length === 0 || dataSource.length === selects.length) {
      return;
    }

    if (dataSource.length > maxSelect) {
      message.warn(`当前店铺商品有${dataSource.length}个，最多添加${maxSelect}个商品，已为你选择前面${maxSelect}个，请知悉`);
      setSelects([...dataSource.slice(0, maxSelect)]);
      return;
    }

    setSelects([...dataSource]);
  };

  // 删除全部
  const delAllSelect = () => {
    if (selects.length === 0) {
      return;
    }
    setSelects([...[]]);
  };

  return <div className={styles.productSelect}>
    <div className={styles.layoutLeft}>
      <header className={styles.head}>
        <Input.Search
          autoComplete="off"
          placeholder="输入标题、ASIN或SKU" 
          enterButton={<Iconfont type="icon-sousuo" />} 
          className="h-search"
          allowClear
          onSearch={searchProduct}
        />
        <span style={{
          paddingRight: dataSource.length > 3 ? 36 : 20,
        }} className={classnames(
          styles.allSelect, 
          dataSource.length ? '' : styles.disable,
          dataSource.length > 0 && dataSource.length <= selects.length ? styles.disable : '',
        )}
        onClick={allSelect}
        >
          {dataSource.length && dataSource.length <= selects.length ? '已全选' : '全选'}
        </span>
      </header>
      <Table {...LeftTable} className={styles.table}/>
    </div>
    <div className={styles.layoutRight}>
      <header className={styles.head}>
        <span>已选商品</span>
        <span style={{
          paddingRight: selects.length > 3 ? 36 : 20,
        }} className={classnames(
          styles.delSelect, 
          selects.length ? '' : styles.disable,
        )} onClick={delAllSelect}>删除全部</span>
      </header>
      <Table {...rightTable} className={styles.table}/>
    </div>
  </div>;
};


export default ProductSelect;
