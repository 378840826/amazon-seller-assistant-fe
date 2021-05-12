import React, { useState, useEffect } from 'react';
import { Tree, Tabs, Layout } from 'antd';
import { IConnectState } from '@/models/connect';
import { ITreeDataNode } from '@/models/adManage';
import { useSelector, useDispatch } from 'umi';
import { Iconfont, requestErrorFeedback, getPageQuery } from '@/utils/utils';
import { PlayCircleOutlined, PauseCircleOutlined, FolderFilled } from '@ant-design/icons';
import Campaign from './Campaign';
import Group from './Group';
import Ad from './Ad';
import Keyword from './Keyword';
import Targeting from './Targeting';
import NegativeTargeting from './NegativeTargeting';
import NegativeKeyword from './NegativeKeyword';
import SearchTerm from './SearchTerm';
import OperationRecord from './OperationRecord';
import { ITreeSelectedInfo } from './index.d';
import classnames from 'classnames';
import commonStyles from './common.less';
import styles from './index.less';

const { TabPane } = Tabs;
const { Sider } = Layout;

type TabsState = 'default' | 'campaign' | 'keywordGroup' | 'targetingGroup'

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
  negativeTargeting: { tab: '否定Targeting', countKey: 'neTargetCount', tabPane: <NegativeTargeting /> },
  negativeKeyword: { tab: '否定关键词', countKey: 'neTargetCount', tabPane: <NegativeKeyword /> },
  searchTerm: { tab: 'Search Term报表', tabPane: <SearchTerm /> },
  history: { tab: '操作记录', tabPane: <OperationRecord /> },
};

// 标签的三个状态
const tabsStateDict = {
  default: ['campaign', 'group', 'ad', 'keyword', 'targeting', 'searchTerm', 'history'],
  campaign: ['group', 'ad', 'keyword', 'targeting', 'negativeKeyword', 'searchTerm', 'history'],
  keywordGroup: ['ad', 'keyword', 'negativeKeyword', 'searchTerm', 'history'],
  targetingGroup: ['ad', 'targeting', 'negativeTargeting', 'searchTerm', 'history'],
};

// 状态图标字典
export const stateIconDict = {
  enabled: <PlayCircleOutlined className={styles.iconEnabled} />,
  paused: <PauseCircleOutlined className={styles.iconPaused} />,
  archived: <FolderFilled className={styles.iconArchived} />,
};

// 匹配方式
export const matchTypeDict: {[key in API.AdKeywordMatchType]: string} = {
  broad: '广泛',
  phrase: '词组',
  exact: '精准',
};

// 否定方式
export const negativeMatchTypeDict: {[key in API.AdNegativeKeywordMatchType]: string} = {
  negativeExact: '精准否定',
  negativePhrase: '词组否定',
};

const Manage: React.FC = function() {
  const dispatch = useDispatch();
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const { 
    treeData, tabsCellCount, updateTime, treeSelectedInfo, treeExpandedKeys,
  } = adManage;
  // 店铺
  const {
    id: currentShopId, storeName,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  // 标签页的类型
  const [tabsState, setTabsState] = useState<string>('default');
  // 选中的标签(默认选中第一个)
  const [activeTabKey, setActiveTabKey] = useState<string>(tabsStateDict[tabsState][0]);
  // const [activeTabKey, setActiveTabKey] = useState<string>('keyword');
  // 菜单树侧边栏是否收起
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
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
      // 获取 url qs 参数
      const qsParams = getPageQuery();
      // 有页面要用到的搜索参数时，不清空url参数，此做法待优化
      if (!qsParams.search) {
        window.history.replaceState(null, '', '/ppc/manage');
      }
      const { 
        campaignType, campaignState, campaignId, campaignName, groupId, groupName, tab, groupType,
      } = qsParams as { [key: string]: string };
      // 设置标签类型状态
      let qsTabsState = 'default';
      if (groupId) {
        qsTabsState = `${groupType}Group`;
        setActiveTabKey(tab || 'ad');
      } else if (campaignId) {
        qsTabsState = 'campaign';
        setActiveTabKey(tab || 'group');
      } else if (tab) {
        setActiveTabKey(tab);
      }
      setTabsState(qsTabsState);
      if (qsParams.campaignId !== undefined) {
        // 加载菜单树的广告活动/广告组数据
        const stateKey = `${campaignType}-${campaignState}`;
        const campaignKey = `${stateKey}-${campaignId}`;
        let key = campaignKey;
        // 跳转到广告组的情况
        if (groupId !== undefined) {
          key = `${campaignKey}-${groupId}`;
          // 先请求广告活动
          dispatch({
            type: 'adManage/fetchTreeNode',
            payload: {
              key: stateKey,
              headersParams: { StoreId: currentShopId },
            },
            callback: (code: number, msg: string) => {
              requestErrorFeedback(code, msg);
              // 广告活动加载完成再加载广告组
              dispatch({
                type: 'adManage/fetchTreeNode',
                payload: {
                  key: campaignKey,
                  parentCampaignName: campaignName,
                  headersParams: { StoreId: currentShopId },
                },
                callback: requestErrorFeedback,
              });
            },
          });
        } else {
          // 跳转到广告活动的情况
          dispatch({
            type: 'adManage/fetchTreeNode',
            payload: {
              key: stateKey,
              headersParams: { StoreId: currentShopId },
            },
            callback: requestErrorFeedback,
          });
        }
        // 修改菜单树选中的 key 和广告信息
        dispatch({
          type: 'adManage/saveTreeSelectedInfo',
          payload: {
            key,
            campaignType,
            campaignState,
            campaignId,
            campaignName,
            groupId,
            groupName,
            groupType,
          },
        });
        return () => {
          setActiveTabKey(tabsStateDict[tabsState][0]);
          // 收起菜单树
          dispatch({
            type: 'adManage/changeTreeExpandedKeys',
            payload: { keys: [] },
          });
          // 修改菜单树选中的 key 和广告信息为空
          dispatch({
            type: 'adManage/saveTreeSelectedInfo',
            payload: { key: '' },
          });
        };
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId]);

  // 异步加载菜单树数据
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onLoadData({ key, children, title }: any) {
    return new Promise<void>(resolve => {
      if (children) {
        resolve();
        return;
      }
      dispatch({
        type: 'adManage/fetchTreeNode',
        payload: {
          key,
          // 用于获取广告组的父节点广告活动的名称
          parentCampaignName: title,
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
        complete: resolve,
      });
    });
  }

  // 切换选中的广告活动或广告组
  function changeSelected(
    params: { tabsState: TabsState; selectedInfo: ITreeSelectedInfo }
  ) {
    const { tabsState, selectedInfo } = params;
    // 根据节点重新加载标签页
    setTabsState(tabsState);
    // 切换到第一个标签
    setActiveTabKey(tabsStateDict[tabsState][0]);
    // 请求各标签显示的数量（只有切换广告活动或广告组时才请求）
    // 对比上一个 treeSelectedInfo 和下一个 treeSelectedInfo(也就是selectedInfo) 是否完全一样，一样则不请求标签页数量
    if (
      treeSelectedInfo.campaignId !== selectedInfo.campaignId ||
      treeSelectedInfo.groupId !== selectedInfo.groupId
    ) {
      dispatch({
        type: 'adManage/fetchTabsCellCount',
        payload: {
          headersParams: { StoreId: currentShopId },
          campaignId: selectedInfo.campaignId,
          groupId: selectedInfo.groupId,
        },
        callback: requestErrorFeedback,
      });
    }
    // 修改菜单树选中的 key 和广告信息
    dispatch({
      type: 'adManage/saveTreeSelectedInfo',
      payload: selectedInfo,
    });
  }

  // 菜单树选中节点
  function handleSelect(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keys: React.Key[], e: { selected: boolean; selectedNodes: any[] }
  ) {
    // 不能取消选中
    if (keys.length === 0) {
      return;
    }
    const selectedNode = e.selectedNodes[0];
    // 切分 key 为 ”广告类型-状态-广告活动ID-广告组ID“
    const paramsArr = String(keys[0]).split('-');
    let tabsState: TabsState = 'default';
    // 用于面包屑导航的广告活动和广告组名称
    const selectedInfo: ITreeSelectedInfo = {
      key: String(keys[0]),
      campaignType: paramsArr[0] as API.CamType,
      campaignState: paramsArr[1] as API.AdState,
      campaignId: paramsArr[2],
      campaignName: '',
      groupId: paramsArr[3],
      groupName: '',
      groupType: selectedNode.groupType,
    };
    switch (paramsArr.length) {
    case 3:
      tabsState = 'campaign';
      selectedInfo.campaignName = selectedNode.title;
      break;
    case 4:
      tabsState = `${selectedNode.groupType}Group` as TabsState;
      selectedInfo.campaignName = selectedNode.parentCampaignName;
      selectedInfo.groupName = selectedNode.title;
      break;
    default:
      break;
    }
    // 修改菜单树选中的节点和面包屑等数据
    changeSelected({
      tabsState,
      selectedInfo,
    });    
  }

  // 面包屑导航点击
  function handleBreadcrumbClick(type: 'shop' | 'campaign') {
    let selectedInfo: ITreeSelectedInfo = {
      key: '',
      campaignId: '',
      campaignName: '',
      groupType: '',
    };
    let tabsState: TabsState = 'default';
    if (type === 'shop') {
      // 收起菜单树
      dispatch({
        type: 'adManage/changeTreeExpandedKeys',
        payload: { keys: [] },
      });
    } else if (type === 'campaign') {
      const paramsArr = treeSelectedInfo.key.split('-');
      selectedInfo = {
        key: `${paramsArr[0]}-${paramsArr[1]}-${paramsArr[2]}`,
        campaignType: paramsArr[0] as API.CamType,
        campaignState: paramsArr[1] as API.AdState,
        campaignId: treeSelectedInfo.campaignId,
        campaignName: treeSelectedInfo.campaignName,
        groupType: '',
      };
      tabsState = 'campaign';
    }
    // 修改菜单树选中的节点和面包屑等数据
    changeSelected({
      tabsState,
      selectedInfo,
    });
  }

  // 标签页切换
  function handleTabChange(key: string) {
    setActiveTabKey(key);
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
            expandedKeys={treeExpandedKeys}
            selectedKeys={[treeSelectedInfo.key]}
            switcherIcon={<Iconfont type="icon-xiangyoujiantou" className={styles.switcherIcon} />}
            className={classnames(styles.Tree, collapsed ? styles.hide : '')}
            onSelect={handleSelect}
            onExpand={(keys) => {
              dispatch({
                type: 'adManage/changeTreeExpandedKeys',
                payload: { keys },
              });
            }}
          />
        </Sider>
      </Layout>
      <div className={styles.tabsContainer}>
        {
          treeSelectedInfo.campaignName && 
            <div className={styles.breadcrumb}>
              <span
                className={styles.breadcrumbBtn}
                title={storeName}
                onClick={() => handleBreadcrumbClick('shop')}
              >
                {storeName}
              </span>
              <Iconfont type="icon-zhankai" className={styles.breadcrumbSeparator} />
              <span
                className={styles.breadcrumbBtn}
                title={`${treeSelectedInfo.campaignName}`}
                onClick={ treeSelectedInfo.groupId ? () => handleBreadcrumbClick('campaign') : undefined}
              >
                { treeSelectedInfo.campaignName }
              </span>
              {
                treeSelectedInfo.groupName &&
                <>
                  <Iconfont type="icon-zhankai" className={styles.breadcrumbSeparator} />
                  <span className={styles.breadcrumbBtn} title={`${treeSelectedInfo.groupName}`}>
                    { treeSelectedInfo.groupName }
                  </span>
                </>
              }
            </div>
        }
        <Tabs
          activeKey={activeTabKey}
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
