/**
 * 自定义豆腐块数据
 */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'umi';
import { Checkbox, Dropdown, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { storage } from '@/utils/utils';
import styles from './index.less';
import { AssignmentKeyName } from '../utils';

interface IProps {
  blockItems: {
    [key: string]: boolean;
  };
}

// // 分组
// const groups = {
//   'SKU': [
//     { value: 'skuTotal', name: 'SKU总数' },
//     { value: 'activeSku', name: 'Active-SKU' },
//     { value: 'inactiveSku', name: 'Inactive-SKU' },
//     { value: 'fbaActiveSku', name: 'FBA-active-SKU' },
//     { value: 'fbaInactiveSku', name: 'FBA-Inactive-SKU' },
//     { value: 'fbmActiveSku', name: 'FBM-active-SKU' },
//     { value: 'fbmInactiveSku', name: 'FBM-Inactive-SKU' },
//   ],
//   'ASIN': [
//     { value: 'asinTotal', name: 'ASIN总数' },
//     { value: 'buyboxAsin', name: 'Buybox-ASIN' },
//     { value: 'notBuyboxAsin', name: '非Buybox-ASIN' },
//     { value: '动销率', name: '动销率' },
//     { value: '在售', name: '在售' },
//     { value: '上新', name: '上新' },
//   ],
//   '总体销售表现': [
//     { value: 'totalSales', name: '总销售额' },
//     { value: 'totalOrderQuantity', name: '总订单量' },
//     { value: 'totalSalesQuantity', name: '总销量' },
//     { value: 'salesQuantityExceptOrderQuantity', name: '销量/订单量' },
//     { value: 'avgSellingPrice', name: '平均售价' },
//     { value: 'avgCustomerPrice', name: '平均客单价' },
//     { value: 'preferentialOrderQuantity', name: '优惠订单' },
//     { value: 'associateSales', name: '关联销售' },
//   ],
//   '总体流量转化': [
//     { value: 'pageView', name: 'PageView' },
//     { value: 'session', name: 'Session' },
//     { value: 'pageViewExceptSession', name: 'PageView/Session' },
//     { value: 'conversionsRate', name: '转化率' },
//   ],
//   'B2B销售': [
//     { value: 'b2bSales', name: 'B2B销售额' },
//     { value: 'b2bOrderQuantity', name: 'B2B订单量' },
//     { value: 'b2bSalesQuantity', name: 'B2B销量' },
//     { value: 'b2bSalesQuantityExceptOrderQuantity', name: 'B2B销量/订单量' },
//     { value: 'b2bAvgSellingPrice', name: 'B2B平均售价' },
//     { value: 'b2bAvgCustomerPrice', name: 'B2B平均客单价' },
//   ],
//   '退货': [
//     { value: 'returnQuantity', name: '退货量' },
//     { value: 'returnRate', name: '退货率' },
//   ],
//   '广告销售表现': [
//     { value: 'adSales', name: '广告销售额' },
//     { value: 'naturalSales', name: '自然销售额' },
//     { value: 'adOrderQuantity', name: '广告订单量' },
//     { value: 'naturalOrderQuantity', name: '自然订单量' },
//   ],
//   '广告投入回报': [
//     { value: 'cpc', name: 'CPC' },
//     { value: 'cpa', name: 'CPA' },
//     { value: 'cpm', name: 'CPM' },
//     { value: 'spend', name: 'Spend' },
//     { value: 'acos', name: 'ACoS' },
//     { value: 'compositeAcos', name: '综合ACoS' },
//     { value: 'roas', name: 'RoAS' },
//     { value: 'compositeRoas', name: '综合RoAS' },
//   ],
//   '广告流量转化': [
//     { value: 'impressions', name: 'Impressions' },
//     { value: 'clicks', name: 'Clicks' },
//     { value: 'ctr', name: 'CTR' },
//     { value: 'adConversionsRate', name: '广告转化率' },
//   ],
// };

// 分组
export const groups = {
  'SKU': [
    'SKU总数',
    'Active-SKU',
    'Inactive-SKU',
    'FBA-active-SKU',
    'FBA-Inactive-SKU',
    'FBM-active-SKU',
    'FBM-Inactive-SKU',
  ],
  'ASIN': [
    'ASIN总数',
    'Buybox-ASIN',
    '非Buybox-ASIN',
    '动销率',
    '在售',
    '上新',
  ],
  '总体销售表现': [
    '总销售额',
    '总订单量',
    '总销量',
    '销量/订单量',
    '平均售价',
    '平均客单价',
    '优惠订单',
    '关联销售',
  ],
  '总体流量转化': [
    'PageView',
    'Session',
    'PageView/Session',
    '转化率',
  ],
  'B2B销售': [
    'B2B销售额',
    'B2B订单量',
    'B2B销量',
    'B2B销量/订单量',
    'B2B平均售价',
    'B2B平均客单价',
  ],
  '退货': [
    '退货量',
    '退货率',
  ],
  '广告销售表现': [
    '广告销售额',
    '自然销售额',
    '广告订单量',
    '自然订单量',
  ],
  '广告投入回报': [
    'CPC',
    'CPA',
    'CPM',
    'Spend',
    'ACoS',
    '综合ACoS',
    'RoAS',
    '综合RoAS',
  ],
  '广告流量转化': [
    'Impressions',
    'Clicks',
    'CTR',
    '广告转化率',
  ],
};


const CustomBlock: React.FC<IProps> = props => {
  const [visible, setVisible] = useState<boolean>(false);
  const { blockItems } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    storage.set('storeDetailCustomBlock', blockItems);
  }, [blockItems]);

  // 勾选框点击
  const handleChange = ({ target: { value, checked } }: CheckboxChangeEvent) => {
    const block = {};
    const name = AssignmentKeyName.getName(value);
    block[name] = checked;
    dispatch({
      type: 'storeDetail/updateCustomBlock',
      payload: block,
    });
  };

  // 渲染单个勾选框
  const renderCheckbox = (params: { key: string; name: string }) => {
    const { key, name } = params;
    const checked = blockItems[name];
    return (
      <Checkbox
        key={key}
        onChange={handleChange}
        checked={checked}
        value={key}
      >
        { name }
      </Checkbox>
    );
  };

  // 渲染一组勾选框，参数 groupName 对应上面的 groups 对象的 key
  const renderCheckboxGroup = (groupName: string) => {
    const nameList: string[] = groups[groupName];
    // 此分组的初始勾选
    const defaultChecked: string[] = [];
    nameList.forEach(item => blockItems[item] && defaultChecked.push(item));
    // 分组全选是否处于半选状态
    const indeterminate = defaultChecked.length > 0 && defaultChecked.length < nameList.length;
    // 分组全选是否选中
    const groupCheckedAll = defaultChecked.length === nameList.length;
    // 分组全选点击
    const handleGroupTitleChange = ({ target: { checked } }: CheckboxChangeEvent) => {
      const block = {};
      nameList.forEach(item => block[item] = checked);
      dispatch({
        type: 'storeDetail/updateCustomBlock',
        payload: block,
      });
    };
    return (
      <div className={styles.group}>
        <span className={styles.title}>
          <Checkbox
            onChange={handleGroupTitleChange}
            indeterminate={indeterminate}
            checked={groupCheckedAll}
          >
            {groupName}
          </Checkbox>
        </span>
        { nameList.map(name => renderCheckbox({ name, key: AssignmentKeyName.getkey(name) })) }
      </div>
    );
  };

  const customMenu = (
    <div className={styles.container}>
      <div className={styles.row}>
        { renderCheckboxGroup('SKU') }
        { renderCheckboxGroup('总体流量转化') }
        { renderCheckboxGroup('广告销售表现') }
      </div>
      <div className={styles.row}>
        { renderCheckboxGroup('ASIN') }
        { renderCheckboxGroup('B2B销售') }
        { renderCheckboxGroup('广告流量转化') }
      </div>
      <div className={styles.row}>
        { renderCheckboxGroup('总体销售表现') }
        { renderCheckboxGroup('退货') }
        { renderCheckboxGroup('广告投入回报') }
      </div>
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

export default CustomBlock;
