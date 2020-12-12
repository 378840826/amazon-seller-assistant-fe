/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-23 15:57:06
 * 
 * 根据竞品价格调价
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Link, useSelector, useLocation, useDispatch } from 'umi';
import { strToMoneyStr } from '@/utils/utils';
import {
  ruleAddRouter,
  ruleListRouter,
} from '@/utils/routes';

import Snav from '@/components/Snav';
import SecuritySettings from '../components/SecuritySettings';
import { cpList, addSubtract } from '../config';
import skip from '../components/Skip';
import {
  Form,
  Input,
  Select,
  Button,
  message,
} from 'antd';

interface ILocation extends Location {
  query: {
    type?: string;
    id?: string;
  };
}

interface IProps {
  initValues: Rules.ISalesConditionsItemType;
}

const { Item } = Form;
const { Option } = Select;
const AddSales: React.FC<IProps> = () => {
  const [form] = Form.useForm();
  const location = useLocation() as any;// eslint-disable-line
  const dispatch = useDispatch();
  const { query } = location as ILocation;
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  
  const [safe, setSafe] = useState<Rules.ISafeDataType|{}>({});
  const [type, setType] = useState<boolean>(false); // 添加规则（false） 修改规则（true）
  let safeData: { [key: string]: any} = {}; // eslint-disable-line

  const navList: Snav.INavList[] = [
    {
      path: ruleListRouter,
      label: '规则列表',
      type: 'Link',
      target: '_blank',
    },
    {
      path: ruleAddRouter,
      label: '选择规则类型',
      type: 'Link',
    },
    {
      label: '根据竞品价格调价',
    },
  ];
  const StoreId = currentShop.id;
  useEffect(() => {
    if (StoreId === '-1') {
      return;
    }

    // 查询修改
    if (query && query.type && query.type === 'settings') {
      setType(true);
      new Promise((resolve, reject) => {
        dispatch({
          type: 'rules/getCompete',
          resolve,
          reject,
          payload: {
            headersParams: {
              StoreId,
            },
            ruleId: (query && query.id ? query.id : undefined),
          },
        });
      }).then(datas => {
        const { data } = datas as { data: Rules.ICompeteData };
        form.setFieldsValue({
          name: data.name,
          description: data.description,
          condition: {
            competePrice: data.condition.competePrice,
            action: data.condition.action,
            unit: data.condition.unit,
            value: data.condition.value,
          },
          timing: data.timing,
        });
        setSafe(data.safe as Rules.ISafeDataType);
      });
    }
  }, [query, dispatch, form, StoreId]);

  // 离开规则名称
  const onMouseoutRuleName = () => {
    if (!form.getFieldValue('name')) {
      message.error('规则名称不能为空');
    }
  };

  // 安全设定
  const getSafeData = (value: {}) => {
    safeData = value;
  };

  // 离开调价设定值
  const blurValue = () => {
    if (!form.getFieldValue('condition').value) {
      message.error('此数值不能为空');
    }
  };

  // 限制输入
  const limitedInput = (value: string) => {
    return strToMoneyStr(value);
  };

  // 保存
  const clickSaveConditions = () => {
    const data = form.getFieldsValue();
    data.safe = safeData;
    if (!data.name || data.name.trim() === '') {
      message.error('规则名称不能为空');
      return;
    }

    data.description = data.description ? data.description : '';

    if (!data.condition.value) {
      message.error('输入数值不能为空');
      return;
    }

    if (
      safeData.stockLeValue === undefined
      || safeData.stockLeValue === null
    ) {
      safeData.stockLeValue = '';
    }

    // 修改
    if (type) {
      if (query && query.id) {
        data.ruleId = query.id;
      } else {
        message.error('规则ID有误~');
      }
    }

    new Promise((resolve, reject) => {
      dispatch({
        type: 'rules/addtOrSetCompete',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
          ...data,
        },
      });
    }).then(datas => {
      const {
        message: msg,
      } = datas as {
        message: string;
      };

      if (type) {
        if (msg === '设定成功') {
          skip({
            title: '修改成功！',
          }); 
        } else {
          message.error(msg || '修改失败！');
        }
      } else {
        if (msg === '设定成功') {
          skip({
            title: '创建成功！',
          }); 
        } else {
          message.error(msg || '创建失败！');
        }
      }
    });
  };

  return <div >
    <Snav navList={navList} style={{
      paddingTop: 14,
    }} />
    <div className={styles.addCompetitorBox}>
      <div className={styles.addCompetitor}>
        <Form
          colon={true} 
          form={form} 
          labelAlign="left"
          name="addCompetitor"
        >
          <Item 
            label="规则名称"
            className={styles.ruleNameColumn}
            name="name"
            rules={[{ required: true, message: '规则名称不能为空' }]}
          >
            <Input placeholder="请输入规则名称" className={styles.ruleName} onBlur={onMouseoutRuleName}/>
          </Item>
          <Item label="规则说明" name="description">
            <Input.TextArea className={styles.textarea}></Input.TextArea>
          </Item>
        
          <div className={styles.priceSetting}>
            <span className={styles.titleName}>调价设定: </span>
            <span className={styles.priceText}>调价操作：</span>
            <Item name={['condition', 'competePrice']} className={styles.downlist} initialValue="max">
              <Select>
                {
                  cpList.map((item, i) => {
                    return <Option value={item.value} key={i}>{item.label}</Option>;
                  })
                }
              </Select>
            </Item>
            <Item name={['condition', 'action']} className={styles.downlist} initialValue="up">
              <Select>
                {
                  addSubtract.map((item, i) => {
                    return <Option value={item.value} key={i}>{item.label}</Option>;
                  })
                }
              </Select>
            </Item>
            <Item name={['condition', 'unit']} className={styles.downlist} initialValue="value">
              <Select>
                <Option value="value">{currentShop.currency}</Option>;
                <Option value="percent" >%</Option>;
              </Select>
            </Item>
            <Item name={['condition', 'value']} className={styles.input} normalize={limitedInput}>
              <Input onBlur={blurValue}/>
            </Item>
          </div>
        </Form>
        <div className={styles.safeSetting}>
          <span className={styles.titleName}>安全设定: </span>
          <SecuritySettings getDataFn={getSafeData} initValues={safe as Rules.ISafeDataType} />
        </div>
      
        <Form 
          colon={true} 
          form={form} 
          labelAlign="left"
        >
          <div className={styles.frequency}>
            <span className={styles.titleName}>调价频率: </span>
            <Item className={styles.downlists} name="timing" initialValue="20">
              <Select dropdownClassName={styles.frequencySelect}>
                {/* <Option value="10">每10分钟</Option> */}
                <Option value="20">每20分钟</Option>
                {/* <Option value="30">每30分钟</Option> */}
                <Option value="60">每60分钟</Option>
              </Select>
            </Item>
          </div>
        
          <div className={styles.btns}>
            <Button className={type ? 'none' : ''}>
              <Link to={{
                pathname: ruleAddRouter,
                state: 'competitor',
              }}>上一步</Link>
            </Button>
            <Button>
              <Link to={ruleListRouter}>取消</Link>
            </Button>
            <Button htmlType="submit" type="primary" onClick={clickSaveConditions}>
              保存
            </Button>
          </div>
        </Form>
      </div>
    </div>
  </div>;
};

export default AddSales;


