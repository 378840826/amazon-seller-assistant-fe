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
} from 'umi';
import {
  Table,
} from 'antd';
import GoodsImg from '@/pages/components/GoodsImg';
import TableNotData from '@/components/TableNotData';
import Snav from '@/components/Snav';
import { competitorHistoryRouter, competitorMonitorRouter } from '@/utils/routes';
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

const List: React.FC<IProps> = () => {
  const localtion = useLocation() as ILocation;
  const dispatch = useDispatch();
  const { id } = localtion.query;
  
  // store
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  // state 
  const [historyId, setHistoryId] = useState<string>('');
  const [dataSource, setDataSource] = useState<MonitorType.IHistoryRecordsType[]>([]);
  const [asinInfo, setAsinInfo] = useState<MonitorType.IMontorRowProduct| null>(null);
  const [followNum, setFollowNum] = useState<number>(0); // 跟卖者数量
  const [current, setCurrent] = useState<number>(1); // 当前分页
  const [size, setSize] = useState<number>(20); // 分页大小
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (Number(currentShop.id) === -1 || !id) {
      return;
    }

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/getFollowList',
        resolve,
        reject,
        payload: {
          followMonitorHistoryId: id,
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
      } = datas as MonitorType.IFollowTableType;
      setLoading(false);
      
      if (isObject(data)) {
        setAsinInfo(data.productInfo);
        setDataSource(data.page.records);
        //产品那边要求卖家id相同的只能算一个卖家, 我在跟卖者列表接口新加了一个字段 followQuantity
        // 跟卖者列表的跟卖者个数就用这个字段了, 你那边啥时候有空麻烦改一下吧
        setFollowNum(data.followQuantity || 0);
        setCurrent(data.page.current);
        setSize(data.page.size);
        setHistoryId(data.productInfo.followMonitorId);
      }
    });
  }, [dispatch, currentShop, current, size, id]);

  const navList: Snav.INavList[] = [
    {
      label: '跟卖监控',
      path: competitorMonitorRouter,
      type: 'Link',
    },
    {
      label: '跟卖历史',
      path: competitorHistoryRouter,
      type: 'Link',
      search: `?id=${historyId}`,
      state: {
        productInfo: asinInfo,
      },
    },
    {
      label: '跟卖者列表',
      type: '',
    },
  ];
  
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
      dataIndex: 'sellerName',
      align: 'center',
      title: '卖家名称',
      render(val: string, { sellerLink }: { sellerLink: string}) {
        if ( val === '' || val === null) {
          return '—';
        }
        return <a href={sellerLink} rel="noreferrer" target="_blank">{val}</a>;
      },
    },
    {
      dataIndex: 'sellerId',
      align: 'center',
      title: '卖家ID',
      render(val: number|string) {
        if ( val === '' || val === null) {
          return '—';
        }
        return val;
      },
    },
    {
      dataIndex: 'fulfillmentChannel',
      align: 'center',
      title: '发货方式',
      render(val: number|string) {
        if ( val === '' || val === null) {
          return '—';
        }
        return val;
      },
    },
    {
      dataIndex: 'price',
      align: 'center',
      title: '价格 + 运费',
      render(val: number, rows: {price: number|string; shippingFee: number}) {
        const {
          price,
          shippingFee,
        } = rows;
        // 运费没有时为0
        return <div style={{ whiteSpace: 'nowrap' }}>
          <ShowData value={price} isCurrency />
           &nbsp; + &nbsp;
          <ShowData value={shippingFee} isCurrency />
        </div>;
      },
    },
    {
      dataIndex: 'productType',
      align: 'center',
      title: '商品类型',
    },
  ];

  // 分页配置
  const pageConfig = {
    pageSizeOptions: ['20', '50', '100'],
    total: followNum,
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
      emptyText: <TableNotData hint="没有发现跟卖者"/>,
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
          <a 
            className={styles.title} 
            href={`${getAmazonAsinUrl(asinInfo?.asin || '', currentShop.marketplace ) }`}
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
        <div className={styles.layoutRight}>
          <header>
            跟卖者{followNum}个
          </header>
          <Table {...tableConfig}/>
        </div>
      </div>
    </div>
  );
};


export default List;
