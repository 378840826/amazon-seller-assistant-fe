/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-28 17:49:49
 * @FilePath: \amzics-react\src\layouts\AsinPandectLayout\index.tsx
 * 
 * 商品进来时用 ？page=plist 
 */ 
import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import munus from './routes';
import BasicLoyout from '../BasicLayout';
import { Iconfont } from '@/utils/utils';
import MySearch from '@/components/Search';
import { IConnectState } from '@/models/connect';
import classnames from 'classnames';
import TableNotData from '@/components/TableNotData';
import GoodsImg from '@/pages/components/GoodsImg';
import zhCN from 'antd/es/locale/zh_CN';
import {
  Link,
  useLocation,
  useSelector,
  useDispatch,
} from 'umi';
import {
  Select,
  Spin,
  message,
  ConfigProvider,
} from 'antd';


interface IAsinGlobal {
  asinGlobal: {
    asin: string;
  };
}

interface IAsinItemType {
  asin: string;
  imgLink: string;
  title: string;
  parentAsin: string;
  ranking: string;
  sellable: string;
  price: string;
}

const { Option } = Select;
let urlAsin = ''; // URL的search asin，用作比较
let localPage = ''; 
const AsinBase: React.FC = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const searchAsin = useSelector((state: IAsinGlobal) => state.asinGlobal.asin );
  const [currentModule, setCurrentModule] = useState('/asin/base'); // 当前的模块
  const [siblingAsins, setSiblingAsins] = useState<IAsinItemType[]>([]); // 兄弟ASIN下拉列表
  const [currentSelect, setCurrentSelect] = useState(''); // 选中的兄弟asin
  const [skuLoading, setAsinLoading] = useState<boolean>(false); // 兄弟asin loading;
  const [skuListVisible, setAsinListVisible] = useState<boolean>(false); // 是否显示sku下拉列表
  const [searchValue, setSearchValue] = useState<string>(''); // 搜索框内容
  const current = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const StoreId = current.id;
  const isAsin = useSelector((state: {
    asinGlobal: {
      isAsin: boolean;
    };
  }) => state.asinGlobal.isAsin);

  const storeAsin = useSelector((state: {
    asinGlobal: {
      asin: boolean;
    };
  }) => state.asinGlobal.asin);

  const getSiblingsAsin = useCallback((value = '') => {
    console.log('value:', value);
    new Promise((resolve, reject) => {
      const payload = {
        headersParams: {
          StoreId,
        },
        asin: value || storeAsin,
      };
      dispatch({
        type: 'asinGlobal/getSiblingsAsin',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      const { data } = datas as { data: IAsinItemType[]};
      setAsinLoading(false);

      if (Array.isArray(data) && data.length > 0) {
        let checkedSiblingsAsin = '';
        data.forEach(item => {
          if (item.asin === (value || storeAsin)) {
            checkedSiblingsAsin = item.asin;
          }
        });
        setCurrentSelect(checkedSiblingsAsin || data[0].asin);
        setSiblingAsins(data);
      } else {
        setCurrentSelect('');
        setSiblingAsins([]);
        setAsinListVisible(false);
      }
    });
  }, [dispatch, storeAsin, StoreId]);

  /**
   * 验证ASIN是否存在的请求体
   * flag 为true时 ,请求兄弟ASIN
   */
  const verifyAsin = useCallback((flag = false, value = urlAsin) => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'asinGlobal/getAsin',
        payload: {
          asin: value.trim(),
          headersParams: {
            StoreId,
          },
        },
        resolve,
        reject,
      });
    }).then(datas => {
      const { query } = location as {
        query?: {
          page: string;
          asin: string;
        };
        pathname: string;
      };
      const { data } = datas as {
        data: {
          asin: string;
        };
      };

      console.log(data.asin, 'data.asin');
      
      
      // 判断是否从商品列表页面过来
      if (flag || (query?.page && query.page === 'plist')) {
        setAsinListVisible(true);
        setAsinLoading(true);
        getSiblingsAsin(data.asin);
      } else {
        setAsinListVisible(false);
        setAsinLoading(false);
      }
    }).catch(err => {
      console.error(err);
    });
  }, [dispatch, StoreId, location]); // eslint-disable-line

  useEffect(() => {
    if (Number(current.id) !== -1) { //id有可能为0
      const { query, pathname } = location as {
        query?: {
          page: string;
          asin: string;
        };
        pathname: string;
      };

      setCurrentModule(pathname);
      
      if (query) {
        // 获取ASIN
        if (query.page && query.page === 'plist') {
          localPage = query.page;
        }
        
        if (query.asin) {
          urlAsin = query.asin;
          dispatch({
            type: 'asinGlobal/changeAsin',
            payload: {
              asin: query.asin,
            },
          });
        }
      }

      verifyAsin(true);
    }
  }, [dispatch, current, location, verifyAsin]);
  

  const handleChange = (value: string) => {
    setCurrentSelect(value);
    dispatch({
      type: 'asinGlobal/changeAsin',
      payload: {
        asin: value,
      },
    });
  };
 
  const onSearch = (value: string) => {
    if (searchValue.trim().length === 0) {
      message.error('请输入ASIN或者SKU');
      return false;
    }
    urlAsin = value; 

    verifyAsin(true);
  };

  // 回车搜索
  const onPressEnter = () => {
    if (searchValue.trim().length === 0) {
      message.error('请输入ASIN或者SKU');
      return false;
    }
    urlAsin = searchValue.trim(); 
    verifyAsin(true);
  };

  const LeftAdd = () => {
    
    const surplus = useSelector(({ user }: IConnectState) => {
      return user.currentUser.memberFunctionalSurplus;
    });

    const leftCount = surplus.find(item => item.functionName === '竞品监控')?.frequency || 0;
    return (
      <div className={styles.__left}>剩余可添加竞品：<span>{leftCount}个</span></div>
    );
  };

  if (isAsin) {
    return (
      <div>
        <BasicLoyout></BasicLoyout>
        <nav className={classnames(styles.head, { [styles.__left_header]: currentModule === '/asin/com-pro' }) }>
          <div>
            <span className={styles.classify}>ASIN总览</span>
            <Iconfont type="icon-zhankai" className={styles.arrow}></Iconfont>
            <span className={styles.asin}>{searchAsin}</span>
          </div>
          {currentModule === '/asin/com-pro' && <LeftAdd/>}
        </nav>
        <header className={styles.head_nav}>
          <div className={styles.navs}>
            {
              munus.map((item, i) => {
                const page = localPage ? '&page=plist' : '';
                if (item.path === currentModule) {
                  return <Link 
                    to={`${item.path}?asin=${storeAsin}${page}`}
                    key={i}
                    className="active"
                  >
                    {item.text}
                  </Link>;
                }
                return <Link to={`${item.path}?asin=${storeAsin}${page}`} key={i}>
                  {item.text}
                </Link>;
              })
            }
          </div>
          
          <div className={`${styles.filltrate} asin-filltrate-box`}>
            {
              skuListVisible ? 
                <Spin spinning={skuLoading}>
                  <Select
                    className={styles.downlist}
                    onChange={handleChange}
                    getPopupContainer={ () => document.querySelector('.asin-filltrate-box') as HTMLElement}
                    listHeight={500}
                    value={currentSelect}>
                    {
                      siblingAsins.map((item, i) => {
                        return <Option value={item.asin} key={i}>
                          <div className={styles.list}>
                            <GoodsImg className={styles.product} src={item.imgLink} width={28} alt=" " />
                            <div>
                              <p className={styles.title} title={item.title}>{item.title}</p>
                              <p className={styles.asin}>
                                {item.asin}
                                &nbsp;&nbsp;&nbsp;&nbsp; 父ASIN：{item.parentAsin ? item.parentAsin : '—' }
                              </p>
                              <p>
                                价格：{item.price ? item.price : '—' }
                                &nbsp; 库存：{item.sellable}
                                &nbsp; 排名：{item.ranking ? item.ranking : '—'}
                              </p>
                            </div>
                          </div>
                        </Option>;
                      })
                    }
                  </Select>
                </Spin> : ''
            }
            <MySearch 
              placeholder="搜索其他ASIN、SKU"
              value={searchValue}
              // loading={searchBtnLoading}
              onChange={(value) => setSearchValue(value)} 
              onSearch={onSearch}
              onPressEnter={onPressEnter}
            />
          </div>
        </header>
        <ConfigProvider locale={zhCN}>
          { props.children }
        </ConfigProvider>
      </div>
    );
  }

  return <div>
    <BasicLoyout></BasicLoyout>
    <nav className={styles.head }>
      <span className={styles.classify}>ASIN总览</span>
      <Iconfont type="icon-zhankai" className={styles.arrow}></Iconfont>
      <span className={styles.asin}>{storeAsin}</span>
    </nav>
    <header className={styles.head_nav}>
      <div className={styles.navs}>
        {
          munus.map((item, i) => {
            const page = localPage ? '&page=plist' : '';
            if (item.path === currentModule) {
              return <Link 
                to={`${item.path}?asin=${storeAsin}${page}`}
                key={i}
                className="active"
              >
                {item.text}
              </Link>;
            }
            return <Link to={`${item.path}?asin=${storeAsin}${page}`} key={i}>{item.text}</Link>;
          })
        }
      </div>
      
      <div className={`${styles.filltrate} asin-filltrate-box`}>
        <MySearch 
          placeholder="搜索其他ASIN、SKU"
          value={searchValue}
          onChange={(value) => setSearchValue(value)} 
          onSearch={onSearch}
          onPressEnter={onPressEnter}
        />
      </div>
    </header>
    <div className={styles.not_asin}>
      <TableNotData hint={`店铺无此ASIN或ASIN不存在`}/>
    </div>
  </div>;
};

export default AsinBase;
