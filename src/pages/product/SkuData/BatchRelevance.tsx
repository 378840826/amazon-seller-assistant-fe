/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-27 17:48:33
 * @LastEditTime: 2021-04-28 14:55:56
 * 
 * 批量关联库位号
 */
import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Button, Popover, Upload, message, Modal } from 'antd';
import { useDispatch } from 'umi';
import { UploadFile, RcFile } from 'antd/lib/upload/interface';

interface IProps {
  onUploadSuccess: () => void;
}

const BatchRelevance: React.FC<IProps> = props => {
  const { onUploadSuccess } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const dispatch = useDispatch();

  const uploadConfig = {
    accept: '.xlsx',
    maxCount: 1,
    beforeUpload(file: RcFile ): boolean {
      const fileList = [file];
      if (fileList[0] && fileList[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        message.error('文件类型错误！只支持xlsx');
        return false;
      }
      setFileList([...fileList]);
      return false; // 返回false, 默认不自动上传，点击确定后再上传
    },
    onRemove(){
      setFileList([...[]]);
    },
  };

  // 上传文件
  const uploadFile = function() {
    if (fileList.length === 0) {
      message.error('未添加任何文件！');
      return;
    }

    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'skuData/uploadBatchRelevance',
        payload: {
          file: fileList[0],
        },
        reject,
        resolve,
      });
    });

    promise.then(datas => {
      const {
        code,
        data: { error = [] } = {},
      } = datas as {
        code: number;
        data: {
          error: string[];
        };
      };
  
      if (code === 200) {
        setFileList([...[]]);
        setVisible(false);
        message.success('导入成功!');
        onUploadSuccess();
        return;
      }
  
      Modal.error({
        title: '导入失败！',
        width: 500,
        zIndex: 9999999,
        icon: <></>,
        content: <div className={styles.errorBox}>
          {error && error.map((item: string, i: number) => <p key={i}>{item}</p>)}
        </div>,
        onOk() {
          setVisible(true);
        },
      });
    });
  };

  return <Popover
    content={<div className={styles.batchRelevanceBox}>
      <div className={styles.content}>
        <div className={styles.leftLayout}>
          <span>选择文件：</span>
          <Upload {...uploadConfig} fileList={fileList}>
            <Button>+选择文件</Button>
          </Upload>
          <span 
            className={classnames(styles.notFile, fileList.length && 'none')}
          >
            {fileList.length === 0 && '未选择任何文件'}
          </span>
        </div>
        <div className={styles.rightLayout}>
          <a href="/api/mws/shipment/sku/product/importSkuProductLocation">下载模板</a>
        </div>
      </div>
      <div className={styles.footer}>
        <Button onClick={() => setVisible(false)}>取消</Button>
        <Button type="primary" onClick={uploadFile}>确定</Button>
      </div>
    </div>}
    title="批量关联库位号"
    trigger="click"
    placement="bottom"
    overlayClassName={styles.batchRelevanceBox}
    visible={visible}
    onVisibleChange={(visible) => setVisible(visible)}
  >
    <Button className={styles.batchRelevanceBtn}>批量关联库位号</Button>
  </Popover>;
};

export default BatchRelevance;
