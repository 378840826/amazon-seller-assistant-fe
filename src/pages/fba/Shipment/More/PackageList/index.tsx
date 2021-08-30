/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-19 10:01:16
 * @LastEditTime: 2021-02-19 10:59:12
 * 
 * 上传装箱清单文件
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
import { useDispatch, useSelector } from 'umi';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

interface IProps {
  mwsShipmentId: string;
}

const Logisticis: React.FC<IProps> = props => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shipmentList = useSelector((state: any) => state.shipment.shipmentList);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // 填写的箱数，用于下载箱单模板
  const [packagesNumValue, setPackagesNumValue] = useState<string>('1');
  
  const { mwsShipmentId } = props;
  
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // 确定确定的回调
  const onConfirm = function () {

    if (fileList.length === 0) {
      message.warning('请先选择要上传的文件');
      return;
    }

    const data = form.getFieldsValue();
    // console.log(data, `上传数量`);
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'shipment/uploadPackageFile',
        resolve,
        reject,
        payload: { 
          file: data.file.file,
          packagesNum: data.input || 1,
        },
      });
    }).then(datas => {
      setLoading(false);
      const {
        message: msg,
        code,
        data: url,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } = datas as any;

      if (code !== 200) {
        message.error(msg);
        return;
      }
      message.success(msg);
      // 更新此 shipment 的箱唛下载链接
      dispatch({
        type: 'shipment/saveShipmentList',
        payload: shipmentList.map((item: Shipment.IShipmentList) => {
          if (item.mwsShipmentId === mwsShipmentId) {
            return {
              ...item,
              zipUrl: url,
            };
          }
          return item;
        }),
      });
    });
  };

  const uploadConfig = {
    name: 'file',
    accept: '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileList,
    beforeUpload: () => false,
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
  

  // 生成下载模板链接
  function getDownloadUrl() {
    const baseUrl = '/api/mws/shipment/plan/downloadPackingTemplate';
    return `${baseUrl}?mwsShipmentId=${mwsShipmentId}&packagesNum=${packagesNumValue}`;
  }

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
          // sfsf: '1',
          method: '1',
          other: 'UPS',
        }}>
        <div className={styles.file}>
          <Form.Item name="file" label="选择文件：">
            <Upload {...uploadConfig}>
              <Button>+选择文件</Button>
            </Upload>
          </Form.Item>
          <a
            download
            className={styles.download}
            href={getDownloadUrl()}           
          >
            下载箱单模板
          </a>
        </div>
        <Form.Item name="input" label="填写箱数：" initialValue="1">
          <InputNumber
            min={1}
            className={styles.packagesNumInput}
            onBlur={e => setPackagesNumValue(e.target.value)}
          />
        </Form.Item>
        <footer className={styles.footer}>
          <Button onClick={() => setVisible(false)} disabled={loading}>取消</Button>
          <Button type="primary" onClick={onConfirm} loading={loading}>确定</Button>
        </footer>
      </Form>}>
    <span className={classnames(styles.showText, visible && styles.active)}>上传装箱清单</span>
  </Popover>;
};

export default Logisticis;
