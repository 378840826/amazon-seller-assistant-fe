import React, { useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import {
  Switch,
  Spin,
  message,
} from 'antd';

interface ISwitchType {
  checked?: boolean;
  asin: string;
}

const MySwitch: React.FC<ISwitchType> = (props) => {
  const dispatch = useDispatch();
  const { checked } = props;
  const [flag, setFlag] = useState<boolean>(checked || false);
  const [loading, setLoading] = useState<boolean>(false);
  const current = useSelector((state: CommectMonitor.IGlobalType) => state.global.shop.current);

  message.config({
    maxCount: 1,
  });

  const onChange = (checked: boolean) => {
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'commectSettings/setcommentMonitorSettingsSwitch',
        payload: {
          reject,
          resolve,
          data: {
            asin: props.asin,
            switchStatus: checked,
            headersParams: {
              StoreId: current.id,
            },
          },
        },
      });
    }).then(datas => {
      const { 
        code = 0,
        message: msg,
      } = datas as { code: number; message: string};

      setLoading(false);
      if (code && code === 200) {
        setFlag(checked);
        message.success(msg || '操作成功！');
      } else {
        message.error(msg || '操作失败！');
      }
    }).catch(err => {
      setLoading(false);
      message.error(err || '操作失败！');
    });
  };

  
  return <>
    <Spin size="small" spinning={loading}>
      <Switch checked={flag} onChange={onChange} className="h-switch" />
    </Spin>
  </>;
};

export default MySwitch;
