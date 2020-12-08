import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.less';
import { Iconfont, strToMoneyStr } from '@/utils/utils';
import classnames from 'classnames';
import {
  Form,
  Input,
  Select,
} from 'antd';
import { useSelector } from 'umi';
import { ffs, ffas, addSubtract, action } from '../config';

interface IProps {
  index: number;
  total: number; // 总数量
  move: (index: number, type: string, type1: string) => void;
  delCondition: (index: number, type: string) => void;
  getDataCallback: (data: {}, index: number) => void;
  initValues: Rules.IHoldCartType;
}

const { Item } = Form;
const { Option } = Select;
const HavaOpponent: React.FC<IProps> = props => {
  const {
    index,
    total,
    move,
    delCondition,
    getDataCallback,
    initValues,
  } = props;
  const [form] = Form.useForm();
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const [isChange, setisChange] = useState<boolean>(false); // 记录组件是否已修改

  useEffect(() => {
    if (isChange) {
      return;
    }
    form.setFieldsValue({ ...initValues });
    getDataCallback(initValues, index);
  }, [form, initValues, getDataCallback, index]); // eslint-disable-line

  // 设置各个关系的显隐并给父组件
  const setFieldVisible = useCallback(() => {
    const data = form.getFieldsValue();
    getDataCallback(data, index);
  }, [form, getDataCallback, index]);


  // 初始化
  useEffect(() => {
    setFieldVisible();
  }, [form, setFieldVisible]);

  // 表单字段值更新时触发
  const onValuesChange = () => {
    setFieldVisible();
    setisChange(true);
  };

  // 移动条件
  const moveCondition = (type: string) => {
    if (type === 'up') {
      if (index === 0) {
        return;
      }
      move(index, 'up', 'holdCart');
    }
    if (type === 'down') {
      if (index + 1 === total) {
        return;
      }
      move(index, 'down', 'holdCart');
    }
  };

  // 限制输入
  const limitedInput = (value: string) => {
    return strToMoneyStr(value);
  };

  return <Form
    onValuesChange={onValuesChange}
    name={`HoldCart${index}`}
    form={form}
  >
    <div className={classnames(
      styles.cartConditions,
      index === 0 ? '' : styles.up,
      total === index + 1 ? '' : styles.down,
    )}>
      <div className={styles.LayoutOneCol}>
        我是
        <Item name={['me']} className={styles.medownList}>
          <Select>
            {
              ffs.map((item, i) => {
                return <Option value={item.value} key={i}>{item.label}</Option>;
              })
            }
          </Select>
        </Item>
        <span>，黄金购物车卖家是</span>
        <Item name={['buybox']} className={styles.lowestdownList}>
          <Select>
            {
              ffas.map((item, i) => {
                return <Option value={item.value} key={i}>{item.label}</Option>;
              })
            }
          </Select>
        </Item>
      </div>
      <div className={styles.LayoutTwoCol}>
        <span className={styles.priceText}>调价操作：</span>
        <Item name={['action']} className={styles.actionDownList}>
          <Select>
            {
              action.map((item, i) => {
                return <Option value={item.value} key={i}>{item.label}</Option>;
              })
            }
          </Select>
        </Item>
        <Item name={['actionOperator']} className={styles.actionOperatorDownlist}>
          <Select>
            {
              addSubtract.map((item, i) => {
                return <Option value={item.value} key={i}>{item.label}</Option>;
              })
            }
          </Select>
        </Item>
        <Item name={['unit']} className={styles.unitDownlist}>
          <Select>
            <Option value="value" >{currentShop.currency}</Option>;
            <Option value="percent" >%</Option>;
          </Select>
        </Item>
        <Item name={['value']} normalize={limitedInput}>
          <Input />
        </Item>
        <div className={styles.arrows}>
          <Iconfont 
            type="icon-xiajiang" 
            onClick={() => moveCondition('up')} 
            className={classnames(styles.up, styles.icon)} 
          />
          <Iconfont 
            type="icon-xiajiang" 
            onClick={() => moveCondition('down')}
            className={classnames(styles.down, styles.icon)} 
          />
        </div>
        <Iconfont className={styles.close} type="icon-shanchu" onClick={() => delCondition(index, 'holdCart')}/>
      </div>
    </div>
  </Form>;
};

export default HavaOpponent;

