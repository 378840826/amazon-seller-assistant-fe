/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-06 14:36:15
 * @LastEditTime: 2021-05-14 09:48:43
 * 
 * 店铺层级
 */
import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Form, Select, Button, Table, message, Input } from 'antd';
import DefinedCalenda from '../DefinedCalendar';
import { Link, useDispatch, history } from 'umi'; 
import { moneyFormat, getRangeDate } from '@/utils/huang';
import { Iconfont } from '@/utils/utils';
import { asinPandectBaseRouter } from '@/utils/routes';
import OtherFree from '../OtherFree';
import GoodsImg from '@/pages/components/GoodsImg';
import TableNotData from '@/components/TableNotData';

interface IProps {
  nav: string;
}


interface ISortedInfo {
  order: 'ascend' | 'descend'; // 升序降序
  columnKey: string; // 排序字段
}


const { Item } = Form;

const Empty = () => <span className={styles.secondaryText}>—</span>;
  
const { start, end } = getRangeDate('month', false);
const Shop: React.FC<IProps> = props => {
  const { nav } = props;
  
  const [data, setData] = useState<ProfitTable.IShopProfitRecord[]>([]);
  const [totalData, setTotalData] = useState<ProfitTable.IShopProfitRecord|null>(null); // 合计
  const [sortedInfo, setSortedInfo] = useState<ISortedInfo>({
    columnKey: '',
    order: 'ascend',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>(1);
  const [size, setSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [calendarKey, setCalendarKey] = useState<string>('month'); // 记录日历选中的选项key
  const [calendarDates, setCalendarDates] = useState<[string, string]>([start, end]);// 日历选中的日期
  const [marketplaceList, setMarketplaceList] = useState<string[]>([]); // 站点下拉列表
  const [storeNameList, setStoreNameList] = useState<string[]>([]); // 店铺下拉列表

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const getParams = useCallback(() => {
    const data = form.getFieldsValue();
    // 按月、季传开始结束时间、去年、今年传cycle:1，2
    if (calendarKey === 'month' || calendarKey === 'quarter') {
      data.startTime = calendarDates[0];
      data.endTime = calendarDates[1];
    } else {
      data.cycle = calendarKey === 'year' ? 1 : 2;
    }
    return data;
  }, [calendarKey, form, calendarDates]);
  
  const request = useCallback(({ current = 1, size = 20, ...params } = { }) => {
    const temp = { size, current };
    const payload = Object.assign(temp, getParams(), params);

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'profitTable/getChildAsinList',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      setLoading(false);
      const {
        data: {
          page: {
            records,
            total = 0,
            current = 1,
            size = 20,
            order,
            asc,
          } = {},
          totalData,
        } = {},
        message: msg,
        code,
      } = datas as {
        code: number;
        message?: string;
        data: {
          page: {
            total: number;
            current: number;
            size: number;
            order: string;
            asc: boolean;
            records: ProfitTable.IShopProfitRecord[];
          };
          totalData: ProfitTable.IShopProfitRecord;
        };
      };

      if (code === 200) {
        
        records && setData([...records]);
        totalData && setTotalData({ ...totalData });
        setSortedInfo({
          columnKey: order || '',
          order: asc ? 'ascend' : 'descend',
        });
        setSize(size);
        setCurrent(current);
        setTotal(total);
        return;
      }
      
      message.error(msg || '请求列表异常！');
    });
  }, [dispatch, getParams]);

  const requestDownList = useCallback((params = { marketplace: null }) => {
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'profitTable/getAsinList',
        reject,
        resolve,
        payload: {
          ...params,
        },
      });
    });

    promise.then(res => {
      const {
        code,
        message: msg,
        data: {
          storeNameList = [],
          marketplaceList	 = [],
        } = {},
      } = res as {
        code: number;
        message?: string;
        data: {
          marketplaceList: string[];
          storeNameList: string[];
        };
      };

      if (code === 200) {
        // 首次加载时，才赋值，其它看筛选字段
        if (params.marketplace === null) {
          setStoreNameList([...storeNameList]);
          setMarketplaceList([...marketplaceList]);
        } else {
          if (params.marketplace) {
            setStoreNameList([...storeNameList]);
          } else if (params.storeName) {
            setMarketplaceList([...marketplaceList]);
          } else {
            setMarketplaceList([...marketplaceList]);
            setStoreNameList([...storeNameList]);
          }
        }
        return;
      }

      message.error(msg || '请求下拉列表数据异常');
    });
  }, [dispatch]);

  useEffect(() => {
    if (nav !== 'asin') {
      return;
    }

    request();
    requestDownList();
  }, [nav, request, requestDownList]);


  // 导出文件
  const exportFile = function() {
    const payload = {
      ...getParams(),
    };
    sortedInfo.columnKey !== '' && (payload.order = sortedInfo.columnKey, payload.asc = sortedInfo.order === 'ascend');
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'profitTable/asinExport',
        payload,
        resolve,
        reject,
      });
    });

    promise.then(res => {
      const { type } = res as { type?: string };
      if (type && type === 'application/octet-stream') {
        message.success('导出成功！');
        const content = res as BlobPart;
        const blob = new Blob([content], {
          type: 'application/octet-stream;charset=utf-8',
        });
    
        const fileName = `ASIN利润报表.xlsx`;
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
        return; 
      }
      message.error('导出失败');
    } );
  };

  // 搜索框
  const changeSearch = (val: string, event: any) => { // eslint-disable-line
    if (val === '' && 'button' in event && event.target.className === 'ant-input') {
      // console.log('点击删除图标不筛选');
      return;
    }
    request({ searchTerm: val, size: 20, current: 1 });
  };

  // 跳转到新窗口
  const toTarget = function(asin: string, stopId: string) {
    dispatch({
      type: 'global/setCurrentShop',
      payload: {
        id: stopId,
      },
    });

    setTimeout(() => {
      history.push(`${asinPandectBaseRouter}?asin=${asin}`);
    }, 10);
  };


  const getValue = function(value?: number) {
    if (value === undefined || value === null ) {
      return <Empty />;
    }

    return value;
  };

  const columns = [
    {
      title: '子ASIN',
      dataIndex: 'asin',
      key: 'asin',
      className: styles.pd8,
      children: [
        {
          width: 280,
          title: '',
          dataIndex: 'asin',
          fixed: 'left',
          className: styles.pd8,
          render(_: string, record: { 
            asin: string; 
            image: string; 
            title: string; 
            titleLink: string;
            storeId: string;
          }) {
            const { asin, image, title, titleLink, storeId } = record;
            return <div className={styles.asinCol}>
              <GoodsImg width={40} alt="商品" src={image || ''}/>
              <div className={styles.content}>
                <a 
                  href={titleLink} 
                  title={title} 
                  className={styles.title}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Iconfont type="icon-lianjie" className={styles.linkIcon}/>
                  {title}
                </a>
                <p>
                  <span 
                    className={styles.asin}
                    onClick={() => toTarget(asin, storeId)}
                  >{asin}</span></p>
              </div>
            </div>;
          },
        },
      ],
      
    },
    { 
      title: '站点', 
      dataIndex: 'marketplace',
      key: 'marketplace',
      className: styles.pd8,
      children: [{ 
        title: '', 
        width: 60, 
        dataIndex: 'marketplace', 
        fixed: 'left', 
        align: 'center',
        className: styles.pd8,
      }],
    },
    {
      title: '店铺名称',
      fixed: 'center',
      dataIndex: 'storeName',
      key: 'storeName',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'storeName' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: '合计',
          align: 'center',
          dataIndex: 'storeName',
          fixed: 'left', 
          width: 90,
        },
      ],
    },
    { 
      title: '销售额', 
      align: 'right',
      dataIndex: 'salesVolume',
      key: 'salesVolume',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'salesVolume' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.salesVolume),
          align: 'right',
          dataIndex: 'salesVolume',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: '调整补偿', 
      align: 'right',
      dataIndex: 'compensateValue',
      key: 'compensateValue',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'compensateValue' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.compensate),
          align: 'right',
          dataIndex: 'compensateValue',
          width: 130,
          render: (val: number, record: ProfitTable.IShopProfitRecord ) => <OtherFree 
            freeList={[
              { label: '仓库损坏赔偿', value: record.compensationForWarehouseDamage },
              { label: '配送损坏赔偿', value: record.distributionDamageCompensation },
              { label: '仓库丢失赔偿', value: record.compensationForLossOfWarehouse },
              { label: '免费更换退款', value: record.freeReplacementRefund },
              { label: '费用调整', value: record.costAdjustment },
              { label: '平台回收费', value: record.platformChargeBack },
            ]} 
            defaultValue={val}
          />,
        },
      ],
    },
    { 
      title: 
      '订单费用', 
      align: 'right',
      dataIndex: 'orderFee',
      key: 'orderFee',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'orderFee' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.orderFee),
          align: 'right',
          dataIndex: 'orderFee',
          width: 120,
          render: (val: number, record: ProfitTable.IShopProfitRecord ) => <OtherFree 
            freeList={[
              { label: '佣金', value: record.commission },
              { label: 'FBA fee', value: record.fbaFee },
            ]} 
            defaultValue={val}
          />,
        },
      ],
    },
    { 
      title: '退货退款', 
      align: 'right',
      dataIndex: 'returnRefund',
      key: 'returnRefund',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'returnRefund' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.returnRefund),
          align: 'right',
          dataIndex: 'returnRefund',
          width: 100,
          render: (val: number, record: ProfitTable.IShopProfitRecord ) => <OtherFree 
            freeList={[
              { label: '退货退款', value: record.returnRefund },
              { label: '退款手续费', value: record.refundFee },
              { label: '订单佣金', value: record.orderCommission },
              { label: '额外配送费', value: record.extraDeliveryFee },
              { label: '额外退货手续费', value: record.extraReturnFee },
              { label: '促销费退回', value: record.returnOfPromotionFee },
              { label: '退货手续费', value: record.returnServiceCharge },
            ]} 
            defaultValue={val}
          />,
        },
      ],
    },
    { 
      title: 
      'FBA仓储', 
      align: 'right',
      dataIndex: 'fbaStorage',
      key: 'fbaStorage',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'fbaStorage' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.fbaStorage),
          align: 'right',
          dataIndex: 'fbaStorage',
          width: 130,
          render: (val: number, record: ProfitTable.IShopProfitRecord ) => <OtherFree 
            freeList={[
              { label: '月仓储费', value: record.monthlyStorageFee },
              { label: '长期仓储费', value: record.longTermStorageFee },
            ]} 
            defaultValue={val}
          />,
        },
      ],
    },
    { 
      title: 
      '促销费用', 
      align: 'right',
      dataIndex: 'promotionExpenses',
      key: 'promotionExpenses',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'promotionExpenses' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.promotionExpenses),
          align: 'right',
          dataIndex: 'promotionExpenses',
          width: 130,
          render: (val: number, record: ProfitTable.IShopProfitRecord ) => <OtherFree 
            freeList={[
              { label: 'Coupon', value: record.coupon },
              { label: 'Promotion', value: record.promotion },
              { label: 'Coupon手续费', value: record.couponServiceCharge },
              { label: 'Lightning Deal', value: record.lightningDealFee },
            ]} 
            defaultValue={val}
          />,
        },
      ],
    },
    { 
      title: 
      '广告花费', 
      align: 'right',
      dataIndex: 'advertisingCosts',
      key: 'advertisingCosts',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'advertisingCosts' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.advertisingCosts),
          align: 'right',
          dataIndex: 'advertisingCosts',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: 
      '评测费用', 
      align: 'right',
      dataIndex: 'evaluationFee',
      key: 'evaluationFee',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'evaluationFee' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.evaluationFee),
          align: 'right',
          dataIndex: 'evaluationFee',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: 
      'Early Reviewer', 
      align: 'right',
      dataIndex: 'earlyReviewer',
      key: 'earlyReviewer',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'earlyReviewer' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.earlyReviewer),
          align: 'right',
          dataIndex: 'earlyReviewer',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: 
      '其他服务费', 
      align: 'right',
      dataIndex: 'otherServiceCharges',
      key: 'otherServiceCharges',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'otherServiceCharges' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.otherServiceCharges),
          align: 'right',
          dataIndex: 'otherServiceCharges',
          width: 130,
          render: (val: number, record: ProfitTable.IShopProfitRecord ) => <OtherFree 
            freeList={[
              { label: 'FBA移除费', value: record.fbaRemovalFee },
              { label: '订阅费', value: record.subscriptionFee },
              { label: '库存更新', value: record.inventoryUpdate },
              { label: '客户重新扣费', value: record.buyerRecharge },
            ]} 
            defaultValue={val}
          />,
        },
      ],
    },
    { 
      title: 
      '采购成本', 
      align: 'right',
      dataIndex: 'purchasingCost',
      key: 'purchasingCost',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'purchasingCost' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.purchasingCost),
          align: 'right',
          dataIndex: 'purchasingCost',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: 
      '采购物流', 
      align: 'right',
      dataIndex: 'purchasingLogistics',
      key: 'purchasingLogistics',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'purchasingLogistics' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.purchasingLogistics),
          align: 'right',
          dataIndex: 'purchasingLogistics',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: 
      '包装耗材', 
      align: 'right',
      dataIndex: 'packagingConsumables',
      key: 'packagingConsumables',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'packagingConsumables' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.packagingConsumables),
          align: 'right',
          dataIndex: 'packagingConsumables',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: 
      '国际物流', 
      align: 'right',
      dataIndex: 'internationalLogistics',
      key: 'internationalLogistics',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'internationalLogistics' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.internationalLogistics),
          align: 'right',
          dataIndex: 'internationalLogistics',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: 
      '运营', 
      align: 'right',
      dataIndex: 'operatingCosts',
      key: 'operatingCosts',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'operatingCosts' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.operatingCosts),
          align: 'right',
          dataIndex: 'operatingCosts',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: 
      '国内仓成本', 
      align: 'right',
      dataIndex: 'domesticWarehouseCost',
      key: 'domesticWarehouseCost',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'domesticWarehouseCost' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.domesticWarehouseCost),
          align: 'right',
          dataIndex: 'domesticWarehouseCost',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: 
      '利润', 
      align: 'right',
      dataIndex: 'profitValue',
      key: 'profitValue',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'profitValue' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: getValue(totalData?.profit),
          align: 'right',
          dataIndex: 'profitValue',
          width: 130,
          render: (val: number) => val === null ? <Empty /> : val,
        },
      ],
    },
    { 
      title: '利润率', 
      align: 'right',
      dataIndex: 'profitMargin',
      key: 'profitMargin',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'profitMargin' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: totalData === null || totalData?.profitMargin === null ? <span className={styles.secondaryText}>—</span> : `${moneyFormat(totalData.profitMargin, 2, ',', '.', true)}%`,
          align: 'right',
          dataIndex: 'profitMargin',
          width: 130,
          render: (val: number) => val === null ? <span className={styles.secondaryText}>—</span> : `${moneyFormat(val, 2, ',', '.', true)}%`,
        },
      ],
    },
    { 
      title: <>ROI <Iconfont type="icon-yiwen" className={styles.secondaryText} title="销售额/（成本+物流+运营+国内仓成本）"/></>, 
      align: 'right',
      dataIndex: 'roiValue',
      key: 'roiValue',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'roiValue' ? sortedInfo.order : null,
      showSorterTooltip: false,
      children: [
        {
          title: totalData === null || totalData?.roi === null ? <span className={styles.secondaryText}>—</span> : moneyFormat(totalData.roi, 2, ',', '.', true),
          align: 'right',
          dataIndex: 'roiValue',
          width: 130,
          render: (val: number) => val === null ? <span className={styles.secondaryText}>—</span> : `${moneyFormat(val, 2, ',', '.', true)}`,
        },
      ],
    },
    { 
      title: 
      '操作', 
      align: 'right',
      
      children: [
        {
          title: '',
          align: 'right',
          width: 60,
          fixed: 'right',
          render() {
            return <><Link to="hre">详情</Link></>;
          },
        },
      ],
    },
  ];

  let tableCount = 0;
  const tableConfig = {
    pagination: {
      pageSizeOptions: ['20', '50', '100'],
      total,
      pageSize: size,
      current,
      showQuickJumper: true, // 快速跳转到某一页
      showSizeChanger: true,
      showTotal: (total: number) => `共 ${total} 个`,
      className: 'h-page-small',
    },
    className: classnames(styles.table, data.length === 0 && styles.notData ),
    columns: columns as [],
    dataSource: data,
    sortDirections: ['ascend', 'descend'] as ('ascend' | 'descend' | null)[],
    scroll: {
      x: 'max-content',
      y: 'calc(100vh - 360px)',
    },
    loading,
    rowKey: (record: any) => tableCount++, // eslint-disable-line
    onChange({ current, pageSize }: any, filters: any, sorter: any, { action }: any) { // eslint-disable-line
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
      const data = Object.assign({}, getParams(), objs);
      setLoading(true);
      request(data);
    },
    locale: {
      emptyText: <TableNotData hint={'没有找到相关数据，请重新选择查询条件'}/>,
    },
  };

  // 头部筛选框改变时
  const fieldChange = function(values: any) { // eslint-disable-line
    if (Reflect.has(values, 'searchTerm')) {
      return;
    }

    if (
      Reflect.has(values, 'marketplace')
      || Reflect.has(values, 'storeName')
    ) {
      requestDownList(values);
      request({ ...values, order: '', current: 1, size: 20 });
      return;
    }

    request({ current: 1, size: 20, order: '' });
  };

  // 日历改变时
  const calendarChange = function (values: DefinedCalendar.IChangeParams) {
    console.log(values);
    setCalendarKey(values.selectItemKey);
    setCalendarDates([values.dateStart, values.dateEnd]);
  };

  return <div className={styles.box}>
    <Form 
      className={styles.header} 
      onValuesChange={fieldChange} 
      form={form} 
      initialValues={{
        currency: 'original',
      }}
    >
      <div className={styles.leftLayout}>
        <Item name="searchTerm">
          <Input.Search
            allowClear
            className={classnames('h-search', styles.search)}
            placeholder="支持输入标题/ASIN"
            style={{
              'float': 'left',
            }}
            enterButton={<Iconfont type="icon-sousuo" />}
            onSearch={changeSearch}
            autoComplete="off"
          />
        </Item>
        <Item name="marketplace" className={styles.site}>
          <Select placeholder="全部站点" allowClear>
            {marketplaceList.map((item, index) => {
              return <Select.Option value={item} key={index}>{item}</Select.Option>;
            })}
          </Select>
        </Item>
        <Item name="storeName" className={styles.shopName}>
          <Select placeholder="店铺名称" allowClear>
            {
              storeNameList.map((item, i) => {
                return <Select.Option value={item} key={i}>{item}</Select.Option>;
              })
            }
          </Select>
        </Item>
        <Item name="currency" className={styles.site}>
          <Select placeholder="货币">
            <Select.Option value="original">原币种</Select.Option>
            <Select.Option value="rmb">人民币</Select.Option>
          </Select>
        </Item>
      </div>
      <div className={styles.rightLayout}>
        <Item style={{ width: 280 }}>
          <DefinedCalenda change={calendarChange} />
        </Item>
        <Item className={styles.export}>
          <Button onClick={exportFile}>导出</Button>
        </Item>
      </div>
    </Form>

    <Table {...tableConfig} />
  </div>;
};

export default Shop;
