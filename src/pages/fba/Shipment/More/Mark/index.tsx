/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-19 10:01:16
 * @LastEditTime: 2021-02-19 11:49:04
 * 
 * 打印箱唛
 */
import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Form,
  Button,
  Popover,
  message,
  InputNumber,
  Select,
} from 'antd';
import { useDispatch } from 'umi';

const Logisticis: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // 确定
  const onConfirm = function () {
    const data = form.getFieldsValue();

    if (loading) {
      message.error('正在提交中');
      return;
    }

    console.log(data, '提交');
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'shipment/uploadLogisticisInfo',
        resolve,
        reject,
        payload: Object.assign({}, data),
      });
    }).then(datas => {
      setLoading(false);
      const {
        message: msg,
        code,
      } = datas as Global.IBaseResponse;

      if (code !== 200) {
        message.error(msg);
        return;
      }

      message.success(msg);
    });
  };

  return <Popover 
    trigger="click"
    placement="left"
    visible={visible}
    onVisibleChange={val => setVisible(val)}
    overlayClassName={styles.box}
    title="打印箱唛"
    content={
      <Form colon={false}
        labelAlign="left"
        form={form}
        initialValues={{
          sfsf: '1',
          method: '1',
        }}>
        <span>ShipmentID：FBAF6F29250</span>
        <Form.Item label="货件类型：" name="sfsf">
          <Select className={styles.select}>
            <Select.Option value="1">每张美国信纸打印6个</Select.Option>
            <Select.Option value="2">每张美国信纸打印4个</Select.Option>
            <Select.Option value="3">每张美国信纸打印2个</Select.Option>
            <Select.Option value="4">每张美国信纸打印1个</Select.Option>
            <Select.Option value="5">每张A4纸打印6个</Select.Option>
            <Select.Option value="6">每张A4纸打印4个</Select.Option>
            <Select.Option value="7">每张A4纸打印2个</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="input" label="打印数量：">
          <InputNumber min={1} style={{ width: 252 }}/>
        </Form.Item>
        <footer className={styles.footer}>
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Button type="primary" onClick={onConfirm} loading={loading}>确定</Button>
        </footer>
      </Form>}>
    <span className={classnames(styles.showText, visible && styles.active)}>打印箱唛</span>
  </Popover>;
};

export default Logisticis;
