/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-19 10:01:16
 * @LastEditTime: 2021-02-19 10:59:12
 * 
 * 上传装箱清单
 */
import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Form,
  Button,
  Popover,
  message,
  Upload,
  InputNumber,
} from 'antd';
import { useDispatch } from 'umi';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

const Logisticis: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // 确定
  const onConfirm = function () {
    const data = form.getFieldsValue();
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

  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    fileList,
    onChange(info: UploadChangeParam) {
      let fileList = [...info.fileList];
      fileList = fileList.slice(-1); // 限制数量

      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }
        return file;
      });
  
      setFileList(fileList);
    },
  };

  return <Popover 
    trigger="click"
    placement="left"
    visible={visible}
    onVisibleChange={val => setVisible(val)}
    overlayClassName={styles.box}
    title="上传箱单"
    content={
      <Form colon={false}
        labelAlign="left"
        form={form}
        initialValues={{
          sfsf: '1',
          method: '1',
          other: 'UPS',
        }}>
        <div className={styles.file}>
          <Form.Item name="file" label="选择文件：">
            <Upload {...props}>
              <Button>+选择文件</Button>
            </Upload>
          </Form.Item>
          <a href="22" className={styles.download}>下载箱单模板</a>
        </div>
        <Form.Item name="input" label="填写箱数：">
          <InputNumber min={0} style={{ width: 235 }}/>
        </Form.Item>
        <footer className={styles.footer}>
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Button type="primary" onClick={onConfirm} loading={loading}>确定</Button>
        </footer>
      </Form>}>
    <span className={classnames(styles.showText, visible && styles.active)}>上传装箱清单</span>
  </Popover>;
};

export default Logisticis;
