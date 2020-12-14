import React, { useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Checkbox, Row, Col, Dropdown, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { IConnectState } from '@/models/connect';
import styles from './index.less';

interface IItem {
  value: string;
  name: string;
}

const CustomCols: React.FC = () => {
  const page = useSelector((state: IConnectState) => state.biBoard);
  const { customCols, queue } = page;
  const [visible, setVisible] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleChange = ({ target: { value, checked } }: CheckboxChangeEvent) => {
    const col = {};
    col[value] = checked;
    dispatch({
      type: 'biBoard/updateCustomCols',
      payload: col,
    });
  };

  const renderCheckboxList = (list: IItem[]) => {
    return list.map(item => {
      const { value, name } = item;
      return (
        <Row key={value} gutter={[0, 12]}>
          <Col>
            <Checkbox
              onChange={handleChange}
              value={value}
              checked={customCols[value]}
            >
              {name}
            </Checkbox>
          </Col>
        </Row>
      );
    });
  };

  const allCheckbox = [
    { value: 'fisKanban', name: '现有库存预计可售' },
    { value: 'ajKanban', name: '智能调价' },
    { value: 'followKanban', name: '跟卖监控' },
    { value: 'buyboxPercentageKanban', name: '购物车占比' },
    { value: 'mailKanban', name: '邮件' },
    { value: 'reviewKanban', name: 'Review' },
    { value: 'feedbackKanban', name: 'Feedback' },
    { value: 'acKeywordKanban', name: 'Amazon\'s Choice 关键词' },
    // { value: 'adKeywordKanban', name: '广告关键词表现' },
    // { value: 'adIneligibleKanban', name: '广告Ineligible原因' },
  ];

  // 根据 queue 顺序重新排序
  const sorted = queue.map(key => {
    return allCheckbox.find(checkbox => checkbox.value === key) as IItem;
  });

  const customMenu = (
    <div className={styles.customColumnContainer}>
      { renderCheckboxList(sorted) }
    </div>
  );

  return (
    <Dropdown
      overlay={customMenu}
      trigger={['click']}
      visible={visible}
      onVisibleChange={(flag) => setVisible(flag)}
    >
      <Button type="primary">
        看板设置 { visible ? <UpOutlined className="anticon-down" /> : <DownOutlined /> }
      </Button>
    </Dropdown>
  );
};

export default React.memo(CustomCols);
