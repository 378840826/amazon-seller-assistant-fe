import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { isObject } from '@/utils/huang';
import moment from 'moment';
import { 
  useLocation,
  useDispatch,
  useSelector,
  Location,
  Link,
} from 'umi';
import {
  Table,
} from 'antd';
import GoodsImg from '@/pages/components/GoodsImg';
import TableNotData from '@/components/TableNotData';
import Snav from '@/components/Snav';
import { competitorMonitorRouter, competitorListRouter } from '@/utils/routes';
import ShowData from '@/components/ShowData';

interface ILocation extends Location {
  query: {
    id: string;
    historyId: string;
  };
}

interface IProps {
  location: {
    state: {
      productInfo: MonitorType.IMontorRowProduct;
    };
  };
}

const History: React.FC<IProps> = () => {
  const localtion = useLocation() as ILocation;
  const dispatch = useDispatch();
  const { id } = localtion.query;

  // store
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  // state 
  const [dataSource, setDataSource] = useState<MonitorType.IHistoryRecordsType[]>([]);
  const [asinInfo, setAsinInfo] = useState<MonitorType.IMontorRowProduct| null>(null);
  const [monitorNum, setMonitorNum] = useState<number>(0); // 监控数量
  const [current, setCurrent] = useState<number>(1); // 当前分页
  const [size, setSize] = useState<number>(20); // 分页大小
  const [loading, setLoading] = useState<boolean>(true);


  const navList: Snav.INavList[] = [
    {
      label: '监控列表',
      path: competitorMonitorRouter,
      type: 'Link',
    },
    {
      label: '跟卖历史',
      type: '',
    },
  ];

  
  useEffect(() => {
    if (Number(currentShop.id) === -1 || !id) {
      return;
    }
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/getHistoryList',
        resolve,
        reject,
        payload: {
          followMonitorId: id,
          current,
          size,
          headersParams: {
            StoreId: currentShop.id,
          },
        },
      });
    }).then(datas => {
      const {
        data,
      } = datas as MonitorType.IHistoryTableType;

      setLoading(false);
      if (isObject(data)) {
        setAsinInfo(data.productInfo);
        setDataSource(data.page.records);
        setMonitorNum(data.page.total);
        setCurrent(data.page.current);
        setSize(data.page.size);
      }
    });
  }, [currentShop, dispatch, localtion, current, size, id]);
  
  const columns = [
    {
      dataIndex: 'snapshotTime',
      align: 'center',
      title: '快照时间',
      render(val: number) {
        const datetime = moment(val);
        const date = datetime.format('YYYY-MM-DD');
        const time = datetime.format('HH:mm:ss');
        return <div className={styles.datetime}>
          <p>{date}</p>
          <p>{time}</p>
        </div>;
      },
    },
    {
      dataIndex: 'followQuantity',
      align: 'center',
      title: '跟卖数量',
    },
    {
      dataIndex: 'buyboxSeller',
      align: 'center',
      title: 'Buybox卖家',
      render(val: string, { buyboxSellerLink }: { buyboxSellerLink: string}) {
        if ( val === '' || val === ' ' || val === null) {
          return '—';
        }
        return <a href={buyboxSellerLink} rel="noreferrer" target="_blank">{val}</a>;
      },
    },
    {
      dataIndex: 'buyboxSellerId',
      align: 'center',
      title: '卖家ID',
      render(val: number|string) {
        if ( val === '' || val === ' ' || val === null) {
          return '—';
        }
        return val;
      },
    },
    {
      dataIndex: 'buyboxFulfillmentChannel',
      align: 'center',
      title: 'Buybox发货方式',
      render(val: number|string) {
        if ( val === '' || val === ' ' || val === null) {
          return '—';
        }
        return val;
      },
    },
    {
      dataIndex: 'buyboxPrice',
      align: 'center',
      title: 'Buybox价格 + 运费',
      render(val: number, rows: {buyboxShippingFee: number|string; buyboxPrice: number}) {
        const {
          buyboxShippingFee,
          buyboxPrice,
        } = rows;
        // 运费没有时为0
        return <div style={{ whiteSpace: 'nowrap' }}>
          <ShowData value={buyboxPrice} isCurrency/>
           &nbsp; + &nbsp;
          <ShowData value={buyboxShippingFee} isCurrency/>
        </div>;
      },
    },
    {
      dataIndex: 'id',
      align: 'center',
      title: '操作',
      render(_id: string) {
        return <Link className={styles.ListLink} to={{
          pathname: competitorListRouter,
          search: `?id=${_id}`,
        }}>跟卖列表</Link>;
      },
    },
  ];

  // 分页配置
  const pageConfig = {
    pageSizeOptions: ['20', '50', '100'],
    total: monitorNum,
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

  // 表格配置
  let rowKeyCount = 0;
  const tableConfig = {
    columns: columns as [],
    dataSource,
    bordered: true,
    loading,
    locale: {
      emptyText: <TableNotData hint="该ASIN还没有历史记录"/>,
    },
    rowKey() {
      return rowKeyCount++;
    },
    scroll: {
      y: 'calc(100vh - 278px)',
    },
    pagination: pageConfig,
  };

  return (
    <div className={styles.vessel}>
      <Snav navList={navList} style={{
        padding: '15px 0',
      }} />
      <div className={styles.box}>
        <div className={styles.layoutLeft}>
          <GoodsImg src={asinInfo?.imgUrl || ''} className={styles.img} alt="商品" width={112} />
          <div style={{
            display: monitorNum > 0 ? 'block' : 'none',
          }}>
            <a 
              className={styles.title} 
              href={`${getAmazonAsinUrl(asinInfo?.asin || '', currentShop.marketplace)}`}
              rel="noopener noreferrer" 
              target="_blank"
              title={asinInfo?.title}
            >
              <Iconfont className={styles.icon} type="icon-lianjie" />
              {asinInfo?.title}
            </a>
            <p className={styles.details}>
              <span className={styles.text}>Asin：</span> 
              <span className={styles.content}>{asinInfo?.asin}</span>
            </p>
            <p className={styles.details}>
              <span className={styles.text}>价格：</span>
              <span className={styles.content}><ShowData value={asinInfo?.price} isCurrency/></span>
            </p>
            <p className={styles.details}>
              <span className={styles.text}>发货方式：</span>
              <span className={styles.content}>{asinInfo?.fulfillmentChannel}</span>
            </p>
          </div>
        </div>
        <div className={styles.layoutRight}>
          <header>
            已监控{monitorNum}次
          </header>
          <Table {...tableConfig}/>
        </div>
      </div>
    </div>
  );
};


export default History;
