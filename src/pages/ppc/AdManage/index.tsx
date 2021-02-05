import React, { ReactText, useState, useEffect } from 'react';
import { Tree, Tabs, Layout } from 'antd';
import { IConnectState } from '@/models/connect';
import { ITreeDataNode } from '@/models/adManage';
import { useSelector, useDispatch } from 'umi';
import { Iconfont, requestErrorFeedback } from '@/utils/utils';
import { PlayCircleOutlined, PauseCircleOutlined, FolderFilled } from '@ant-design/icons';
import { DataNode } from 'antd/es/tree';
import Campaign from './Campaign';
import Group from './Group';
import Ad from './Ad';
import Keyword from './Keyword';
import Targeting from './Targeting';
import classnames from 'classnames';
import commonStyles from './common.less';
import styles from './index.less';

const { TabPane } = Tabs;
const { Sider } = Layout;

// 菜单树默认不变的前两级
export const initTreeData: ITreeDataNode[] = [
  { 
    title: <span className={styles.rootTitle}>SP商品广告</span>, 
    key: 'sp', 
    children: [
      { title: '已开启', key: 'sp-enabled' },
      { title: '已暂停', key: 'sp-paused' },
      { title: '已归档', key: 'sp-archived' },
    ],
  },
  { 
    title: <span className={styles.rootTitle}>SB品牌广告</span>, 
    key: 'sb', 
    children: [
      { title: '已开启', key: 'sb-enabled' },
      { title: '已暂停', key: 'sb-paused' },
      { title: '已归档', key: 'sb-archived' },
    ],
  },
  { 
    title: <span className={styles.rootTitle}>SD展示广告</span>, 
    key: 'sd', 
    children: [
      { title: '已开启', key: 'sd-enabled' },
      { title: '已暂停', key: 'sd-paused' },
      { title: '已归档', key: 'sd-archived' },
    ],
  },
];

// 全部标签
const allTab = {
  campaign: { tab: '广告活动', countKey: 'campaignCount', tabPane: <Campaign /> },
  group: { tab: '广告组', countKey: 'groupCount', tabPane: <Group /> },
  ad: { tab: '广告', countKey: 'adCount', tabPane: <Ad /> },
  keyword: { tab: '关键词', countKey: 'keywordCount', tabPane: <Keyword /> },
  targeting: { tab: '分类/商品投放', countKey: 'targetCount', tabPane: <Targeting /> },
  negativeTargeting: { tab: '否定Targeting', countKey: 'neTargetCount' },
  searchTerm: { tab: 'Search Term报表' },
  history: { tab: '操作记录' },
};

// 标签的三个状态
const tabsStateDict = {
  default: ['campaign', 'group', 'ad', 'keyword', 'targeting', 'searchTerm', 'history'],
  campaign: ['group', 'ad', 'keyword', 'targeting', 'negativeTargeting', 'searchTerm', 'history'],
  group: ['ad', 'keyword', 'negativeTargeting', 'searchTerm', 'history'],
};

// // 设置竞价的调价类型下拉框
// export const setBidOptions = [
//   { key: 'value', name: '固定值' },
//   { key: 'suggested', name: '建议竞价基础上' },
//   { key: 'suggestedMax', name: '最高建议竞价' },
//   { key: 'suggestedMin', name: '最低建议竞价' },
// ].map(item => (
//   <Option key={item.key} value={item.key}>
//     <span className={commonStyles[item.key]}>{item.name}</span>
//   </Option>
// ));

// 状态图标字典
export const stateIconDict = {
  enabled: <PlayCircleOutlined className={styles.iconEnabled} />,
  paused: <PauseCircleOutlined className={styles.iconPaused} />,
  archived: <FolderFilled className={styles.iconArchived} />,
};

// 匹配方式
export const matchTypeDict = {
  exact: '精准',
  phrase: '词组',
  broad: '广泛',
};

const Manage: React.FC = function() {
  const dispatch = useDispatch();
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const { 
    treeData, tabsCellCount, updateTime,
  } = adManage;
  // 店铺 ID
  const { id: currentShopId } = useSelector((state: IConnectState) => state.global.shop.current);
  // 菜单树的选中
  const [selectedKeys, setSelectedKeys] = useState<ReactText[] | undefined>();
  // 标签页的类型
  const [tabsState, setTabsState] = useState<string>('default');
  // 选中的标签
  const [activeKey, setActiveKey] = useState<string>(tabsStateDict[tabsState][3]);
  // 菜单树是否收起
  const [collapsed, setCollapsed] = useState<boolean>(true);

  useEffect(() => {
    if (currentShopId !== '-1') {
      // 店铺更新时间
      dispatch({
        type: 'adManage/fetchUpdateTime',
        payload: {
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
      // 各标签显示的数量
      dispatch({
        type: 'adManage/fetchTabsCellCount',
        payload: {
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId]);

  // 异步加载菜单树数据
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onLoadData({ key, children }: any) {
    return new Promise<void>(resolve => {
      if (children) {
        resolve();
        return;
      }
      dispatch({
        type: 'adManage/fetchTreeNode',
        payload: {
          key,
          headersParams: { adStoreId: '00000' },
        },
        callback: requestErrorFeedback,
        complete: resolve,
      });
    });
  }

  // 选中节点
  function handleSelect(
    keys: React.Key[], e: { selected: boolean; selectedNodes: DataNode[] }
  ) {
    console.log('handleSelect', keys, e.selectedNodes);
    // 不能取消选中
    if (keys.length) {
      setSelectedKeys(keys);
    }
    // 切分 key
    const params = String(keys[0]).split('-');
    // 根据节点重新加载标签页
    let state = 'default';
    if (params.length === 3) {
      state = 'campaign';
    } else if (params.length === 4) {
      state = 'group';
    }
    setTabsState(state);
    // 切换到第一个标签
    setActiveKey(tabsStateDict[state][0]);
    // 如果选中的是广告活动或广告组，重新请求标签数量
    if (params.length > 2) {
      // 请求各标签显示的数量
      dispatch({
        type: 'adManage/fetchTabsCellCount',
        payload: {
          headersParams: { StoreId: currentShopId },
          campaignId: params[2],
          groupId: params[3],
        },
        callback: requestErrorFeedback,
      });
    }    
  }

  // 标签页切换
  function handleTabChange(key: string) {
    setActiveKey(key);
  }

  return (
    <div className={classnames(styles.page, commonStyles.adManageContainer)}>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={state => setCollapsed(state)}
          className={classnames(styles.Sider, 'h-scroll')}
          width={300}
          collapsedWidth={50}
          trigger={<Iconfont type="icon-zhankai" className={classnames(styles.trigger, collapsed ? styles.left : '')} />}
        >
          <Tree
            showIcon
            loadData={onLoadData}
            treeData={treeData}
            selectedKeys={selectedKeys}
            switcherIcon={<Iconfont type="icon-xiangyoujiantou" className={styles.switcherIcon} />}
            className={classnames(styles.Tree, collapsed ? styles.hide : '')}
            onSelect={handleSelect}
          />
        </Sider>
      </Layout>
      <div className={styles.tabsContainer}>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          tabBarExtraContent={
            <div className={styles.updateTime}>更新时间：{updateTime}</div>
          }
        >
          {
            tabsStateDict[tabsState].map((key: string) => {
              const tab = allTab[key];
              return (
                <TabPane
                  key={key}
                  tab={
                    <span className={styles.tabsTitle}>
                      { tab.tab }
                      <span>{ tab.countKey ? <>({tabsCellCount[tab.countKey]})</> : null }</span>
                    </span>
                  }
                >
                  <div className={styles.tabContent}>
                    {
                      tab.tabPane || tab.tab
                    }
                  </div>
                </TabPane>
              );
            })
          }
        </Tabs>
      </div>
    </div>
  ); 
};

export default Manage;
