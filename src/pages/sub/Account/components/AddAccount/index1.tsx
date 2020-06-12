import React, { useState } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Input } from 'antd';
import { validate } from '@/utils/utils';
import { IConnectState, IConnectProps } from '@/models/connect';
import { ISubModelState } from '@/models/sub';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import StoreList from '../StoreList';
import styles from './index.less';
import { Store } from 'antd/lib/form/interface';


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 15 },
};
interface IStatus {
  width: number;
  closable: boolean;
  footer: null;
  visible: boolean;
  confirmLoading: boolean;
  checkedIdList: CheckboxValueType[];
}

interface IStoreListConnectProps extends IConnectProps{
  sub: ISubModelState;
}
const AddAccount: React.FC<IStoreListConnectProps> = function({ sub, dispatch }){
  const storeList = sub.storeList;
  const [status, setStatus] = useState<IStatus>({ 
    width: 532,
    closable: false, //dialog的头部关闭图案消失
    footer: null, //dialog页脚取消确认按钮消失
    visible: false, //dialog出现与否
    confirmLoading: false, //点击确认按钮发送请求是否出现loading图案
    checkedIdList: [],
  });

  const [validateUName, setValidateUName] = useState<{
    validateStatus: '' | 'error' | 'success' | 'warning' | 'validating' | undefined;
    help: null | string;
}>({ validateStatus: 'success', help: null });

  const [validateEmail, setValidateEmail] = useState<{
  validateStatus: '' | 'error' | 'success' | 'warning' | 'validating' | undefined;
  help: null | string;
}>({ validateStatus: 'success', help: null });

  //用户名验证
  const onChangeUName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === ''){
      setValidateUName({ validateStatus: 'error', help: '请输入用户名' });
      return;
    }
   

    if (value){
      if (!(validate.username.test(value))){
        setValidateUName({ validateStatus: 'error', help: '长度4~16，支持字母、数字、下划线，不允许为纯数字' });
        return;
      }

      dispatch({
        type: 'user/existUsername',
        payload: {
          username: value,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (res: { data: { exist: any } }) => {
          if (res.data.exist){
            setValidateUName({ validateStatus: 'error', help: '用户名已存在' });
          } else {
            setValidateUName({ validateStatus: 'success', help: '' });
          }
        },
      });
    } 

  };

  //邮箱验证
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (!value){
      setValidateEmail({ validateStatus: 'error', help: '请输入邮箱' });
      return;
    }

    if (value){
      if (!(validate.email.test(value))){
        setValidateEmail({ validateStatus: 'error', help: '邮箱格式不正确' });
        return;
      }

      dispatch({
        type: 'user/existEmail',
        payload: {
          email: value,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (res: { data: { exist: any } }) => {
          if (res.data.exist){
            setValidateEmail({ validateStatus: 'error', help: '邮箱已存在' });
          } else {
            setValidateEmail({ validateStatus: 'success', help: null });
          }
        },
      });
    }
  };


  const checkboxChange = (checkedIdList: CheckboxValueType[]) => {
    setStatus((status) => {
      return {
        ...status,
        checkedIdList: checkedIdList,
      };
    });
    
  };

  const onOpen = () => {
    setStatus( (status) => {
      return {
        ...status,
        visible: true,
      };
    });
  };
  const handleCancel = () => {
    setStatus( (status) => {
      return {
        ...status,
        visible: false,
      };
    });
  };
  const onFinish = (values: Store) => {
    const checkedList = storeList.filter( (item: { sellerId: CheckboxValueType }) => {
      return status.checkedIdList.indexOf(item.sellerId) > -1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).map((item: { sellerId: any; marketplace: any }) => {
      return { sellerId: item.sellerId, marketplace: item.marketplace };
    });
    const params = {
      username: values.username,
      email: values.email,
      password: values.password,
      stores: checkedList,
    };
    setStatus((state) => {
      return {
        ...state,
        confirmLoading: true,
      };
    });
    dispatch({
      type: 'sub/addUser',
      payload: params,
      callback: (res: { code: number }) => {
        if (res.code === 200){
          handleCancel();
        }
      },
    });
  };

 
  return (
    <div className={styles.addBtnWrap}>
      <div className={styles.AddAccount}>
        <Button className="addBtn" type="primary" onClick={onOpen}>添加子账号</Button>
        <Modal
          width={status.width}
          mask
          centered
          closable={status.closable}
          visible={status.visible}
          footer={status.footer}
          className="__form_modal_subAccount"
        >
          <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
          >
            <Form.Item
              label="用户名"
              name="username"
              validateStatus={validateUName.validateStatus}
              help={validateUName.help}
            >
              <Input allowClear onChange={onChangeUName} />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              validateStatus={validateEmail.validateStatus}
              help={validateEmail.help}
            >
              <Input allowClear onChange={onChangeEmail}/>
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }, { pattern: validate.password, message: '长度在6~16，至少包含字母、数字、和英文符号中的两种' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item name="checkboxs" label="负责店铺：">
              
              <StoreList checkedList={status.checkedIdList} checkboxChange={checkboxChange}/>
               
            </Form.Item>
           

            <Form.Item {...tailLayout}>
              <Button htmlType="button" disabled={status.confirmLoading} onClick={handleCancel} className="__cancel">取消</Button>
              <Button type="primary" htmlType="submit" loading={status.confirmLoading} className="__save">保存</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>  
    </div>
  );
};
export default connect(({ sub }: IConnectState) => ({
  sub,
}))(AddAccount);
