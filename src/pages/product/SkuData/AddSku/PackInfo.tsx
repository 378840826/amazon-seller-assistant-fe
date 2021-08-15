/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-25 15:49:10
 * @LastEditTime: 2021-04-29 11:39:41
 * 
 * 包装信息
 */
import React, { useState } from 'react';
import styles from './index.less';
import { Form, Input, Select, Radio } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { packSizeUnit, packWeightUnit, packTextureUnit, sumVolumeOversize, sumWeightOversize } from '../config';
import { strToNaturalNumStr } from '@/utils/utils';

interface IProps {
  form: FormInstance;
}

const afterSelector = ({ name, change }: { name: string; change: () => void}) => {
  return (<Form.Item name={name} noStyle>
    <Select style={{ width: 82 }} onChange={change}>
      {packWeightUnit.map((item, index) => {
        return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>;
      })}
    </Select>
  </Form.Item>);
};

const { Item } = Form;
const PackInfo: React.FC<IProps> = props => {
  const { form } = props;
  // 包装体积是否有oversize
  const [packingStiplateisOversize, setPackingStiplateisOversize] = useState<string>(''); 
  // 商品体积是否有oversize
  const [productvolumeisOversize, setProductvolumeisOversize] = useState<string>(''); 
  // 包装装量是否有oversize
  const [packWeightisOversize, setPackWeightisOversize] = useState<string>(''); 
  // 商品装量是否有oversize
  const [productisOversize, setProductisOversize] = useState<string>(''); 

  // 监听包装体积是否有oversize
  const packvolumeFieldsChange = function() {
    const packingLong = form.getFieldValue('packingLong');
    const packingWide = form.getFieldValue('packingWide');
    const packingHigh = form.getFieldValue('packingHigh');
    const packingType = form.getFieldValue('packingType');

    const result = sumVolumeOversize(packingType, {
      width: packingLong || 0,
      wide: packingWide || 0,
      height: packingHigh || 0,
    });
    setPackingStiplateisOversize(result);
  };

  // 监听商品体积是否有oversize
  const productvolumeFieldsChange = function() {
    const packingLong = form.getFieldValue('commodityLong');
    const packingWide = form.getFieldValue('commodityWide');
    const packingHigh = form.getFieldValue('commodityHigh');
    const packingType = form.getFieldValue('commoditygType');

    const result = sumVolumeOversize(packingType, {
      width: packingLong || 0,
      wide: packingWide || 0,
      height: packingHigh || 0,
    });
    setProductvolumeisOversize(result);
  };

  // 监听包装重量是否有oversize
  const packWeightFieldsChange = function() {
    const number = form.getFieldValue('packingWeight');
    const packingType = form.getFieldValue('packingWeightType');

    const result = sumWeightOversize(packingType, number);
    setPackWeightisOversize(result);
  };

  // 监听商品重量是否有oversize
  const productWeightFieldsChange = function() {
    const number = form.getFieldValue('commodityWeight');
    const packingType = form.getFieldValue('commodityWeightType');

    const result = sumWeightOversize(packingType, number);
    setProductisOversize(result);
  };


  const limitedInput = function(val: string) {
    return strToNaturalNumStr(val);
  };

  // 验证长是否大于1000
  const verifyWidthValue = function(_: any, value: string) { // eslint-disable-line
    if (Number(value) > 1000) {
      return Promise.reject('最大值为1000');
    }
    return Promise.resolve();
  };

  return <div className={styles.packInfoBox}>
    <div className={styles.volume}>
      <Item label="包装体积：" name="packingLong" normalize={limitedInput} rules={[{
        validator: verifyWidthValue,
        required: true,
      }]}>
        <Input placeholder="长" onChange={packvolumeFieldsChange}/>
      </Item>
      <span className={styles.star}>*</span>
      <Item name="packingWide" normalize={limitedInput} rules={[{
        validator: verifyWidthValue,
      }]}>
        <Input placeholder="宽" onChange={packvolumeFieldsChange}/>
      </Item>
      <span className={styles.star}>*</span>
      <Item name="packingHigh" normalize={limitedInput} rules={[{
        validator: verifyWidthValue,
      }]}>
        <Input placeholder="高" onChange={packvolumeFieldsChange}/>
      </Item>
      <Item name="packingType"style={{ width: 96, marginLeft: 10 }}>
        <Select onChange={packvolumeFieldsChange}>
          {packSizeUnit.map((item, index) => {
            return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>;
          })}
        </Select>
      </Item>
      <span className={styles.oversize}>
        {packingStiplateisOversize}
      </span>
    </div>
    <div className={styles.packWeight}>
      <Item label="包装重量：" normalize={limitedInput} name="packingWeight" rules={[{
        required: true,
      }]}>
        <Input 
          onChange={packWeightFieldsChange}
          addonAfter={afterSelector({ name: 'packingWeightType', change: packWeightFieldsChange })} 
          style={{ width: 246 }}
        />
      </Item>
      <span className={styles.oversize}>{packWeightisOversize}</span>
    </div>
    <div className={styles.volume}>
      <Item label="商品体积：" name="commodityLong" normalize={limitedInput} rules={[{
        validator: verifyWidthValue,
      }]}>
        <Input placeholder="长" onChange={productvolumeFieldsChange}/>
      </Item>
      <span className={styles.star}>*</span>
      <Item name="commodityWide" normalize={limitedInput}><Input placeholder="宽" onChange={productvolumeFieldsChange}/></Item>
      <span className={styles.star}>*</span>
      <Item name="commodityHigh" normalize={limitedInput}><Input placeholder="高" onChange={productvolumeFieldsChange}/></Item>
      <Item name="commodityType"style={{ width: 96, marginLeft: 10 }}>
        <Select onChange={productvolumeFieldsChange}>
          {packSizeUnit.map((item, index) => {
            return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>;
          })}
        </Select>
      </Item>
      <span className={styles.oversize}>{productvolumeisOversize}</span>
    </div>
    <div className={styles.packWeight}>
      <Item label="商品重量：" name="commodityWeight" normalize={limitedInput}>
        <Input 
          
          onChange={productWeightFieldsChange}
          addonAfter={afterSelector({ name: 'commodityWeightType', change: productWeightFieldsChange })} style={{ width: 246 }}/>
      </Item>
      <span className={styles.oversize}>{productisOversize}</span>
    </div>
    <div className={styles.texture}>
      <Item label="包装材质：" name="packingMaterial">
        <Radio.Group options={packTextureUnit}/>
      </Item>
      <Item name="otherPacking">
        <Input />
      </Item>
    </div>
    <Item label="易碎品：" name="isFragile">
      <Radio.Group options={[{ label: '是', value: true }, { label: '否', value: false }]}/>
    </Item>
  </div>;
};


export default PackInfo;

