/**
 * 自定义列
 */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'umi';
import { Checkbox, Dropdown, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { storage } from '@/utils/utils';
import styles from './index.less';

interface IProps {
  colsItems: {
    [key: string]: boolean;
  };
}

// 分组
const groups = {
  '销售表现': [
    { value: 'totalSales', name: '总销售额' },
    { value: 'totalOrderQuantity', name: '总订单量' },
    { value: 'totalSalesQuantity', name: '总销量' },
    { value: 'cumulativelyOnSaleAsin', name: '累计在售ASIN' },
    { value: 'avgEachAsinOrder', name: '平均每ASIN订单' },
    { value: 'grossProfit', name: '销售毛利' },
    { value: 'grossProfitRate', name: '销售毛利率' },
    { value: 'salesQuantityExceptOrderQuantity', name: '销量/订单量' },
    { value: 'avgSellingPrice', name: '平均售价' },
    { value: 'avgCustomerPrice', name: '平均客单价' },
    { value: 'preferentialOrderQuantity', name: '优惠订单' },
    { value: 'associateSales', name: '关联销售' },
  ],
  '流量转化': [
    { value: 'pageView', name: 'PageView' },
    { value: 'session', name: 'Session' },
    { value: 'pageViewExceptSession', name: 'PageView/Session' },
    { value: 'conversionsRate', name: '转化率' },
  ],
  'B2B销售': [
    { value: 'b2bSales', name: 'B2B销售额' },
    { value: 'b2bOrderQuantity', name: 'B2B订单量' },
    { value: 'b2bSalesQuantity', name: 'B2B销量' },
    { value: 'b2bSalesQuantityExceptOrderQuantity', name: 'B2B销量/订单量' },
    { value: 'b2bAvgSellingPrice', name: 'B2B平均售价' },
    { value: 'b2bAvgCustomerPrice', name: 'B2B平均客单价' },
  ],
  '退货': [
    { value: 'returnQuantity', name: '退货量' },
    { value: 'returnRate', name: '退货率' },
  ],
  '广告销售表现': [
    { value: 'adSales', name: '广告销售额' },
    { value: 'naturalSales', name: '自然销售额' },
    { value: 'adOrderQuantity', name: '广告订单量' },
    { value: 'naturalOrderQuantity', name: '自然订单量' },
  ],
  '广告投入回报': [
    { value: 'cpc', name: 'CPC' },
    { value: 'cpa', name: 'CPA' },
    { value: 'cpm', name: 'CPM' },
    { value: 'spend', name: 'Spend' },
    { value: 'acos', name: 'ACoS' },
    { value: 'compositeAcos', name: '综合ACoS' },
    { value: 'roas', name: 'RoAS' },
    { value: 'compositeRoas', name: '综合RoAS' },
  ],
  '广告流量转化': [
    { value: 'impressions', name: 'Impressions' },
    { value: 'clicks', name: 'Clicks' },
    { value: 'ctr', name: 'CTR' },
    { value: 'adConversionsRate', name: '广告转化率' },
  ],
};

const CustomCols: React.FC<IProps> = props => {
  const [visible, setVisible] = useState<boolean>(false);
  const { colsItems } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    storage.set('storeReportCustomCols', colsItems);
  }, [colsItems]);

  // 勾选框点击
  const handleChange = ({ target: { value, checked } }: CheckboxChangeEvent) => {
    const col = {};
    col[value] = checked;
    dispatch({
      type: 'storeReport/updateCustomCols',
      payload: col,
    });
  };

  // 渲染单个勾选框
  const renderCheckbox = (params: { value: string; name: string }) => {
    const { value, name } = params;
    const checked = colsItems[value];
    return (
      <Checkbox
        key={value}
        onChange={handleChange}
        checked={checked}
        value={value}
      >
        { name }
      </Checkbox>
    );
  };

  // 渲染一组勾选框，参数 groupName 对应上面的 groups 对象的 key
  const renderCheckboxGroup = (groupName: string) => {
    const list: {name: string; value: string}[] = groups[groupName];
    // 此分组的初始勾选
    const defaultChecked: string[] = [];
    list.forEach(item => colsItems[item.value] && defaultChecked.push(item.value));
    // 分组全选是否处于半选状态
    const indeterminate = defaultChecked.length > 0 && defaultChecked.length < list.length;
    // 分组全选是否选中
    const groupCheckedAll = defaultChecked.length === list.length;
    // 分组全选点击
    const handleGroupTitleChange = ({ target: { checked } }: CheckboxChangeEvent) => {
      const col = {};
      list.forEach(item => col[item.value] = checked);
      dispatch({
        type: 'storeReport/updateCustomCols',
        payload: col,
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
        { list.map(item => renderCheckbox({ ...item })) }
      </div>
    );
  };

  const customMenu = (
    <div className={styles.container}>
      <div className={styles.col}>
        { renderCheckboxGroup('销售表现') }
        { renderCheckboxGroup('流量转化') }
      </div>
      <div className={styles.col}>
        { renderCheckboxGroup('B2B销售') }
        { renderCheckboxGroup('退货') }
        { renderCheckboxGroup('广告销售表现') }
      </div>
      <div className={styles.col}>
        { renderCheckboxGroup('广告投入回报') }
        { renderCheckboxGroup('广告流量转化') }
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

export default CustomCols;
