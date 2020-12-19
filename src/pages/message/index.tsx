import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.less';
import ReviewTemplate from './ReviewTemplate';
import FollowComponent from './Follow';
import { useDispatch, useSelector } from 'umi';
import { ClickParam } from 'antd/lib/menu';
import { isObject, isEmptyObj } from '@/utils/huang';
import TableNotData from '@/components/TableNotData';
import { 
  Badge,
  Spin, 
  Menu,
  Pagination,
  message,
} from 'antd';

const MessageAll: React.FC = () => {
  const dispatch = useDispatch();
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true); // 列表的loading条件
  const [dataList, setDataList] = useState<[]>([]); // 保存各个类型的消息
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
  // 异步监控评论消息
  const followMessage = 
    useSelector(({ messageModel }: Message.IStateType) => messageModel.followMessage);
  // 未读消息
  const notCount = useSelector((state: Message.IGlobalNotCount) => {
    return state.global.unreadNotices;
  });
  const currentShop = useSelector((state: Message.IGlobalCurrent) => state.global.shop.current);
  const [emptydata, setEmptyData] = useState<boolean>(false); // 数据是否为空
  
  // 接收全部消息数据
  useEffect(() => {
    if (!isEmptyObj(allMessage) && isObject(allMessage)) {
      setEmptyData(false);
      setLoadingFlag(false);
      // 成功
      const { 
        records,
        size,
        current,
        total,
      } = allMessage;
      setDataList(records);
      setPageTotal(total);
      setPageSize(size);
      setPageCurrent(current);
    } else if (!isObject(allMessage)) {
      message.error('暂无消息！');
      setEmptyData(true);
      setLoadingFlag(false);
    }
  }, [allMessage]);

  // 接收监控评论列表数据
  useEffect(() => {
    if (!isEmptyObj(reviewMessage) && isObject(reviewMessage)) {
      setEmptyData(false);
      setLoadingFlag(false);
      // 成功
      const { 
        records,
        size,
        current,
        total,
      } = reviewMessage;
      setDataList(records);
      setPageTotal(total);
      setPageSize(size);
      setPageCurrent(current);
      // 没有消息时
      if (records.length === 0) {
        setEmptyData(true);
      }
    }
  }, [reviewMessage]);

  // 接收跟卖消息数据列表
  useEffect(() => {
    if (!isEmptyObj(followMessage) && isObject(followMessage)) {
      setEmptyData(false);
      setLoadingFlag(false);

      // 成功
      const { 
        records,
        size,
        current,
        total,
      } = followMessage;
      setDataList(records);
      setPageTotal(total);
      setPageSize(size);
      setPageCurrent(current);

      // 没有消息时
      if (records.length === 0) {
        setEmptyData(true);
      }
    }
  }, [followMessage]);

  // 全部消息请求
  const getAllMessage = useCallback((current = 1, size = 20) => {
    setLoadingFlag(true);
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
    setLoadingFlag(true);
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

  // 监控跟卖消息请求
  const getFollowMessage = useCallback((current = 1, size = 20) => {
    setLoadingFlag(true);
    dispatch({
      type: 'messageModel/getFollowMessage',
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

  // 导航条切换
  useEffect( () => {
    if (currentShop.id <= 0) { 
      return;
    }

    // 由于全部消息为空时返回的是{code: 500; message: '暂无消息'}
    // 切换时做初始化数据，避免再切换到全部消息时，useEffect无法接收消息
    dispatch({
      type: 'messageModel/changeAllMessage',
      payload: {
        data: {},
      },
    });

    if (menuDefault === 'all') {
      getAllMessage();
    } else if (menuDefault === 'review') {
      getReviewMessage();
    } else if (menuDefault === 'follow') {
      getFollowMessage();
    }
  }, [dispatch, menuDefault, getAllMessage, getReviewMessage, getFollowMessage, currentShop]);

  // 分页配置
  const pageConfig = {
    pageSizeOptions: ['20', '50', '100'],
    total: pageTotal,
    pageSize: pageSize,
    current: pageCurrent,
    showSizeChanger: true, // 分页选择器
    showQuickJumper: true, // 快速跳转到某一页
    showTotal: (total: number) => `共 ${total} 个`,
    onChange(current: number, size: number | undefined){
      const myCurrent = pageSize === size ? current : 1; // 切换分页器时回到第一页
      setPageCurrent(current);
      setPageSize(size as number);

      if (menuDefault === 'all') {
        getAllMessage(myCurrent, size);
      } else if (menuDefault === 'review') {
        getReviewMessage(myCurrent, size);
      } else if (menuDefault === 'follow') {
        getFollowMessage(myCurrent, size);
      }
    },
    onShowSizeChange(current: number, size: number | undefined){
      setPageCurrent(current);
      setPageSize(size as number);
    },
    className: 'h-page-small',
  };

  // 导航改变时
  const handleClickMenu = (e: ClickParam) => {
    const key = e.key;
    setPageTotal(0);
    setPageCurrent(1);
    setPageSize(20);
    setDataList([]);
    setLoadingFlag(true);
    setMunuDefault(key);
  };

  return (
    <div className={styles.message_box}>
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
            <Menu.Item key="follow">
              <span className={styles.text}>跟卖提醒</span>
              <Badge 
                count={notCount.followUnReadCount} 
                overflowCount={99} 
                className={styles.badge} 
              />
            </Menu.Item>
          </Menu>
        </header>

        <main className={`${styles.list} h-scroll`} style={{
          display: emptydata ? 'none' : 'block',
        }}>
          <Spin spinning={loadingFlag} style={{
            marginTop: 30,
          }}>
            {
              // 全部消息
              menuDefault === 'all' ?
                dataList.map((item: Message.IAllMessage, index) => {
                  const { type } = item;
                  if (type === 'review') {
                    return <ReviewTemplate item={item.review} key={index} />;
                  } else if (type === 'follow') {
                    return <FollowComponent data={item.follow} key={index} />;
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
            {
              // 跟卖消息
              menuDefault === 'follow' ?
                dataList.map((item, index) => {
                  return <FollowComponent data={item} key={index} />;
                })
                : ''
            }
          </Spin>
        </main>
        <TableNotData hint="暂无消息" style={{
          display: emptydata ? 'block' : 'none',
        }} />
        <footer style={{
          display: emptydata ? 'none' : 'block',
        }}>
          <Pagination {...pageConfig} />
        </footer>
      </div>
    </div>
  );
};


export default MessageAll;
