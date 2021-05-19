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

const Logisticis: React.FC = () => {
  const [other, setOther] = useState<string>('UPS');
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // 确定
  const onConfirm = function () {
    const data = form.getFieldsValue();

    if (other === '其它' && !data.name) {
      message.error('承运商名称不能为空');
      return;
    }
    delete data.other;

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
    content={
      <Form colon={false}
        labelAlign="left"
        form={form}
        initialValues={{
          sfsf: '1',
          method: '1',
          other: 'UPS',
        }}>

        <header className={styles.title}>上传物流信息</header>
        <Form.Item label="货件类型：" name="sfsf">
          <Select className={styles.select}>
            <Select.Option value="1">小物件托运</Select.Option>
            <Select.Option value="2">零担运输</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="承运人：" name="other" className={styles.twoLine}>
          <Radio.Group className={styles.radio} options={['UPS', '其它']} onChange={e => setOther(e.target.value)}></Radio.Group>
        </Form.Item>
        <div className={styles.other}>
          <Form.Item name="method">
            <Select className={styles.method} disabled={other !== '其它'}>
              <Select.Option value="1">海运</Select.Option>
              <Select.Option value="2">空运</Select.Option>
              <Select.Option value="3">陆运</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="name">
            <Input disabled={other !== '其它'} placeholder="承运商名称" className={styles.input}/>
          </Form.Item>
        </div>
        <footer className={styles.footer}>
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Button type="primary" onClick={onConfirm} loading={loading}>确定</Button>
        </footer>
      </Form>}>
    <span className={classnames(styles.showText, visible && styles.active)}>上传物流信息</span>
  </Popover>;
};

export default Logisticis;
