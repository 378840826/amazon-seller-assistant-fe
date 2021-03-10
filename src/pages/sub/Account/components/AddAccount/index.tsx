import React, { useState } from 'react';
import { connect } from 'dva';
import { 
  Modal, 
  Button, 
  Form, 
  Input, 
  message, 
  Checkbox,
  Row,
  Col } from 'antd';
import { Iconfont } from '@/utils/utils';
import { Link } from 'umi';
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
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
interface IStatus {
  width: number;
  closable: boolean;
  footer: null;
  visible: boolean;
  confirmLoading: boolean;
  checkedIndexList: CheckboxValueType[];
}

interface IStoreListConnectProps extends IConnectProps{
  sub: ISubModelState;
  currentUser: API.ICurrentUser;
}
const AddAccount: React.FC<IStoreListConnectProps> = function({ sub, currentUser, dispatch }){
  const surplus = currentUser.memberFunctionalSurplus.filter(item => item.functionName === '子账号');
  
  const leftNum = surplus.length > 0 ? surplus[0].frequency : 0;
  const storeList = sub.storeList;  
  const roleList = sub.roleList;
  const [status, setStatus] = useState<IStatus>({ 
    width: 532,
    closable: false, //dialog的头部关闭图案消失
    footer: null, //dialog页脚取消确认按钮消失
    visible: false, //dialog出现与否
    confirmLoading: false, //点击确认按钮发送请求是否出现loading图案
    checkedIndexList: [],
  });

  const [form] = Form.useForm();

  const checkboxChange = (checkedIndexList: CheckboxValueType[]) => {
    setStatus((status) => {
      return {
        ...status,
        checkedIndexList: checkedIndexList,
      };
    });
    
  };

  const onOpen = () => {
    if (leftNum <= 0){
      message.error('当前会员等级剩余可添加子账号:0个');
      return;
    }  
    setStatus( (status) => {
      return {
        ...status,
        visible: true,
      };
    });
  };
  const handleCancel = () => {
    // form.resetFields();
    setStatus( (status) => {
      return {
        ...status,
        visible: false,
        confirmLoading: false,
        checkedIndexList: [], //被选中元素的索引
      };
    });
  };

  const onFinish = (values: Store) => {
    const checkedList = storeList.filter((item, index) => {
      return status.checkedIndexList.indexOf(index) > -1;
    }).map((item: { sellerId: string; marketplace: string }) => {
      return { sellerId: item.sellerId, marketplace: item.marketplace };
    });

    const params = {
      username: values.username,
      email: values.email.trim(),
      password: values.password,
      roleList: values.roleList,
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
      callback: (res: { code: number; message: string }) => {
        if (res.code === 200){
          handleCancel();
          dispatch({
            type: 'user/fetchCurrent',
          });
        } else {
          setStatus((status) => ({
            ...status,
            confirmLoading: false,
          }));
          Modal.error({
            content: res.message, centered: true, 
          });
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
          destroyOnClose={true}
          closable={status.closable}
          visible={status.visible}
          footer={status.footer}
          className="__form_modal_subAccount"
        >
          <Form
            {...layout}
            name="basic"
            form={form}
            onFinish={onFinish}
            preserve={false}
            autoComplete="off"
          >
            <Form.Item
              label="用户名"
              name="username"
              required={true}
              rules = {[
                () => ({
                  validator: (rule, value) => new Promise((resolve, reject) => {
                    if (!value){
                      reject('用户名不能为空');
                      return;
                    }
                    if (value){
                      if (!validate.username.test(value)){
                        reject('长度4~16，支持字母、中文、数字、下划线，不允许为纯数字');
                        return;
                      }
                      dispatch({
                        type: 'user/existUsername',
                        payload: {
                          username: value,
                        },
                        callback: (res: {data: {exist: boolean}}) => {
                          if (res.data.exist){
                            reject('用户名已存在');
                          }
                          resolve();
                        },
                      });
                    }
                  }),
                }),
              ]}
            >
              <Input allowClear autoComplete="new-username"/>
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              required={true}
              rules={[
                () => ({
                  validator: (rule, value) => new Promise((resolve, reject) => {
                    if (!value){
                      reject('邮箱不能为空');
                    }
                    if (value){
                      if (!validate.email.test(value)){
                        reject('邮箱格式不正确');
                        return;
                      }
                      dispatch({
                        type: 'user/existEmail',
                        payload: {
                          email: value,
                        },
                        callback: (res: { data: { exist: boolean } }) => {
                          if (res.data.exist){
                            reject('邮箱已存在'); 
                          }
                          resolve();
                        },
                      });
                    }  
                  }),
                
                }),
              ]}
            >
              <Input allowClear autoComplete="new-email" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }, { pattern: validate.password, message: '长度在6~16，至少包含字母、数字、和英文符号中的两种' }]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item name="checkboxs" label="负责店铺：">
              <StoreList checkedList={status.checkedIndexList} 
                checkboxChange={checkboxChange}/>       
            </Form.Item>
            <Row>
              <Col span={19}>
                <Form.Item 
                  className={styles.__role_item} 
                  {...formItemLayout}
                  label="角色："
                  name="roleList" 
                  required={true}
                  rules={[
                    () => ({
                      validator: (rule, value = []) => new Promise((resolve, reject) => {
                        if (!value.length){
                          reject('角色不能为空');
                          return;
                        }
                        resolve();
                      }),
                    }),
                  ]}
                >
                  <Checkbox.Group className={styles.__group}>
                    <Row>
                      {roleList.map( (item, index) => 
                        <Col key={index}>
                          <Checkbox  
                            value={item.id} 
                          >
                            {item.roleName}
                          </Checkbox>
                        </Col>
                      )}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Link className={styles.__link} to="/auth/index">添加角色<Iconfont className={styles.__add_icon} type="icon-zhankai"/></Link>
              </Col>
            </Row>
            <Form.Item {...tailLayout}>
              <Button htmlType="button" disabled={status.confirmLoading} onClick={handleCancel} className="__cancel">取消</Button>
              <Button type="primary" htmlType="submit" loading={status.confirmLoading} className="__save">保存</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>  
      <div className={styles.left_number}>
            剩余可添加子账号:<span className={styles.green}>{leftNum}个</span>
      </div>
    </div>
  );
};
export default connect(({ sub, user }: IConnectState) => ({
  sub,
  currentUser: user.currentUser,
}))(AddAccount);
