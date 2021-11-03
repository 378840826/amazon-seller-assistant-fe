/**
 * 店铺概况
 */

import React, { useEffect, useState } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import { getPageQuery, Iconfont, requestErrorFeedback, storage } from '@/utils/utils';
import styles from './index.less';
import { Select, Tabs } from 'antd';
import CustomBlock from './CustomBlock';
import DefinedCalendar from '@/components/DefinedCalendar';
import { getDefinedCalendarFiltrateParams } from '../StoreReport/utils';
import definedCalendarSelectList from '../StoreReport/DefinedCalendarSelectList';
import Main from './tabPages/Main/main';
import SkuAsinBlock from './SkuAsinBlock';

const { Option } = Select;
const { TabPane } = Tabs;

// 日期本地存储的 base key
export const calendarStorageBaseKey = 'storeDetail';

const StoreDetail: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺
  const shopState = useSelector((state: IConnectState) => state.global.shop);
  const { list: shopList, current: currentShop } = shopState;
  const { id: currentShopId, bindAdStore } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const pageData = useSelector((state: IConnectState) => state.storeDetail);
  const { customBlock, searchParams, baseData: { updateTime } } = pageData;
  // 日期
  const [calendarDefaultKey, setCalendarDefaultKey] = useState<string>(
    storage.get(`${calendarStorageBaseKey}_dc_itemKey`) || '4'
  );

  useEffect(() => {
    if (currentShopId !== '-1') {
      const { storeId } = getPageQuery();
      // 清除 url 中的参数
      window.history.replaceState(null, '', window.location.pathname);
      //判断是否有路由传参店铺id，若有传且不是当前选中店铺 则按此店铺id切换店铺
      if (storeId && storeId !== currentShopId) {
        const current = shopList.find(shop => shop.id === storeId);
        dispatch({
          type: 'global/setCurrentShop',
          payload: current,
        });
      } else {
        // 日期范围
        const { startDate, endDate } = storage.get(`${calendarStorageBaseKey}_dc_dateRange`);
        const dateParams = getDefinedCalendarFiltrateParams({
          dateStart: startDate, dateEnd: endDate, selectItemKey: calendarDefaultKey,
        });
        dispatch({
          type: 'storeDetail/fetchBaseData',
          payload: {
            headersParams,
            ...dateParams,
          },
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId, shopList]);

  // 日期改变
  function handleDateRangeChange(dates: DefinedCalendar.IChangeParams) {
    const { selectItemKey } = dates;
    setCalendarDefaultKey(selectItemKey);
    dispatch({
      type: 'storeDetail/fetchBaseData',
      payload: getDefinedCalendarFiltrateParams(dates),
      callback: requestErrorFeedback,
    });
  }

  // 修改全局币种
  function handleCurrencyChange(currency: '0' | '1') {
    dispatch({
      type: 'storeDetail/updateSearchParams',
      payload: { currency },
    });
  }

  // 切换标签
  function handleTabChange(key: string) {
    console.log('handleTabChange', key);
  }

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div>
          <div className={styles.pageTitle}>店铺概况</div>
          {
            !bindAdStore &&
            <div className={styles.notBind}>
              （店铺未完成广告授权，
              <Link to="/shop/list">
                去授权<Iconfont type="icon-zhankai" className={styles.iconZhankai} />
              </Link>）
            </div>
          }
        </div>
        <div className={styles.headRight}>
          <div className={styles.updateTime}>
            更新时间：
            <span>{updateTime}</span>
          </div>
          <div>
            币种：
            <Select
              className={styles.Select}
              value={searchParams.currency}
              onChange={v => handleCurrencyChange(v)}
            >
              <Option value="0">原币种</Option>
              <Option value="1">人民币</Option>
            </Select>
          </div>
          <CustomBlock blockItems={customBlock} />
          <DefinedCalendar 
            itemKey={calendarDefaultKey}
            storageKey={calendarStorageBaseKey}
            index={1}
            change={handleDateRangeChange}
            className={styles.DefinedCalendar}
            selectList={definedCalendarSelectList}
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentHead}>
          <SkuAsinBlock />
        </div>
        <div className={styles.tabsContainer}>
          <Tabs defaultActiveKey="1" onChange={handleTabChange} className={styles.Tabs}>
            <TabPane tab="整体表现" key="1">
              <Main />
            </TabPane>
            <TabPane tab="B2B销售" key="2">
              B2B销售
            </TabPane>
            <TabPane tab="费用成本" key="3">
              费用成本
            </TabPane>
            <TabPane tab="退货分析" key="4">
              退货分析
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
