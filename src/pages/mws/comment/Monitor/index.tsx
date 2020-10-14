/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-02 15:57:07
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\mws\comment\Monitor\index.tsx
 * 
 * 评论监控
 */ 
'user stairt';
import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.less';
import './index.css';
import { ColumnsType } from 'antd/lib/table';
import { Iconfont } from '@/utils/utils';
import emptyImg from '@/assets/stamp.png';
import moment from 'moment';
import TableNotData from '@/components/TableNotData';
import Toolbar from './components/Toolbar';
import { storage } from '@/utils/utils';
import SignHandle from './components/SignHandle';
import { getRangeDate } from '@/utils/huang';
import SortComponent from './components/Sort';
import {
  Link,
  useDispatch,
  connect,
  ConnectRC,
  Dispatch,
  useSelector,
  useLocation,
} from 'umi';

import {
  Table,
  Rate,
  Tooltip,
  Progress,
  message,
  Spin,
} from 'antd';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


interface ICommentMonitorList {
  code: number;
  data: {
    total: number;
    current: number;
    size: number;
    pages: number;
    records: [];
  };
}

let requestHeader = {};
const Monitor: ConnectRC<CommectMonitor.IPageProps> = ({ commentTableData }) => {
  const dispatch: Dispatch = useDispatch();
  const location = useLocation() as CommectMonitor.ILocation;
  const query = location.query;
  const { asin = '' } = query as { asin: string };
  const [dataSource, setDataSource] = useState<{recores?: {}}[]>([]); // 表格数据
  const [pageTotal, setPageTotal] = useState<number>(0); // 分页数量
  const [pageCurrent, setPageCurrent] = useState<number>(1); // 分页当前页
  const [pageSize, setPageSize] = useState<number>(20); // 分页默认大小
  const [loading, setLoading] = useState<boolean>(true); // 是否加载中
  const { start, end } = getRangeDate(30, false);
  const [dateStart] = useState<string>(start);
  const [dateEnd] = useState<string>(end);
  const { storeName } = storage.get('currentShop') as API.IShop; // 当前选中店铺
  const current = useSelector((state: CommectMonitor.IGlobalType) => state.global.shop.current);
  const [currentOrder, setCurrentOrder] = useState(''); // 当前排序的列字段

  // 初始化请求数据
  const requestData: CommectMonitor.IRequestDataType = {
    stars: [1, 2, 3],
    status: 'all',
    current: pageCurrent,
    size: pageSize,
    dateStart,
    dateEnd,
    headersParams: {
      StoreId: current.id,
    },
  };

  // 设定过来筛选
  asin ? requestData.asin = asin : delete requestData.asin;

  const requestBody = useCallback(( params = {}): void => {
    setLoading(true);
    const isempty = Boolean(Object.keys(params).length); // 判断对象是否为空
    if (isempty) {
      requestHeader = Object.assign({}, requestData, requestHeader, params);
    } else {
      requestHeader = Object.assign({}, requestData, params);
    }
    
    new Promise((resolve, reject) => {
      dispatch({
        type: 'commentMonitor/getCommentList',
        payload: {
          data: requestHeader,
          resolve,
          reject,
        },
      });
    }).then((datas) => {
      setLoading(false);
      const { code, data: { 
        records,
        size,
        total,
        current,
      } } = datas as ICommentMonitorList;
      if ( code === 200) {
        setDataSource(records);
        setPageSize(size);
        setPageTotal(total);
        setPageCurrent(current);
      } else {
        message.error('列表异常！');
      }
    }).catch(err => {
      setLoading(false);
      console.error(err, '首次加载出错');
    });
  }, [dispatch, dateStart, dateEnd]);// eslint-disable-line

  // 加载
  useEffect(() => {
    // 店铺未加载完毕时不请求
    if (Number(current.id) === -1 ) {
      return;
    }
    const headersParams = {
      StoreId: current.id,
    };

    requestBody({ headersParams });
  }, [current, requestBody]);

  // 分页变化、其它筛选时 antd的scrollToFirstRowOnChange无效、手动更改
  useEffect(() => {
    const dom = document.querySelector('.ant-table-body');
    if (dom) {
      dom.scrollTop = 0;
    }
  }, [dataSource]);

  useEffect(() => {
    if (commentTableData.code === 200) {
      setDataSource(commentTableData.data.records as [] );
    }
  }, [commentTableData]);

  // 下载列表
  const download = (data: {}) => {
    new Promise((resolve, reject) => {
      const headersParams = {
        StoreId: current.id,
      };

      dispatch({
        type: 'commentMonitor/downLoadComment',
        payload: {
          resolve,
          reject,
          data: Object.assign({}, data, { headersParams }),
        },
      });
    }).then(res => { 
      const content = res as BlobPart;
      const blob = new Blob([content], {
        type: 'application/octet-stream;charset=utf-8',
      });
      const fileName = `${storeName}_评论.xlsx`;
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    }).catch(err => {
      message.error(err.toString() || '导出错误！');
    });
  };

  // 接收工具栏的参数
  const handleToolbar = (fields: {}, type: string) => {
    const data = Object.assign(requestData, requestHeader, fields);
    
    if (type === 'download') {
      // 下载
      download(data);
    } else {
      // 列表
      setLoading(true);
      requestBody(data);
    }
  };

  const handleOrder = (obj: { value: string; order: string|boolean }) => {
    setCurrentOrder(obj.value);
    const objs = {
      order: obj.value,
      asc: obj.order,
    };

    const data = Object.assign(requestData, requestHeader, objs);
    setLoading(true);
    requestBody(data);
  };

  const columns: ColumnsType = [
    {
      title: <SortComponent 
        title="日期" 
        isTabBoolean
        defaultSort="asc"
        orderValue={currentOrder} 
        value="reviewTime" 
        callback={handleOrder} />,
      dataIndex: 'reviewTime',
      key: 'name',
      align: 'center',
      width: '100px', 
      render(value) {
        return (
          <div className={styles.date}>
            {value}
          </div>
        );
      },
    }, {
      title: <SortComponent 
        title="星级" 
        isTabBoolean 
        value="star"
        defaultSort="asc"
        orderValue={currentOrder} 
        callback={handleOrder} />,
      dataIndex: 'star',
      key: 'age',
      align: 'center',
      width: '150px',
      render(value) {
        return <Rate 
          allowHalf 
          disabled 
          defaultValue={value}
          style={{
            color: '#ffaf4d',
            opacity: 1,
            marginLeft: 10,
          }}
          className={styles.star} />;
      },
    }, {
      title: '评论内容',
      dataIndex: 'reviewContent',
      key: 'reviewContent',
      align: 'center',
      width: 330,
      className: styles.commect_content,
      render(value, rowData){
        const data = rowData as {reviewLink: string};
        const reviewerLink = data.reviewLink;
        return (
          <div className={styles.commect_content} >
            <a href={reviewerLink} title={value} target="_blank" rel="noopener noreferrer">
              <Iconfont type="icon-lianjie" style={{
                fontSize: 12,
                color: '#888',
                marginRight: 2,
              }} />
              {value}
            </a>
          </div>
        );
      },
    }, {
      title: '用户笔名',
      dataIndex: 'reviewerName',
      key: 'reviewerName',
      align: 'center',
      width: 140,
      render(value, row) {
        const { reviewerLink } = row as { reviewerLink: string };
        return (
          <a 
            href={ reviewerLink }
            className={styles.username}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0083ff',
              fontSize: 12,
            }}>
            {value}
          </a>
        );
      },
    }, {
      title: '商品信息',
      dataIndex: 'asin',
      key: 'asin',
      align: 'center',
      width: 250,
      render(asin, rowData) {
        interface IDataType {
          reviewContent: string;
          imgLink: string;
          title: string;
          titleLink: string;
        }
        const data = rowData as IDataType;
        const title = data.title;
        const titleLink = data.titleLink;
        return (
          <div className={styles.product_info}>
            <img src={data.imgLink || emptyImg as string}/>
            <div>
              <Tooltip 
                getPopupContainer={() => document.querySelector('.monitor_box') as HTMLElement}
                title={ title }>
                <a href={titleLink} target="_blank" rel="noopener noreferrer">
                  <Iconfont type="icon-lianjie" 
                    style={{
                      fontSize: 12,
                      color: '#888',
                      marginRight: 2,
                    }} />
                  {title || ''} &nbsp;
                </a>
              </Tooltip>
              <p>{asin}</p>
            </div>
          </div>
        );
      },
    }, {
      title: <SortComponent 
        title="Review" 
        isTabBoolean
        defaultSort="asc"
        orderValue={currentOrder} 
        value="reviewNum" 
        callback={handleOrder} />,
      dataIndex: 'reviewScore',
      key: 'reviewScore',
      align: 'center',
      width: 120, 
      render(value, row) {
        const { reviewScore, reviewNum } = row as CommectMonitor.IRowDataType;
        return (
          <div className={styles.reviewScore}>
            { reviewScore }
            <span>（{reviewNum}）</span>
          </div>
        );
      },
    }, {
      title: '星级分布',
      key: 'starPart',
      align: 'center',
      width: 320,
      render(value, row) {
        const { starPart } = row as CommectMonitor.IRowDataType;
        return (
          <div className={`${styles.start_distribute} clearfix`}>
            <div className={styles.layout_one_row}>
              <div>
                {
                  starPart.fiveStarLink ? <a 
                    href={ starPart.fiveStarLink } 
                    rel="noopener noreferrer" 
                    target="_blank" 
                    className={styles.title}>5星</a>
                    : '5星'
                }
                <Tooltip title={ `${starPart.five * 100 } %` }>
                  <Progress percent={ starPart.five * 100 } strokeColor="#ffaf4d" showInfo={false} />
                </Tooltip>
              </div>
              <div>
                {
                  starPart.fourStarLink ? <a 
                    href={ starPart.fourStarLink } 
                    rel="noopener noreferrer" 
                    target="_blank" 
                    className={styles.title}>4星</a>
                    : '4星'
                }
                <Tooltip title={ `${starPart.four * 100 } %`}>
                  <Progress percent={ starPart.four * 100 } strokeColor="#ffaf4d" showInfo={false} />
                </Tooltip>
              </div>
            </div>
            <div className={styles.layout_two_row}>
              <div>
                { 
                  starPart.threeStarLink ? <a 
                    href={ starPart.threeStarLink } 
                    rel="noopener noreferrer" 
                    target="_blank" 
                    className={styles.title}>3星</a>
                    : '3星'
                }
                <Tooltip title={ `${starPart.three * 100 } %` }>
                  <Progress percent={ starPart.three * 100 } strokeColor="#ffaf4d" showInfo={false} />
                </Tooltip>
              </div>
              <div>
                {
                  starPart.twoStarLink ? <a 
                    href={ starPart.twoStarLink } 
                    rel="noopener noreferrer" 
                    target="_blank" 
                    className={styles.title}>2星</a>
                    : '2星'
                }
                <Tooltip title={ `${starPart.two * 100 } %` }>
                  <Progress percent={ starPart.two * 100 } strokeColor="#ffaf4d" showInfo={false} />
                </Tooltip>
              </div>
            </div>
            <div className={styles.layout_three_row}>
              {
                starPart.oneStarLink ? <a 
                  href={ starPart.oneStarLink } 
                  rel="noopener noreferrer" 
                  target="_blank" 
                  className={styles.title}>1星</a>
                  : '1星'
              }
              <Tooltip title={ `${starPart.one * 100 } %` }>
                <Progress percent={ starPart.one * 100 } strokeColor="#ffaf4d" showInfo={false} />
              </Tooltip>
            </div>
          </div>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'address',
      align: 'center',
      width: 120,
      render(value, row) {
        const { 
          handled,
          hasOrder,
          asin,
          reviewerName,
        } = row as CommectMonitor.IRowDataType;
        return (
          <div className={styles.handleBth}>
            <SignHandle id={value} status={handled}></SignHandle>
            {
              // 是否有匹配订单
              hasOrder ?
                <Link target="_blank" to={{
                  pathname: '/order',
                  search: `?asin=${asin}&buyer=${reviewerName}`,
                }} className={styles.hasOrder}>匹配订单</Link>
                : ''
            }
          </div>
        );
      },
    },
  ];

  // 分页配置
  const pageConfig = {
    pageSizeOptions: ['20', '50', '100'],
    total: pageTotal,
    pageSize,
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

  const tableConfig = {
    dataSource,
    locale: {
      emptyText: <TableNotData hint="没有找到相关评论，请重新选择筛选条件"/>,
    },
    columns: columns as [],
    rowClassName: () => styles.rowStyle,
    pagination: pageConfig,
    scroll: { 
      y: 'calc(100vh - 370px)', 
    },
    className: 'h-scroll',
  };

  return (
    <div className={`${styles.monitor_box} monitor_box `}>
      <Spin spinning={loading} >
        <Toolbar asin={asin} handleToolbar={handleToolbar}/>
        <div className={styles.content}>
          <Table 
            key="id" rowKey="id" 
            {...tableConfig}
          />
        </div>
      </Spin>
    </div>
  );
};

function mapStatetoProps({ commentMonitor }: {commentMonitor: {}}) {
  return commentMonitor;
}

export default connect(mapStatetoProps)(Monitor) ;
