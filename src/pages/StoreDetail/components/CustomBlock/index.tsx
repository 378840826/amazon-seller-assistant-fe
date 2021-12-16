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
import { AssignmentKeyName } from '../../utils';

interface IProps {
  blockItems: {
    [key: string]: boolean;
  };
}

// 分组
export const groups = {
  'SKU': [
    // 增加需求 SKU总数 不支持自定义数据
    // 'SKU总数',
    'Active-SKU',
    'Inactive-SKU',
    'FBA-active-SKU',
    'FBA-Inactive-SKU',
    'FBM-active-SKU',
    'FBM-Inactive-SKU',
  ],
  'ASIN': [
    // 增加需求 ASIN总数 不支持自定义数据
    // 'ASIN总数',
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
    'B2B销售额占比',
    'B2B平均售价',
    'B2B平均客单价',
    'B2B销量/订单量',
  ],
  '退货': [
    '退货量',
    '退货率',
  ],
  '费用成本': [
    '毛利',
    '毛利率',
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

// 增加需求，不支持自定义的字段
const notCustomNames = ['SKU总数', 'ASIN总数'];

const CustomBlock: React.FC<IProps> = props => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState<boolean>(false);
  const [checkedAll, setCheckedAll] = useState<boolean>(true);
  const [indeterminateAll, setIndeterminateAll] = useState<boolean>(false);
  const { blockItems } = props;

  useEffect(() => {
    storage.set('storeDetailCustomBlock', blockItems);
    // 定义全选框的状态
    const nameList: string[] = Object.keys(blockItems);
    const defaultChecked: string[] = [];
    nameList.forEach(item => blockItems[item] && defaultChecked.push(item));
    // 去掉不支持自定义的再计算 indeterminateAll (求补集后再对比判断)
    const complement = defaultChecked.filter(item => !notCustomNames.includes(item));
    const indeterminateAll = complement.length > 0 &&
    complement.length < (nameList.length - notCustomNames.length);
    const checkedAll = defaultChecked.length === nameList.length;
    setCheckedAll(checkedAll);
    setIndeterminateAll(indeterminateAll);
  }, [blockItems]);

  // 勾选框点击
  function handleChange({ target: { value, checked } }: CheckboxChangeEvent) {
    const block = {};
    const name = AssignmentKeyName.getName(value);
    block[name] = checked;
    dispatch({
      type: 'storeDetail/updateCustomBlock',
      payload: block,
    });
  }

  // 渲染单个勾选框
  function renderCheckbox(params: { key: string; name: string }) {
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
  }

  // 渲染一组勾选框，参数 groupName 对应上面的 groups 对象的 key
  function renderCheckboxGroup(groupName: string) {
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
  }

  // 全选
  function handleCheckAll({ target: { checked } }: CheckboxChangeEvent) {
    const block = {};
    Object.keys(blockItems).forEach(
    // 排除掉 ASIN总数 和 SKU总数 等不支持自定义的字段
      name => !notCustomNames.includes(name) && (block[name] = checked)
    );
    dispatch({
      type: 'storeDetail/updateCustomBlock',
      payload: block,
    });
  }

  const customMenu = (
    <div className={styles.container}>
      <div className={styles.checkAllContainer}>
        <Checkbox
          onChange={handleCheckAll}
          indeterminate={indeterminateAll}
          checked={checkedAll}
        >
          全选
        </Checkbox>
      </div>
      <div className={styles.checkboxContainer}>
        <div className={styles.col}>
          { renderCheckboxGroup('SKU') }
          { renderCheckboxGroup('总体流量转化') }
          { renderCheckboxGroup('广告投入回报') }
        </div>
        <div className={styles.col}>
          { renderCheckboxGroup('ASIN') }
          { renderCheckboxGroup('B2B销售') }
          { renderCheckboxGroup('广告流量转化') }
        </div>
        <div className={styles.col}>
          { renderCheckboxGroup('总体销售表现') }
          { renderCheckboxGroup('退货') }
          { renderCheckboxGroup('费用成本') }
          { renderCheckboxGroup('广告销售表现') }
        </div>
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
