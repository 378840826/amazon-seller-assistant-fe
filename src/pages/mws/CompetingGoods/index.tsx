import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { productListRouter, ruleAddRouter } from '@/utils/routes';
import classnames from 'classnames';
import { isFormal } from '@/utils/huang';


import { 
  useDispatch, 
  useSelector, 
  ConnectProps, 
  ICompetingGoodsModelState,
  useLocation,
  Location,
  history,
} from 'umi';
import HoldImg from '@/assets/stamp.png';
import { Iconfont } from '@/utils/utils';
import Recommend from './Recommend';
import SelectRecommend from './SelectRecommend';
import Snav from '@/components/Snav';
import SearchResult from './SearchResult';
import mySkip from './Skip';
import {
  Button,
  Input,
  message,
  Popconfirm,
  Spin,
} from 'antd';


interface IPage extends ConnectProps {
  competingGoods: ICompetingGoodsModelState;
}

interface ILocation extends Location {
  query: {
    id: string;
  };
}

const CompetingGoods: React.FC = () => {
  const {
    id: StoreId,
    currency,
    marketplace,
  } = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const initvalue = useSelector((state: IPage) => state.competingGoods.initvalue);
  const recommends = useSelector((state: IPage) => state.competingGoods.recommends);
  const chosens = useSelector((state: IPage) => state.competingGoods.chosens);
  const dispatch = useDispatch();
  const location = useLocation();
  const leftLayoutList = useRef(null) as React.MutableRefObject<null|HTMLDivElement>;
  // 搜索ASIN值
  const [asininfo, setAsininfo] = useState<CompetingGoods.ICompetingOneData|null|string>(null); 
  const [searchValue, setSearchValue] = useState<string>(''); // ASIN值
  const [showsearch, setShowSearch] = useState<boolean>(false); // 是否显示搜索
  const [addbtnclass, setAddBtnClass] = useState<boolean>(false); // 左边推荐竞品是否有滚动条， 有(true) fase没有

  const { query: { id: pid } } = location as ILocation;

  const navList: Snav.INavList[] = [
    {
      label: '商品列表',
      path: productListRouter,
      type: 'Link',
    },
    {
      label: '竞品设定',
      type: '',
    },
  ];

  useEffect(() => {
    if (StoreId === '-1') {
      return;
    }
    dispatch({
      type: 'competingGoods/getCompetingsGoods',
      payload: {
        productId: pid,
        headersParams: {
          StoreId,
        },
      },
    });
    
  }, [dispatch, pid, StoreId]);

  // 监听右边是否有滚动条
  function handleAllBtnPadding () {
    if (leftLayoutList.current) {
      if (leftLayoutList.current.offsetWidth - leftLayoutList.current.clientWidth ) {
        //onsole.log('有滚动条');
        setAddBtnClass(true);
      } else {
        // console.log('没有滚动条');
        setAddBtnClass(false);
      }

      window.addEventListener('resize', () => {
        if (leftLayoutList.current) {
          if (leftLayoutList.current.offsetWidth - leftLayoutList.current.clientWidth ) {
            setAddBtnClass(true);
          } else {
            setAddBtnClass(false);
          }
        }
      });
    }
  }

  useEffect(() => {
    handleAllBtnPadding();
  }, [leftLayoutList, recommends]);

  // 搜索
  const searchAsin = (value: string) => {
    const msg = '请输入正确的ASIN';
    let requestUrl = '';

    if (value === '') {
      return;
    }

    if (value.length < 10) {
      message.error(msg);
      return;
    }
    
    if (value.slice(0, 2) !== 'B0') {
      message.error(msg);
      return;
    }

    if (typeof initvalue !== 'string' && initvalue?.asin === value) {
      message.error('不可设定商品本身为竞品');
      return;
    }

    setAsininfo(null);
    // 根据正式版和测试版，根据爬虫要求提供不同的请求地址 https://con.workics.cn/pages/viewpage.action?pageId=127569230
    if (isFormal()) {
      requestUrl = `/compete/search?asin=${value}&site=${marketplace}`;
    } else {
      requestUrl = `/compete/search?asin=${value}&site=${marketplace}`;
    }

    setShowSearch(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'competingGoods/getSearchAsin',
        payload: requestUrl,
        resolve,
        reject,
      });
    }).then(datas => {
      const {
        data,
        msg = '',
      } = datas as {
        data: CompetingGoods.ISearchAsinInfo;
        msg?: string;
      };
      message.config({
        duration: 6,
        maxCount: 1,
      });

      if (msg === 'Oops! There is something wrong with the network. Please try again later') {
        setAsininfo(msg);
      } else {
        if (data.seller_name === '' || data.price === '') {
          message.error('该商品目前不在售，建议选择在售商品');
        }
  
        const newData: any = {}; // eslint-disable-line
        newData.imgUrl = data.pictures[0];
        newData.title = data.title;
        newData.asin = data.asin;
        newData.brand = data.brand_name;
        newData.reviewNum = data.review_info.review_count;
        newData.reviewScope = data.review_info.review_avg_star;
        newData.categoryRank = data.large_category[0] ? data.large_category[0].ranking : '';
        newData.categoryName = data.large_category[0] ? data.large_category[0].name : '';
        newData.sellerName = data.delivery_method;
        newData.price = data.price;
        newData.fulfillmentChannel = data.prdelivery_methodice;
        setAsininfo({ ...newData });
      }

      
    });
  };

  // 全选
  const addAll = () => {
    if (recommends.length > 10) {
      message.error('最多只能添加10个竞品');
      return;
    }

    if (chosens.length >= 10) {
      message.error('最多只能添加10个竞品');
      return;
    }
    
    dispatch({
      type: 'competingGoods/changeChosens',
      payload: recommends,
    });
  };

  const delAllChosens = () => {
    dispatch({
      type: 'competingGoods/delChosenItem',
      index: 'delAll',
    });
  };

  // 全选状态
  const getAddAllBtnStatus = () => {
    let isAllSelect = true; // 是否已全选
    const chosensTem: string[] = [];

    chosens.forEach(item => {
      chosensTem.push(item.asin);
    });

    for (let i = 0; i < recommends.length; i++) {
      const item = recommends[i];

      if (chosensTem.indexOf(item.asin) === -1) {
        isAllSelect = false;
      }
    }

    // 没有推荐竞品
    if (recommends.length === 0) {
      isAllSelect = false;
    }

    if (isAllSelect) {
      return <Button 
        style={{
          marginRight: addbtnclass ? 20 : 10,
        }}
        className={classnames(
          styles.addBtn,
          styles.allSelectBtn,
        )}>已全选</Button>;
    }

    return <Button style={{
      marginRight: addbtnclass ? 20 : 10,
    }} className={styles.addBtn} onClick={addAll}>全选</Button>;
  };


  // 全部删除按钮状态
  const getdelAllbtnStatus = () => {
    if (chosens.length === 0) {
      return <Button className={classnames(styles.delBtn, styles.disabled)}>全部删除</Button>;
    }
    return <Popconfirm
      title="删除竞品后，此商品将无法按竞品调价，继续删除？"
      onConfirm={delAllChosens}
      okText="继续"
      cancelText="取消"
      placement="left"
      className={styles.delIcon}
    >
      <Button className={styles.delBtn}>全部删除</Button>
    </Popconfirm>;
  };

  // 保存
  const save = () => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'competingGoods/saveChosens',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId,
          },
          productId: pid,
          competitors: chosens,
        },
      });
    }).then(datas => {
      const {
        message: msg,
      } = datas as {
        message: string;
      };
  
      if (msg === '设定成功') {
        mySkip({
          title: msg || '设定成功',
        });
      } else {
        message.error(msg || '保存失败！');
      }
    });
  };

  if (initvalue === null) {
    return <div className={styles.initBox}>
      <Spin size="large"></Spin>
    </div>;
  }

  if (typeof initvalue === 'string') {
    return <div className={styles.initBox}>
      <div className={styles.notProduct}>
        <img src={require('@/assets/notFind.png')} alt=""/>
        {initvalue}
      </div>
    </div>;
  }

  if (initvalue === undefined) {
    return <h2 style={{
      padding: 50,
      textAlign: 'center',
    }}>数据异常</h2>;
  }

  return <div className={styles.cpBox}>
    <Snav navList={navList}></Snav>
    <header className={styles.parenthead}>
      <div className={styles.oneLayout}>
        <div className={styles.productInfo}>
          <img src={initvalue.imgLink || HoldImg} className={styles.img} alt=""/>
          <div className={styles.asinDetails}>
            <a href={initvalue.link} 
              className={styles.title} 
              target="_blank" 
              rel="noreferrer"
              title={initvalue.title}
            >
              <Iconfont type="icon-lianjie" className={styles.linkIcon}/>{initvalue.title}
            </a>
            <p className={styles.asinSku}>
              <span className={styles.asin1}>{initvalue.asin}</span>
              <span className={styles.sku}>{initvalue.sku}</span>
            </p>
          </div>
        </div>
        <Input.Search 
          placeholder="请输入ASIN" 
          className={classnames(
            styles.search, 
            'h-search',
            searchValue.length === 0 ? styles.disable : '',
          )}
          onSearch={searchAsin}
          value={searchValue}
          size="large"
          enterButton={<Iconfont type="icon-sousuo" />}
          onChange={e => setSearchValue(e.target.value)}
        />
      </div>
      <div className={classnames(
        styles.twoLayout,
        showsearch ? '' : 'none',
      )} >
        <SearchResult asininfo={asininfo}/>
      </div>
    </header>

    <main className={styles.content}>
      <div className={classnames(styles.leftLayout)}>
        <header>
          <strong>推荐竞品</strong>
          { getAddAllBtnStatus() }
        </header>
        <div className={classnames(styles.list, 'h-scroll')} ref={leftLayoutList}>
          {recommends.map((item, i) => {
            return <Recommend key={i} data={item} currency={currency} marketplace={marketplace}/>;
          })}
        </div>
      </div>
      <div className={classnames(styles.rightLayout)}>
        <header>
          <strong>已选竞品</strong>
          {getdelAllbtnStatus()}
        </header>
        <div className={classnames(styles.list, 'h-scroll')}>
          {chosens.map((item, i) => {
            return <SelectRecommend 
              index={i} key={i} 
              data={item} 
              currency={currency} 
              marketplace={marketplace}
            />;
          })}
        </div>
      </div>
    </main>
  
    <footer className={styles.fooBtns}>
      <Button 
        className={classnames(styles.btn, styles.cancel)} 
        onClick={() => history.push(productListRouter)}
      >
        取 消
      </Button>
      <Button type="primary" onClick={save} className={classnames(styles.btn)}>保存</Button>
      <Button 
        type="link" 
        className={classnames(styles.btn, styles.AddRuleBtn)}
        onClick={() => history.push(ruleAddRouter)}
      >
        创建规则 <Iconfont type="icon-zhankai" className={styles.link}/>
      </Button>
    </footer>
  </div>;
};

export default CompetingGoods;
