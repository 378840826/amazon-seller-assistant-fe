/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-28 17:09:41
 * @LastEditTime: 2021-04-29 17:41:14
 */
import React, { useState } from 'react';
import styles from './index.less';
import { Button, Popover, Radio, Form, message } from 'antd';
import { useDispatch } from 'umi';


interface IProps {
  ids: string[];
  successCallback: (state: string) => void;
}

const BatchUpdateState: React.FC<IProps> = props => {
  const [visible, setVisible] = useState<boolean>(false);


  const { ids, successCallback } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const ok = function() {
    if (ids.length === 0) {
      message.error('未选中任何行！');
      return;
    }

    const state = form.getFieldValue('state');
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'skuData/batchUpdateState',
        resolve,
        reject,
        payload: {
          state,
          ids,
        },
      });
    });

    promise.then(datas => {
      const {
        code,
        message: msg,
      } = datas as Global.IBaseResponse;

      if (code === 200) {
        message.success(msg);
        successCallback(state);
        setVisible(false);
        return;
      }
      message.error(msg);
    });
  };

  const Content = () => <Form 
    className={styles.batchState} 
    form={form} 
    initialValues={{ state: '在售' }}
  >
    <Form.Item name="state">
      <Radio.Group>
        <Radio value="在售">在售</Radio>
        <Radio value="试卖">试卖</Radio>
        <Radio value="清货">清货</Radio>
        <Radio value="部分清货">部分清货</Radio>
        <Radio value="停售">停售</Radio>
        <Radio value="部分停售">部分停售</Radio>
      </Radio.Group>
    </Form.Item>
    <footer>
      <Button onClick={() => setVisible(false)}>取消</Button>
      <Button type="primary" onClick={ok}>确定</Button>
    </footer>
  </Form>;


  return <Popover
    trigger="click"
    content={<Content />}
    visible={visible}
    placement="bottom"
    onVisibleChange={(visible) => setVisible(visible)}
  >
    <Button>批量修改状态</Button>
  </Popover>;
};

export default BatchUpdateState;
