import React, { useState, useEffect } from 'react';
import styles from './index.less';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Iconfont } from '@/utils/utils';
import {
  Input,
  Button,
  ConfigProvider,
  DatePicker,
  Radio,
} from 'antd';
import { useSelector } from 'umi';
import { Moment } from 'moment/moment';
import { getQuery } from '@/utils/huang';


const { RangePicker } = DatePicker;
let shopCount = 0;
const fields = {} as MwsOrderList.IRadioFields; // 所有的单选框字段
const Toolbar: React.FC<MwsOrderList.IToolbarProps> = (props) => {
  const [orderInfoSearch, setOrderInfoSearch] = useState<string>(''); // 第一个 订单ID、ASIN、SKU或商品标题搜索框 
  const [sellerSearch, setSellerSearch] = useState<string>(''); // 第二个 卖家名或笔名搜索框 
  // 默认的日期  当前
  const [datepickerValue, setDatepickerValue] = useState<Moment[]>([
    moment().subtract(1, 'week').startOf('week'),
    moment().subtract(1, 'week').endOf('week'),
  ]);
  const [orderStatus, setOrderStatus] = useState<string>(''); // 订单状态
  const [deliverStatus, setDeliverStatus] = useState<string>(''); // 发货状态
  const [businessOrder, setBusinessOrder] = useState<string | boolean>(''); // B2B订单
  const [multiplePieces, setMultiplePieces] = useState<string | boolean>(''); // 一单多件
  const [preferentialOrder, setPreferentialOrder] = useState<string | boolean>(''); // 优惠订单
  const [multipleSku, setMultipleSku] = useState<string | boolean>(''); // 一件多SKU
  const [deliverMethod, setDeliverMethod] = useState<string>(''); // 发货方式
  const [shipServiceLevel, setShipServiceLevel] = useState<string>(''); // 配送服务
  const [filtrateBoxHeight, setFiltrateBoxHeight] = useState<string>('88px'); // 筛选框高度
  const [filtrateMoreButText, setFiltrateMoreButText] = useState<string>('展开');
  const [filtrateMoreButClass, setFiltrateMoreButClass] = useState<string>('');
  const current = useSelector((state: MwsOrderList.IGlobalType) => state.global.shop.current);
  const { asin = '', buyer = '' } = getQuery() as {asin: string; buyer: string};

  
  // 筛选查询
  useEffect(() => {
    setOrderInfoSearch(asin);
    setSellerSearch(buyer);
  }, [asin, buyer]);

  // 店铺切换时、让导航回到默认状态
  useEffect(() => {
    if (shopCount > 1) {
      setOrderInfoSearch('');
      setSellerSearch('');
      setOrderStatus('');
      setDeliverStatus('');
      setBusinessOrder('');
      setMultiplePieces('');
      setPreferentialOrder('');
      setMultipleSku('');
      setDeliverMethod('');
      setShipServiceLevel('');
      setDatepickerValue([
        moment().subtract(1, 'week').startOf('week'),
        moment().subtract(1, 'week').endOf('week'),
      ]);
    } else {
      shopCount++;
    }
  }, [current]);

  const rangeList = {
    '上周': [
      moment().subtract(1, 'week').startOf('week'),
      moment().subtract(1, 'week').endOf('week')],
    '上月': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
    ],
    '最近7天': [
      moment().subtract(6, 'day'),
      moment().endOf('day'),
    ],
    '最近30天': [
      moment().subtract(29, 'day'),
      moment().endOf('day'),
    ],
    '最近60天': [
      moment().subtract(59, 'day'),
      moment().endOf('day'),
    ],
    '最近90天': [
      moment().subtract(89, 'day'),
      moment().endOf('day'),
    ],
    '最近365天': [
      moment().subtract(365, 'day'),
      moment().endOf('day'),
    ],
  };

  // 日历的配置
  // eslint-disable-next-line 
  const DatepickerConfig: any = {
    ranges: rangeList,
    dateFormat: 'YYYY-MM-DD',
    allowClear: false,
    value: datepickerValue,
    defaultValue: datepickerValue,
    getPopupContainer() {
      return document.querySelector('.order-list-datepicker');
    },
    onChange(dates: Moment[]) {
      setDatepickerValue(dates);
      fields.startTime = dates[0].format('YYYY-MM-DD');
      fields.endTime = dates[1].format('YYYY-MM-DD');
      props.handleFiltarte(fields);
    },
  };

  // 搜索框按钮
  const searchButton = () => {
    fields.asinRelatedSearch = orderInfoSearch;
    fields.buyerRelatedSearch = sellerSearch;

    // 为啥注释掉？ 防止保留历史
    // if (orderInfoSearch === '') {
    //   delete fields.asinRelatedSearch;
    // } 

    // if (sellerSearch === '') {
    //   delete fields.buyerRelatedSearch;
    // }
    props.handleFiltarte(fields);
  };

  useEffect(() => {
    fields.startTime = datepickerValue[0].format('YYYY-MM-DD');
    fields.endTime = datepickerValue[1].format('YYYY-MM-DD');
  });

  // 筛选工具栏的高度设置
  const handleFiltrateHeight = () => {
    if (filtrateMoreButText === '收起') {
      setFiltrateBoxHeight('88px');
      setFiltrateMoreButText('展开');
      setFiltrateMoreButClass('');
    } else {
      setFiltrateBoxHeight('auto');
      setFiltrateMoreButText('收起');
      setFiltrateMoreButClass('active');
    }
  };

  // 处理所有的单选框，并返回数据给父组件
  const handleChangeRadio = (e: RadioChangeEvent, type: string) => {
    const value = e.target.value;

    fields.asinRelatedSearch = orderInfoSearch;
    fields.buyerRelatedSearch = sellerSearch;
    fields.startTime = datepickerValue[0].format('YYYY-MM-DD');
    fields.endTime = datepickerValue[1].format('YYYY-MM-DD');
    fields.current = 1; // 将分页初始化
    fields.size = 20; // 将分页初始化
   
    switch (type) {
    case 'B2B订单':
      setBusinessOrder(value);
      fields.businessOrder = value;
      break;
    case '一单多件':
      setMultiplePieces(value);
      fields.multiplePieces = value;
      break;
    case '订单状态':
      setOrderStatus(value as string);
      fields.orderStatus = value;
      break;
    case '发货状态':
      setDeliverStatus(value as string);
      fields.deliverStatus = value;
      break;
    case '优惠订单':
      setPreferentialOrder(value);
      fields.preferentialOrder = value;
      break;
    case '发货方式':
      setDeliverMethod(value as string);
      fields.deliverMethod = value;
      break;
    case '一件多SKU':
      setMultipleSku(value);
      fields.multipleSku = value;
      break;
    case '配送服务':
      setShipServiceLevel(value);
      fields.shipServiceLevel = value;
      break;
    default: 
      break;
    }
    props.handleFiltarte(fields);
  };

  // 搜索框回车
  const downEnter = () => {
    searchButton();
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.search} clearfix`}>
        <Input 
          placeholder="请输入订单ID、ASIN、SKU或商品标题" 
          value={orderInfoSearch} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderInfoSearch(e.target.value)}
          className={styles.inputStyle}
          allowClear
          onPressEnter={downEnter}
        />
        <Input 
          value={sellerSearch}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSellerSearch(e.target.value)}
          placeholder="请输入收件人姓名或买家名称"
          className={styles.inputStyle}
          allowClear
          onPressEnter={downEnter}
        />
        <Button type="primary" onClick={searchButton}>搜索</Button>
        <div className={`${styles.datepicker} order-list-datepicker`}>
          <ConfigProvider locale={zhCN}>
            <RangePicker {...DatepickerConfig} dropdownClassName="h-range-picker" className="h-range-picker"/>
          </ConfigProvider>
        </div>
      </div>
        
      <div className={styles.radio_filtrate} style={{ height: filtrateBoxHeight }} >
        <div className={styles.left_layout}>
          <div className={styles.layout_one_item}>
            <span>B2B订单：</span>
            <Radio.Group 
              onChange={(e) => handleChangeRadio(e, 'B2B订单')}
              value={businessOrder}>
              <Radio value="">不限</Radio>
              <Radio value={true} className={styles.handlePadding}>是</Radio>
              <Radio value={false} className={styles.handlePadding}>否</Radio>
            </Radio.Group>
          </div>
          <div className={`${styles.layout_one_item}`}>
            <span>优惠订单：</span>
            <Radio.Group 
              onChange={(e) => handleChangeRadio(e, '优惠订单')}
              value={preferentialOrder}>
              <Radio value="">不限</Radio>
              <Radio value={true} className={styles.handlePadding}>是</Radio>
              <Radio value={false} className={styles.handlePadding}>否</Radio>
            </Radio.Group>
          </div>
          <div className={styles.layout_one_item}>
            <span>订单状态：</span>
            {<Radio.Group size="large" 
              onChange={(e) => handleChangeRadio(e, '订单状态')}
              value={orderStatus}>
              <Radio value="">不限</Radio>
              <Radio value="Pending">Pending</Radio>
              <Radio value="Cancelled" style={{ paddingLeft: 16 }}>Cancelled</Radio>
              <Radio value="Shipping">Shipping</Radio>
              <Radio value="Shipped">Shipped</Radio>
            </Radio.Group>}
          </div>
          <div className={styles.layout_one_item}>
            <span>发货状态：</span>
            <Radio.Group 
              onChange={(e) => handleChangeRadio(e, '发货状态')}
              value={deliverStatus}>
              <Radio value="">不限</Radio>
              <Radio value="Unshipped">Unshipped</Radio>
              <Radio value="Cancelled">Cancelled</Radio>
              <Radio value="Shipping">Shipping</Radio>
              <Radio value="Shipped">Shipped</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.right_layout}>
          <div className={styles.layout_one_item}>
            <span>一单多件：</span>
            <Radio.Group 
              onChange={(e) => handleChangeRadio(e, '一单多件')}
              value={multiplePieces}>
              <Radio value="">不限</Radio>
              <Radio value={true} className={styles.handlePadding}>是</Radio>
              <Radio value={false} 
                style={{ marginLeft: 9 }} 
                className={styles.handlePadding}>
                  否
              </Radio>
            </Radio.Group>
          </div>
          <div className={`${styles.layout_one_item}  ${styles.order_discounts}`}>
            <span>一件多SKU：</span>
            <Radio.Group 
              onChange={(e) => handleChangeRadio(e, '一件多SKU')}
              value={multipleSku}>
              <Radio value="">不限</Radio>
              <Radio value={true} className={styles.handlePadding}>是</Radio>
              <Radio value={false} 
                style={{ marginLeft: 9 }} className={styles.handlePadding}>否</Radio>
            </Radio.Group>
            
          </div>
          <div className={styles.layout_one_item}>
            <span>发货方式：</span>
            <Radio.Group 
              onChange={(e) => handleChangeRadio(e, '发货方式')}
              value={deliverMethod}>
              <Radio value="">不限</Radio>
              <Radio value="Amazon" className={styles.handlePadding}>FBA</Radio>
              <Radio value="Merchant" className={styles.handlePadding}>FBM</Radio>
            </Radio.Group>
          </div>
          <div className={`${styles.layout_one_item}`}>
            <span>配送服务：</span>
            <Radio.Group 
              onChange={(e) => handleChangeRadio(e, '配送服务')}
              value={shipServiceLevel}>
              <Radio value="">不限</Radio>
              <Radio value="Standard">Standard</Radio>
              <Radio value="Expedited">Expedited</Radio>
              <Radio value="SecondDay">SecondDay</Radio>
              <Radio value="NextDay">NextDay</Radio>
            </Radio.Group>
            <p className={`${styles.icon} 
              ${filtrateMoreButClass === 'active' ? 'active' : ''}`}
            onClick={handleFiltrateHeight}>
              <Iconfont className={`
                ${styles.i} ${filtrateMoreButClass === 'active' ? 'active' : ''}`
              }
              type="icon-zhankai" />
              <span>{filtrateMoreButText}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
