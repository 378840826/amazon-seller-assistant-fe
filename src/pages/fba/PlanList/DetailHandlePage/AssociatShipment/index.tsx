/*
 * @Author: HuangChaoYi
 * @email: 1089109@qq.com
 * @Date: 2021-05-15 11:37:30
 * @LastEditTime: 2021-05-18 15:05:53
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Button, Popover, Select, Form, message } from 'antd';
import { useDispatch } from 'umi';

interface IShipment {
  mwsShipmentId: string;
  shipmentName: string;
}

interface IProps {
  id?: string;
}

const AssociatShipment: React.FC<IProps> = props => {
  const [visible, setVisible] = useState<boolean>(false);
  const [shipmentList, setShipmentList] = useState<IShipment[]>([]);
  
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      const promise = new Promise((resolve, reject) => {
        dispatch({
          type: 'planList/shipmentList',
          resolve,
          reject,
          payload: {},
        });
      });

      promise.then(res => {
        const { code, data, message: msg } = res as {
          code: number;
          data: IShipment[];
          message?: string;
        };
        if (code === 200) {
          setShipmentList([...data]);
          return;
        }
        message.error(msg || '关联shipment列表失败！');
      });
    }
  }, [visible, dispatch]);
  

  // 确定关联已有的shipment
  const ok = function() {
    const mwsShipmentId = form.getFieldValue('mwsShipmentId');

    new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/associatShipment',
        resolve,
        reject,
        payload: {
          mwsShipmentId,
          shipmentId: props.id,
        },
      });
    }).then(res => {
      const { code, message: msg } = res as Global.IBaseResponse;
      if (code === 200) {
        message.success(msg || '关联成功！');
        setVisible(false);
        return;
      }
      message.error(msg || '关联失败！');
    });
  };

  const content = (<div className={styles.box}>
    <Form form={form}>
      <Form.Item name="mwsShipmentId">
        <Select>
          {shipmentList.map((item, i) => {
            return <Select.Option 
              value={item.mwsShipmentId} 
              key={i}>{item.shipmentName}</Select.Option>;
          })}
        </Select>
      </Form.Item>
      <footer>
        <Button onClick={() => setVisible(false)}>取消</Button>
        <Button type="primary" onClick={ok}>确定</Button>
      </footer>
    </Form>
      
  </div>);
    
  return <Popover
    visible = {visible}
    onVisibleChange={v => setVisible(v)}
    content={content}
    trigger={['click']}
  >
    <Button type="primary">关联已有Shipment</Button>
  </Popover>;
};

export default AssociatShipment;
