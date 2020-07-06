import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import { request, Link } from 'umi';
import styles from './index.less';
import { Iconfont, storage } from '@/utils/utils';

const ImportFile: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [file, setFile] = useState<any>();
  const [errorText, setErrorText] = useState<string>('');

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    request('/api/mws/product/report/upload', {
      method: 'POST',
      headers: { 'StoreId': storage.get('currentShop').id },
      data: formData,
    }).then(function ({ message }) {
      setUploading(false);
      Modal.info({
        icon: undefined,
        width: '340px',
        okText: '确定',
        zIndex: 1052,
        content: message || '导入成功',
      });
    }).catch(function () {
      setUploading(false);
      Modal.error({
        okText: '确定',
        content: '网络有点问题，导入失败！',
      });
    });
  };

  const handleChange = ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
    // 大小不超过 5242880
    if (files) {
      if (files[0].size > 5242880) {
        setErrorText('文件不能超过5M');
      }
      setFile(files[0]);
    }
  };

  return (
    <div className={styles.importFileMenuDropdown}>
      <Button className={styles.fileBtn}>
        +选择文件
        <Input
          type="file"
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          title="点击选择文件"
          className={styles.fileInput}
          onChange={handleChange}
        />
      </Button>
      {
        file
          ?
          <div key="" className={styles.fileName}>
            <Iconfont type="icon-lianjie1" className={styles.fileIcon} />
            {file.name}
          </div>
          :
          null
      }
      {
        (errorText && file)
          ? <div className={styles.errorText}>{errorText}</div>
          : null
      }
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={!file || !!errorText}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        { uploading ? '正在导入' : '导入' }
      </Button>
      <div className={styles.fileFooter}>
        <a href="/api/mws/product/report/template-download">下载导入模版</a>
        <Link to="/">错误报告<Iconfont type="icon-zhankai-copy" /></Link>
      </div>
    </div>
  );
};

export default ImportFile;
