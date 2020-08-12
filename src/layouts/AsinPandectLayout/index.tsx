/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-28 17:49:49
 * @FilePath: \amzics-react\src\layouts\AsinPandectLayout\index.tsx
 * 
 * 商品进来时用 ？page=plist 
 */ 
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import munus from './routes';
import BasicLoyout from '../BasicLayout';
import { Iconfont } from '@/utils/utils';
import MySearch from '@/components/Search';
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
}

const { Option } = Select;
let urlAsin = ''; // URL的search asin，用作比较
const AsinBase: React.FC = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  // const testref = useRef();
  
  const searchAsin = useSelector((state: IAsinGlobal) => state.asinGlobal.asin );
  const [currentModule, setCurrentModule] = useState('/asin/base'); // 当前的模块
  const [siblingAsins, setSiblingAsins] = useState<IAsinItemType[]>([]); // 兄弟ASIN下拉列表
  const [currentSelect, setCurrentSelect] = useState(''); // 选中的兄弟asin
  const [skuLoading, setAsinLoading] = useState<boolean>(true); // 兄弟asin loading;
  const [skuListVisible, setAsinListVisible] = useState<boolean>(true); // 是否显示sku下拉列表
  const [searchValue, setSearchValue] = useState<string>(''); // 搜索框内容
  const current = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const StoreId = current.id;
  // const [aaaa, setaaaa] = useState<boolean>(false);

  // 获取兄弟ASIN
  useEffect(() => {
    if (searchAsin && urlAsin && searchAsin !== urlAsin) {
      setAsinListVisible(true);
      new Promise((resolve, reject) => {
        dispatch({
          type: 'asinGlobal/getSiblingsAsin',
          resolve,
          reject,
          payload: {
            asin: searchValue,
            headersParams: {
              StoreId,
            },
          },
        });
      }).then(datas => {
        const { data } = datas as { data: IAsinItemType[]};
        setAsinLoading(false);

        if (Array.isArray(data) && data.length > 0) {
          setCurrentSelect(data[0].asin);
          setSiblingAsins(data);
        } else {
          setCurrentSelect('');
          setSiblingAsins([]);
        }
      });
    }
  }, [dispatch, searchAsin, current, StoreId]); // eslint-disable-line

  // useEffect(() => {
  //   if (testref.current) {
  //     setaaaa(false);
  //   }
  // }, [testref]);

  // 1. 当前路由
  // 2. 判断是不是从商品列表过来
  // 3. 获取ASIN,
  useEffect(() => {
    const { query, pathname } = location as {
      query?: {
        page: string;
        asin: string;
      };
      pathname: string;
    };
    setCurrentModule(pathname);

    if (query) {
      // 判断是否从商品列表页面过来
      if (query.page && query.page === 'plist') {
        setAsinListVisible(true);
      } else {
        setAsinListVisible(false);
      }

      // 获取ASIN
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

    //  登录接口(暂时)
    // dispatch({
    //   type: 'returnProduct/test',
    //   payload: {
    //     data: {
    //       email: '10086@qq.com',
    //       password: 'hello2020',
    //       rememberMe: true,
    //     },
    //   },
    // });
  }, [location, dispatch]);

  // useEffect(() => {
  //   console.log(current, 'xxxx');
  //   setaaaa(true);
  // }, [current]);
  

  const handleChange = (value: string) => {
    setCurrentSelect(value);
  };
 
  const onSearch = (value: string) => {
    if (value.length !== 10 || value[0].toUpperCase() !== 'B') {
      message.error('ASIN格式输入有误，请重新输入');
      return false;
    }
    // urlAsin = value; 

    dispatch({
      type: 'asinGlobal/getAsin',
      payload: {
        asin: value,
        callback: () => {
          setAsinListVisible(true);
        },
        headersParams: {
          StoreId,
        },
      },
    });
  };

  // 回车搜索
  const onPressEnter = () => {
    if (searchValue.length !== 10 || searchValue[0].toUpperCase() !== 'B') {
      message.error('ASIN格式输入有误，请重新输入');
      return false;
    }
    dispatch({
      type: 'asinGlobal/getAsin',
      payload: {
        asin: searchValue,
        callback: () => {
          setAsinListVisible(true);
        },
        headersParams: {
          StoreId,
        },
      },
    });
  };

  return (
    <div>
      <BasicLoyout></BasicLoyout>
      <nav className={styles.head }>
        <span className={styles.classify}>ASIN总览</span>
        <Iconfont type="icon-zhankai-copy" className={styles.arrow}></Iconfont>
        <span className={styles.asin}>{searchAsin}</span>
      </nav>
      <header className={styles.head_nav}>
        <div className={styles.navs}>
          {
            munus.map((item, i) => {
              if (item.path === currentModule) {
                return <Link 
                  to={`${item.path}?asin=${urlAsin}`}
                  key={i}
                  className="active"
                >
                  {item.text}
                </Link>;
              }
              return <Link to={`${item.path}?asin=${urlAsin}`} key={i}>{item.text}</Link>;
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
                          <img className={styles.product} src={item.imgLink}/>
                          <div>
                            <p className={styles.title}>{item.title}</p>
                            <p className={styles.asin}>{item.asin}</p>
                          </div>
                        </div>
                      </Option>;
                    })
                  }
                </Select>
              </Spin> : ''
          }
          <MySearch 
            placeholder="搜索其他ASIN" 
            value={searchValue}
            // loading={searchBtnLoading}
            onChange={(value) => setSearchValue(value)} 
            onSearch={onSearch} style={
              {
                marginRight: 20,
              }
            }
            onPressEnter={onPressEnter}
          />
        </div>
      </header>
      <ConfigProvider locale={zhCN}>
        {/* {
          aaaa ? <Spin spinning={aaaa}></Spin> : <>{ props.children }</>
        } */}
        { props.children }
      </ConfigProvider>
      
    </div>
  );
};

export default AsinBase;
