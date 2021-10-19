import React, { useEffect, useState } from 'react';
import { useDispatch } from 'umi';
import { Checkbox, Row, Col, Dropdown, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { storage } from '@/utils/utils';
import styles from './index.less';

interface IProps {
  colsItems: {
    [key: string]: boolean;
  };
}

interface IItem {
  value: string;
  name: string;
}

type callback = ((e: CheckboxChangeEvent) => void) | undefined
const myCheckbox = (value: string, name: string, callback: callback) => {
  return (
    <Row key={value} gutter={[0, 8]}>
      <Col>
        <Checkbox onChange={callback} value={value}>{name}</Checkbox>
      </Col>
    </Row>
  );
};

const CustomCols: React.FC<IProps> = props => {
  const [visible, setVisible] = useState<boolean>(false);
  const { colsItems } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    storage.set('goodsListCustomCols', colsItems);
  }, [colsItems]);

  const handleChange = ({ target: { value, checked } }: CheckboxChangeEvent) => {
    const col = {};
    col[value] = checked;
    dispatch({
      type: 'goodsList/updateCustomCols',
      payload: col,
    });
  };

  const renderCheckboxGroup = (title: string, list: IItem[]) => (
    <>
      <Row>
        <span className={styles.customColumnTitle}>{title}</span>
      </Row>
      {
        list.map(item => (
          myCheckbox(item.value, item.name, handleChange)
        ))
      }
    </>
  );
  

  const customColsValue: string[] = [];
  Object.keys(colsItems).forEach((key: string) => {
    colsItems[key] ? customColsValue.push(key) : null;
  });

  const customMenu = (
    <div className={styles.customColumnContainer}>
      <Checkbox.Group style={{ width: '100%' }} defaultValue={customColsValue}>
        <Row className={styles.Row1}>
          <Col span={9}>
            {
              renderCheckboxGroup('商品信息', [
                { value: 'group', name: '分组' },
                { value: 'title', name: '标题' },
                { value: 'asin', name: 'ASIN' },
                { value: 'tag', name: '商品标签' },
                { value: 'usedNewSellNum', name: '卖家数' },
                { value: 'isBuyBox', name: '黄金购物车' },
                { value: 'parentasin', name: '父ASIN' },
                { value: 'sku', name: 'SKU' },
                { value: 'openDate', name: 'SKU创建时间' },
              ])
            }
          </Col>
          <Col span={9}>
            {
              renderCheckboxGroup('库存信息', [
                { value: 'fulfillmentChannel', name: '发货方式' },
                { value: 'listingStatus', name: 'SKU状态' },
                { value: 'sellable', name: '库存' },
                { value: 'sellableDays', name: '预计可售天数' },
                { value: 'inbound', name: 'inbound' },
              ])
            }
          </Col>
          <Col span={6}>
            {
              renderCheckboxGroup('价格信息', [
                { value: 'price', name: '售价' },
                { value: 'postage', name: '配送费' },
                { value: 'commission', name: '佣金' },
                { value: 'fbaFee', name: 'FBA fee' },
                { value: 'cost', name: '成本' },
                { value: 'freight', name: '头程' },
                { value: 'profit', name: '利润' },
                { value: 'profitMargin', name: '利润率' },
              ])
            }
          </Col>
        </Row>
        <Row className={styles.Row2}>
          <Col span={9}>
            {
              renderCheckboxGroup('销售表现', [
                { value: 'dayOrder7Count', name: '7天订单' },
                { value: 'dayOrder7Ratio', name: '7天环比' },
                { value: 'dayOrder30Count', name: '30天订单' },
                { value: 'dayOrder30Ratio', name: '30天环比' },
                { value: 'ranking', name: '排名' },
                { value: 'reviewScore', name: '评分' },
                { value: 'reviewCount', name: 'Review' },
              ])
            }
          </Col>
          <Col span={9}>
            {
              renderCheckboxGroup('调价设置', [
                { value: 'minPrice', name: '最低价' },
                { value: 'maxPrice', name: '最高价' },
                { value: 'competingCount', name: '竞品' },
                { value: 'ruleName', name: '调价规则' },
                { value: 'adjustSwitch', name: '调价开关' },
              ])
            }
          </Col>
        </Row>
      </Checkbox.Group>
    </div>
  );
  return (
    <Dropdown
      overlay={customMenu}
      trigger={['click']}
      visible={visible}
      onVisibleChange={(flag) => setVisible(flag)}
    >
      <Button>
        自定义数据 { visible ? <UpOutlined className="anticon-down" /> : <DownOutlined /> }
      </Button>
    </Dropdown>
  );
};

export default CustomCols;
