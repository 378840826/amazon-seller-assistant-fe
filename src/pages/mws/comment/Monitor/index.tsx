/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-02 15:57:07
 * @FilePath: \amzics-react\src\pages\mws\comment\Monitor\index.tsx
 * 
 * 评论监控
 */ 
'user stairt';
import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.less';
import { ColumnsType } from 'antd/lib/table';
import { Iconfont } from '@/utils/utils';
import GoodsImg from '@/pages/components/GoodsImg';
import moment from 'moment';
import TableNotData from '@/components/TableNotData';
import Toolbar from './components/Toolbar';
import { storage } from '@/utils/utils';
import SignHandle from './components/SignHandle';
import { getRangeDate } from '@/utils/huang';
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
import ShowData from '@/components/ShowData';
moment.locale('zh-cn');

interface ICommentMonitorList {
  code: number;
  message: string;
  data: {
    asc: null|boolean;
    order: string;
    total: number;
    current: number;
    size: number;
    pages: number;
    records: [];
  };
}

interface ISortedInfo {
  order: 'ascend' | 'descend'; // 升序降序
  columnKey: string; // 排序字段
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
  const [sortedInfo, setSortedInfo] = useState<ISortedInfo|null>(null);

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
      const { code, data, message: msg } = datas as ICommentMonitorList;
      if ( code === 200) {
        const { 
          records,
          size,
          total,
          current,
          asc,
          order,
        } = data;

        let myAsc = null;
        setDataSource(records);
        setPageSize(size);
        setPageTotal(total);
        setPageCurrent(current);
        if (asc === null) {
          myAsc = null;
        } else if (asc === true) {
          myAsc = 'ascend';
        } else if (asc === false) {
          myAsc = 'descend';
        }
        setSortedInfo({
          ...{
            columnKey: order,
            order: myAsc,
          },
        } as ISortedInfo);
      } else {
        message.error(msg || '列表加载异常！');
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

    requestBody({ headersParams, current: 1, size: 20 });
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


  const columns: ColumnsType = [
    {
      title: '日期',
      dataIndex: 'reviewTime',
      key: 'reviewTime',
      align: 'center',
      width: '100px', 
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'reviewTime' ? sortedInfo?.order : null,
      showSorterTooltip: false,
      render(value) {
        return (
          <div className={styles.date}>
            {value}
          </div>
        );
      },
    }, {
      title: '星级',
      dataIndex: 'star',
      key: 'star',
      align: 'center',
      width: '150px',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'star' ? sortedInfo?.order : null,
      showSorterTooltip: false,
      render(value) {
        return <Rate 
          allowHalf 
          disabled 
          value={value}
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
      align: 'left',
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
      title: '回复',
      dataIndex: 'comments',
      key: 'comments',
      align: 'center',
      width: 140,
      render: (val: number) => <ShowData value={val} fillNumber={0} />,
    }, {
      title: '用户笔名',
      dataIndex: 'reviewerName',
      key: 'reviewerName',
      align: 'left',
      width: 140,
      className: styles.reviewerName,
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
            <GoodsImg src={data.imgLink} className={styles.img} alt="商品" width={46} />
            <div>
              <a href={titleLink} target="_blank" rel="noopener noreferrer" title={title}>
                <Iconfont type="icon-lianjie" 
                  style={{
                    fontSize: 12,
                    color: '#888',
                    marginRight: 2,
                  }} />
                {title || ''} &nbsp;
              </a>
              <p>{asin}</p>
            </div>
          </div>
        );
      },
    }, {
      title: 'Review',
      dataIndex: 'reviewScore',
      key: 'reviewScore',
      align: 'center',
      width: 120,
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'reviewScore' ? sortedInfo?.order : null,
      showSorterTooltip: false,
      render(value, row) {
        const { reviewScore, reviewNum } = row as CommectMonitor.IRowDataType;
        return (
          <div className={styles.reviewScore}>
            { parseFloat(reviewScore).toFixed(1) }
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
                    : <span className={styles.outerStat}>5星</span>
                }
                <Tooltip title={ `${Math.floor(starPart.five * 100 ) } %` }>
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
                    : <span className={styles.outerStat}>4星</span>
                }
                <Tooltip title={ `${Math.floor(starPart.four * 100) } %`}>
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
                    : <span className={styles.outerStat}>3星</span>
                }
                <Tooltip title={ `${Math.floor(starPart.three * 100) } %` }>
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
                    : <span className={styles.outerStat}>2星</span>
                }
                <Tooltip title={ `${Math.floor(starPart.two * 100) } %` }>
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
                  : <span className={styles.outerStat}>1星</span>
              }
              <Tooltip title={ `${Math.floor(starPart.one * 100) } %` }>
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
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 个`,
    className: 'h-page-small',
  };

  let keyCount = 0;
  const tableConfig = {
    dataSource,
    locale: {
      emptyText: <TableNotData hint="没有找到相关评论，请重新选择筛选条件"/>,
    },
    columns: columns as [],
    rowClassName: () => styles.rowStyle,
    pagination: pageConfig,
    rowKey: () => keyCount++,
    scroll: { 
      y: 'calc(100vh - 390px)', 
    },
    sortDirections: ['descend', 'ascend'] as ('ascend' | 'descend' | null)[],
    // eslint-disable-next-line
    onChange({ current, pageSize }: any, filters: any, sorter: any, { action }: any) {
      const {
        field,
        order,
      } = sorter;
      let myCurrent = 1; // 当前页数
      //只有排序处理
      // eslint-disable-next-line
      const asc  = order === 'ascend' ? true : order === 'descend' ? false : null;

      if (action === 'paginate') {
        myCurrent = current as number;
      } else if (action === 'sort') {
        // 点击字段排序回到第一页
        myCurrent = 1;
      }
      // eslint-disable-next-line
      const objs: any = {
        order: asc === null ? '' : field,
        asc,
        current: myCurrent,
        size: pageSize,
      };
      const data = Object.assign(requestData, requestHeader, objs);
      setLoading(true);
      requestBody(data);
    },
    className: 'h-scroll',
  };

  return (
    <div className={`${styles.monitor_box} monitor_box `}>
      <Spin spinning={loading} >
        <Toolbar asin={asin} handleToolbar={handleToolbar}/>
        <div className={styles.content}>
          <Table 
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
