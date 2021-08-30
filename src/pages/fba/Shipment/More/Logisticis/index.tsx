/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-18 15:38:05
 * @LastEditTime: 2021-02-19 09:49:04
 * 
 * 上传物流信息
 */
import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Form,
  Select,
  Radio,
  Input,
  Button,
  Popover,
  message,
} from 'antd';
import { useDispatch } from 'umi';

interface IProps {
  mwsShipmentId: string;
}

const Logisticis: React.FC<IProps> = (props) => {
  const { mwsShipmentId } = props;
  const [isPartnered, setIsPartnered] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // 确定
  const onConfirm = function () {
    const data = form.getFieldsValue();
    if (!isPartnered && !data.carrier) {
      message.error('承运商名称不能为空');
      return;
    }
    if (isPartnered) {
      delete data.carrier;
      delete data.shippingType;
    }
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'shipment/uploadLogisticisInfo',
        resolve,
        reject,
        payload: Object.assign({ mwsShipmentId }, data),
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
    content={
      <Form colon={false}
        labelAlign="left"
        form={form}
        initialValues={{
          isPartnered: true,
          shipmentType: 'SP',
          shippingType: '海运',
        }}>

        <header className={styles.title}>上传物流信息</header>
        <Form.Item label="货件类型：" name="shipmentType">
          <Select className={styles.select}>
            <Select.Option value="SP">小物件托运</Select.Option>
            <Select.Option value="LTL">零担运输</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="承运人：" name="isPartnered" className={styles.twoLine}>
          <Radio.Group
            className={styles.radio}
            options={[{ label: 'UPS', value: true, disabled: true }, { label: '其他', value: false }]}
            onChange={e => setIsPartnered(e.target.value)}
          />
        </Form.Item>
        <div className={styles.other}>
          <Form.Item name="shippingType">
            <Select className={styles.method} disabled={isPartnered}>
              <Select.Option value="海运">海运</Select.Option>
              <Select.Option value="空运">空运</Select.Option>
              <Select.Option value="陆运">陆运</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="carrier">
            <Input disabled={isPartnered} placeholder="承运商名称" className={styles.input}/>
          </Form.Item>
        </div>
        <footer className={styles.footer}>
          <Button onClick={() => setVisible(false)} disabled={loading}>取消</Button>
          <Button type="primary" onClick={onConfirm} loading={loading}>确定</Button>
        </footer>
      </Form>}>
    <span className={classnames(styles.showText, visible && styles.active)}>上传物流信息</span>
  </Popover>;
};

export default Logisticis;
