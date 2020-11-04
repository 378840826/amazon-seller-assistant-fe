import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.less';
import { DownOutlined } from '@ant-design/icons';
import { getBeijingTime } from '@/utils/huang';
import {
  Popover,
  Button,
} from 'antd';
import classnames from 'classnames';

interface IProps {
  value: string;
  onOk?: (time: string) => void;
}

const TimeSelectBox: React.FC<IProps> = (props) => {
  const {
    value = '00:20',
    onOk,
  } = props;

  // state
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');
  const [isChange, setIsChange] = useState<boolean>(false); // 是否已修改
  const [visible, setVisible] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<string>(value); // 显示的时候
  const [beijing, setBeijing] = useState<string>(''); // 北京时间
  const [saveValue, setSaveValue] = useState<string>(value); // 保存最新时间

  // console.log(value, 'initvalue');
  

  // 点击其它地方隐藏
  useEffect(() => {
    document.addEventListener('click', () => {
      visible ? setVisible(false) : '';
    });
  });

  const splitDate = useCallback(() => {
    if (value.indexOf(':') > -1) {
      const tem = value.split(':');
      setHour(tem[0]);
      setMinute(tem[1]);
      setBeijing(getBeijingTime(`${value}:00`));
      setShowTime(value);
    }
  }, [value]);

  // 拆分时间
  useEffect(() => {
    splitDate();
  }, [splitDate]);

  // 是否已修改
  useEffect(() => {
    if (value.indexOf(':') > -1) {
      const tem = value.split(':');
      if (hour !== tem[0] || minute !== tem[1]) {
        setIsChange(true);
      } else {
        setIsChange(false);
      }
    }
  }, [value, hour, minute]);

  const hours = [
    '00', '01', '02', '03', '04', '05', '06', '07', 
    '08', '09', '10', '11', '12', '13', '14', '15', 
    '16', '17', '18', '19', '20', '21', '22', '23',
  ];
  
  const minutes = ['00', '20', '40'];
  
  // 修改时间 
  const changeTime = (value: string, type: string) => {
    if (type === 'hour') {
      setHour(value);
      setBeijing(getBeijingTime(`${value}:${minute}:00`));
    } else {
      setMinute(value);
      setBeijing(getBeijingTime(`${hour}:${value}:00`));
    }
  };

  // 取消按钮
  const clickCancel = () => {
    setVisible(false);
    splitDate();
  };

  // 确定按钮
  const clickConfirm = () => {
    if (isChange) {
      const value = `${hour}:${minute}`;
      setVisible(false);
      setIsChange(false);
      onOk ? onOk(value) : '';
      setShowTime(value);
      setSaveValue(value);
    }
  };

  const content = () => {
    return <div className={styles.contentBox}>
      <div className={styles.hour}>
        <header>
          <strong>小时</strong>
          <span className={styles.beijing}>（相当于北京时间：{beijing}）</span>
        </header>
        <ul>
          {hours.map((item, i) => {
            if (item === hour) {
              return <li key={i} onClick={() => changeTime(item, 'hour')}>
                <Button className={classnames(styles.active, styles.numBtn)}>{item}</Button>
              </li>;
            }
            return <li key={i} onClick={() => changeTime(item, 'hour')}>
              <Button className={styles.numBtn}>{item}</Button>
            </li>;
          })}
        </ul>
      </div>

      <div className={styles.minute}>
        <header>
          <strong>分钟</strong>
        </header>
        <ul>
          {minutes.map((item, i) => {
            if (item === minute) {
              return <li key={i} onClick={() => changeTime(item, 'minute')}>
                <Button className={classnames(styles.active, styles.numBtn)}>{item}</Button>
              </li>;
            }
            return <li key={i} onClick={() => changeTime(item, 'minute')}>
              <Button className={classnames(styles.numBtn)}>{item}</Button>
            </li>;
          })}
        </ul>
      </div>
      <div className={styles.btns}>
        <Button onClick={clickCancel}>取消</Button>
        <Button className={
          classnames(
            styles.okBtn,
            isChange ? '' : styles.disable
          )
        } 
        type="primary"
        onClick={clickConfirm}
        >确定</Button>
      </div>
    </div>;
  };

  return <div>
    <div className={styles.showBox} onClick={e => e.nativeEvent.stopImmediatePropagation()}>
      <Popover content={content} visible={visible} title="" placement="left" trigger={['click']}>
        <span className={`${styles.showText} timing-show-text`} onClick={() => setVisible(true)}>
          {showTime} <DownOutlined className={styles.icon}/>
        </span>
      </Popover>
    </div>
  </div>;
};

export default TimeSelectBox;
