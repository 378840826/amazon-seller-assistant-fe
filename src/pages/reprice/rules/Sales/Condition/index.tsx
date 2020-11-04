import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import {
  salesDateRange,
  salesConditionTypes,
  mmsrList,
  oosmmRates,
  mmsList,
  upDownUnchange,
  upDownHLs,
} from '../../config';
import classnames from 'classnames';
import { Iconfont, strToMoneyStr } from '@/utils/utils';
import { useSelector } from 'umi';
import {
  Select,
  Input,
  Form,
  message,
} from 'antd';

interface IProps {
  getDataCallback: (params: {}, i: number) => void;
  index: number;
  move: (index: number, type: 'up'|'down') => void;
  remove: (index: number) => void;
  total: number;
  initValues: Rules.ISalesConditionsItemType;
}

const { Item } = Form;
const { Option } = Select;
// 添加规则 根据销售表现调价 添加单个条件
const SalesConditionItem: React.FC<IProps> = (props) => {
  const {
    getDataCallback,
    index,
    move, // 移动条件
    total, // 条件总数
    remove, // 删除条件
    initValues,
  } = props;
  const [form] = Form.useForm();
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const [isChange, setisChange] = useState<boolean>(false); // 记录组件是否已修改
  const [ossps, setOssps] = useState<string>(''); //类型 = 订单量/销量/Session/转化率/销量和库存的比值的值
  const [oosmm, setoosmm] = useState<string>(''); // ≥ / < / 环比 / 范围的值
  const [siglr, setsiglr] = useState<string>(''); // ≥ / <  / 范围的值
  const [rangeData, setRangeData] = useState<string>(''); // 上升(本期>上期>0) ..... 不变(上期=0，本期=0)的值
  const [udno, setUdno] = useState<string>(''); // 上升下降不变的值
  const [udmm, setudmm] = useState<string>(''); // 上调 下调  调到最高价 调到最低价的值


  message.config({
    duration: 2,
    maxCount: 1,
    top: 60,
  });

  // 初始化选中赋值
  useEffect(() => {
    if (isChange) {
      return;
    }

    const tem = JSON.stringify(initValues);
    const responseData = JSON.parse(tem); // 返回的数据
    const type = initValues.type;
    const operator = initValues.operator;
    const basis = initValues.basis;
    const action = initValues.action;
    
    // eslint-disable-next-line
    const initData: any = { // 渲染给组件的数据
      period: responseData.period,
      type,
      oss: {},
      si: {},
      pc: {},
    };
    
    if (
      type === salesConditionTypes[0].value
      || type === salesConditionTypes[1].value
      || type === salesConditionTypes[2].value
    ) {
      // 订单量 销量 Session
      initData.oss.operator = operator;

      if (operator === mmsrList[0].value || operator === mmsrList[1].value) {
        // ≥ <
        initData.oss.basis = basis;
      } else if (operator === mmsrList[2].value) {
        // 环比
        const rateTrend = initValues.rateTrend;
        initData.oss.rateTrend = rateTrend;
        
        if (rateTrend === oosmmRates[0].value || rateTrend === oosmmRates[2].value ) {
          initData.oss.rateUnit = initValues.rateUnit;
          initData.oss.rateBasis = initValues.rateBasis;
        }
      } else if (operator === mmsrList[3].value) {
        // 范围
        const tem = basis.split('-');
        const min = tem[0];
        const max = tem[1];
        responseData.basis = `${min}-${max}`;
        initData.oss.rangeMin = min;
        initData.oss.rangeMax = max;
      }
    } else if (type === salesConditionTypes[3].value) {
      // 转化率
      initData.pc.operator = operator;

      if (operator === mmsrList[0].value || operator === mmsrList[1].value ) {
        // ≥ <
        initData.pc.operatorUnit = initValues.operatorUnit;
        initData.pc.pcBasis = basis;
      } else if (operator === mmsrList[2].value) {
        // 环比
        const rateTrend = initValues.rateTrend;
        initData.pc.rateTrend = rateTrend;
        if (rateTrend === upDownUnchange[2].value) {
          // 不变
        } else {
          // 上升 下降
          initData.pc.upDownBasis = initValues.rateBasis;
        }
      } else if (operator === mmsrList[3].value) {
        // 范围
        const tem = basis.split('-');
        const min = tem[0];
        const max = tem[1];
        responseData.basis = `${min}-${max}`;
        initData.pc.rangeMin = min;
        initData.pc.rangeMax = max;
      }
    } else if (type === salesConditionTypes[4].value) {
      // 销量和库存的比值
      initData.si.operator = operator;
      if (operator === mmsList[0].value || operator === mmsList[1].value) {
        initData.si.basis = basis;
      } else {
        // 范围
        const tem = basis.split('-');
        const min = tem[0];
        const max = tem[1];
        responseData.basis = `${min}-${max}`;
        initData.si.rangeMin = min;
        initData.si.rangeMax = max;
      }
    }

    // 调价操作
    initData.action = initValues.action;
    if (action === upDownHLs[0].value || action === upDownHLs[1].value) {
      initData.unit = initValues.unit;
      initData.value = initValues.value;
    }
    
    form.setFieldsValue({ ...initData });
    getDataCallback(responseData, index);
  }, [form, initValues, getDataCallback, index]); // eslint-disable-line

  // 设置各个关系的显隐并给父组件
  const setFieldVisible = useCallback(() => {
    const obj: any = {}; // eslint-disable-line
    const type = form.getFieldValue('type'); // 类型
    const action = form.getFieldValue('action');// 调价操作
    
    obj.period = form.getFieldValue('period'); // 周期
    obj.action = action; // 调价操作
    obj.type = type;

    setOssps(type);
    setudmm(action);

    if (
      type === salesConditionTypes[0].value
      || type === salesConditionTypes[1].value
      || type === salesConditionTypes[2].value
    ) {
      // 订单量 销量 Session
      const operator = form.getFieldValue('oss').operator;
      setoosmm(operator);
      obj.operator = operator;

      if (operator === mmsrList[0].value || operator === mmsrList[1].value) {
        // ≥ <
        const basis = form.getFieldValue('oss').basis;
        obj.basis = basis;
      } else if (operator === mmsrList[2].value) {
        // 环比
        const rateTrend = form.getFieldValue('oss').rateTrend;
        setRangeData(rateTrend);
        obj.rateTrend = rateTrend;

        if (rateTrend === oosmmRates[0].value || rateTrend === oosmmRates[2].value) {
          // 上升(本期>上期>0)  下降(上期>本期>0)
          const rateUnit = form.getFieldValue('oss').rateUnit;
          const rateBasis = form.getFieldValue('oss').rateBasis;
          obj.rateUnit = rateUnit;
          obj.rateBasis = rateBasis;
        } else {
          // 其它四种情况
          delete obj.rateUnit;
          delete obj.basis;
        }
      } else if (operator === mmsrList[3].value) {
        // 范围
        const min = form.getFieldValue('oss').rangeMin;
        const max = form.getFieldValue('oss').rangeMax;
        obj.basis = `${min}-${max}`;
      }
    } else if (type === salesConditionTypes[3].value) {
      // 转化率
      const operator = form.getFieldValue('pc').operator;
      setoosmm(operator);
      obj.operator = operator;

      if (operator === mmsrList[0].value || operator === mmsrList[1].value ) {
        // ≥ <
        const operatorUnit = form.getFieldValue('pc').operatorUnit;
        const basis = form.getFieldValue('pc').pcBasis;
        obj.operatorUnit = operatorUnit;
        obj.basis = basis;
      } else if (operator === mmsrList[2].value) {
        // 环比
        const rateTrend = form.getFieldValue('pc').rateTrend;
        setUdno(rateTrend);
        obj.rateTrend = rateTrend;

        if (rateTrend === upDownUnchange[2].value) {
          // 不变
          delete obj.basis;
        } else {
          // 上升 下降
          const basic = form.getFieldValue('pc').upDownBasis;
          obj.rateBasis = basic;
        }
      } else if (operator === mmsrList[3].value) {
        // 范围
        const min = form.getFieldValue('pc').rangeMin;
        const max = form.getFieldValue('pc').rangeMax;
        obj.basis = `${min}-${max}`;
      }

    } else if (type === salesConditionTypes[4].value) {
      // 销量和库存的比值
      const operator = form.getFieldValue('si').operator;
      setsiglr(operator);
      obj.operator = operator;

      if (operator === mmsList[0].value || operator === mmsList[1].value) {
        //≥ <
        obj.basis = form.getFieldValue('si').basis;
      } else {
        // 范围、
        const min = form.getFieldValue('si').rangeMin;
        const max = form.getFieldValue('si').rangeMax;
        obj.basis = `${min}-${max}`;
      }
    }

    // 调价操作
    if (action === upDownHLs[0].value || action === upDownHLs[1].value) {
      obj.unit = form.getFieldValue('unit');
      obj.value = form.getFieldValue('value');
    }
    getDataCallback(obj, index);
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
      move(index, 'up');
    }
    if (type === 'down') {
      if (index + 1 === total) {
        return;
      }
      move(index, 'down');
    }
  };

  // 限制输入
  const limitedInput = (value: string) => {
    return strToMoneyStr(value);
  };

  /**
   * 鼠标离开之后验证数值
   * type
   * oss订单量/销量/Session 所有的条件组
   * pc 转化率
   * si 销售和库存的比值
   * 
   * type2
   * lt <的验证
   * @param type oos/pc/si
   * @param type1 lt
   */
  const checkValues = (type: string) => {
    const data = form.getFieldsValue();
    if (type === 'oss') {
      const { operator, basis, rateBasis, rateTrend, rangeMin, rangeMax } = data.oss;
      
      if (operator === mmsrList[1].value && Number(basis) === 0) {
        // < 
        message.error('输入值应大于0');
      } else if (
        operator === mmsrList[2].value
        && ( rateTrend === oosmmRates[0].value || rateTrend === oosmmRates[2].value)
        && Number(rateBasis) === 0
      ) {
        // 环比 上升(本期>上期>0) 下降(上期>本期>0)不可以为0
        message.error('输入值应大于0');
      } else if (
        // 范围
        operator === mmsrList[3].value
        && (
          Number(rangeMin) === 0
          || Number(rangeMax) === 0
        )
      ) {
        // 环比
        message.error('输入值应大于0');
      }
    } else if (type === 'pc') {
      const { operator, operatorUnit, pcBasis, rangeMin, rangeMax } = data.pc;
      // 转化率
      if (operator === mmsrList[0].value || operator === mmsrList[1].value ) {
        // ≥ <
        if (
          operatorUnit === 'multiple'
          && (
            Number(pcBasis) <= 0
            || Number(pcBasis) > 10
          )
        ) {
          // 店铺平均转化率的倍数
          message.error('倍数应在0.1 ~ 10区间');
        } else {
          // %
          if (pcBasis === undefined || pcBasis === '') {
            message.error('输入值应大于0');
          }
        }
      } else if (operator === mmsrList[3].value) {
        // 范围
        if (
          Number(rangeMin) <= 0 
          || Number(rangeMin) > 100 
          || rangeMin === undefined
          || Number(rangeMax) <= 0 
          || Number(rangeMax) > 100
          || rangeMax === undefined
        ) {
          message.error('范围应在0 ~ 100区间');
        }
      }
    } else if (type === 'si') {
      // 销量和库存的比值
      const { operator, basis, rangeMin, rangeMax } = data.si;

      if (operator === mmsList[2].value) {
        if (
          rangeMin === undefined
        || Number(rangeMin) === 0
        || rangeMax === undefined
        || Number(rangeMax) === 0
        ) {
          message.error('输入值应大于0');
        }
      } else {
        if (
          basis === undefined
          || Number(basis) === 0
        ) {
          message.error('输入值应大于0');
        }
      }
    } else if (type === 'price') {
      const { action, value } = data;
      // 调价操作
      // 此数值不能为0或为空
      if (
        action === upDownHLs[0].value
        || action === upDownHLs[1].value
      ) {
        if (
          value === undefined
          || Number(value) === 0
        ) {
          message.error('此数值不能为0或为空');
        }
      }
    }
  };

  return <Form 
    form={form} 
    name={`name${index}`} 
    onValuesChange={onValuesChange}
  >
    <div 
      data-index={index} 
      className={classnames(
        styles.conditionItem, 
        index > 0 ? styles.up : '',
        index + 1 === total ? '' : styles.down
      )}
    >
      <div className={styles.layoutOneRow}>
        <Item name="period" initialValue={salesDateRange[0].value} className={styles.rangeDate}>
          <Select >
            {salesDateRange.map((item, i) => {
              return <Option value={item.value} key={i}>{item.label}</Option>;
            })}
          </Select>
        </Item>
        <Item name="type" initialValue={salesConditionTypes[0].value} style={{
          width: 150,
        }}>
          <Select >
            {salesConditionTypes.map((item, i) => {
              return <Option value={item.value} key={i}>{item.label}</Option>;
            })}
          </Select>
        </Item>
        {/* 订单量/销量/Session 所有的条件组*/}
        <div className={classnames(
          styles.mmsrBox,
          ossps === salesConditionTypes[0].value 
          || ossps === salesConditionTypes[1].value
          || ossps === salesConditionTypes[2].value ? '' : 'none',
        )}>
          {/* ≥ < 范围 环比 */}
          <Item name={['oss', 'operator']} initialValue={mmsrList[0].value} className={styles.glrr}>
            <Select >
              {mmsrList.map((item, i) => {
                return <Option value={item.value} key={i}>{item.label}</Option>;
              })}
            </Select>
          </Item>
          {/* 订单量/销量/Session ≥ < 的输入框 */}
          <Item name={['oss', 'basis']} 
            normalize={limitedInput}
            className={classnames(
              styles.basisInput,
              oosmm === mmsrList[0].value
              || oosmm === mmsrList[1].value ? '' : 'none',
            )}>
            <Input onBlur={() => checkValues('oss')}/>
          </Item>
          {/* 环比的所有条件 */}
          <div className={classnames(
            styles.rateBox,
            oosmm === mmsrList[2].value ? '' : 'none',
          )}>
            <Item name={['oss', 'rateTrend']} initialValue={oosmmRates[0].value} className={styles.ossRateRange}>
              <Select >
                {oosmmRates.map((item, i) => {
                  return <Option value={item.value} key={i}>{item.label}</Option>;
                })}
              </Select>
            </Item>
            <div className={classnames(
              styles.rangeDownConditions,
              rangeData === oosmmRates[0].value
              || rangeData === oosmmRates[2].value ? '' : 'none',
            )}>
              <span className={styles.symbol}>≥</span>
              <Item name={['oss', 'rateUnit']} initialValue="percent" className={styles.percentValueBox}>
                <Select >
                  <Option value="percent">%</Option>;
                  <Option value="value">值</Option>;
                </Select>
              </Item>
              <Item name={['oss', 'rateBasis']} className={styles.basisInput} normalize={limitedInput}>
                <Input onBlur={() => checkValues('oss')} />
              </Item>
            </div>
          </div>
          {/* 范围 */}
          <div className={classnames(
            styles.rangeBox,
            oosmm === mmsrList[3].value ? '' : 'none',
          )}>
            <Item name={['oss', 'rangeMin']} normalize={limitedInput}>
              <Input onBlur={() => checkValues('oss')} />
            </Item>
            <span className={styles.line}>-</span>
            <Item name={['oss', 'rangeMax']} normalize={limitedInput}>
              <Input onBlur={() => checkValues('oss')} />
            </Item>
          </div>
        </div>
      
        {/* 转化率 所有条件组 */}
        <div className={classnames(
          styles.reteBox,
          ossps === salesConditionTypes[3].value ? '' : 'none',
        )}>
          <Item name={['pc', 'operator']} initialValue={mmsrList[0].value} className={styles.pcglrr}>
            <Select >
              {mmsrList.map((item, i) => {
                return <Option value={item.value} key={i}>{item.label}</Option>;
              })}
            </Select>
          </Item>

          {/* ≥ < */}
          <div className={classnames(
            styles.gteleBox,
            oosmm === mmsrList[0].value 
            || oosmm === mmsrList[1].value ? '' : 'none',
          )}>
            <Item initialValue="multiple" name={['pc', 'operatorUnit']} className={styles.beiPrecent}>
              <Select>
                <Option value="multiple">店铺平均转化率的倍数</Option>
                <Option value="percent">%</Option>
              </Select>
            </Item>
            <Item initialValue="0.5" 
              name={['pc', 'pcBasis']}
              normalize={limitedInput}
              className={classnames(
                styles.pcBasis,
                styles.basisInput,
              )}>
              <Input onBlur={() => checkValues('pc')}/>
            </Item>
          </div>

          {/* 环比  */}
          <div className={classnames(
            styles.ratioBox,
            oosmm === mmsrList[2].value ? '' : 'none',
          )}>
            <Item initialValue={upDownUnchange[0].value} name={['pc', 'rateTrend']} className={styles.pcudn}>
              <Select>
                { upDownUnchange.map((item, i) => (
                  <Option value={item.value} key={i}>{item.label}</Option>)
                )}
              </Select>
            </Item>

            {/* 上升 下降 */}
            <div className={classnames(
              styles.upDownBox,
              udno !== upDownUnchange[2].value ? '' : 'none'
            )}>
              <span className={styles.symbol}>≥</span>
              <Item name={['pc', 'upDownBasis']} className={styles.basisInput} normalize={limitedInput}>
                <Input suffix="%" onBlur={() => checkValues('pc')}/>
              </Item>
            </div>
          </div>
              
          {/* 范围 */}
          <div className={classnames(
            styles.rangeBox,
            oosmm === mmsrList[3].value ? '' : 'none',
          )}>
            <Item name={['pc', 'rangeMin']} className={styles.basisInput} normalize={limitedInput}>
              <Input suffix="%" onBlur={() => checkValues('pc')} /> 
            </Item>
            <span className={styles.line}>-</span>
            <Item name={['pc', 'rangeMax']} className={styles.basisInput} normalize={limitedInput}>
              <Input suffix="%" onBlur={() => checkValues('pc')} /> 
            </Item>
          </div>
        </div>
      
        {/* 销售和库存的比值 所有条件组 */}
        <div className={classnames(
          styles.salesIntentoryBox,
          ossps === salesConditionTypes[4].value ? '' : 'none',
        )}>
          <Item name={['si', 'operator']} initialValue={mmsList[0].value} className={styles.siglrr}>
            <Select >
              {mmsList.map((item, i) => {
                return <Option value={item.value} key={i}>{item.label}</Option>;
              })}
            </Select>
          </Item>
          <Item 
            name={['si', 'basis']} className={classnames(
              styles.basisInput,
              siglr === mmsList[0].value
              || siglr === mmsList[1].value ? '' : 'none',
            )}
            normalize={limitedInput}
          >
            <Input onBlur={() => checkValues('si')} />
          </Item>
          <div className={classnames(
            styles.rangeBox,
            siglr === mmsList[2].value ? '' : 'none',
          )}>
            <Item name={['si', 'rangeMin']} className={styles.basisInput} normalize={limitedInput}>
              <Input onBlur={() => checkValues('si')} /> 
            </Item>
            <span className={styles.line}>-</span>
            <Item name={['si', 'rangeMax']} className={styles.basisInput} normalize={limitedInput}>
              <Input onBlur={() => checkValues('si')} /> 
            </Item>
          </div>
        </div>
      </div>
      <div className={styles.layoutTwoRow}>
        <span>调价操作：</span>
        <div className={styles.content}>
          <Item name="action" initialValue={upDownHLs[0].value}>
            <Select style={{
              width: 118,
            }}>
              { upDownHLs.map((item, i) => (
                <Option value={item.value} key={i}>{item.label}</Option>
              ))}
            </Select>
          </Item>
          {/* 上调 下调 */}
          <div className={classnames(
            styles.upDownBox,
            udmm === upDownHLs[0].value
            || udmm === upDownHLs[1].value ? '' : 'none',
          )}>
            <Item name="unit" initialValue="percent">
              <Select className={styles.symbolList}>
                <Option value="value">{currentShop.currency}</Option>
                <Option value="percent">%</Option>
              </Select>
            </Item>
            <Item name="value" initialValue="0.5" normalize={limitedInput}>
              <Input onBlur={() => checkValues('price')}/>
            </Item>
          </div>
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
        <Iconfont className={styles.close} type="icon-close" onClick ={() => remove(index)}/>
      </div>
    </div>
  </Form>;
};

export default SalesConditionItem;
