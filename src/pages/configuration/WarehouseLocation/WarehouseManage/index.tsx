/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 10:35:38
 * @LastEditTime: 2021-05-18 10:19:23
 * 
 * 添加仓库地址 or 编辑仓库地址
 */

import React, { useEffect, useState } from 'react';
import styles from './index.less';

import { Modal, Form, Input, Select, Checkbox, Radio, message } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useDispatch, useSelector, ConnectProps, IConfigurationBaseState } from 'umi';
import { shipAddress2 } from '../../config';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  initData: WarehouseLocation.IRecord|null; // 编辑，添加的话就是null
  addSuccessCallback: () => void; // 添加成功的回调
}

interface IPage extends ConnectProps {
  configurationBase: IConfigurationBaseState;
}

const { Item } = Form;
const AddWarehouse: React.FC<IProps> = props => {
  const { visible, onCancel, initData, addSuccessCallback } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  const shops = useSelector((state: IPage) => state.configurationBase.shops);
  const [priviteShops, setShops] = useState<Global.IOption[]>(shops);
  const [loading, setLoading] = useState(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<string[]>([]);

  // 请求店铺
  useEffect(() => {
    setShops([...shops]);
    if (shops.length > 0) {
      return;
    }

    dispatch({
      type: 'configurationBase/getShop',
      payload: {
        marketplace: null,
      },
    });
  }, [shops, dispatch, initData]);

  // 编辑仓库时,
  useEffect(() => {
    if (initData === null) {
      return;
    }

    form.resetFields();
    form.setFieldsValue(initData);
    const shops: string[] = [];
    initData.stores.forEach(item => {
      shops.push(item.id);
    });
    setCheckedList([...shops]);
  }, [initData, form, shops]);

  // eslint-disable-next-line
  const onCheckAllChange = (e: any) => {
    const flag = e.target.checked;
    const arr: string[] = [];

    flag && priviteShops.forEach(item => {
      arr.push(item.value);
    });


    setCheckedList(flag ? arr : []);
    setIndeterminate(false);
    setCheckAll(flag);
  };

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list as string[]);
    setIndeterminate(!!list.length && list.length < priviteShops.length);
    setCheckAll(list.length === priviteShops.length);
  };

  const modalConfig = {
    visible,
    title: '添加仓库',
    width: 790,
    centered: true,
    wrapClassName: styles.modalBox,
    confirmLoading: loading,
    maskClosable: false,
    onCancel: () => {
      if (loading) {
        message.error('正在创建中...请稍后');
        return;
      }
      onCancel();
    },
    onOk() {
      const data = form.getFieldsValue();
      initData?.id && (data.id = initData.id);
      data.storeIds = checkedList;
      
      const requestPath = initData ? 'warehouseLocation/updateWarehouse' : 'warehouseLocation/addWarehouse';
      const emptys = [undefined, null, ''];
      if (!data.name) {
        message.error('仓库名称不能为空！');
        return;
      }

      if (data.name.length > 20) {
        message.error('仓库名称长度不能超过20');
        return;
      }

      if (
        emptys.includes(data.countryCode)
        || emptys.includes(data.stateOrProvinceCode)
        || emptys.includes(data.districtOrCounty)
        || emptys.includes(data.addressLine1)
      ) {
        message.error('请填写详细地址');
        return;
      }

      setLoading(true);
      new Promise((resolve, reject) => {
        dispatch({
          type: requestPath,
          reject,
          resolve,
          payload: data,
        });
      }).then(datas => {
        setLoading(false);

        const {
          code,
          message: msg,
        } = datas as Global.IBaseResponse;

        if (code === 200) {
          message.success(msg);
          addSuccessCallback();
          onCancel();
          return;
        }
        message.error(msg);
      });
    },
  };

  return <Modal {...modalConfig}>
    <Form 
      form={form} 
      colon={false} 
      labelAlign="left" 
      layout="horizontal" 
      autoComplete="off"
      initialValues={{
        state: 'enabled',
        type: '国内仓',
      }}
    >
      <Item label="仓库名称：" name="name" rules={[{
        required: true,
      }]}>
        <Input className={styles.input}/>
      </Item>
      <Item label="仓库类型：" name="type">
        <Select className={styles.input} defaultActiveFirstOption>
          <Select.Option value="国内仓">国内仓</Select.Option>
          <Select.Option value="自营海外仓">自营海外仓</Select.Option>
        </Select>
      </Item>
      <div className={styles.address}>
        <span className={styles.textLabel}>详细地址：</span>
        <Input.Group compact className={styles.inputs} >
          <span className={styles.star}>*</span>
          <Item name="countryCode" rules={[{
            required: true,
          }]}>
            {/* <Input style={{ width: '130px', borderRadius: 0 }} placeholder="国家"/> */}
            <Select placeholder="国家" className={styles.countrySelect}>
              {shipAddress2.map((item, i) => {
                return <Select.Option value={item.value} key={i}>{item.label}</Select.Option>;
              })}
            </Select>
          </Item>
          <Item name="stateOrProvinceCode">
            <Input style={{ width: '255px', borderRadius: 0 }} placeholder="省/州"/>
          </Item>
          <Item name="districtOrCounty">
            <Input style={{ width: '255px', borderRadius: 0 }} placeholder="县/市"/>
          </Item>
        </Input.Group>
      </div>
      <Item label="地址1：" name="addressLine1" rules={[{
        required: true,
      }]}>
        <Input placeholder="楼道/门牌/楼层/房号" className={styles.input}/>
      </Item>
      <Item label="地址2：" name="addressLine2">
        <Input placeholder="楼道/门牌/楼层/房号" className={styles.input}/>
      </Item>
      <Item label="邮编：" name="postalCode" rules={[{
        required: true,
      }]}>
        <Input placeholder="" className={styles.input}/>
      </Item>
      <div className={styles.shopBox}>
        <span className={styles.textLabel}>关连店铺：</span>
        <Checkbox 
          indeterminate={indeterminate} 
          onChange={onCheckAllChange} 
          style={{ marginBottom: 5 }} 
          checked={checkAll}
        >
          全选
        </Checkbox>
        <Checkbox.Group 
          className={styles.shops} 
          options={priviteShops} 
          value={checkedList} 
          onChange={onChange} 
        />
      </div>
      <Item label="状态：" name="state" style={{ margin: '14px 0 0' }}>
        <Radio.Group options={[{ label: '启动', value: 'enabled' }, { label: '关闭', value: 'paused' }]}></Radio.Group>
      </Item>
    </Form>
  </Modal>;
};

export default AddWarehouse;
