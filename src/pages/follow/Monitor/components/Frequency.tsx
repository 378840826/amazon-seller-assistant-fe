import React, { useState, useEffect } from 'react';
import styles from '../index.less';
import { frequencyList } from '../config';
import { useSelector, useDispatch } from 'umi';
import RangeTime from './RangeTime';
import { isObject } from '@/utils/huang';
import {
  Button,
  Spin,
  Dropdown,
  Menu,
  Radio,
  message,
} from 'antd';

interface IProps {
  cb: () => void;
  flag: boolean;
}

const Frequency: React.FC<IProps> = (props) => {
  const {
    cb,
    flag,
  } = props;
  const dispatch = useDispatch();

  // store
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  // state
  const [loading, setLoading] = useState<boolean>(true);
  const [frequency, setFrequency] = useState<boolean>(false); // 控制频率下拉列表
  const [radio, setRadio] = useState<number>(30); // 频率
  const [startTime, setStartTime] = useState<string>('18:00');
  const [endTime, setEndTime] = useState<string>('9:00');

  useEffect(() => {
    setFrequency(false);
  }, [flag]);
  
  // 点击其它地方隐藏
  useEffect(() => {
    document.addEventListener('click', () => {
      setFrequency(false);
    });
  });

  // 请求初始化数据
  useEffect(() => {
    if (Number(currentShop.id) === -1) {
      return;
    }

    if (frequency === false) {
      return;
    }
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/getFrequency',
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
        },
        resolve,
        reject,
      });
    }).then( datas => {
      setLoading(false);
      const { data } = datas as {
        data: {
          startTime: string;
          endTime: string;
          frequency: number;
        };
      };
      
      if (isObject(data)) {
        setStartTime(data.startTime || '18:00');
        setEndTime(data.endTime || '9:00');
        setRadio(Number(data.frequency) || 30);
      } else {
        console.error(datas, '返回的数据有误！');
      }
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [dispatch, currentShop, frequency]);

  // 修改监控频率
  const updateFrequency = () => {
    new Promise((resolve, reject) => {
      setLoading(true);
      dispatch({
        type: 'tomMonitor/updateFrequency',
        resolve,
        reject,
        payload: {
          frequency: radio,
          startTime,
          endTime,
          headersParams: {
            StoreId: currentShop.id,
          },
        },
      });
    }).then(datas => {
      setLoading(false);
      const { message: msg } = datas as {
        message: string;
      };

      if (msg === '修改成功') {
        setFrequency(false);
        message.success(msg);
      } else {
        message.success(msg || '修改失败！');
      }
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  // 监控提醒设定组件
  useEffect(() => {
    if (frequency) {
      cb ? cb() : null;
    }
  }, [frequency]); // eslint-disable-line

  const handleRangeTime = ({ startTime, endTime }: {startTime: string; endTime: string}) => {
    setStartTime(startTime);
    setEndTime(endTime);
  };

  const menu = (
    <Menu className={`${styles.frequency}`}>
      <Menu.Item>
        <div style={{
          width: 365,
        }}>
          <Spin spinning={loading}>
            <h2>监控频率</h2>
            <div className={styles.rangetime}>
              <RangeTime 
                startTime={startTime} 
                endTime={endTime} 
                onChange={handleRangeTime}
              />
            </div>
            <Radio.Group 
              value={radio}
              onChange={(e) => setRadio(e.target.value)}
              style={{
                display: 'block',
                marginLeft: 18,
              }}>
              {
                frequencyList.map((item, i) => {
                  return <Radio 
                    className={styles.radioItem} 
                    value={item.value} 
                    key={i}
                  >
                    <strong>{item.text}</strong>
                    <span>{item.subtext}</span>
                  </Radio>;
                })
              }
            </Radio.Group>
            <div className={styles.foot_btns}>
              <Button 
                className={styles.btn} 
                onClick={ () => setFrequency(false)}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                className={styles.btn} 
                onClick={updateFrequency}
              >确定</Button>
            </div>
          </Spin>
        </div>
      </Menu.Item>
    </Menu>
  );


  return (
    <div onClick={e => e.nativeEvent.stopImmediatePropagation()}>
      <Dropdown 
        overlay={menu} 
        trigger={['click']} 
        visible={frequency}
      >
        <Button onClick={() => setFrequency(!frequency)}>监控频率设定</Button>
      </Dropdown>
    </div>
  );
};

export default Frequency;
