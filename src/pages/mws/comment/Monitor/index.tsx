/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-02 15:57:07
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-22 21:57:17
 * @FilePath: \amzics-react\src\pages\mws\comment\Monitor\index.tsx
 * 
 * 评论监控
 */ 
'user stairt';
import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.less';
import Pagination from '@/components/Pagination';
import { ColumnsType } from 'antd/lib/table';
import { Iconfont } from '@/utils/utils';
import emptyImg from '@/assets/stamp.png';
import moment from 'moment';
import TableNotData from '@/components/TableNotData';
import Toolbar from './components/Toolbar';
import { storage } from '@/utils/utils';
import SignHandle from './components/SignHandle';
import { getQuery } from '@/utils/huang';
import {
  Link,
  useDispatch,
  connect,
  ConnectRC,
  ICommentMonitorType,
  Dispatch,
  useSelector,
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
let shopCount = 0; // 店铺首次加载不执行
const Monitor: ConnectRC<CommectMonitor.IPageProps> = ({ commentTableData }) => {
  const dispatch: Dispatch = useDispatch();
  const { asin = '' }: {asin?: string} = getQuery();
  
  const [dataSource, setDataSource] = useState<{recores?: {}}[]>([]); // 表格数据
  const [pageTotal, setPageTotal] = useState<number>(0); // 分页数量
  const [pageCurrent, setPageCurrent] = useState<number>(1); // 分页当前页
  const [pageSize, setPageSize] = useState<number>(20); // 分页默认大小
  const [loading, setLoading] = useState<boolean>(true); // 是否加载中
  const [dateStart] = useState<string>( 
    moment().subtract(29, 'days').format('YYYY-MM-DD')
  );
  const [dateEnd] = useState<string>( 
    moment().format('YYYY-MM-DD')
  );
  const { storeName } = storage.get('currentShop') as API.IShop; // 当前选中店铺
  const current = useSelector((state: CommectMonitor.IGlobalType) => state.global.shop.current);

  // 初始化请求数据
  const requestData: CommectMonitor.IRequestDataType = {
    stars: [1, 2, 3],
    status: 'all',
    current: pageCurrent,
    size: pageSize,
    dateStart,
    dateEnd,
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
  }, [dispatch]);

  useEffect(() => {
    requestBody();
  }, [requestBody]);


  // 店铺切换时
  useEffect(() => {
    if (shopCount > 1) {
      console.log('店铺切换时');
      requestBody();
    }
    shopCount++;
  }, [current, requestBody]);

  useEffect(() => {
    if (commentTableData.code === 200) {
      setDataSource(commentTableData.data.records as [] );
    }
  }, [commentTableData]);

  // 下载列表
  const download = (data: {}) => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'commentMonitor/downLoadComment',
        payload: {
          resolve,
          reject,
          data,
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
      key: 'name',
      align: 'center',
    }, {
      title: '星级',
      dataIndex: 'star',
      key: 'age',
      align: 'center',
      render(value) {
        return <Rate 
          allowHalf 
          disabled 
          defaultValue={value} 
          className={styles.star} />;
      },
    }, {
      title: '评论内容',
      dataIndex: 'reviewContent',
      key: 'reviewContent',
      align: 'center',
      render(value, rowData){
        const data = rowData as {reviewLink: string};
        const reviewerLink = data.reviewLink;
        return (
          <div className={styles.commect_content} >
            <Tooltip 
              title={ value } 
              getPopupContainer={() => document.querySelector('.monitor_box') as HTMLElement}
            >
              <a href={reviewerLink} target="_blank" rel="noopener noreferrer">
                <Iconfont type="icon-lianjie" style={{ fontSize: 16, color: '#999' }} />
                {value}
              </a>
            </Tooltip>
          </div>
        );
      },
    }, {
      title: '用户笔名',
      dataIndex: 'reviewerName',
      key: 'reviewerName',
      align: 'center',
    }, {
      title: '商品信息',
      dataIndex: 'asin',
      key: 'asin',
      align: 'center',
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
            <img src={data.imgLink || emptyImg as string} alt=""/>
            <div>
              <Tooltip 
                getPopupContainer={() => document.querySelector('.monitor_box') as HTMLElement}
                title={ title }>
                <a href={titleLink} target="_blank" rel="noopener noreferrer">
                  <Iconfont type="icon-lianjie" style={{ fontSize: 16, color: '#999' }} />
                  {title || ''}
                </a>
              </Tooltip>
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
      width: '320px',
      render(value, row) {
        const { starPart } = row as CommectMonitor.IRowDataType;
        return (
          <div className={`${styles.start_distribute} clearfix`}>
            <div className={styles.layout_one_row}>
              <div>
                <a 
                  href={ starPart.fiveStarLink } 
                  rel="noopener noreferrer" 
                  target="_blank" 
                  className={styles.title}>5星</a>
                <Tooltip title={ starPart.five }>
                  <Progress percent={ starPart.five } strokeColor="#ffaf4d" showInfo={false} />
                </Tooltip>
              </div>
              <div>
                <a 
                  href={ starPart.fourStarLink } 
                  rel="noopener noreferrer" 
                  target="_blank" 
                  className={styles.title}>4星</a>
                <Tooltip title={ starPart.four }>
                  <Progress percent={ starPart.four } strokeColor="#ffaf4d" showInfo={false} />
                </Tooltip>
              </div>
            </div>
            <div className={styles.layout_two_row}>
              <div>
                <a 
                  href={ starPart.threeStarLink } 
                  rel="noopener noreferrer" 
                  target="_blank" 
                  className={styles.title}>3星</a>
                <Tooltip title={ starPart.three }>
                  <Progress percent={ starPart.three } strokeColor="#ffaf4d" showInfo={false} />
                </Tooltip>
              </div>
              <div>
                <a 
                  href={ starPart.twoStarLink } 
                  rel="noopener noreferrer" 
                  target="_blank" 
                  className={styles.title}>2星</a>
                <Tooltip title={ starPart.two }>
                  <Progress percent={ starPart.two } strokeColor="#ffaf4d" showInfo={false} />
                </Tooltip>
              </div>
            </div>
            <div className={styles.layout_three_row}>
              <a href={ starPart.oneStarLink } 
                rel="noopener noreferrer" 
                target="_blank" 
                className={styles.title}>1星</a>
              <Tooltip title={ starPart.one }>
                <Progress percent={ starPart.one } strokeColor="#ffaf4d" showInfo={false} />
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
      width: '136px',
      render(value, row) {
        const { handled, hasOrder } = row as CommectMonitor.IRowDataType;
        return (
          <div className={styles.handleBth}>
            <SignHandle id={value} status={handled}></SignHandle>
            {
              // 是否有匹配订单
              hasOrder ?
                <Link to="" className={styles.hasOrder}>匹配订单</Link>
                : ''
            }
          </div>
        );
      },
    },
  ];

  const tableConfig = {
    dataSource,
    locale: {
      filterConfirm: '确定',
      filterReset: '重置',
      emptyText: <TableNotData hint="没有找到相关评论，请重新选择筛选条件"/>,
    },
    columns: columns as [],
    rowClassName: () => styles.rowStyle,
  };

  // 分页配置
  const pageConfig = {
    total: pageTotal,
    current: pageCurrent,
    pageSize: pageSize,
    totalText: '共%d个评论',
    callback: (current: number, size: number) => {
      setPageCurrent(current);
      setPageSize(size);
      requestBody({ size, current });
    },
  };

  return (
    <div className={`${styles.monitor_box} monitor_box `}>
      <Spin spinning={loading} >
        <Toolbar asin={asin} handleToolbar={handleToolbar}/>
        <div className={styles.content}>
          <Table 
            key="id" rowKey="id" 
            {...tableConfig}
            pagination={false} 
          />
          <div className={styles.page}>
            <Pagination {...pageConfig}/>
          </div>
        </div>
      </Spin>
    </div>
  );
};

function mapStatetoProps({ commentMonitor }: {commentMonitor: ICommentMonitorType}) {
  return commentMonitor;
}

export default connect(mapStatetoProps)(Monitor) ;
