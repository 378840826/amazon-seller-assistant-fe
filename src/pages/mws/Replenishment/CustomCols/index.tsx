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

const CustomCols: React.FC<IProps> = props => {
  const [visible, setVisible] = useState<boolean>(false);
  const { colsItems } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    storage.set('replenishmentCustomCols', colsItems);
  }, [colsItems]);

  const handleChange = ({ target: { value, checked } }: CheckboxChangeEvent) => {
    const col = {};
    col[value] = checked;
    dispatch({
      type: 'replenishment/updateCustomCols',
      payload: col,
    });
  };

  const renderCheckboxList = (list: IItem[]) => (
    list.map(item => {
      const { value, name } = item;
      return (
        <Row key={value} gutter={[0, 8]}>
          <Col>
            <Checkbox onChange={handleChange} value={value}>{name}</Checkbox>
          </Col>
        </Row>
      );
    })
  );

  const getCustomColsValue = () => {
    const customColsValue: string[] = [];
    Object.keys(colsItems).forEach((key: string) => {
      colsItems[key] ? customColsValue.push(key) : null;
    });
    return customColsValue;
  };

  const customMenu = (
    <div className={styles.customColumnContainer}>
      <Checkbox.Group defaultValue={getCustomColsValue()}>
        {
          renderCheckboxList([
            { value: 'skuStatus', name: '状态' },
            { value: 'openDate', name: '上架时间' },
            { value: 'review', name: 'Review' },
            { value: 'totalInventory', name: '总库存' },
            { value: 'existingInventory', name: '现有库存' },
            { value: 'inTransitInventory', name: '在途库存' },
            { value: 'orderCount', name: '订单量' },
            { value: 'salesCount', name: '销量' },
            { value: 'stockingCycle', name: '备货周期' },
            { value: 'firstPass', name: '头程天数' },
            { value: 'totalInventoryAvailableDays', name: '总库存可售天数' },
            { value: 'availableDaysOfExistingInventory', name: '现有库存可售天数' },
            { value: 'estimatedOutOfStockTime', name: '现有库存预计售罄' },
            { value: 'recommendedReplenishmentVolume', name: '建议补货量' },
            { value: 'shippingMethodsList', name: '物流方式' },
            { value: 'labels', name: '标签' },
          ])
        }
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
        自定义列 { visible ? <UpOutlined className="anticon-down" /> : <DownOutlined /> }
      </Button>
    </Dropdown>
  );
};

export default React.memo(CustomCols);
