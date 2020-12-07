import React, { useState, useEffect } from 'react';
import { Iconfont } from '@/utils/utils';
import moment from 'moment';
import {
  useSelector,
  useDispatch,
  Link,
} from 'umi';


// 组件
import SearchComponent from './components/SearchDownList';
import Express from './components/Express';
import Remind from './components/Remind';
import Frequency from './components/Frequency';
import { CheckOutlined } from '@ant-design/icons';
import TableNotData from '@/components/TableNotData';
import SwitchComponent from './components/Switch';
import Showdata from '@/components/ShowData';
import {
  Table,
} from 'antd';

// 私
import styles from './index.less';
import './global.less';
import GoodsImg from '@/pages/components/GoodsImg';
import { isObject } from '@/utils/huang';
import { getAmazonAsinUrl } from '@/utils/utils';
import { competitorHistoryRouter } from '@/utils/routes';


const Monitor: React.FC = () => {
  const dispatch = useDispatch();

  // store
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  // state
  const [dataSource, setDataSource] = useState<MonitorType.IMonitorDataSource[]>([]);
  const [current, setCurrent] = useState<number>(1); // 当前分页
  const [size, setSize] = useState<number>(20); // 分页大小
  const [total, setTotal] = useState<number>(0); // 总量
  const [loading, setLoading] = useState<boolean>(true);
  const [remindState, setRemindState] = useState<boolean>(false); // Remind组件
  const [frequencyState, setFrequencyState] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false); // 重新渲染的state


  // 初始化参数
  useEffect(() => {
    if (Number(currentShop.id) === -1) {
      return;
    }
    setDataSource([]);

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/getMonitorList',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
          current,
          size,
        },
      });
    }).then(datas => {
      setLoading(false);
      const {
        data,
      } = datas as {
        data: MonitorType.IMonitorInitResponse;
      };
      if (isObject(data)) {
        setDataSource(data.records);
        setCurrent(data.current);
        setSize(data.size);
        setTotal(data.total);
      }
    });
  }, [currentShop, dispatch, current, size, flag]);

  // 搜索框回调
  const searchCallback = () => {
    setFlag(!flag);
  };

  const columns = [
    {
      dataIndex: 'monitorSwitch',
      title: ' 监控开关',
      align: 'center',
      render(val: boolean, { id }: {id: string}) {
        return <SwitchComponent checked={val} id={id} StoreId={currentShop.id}/>;
      },
    },
    {
      dataIndex: 'updateTime',
      title: '更新时间',
      align: 'center',
      render(dates: string) {
        const datetime = moment(dates);
        const date = datetime.format('YYYY-MM-DD');
        const time = datetime.format('HH:mm:ss');
        return <>
          <p>{date}</p>
          <p>{time}</p>
        </>;
      },
    },
    {
      dataIndex: 'productInfo',
      title: '商品信息',
      align: 'center',
      width: 500,
      render (productInfo: MonitorType.IMontorRowProduct) {
        const {
          asin,
          fulfillmentChannel,
          price,
          title,
          imgUrl,
        } = productInfo;
        
        return <div className={styles.product_col}>
          <GoodsImg src={imgUrl} className={styles.img} alt="商品" width={46} />
          <div className={styles.details}>
            <a 
              className={styles.title} 
              href={getAmazonAsinUrl(asin || '', currentShop.marketplace)} 
              rel="noopener noreferrer" 
              target="_blank"
              title={title}
            >
              <Iconfont className={styles.icon} type="icon-lianjie" />
              {title}
            </a>
            <footer>
              <span className={styles.sku}>{asin}</span>
              <p className={styles.right}>
                <span className={styles.price}>
                  <Showdata value={price} isCurrency/>
                </span>
                <Express method={fulfillmentChannel} style={{
                  paddingLeft: 10,
                }}/>
              </p>
            </footer>
          </div>
        </div>;
      },
    },
    {
      dataIndex: 'monitorCount',
      title: '监控次数',
      align: 'center',
    },
    {
      dataIndex: 'currentBuybox',
      title: '当前Buybox',
      align: 'center',
      render(val: string) {
        return (val && <CheckOutlined />) || '';
      },
    },
    {
      dataIndex: 'currentFollow',
      title: '当前被跟卖',
      align: 'center',
      render(val: boolean) {
        return (val && <CheckOutlined />) || '';
      },
    },
    {
      dataIndex: 'id',
      title: '操作',
      align: 'center',
      render(id: string) {
        return <Link className={styles.history} to={{
          pathname: competitorHistoryRouter,
          search: `id=${id}`,
        }}>历史</Link>;
      },
    },
  ];

  const pageConfig = {
    pageSizeOptions: ['20', '50', '100'],
    total: total,
    pageSize: size,
    current: current,
    showSizeChanger: true, // 分页选择器
    showQuickJumper: true, // 快速跳转到某一页
    showTotal: (total: number) => `共 ${total} 个`,
    onChange(current: number, size: number | undefined){
      setCurrent(current);
      setSize(size as number);
    },
    onShowSizeChange(current: number, size: number | undefined){
      setCurrent(current);
      setSize(size as number);
    },
    className: 'h-page-small',
  };

  let rowKuyCount = 0;
  const tableConfig = {
    columns: columns as [],
    dataSource,
    loading,
    rowKey() {
      return rowKuyCount++;
    },
    scroll: {
      y: 'calc(100vh - 265px)',
    },
    locale: {
      emptyText: <TableNotData hint="左上角添加需要监控的ASIN"/>,
    },
    pagination: pageConfig,
  };


  const handleRemind = () => {
    setRemindState(!remindState);
  };

  const handleFrequency = () => {
    setFrequencyState(!frequencyState);
  };

  return (
    <div className={styles.monitor}>
      <header className={styles.head}>
        <SearchComponent callback={searchCallback}/>
        <div className={styles.btns}>
          <Remind flag={remindState} cb={handleFrequency} />
          <Frequency cb={handleRemind} flag={frequencyState} />
        </div>
      </header>

      <main className={styles.table}>
        <Table {...tableConfig} bordered ></Table>
      </main>
    </div>
  );
};

export default Monitor;
