import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { DownOutlined } from '@ant-design/icons';
import { Link, useDispatch, useSelector } from 'umi';
import { Iconfont, storage } from '@/utils/utils';
import SearchDownList from './components/SearchDownList';
import TableNotData from '@/components/TableNotData';
import MySwitch from './components/MySwitch';
import sittingImg from '@/assets/stamp.png';
import {
  Button,
  Dropdown,
  Menu,
  Checkbox,
  Table,
  message,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';


const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const datas = useSelector((state: CommectMonitor.IConnectType) => state.commectSettings.datas);
  const [starIsVisible, setStartIsVisible] = useState<boolean>(false); // 是否显示星级
  const [dataSource, setDataSource] = useState<[]>([]);
  const [pageTotal, setPageTotal] = useState<number>(0); // 分页数量
  const [pageCurrent, setPageCurrent] = useState<number>(1); // 分页当前页
  const [pageSize, setPageSize] = useState<number>(20); // 分页默认大小
  const [tableLoadingStatus, setTableLoadingStatus] = useState<boolean>(true); // 表格是否显示loading
  const [currentShop, setCurrentShop] = useState<CommectMonitor.ICurrentShopType>(storage.get('currentShop')); // 当前选中店铺
  const [oneStar, setOneStar] = useState<boolean>(true); // 提醒星级设置1星
  const [twoStar, setTwoStar] = useState<boolean>(true); // 提醒星级设置2星
  const [threeStar, setThreeStar] = useState<boolean>(false); // 提醒星级设置3星
  const [fourStar, setFourStar] = useState<boolean>(false); // 提醒星级设置4星
  const [fiveStar, setFiveStar] = useState<boolean>(false); // 提醒星级设置5星
  const [asyncGetview] = useState<boolean>(true); // 用作 提醒星级设置获取
  const [searchComponent, setSearchComponent] = useState<boolean>(false); // 是否重置搜索框内容
  const current = useSelector((state: CommectMonitor.IGlobalType) => state.global.shop.current);

  // 点击设置星级提醒
  const setStar = (flag: boolean) => {
    setStartIsVisible(flag);
  };

  useEffect(() => {
    if (current.id === '-1') {
      return;
    }
    setTableLoadingStatus(true);
    setCurrentShop(current as CommectMonitor.ICurrentShopType);
    setSearchComponent(true);
    const headersParams = {
      StoreId: current.id,
    };
    dispatch({
      type: 'commectSettings/getCommectMonitorSetList',
      payload: {
        data: {
          current: pageCurrent,
          size: pageSize,
          headersParams,
        },
      },
    });
  }, [dispatch, pageCurrent, pageSize, current]);

  // 获取星级提醒
  useEffect(() => {
    if (current.id === '-1') {
      return;
    }
    
    new Promise((resolve, reject) => {
      dispatch({
        type: 'commectSettings/getreviewRemindStar',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: current.id,
          },
        },
      });
    }).then(datas => {
      const { code, data } = datas as { code: number; data: {} };
      if (code === 200) {
        const {
          oneStar,
          twoStar,
          threeStar,
          fourStar,
          fiveStar,
        } = data as {
          oneStar: boolean;
          twoStar: boolean;
          threeStar: boolean;
          fourStar: boolean;
          fiveStar: boolean;
        };
        setOneStar(oneStar);
        setTwoStar(twoStar);
        setThreeStar(threeStar);
        setFourStar(fourStar);
        setFiveStar(fiveStar);
      }
    });
  }, [dispatch, asyncGetview, current]);

  // 分页变化、其它筛选时 antd的scrollToFirstRowOnChange无效、手动更改
  useEffect(() => {
    const dom = document.querySelector('.ant-table-body');
    if (dom) {
      dom.scrollTop = 0;
    }
  }, [dataSource]);

  // 接收表格数据
  useEffect(() => {
    setTableLoadingStatus(false);
    if (!datas.code) {
      return;
    }
    const { message: msg } = datas as { message?: string };

    if (datas.code === 200) {
      const { data } = datas;
      setDataSource(data.records);
      setPageSize(data.size);
      setPageTotal(data.total);
      setPageCurrent(data.current);
    } else {
      message.error(msg || 'OOP! 网络有点问题~');
    }
  }, [datas]);

  // 修改评论提醒
  const handleMenuClick = (param = {}, type = 0) => {
    new Promise((resolve, reject) => {
      const payload = {
        oneStar,
        twoStar,
        threeStar,
        fourStar,
        fiveStar,
        headersParams: {
          StoreId: current.id,
        },
      };
      Object.assign(payload, param);
      dispatch({
        type: 'commectSettings/setreviewRemindStar',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      const { code } = datas as {code: number; data: []};
      if (code === 200) {
        message.success('操作成功!');
      } else {
        // 失败的处理
        switch (type) {
        case 1:
          setOneStar(oneStar);
          break;
        case 2:
          setTwoStar(twoStar);
          break;
        case 3:
          setThreeStar(threeStar);
          break;
        case 4:
          setFourStar(fourStar);
          break;
        case 5:
          setFiveStar(fiveStar);
          break;
        default:
          break;
        } 
        message.error('操作失败！');
      }
    });
  };

  // 提醒星级设置修改 1星
  const changeOneStar = (e: CheckboxChangeEvent) => {
    const value = e.target.checked;
    setOneStar(value);
    handleMenuClick({ oneStar: value });
  };

  // 提醒星级设置修改 2星
  const changeTwoStar = (e: CheckboxChangeEvent) => {
    const value = e.target.checked;
    setTwoStar(value);
    handleMenuClick({ twoStar: value });
  };

  // 提醒星级设置修改 3星
  const changeThreeStar = (e: CheckboxChangeEvent) => {
    const value = e.target.checked;
    setThreeStar(value);
    handleMenuClick({ threeStar: value });
  };

  // 提醒星级设置修改 4星
  const changeFourStar = (e: CheckboxChangeEvent) => {
    const value = e.target.checked;
    setFourStar(value);
    handleMenuClick({ fourStar: value });
  };

  // 提醒星级设置修改 5星
  const changeFiveStar = (e: CheckboxChangeEvent) => {
    const value = e.target.checked;
    setFiveStar(value);
    handleMenuClick({ fiveStar: value });
  };

  // 评论提醒菜单 
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Checkbox 
          checked={oneStar} 
          onChange={changeOneStar}>1星
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="2">
        <Checkbox
          onChange={changeTwoStar}
          checked={twoStar}>2星
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="3">
        <Checkbox
          onChange={changeThreeStar}
          checked={threeStar}>3星
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="4">
        <Checkbox
          onChange={changeFourStar}
          checked={fourStar}>4星
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="5">
        <Checkbox
          onChange={changeFiveStar}
          checked={fiveStar}>5星
        </Checkbox>
      </Menu.Item>
    </Menu>
  );
  
  const columns = [
    {
      title: ' 监控开关',
      dataIndex: 'monitoringSwitch',
      key: 'monitoringSwitch',
      align: 'center',
      width: '15%',
      render(value: boolean, row: CommectMonitor.IRowDataType) {
        const { asin } = row.productInfo;
        return <MySwitch checked={value} asin={asin} />;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
      width: '15%',
      render(value: string) {
        let date = '';
        let time = '';
        if (value) {
          date = moment(value).format('YYYY-MM-DD');
          time = moment(value).format('HH:mm:ss');
        }
        return (
          <div>
            {date}
            <br />
            {time}
          </div>
        );
      },
    },
    {
      title: '商品信息',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
      width: '25%',
      render(value: string, row: CommectMonitor.IRowDataType) {
        const { 
          asin,
          imgLink,
          title,
          titleLink,
          price,
          fulfillmentChannel,
        } = row.productInfo;
        return (
          <div className={styles.product_cols}>
            <img src={imgLink || sittingImg} alt=""/>
            <div className={styles.product_box}>
              <a href={ titleLink }
                title={title} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.title}
              >
                <Iconfont 
                  type="icon-lianjie" 
                  className={styles.icon}
                />
                {title}
              </a>
              <div className={styles.details}>
                <span className={styles.asin}>{asin}</span>
                <p>
                  <span className={styles.price}>
                    {currentShop.currency}{price}
                  </span>
                  <span className={styles.line}></span>
                  <span className={`${fulfillmentChannel}`}>{fulfillmentChannel}</span>
                </p>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Reviews',
      dataIndex: 'reviewNum',
      key: 'reviewNum',
      align: 'center',
      width: '15%',
      render(value: string, row: CommectMonitor.IRowDataType) {
        return (<div className={styles.monitor}>
          {row.reviewScore || 0} 
          <span>({row.reviewNum || 0})</span>
        </div>);
      },
    },
    {
      title: '监控次数',
      dataIndex: 'monitoringNumber',
      key: 'monitoringNumber',
      align: 'center',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'reviewScore',
      align: 'center',
      width: '15%',
      render(value: string, row: CommectMonitor.IRowDataType) {
        const { asin = '' } = row.productInfo;
        return <div>
          <Link to={{
            pathname: '/review/monitor',
            search: `asin=${asin}`,
          }} target="_blank" className={styles.look}>查看</Link>
        </div>;
      },
    },
  ];
  
  // 分页配置
  const pageConfig = {
    pageSizeOptions: ['20', '50', '100'],
    total: pageTotal,
    pageSize: 20,
    current: pageCurrent,
    showQuickJumper: true, // 快速跳转到某一页
    showTotal: (total: number) => `共 ${total} 个`,
    onChange(current: number, size: number | undefined){
      setPageCurrent(current);
      setPageSize(size as number);
    },
    onShowSizeChange(current: number, size: number | undefined){
      console.log(current, size,);
    },
    className: 'h-page-small',
  };

  // 表格配置
  let count = 0;
  const tableConfig = {
    dataSource: dataSource as [],
    loading: tableLoadingStatus,
    rowKey() {
      return count++;
    },
    locale: {
      emptyText: <TableNotData hint="左上角添加需要监控的ASIN"/>,
    },
    pagination: pageConfig,
    scroll: {
      y: 'calc(100vh - 280px)',
    },
  };

  // 添加一条监控评论成功后的回调
  const successCb = () => {
    const headersParams = {
      StoreId: current.id,
    };
    dispatch({
      type: 'commectSettings/getCommectMonitorSetList',
      payload: {
        data: {
          current: 1,
          size: 20,
          headersParams,
        },
      },
    });
  };  

  return (
    <div className={`${styles.settings_box} settings`}>
      <header>
        <div className={styles.search}>
          <SearchDownList callback={successCb} reset={searchComponent} />
        </div>
        <div className="downlist" style={{
          width: 108,
        }}>
          <Dropdown 
            overlay={menu}
            onVisibleChange={setStar}
            visible={starIsVisible} >
            <Button>
              评论提醒 <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </header>
      <main>
        <Table {...tableConfig} 
          columns={columns as []} 
        />
      </main>
    </div>
  );
};

export default Settings;
