/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 17:50:42
 * @LastEditTime: 2021-03-18 20:41:07
 * 
 * 仓库开关
 */
import React, { useState } from 'react';
import { useDispatch } from 'umi';
import {
  Switch,
  Spin,
  message,
} from 'antd';

interface ISwitchType {
  checked?: boolean;
  id: string;
}

const MySwitch: React.FC<ISwitchType> = (props) => {
  const dispatch = useDispatch();
  const { checked } = props;
  const [flag, setFlag] = useState<boolean>(checked || false); // 是否开启
  const [loading, setLoading] = useState<boolean>(false);

  message.config({
    maxCount: 1,
  });

  const onChange = (checked: boolean) => {
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'logistics/setLogisticsState',
        reject,
        resolve,
        payload: {
          id: props.id,
          state: checked ? 'enabled' : 'paused',
        },
      });
    }).then(datas => {
      const { 
        code = 0,
        message: msg,
      } = datas as Global.IBaseResponse;
      
      setLoading(false);
      if (code === 200) {
        setFlag(checked);
        message.success(msg || '操作成功！');
        return;
      }
      
      message.error(msg || '操作失败！');
    });
  };
  
  return <>
    <Spin size="small" spinning={loading}>
      <Switch checked={flag} onChange={onChange} className="h-switch" />
    </Spin>
  </>;
};

export default MySwitch;
