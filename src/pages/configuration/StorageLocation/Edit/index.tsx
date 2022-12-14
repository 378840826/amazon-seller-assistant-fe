/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-23 14:32:12
 * @LastEditTime: 2021-04-26 16:42:02
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Button, message, Popover, Form, Input, Select, Radio } from 'antd';
import { useDispatch, ConnectProps, IWarehouseLocationState, useSelector } from 'umi';


interface IProps {
  successCallback: () => void;
  initData: StorageLocation.IRecord;
}

interface IPage extends ConnectProps {
  warehouseLocation: IWarehouseLocationState;
}

const Add: React.FC<IProps> = props => {
  const { successCallback, initData } = props;

  const warehousesTemp = useSelector((state: IPage) => state.warehouseLocation.warehouses);
  const [visible, setVisible] = useState<boolean>(false);
  const [number, setNumber] = useState<string>(''); // 库位号
  const [isCustom, setisCustom] = useState<boolean>(false); // 是否为自定义
  
  const [warehouses, setWarehouses] = useState<Global.IOption[]>([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // 库区填写限制 A-Z 01-99
  const districtReg = /^[A-Z](0[1-9]|[1-9][0-9])$/;
  // 货架号 层 位 两位字母或数字
  const twoNumStrReg = /^[A-Z|0-9][A-Z|0-9]$/;

  // 仓库列表
  useEffect(() => {
    visible && dispatch({
      type: 'warehouseLocation/getWarehouseList',
      payload: {
        state: true,
      },
    });
  }, [dispatch, visible]);

  // 处理仓库地址
  useEffect(() => {
    if (!visible) {
      return;
    }

    const arr: Global.IOption[] = [];
    warehousesTemp.forEach(item => {
      arr.push({
        label: item.name,
        value: String(item.id),
      });
    });
    
    setWarehouses([...arr]);
    warehousesTemp.length && form.setFieldsValue({ warehouseId: initData.warehouseId });
  }, [warehousesTemp, form, visible, initData]);

  // 值入表单数据
  useEffect(() => {
    if (!visible) {
      return;
    }

    const { warehouseId, locationNo, isCustomize } = initData;
    setisCustom(isCustomize);
    const temp = locationNo.split('-');
    setNumber(locationNo);


    if (isCustomize) {
      form.setFieldsValue({
        warehouseId,
        radio: '自定义库位号',
        custom: locationNo,
      });
      return;
    } 
    form.setFieldsValue({
      warehouseId,
      radio: '标准库位号',
      district: temp[0],
      number: temp[1],
      tier: temp[2],
      place: temp[3],
    });
  }, [initData, form, visible]);

  // 确定的回调
  const onConfirm = function() {
    const data = form.getFieldsValue();
    const emptys = [undefined, null, ''];

    if (isCustom) {
      if (emptys.includes(number)) {
        form.submit();
        message.error('库位号不能为空');
        return;
      } 
    } else {
      if (emptys.includes(data.district)) {
        message.error('库区不能为空');
        form.submit();
        return;
      }

      if (!districtReg.test(data.district)) {
        message.error('库区请输入一位大写字母+2位纯数字，如B02');
        form.submit();
        return;
      }

      if (emptys.includes(data.number)) {
        message.error('货架号不能为空');
        form.submit();
        return;
      }

      if (!twoNumStrReg.test(data.number)) {
        message.error('货架号可输入两个字符，支持大写字母或数字，如E9');
        form.submit();
        return;
      }

      if (emptys.includes(data.tier)) {
        message.error('层不能为空');
        form.submit();
        return;
      }

      if (!twoNumStrReg.test(data.tier)) {
        message.error('层可输入两个字符，支持大写字母或数字，如E9');
        form.submit();
        return;
      }

      if (emptys.includes(data.place)) {
        message.error('位不能为空');
        form.submit();
        return;
      }

      if (!twoNumStrReg.test(data.place)) {
        message.error('位可输入两个字符，支持大写字母或数字，如E9');
        form.submit();
        return;
      }
    }


    new Promise((resolve, reject) => {
      dispatch({
        type: 'storageLocation/updateStorageLocation',
        resolve,
        reject,
        payload: { 
          warehouseId: data.warehouseId, 
          locationNo: number, 
          isCustomize: isCustom,
          id: initData.id,
        },
      });
    }).then(datas => {
      const {
        code,
        message: msg,
      } = datas as Global.IBaseResponse;


      if (code === 200) {
        message.success(msg);
        setVisible(false);
        form.resetFields();
        successCallback();
        return;
      }

      message.error(msg);
    });
  };

  const initValues = {
    radio: '标准库位号',
  };

  // 表单字段改变时，改变库位号
  const onFieldsChange = function(values: any) { // eslint-disable-line
    const show = ['', '', '', ''];
    const data = form.getFieldsValue();

    if (values.warehouseId) {
      return;
    }

    // 输入小写改为大写
    const newFieldsValue: {
      district?: string;
      number?: string;
      tier?: string;
      place?: string;
    } = {};
    values.district && (newFieldsValue.district = values.district.toUpperCase());
    values.number && (newFieldsValue.number = values.number.toUpperCase());
    values.tier && (newFieldsValue.tier = values.tier.toUpperCase());
    values.place && (newFieldsValue.place = values.place.toUpperCase());
    form.setFieldsValue(newFieldsValue);

    if (values.radio) {
      setisCustom( values.radio === '自定义库位号');
    }

    show[0] = data.district && data.district.toUpperCase() || '';
    show[1] = data.number || '';
    show[2] = data.tier || '';
    show[3] = data.place || '';
    data.radio === '自定义库位号' ? setNumber(data.custom) : setNumber(show.join('-'));
  };

  const popoverConfig = {
    visible,
    trigger: 'click',
    placement: 'right' as 'right',
    overlayClassName: styles.box,
    width: 450,
    onVisibleChange(visible: boolean) {
      setVisible(visible);
    },
    content: <Form form={form} 
      colon={false} 
      initialValues={initValues} 
      labelAlign="left" onValuesChange={onFieldsChange}
      autoComplete="off"
    >
      <div className={styles.showNumbert}>
        <span className={styles.text}>库位号：</span>
        <span>{number}</span>
      </div>
      <Form.Item label="仓库：" name="warehouseId">
        <Select>
          { warehouses.map((item, index) => {
            return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>;
          })}
        </Select>
      </Form.Item>
      <Form.Item label="" name="radio">
        <Radio.Group options={['标准库位号', '自定义库位号']}></Radio.Group>
      </Form.Item>
      <Form.Item label=" " name="custom" className={classnames(isCustom ? '' : 'none')} rules={[{
        max: 12,
        message: '库位号不能超过12个字符',
      }]}>
        <Input />
      </Form.Item>
      <div className={classnames(isCustom ? 'none' : '')}>
        <Form.Item label="库区：" name="district" rules={[{
          message: '库区请输入一位大写字母+2位纯数字，如B02',
          pattern: districtReg,
        }]}>
          <Input />
        </Form.Item>
        <Form.Item label="货架号：" name="number" rules={[{
          message: '请输入两个字符，支持大写字母或数字，如E9',
          pattern: twoNumStrReg,
        }]}>
          <Input />
        </Form.Item>
        <Form.Item label="层：" name="tier"rules={[{
          message: '请输入两个字符，支持大写字母或数字，如E9',
          pattern: twoNumStrReg,
        }]}>
          <Input />
        </Form.Item>
        <Form.Item label="位：" name="place" rules={[{
          message: '请输入两个字符，支持大写字母或数字，如E9',
          pattern: twoNumStrReg,
        }]}>
          <Input />
        </Form.Item>
      </div>
      <div className={styles.footBtns}>
        <Button onClick={() => setVisible(false)}>取消</Button>
        <Button type="primary" onClick={onConfirm}>确定</Button>
      </div>
    </Form>,
  };

  return <Popover {...popoverConfig}>
    <span 
      className={classnames(styles.edit, visible && styles.active)} 
      onClick={() => setVisible(!visible)}
    >编辑</span>
  </Popover>;
};

export default Add;
