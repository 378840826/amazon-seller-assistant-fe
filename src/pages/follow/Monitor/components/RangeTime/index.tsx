/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-09-14 16:55:26
 * @LastEditors: Huang Chao Yi
 * 
 * antd的时间范围插件满足不了需求
 * 1. 开始时间可以大于结束时间
 * 2. 当开始时间大于结束时间时，结束时间会显示 "（次日）"
 */

import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { TimePicker } from 'antd';
import moment from 'moment';
import { SwapRightOutlined, ClockCircleOutlined } from '@ant-design/icons';


interface ICbParams {
  startTime: string;
  endTime: string;
}

interface IProps {
  style?: React.CSSProperties;
  className?: string;
  startTime: string;
  endTime: string;
  onChange: (params: ICbParams) => void;
}

const RangeTime: React.FC<IProps> = (props) => {
  const {
    style,
    className,
    startTime,
    endTime,
    onChange,
  } = props;

  // state 
  const [visible, setVisible] = useState<boolean>(false);

  const handleTime = (timeString: string) => {
    if (timeString.indexOf(':') === -1) {
      throw new Error('错误的时间格式');  
    } 
    const tem = timeString.split(':');
    return {
      hour: Number(tem[0]),
      minute: Number(tem[1]),
    };
  };

  useEffect(() => {
    // isSameOrBefore 检查一个 moment 是否在另一个 moment 之前或与之相同
    const result = moment().set(handleTime(startTime)).isSameOrAfter(
      moment().set(handleTime(endTime))
    );
    setVisible(result);
  }, [startTime, endTime, onChange]);


  const handleRangeStartChange = (time: moment.Moment | null) => {
    const startTime = moment(time).format('HH:mm');
    onChange ? onChange({
      startTime,
      endTime,
    }) : null;
  };
  
  const handleRangeEndChange = (time: moment.Moment | null) => {
    const endTime = moment(time).format('HH:mm');
    onChange ? onChange({
      startTime,
      endTime,
    }) : null;
  };

  return (
    <div className={`${styles.rangeTime} ${className}`} style={style}>
      <TimePicker 
        format="HH:mm"
        value={moment().set(handleTime(startTime))}
        onChange={handleRangeStartChange} 
        minuteStep={60}
        suffixIcon=""
        allowClear={false}
        showNow={false}
        className={styles.timepicker}
        popupClassName="h-range-time"
        popupStyle={{
          color: 'red',
        }}
      />
      <SwapRightOutlined className={styles.icon1} />
      <TimePicker 
        format="HH:mm"
        value={moment().set(handleTime(endTime))}
        onChange={handleRangeEndChange} 
        minuteStep={60}
        allowClear={false}
        suffixIcon=""
        showNow={false}
        className={styles.timepicker}
      />
      <ClockCircleOutlined className={styles.icon2} />
      <span className={styles.tomorrow} style={{
        display: visible ? 'block' : 'none',
      }}>（次日）</span>
    </div>
  );
};

export default RangeTime;
