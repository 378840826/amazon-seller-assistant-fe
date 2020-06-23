/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-05-22 09:31:45
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-23 15:28:26
 * @FilePath: \amzics-react\src\pages\mws\order\List\index.tsx
 * 订单列表
 */ 
'use strict';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import { Table, message } from 'antd';
import TableNotData from '@/components/TableNotData';
import Pagination from '@/components/Pagination';
import { connect } from 'dva';
import { useDispatch, useSelector } from 'umi';
import { Iconfont } from '@/utils/utils';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { storage, getAmazonBaseUrl } from '@/utils/utils';
import imgUrl from '@/assets/stamp.png';
import Toolbar from './components/Toolbar';
import { Moment } from 'moment/moment';


let hisrotyRequest = {};// 保存所有筛选信息
const OrderList: React.FC = () => {
  const dispatch = useDispatch();
  const [startTime] = useState<Moment>(
    moment().subtract(1, 'week').startOf('week')
  ); // 日历默认开始日期
  const [endTime] = useState<Moment>(
    moment().subtract(1, 'week').endOf('week')
  ); // 日历默认结束日期
  const [currentShop, setCurrentShop] = useState<API.IShop>(storage.get('currentShop')); // 当前选中店铺
  const [tableLoadingStatus, setTableLoadingStatus] = useState<boolean>(true); // 表格是否显示loading
  const [dataSource, setDataSource] = useState<[]>([]); // 表格数据
  const [pageTotal, setPageTotal] = useState<number>(0); // 分页数量
  const [pageCurrent, setPageCurrent] = useState<number>(1); // 分页当前页
  const [pageSize, setPageSize] = useState<number>(20); // 分页默认大小
  const current = useSelector((state: MwsOrderList.IGlobalType) => state.global.shop.current);
  let rowNumber = 0; // 行key

  // 请求数据 
  const requestDatas = {
    current: pageCurrent,
    size: pageSize,
    startTime: startTime.format('YYYY-MM-DD'),
    endTime: endTime.format('YYYY-MM-DD'),
  };

  // 请求体
  const requestFn = useCallback((requestData = requestDatas) => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'orderList/getOrderList',
        payload: {
          resolve,
          reject,
          data: requestData,
        },
      });
    }).then(datas => {
      setTableLoadingStatus(false);
      const {
        code = 1000,
        data,
        message: msg,
      } = datas as MwsOrderList.IResponseTableData;
      
      if (code === 200) {
        setDataSource(data.records);
        setPageSize(data.size);
        setPageTotal(data.total);
        setPageCurrent(data.current);
      } else {
        message.error(msg || '数据异常！');
      }
    }).catch(() => {
      setTableLoadingStatus(false);
    });
  }, [dispatch, requestDatas]);

  // 接收工具框(子组件)的参数并重新请求
  const filtrateFn = (requestData: {}) => {
    setTableLoadingStatus(true);

    hisrotyRequest = Object.assign({}, requestDatas, hisrotyRequest, requestData);

    // 筛选掉单选框里面的不限选择
    // for (const key in hisrotyRequest ) {
    //   const item = hisrotyRequest[key]; // 值
    //   if (item === '') {
    //     delete hisrotyRequest[key];
    //   }
    // }
    setPageCurrent(1); 
    setPageSize(20);
    requestFn(hisrotyRequest);
  };
  
  // 请求表格信息
  useEffect(() => {
    setCurrentShop(storage.get('currentShop'));
    setTableLoadingStatus(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'orderList/getOrderList',
        payload: {
          resolve,
          reject,
          data: {
            current: 1,
            size: 20,
            startTime: startTime.format('YYYY-MM-DD'),
            endTime: endTime.format('YYYY-MM-DD'),
          },
        },
      });
    }).then(datas => {
      setTableLoadingStatus(false);
      const {
        code = 1000,
        data,
        message: msg,
      } = datas as MwsOrderList.IResponseTableData;
      if (code === 200) {
        setDataSource(data.records);
        setPageSize(data.size);
        setPageTotal(data.total);
        setPageCurrent(data.current);
      } else {
        message.error(msg || '数据异常！');
      }
    }).catch(() => {
      setTableLoadingStatus(false);
    });
  }, [dispatch, current, startTime, endTime]);


  // 分页配置
  const pageConfig = {
    total: pageTotal,
    current: pageCurrent,
    pageSize: pageSize,
    callback: (current: number, size: number) => {
      setTableLoadingStatus(true);
      setPageCurrent(current);
      setPageSize(size);
      hisrotyRequest = Object.assign({}, requestDatas, hisrotyRequest, { current, size });
      requestFn(hisrotyRequest);
    },
  };

  // 标题头部
  const rowColumns = (
    <Table 
      dataSource={[{ id: 1 }]}
      pagination={false}
      showHeader={false}
      className={styles.table_header}
      rowKey="id"
      columns={[
        {
          width: '31.7%',
          align: 'center',
          render() {
            return <div className={styles.head} style={{ minWidth: 433 }}>产品信息</div>;
          },
        }, {
          width: '15.45%',
          align: 'center',
          render() {
            return <div className={styles.head} style={{ minWidth: 211 }}>费用信息</div>;
          },
        }, {
          width: '5.71%',
          align: 'center',
          render() {
            return <div className={styles.head} style={{ minWidth: 78 }}>发货状态</div>;
          },
        }, {
          width: '9.52%',
          align: 'center',
          render() {
            return <div className={styles.head} style={{ minWidth: 130 }}>订单状态</div>;
          },
        }, {
          width: '7.69%',
          align: 'center',
          render() {
            return <div className={styles.head} style={{ minWidth: 105 }}>实付金额</div>;
          },
        }, {
          width: '26.34%',
          align: 'center',
          render() {
            return <div className={styles.head} style={{ minWidth: 360, width: 400 }}>买家信息</div>;
          },
        },
      ]}
    >
    </Table>
  );

  // 表格配置
  const tableConfig = {
    dataSource: dataSource as [],
    loading: tableLoadingStatus,
    rowKey() {
      return rowNumber++;
    },
    locale: {
      filterConfirm: '确定',
      filterReset: '重置',
      emptyText: <TableNotData hint="没有找到相关订单，请重新选择查询条件"/>,
    },
  };

  return (
    <div className={styles.order_list} key="table">
      <Toolbar handleFiltarte={filtrateFn} />
      <Table 
        {...tableConfig}
        pagination={false}
        className={styles.table_style}
        id="abc"
        scroll={{ y: 770, x: 'auto' }}
        columns = {
          [{
            title: rowColumns,
            dataIndex: 'name',
            render(value, row: MwsOrderList.IRowDataType, rowIndex) {
              const num: number = row.orderDetails.length || 0; // 求出合并数
              let rowKyeNumber = 0;
              // 设置行key
              function setRowKey() {
                const num = rowKyeNumber++;
                return num.toString();
              }
              return (
                <div className={styles.row}>
                  {
                    rowIndex === 0 ? '' : <p className={styles.empty} data-index={rowIndex}></p>
                  }
                  <header className={`clearfix ${styles.order_head}`}>
                    <span>下单时间：{row.purchaseDate}</span>
                    <span>订单ID：{row.orderId as string}</span>
                    <span>{row.isBusinessOrder ? 'B2B' : ''}</span>
                  </header>
                  <Table 
                    pagination={false}
                    showHeader={false}
                    dataSource={row.orderDetails}
                    bordered
                    key={rowIndex}
                    data-index={rowIndex}
                    rowKey={setRowKey}
                    columns={[
                      {
                        // 商品信息
                        dataIndex: 'name',
                        width: '31.7%',
                        render(value, rows: MwsOrderList.IRowChildDataType) {
                          const { unitPrice } = rows;
                          const site = currentShop.marketplace;
                          const url = getAmazonBaseUrl(site as 'US' | 'CA' | 'UK' | 'DE' | 'FR' | 'ES' | 'IT');
                          return (
                            <div className={`${styles.table_product_col} clearfix`}>
                              <img src={rows.imgUrl || imgUrl } alt=""/>
                              <div className={`${styles.datails} `}>
                                <a href={`${url}/dp/${rows.asin}`} rel="noopener noreferrer" target="_blank" className={styles.title}>
                                  <Iconfont type="icon-lianjie" style={{ fontSize: 16, color: '#666', marginRight: 2 }} />
                                  {rows.productName || ''}
                                </a>
                                <p>
                                  <span>{rows.sku || ''}</span>
                                  <span>{unitPrice ? currentShop.currency + unitPrice : '—' }</span>
                                </p>
                                <p>
                                  <span>{rows.asin || ''}</span>
                                  <span>X{rows.quantity || 0}</span>
                                </p>
                              </div>
                            </div>
                          );
                        },
                      }, {
                        // 费用信息
                        dataIndex: 'name',
                        width: '15.45%',
                        render(value, rows: MwsOrderList.IRowChildDataType) {
                          return <div className={styles.table_cost_info}>
                            <p className={styles.p_one_and_two}>
                              <span>价格合计：</span>
                              <span>{currentShop.currency + (rows.price || 0)}</span>
                              <span>
                                （优惠 
                                {currentShop.currency}
                                {rows.itemPromotionDiscount || 0}
                                ）
                              </span>
                            </p>
                            <p className={styles.p_one_and_two}>
                              <span>配送费：</span>
                              <span>
                                {
                                  currentShop.currency 
                                  + (rows.shippingPrice || 0)
                                }
                              </span>
                              <span>
                                （优惠 
                                {
                                  currentShop.currency 
                                  + (rows.shipPromotionDiscount || 0)
                                }）
                              </span>
                            </p>
                            <p className={styles.p_three}>
                              <span>小计：</span>
                              <span>{currentShop.currency}{rows.subTotal}</span>
                            </p>
                          </div>;
                        },
                      }, {
                        // 发货状态
                        dataIndex: 'deliverStatus',
                        width: '5.71%',
                        align: 'center',
                        render(value) {
                          return <div style={{ minWidth: '78px' }}>{value}</div>;
                        },
                      }, {
                        // 订单状态
                        dataIndex: 'name',
                        width: '9.52%',
                        align: 'center',
                        render(value, rows: MwsOrderList.IRowChildDataType, index) {
                          if (index > 0) {
                            return {
                              props: {
                                colSpan: 2,
                                rowSpan: 0,
                              },
                            };
                          }
                          return {
                            children: (
                              <div className={styles.table_order_status}>
                                <p className={`${row.orderStatus.toLowerCase()}`}>{row.orderStatus || ''}</p>
                                <p>
                                  <span>{row.shipServiceLevel || ''}</span>
                                  <span className={styles.method}>（{row.deliverMethod || ''}）</span>
                                </p>
                              </div>
                            ),
                            props: {
                              colSpan: 1,
                              rowSpan: num,
                            },
                          };
                        },
                      }, {
                        // 实付金额
                        dataIndex: 'actualAmount',
                        width: '7.69%',
                        align: 'center',
                        render(value, rows, index){
                          if (index > 0) {
                            return {
                              props: {
                                colSpan: 2,
                                rowSpan: 0,
                              },
                            };
                          }
                          return {
                            children: <div className={styles.money}>
                              {currentShop.currency}{row.actuallyPaid || 0}
                            </div>,
                            props: {
                              colSpan: 1,
                              rowSpan: num,
                            },
                          };
                        },
                      }, {
                        // 买家信息
                        dataIndex: 'buyerMessage',
                        width: '26.34%',
                        render: (value, rows, index) => {
                          const buyerMessage = row.buyerMessage;
                          if (index > 0) {
                            return {
                              props: {
                                colSpan: 2,
                                rowSpan: 0,
                              },
                            };
                          }
                          return {
                            children: (
                              <div className={styles.table_buyer_info}>
                                <div className={styles.buyer_info_layout_one}>
                                  <p>
                                    <span className={styles.title}>买家：</span>
                                    <span>{buyerMessage.buyerName || ''}</span>
                                  </p>
                                  <p>
                                    <span className={styles.title}>电话：</span>
                                    <span>{buyerMessage.telephone || ''}</span>
                                  </p>
                                </div>
                                <div className={styles.buyer_info_layout_one}>
                                  <p>
                                    <span className={styles.title}>收件人：</span>
                                    <span>{buyerMessage.addresseeName || ''}</span>
                                  </p>
                                  <p>
                                    <span className={styles.title}>邮编：</span>
                                    <span>{buyerMessage.shipPostalCode || ''}</span>
                                  </p>
                                </div>
                                <div className={styles.address}>
                                  <span className={styles.title}>收件地址：</span>
                                  {
                                    // 详细地址 -> 市 -> 州 -> 国
                                    `${buyerMessage.detailedAddress || '' } ${
                                      buyerMessage.shipCity || '' } ${
                                      buyerMessage.shipState || '' } ${
                                      buyerMessage.shipCountry || ''}`
                                  }
                                </div>
                              </div>
                            ),
                            props: {
                              colSpan: 1,
                              rowSpan: num,
                            },
                          };
                        },
                      },
                    ]}
                  >
                  </Table>
                </div>
              );
            },
          }]
        }>
      </Table>
      <Pagination {...pageConfig} className={styles.page}/>
    </div>
  );
};

function mapStateToProps({ orderList }: {orderList: {}}) {
  return orderList;
}
export default connect(mapStateToProps)(OrderList);
