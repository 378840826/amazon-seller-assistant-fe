/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-24 16:02:11
 * @LastEditTime: 2021-05-08 10:32:37
 * 
 * 
 * 文件上传
 */
import React from 'react';
import { Button, Upload, message, Modal } from 'antd';

interface IProps {
  successCallback: () => void; // 导入成功后的回调
}

const MyUpload: React.FC<IProps> = props => {
  const { successCallback } = props;
  const uploadConfig = {
    accept: '.xlsx', // 支持上传的类型
    showUploadList: false, // 是否显示上传列表,
    method: 'POST' as 'POST',
    action: '/api/mws/shipment/location/upload', // 地址
    withCredentials: true,
    beforeUpload(file: { type: string}) {
      const isJpgOrPng = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isJpgOrPng) {
        message.error('不支持的文格式');
      }
      return isJpgOrPng;
    },
    onChange(res: any) { // eslint-disable-line
      const { file: {
        status,
        response,
      } } = res;
      if (status === 'done') {
        const { code, message: msg, data: { error = [] } = {} } = response as {
          code: number;
          message: string;
          data: {
            error: string[];
          };
        };

        if (code === 200) {
          successCallback();
          message.success(msg);
          return;
        }


        Modal.error({
          title: msg,
          width: 500,
          icon: <></>,
          content: <div>
            {error.map((item: string, i: number) => <p key={i}>{item}</p>)}
          </div>,
        });
        // 部分失败不影响其他成功的，所以失败也需要刷新列表
        successCallback();
      }
    },
  };

  return <>
    <Upload {...uploadConfig}>
      <Button>批量上传</Button>
    </Upload>
  </>;
};


export default MyUpload;
