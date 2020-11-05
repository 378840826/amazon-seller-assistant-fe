import React from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import { Button, Tooltip, DatePicker } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import { Moment } from 'moment/moment';
export const operaList = [
  { name: '图片', value: 'changeImage', short: '图片' },
  { name: '标题', value: 'changeTitle', short: '标题' },
  { name: 'Deal', value: 'changeDeal', short: 'Deal' },
  { name: 'Coupon', value: 'changeCoupon', short: '劵' },
  { name: '变体', value: 'changeVariants', short: '变体' },
  { name: 'Bundle', value: 'changeBundle', short: 'Bundle' },
  { name: 'Bullet Point', value: 'changeBP', short: 'BP' },
  { name: 'Promotion', value: 'changeProm', short: '促销' },
  { name: 'Description', value: 'changeDescription', short: '描述' },
  { name: 'EBC图片', value: 'changeEBCImg', short: 'EBC' },
  { name: '视频', value: 'changeVideo', short: '视频' },
];

export const adjustList = [
  { name: '分类', value: 'changeCategory', short: '分类' },
  { name: "Amazon's choice", value: 'changeAc', short: 'AC' },
  { name: 'Frequently Bought Together', value: 'changeFBT', short: 'FBT' },
  { name: 'Add-on item', value: 'changeAddItem', short: 'Add' },
];
export const feedbackList = [
  { name: 'Q&A', value: 'changeQA', short: 'Q&A' },
  { name: '特殊Review', value: 'changeReview', q: '需加入评论监控' },
];

export const relativeList = [
  { name: '库存', value: 'changeStock', short: '有货' },
  { name: 'Best Seller', value: 'changeBS' },
  { name: 'New Releases', value: 'changeNR' },
];

export const raceOperaList = [
  { name: 'Buybox卖家', value: 'changeBuybox' },
  { name: '发货方式', value: 'changeFulc' },
  { name: '卖家数', value: 'changeSerllerQt' },
];

export const yAxisList = [
  { name: '价格', value: 'price' },
  { name: '大类排名', value: 'bigCategoryRanking' },
  { name: '小类排名', value: 'smallCategoryRanking' },
  { name: '订单量', value: 'orderQuantity' },
  { name: 'pageView', value: 'pageView' },
  { name: 'Session', value: 'session' },
  { name: '转化率', value: 'conversionRate' },
  { name: '关联销售', value: 'associatedSales' },
  { name: 'Review好评', value: 'reviewPraise', q: '需加入评论监控' },
  { name: 'Review差评', value: 'reviewBad', q: '需加入评论监控' },
  { name: 'Review评分', value: 'reviewScore' },
];
interface IOperatorBar{
  list: string[];
  modifySendState: (params: API.IParams) => void;
  tableLoading: boolean;
  dateStart: string;
  dateEnd: string;
}

const rangeList = {
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
  '最近180天': [
    moment().subtract(179, 'day'),
    moment().endOf('day'),
  ],
  '最近365天': [
    moment().subtract(365, 'day'),
    moment().endOf('day'),
  ],
};
const { RangePicker } = DatePicker;

const OperatorBar: React.FC<IOperatorBar> = ( { 
  list,
  modifySendState,
  tableLoading,
  dateStart,
  dateEnd } ) => {

  const dateRange = {
    dateStart,
    dateEnd,
  };

  const buttonClickEvent = (value: string) => {
    const index = list.indexOf(value);
    const newState = list;
    
    const len = list.length;
    if (index < 0){ //新点击的元素不存在
      if (len >= 8){
        newState.push(value);
        newState.shift();
      } else {
        newState.push(value);
      }
    } else { //新点击的元素存在
      newState.splice(index, 1);
      console.log(JSON.stringify(newState));
    }
    modifySendState({ changeType: newState });
  };

  //日历
  const RangePickerProps: API.IParams = {
    disabled: tableLoading,
    ranges: rangeList,
    defaultValue: [moment(dateStart), moment(dateEnd)],
    onChange: (dates: Moment[]): void => {
      dateRange.dateStart = dates[0].format('YYYY-MM-DD');
      dateRange.dateEnd = dates[1].format('YYYY-MM-DD');
    },
    onOpenChange: (open: boolean) => {
      if (dateRange.dateStart === dateStart && dateRange.dateEnd === dateEnd) {
        return; 
      }
      if (!open){
        modifySendState({ ...dateRange });
      }
    },
  };
  return (
    <div className={styles.buttonList} >
      <div className={styles.changeType}>
        <span>变化类型：</span>
        <i className={styles.cleanup} onClick={() => modifySendState({ changeType: [] })}>
          <Iconfont className={styles.icon_qingkong} type="icon-qingkong"/>
          <span>清空</span>
        </i>
      </div>
      <div className={styles.operaList}>
        <span>运营操作：</span>
        {operaList.map(item => {
          return (
            <Button key={item.value} 
              onClick={() => buttonClickEvent(item.value)} 
              className={classnames(
                { [styles.active]: list.indexOf(item.value) > -1 ? true : false,
                })}>{item.name}</Button>
          );
        })}
      </div>
      <div className={styles.adjustList}>
        <span>平台调整：</span>
        {adjustList.map(item => {
          return (
            <Button key={item.value} 
              onClick={() => buttonClickEvent(item.value)} 
              className={classnames(
                { [styles.active]: list.indexOf(item.value) > -1 ? true : false,
                })}>{item.name}</Button>
          );
        })}
      </div>
      <div className={styles.feedbackList}>
        <span>客户反馈：</span>
        {feedbackList.map(item => {
          return (
            <Button key={item.value} 
              onClick={() => buttonClickEvent(item.value)} 
              className={classnames(
                { [styles.active]: list.indexOf(item.value) > -1 ? true : false,
                })}>
              {item.name}
              {item.q ? <Tooltip 
                className={styles.__tooltip} 
                title={item.q}>
                <Iconfont type="icon-yiwen"/>
              </Tooltip> : ''}
            </Button>
          );
        })}
      </div>
      <div className={styles.relativeList}>
        <span>销售相关：</span>
        {relativeList.map(item => {
          return (
            <Button key={item.value} 
              onClick={() => buttonClickEvent(item.value)} 
              className={classnames(
                { [styles.active]: list.indexOf(item.value) > -1 ? true : false,
                })}>{item.name}</Button>
          );
        })}
      </div>
      <div className={styles.race_calendar}>
        <div className={styles.raceOperaList}>
          <span>对手操作：</span>
          {raceOperaList.map(item => {
            return (
              <Button key={item.value} 
                onClick={() => buttonClickEvent(item.value)} 
                className={classnames(
                  { [styles.active]: list.indexOf(item.value) > -1 ? true : false,
                  })}>{item.name}</Button>
            );
          })}
        </div>
        <div className={styles.calendar_picker}>
          <RangePicker {...RangePickerProps}/>
        </div>
      </div>
    </div>
  );
};
export default OperatorBar;
