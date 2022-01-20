/**
 * 销售大盘
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, Radio, Select } from 'antd';
import { Link, useDispatch, useSelector } from 'umi';
import BiweeklyRangePicker, { IChangeDates } from '@/pages/components/BiweeklyRangePicker';
import styles from './index.less';
import { Iconfont, requestErrorFeedback, storage } from '@/utils/utils';
import { AssignmentKeyName } from './utils';
import { currencyDict, multiDataOrigin, showPreviousPeriodKey } from './config';
import { IConnectState } from '@/models/connect';
import TofuBlock from './components/TofuBlock';
import WorldSiteTimeClock from './components/WorldSiteTimeClock';
import Charts from './components/LineCharts';
import WorldMap from './components/WorldMap';
import MyIcon from '@/pages/components/GoodsIcon';

const { Option } = Select;
// 日期存储key
const calendarStorageKey = 'salesOverview_dateRange';
// 豆腐块
const tofuNames = ['总销售额', '总订单量', '总销量', '广告销售额', '广告订单量', '广告花费'];

const SalesOverview: React.FC = () => {
  const dispatch = useDispatch();
  const shopList = useSelector((state: IConnectState) => state.global.shop.list);
  // 未授权广告的店铺
  const noBindAdShopList = shopList.filter(item => !item.bindAdStore && item);
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    tofu: loadingEffect['salesOverview/fetchBaseAndTofu'],
    polyline: loadingEffect['salesOverview/fetchPolylineAndMap'],
  };
  const pageData = useSelector((state: IConnectState) => state.salesOverview);
  const {
    searchParams,
    tofu,
    tofuChecked,
    currencyRates,
    currentTime,
    updateTime,
    polyline,
    map,
    colors,
  } = pageData;
  // 统计周期
  const [periodType, setPeriodType] = useState<StoreDetail.PeriodType>('DAY');
  // 数据源
  const [dataOrigin, setDataOrigin] = useState<StoreDetail.DataOrigin>('');
  // 上年同期是否显示
  const [previousYear, setPreviousYear] = useState<boolean>(false);
  // 上期是否显示
  const [showPrevious, setShowPrevious] = useState<boolean>(false);

  useEffect(() => {
    const { startDate, endDate, selectedKey } = storage.get(calendarStorageKey);
    // timeMethod 参数在特定情况下才需要， 不然后端会报错
    const timeMethod = ['WEEK', 'BIWEEKLY', 'MONTH', 'QUARTER'].includes(selectedKey.toUpperCase())
      ? selectedKey : undefined;
    dispatch({
      type: 'salesOverview/updateSearchParams',
      payload: {
        startTime: startDate,
        endTime: endDate,
        timeMethod,
      },
    });
  }, [dispatch]);

  // 查询条件改变，刷新豆腐块数据、折线图等
  useEffect(() => {
    if (!searchParams.startTime && !searchParams.endTime) {
      return;
    }
    // 上期是否显示（当日期范围选择 365 今年 去年等时，不显示上期数据，但后端会传回来上期数据）
    // 当日期范围是不显示上期时
    if (!showPreviousPeriodKey.includes(searchParams.timeMethod)) {
      setShowPrevious(false);
    }
    // 豆腐块
    dispatch({
      type: 'salesOverview/fetchBaseAndTofu',
      payload: {
        ...searchParams,
      },
      callback: requestErrorFeedback,
    });
    // 折线图和地图
    dispatch({
      type: 'salesOverview/fetchPolylineAndMap',
      payload: {
        ...searchParams,
        method: periodType,
        dataOrigin,
      },
      callback: requestErrorFeedback,
      updateMap: true,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 折线图数据
  const chartDataSource = useMemo(() => {
    // 本期
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r: any = { thisPeriod: polyline.thisPeriod };
    // 上年同期
    previousYear && (r.firstHalf = polyline.firstHalf);
    // 上期（周，两周，月，季）（追加了最近 X 天也显示上期）
    showPrevious && (r.firstWeekOrMonthHalf = polyline.firstWeekOrMonthHalf);
    return r;
  }, [previousYear, showPrevious, polyline]);

  // 日期改变
  function handleDateRangeChange(dates: IChangeDates) {
    const { startDate, endDate, selectedKey } = dates;
    // timeMethod 参数在特定情况下才需要， 不然后端会报错
    const timeMethod = ['WEEK', 'BIWEEKLY', 'MONTH', 'QUARTER'].includes(selectedKey.toUpperCase())
      ? selectedKey : undefined;
    const payload = {
      startTime: startDate,
      endTime: endDate,
      timeMethod,
    };
    dispatch({
      type: 'salesOverview/updateSearchParams',
      payload,
    });
  }

  // 豆腐块 active 数据切换
  function handleTofuCheckedChange(name: string) {
    dispatch({
      type: 'salesOverview/updateTofuChecked',
      payload: name,
    });
    // 折线图和地图
    dispatch({
      type: 'salesOverview/fetchPolylineAndMap',
      payload: {
        ...searchParams,
        method: periodType,
        dataOrigin,
      },
      callback: requestErrorFeedback,
      updateMap: true,
    });
  }

  // 数据源选择，刷新折线图
  function handleDataOriginChange(value: StoreDetail.DataOrigin) {
    setDataOrigin(value);
    // 折线图和地图
    dispatch({
      type: 'salesOverview/fetchPolylineAndMap',
      payload: {
        ...searchParams,
        method: periodType,
        dataOrigin: value,
      },
      callback: requestErrorFeedback,
    });
  }

  // 统计周期类型切换，刷新折线图
  function handlePeriodTypeChange(value: StoreDetail.PeriodType) {
    setPeriodType(value);
    // 折线图和地图
    dispatch({
      type: 'salesOverview/fetchPolylineAndMap',
      payload: {
        ...searchParams,
        method: value,
        dataOrigin,
      },
      callback: requestErrorFeedback,
    });
  }

  // 货币修改
  function handleCurrencyChange(value: 'rmb' | 'usd') {
    dispatch({
      type: 'salesOverview/updateSearchParams',
      payload: { currency: value },
    });
  }

  // 折线图顶部工具栏
  function renderToolbar() {
    return (
      <div className={styles.chartsToobar}>
        {
          tofuChecked.some(name => multiDataOrigin.includes(name)) &&
          <Radio.Group
            options={[
              { label: <>总体{MyIcon.question('总体=FBA+FBM，不包含B2B销售')}</>, value: '' },
              { label: 'FBA', value: 'fba' },
              { label: 'FBM', value: 'fbm' },
              { label: 'B2B', value: 'b2b' },
            ]}
            onChange={e => handleDataOriginChange(e.target.value)}
            value={dataOrigin}
          />
        }
        <div>
          {
            showPreviousPeriodKey.includes(searchParams.timeMethod) &&
            <Checkbox
              onChange={() => setShowPrevious(!showPrevious)}
              checked={showPrevious}
            >
              上期
            </Checkbox>
          }
          <Checkbox
            onChange={() => setPreviousYear(!previousYear)}
            checked={previousYear}
          >
            上年同期
          </Checkbox>
        </div>
        <div>
          统计周期：
          <Radio.Group
            options={[
              { label: '日', value: 'DAY' },
              { label: '周', value: 'WEEK' },
              { label: '月', value: 'MONTH' },
            ]}
            onChange={e => handlePeriodTypeChange(e.target.value)}
            value={periodType}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div>
          <div className={styles.pageTitle}>店铺概况</div>
          <div className={styles.explain}>（所有站点数据直接按照日期统计，不转换时区）</div>
          {
            noBindAdShopList.length &&
            <div className={styles.notBind}>
              （店铺
              <span className={styles.notBindShopNames}>
                { noBindAdShopList.map(item => `${item.marketplace}-${item.storeName}、`) }
              </span>
              未完成广告授权，为保证数据完整，请前往
              <Link to="/shop/list">
                授权<Iconfont type="icon-zhankai" className={styles.iconZhankai} />
              </Link>）
            </div>
          }
        </div>
        <div className={styles.headRight}>
          <div className={styles.updateTime}>
            更新时间：
            <span>{ updateTime }</span>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.toolbar}>
            <Select
              value={searchParams.currency}
              className={styles.Select}
              onChange={handleCurrencyChange}
            >
              <Option value="rmb">人民币</Option>
              <Option value="usd">美元</Option>
            </Select>
            <BiweeklyRangePicker 
              defaultSelectedKey={'15'}
              localStorageKey={calendarStorageKey}
              onChange={handleDateRangeChange}
              containerClassName={styles.BiweeklyRangePicker}
            />
          </div>
          <div className={styles.tofuContainer}>
            {
              tofuNames.map(name => (
                <TofuBlock
                  key={name}
                  checked={tofuChecked.includes(name)}
                  currency={currencyDict[searchParams.currency]}
                  name={name}
                  color={colors[tofuChecked.indexOf(name)]}
                  value={tofu[AssignmentKeyName.getkey(name)]}
                  ratio={tofu[AssignmentKeyName.getkey(`${name}环比`)]}
                  clickCallback={handleTofuCheckedChange}
                />
              ))
            }
          </div>
          <div className={styles.info}>
            <div className={styles.currentTime}>
              <WorldSiteTimeClock currentTime={currentTime} />
            </div>
            <div className={styles.exchangeRate}>
              <div className={styles.exchangeRateTitle}>人民币汇率：</div>
              <div className={styles.exchangeRateValue}>
                {
                  currencyRates.map(item => (
                    <div key={item.name}>
                      {item.name}: {item.rate}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          { renderToolbar() }
          <Charts
            dataOrigin={dataOrigin}
            dataSource={chartDataSource}
            dataTypes={tofuChecked}
            currency={currencyDict[searchParams.currency]}
            loading={loading.polyline}
            colors={colors}
          />
          <WorldMap
            data={map}
            dataTypes={tofuChecked}
            currency={currencyDict[searchParams.currency]}
            colors={colors}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
