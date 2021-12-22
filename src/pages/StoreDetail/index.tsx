/**
 * 店铺概况
 */

import React, { useEffect } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import { day, getPageQuery, Iconfont, requestErrorFeedback, storage } from '@/utils/utils';
import styles from './index.less';
import { Select, Tabs } from 'antd';
import CustomBlock from './components/CustomBlock';
import BiweeklyRangePicker, { IChangeDates } from '@/pages/components/BiweeklyRangePicker';
import MyIcon from '@/pages/components/GoodsIcon';
import SkuAsinBlock from './SkuAsinBlock';
import Main from './tabPages/Main/main';
import B2B from './tabPages/B2B/b2b';
import ReturnAnalysis from './tabPages/ReturnAnalysis/returnAnalysis';
// import Cost from './tabPages/Cost/cost';
// import ProductLine from './tabPages/ProductLine/productLine';
// import Ad from './tabPages/Ad/ad';
// import Regional from './tabPages/Regional/regional';

const { Option } = Select;
const { TabPane } = Tabs;

// 日期本地存储的 base key
export const calendarStorageBaseKey = 'storeDetail_dateRange';

const StoreDetail: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺
  const shopState = useSelector((state: IConnectState) => state.global.shop);
  const { list: shopList, current: currentShop } = shopState;
  const { id: currentShopId, bindAdStore, currency } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const pageData = useSelector((state: IConnectState) => state.storeDetail);
  const { customBlock, searchParams } = pageData;
  // 固定为当天凌晨，后续需要优化
  const updateTime = `${day.getNowFormatTime('YYYY-MM-DD')} 00:00 (北京时间)`;

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
        const { startDate, endDate, selectedKey } = storage.get(calendarStorageBaseKey);
        // timeMethod 参数在特定情况下才需要， 不然后端会报错
        const timeMethod = ['WEEK', 'BIWEEKLY', 'MONTH', 'QUARTER'].includes(selectedKey.toUpperCase())
          ? selectedKey : undefined;
        dispatch({
          type: 'storeDetail/fetchBaseData',
          payload: {
            headersParams,
            startTime: startDate,
            endTime: endDate,
            timeMethod,
          },
        });
      }
      // 设置默认的货币符号
      dispatch({
        type: 'storeDetail/updateShowCurrency',
        payload: { originalCurrency: currency, currencyType: searchParams.currency },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId, shopList]);

  // 日期改变
  function handleDateRangeChange(dates: IChangeDates) {
    const { startDate, endDate, selectedKey } = dates;
    // timeMethod 参数在特定情况下才需要， 不然后端会报错
    const timeMethod = ['WEEK', 'BIWEEKLY', 'MONTH', 'QUARTER'].includes(selectedKey.toUpperCase())
      ? selectedKey : undefined;
    dispatch({
      type: 'storeDetail/fetchBaseData',
      payload: {
        startTime: startDate,
        endTime: endDate,
        timeMethod,
      },
      callback: requestErrorFeedback,
    });
  }

  // 修改全局币种
  function handleCurrencyChange(currencyType: 'original' | 'rmb') {
    // 更新查询参数
    dispatch({
      type: 'storeDetail/updateSearchParams',
      payload: { currency: currencyType },
    });
    // 更新页面显示的货币符号
    dispatch({
      type: 'storeDetail/updateShowCurrency',
      payload: { originalCurrency: currency, currencyType },
    });
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
            <span>{ updateTime }</span>
          </div>
          <div>
            币种：
            <Select
              className={styles.Select}
              value={searchParams.currency}
              onChange={v => handleCurrencyChange(v)}
            >
              <Option value="original">原币种</Option>
              <Option value="rmb">人民币</Option>
            </Select>
          </div>
          <CustomBlock blockItems={customBlock} />
          <BiweeklyRangePicker 
            defaultSelectedKey={'15'}
            localStorageKey={calendarStorageBaseKey}
            onChange={handleDateRangeChange}
            containerClassName={styles.BiweeklyRangePicker}
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentHead}>
          <SkuAsinBlock />
        </div>
        <div className={styles.tabsContainer}>
          <Tabs
            defaultActiveKey="整体表现"
            className={styles.Tabs}
            // destroyInactiveTabPane
          >
            <TabPane tab="整体表现" key="整体表现">
              <Main />
            </TabPane>
            
            <TabPane tab="B2B销售" key="B2B销售">
              <B2B />
            </TabPane>
            <TabPane
              tab={<span className={styles.returnAnalysisTab}>
                退货分析{MyIcon.question(
                  '由于亚马逊退货周期较长，数据比较滞后，建议查看一个月以前的数据，以获得相对准确的统计数据'
                )}
              </span>}
              key="退货分析">
              <ReturnAnalysis />
            </TabPane>
            {/* <TabPane tab="广告表现" key="广告表现">
              {
                bindAdStore
                  ? <Ad />
                  : 
                  <div className={styles.notBind}>
                    店铺未完成广告授权，
                    <Link to="/shop/list">去授权</Link>
                  </div>
              }
            </TabPane>
            <TabPane tab="费用成本" key="费用成本">
              <Cost />
            </TabPane>
            <TabPane tab="地区销售" key="地区销售">
              <Regional />
            </TabPane>
            <TabPane tab="产品线" key="产品线">
              <ProductLine />
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
