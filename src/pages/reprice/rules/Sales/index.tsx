/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-23 15:57:06
 * 
 * 根据销售表现调价 添加或 更新  根据 location.state.type settings是更新
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import {
  ruleAddRouter,
  ruleListRouter,
} from '@/utils/routes';
import {
  Link,
  useSelector,
  useLocation,
  useDispatch,
  Location,
} from 'umi';
import {
  moveArrItem,
  transitionArr,
  transitionObj,
  salesConditionTypes,
  mmsrList,
  oosmmRates,
  upDownUnchange,
  upDownHLs,
} from '../config';

// component
import Snav from '@/components/Snav';
import { Iconfont } from '@/utils/utils';
import Condition from './Condition/index';
import SecuritySettings from '../components/SecuritySettings';
import TimeSelectBox from '../components/TimeSelectBox';
import skip from '../components/Skip';

import {
  Button,
  Form,
  Input,
  message,
  Spin,
} from 'antd';
interface ILocation extends Location {
  state: {
    id: string;
    type: string;
  };
}


const { Item } = Form;
const AddSales: React.FC = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  const [timingData, setTimingData] = useState<string>('00:00');
  const [safe, setSafe] = useState<Rules.ISalesConditionsItemType|{}>({});
  const conditionsState = {
    period: '1',
    type: salesConditionTypes[0].value,
    operator: mmsrList[0].value,
    basis: '',
    operatorUnit: 'multiple',
    rateTrend: oosmmRates[0].value,
    rateUnit: 'value',
    rateBasis: '',
    action: upDownUnchange[0].value,
    unit: 'value',
    value: '',
  };
  const [conditions, setConditions] = useState<Rules.ISalesConditions[]>([
    {
      key: 0,
      Component: Condition,
      state: conditionsState,
    },
  ]);
  const [type, setType] = useState<boolean>(false); // 添加规则（false） 修改规则（true）
  const [loading, setLoading] = useState<boolean>(false); // 修改时的loading
  const { id: StoreId } = currentShop;

  let conditionsData = {}; // 保存条件组的数据
  //  安全设定数据 
  let safeData: { [key: string]: any} = {}; // eslint-disable-line

  useEffect(() => {
    if (StoreId === '-1') {
      return;
    }

    const { state } = location as ILocation ;
    if (state) {
      setType(true);
      setLoading(true);
      new Promise((resolve, reject) => {
        dispatch({
          type: 'rules/getSales',
          resolve,
          reject,
          payload: {
            headersParams: {
              StoreId: StoreId,
            },
            ruleId: state.id,
          },
        });
      }).then(datas => {
        setLoading(false);
        const {
          data,
        } = datas as {
          data: Rules.ISalesDataType;
        };
        form.setFieldsValue(data);
        
        const conditions: Rules.ISalesConditions[] = [];
        data.conditions.forEach((item, i) => {
          conditions.push({
            key: Number(`${i}00`),
            Component: Condition,
            state: item,
          });
        });
        
        setConditions([...conditions]);
        setSafe(data.safe);
        setTimingData(data.timing);
      });
    }
  }, [location, form, dispatch, StoreId]);  
  
  // 添加条件
  const addConditionItem = () => {
    if (conditions.length >= 10) {
      message.error('最多添加10个条件');
      return;
    }
    conditions.push({
      key: conditions.length,
      Component: Condition,
      state: conditionsState,
    },);
    setConditions([...conditions]);
  };

  // 移动条件
  const moveCondition = (index: number, type: string) => {
    if ( type === 'up') {
      const arr = moveArrItem(conditions, index, index - 1);
      setConditions([...arr]);
    } else if (type === 'down') {
      const arr = moveArrItem(conditions, index, index + 1);
      setConditions([...arr]);
    }
  };

  // 删除条件
  const removeCondition = (index: number) => {
    conditions.splice(index, 1);
    setConditions([...conditions]);
  };
  
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
      label: '根据销售表现调价',
    },
  ];

  // 离开规则名称
  const onMouseoutRuleName = () => {
    // console.log(form.getFieldsValue());
  };

  // 获取安全设定数据
  const getSecurifySettings = (values: {}) => {
    safeData = values;
  };

  const getTimingData = (value: string) => {
    setTimingData(value);
  };

  const conditionsCallback = (data: {}, index: number) => {
    conditionsData = transitionObj(conditionsData, data, index + 1);
  };

  // 保存
  const clickSaveBtn = () => {
    const data: any = {}; // eslint-disable-line
    const ruleName = form.getFieldValue('name');
    const conditions = transitionArr(conditionsData);
    let flag = true; // 条件是否正确条件

    // if (ruleName === '' || ruleName === undefined) {
    //   message.error('规则名称不能为空');
    //   return;
    // }

    // 条件组处理
    for (let i = 0; i < conditions.length; i++) {
      const item = conditions[i];
      const basis = item.basis;
      const operator = item.operator;
      const type = item.type;
      const rateBasis = item.rateBasis;

      if (operator) {
        // 输入框不能为空的验证
        if (
          operator === mmsrList[0].value
          || operator === mmsrList[1].value
          || operator === mmsrList[3].value
        ) {
          if (basis === '' || basis === undefined) {
            message.error('输入值不能为空');
            flag = false;
            break;
          }
        }

        // 范围
        if (operator === mmsrList[3].value) {
          const temp = basis.split('-');
          if (temp[0] === 'undefined' || temp[1] === 'undefined') {
            message.error('输入值应大于0');
            flag = false;
            break;
          }
        }

        // 订单量、销量、session 环比的判断
        if (
          type === salesConditionTypes[0].value
          || type === salesConditionTypes[1].value
          || type === salesConditionTypes[2].value
        ) {
          if (operator === mmsrList[2].value 
            && (item.rateTrend === oosmmRates[0].value || item.rateTrend === oosmmRates[2].value)
          ) {
            if (rateBasis === '' || rateBasis === undefined) {
              message.error('输入值不能为空');
              flag = false;
              break;
            }
          }
        } else if (type === salesConditionTypes[4].value) {
          // 转化率 -  环比  - 不变  的验证
          if (operator === mmsrList[2].value && item.rateTrend !== upDownUnchange[2].value) {
            if (rateBasis === '' || rateBasis === undefined) {
              message.error('输入值不能为空');
              flag = false;
              break;
            }
          }
        }
      }

      // 转化率 ≥ < 输入框的值判断
      if (item.operatorUnit) {
        if (Number(basis) < 0.1 || Number(basis) > 10) {
          message.error('倍数应在0.1 ~ 10区间');
          flag = false;
          break;
        }
      }

      // 调价操作
      if (
        item.action 
        && (
          item.action === upDownHLs[0].value 
          || item.action === upDownHLs[1].value
        ) 
      ) {
        if (item.value === undefined || item.value === '') {
          message.error('操作值不能为空');
          flag = false;
          break;
        }
      }
    }

    if (flag === false) {
      return;
    }

    if (
      safeData.stockLeValue === undefined
      || safeData.stockLeValue === null
    ) {
      safeData.stockLeValue = '';
    }

    data.name = ruleName;
    data.description = form.getFieldValue('description') || '';
    data.conditions = conditions;
    data.safe = safeData;
    data.timing = timingData;

    // 修改
    if (type) {
      const { state } = location as ILocation ;
      if (state && state.id) {
        data.ruleId = state.id;
      } else {
        message.error('规则ID有误~');
      }
    }

    new Promise((resolve, reject) => {
      dispatch({
        type: 'rules/addtOrSetSales',
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


  return <div className={styles.parentBox}>
    <Snav navList={navList} style={{
      paddingTop: 14,
    }} />
    <Spin spinning={loading}>
      <div className={styles.box}>
        <div className={styles.contentBox}>
          <Form 
            colon={true} 
            form={form} 
            labelAlign="left"
            name="salesNames"
          >
            <Item 
              label="规则名称"
              className={styles.ruleNameColumn}
              name="name"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入规则名称" className={styles.ruleName} onMouseOut={onMouseoutRuleName}/>
            </Item>
            <Item label="规则说明" name="description">
              <Input.TextArea className={styles.textarea}></Input.TextArea>
            </Item>
          </Form>

          <div className={styles.conditions}>
            <header>
              <span className={styles.title}>调价设定：</span>
              <div className={styles.add} onClick={addConditionItem}>
                <Iconfont type="icon-zengjiatianjiajiahao" className={styles.icon} />
                <span>添加条件</span>
              </div>
            </header>
            {
              conditions?.map( (Item, i) => {
                return <Item.Component key={Item.key} 
                  getDataCallback={conditionsCallback} 
                  index={i} 
                  move={moveCondition}
                  remove={removeCondition}
                  total={conditions.length}
                  initValues={Item.state}
                  type={type}
                />;
              })
            }
          </div>

          <div className={styles.securitySettings}>
            <span className={styles.textName}>安全设定：</span>
            <SecuritySettings 
              getDataFn={getSecurifySettings} 
              initValues={safe as Rules.ISafeDataType} 
            />
          </div>

          <div className={styles.timingBox}>
            <span className={styles.textName}>定时：</span>
            <div className={styles.timing}>
              <TimeSelectBox value={timingData} onOk={getTimingData}/>
              <Iconfont type="icon-dingshi" className={styles.iconAdd} />
              <Iconfont type="icon-xiugai" className={styles.iconChange} />
            </div>
          </div>

          <div className={styles.btns}>
            <Button className={type ? 'none' : ''}>
              <Link to={{
                pathname: ruleAddRouter,
                state: 'sales',
              }}>上一步</Link>
            </Button>
            <Button>
              <Link to={ruleListRouter}>取消</Link>
            </Button>
            <Button htmlType="submit" type="primary" onClick={clickSaveBtn}>
              保存
            </Button>
          </div>
        </div>
      </div>
    </Spin>
  </div>;
};

export default AddSales;


