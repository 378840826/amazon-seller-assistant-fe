/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-22 15:54:05
 * @LastEditTime: 2021-03-18 22:23:15
 */
import React, { useState } from 'react';
import styles from './index.less';
import { Button, message, Popover, Form, Input, Select, Radio } from 'antd';
import { useDispatch } from 'umi';
import { shipAddress } from '../../config';


interface IProps {
  logisticsLength: number;
  successCallback: () => void;
}

const Add: React.FC<IProps> = props => {
  const { logisticsLength, successCallback } = props;
  const [visible, setVisible] = useState<boolean>(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // 计费方式
  const chargeMode = ['体积重（kg）', '实重（kg）', '体积（CBM）'];

  const add = function() {
    if (logisticsLength > 30) {
      message.error('最多可以添加30种物流方式');
      return;
    }

    setVisible(!visible);
  };

  // 确定的回调
  const onConfirm = function() {
    const data = form.getFieldsValue();
    if (logisticsLength > 30) {
      message.error('最多可以添加30种物流方式');
      return;
    }

    // 错误禁止提交
    const fieldError = form.getFieldsError().find(err => {
      return err.errors.length && err;
    });
    if (fieldError) {
      message.error(fieldError.errors[0]);
      return;
    }

    new Promise((resolve, reject) => {
      dispatch({
        type: 'logistics/addLogistics',
        resolve,
        reject,
        payload: data,
      });
    }).then(datas => {
      const {
        code,
        message: msg,
      } = datas as Global.IBaseResponse;


      if (code === 200) {
        message.success(msg);
        setVisible(false);
        form.resetFields();
        successCallback();
        return;
      }

      message.error(msg);
    });
  };

  const initValues = {
    volumeWeight: 5000,
    state: 'enabled',
    countryCode: 'CN-中国',
    chargeType: chargeMode[0],
  };

  const popoverConfig = {
    visible,
    trigger: 'click',
    placement: 'bottomLeft' as 'bottomLeft',
    overlayClassName: styles.box,
    width: 450,
    content: <Form form={form} colon={false} initialValues={initValues} labelAlign="left">
      <Form.Item label="物流名称：" name="name" rules={[{ required: true }]}>
        <Input maxLength={20}/>
      </Form.Item>
      <Form.Item label="物流商名称：" name="providerName" rules={[{ required: true, max: 20 }]}>
        <Input />
      </Form.Item>
      <Form.Item label="货代：" name="forwarderName" rules={[{ max: 12 }]}>
        <Input />
      </Form.Item>
      <Form.Item label="发货国家：" name="countryCode">
        <Select>
          { shipAddress.map((item, index) => {
            return <Select.Option key={index} value={item}>{item}</Select.Option>;
          })}
        </Select>
      </Form.Item>
      <Form.Item label="计费方式：" name="chargeType">
        <Select>
          { chargeMode.map((item, index) => {
            return <Select.Option key={index} value={item}>{item}</Select.Option>;
          })}
        </Select>
      </Form.Item>
      <Form.Item label="体积重折算系数：" name="volumeWeight">
        <Input />
      </Form.Item>
      <Form.Item label="状态：" name="state">
        <Radio.Group options={[{ label: '启动', value: 'enabled' }, { label: '关闭', value: 'paused' }]}></Radio.Group>
      </Form.Item>
      <div className={styles.footBtns}>
        <Button onClick={() => setVisible(false)}>取消</Button>
        <Button type="primary" onClick={onConfirm}>确定</Button>
      </div>
    </Form>,
  };

  return <Popover {...popoverConfig}>
    <Button onClick={add} type="primary">添加物流方式</Button>
  </Popover>;
};

export default Add;
