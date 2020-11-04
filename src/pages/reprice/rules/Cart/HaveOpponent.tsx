import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import { Iconfont, strToMoneyStr } from '@/utils/utils';
import classnames from 'classnames';
import {
  Form,
  Input,
  Select,
} from 'antd';
import { useSelector } from 'umi';
import { ffs, ffas, cartPriceList, cartCurrentPrint, cartsmmr, addSubtract } from '../config';

interface IProps {
  index: number;
  total: number; // 总数量
  move: (index: number, type: string, type1: string) => void;
  delCondition: (index: number, type: string) => void;
  getDataCallback: (data: {}, index: number) => void;
  initValues: Rules.IHaveTypeData;
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
  const [operator, setOperator] = useState<string>(''); // 且价格
  const [action, setAction] = useState<string>(''); // 调价操作 第一个
  const [isChange, setisChange] = useState<boolean>(false); // 记录组件是否已修改

  // 初始化选中赋值
  useEffect(() => {
    if (isChange) {
      return;
    }

    const initValue = initValues;
    const a = JSON.stringify(initValues) as string;
    const callbackInit = JSON.parse(a) as Rules.IHaveTypeData;
    if (initValues.operator !== cartPriceList[3].value) {
      initValue.myPrice = cartCurrentPrint[0].value;
      delete callbackInit.myPrice;
    } else {
      setOperator(cartPriceList[3].value);
    }

    if (initValues.action !== cartsmmr[3].value) {
      initValue.actionOperator = addSubtract[0].value;
      initValue.unit = 'value';
      initValue.value = '';
      delete callbackInit.actionOperator;
      delete callbackInit.unit;
      delete callbackInit.value;
    } else {
      setAction(cartsmmr[3].value);
    }
    form.setFieldsValue({ ...initValue });
    getDataCallback(callbackInit, index);
  }, [form, initValues, getDataCallback, index]); // eslint-disable-line

  // 设置各个关系的显隐并给父组件 - 这里是点击的时候
  const setFieldVisible = useCallback(() => {
    const data = form.getFieldsValue();
    
    let values: any = JSON.stringify(data); // eslint-disable-line
    values = JSON.parse(values);

    setOperator(values.operator);
    setAction(values.action);

    if (values.operator !== cartPriceList[3].value) {
      delete values.myPrice;
    }
    
    if (values.action !== cartsmmr[3].value) {
      delete values.actionOperator;
      delete values.unit;
      delete values.value;
    }
    getDataCallback(values, index);
  }, [form, getDataCallback, index]);


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
      move(index, 'up', 'haveOpponent');
    }
    if (type === 'down') {
      if (index + 1 === total) {
        return;
      }
      move(index, 'down', 'haveOpponent');
    }
  };

  // 限制输入
  const limitedInput = (value: string) => {
    return strToMoneyStr(value);
  };

  return <Form
    form={form}
    name={`HavaOpponent${index}`}
    onValuesChange={onValuesChange}
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
        <span>，最低价的对手是</span>
        <Item name={['lowest']} className={styles.lowestdownList}>
          <Select>
            {
              ffas.map((item, i) => {
                return <Option value={item.value} key={i}>{item.label}</Option>;
              })
            }
          </Select>
        </Item>
        <span>，且价格</span>
        <Item name={['operator']} className={styles.operatordownList}>
          <Select>
            {
              cartPriceList.map((item, i) => {
                return <Option value={item.value} key={i}>{item.label}</Option>;
              })
            }
          </Select>
        </Item>
        <div className={classnames(
          operator === cartPriceList[3].value ? '' : 'none',
          styles.myPricedownListBox
        )}>
          <span>我的</span>
          <Item name={['myPrice']} className={styles.myPricedownList}>
            <Select>
              {
                cartCurrentPrint.map((item, i) => {
                  return <Option value={item.value} key={i}>{item.label}</Option>;
                })
              }
            </Select>
          </Item>
        </div>
      </div>
      <div className={styles.LayoutTwoCol}>
        <span className={styles.priceText}>调价操作：</span>
        <Item name={['action']} className={styles.actionDownlist}>
          <Select>
            {
              cartsmmr.map((item, i) => {
                return <Option value={item.value} key={i}>{item.label}</Option>;
              })
            }
          </Select>
        </Item>
        <div className={classnames(
          styles.rightOuterBox,
          action === cartsmmr[3].value ? '' : 'none',
        )}>
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
        </div>
        <div className={styles.arrows}>
          <Iconfont 
            type="icon-shangyi" 
            onClick={() => moveCondition('up')} 
            className={classnames(styles.up, styles.icon)} 
          />
          <Iconfont 
            type="icon-shangyi" 
            onClick={() => moveCondition('down')}
            className={classnames(styles.down, styles.icon)} 
          />
        </div>
        <Iconfont className={styles.close} type="icon-close" onClick={() => delCondition(index, 'haveOpponent')}/>
      </div>
    </div>
  </Form>;
};

export default HavaOpponent;

