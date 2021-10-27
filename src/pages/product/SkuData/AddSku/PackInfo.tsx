/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-25 15:49:10
 * @LastEditTime: 2021-04-29 11:39:41
 * 
 * 包装信息
 */
import React from 'react';
import styles from './index.less';
import { Form, Input, Select, Radio } from 'antd';
//import { FormInstance } from 'antd/lib/form';
import { packSizeUnit, packWeightUnit, packTextureUnit } from '../config';
//import { strToMoneyStr } from '@/utils/utils';

/** 
interface IProps {
  form: FormInstance;
}
*/

const afterSelector = ({ name }: { name: string }) => {
  return (<Form.Item name={name} noStyle>
    <Select style={{ width: 82 }} >
      {packWeightUnit.map((item, index) => {
        return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>;
      })}
    </Select>
  </Form.Item>);
};

const { Item } = Form;
const PackInfo: React.FC = () => {
  //const { form } = props;
  // 包装体积是否有oversize
  //const [packingStiplateisOversize, setPackingStiplateisOversize] = useState<string>(''); 
  // 商品体积是否有oversize
  //const [productvolumeisOversize, setProductvolumeisOversize] = useState<string>(''); 
  // 包装装量是否有oversize
  //const [packWeightisOversize, setPackWeightisOversize] = useState<boolean>(false); 
  // 商品装量是否有oversize
  //const [productisOversize, setProductisOversize] = useState<string>(''); 

  // 监听包装体积是否有oversize
  /** 
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
  */
  //数据保留3位
  const strToMoneyStr = function (value: string) {
    // 删除数字和小数点以外的字符
    let newValue = value.replace(/[^\d.]/g, '');
    // 只保留第一个小数点
    // newValue = newValue.replace(/\.{2,}/g, '.');
    newValue = newValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // 只保留两位小数
    //newValue = newValue.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

    newValue = newValue.replace(/^(.*\..{3}).*$/, '$1');

    // 去掉整数部分前导的 0
    if (newValue.indexOf('.') < 0 && newValue !== '') {
      newValue = String(parseFloat(newValue));
    }
    // 第一位不能为小数点
    if (newValue.indexOf('.') === 0) {
      newValue = '0.';
    }
    return newValue;
  };


  const limitedInput = function(val: string) {
    return strToMoneyStr(val);
  };

  // 验证重量是否大于68038g
  /**const verifyWidthValue = function(_: any, value: string) { // eslint-disable-line
    if (Number(value) > 68038) {
      return Promise.reject('最大值为68038');
    }
    return Promise.resolve();
  };
  */


  return <div className={styles.packInfoBox}>
    <div className={styles.volume}>
      <Item label="包装体积：" name="packingLong" normalize={limitedInput} rules={[{       
        required: true,
      }]}>
        <Input placeholder="长" />
      </Item>
      <span className={styles.star}>*</span>
      <Item name="packingWide" normalize={limitedInput}>
        <Input placeholder="宽"/>
      </Item>
      <span className={styles.star}>*</span>
      <Item name="packingHigh" normalize={limitedInput}>
        <Input placeholder="高"/>
      </Item>
      <Item name="packingType"style={{ width: 96, marginLeft: 10 }}>
        <Select>
          {packSizeUnit.map((item, index) => {
            return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>;
          })}
        </Select>
      </Item>
    </div>
    <div className={styles.packWeight}>
      <Item label="包装重量：" normalize={limitedInput} name="packingWeight" rules={[{
        required: true,
        //validator: verifyWidthValue,
      }]}>
        <Input 
          addonAfter={afterSelector({ name: 'packingWeightType' })} 
          style={{ width: 246 }}
        />
      </Item>
    </div>
    <div className={styles.volume}>
      <Item label="商品体积：" name="commodityLong" normalize={limitedInput}>
        <Input placeholder="长"/>
      </Item>
      <span className={styles.star}>*</span>
      <Item name="commodityWide" normalize={limitedInput}><Input placeholder="宽"/></Item>
      <span className={styles.star}>*</span>
      <Item name="commodityHigh" normalize={limitedInput}><Input placeholder="高"/></Item>
      <Item name="commodityType"style={{ width: 96, marginLeft: 10 }}>
        <Select>
          {packSizeUnit.map((item, index) => {
            return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>;
          })}
        </Select>
      </Item>
    </div>
    <div className={styles.packWeight}>
      <Item label="商品重量：" name="commodityWeight" normalize={limitedInput}>
        <Input           
          addonAfter={afterSelector({ name: 'commodityWeightType' })} style={{ width: 246 }}/>
      </Item>
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

