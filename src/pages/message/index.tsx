import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.less';
import Pagination from '@/components/Pagination';
import ReviewTemplate from './components/ReviewTemplate';
import { useDispatch, useSelector } from 'umi';
import { ClickParam } from 'antd/lib/menu';
import { 
  Badge,
  Spin, 
  Menu,
} from 'antd';

let shopCount = 0;
const MessageAll: React.FC = () => {
  const dispatch = useDispatch();
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true); // 列表的loading条件
  const [dataList, setDataList] = useState<[]>([]);
  const [pageTotal, setPageTotal] = useState<number>(0); // 总数量
  const [pageSize, setPageSize] = useState<number>(20); // 页数大小
  const [pageCurrent, setPageCurrent] = useState<number>(1); // 当前页
  // 导航默认值 也可以用来判断是哪一个接口的数据，格式不同，渲染不同， 
  // all是全部消息的接口
  // review 是监控评论的接口
  const [menuDefault, setMunuDefault] = useState<string>('all');
  // 异步全部消息
  const allMessage = useSelector((state: Message.IStateType) => state.messageModel.allMessage);
  // 异步监控评论消息
  const reviewMessage = 
    useSelector(({ messageModel }: Message.IStateType) => messageModel.reviewMessage);
  // 未读消息
  const notCount = useSelector((state: Message.IGlobalNotCount) => {
    return state.global.unreadNotices;
  });
  const currentShop = useSelector((state: Message.IGlobalCurrent) => state.global.shop.current);
  
  // 接收全部消息数据
  useEffect(() => {
    const { code } = allMessage;
    // 默认对象无code ,所以是undefined，异步成功后会有code
    if (code) {
      setLoadingFlag(false);
    } else {
      return;
    }
    // 成功
    if (code && code === 200) {
      const { 
        data: { 
          records,
          size,
          current,
          total,
        },
      } = allMessage;
      setDataList(records);
      setPageTotal(total);
      setPageSize(size);
      setPageCurrent(current);
    }
  }, [allMessage]);

  // 接收监控评论列表数据
  useEffect(() => {
    const { code } = reviewMessage;
    // 默认对象无code ,所以是undefined，异步成功后会有code
    if (code) {
      setLoadingFlag(false);
    } else {
      return;
    }

    // 成功
    if (code && code === 200) {
      const { 
        data: { 
          records,
          size,
          current,
          total,
        },
      } = reviewMessage;
      setDataList(records);
      setPageTotal(total);
      setPageSize(size);
      setPageCurrent(current);
    }
  }, [reviewMessage]);

  // 全部消息请求
  const getAllMessage = useCallback((current = 1, size = 20) => {
    if (currentShop.id <= 0) { 
      return;
    }

    dispatch({
      type: 'messageModel/getAllMessageList',
      payload: {
        data: {
          current,
          size,
        },
        head: {
          headersParams: {
            StoreId: currentShop.id,
          },
        },
      },
    });
  }, [dispatch, currentShop]);

  // 监控评论提醒请求
  const getReviewMessage = useCallback((current = 1, size = 20) => {
    if (currentShop.id <= 0) { 
      return;
    }

    dispatch({
      type: 'messageModel/getReviewMessageList',
      payload: {
        size,
        current,
        head: {
          headersParams: {
            StoreId: currentShop.id,
          },
        },
      },
    });
  }, [dispatch, currentShop]);

  // 店铺切换时
  useEffect(() => {
    if (shopCount > 1) {
      getAllMessage(1, 20);
    } else {
      shopCount++;
    }
  }, [currentShop, getAllMessage]);

  useEffect( () => {
    if (menuDefault === 'all') {
      getAllMessage();
    } else if (menuDefault === 'review') {
      getReviewMessage();
    }
  }, [menuDefault, getAllMessage, getReviewMessage]);

  // 分页回调
  const pageCallback = (current: number, size: number) => {
    setPageCurrent(current);
    setPageSize(size);

    if (menuDefault === 'all') {
      getAllMessage(current, size);
    }
    if (menuDefault === 'review') {
      getReviewMessage(current, size);
    }
  };

  // 导航改变时
  const handleClickMenu = (e: ClickParam) => {
    const key = e.key;
    setMunuDefault(key);
    setLoadingFlag(true);
  };

  return (
    <div className={styles.message_box}>
      <Spin spinning={loadingFlag} size="large" style={{ fontSize: 40, marginTop: 100 }}>
        <div className={styles.message}>
          <nav>
            <span>消息中心</span>
          </nav>

          <header >
            <Menu onClick={handleClickMenu} 
              selectedKeys={[menuDefault]} 
              mode="horizontal" 
              className={styles.menu}
            >
              <Menu.Item key="all">
                <span className={styles.text}>全部消息</span>
                <Badge count={notCount.allUnReadCount} 
                  overflowCount={99} 
                  className={styles.badge} />
              </Menu.Item>
              <Menu.Item key="review">
                <span className={styles.text}>评论提醒</span>
                <Badge 
                  count={notCount.reviewRemindCount} 
                  overflowCount={99} className={styles.badge} />
              </Menu.Item>
              {/* <Menu.Item key="followUp">
                <span className={styles.text}>跟卖提醒</span>
                <Badge count={55555} overflowCount={10000} className={styles.badge} />
              </Menu.Item> */}
            </Menu>
          </header>

          <main className={styles.list}>
            {
              // 全部消息
              menuDefault === 'all' ?
                dataList.map((item, index) => {
                  const { type } = item;
                  if (type === 'review') {
                    return <ReviewTemplate item={item} key={index} />;
                  } else if (type === 'followUp') {
                    return '';
                  }
                })
                : ''
            }
            {
              // 评论提醒(rivew消息)
              menuDefault === 'review' ?
                dataList.map((item, index) => {
                  return <ReviewTemplate item={item} key={index} />;
                })
                : ''
            }
            
          </main>
          <footer>
            <Pagination 
              current={pageCurrent} 
              total={pageTotal} 
              pageSize={pageSize} 
              callback={pageCallback} 
            />
          </footer>
        </div>
      </Spin>
    </div>
  );
};


export default MessageAll;
