import React, { useState } from 'react';
import { Spin, Switch, message } from 'antd';
import { useDispatch } from 'umi';
import styles from '../index.less';

interface IProps {
  checked: boolean;
  id: string;
  StoreId: string;
}
const SwitchComponent: React.FC<IProps> = (props) => {
  const {
    checked,
    id,
    StoreId,
  } = props;
  
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<boolean>(checked || false);
  
  const change = (switchStatus: boolean) => {
    setLoading(true);
    
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/updateMonitorSwitch',
        payload: {
          headersParams: {
            StoreId,
          },
          followMonitorId: id,
          switchStatus,
        },
        resolve,
        reject,
      });
    }).then(datas => {
      const { message: msg } = datas as {
        message: string;
      };
      
      setLoading(false);
      setValue(!value);
      message.success(msg);
    }).catch(() => {
      setLoading(false);
    });
  };

  return <Spin size="small" spinning={loading}>
    <Switch checked={value}className={`h-switch ${styles.switch}`} onChange={change}></Switch>
  </Spin>;
};

export default SwitchComponent;
