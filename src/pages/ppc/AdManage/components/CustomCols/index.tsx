/**
 * 公用的自定义列
 */
import React, { useState } from 'react';
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
  // 类型: 广告活动 广告组 广告 关键词 Targeting searchTerm报表
  listType: 'campaign' | 'group' |'ad' | 'keyword' | 'targeting' | 'searchTerm';
}

// 全部的字段（包括广告活动，广告组，广告，关键词等）
const allItem = {
  // 广告活动和公共的
  portfolios: 'Portfolios',
  adType: '广告类型',
  targetingType: '投放方式',
  createdTime: '创建时间',
  adGroupCount: '广告组数量',
  biddingStrategy: '竞价策略',
  topOfSearch: 'Top of Search',
  productPage: 'Product Page',
  dailyBudget: '日预算',
  negativeTargetCount: '否定Targeting',
  date: '日期',
  sales: '销售额',
  orderNum: '订单量',
  cpc: 'CPC',
  cpa: 'CPA',
  spend: 'Spend',
  acos: 'ACoS',
  roas: 'RoAS',
  impressions: 'Impressions',
  clicks: 'Clicks',
  ctr: 'CTR',
  conversionsRate: '转化率',
  // 广告组
  defaultBid: '默认竞价',
  productCount: '广告个数',
  targetCount: 'Targeting',
  budgetLimit: '预算控制',
  // 广告
  qualification: '投放资格',
  addTime: '添加时间',
  // 关键词
  matchType: '匹配方式',
  suggested: '建议竞价',
  bid: '竞价',
  // targeting
  // targetingType和广告活动的冲突，所以用 targetingItemType
  targetingItemType: 'Targeting类型',
  // searchTerm
  deliveryStatus: '投放状态',
  keywordText: '投放词',
};

// 各个列表对应的数据
const listTypeDict = {
  campaign: {
    localStorageKey: 'adCampaignCustomCols',
    dispatchType: 'adManage/updateCampaignCustomCols',
  },
  group: {
    localStorageKey: 'adGroupCustomCols',
    dispatchType: 'adManage/updateGroupCustomCols',
  },
  ad: {
    localStorageKey: 'adCustomCols',
    dispatchType: 'adManage/updateAdCustomCols',
  },
  keyword: {
    localStorageKey: 'adKeywordCustomCols',
    dispatchType: 'adManage/updateKeywordCustomCols',
  },
  targeting: {
    localStorageKey: 'adTargetingCustomCols',
    dispatchType: 'adManage/updateTargetingCustomCols',
  },
  searchTerm: {
    localStorageKey: 'adSearchTermCustomCols',
    dispatchType: 'adManage/updateSearchTermCustomCols',
  },
};

const CustomCols: React.FC<IProps> = props => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState<boolean>(false);
  const { colsItems, listType } = props;
  const targetTypeDict = listTypeDict[listType];
  const keys = Object.keys(colsItems);
  const length = keys.length;
  // 超过 18 的得时候，分开两列
  const divide = length >= 18;

  // 勾选
  function handleChange({ target: { value, checked } }: CheckboxChangeEvent) {
    const col = {};
    col[value] = checked;
    dispatch({
      type: targetTypeDict.dispatchType,
      payload: col,
    });
  }

  // 获取 Checkbox.Group 选中的项目
  function getCustomColsValue() {
    const customColsValue: string[] = [];
    keys.forEach((key: string) => {
      colsItems[key] ? customColsValue.push(key) : null;
    });
    return customColsValue;
  }

  // 显示/隐藏 (隐藏时保存数据到 localStorage)
  function handleVisibleChange(visible: boolean) {
    setVisible(visible);
    if (!visible) {
      storage.set(targetTypeDict.localStorageKey, colsItems);
    }
  }

  // 下拉
  const customMenu = (
    <div className={styles.customColumnContainer}>
      {
        divide
          ?
          <>
            <Checkbox.Group defaultValue={getCustomColsValue()}>
              {
                keys.slice(0, length / 2).map(key => (
                  <Row key={key} gutter={[0, 6]}>
                    <Col>
                      <Checkbox onChange={handleChange} value={key}>{allItem[key]}</Checkbox>
                    </Col>
                  </Row>
                ))
              }
            </Checkbox.Group>
            <Checkbox.Group defaultValue={getCustomColsValue()}>
              {
                keys.slice(length / 2).map(key => (
                  <Row key={key} gutter={[0, 6]}>
                    <Col>
                      <Checkbox onChange={handleChange} value={key}>{allItem[key]}</Checkbox>
                    </Col>
                  </Row>
                ))
              }
            </Checkbox.Group>
          </>
          :
          <Checkbox.Group defaultValue={getCustomColsValue()}>
            {
              keys.map(key => (
                <Row key={key} gutter={[0, 6]}>
                  <Col>
                    <Checkbox onChange={handleChange} value={key}>{allItem[key]}</Checkbox>
                  </Col>
                </Row>
              ))
            }
          </Checkbox.Group>
      }
    </div>
  );

  return (
    <Dropdown
      overlay={customMenu}
      trigger={['click']}
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <Button>
        自定义列 { visible ? <UpOutlined className="anticon-down" /> : <DownOutlined /> }
      </Button>
    </Dropdown>
  );
};

export default React.memo(CustomCols);
