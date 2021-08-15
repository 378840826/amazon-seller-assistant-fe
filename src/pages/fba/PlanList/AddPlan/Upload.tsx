/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-03-17 15:55:12
 * @LastEditTime: 2021-05-10 12:03:16
 */
import React from 'react';
import { Upload, Button, message, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
interface IProps {
  form: FormInstance;
  uploadSuccess: (data: planList.IProductList[]) => void;
}

const MyUpload: React.FC<IProps> = props => {
  const { form, uploadSuccess } = props;
  const { countryCode, storeId } = form.getFieldsValue();


  // 批量上传配置
  const uploadConfig = {
    accept: '.xlsx', // 支持上传的类型
    showUploadList: false, // 是否显示上传列表,
    method: 'POST' as 'POST',
    action: '/api/mws/shipment/mSkuProduct/upload', // 地址
    withCredentials: true,
    name: 'file',
    data: {
      storeId: storeId,
      marketplace: countryCode,
    },
    beforeUpload(file: { type: string}) {
      const flag = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!flag) {
        message.error('不支持的文格式');
      }
      if ( !countryCode || !storeId) {
        message.error('选择站点和店铺后方可上传！');
        return false;
      }
      
      return flag;
    },
    onChange(res: any) { // eslint-disable-line
      const { file: {
        status,
        response,
      } } = res;
      if (status === 'done') {
        const { 
          message: msg, 
          data: { error = [], shipmentProductVos = [] } = {},
        } = response as {
          code: number;
          message: string;
          data: {
            error: string[];
            shipmentProductVos: planList.IProductList[];
          };
        };
        
        if (error.length !== 0) {
          Modal.error({
            title: msg,
            width: 500,
            icon: <></>,
            content: <div>
              {error.map((item: string, i: number) => <p key={i}>{item}</p>)}
            </div>,
          });
          return;
        }
        uploadSuccess(shipmentProductVos);
      }
    },
  };

  return <Upload {...uploadConfig}>
    <Button type="primary">批量上传</Button>
  </Upload>;
};


export default MyUpload;
