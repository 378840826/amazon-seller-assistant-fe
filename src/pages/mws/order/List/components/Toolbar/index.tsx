import React, { useState, useEffect } from 'react';
import styles from './index.less';
import moment from 'moment';
import { Iconfont } from '@/utils/utils';
import {
  Input,
  Button,
  DatePicker,
  Radio,
  Form,
} from 'antd';
import { useLocation } from 'umi';
import { getRangeDate } from '@/utils/huang';

const { RangePicker } = DatePicker;
const { Item } = Form;
const Toolbar: React.FC<MwsOrderList.IToolbarProps> = (props) => {
  const { form, fieldChange, onFinish } = props;
  const location = useLocation() as MwsOrderList.ILocation;
  
  // 默认的日期  当前
  const { start: startDate, end: endDate } = getRangeDate(7, true);
  const [filtrateboxheight, setFiltrateBoxHeight] = useState<string>('76px'); // 筛选框高度
  const [filtrateMoreButText, setFiltrateMoreButText] = useState<string>('展开');
  const [filtrateMoreButClass, setFiltrateMoreButClass] = useState<string>('');
  // eslint-disable-next-line 
  const query: any = location.query; // eslint-disable-line
  const { asin = '', buyer = '' } = query as {asin: string; buyer: string};

  // 筛选查询
  useEffect(() => {
    form.setFieldsValue({
      asinRelatedSearch: asin,
      buyerRelatedSearch: buyer,
    });
  }, [form, asin, buyer]);

 
  const { start: start7, end: end7 } = getRangeDate(7);
  const { start: start30, end: end30 } = getRangeDate(30);
  const { start: start60, end: end60 } = getRangeDate(60);
  const { start: start90, end: end90 } = getRangeDate(90);
  const { start: start180, end: end180 } = getRangeDate(180);
  const { start: start365, end: end365 } = getRangeDate(365);
  const { start: lastWeekStart, end: lastWeekEnd } = getRangeDate('lastWeek');
  const { start: lastMonthStart, end: lastMonthEnd } = getRangeDate('lastMonth');
  const rangeList = {
    '上周': [lastWeekStart, lastWeekEnd],
    '上月': [lastMonthStart, lastMonthEnd],
    '最近7天': [start7, end7],
    '最近30天': [start30, end30],
    '最近60天': [start60, end60],
    '最近90天': [start90, end90],
    '最近180天': [start180, end180],
    '最近365天': [start365, end365],
  };

  // 日历的配置
  // eslint-disable-next-line 
  const DatepickerConfig: any = {
    ranges: rangeList,
    dateFormat: 'YYYY-MM-DD',
    allowClear: false,
    getPopupContainer() {
      return document.querySelector('.order-list-datepicker');
    },
  };

  // 筛选工具栏的高度设置
  const handleFiltrateHeight = () => {
    if (filtrateMoreButText === '收起') {
      setFiltrateBoxHeight('76px');
      setFiltrateMoreButText('展开');
      setFiltrateMoreButClass('');
    } else {
      setFiltrateBoxHeight('auto');
      setFiltrateMoreButText('收起');
      setFiltrateMoreButClass('active');
    }
  };


  return (
    <Form form={form} onValuesChange={fieldChange} onFinish={onFinish} colon={false}> 
      <header className={`${styles.header} order-list-toolbar`}>
        <div className={`${styles.search} clearfix`}>
          <div className={styles.leftLayout}>
            <Item name="asinRelatedSearch">
              <Input 
                placeholder="请输入订单ID、ASIN、SKU或商品标题" 
                className={styles.inputStyle}
                allowClear
                autoComplete="off"
              />
            </Item>
            <Item name="buyerRelatedSearch">
              <Input 
                placeholder="请输入收件人姓名或买家名称"
                className={styles.inputStyle}
                allowClear
                autoComplete="off"
              />
            </Item>
            <Button type="primary" htmlType="submit">搜索</Button>
          </div>
          <div className={`${styles.datepicker} order-list-datepicker`}>
            <Item name="rangepicker" initialValue={[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}>
              <RangePicker {...DatepickerConfig} dropdownClassName="h-range-picker" className="h-range-picker"/>
            </Item>
          </div>
        </div>
          
        <div className={styles.radio_filtrate} style={{
          height: filtrateboxheight,
        }} >
          <div className={styles.left_layout}>
            <div className={styles.layout_one_item}>
              <Item name="businessOrder" label="B2B订单：" initialValue={undefined}>
                <Radio.Group >
                  <Radio value={undefined}>不限</Radio>
                  <Radio value={true} className={styles.handlePadding}>是</Radio>
                  <Radio value={false} className={styles.handlePadding}>否</Radio>
                </Radio.Group>
              </Item>
            </div>
            <div className={`${styles.layout_one_item}`}>
              <Item name="preferentialOrder" label="优惠订单：" initialValue={undefined}>
                <Radio.Group>
                  <Radio value={undefined}>不限</Radio>
                  <Radio value={true} className={styles.handlePadding}>是</Radio>
                  <Radio value={false} className={styles.handlePadding}>否</Radio>
                </Radio.Group>
              </Item>
            </div>
            <div className={styles.layout_one_item}>
              <Item name="orderStatus" label="订单状态：" initialValue={undefined}>
                <Radio.Group size="large">
                  <Radio value={undefined}>不限</Radio>
                  <Radio value="Pending">Pending</Radio>
                  <Radio value="Cancelled" style={{
                    paddingLeft: 16,
                  }}>Cancelled</Radio>
                  <Radio value="Shipping">Shipping</Radio>
                  <Radio value="Shipped">Shipped</Radio>
                </Radio.Group>
              </Item>
            </div>
            <div className={styles.layout_one_item}>
              <Item name="deliverStatus" label="发货状态：" initialValue={undefined}>
                <Radio.Group>
                  <Radio value={undefined}>不限</Radio>
                  <Radio value="Unshipped">Unshipped</Radio>
                  <Radio value="Cancelled">Cancelled</Radio>
                  <Radio value="Shipping">Shipping</Radio>
                  <Radio value="Shipped">Shipped</Radio>
                </Radio.Group>
              </Item>
            </div>
          </div>
          <div className={styles.right_layout}>
            <div className={styles.layout_one_item}>
              <Item name="multiplePieces" label="一单多件：" initialValue={undefined}>
                <Radio.Group>
                  <Radio value={undefined}>不限</Radio>
                  <Radio value={true} className={styles.handlePadding}>是</Radio>
                  <Radio value={false} 
                    style={{
                      marginLeft: 9,
                    }} 
                    className={styles.handlePadding}>
                      否
                  </Radio>
                </Radio.Group>
              </Item>
            </div>
            <div className={`${styles.layout_one_item}  ${styles.order_discounts}`}>
              <Item name="multipleSku" label="一单多SKU：" initialValue={undefined}>
                <Radio.Group>
                  <Radio value={undefined}>不限</Radio>
                  <Radio value={true} className={styles.handlePadding}>是</Radio>
                  <Radio value={false} 
                    style={{
                      marginLeft: 9,
                    }} className={styles.handlePadding}>否</Radio>
                </Radio.Group>
              </Item>
            </div>
            <div className={styles.layout_one_item}>
              <Item name="deliverMethod" label="发货方式：" initialValue={undefined}>
                <Radio.Group>
                  <Radio value={undefined}>不限</Radio>
                  <Radio value="Amazon" className={styles.handlePadding}>FBA</Radio>
                  <Radio value="Merchant" className={styles.handlePadding}>FBM</Radio>
                </Radio.Group>
              </Item>
            </div>
            <div className={`${styles.layout_one_item} ${styles.action}`}>
              <Item name="shipServiceLevel" label="配送服务：" initialValue={undefined}>
                <Radio.Group>
                  <Radio value={undefined}>不限</Radio>
                  <Radio value="Standard">Standard</Radio>
                  <Radio value="Expedited">Expedited</Radio>
                  <Radio value="SecondDay">SecondDay</Radio>
                  <Radio value="NextDay">NextDay</Radio>
                </Radio.Group>
              </Item>
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
    </Form>
  );
};

export default Toolbar;
