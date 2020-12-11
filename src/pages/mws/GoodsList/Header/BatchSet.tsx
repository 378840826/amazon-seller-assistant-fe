import React, { useState } from 'react';
import { Input, Button, Form, Select, Dropdown, Menu, message, Modal } from 'antd';
import { MenuClickEventHandler } from 'rc-menu/lib/interface.d';
import { useDispatch, history } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import { requestFeedback, requestErrorFeedback, strToMoneyStr } from '@/utils/utils';
import { judgeFastPrice, judgeRuleOpen } from '../utils';
import { addBatchMonitor } from '@/services/goodsList';
import styles from './index.less';

const { Item: FormItem } = Form;
const { Option } = Select;
const { Item: MenuItem } = Menu;

export interface ISelectOption {
  value: string;
  name: string;
}

interface IProps {
  groupsOptions: ISelectOption[];
  rulesOptions: ISelectOption[];
  currentShop: API.IShop;
  checkedGoodsIds: string[];
  checkedGoodsAsins: (string | undefined)[];
  goodsListRecords: API.IGoods[];
}

const BatchSet: React.FC<IProps> = props => {
  const dispatch = useDispatch();
  // 显示哪个确定按钮
  const [batchSetFocus, setBatchSetFocus] = useState<string>('');
  // 批量设置价格时的 type， 是否需要展示 unit 选择
  const [batchPriceExpr, setBatchPriceExpr] = useState<boolean>(true);
  // 各个弹窗
  const [visible, setVisible] = useState({
    batchSet: false,
    batchSetPriceAlert: false,
    fastSetPriceAlert: false,
  });

  const {
    groupsOptions,
    rulesOptions,
    currentShop,
    checkedGoodsIds,
    checkedGoodsAsins,
    goodsListRecords,
  } = props;

  const headersParams = { StoreId: currentShop.id };

  const { currency } = currentShop;

  // 二次确认 批量设置价格
  const handleBatchPriceFinish = (values: { [key: string]: string | number }) => {
    setVisible({ ...visible, batchSetPriceAlert: false });
    if (!values.changeValue && !values.price) {
      message.error('请输入正确的值');
      return;
    }
    if (values.price) {
      values.price = Number(values.price).toFixed(2);
    }
    setBatchSetFocus('');
    const type = values.operator === '=' ? 1 : 2;
    dispatch({
      type: 'goodsList/updatePrice',
      payload: {
        headersParams,
        type,
        ids: checkedGoodsIds,
        ...values,
      },
      callback: requestFeedback,
    });
  };

  // 关闭二次确认 批量修改售价的
  const handleCloseAlert = () => {
    setVisible({ ...visible, batchSetPriceAlert: false, fastSetPriceAlert: false });
  };

  // 批量设置（调价规则，分组，最高价，最低价）
  const handleBatchFinish = (values: { [key: string]: string | number }, key: string) => {
    if (key === 'minPrice') {
      if (Number(values.minPrice) === 0) {
        message.error('最低价不能为0');
        return;
      }
    }
    if (key === 'maxPrice') {
      if (Number(values.maxPrice) === 0) {
        message.error('最高价不能为0');
        return;
      }
    }
    dispatch({
      type: 'goodsList/updateBatchGoods',
      payload: {
        headersParams,
        key,
        ids: checkedGoodsIds,
        ...values,
      },
      callback: requestFeedback,
    });
  };

  // 批量快捷设置（快捷设置最高价，最低价，售价，暂停调价，开启调价）
  const handleBatchFast = (key: string, adjust?: boolean) => {
    // 获取勾选的商品 checkedGoods
    const checkedGoods: API.IGoods[] = [];
    goodsListRecords.forEach(goods => {
      checkedGoodsIds.includes(goods.id) && checkedGoods.push(goods);
    });
    // 调价开关
    if (key === 'adjustSwitch') {
      // 开启调价操作时，判断有没有设置最高价和最低价
      const judge = adjust ? judgeRuleOpen(checkedGoods) : true;
      judge && dispatch({
        type: 'goodsList/switchAdjustSwitch',
        payload: {
          ids: checkedGoodsIds,
          adjustSwitch: adjust,
          headersParams,
        },
        callback: requestFeedback,
      });
    } else {
      // 如果是价格，先判断是否符合大小价格的逻辑,佣金和 fee 是否为空
      const judge = judgeFastPrice(key, checkedGoods);
      judge && dispatch({
        type: 'goodsList/fastUpdate',
        payload: {
          headersParams,
          key,
          ids: checkedGoodsIds,
        },
        callback: requestFeedback,
      });
    }
    setVisible({ ...visible, batchSetPriceAlert: false, fastSetPriceAlert: false });
  };

  // 批量设置的输入框输入
  const handleBatchInput = (key: string, event: { target: { value: string } }) => {
    const { target: { value } } = event;
    if (value !== '') {
      setBatchSetFocus(key);
    } else {
      setBatchSetFocus('');
    }
  };

  // 批量添加到监控
  const handleMonitorClick: MenuClickEventHandler = param => {
    const type = param.key;
    const urlDict = {
      follow: '/competitor/monitor',
      asin: '/dynamic/asin-monitor',
      review: '/review/monitor',
    };
    addBatchMonitor({
      headersParams,
      type: param.key,
      asins: checkedGoodsAsins,
    }).then(res => {
      if (res.code === 200) {
        Modal.confirm({
          icon: null,
          width: 300,
          centered: true,
          mask: false,
          maskClosable: false,
          cancelText: '前往监控列表',
          title: '添加成功!',
          onCancel() {
            history.push(urlDict[type]);
          },
        });
      }
      requestErrorFeedback(res.code, res.message);
    }).catch(err => {
      console.log('批量添加监控错误', err);
      message.error('网络有点问题，请稍候再试！');
    });
  };

  // 批量设置各项目的确定按钮
  const renderOkBtn = (key: string) => {
    const htmlType = key !== 'price' ? 'submit' : undefined;
    let btn = null;
    if (batchSetFocus === key) {
      if (key === 'price') {
        btn = (
          <Button
            type="primary"
            onClick={() => setVisible({ ...visible, batchSetPriceAlert: true })}
          >确定</Button>
        );
      } else {
        btn = <Button type="primary" htmlType={htmlType}>确定</Button>;
      }
    }
    return btn;
  };

  // 批量添加监控下拉菜单
  const batchMonitorDropdownMenu = (
    <Menu onClick={handleMonitorClick}>
      <MenuItem key="follow">跟卖监控</MenuItem>
      <MenuItem key="asin">ASIN动态监控</MenuItem>
      <MenuItem key="review">Review监控</MenuItem>
    </Menu>
  );

  return (
    <div className={styles.batchSetDropdown}>
      <div>
        <Form
          layout="inline"
          onFinish={handleBatchPriceFinish}
          initialValues={{
            operator: '+',
            unit: 'currency',
          }}
        >
          <span className={styles.batchSetTitle}>售价：</span>
          <div className={styles.batchPriceExpr}>
            <FormItem name="operator">
              <Select
                style={{ width: 136 }}
                onChange={value => setBatchPriceExpr(value !== '=')}
              >
                <Option value="+">上调</Option>
                <Option value="-">下调</Option>
                <Option value="=">调至特定金额</Option>
              </Select>
            </FormItem>
            {
              batchPriceExpr
                ?
                <FormItem name="unit">
                  <Select
                    style={{ width: 80 }}
                    onChange={value => setBatchPriceExpr(value !== '=')}
                    // value={currency}
                  >
                    <Option value="currency">{currency}</Option>
                    <Option value="percent">%</Option>
                  </Select>
                </FormItem>
                :
                null
            }
            <FormItem
              name={batchPriceExpr ? 'changeValue' : 'price'}
              style={{ flex: 1 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              getValueFromEvent={(e: any) => strToMoneyStr(e.target.value)}
            >
              <Input style={{ maxWidth: 136 }} onChange={e => handleBatchInput('price', e)} />
            </FormItem>
          </div>
          <FormItem>{renderOkBtn('price')}</FormItem>
          {
            // 二次确认弹窗
            visible.batchSetPriceAlert
              ?
              <div>
                <div onClick={handleCloseAlert} className={styles.batchPriceAlertMask}></div>
                <div className={styles.batchPriceAlert}>
                  确定要批量修改商品售价？
                  <Button onClick={handleCloseAlert}>取消</Button>
                  <Button htmlType="submit" type="primary">确定</Button>
                </div>
              </div>
              :
              null
          }
        </Form>
        <Form
          layout="inline"
          initialValues={{ ruleId: '' }}
          onFinish={(values) => handleBatchFinish(values, 'ruleId')}
        >
          <span className={styles.batchSetTitle}>调价规则：</span>
          <FormItem name="ruleId">
            <Select style={{ width: 270 }} onChange={() => setBatchSetFocus('ruleId')}>
              <Option value="">请选择</Option>
              {
                rulesOptions.map(item => (
                  <Option key={item.value} value={item.value}>{item.name}</Option>
                ))
              }
            </Select>
          </FormItem>
          <FormItem>{renderOkBtn('ruleId')}</FormItem>
        </Form>
        <Form
          layout="inline"
          initialValues={{ groupId: '' }}
          onFinish={(values) => handleBatchFinish(values, 'groupId')}
        >
          <span className={styles.batchSetTitle}>分组：</span>
          <FormItem name="groupId">
            <Select style={{ width: 270 }} onChange={() => setBatchSetFocus('groupId')}>
              <Option value="">请选择</Option>
              {
                groupsOptions.map(item => (
                  <Option key={item.value} value={item.value}>{item.name}</Option>
                ))
              }
            </Select>
          </FormItem>
          <FormItem>{renderOkBtn('groupId')}</FormItem>
        </Form>
        <Form
          layout="inline"
          onFinish={(values) => handleBatchFinish(values, 'maxPrice')}
        >
          <span className={styles.batchSetTitle}>最高价：</span>
          <FormItem
            name="maxPrice"
            style={{ flex: 1 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getValueFromEvent={(e: any) => strToMoneyStr(e.target.value)}
          >
            <Input style={{ width: 270 }} onChange={e => handleBatchInput('maxPrice', e)} />
          </FormItem>
          <FormItem>{renderOkBtn('maxPrice')}</FormItem>
        </Form>
        <Form
          layout="inline"
          onFinish={(values) => handleBatchFinish(values, 'minPrice')}
        >
          <span className={styles.batchSetTitle}>最低价：</span>
          <FormItem
            name="minPrice"
            style={{ flex: 1 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getValueFromEvent={(e: any) => strToMoneyStr(e.target.value)}
          >
            <Input style={{ width: 270 }} onChange={e => handleBatchInput('minPrice', e)} />
          </FormItem>
          <FormItem>{renderOkBtn('minPrice')}</FormItem>
        </Form>
      </div>
      <div className={styles.batchSetDropdownFast}>
        <span>快捷设置：</span>
        <div>
          <Button onClick={() => handleBatchFast('maxPrice')}>最高价=售价</Button>
          <Button
            onClick={() => setVisible({ ...visible, fastSetPriceAlert: true })}
          >售价=佣金+FBA Fee</Button>
          <Button onClick={() => handleBatchFast('minPrice')}>最低价=佣金+FBA Fee</Button>
          <Button onClick={() => handleBatchFast('adjustSwitch', false)}>暂停调价</Button>
          <Button onClick={() => handleBatchFast('adjustSwitch', true)}>启用调价</Button>
          <Dropdown placement="topCenter" overlay={batchMonitorDropdownMenu}>
            <Button>添加监控 <DownOutlined /></Button>
          </Dropdown>
        </div>
        {
          // 二次确认弹窗
          visible.fastSetPriceAlert
            ?
            <div>
              <div onClick={handleCloseAlert} className={styles.batchPriceAlertMask}></div>
              <div className={styles.batchFastPriceAlert}>
                确定要批量将商品的售价设为=佣金+FBA？
                <Button onClick={handleCloseAlert}>取消</Button>
                <Button type="primary" onClick={() => handleBatchFast('price')}>确定</Button>
              </div>
            </div>
            :
            null
        }
      </div>
    </div>
  );
};

export default BatchSet;
