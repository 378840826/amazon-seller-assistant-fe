import React from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { 
  Checkbox, 
  Row,
  Col, 
  Dropdown,
  Button,
} from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { IConnectState, IConnectProps } from '@/models/connect';

const allList = [
  { name: 'monitoringSwitch', value: '监控开关' },
  { name: 'updateTime', value: '更新时间' },
  { name: 'currentRanking', value: '当前排位' },
  { name: 'lastRanking', value: '上期排位' },
  { name: 'monitoringNumber', value: '监控次数' },
  { name: 'productInfo', value: '商品信息' },
  { name: 'brandName', value: '品牌' },
  { name: 'sellerName', value: '卖家' },
  { name: 'price', value: '价格' },
  { name: 'ranking', value: '排名' },
  { name: 'reviewAvgStar', value: '评分' },
  { name: 'reviewCount', value: 'Review' },
  { name: 'usedNewSellNum', value: '卖家数' },
  { name: 'variantNum', value: '变体数' },
  { name: 'dateFirstListed', value: '上架时间' },
  { name: 'acKeyword', value: "Amazon's Choice关键词" },
  { name: 'relatedKeywords', value: '相关关键词' },
];
interface ICustomList extends IConnectProps{
  StoreId: string;
  customOpen: boolean;
  toggleEvent: (param: string) => void;
  defaultValues: CheckboxValueType[];
}

const CustomList: React.FC<ICustomList> = ({ 
  customOpen,
  toggleEvent, 
  defaultValues,
  dispatch }) => {
  const onCheckChange = (values: CheckboxValueType[]) => {
    dispatch({
      type: 'comPro/customSelectedUpdate',
      payload: values,
    });
  };

  const dropList = (
    <div className={styles.menu} onClick={e => e.stopPropagation()}>
      <Checkbox.Group style={{ width: '100%' }} onChange={onCheckChange} defaultValue={defaultValues} >
        {allList.map((item, index) => {
          return (
            <Row key={index} style={{ paddingTop: '4px', paddingBottom: '4px' }}>
              <Col span={24}>
                <Checkbox value={item.name}>{item.value}</Checkbox>
              </Col>
            </Row>
          );
        })}
      </Checkbox.Group>
    </div>
  );
  return (
    <Dropdown 
      overlay={dropList}
      placement="bottomRight"
      trigger={['click']}
      visible={customOpen}
      onVisibleChange={() => toggleEvent('customOpen')}
    >
      <Button>
                    自定义列
        {customOpen ? <UpOutlined style={{ fontSize: '12px' }}/> : <DownOutlined style={{ fontSize: '12px' }} />}
      </Button>
    </Dropdown>
  );
  
};
export default connect(({ global, comPro }: IConnectState) => ({
  StoreId: global.shop.current.id,
  defaultValues: comPro.customSelected,
}))(CustomList);
