/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-23 15:57:06
 * 
 * 根据黄金购物车调价
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import {
  ruleAddRouter,
  ruleListRouter,
} from '@/utils/routes';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import {
  useLocation,
  useDispatch,
  Link,
  useSelector,
} from 'umi';
import { 
  moveArrItem,
  transitionObj,
  cartsmmr,
  action,
} from '../config';

// component
import Snav from '@/components/Snav';
import SecuritySettings from '../components/SecuritySettings';
import HaveOpponent from './HaveOpponent';
import HoldCart from './HoldCart';
import NotHoldCart from './NotHoldCart';
import skip from '../components/Skip';
import {
  Form,
  Input,
  Select,
  Switch,
  Radio,
  Checkbox,
  Button,
  message,
  Spin,
} from 'antd';

interface ILocation extends Location {
  query: {
    type?: string;
    id?: string;
  };
}

const { Item } = Form;
const { Option } = Select;
let haveOpponentData = {}; // 保存1. 有竞争对手时的数组
let holdCartData = {}; // 保存2.当竞争对手占据黄金购物车的数组
let nothaveOpponentData = {}; // 保存3.没有任何卖家占据黄金购物车时的数组
import { ffs, ffas, cartPriceList, cartCurrentPrint, addSubtract } from '../config';
const AddSales: React.FC = () => {
  const [form] = Form.useForm();
  const location = useLocation() as any; // eslint-disable-line
  const dispatch = useDispatch();

  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  // 保存设定竞争对手的“排除” 与 “限定”
  const [opponent, setopponent] = useState({
    currentChecked: 'exclude', // radio初始化选中的值
    currentShipping: [''], // radio 初始化选中值的checkbox
    otherShipping: ['FBA', 'FBM', 'Amazon'], // radio未选中的checkbox
  });
  
  const [sellerId, setSellerId] = useState<string[]>([]);
  
  const [visibleopponent, setVisibleopponent] = useState<boolean>(false); // 对手是否展开
  const [safe, setSafe] = useState<Rules.ISafeDataType|{}>({});
  const [type, setType] = useState<boolean>(false); // 添加规则（false） 修改规则（true）
  const [loading, setLoading] = useState<boolean>(false); // 修改时的loading

  // 1. 有竞争对手时
  const haveopponetsState = {
    me: ffs[0].value,
    lowest: ffas[0].value,
    operator: cartPriceList[0].value,
    myPrice: cartCurrentPrint[0].value,
    action: cartsmmr[0].value,
    actionOperator: addSubtract[0].value,
    unit: 'value',
    value: '',
  };
  const [haveopponets, setHaveopponets] = useState<Rules.IHaveopponets[]>([
    {
      key: 0,
      Component: HaveOpponent,
      state: haveopponetsState,
    },
  ]);
  
  // 2.当竞争对手占据黄金购物车
  const holdCartState = {
    me: ffs[0].value,
    buybox: ffas[0].value,
    actionOperator: addSubtract[0].value,
    action: action[0].value,
    unit: 'value',
    value: '',
  };
  const [holdCarts, setHoldCarts] = useState<Rules.IHoldCarts[]>([
    {
      key: 0,
      Component: HoldCart,
      state: holdCartState,
    },
  ]);
  
  // 3.没有任何卖家占据黄金购物车时
  const notHoldCartState = {
    me: ffs[0].value,
    lowest: ffas[0].value,
    operator: cartPriceList[0].value,
    myPrice: cartCurrentPrint[0].value,
    action: cartsmmr[0].value,
    actionOperator: addSubtract[0].value,
    unit: 'value',
    value: '',
  };
  const [notHoldCart, setNotHoldCart] = useState<Rules.INotHaveopponets[]>([
    {
      key: 0,
      Component: NotHoldCart,
      state: notHoldCartState,
    },
  ]);

  
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
      label: '根据黄金购物车调价',
    },
  ];
  const initialValues = {
    name: '',
    description: '',
    self: {
      only: {
        action: 'unchange',
      },
    },
    competitor: {
      power: true,
      scope: 'exclude',
      shipping: opponent.currentShipping,
    },
    timing: '20',
  };
  const { query } = location as ILocation; // eslint-disable-line
  const { id: StoreId } = currentShop;
  let safeData: { [key: string]: any} = {}; // eslint-disable-line

  useEffect(() => {
    if (StoreId === '-1') {
      return;
    }

    // 查询修改
    if (query && query.type && query.type === 'settings') {
      setType(true);
      setLoading(true);
      new Promise((resolve, reject) => {
        dispatch({
          type: 'rules/getBuybox',
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
        setLoading(false);
        const { data } = datas as { data: Rules.IBuyboxDataType };
        form.setFieldsValue({ ...data });
        const haveopponets: Rules.IHaveopponets[] = [];
        data.self.unonly.forEach((item, i) => {
          haveopponets.push({
            key: Number(`${i}00`),
            Component: HaveOpponent,
            state: item,
          });
        });
        setHaveopponets([...haveopponets]);

        const holdCars: Rules.IHoldCarts[] = [];
        data.other.forEach((item, i) => {
          holdCars.push({
            key: Number(`${i}00`),
            Component: HoldCart,
            state: item,
          });
        });
        setHoldCarts([...holdCars]);

        const notHaveopponets: Rules.INotHaveopponets[] = [];
        data.nobody.forEach((item, i) => {
          notHaveopponets.push({
            key: Number(`${i}00`),
            Component: NotHoldCart,
            state: item,
          });
        });
        setNotHoldCart([...notHaveopponets]);

        // 竞争对手
        const scopre = data.competitor.scope;
        setopponent({
          currentChecked: scopre,
          currentShipping: data.competitor.shipping,
          otherShipping: scopre === 'exclude' ? ['FBA', 'FBM', 'Amazon'] : [''],
        });
        setSellerId([...data.competitor.sellerId]);
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

  // 竞争对手设定切换radio 排除、限定
  const changeOpponent = () => {
    const scope = form.getFieldValue('competitor').scope;
    const currentShipping = opponent.currentShipping;
    const otherShipping = opponent.otherShipping;

    form.setFieldsValue({
      competitor: {
        shipping: otherShipping,
      },
    });
    
    setopponent({
      currentChecked: scope,
      currentShipping: otherShipping,
      otherShipping: currentShipping,
    });
  };

  // 竞争对手设定点击多选框 FBA、FBM、Amazon
  const clickOpponentChecked = () => {
    const shipping = form.getFieldValue('competitor').shipping;
    const scope = form.getFieldValue('competitor').scope;
    setopponent({
      currentChecked: scope,
      currentShipping: shipping,
      otherShipping: opponent.otherShipping,
    });
  };

  // 添加条件 - 有竞争对手时
  const addHaveOpponentCondition = () => {
    if (haveopponets.length >= 10) {
      message.error('最多添加10个条件');
      return;
    }

    haveopponets.push({
      key: haveopponets.length,
      Component: HaveOpponent,
      state: haveopponetsState,
    });
    setHaveopponets([...haveopponets]);
  };

  // 添加条件 - 当竞争对手占据黄金购物车
  const addHoldCartCondition = () => {
    if (holdCarts.length >= 10) {
      message.error('最多添加10个条件');
      return;
    }

    holdCarts.push({
      key: holdCarts.length,
      Component: HoldCart,
      state: holdCartState,
    });

    setHoldCarts([...holdCarts]);
  };

  // 添加条件 - 没有任何卖家占据黄金购物车时
  const addNotHoldCartCondition = () => {
    if (notHoldCart.length >= 10) {
      message.error('最多添加10个条件');
      return;
    }

    notHoldCart.push({
      key: notHoldCart.length,
      Component: NotHoldCart,
      state: notHoldCartState,
    });
    setNotHoldCart([...notHoldCart]);
  };

  /**
   * 移动条件 - 有竞争对手时
   * @param index 索引
   * @param type 向上或向下
   * @param type1 条件组
   * haveOpponent 有竞急对手时 
   * holdCart 2.当竞争对手占据黄金购物车
   * notHoldCart 没有任何卖家占据黄金购物车时
   */
  const moveCondition = (index: number, type: string, type1: string) => {
    if (type1 === 'haveOpponent') {
      if ( type === 'up') {
        const arr = moveArrItem(haveopponets, index, index - 1);
        setHaveopponets([...arr]);
      } else if (type === 'down') {
        const arr = moveArrItem(haveopponets, index, index + 1);
        setHaveopponets([...arr]);
      }
    } else if (type1 === 'holdCart') {
      if ( type === 'up') {
        const arr = moveArrItem(holdCarts, index, index - 1);
        setHoldCarts([...arr]);
      } else if (type === 'down') {
        const arr = moveArrItem(holdCarts, index, index + 1);
        setHoldCarts([...arr]);
      }
    } else if (type1 === 'notHoldCart') {
      if ( type === 'up') {
        const arr = moveArrItem(notHoldCart, index, index - 1);
        setNotHoldCart([...arr]);
      } else if (type === 'down') {
        const arr = moveArrItem(notHoldCart, index, index + 1);
        setNotHoldCart([...arr]);
      }
    }
  };

  /**
   * @param index 索引
   * @param type 
   * haveOpponent 有竞急对手时 
   * holdCart 2.当竞争对手占据黄金购物车
   * notHoldCart 没有任何卖家占据黄金购物车时
   */
  const delCondition = (index: number, type: string) => {
    if (type === 'haveOpponent') {
      haveopponets.splice(index, 1);
      setHaveopponets([...haveopponets]);
    } else if (type === 'holdCart') {
      holdCarts.splice(index, 1);
      setHoldCarts([...holdCarts]);
    } else if (type === 'notHoldCart') {
      notHoldCart.splice(index, 1);
      setNotHoldCart([...notHoldCart]);
    }
  };

  // 添加卖家ID
  const clickAddShipping = () => {
    const sellerIdInput = form.getFieldValue('sellerIdInput');
    if (
      sellerIdInput 
      && sellerIdInput.length === 14 
      && sellerIdInput.slice(0, 1).toUpperCase() === 'A'
    ) {
      if (sellerId.indexOf(sellerIdInput) > -1) {
        message.error('卖家id已存在');
        return;
      }
      sellerId.push(sellerIdInput);
      setSellerId([...sellerId]);
      form.setFieldsValue({
        sellerIdInput: '',
      });
    } else {
      message.error('请输入正确的卖家id');
    }
  };

  // 删除卖家ID
  const delSellerId = (index: number) => {
    sellerId.splice(index, 1);
    setSellerId([...sellerId]);
  };

  // 获取 1. 有竞争对手时的数据
  const getDataHaveOpponent = (data: Rules.IHaveTypeData, index: number) => {
    // 修改值时保存
    for (let i = 0; i < haveopponets.length; i++ ) {
      const item = haveopponets[i];
      if ( index === item.key) {
        item.state = data;
      }
    }
    haveOpponentData = transitionObj(haveOpponentData, data, index + 1);
  };

  // 获取 2.当竞争对手占据黄金购物车
  const getDataHoldCart = (data: Rules.IHoldCartType, index: number) => {
    // 修改值时保存
    for (let i = 0; i < holdCarts.length; i++ ) {
      const item = holdCarts[i];
      if ( index === item.key) {
        item.state = data;
      }
    }
    holdCartData = transitionObj(holdCartData, data, index + 1);
  };

  // 获取 3.没有任何卖家占据黄金购物车时
  const getDatanotHaveOpponent = (data: Rules.INotHaveTypeData, index: number) => {
    // 修改值时保存
    for (let i = 0; i < notHoldCart.length; i++ ) {
      const item = notHoldCart[i];
      if ( index === item.key) {
        item.state = data;
      }
    }
    nothaveOpponentData = transitionObj(nothaveOpponentData, data, index + 1);
  };

  // 安全设定
  const getSafeData = (value: {}) => {
    safeData = value;
  };

  // 保存数据
  const clickSaveConditions = () => {
    const data = form.getFieldsValue();
    if (!data.name || data.name.trim() === '') {
      message.error('规则名称不能为空');
      return;
    }

    data.description = data.description ? data.description : '';

    data.self.unonly = [];
    haveopponets.forEach(item => {
      data.self.unonly.push(item.state);
    });

    // data.self.unonly = transitionArr(haveOpponentData);
    for (let i = 0; i < data.self.unonly.length; i++) {
      if (data.self.unonly[i].action === cartsmmr[3].value) {
        if (!data.self.unonly[i].value) {
          message.error('条件和操作的输入值不能为空');
          return;
        }
      }
    }

    // data.other = transitionArr(holdCartData);
    data.other = [];
    holdCarts.forEach(item => {
      data.other.push(item.state);
    });
    
    for (let i = 0; i < data.other.length; i++) {
      if (!data.other[i].value) {
        message.error('条件和操作的输入值不能为空');
        return;
      }
    }

    // data.nobody = transitionArr(nothaveOpponentData);
    data.nobody = [];
    notHoldCart.forEach(item => {
      data.nobody.push(item.state);
    });
    for (let i = 0; i < data.nobody.length; i++) {
      if (data.nobody[i].action === cartsmmr[3].value) {
        if (!data.nobody[i].value) {
          message.error('条件和操作的输入值不能为空');
          return;
        }
      }
    }
    data.competitor.sellerId = sellerId;

    // 由于 "二手" 用了Checkbox.Group, 修改数据格式
    if (data.competitor.productType && data.competitor.productType.length > 0) {
      data.competitor.productType = 'used';
    } else {
      delete data.competitor.productType;
    }

    if (
      safeData.stockLeValue === undefined
      || safeData.stockLeValue === null
    ) {
      safeData.stockLeValue = '';
    }

    data.safe = safeData;

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
        type: 'rules/addtOrSetBuybox',
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

  return <div className={styles.cartBox}>
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
            initialValues={initialValues}
          >
            <Item 
              label="规则名称"
              className={styles.ruleNameColumn}
              name="name"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入规则名称" className={styles.ruleName} onBlur={onMouseoutRuleName}/>
            </Item>
            <Item label="规则说明" name="description">
              <Input.TextArea className={styles.textarea}></Input.TextArea>
            </Item>
          </Form>
          {/* 黄金购物车设定 */}
          <div className={styles.cartSettings}>
            <span className={styles.titleName}>
              黄金购物车设定：
            </span>
            <div className={styles.cartContent}>
              <header className={styles.header}>1.当我占据黄金购物车</header>
              <p className={styles.notOpponent}>无竞争对手时：</p>
              <div className={styles.handlePrice}>
                <span className={styles.textName}>调价操作：</span>
                <Form 
                  colon={true} 
                  form={form} 
                  labelAlign="left"
                  initialValues={initialValues}
                >
                  <Item className={styles.downlist} name={['self', 'only', 'action']}>
                    <Select>
                      <Option value="unchange">保持价格不变</Option>
                      <Option value="max">最高价</Option>
                      <Option value="min">最低价</Option>
                    </Select>
                  </Item>
                </Form>
              </div>

              <div className={styles.conditionsHead}>
                <span className={styles.other}>有竞争对手时：</span>
                <div className={styles.add} onClick={addHaveOpponentCondition}>
                  <Iconfont type="icon-zengjiatianjiajiahao" className={styles.icon} />
                  <span>添加条件</span>
                </div>
              </div>
              <div>
                {haveopponets.map((Item, i) => {
                  return <Item.Component 
                    key={Item.key} 
                    index={i} 
                    total={haveopponets.length}
                    delCondition={delCondition}
                    move={moveCondition}
                    getDataCallback={getDataHaveOpponent}
                    initValues={Item.state}
                  />;
                })}
              </div>
              <header className={styles.conditionsHead}>
                <span className={styles.title}>2.当竞争对手占据黄金购物车</span>
                <div className={styles.add} onClick={addHoldCartCondition}>
                  <Iconfont type="icon-zengjiatianjiajiahao" className={styles.icon} />
                  <span>添加条件</span>
                </div>
              </header>
              <div>
                {holdCarts.map((Item, i) => {
                  return <Item.Component 
                    key={i} 
                    index={Item.key} 
                    total={holdCarts.length}
                    delCondition={delCondition}
                    move={moveCondition}
                    getDataCallback={getDataHoldCart}
                    initValues={Item.state}
                  />;
                })}
              </div>

              <header className={styles.conditionsHead}>
                <span className={styles.title}>3.没有任何卖家占据黄金购物车时</span> 
                <div className={styles.add} onClick={addNotHoldCartCondition}>
                  <Iconfont type="icon-zengjiatianjiajiahao" className={styles.icon} />
                  <span>添加条件</span>
                </div>
              </header>
              <div>
                {notHoldCart.map((Item, i) => {
                  return <Item.Component 
                    key={Item.key} 
                    index={i} 
                    total={notHoldCart.length}
                    delCondition={delCondition}
                    move={moveCondition}
                    getDataCallback={getDatanotHaveOpponent}
                    initValues={Item.state}
                  />;
                })}
              </div>
            </div>
          </div>
        
          {/* 竞争对手设定： */}
          <div className={styles.opponent}>
            <span className={styles.titleName}>
              竞争对手设定：
            </span>
            <div className={styles.opponentBox}>
              <div 
                className={classnames(styles.showText, visibleopponent ? styles.active : '')} 
                onClick={() => setVisibleopponent(!visibleopponent)}
              >
                {visibleopponent ? '收起' : '展开'}
                <Iconfont type="icon-zhankai" className={classnames(
                  styles.iconArrow,
                  visibleopponent ? styles.active : '',
                )}></Iconfont>
              </div>
              <div style={{
                display: visibleopponent ? 'block' : 'none',
              }} className={styles.centent}>
                <Form 
                  colon={true} 
                  form={form} 
                  labelAlign="left"
                  initialValues={initialValues}
                >
                  <header>
                    <Item name={['competitor', 'power']} valuePropName="checked">
                      <Switch className={classnames(
                        'h-switch',
                        styles.switch
                      )} defaultChecked />
                    </Item>
                    <span>排除或限定竞争卖家</span>
                    <Item name={['competitor', 'scope']} >
                      <Radio.Group 
                        className={styles.radio}
                        onChange={changeOpponent}
                      >
                        <Radio value="exclude">排除</Radio>
                        <Radio value="include">限定</Radio>
                      </Radio.Group>
                    </Item>
                  </header>
                  <div>
                    <div className={styles.checkboxs}>
                      <Item name={['competitor', 'shipping']}>
                        <Checkbox.Group
                          options={['FBA', 'FBM', 'Amazon']}
                          onChange={clickOpponentChecked}
                          className={styles.checkbox}
                        />
                      </Item>
                      <Item name={['competitor', 'productType']}>
                        <Checkbox.Group
                          options={[{ label: '二手', value: 'used' }]}
                          className={classnames(styles.checkbox, styles.checkboxTwo)}
                        />
                      </Item>
                    </div>
                    <div className={styles.input}>
                      <Item name="sellerIdInput">
                        <Input placeholder="请输入卖家ID"/>
                      </Item>
                      <Button type="primary" onClick={clickAddShipping}>添加</Button>
                    </div>
                    <div className={classnames(
                      styles.sellerList,
                      sellerId.length ? '' : 'none',
                      'h-scroll'
                    )}>
                      {
                        sellerId.map((item, i) => {
                          return <div key={i} className={styles.sellerItem}>
                            <span>{item}</span>
                            <Iconfont 
                              className={styles.iconClose} 
                              type="icon-guanbi1"
                              onClick={() => delSellerId(i)}
                            >
                            </Iconfont>
                          </div>;
                        })
                      }
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        

          {/* 安全设定 */}
          <div className={styles.securitySettings}>
            <span className={styles.titleName}>安全设定: </span>
            <SecuritySettings getDataFn={getSafeData} initValues={safe as Rules.ISafeDataType} />
          </div>
          
          {/* 调价频率 */}
          <div className={styles.frequency}>
            <span className={styles.titleName}>调价频率: </span>
            <Form 
              colon={true} 
              form={form} 
              labelAlign="left"
              initialValues={initialValues}
            >
              <Item className={styles.downlists} name="timing">
                <Select dropdownClassName={styles.frequencySelect}>
                  {/* <Option value="10">每10分钟</Option> */}
                  <Option value="20">每20分钟</Option>
                  {/* <Option value="30">每30分钟</Option> */}
                  <Option value="60">每60分钟</Option>
                </Select>
              </Item>
            </Form>
          </div>
        </div>
        <div className={styles.btns}>
          <Button className={type ? 'none' : ''}>
            <Link to={{
              pathname: ruleAddRouter,
              state: 'cart',
            }}>上一步</Link>
          </Button>
          <Button>
            <Link to={ruleListRouter}>取消</Link>
          </Button>
          <Button htmlType="submit" type="primary" onClick={clickSaveConditions}>
            保存
          </Button>
        </div>
      </div>
    </Spin>
  </div>;
};

export default AddSales;


