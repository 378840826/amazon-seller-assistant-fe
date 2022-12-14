import React, { useState, useEffect, useCallback } from 'react';
import { Iconfont } from '@/utils/utils';
import moment from 'moment';
import {
  useSelector,
  useDispatch,
  Link,
} from 'umi';


// 组件
import AutoComplete from './components/Complete';
import Express from './components/Express';
import Remind from './components/Remind';
import Frequency from './components/Frequency';
import { CheckOutlined } from '@ant-design/icons';
import TableNotData from '@/components/TableNotData';
import SwitchComponent from './components/Switch';
import Showdata from '@/components/ShowData';
import PageTitleRightInfo from '@/pages/components/PageTitleRightInfo';
import {
  Table,
  Select,
  Form,
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
  const [form] = Form.useForm();

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
  const [hint, setHint] = useState<string>('左上角添加需要监控的ASIN'); // 表格提示语

  const request = useCallback((params = { current: 1, size: 20 }) => {
    if (Number(currentShop.id) === -1) {
      return;
    }
    setDataSource([]);

    let payload = {
      headersParams: {
        StoreId: currentShop.id,
      },
    };

    payload = Object.assign({}, payload, params);

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/getMonitorList',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      setLoading(false);
      const {
        data,
        code,
        message: msg,
      } = datas as {
        code: number;
        message: string;
        data: MonitorType.IMonitorInitResponse;
      };

      if (code === 200) {
        if (isObject(data)) {
          setDataSource(data.records);
          setCurrent(data.current);
          setSize(data.size);
          setTotal(data.total);
        }
        return;
      }
      // 判断是否有筛选条件，就改变表格的提示语
      const fData = form.getFieldsValue();
      const flag = fData.monitorSwitch || fData.currentBuybox || fData.currentFollow;
      if (flag) {
        setHint('没有找到相关商品，请重新查询');
      } else {
        setHint(msg);
      }
      setTotal(0);
    });
  }, [dispatch, currentShop, form]);


  // 初始化参数
  useEffect(() => {
    request();
  }, [request, flag]);


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
      request({ current, size });
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
      emptyText: <TableNotData hint={hint}/>,
    },
    pagination: pageConfig,
  };


  const handleRemind = () => {
    setRemindState(!remindState);
  };

  const handleFrequency = () => {
    setFrequencyState(!frequencyState);
  };

  // 筛选
  const valuesChange = function() {
    const data = form.getFieldsValue();
    const params: {
      monitorSwitch?: boolean;
      currentBuybox?: boolean;
      currentFollow?: boolean;
      current: number;
      size: number;
    } = { current: 1, size: 20 };
    data.monitorSwitch ? params.monitorSwitch = data.monitorSwitch === 'true' : '';
    data.currentBuybox ? params.currentBuybox = data.currentBuybox === 'true' : '';
    data.currentFollow ? params.currentFollow = data.currentFollow === 'true' : '';
    
    request(params);
  };

  return (
    <div className={styles.monitor}>
      <PageTitleRightInfo functionName="跟卖监控"/>
      <header className={styles.head}>
        <div className={styles.leftLayout}>
          <PageTitleRightInfo functionName="跟卖监控"/>
          <AutoComplete successCallback={() => setFlag(!flag)}/>
          <Form layout="inline" onValuesChange={valuesChange} form={form}>
            <Form.Item name="monitorSwitch" className={styles.select}>
              <Select allowClear placeholder="监控开关">
                <Select.Option value={'true'}>已开启</Select.Option>
                <Select.Option value={'false'}>已暂停</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="currentBuybox" className={styles.select}>
              <Select allowClear placeholder="当前Buybox">
                <Select.Option value={'true'}>是Buybox</Select.Option>
                <Select.Option value={'false'}>非Buybox</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="currentFollow" className={styles.select}>
              <Select allowClear placeholder="当前被跟卖">
                <Select.Option value={'true'}>有跟卖</Select.Option>
                <Select.Option value={'false'}>无跟卖</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>

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
