import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  useDispatch,
  useSelector,
} from 'umi';
import {
  Checkbox,
  message,
} from 'antd';


// 公共类
import { storageKeys, isObject } from '@/utils/huang';
import { storage } from '@/utils/utils';

// components
import Update from './components/Update';
import DouFu from './components/Doufu';
import Statistic from './components/Statistic';
import LineChart from './components/LineChart';
import DefinedCalendar from '@/components/DefinedCalendar';

// 私
import styles from './index.less';
import {
  doufuSelectList,
} from './config';
import {
  handleRange,
  handleDouFu,
} from './function';


const { asinB2BDateRange } = storageKeys;
const B2B: React.FC = () => {
  const dispatch = useDispatch();
  const lineChartRef = useRef<HTMLDivElement >(null);
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const currentAsin = useSelector((state: AsinB2B.IGlobalAsinType) => state.asinGlobal.asin);
  // 选中的豆腐块
  const attributes = useSelector((state: AsinB2B.IDFChecke) => state.asinB2B.dfCheckedTypes);
  const [homochronousvisible, setHomochronousvisible] = useState<boolean>(true); // 上月同期和上周同期显示
  const [homochronous, setHomochronous] = useState<'week'|'month'>('week'); // 是上月同期还是上周同期 true月 false周
  const [showWeekMonth, setShowWeekMonth] = useState<boolean>(false); // 是否勾选出上月(周)同期数据
  
  const localDateType = storage.get(`${asinB2BDateRange}_date_checked`);
  const [dateRangeItem, setDateRangeItem] = useState<string>(localDateType || '7'); // 周期
  const [statistic, setStatistic] = useState<string>('DAY');
  const [ishc, setIshc] = useState<boolean>(false);// 折线图是否显示上年同期数据
  const [update, setUpdate] = useState<string>('');
  const [chCondition, setChCondition] = useState<boolean>(false); // 专门用于控制请求的

  const [doufuList, setDoufuList] = useState<AsinB2B.IDouFuListTyep[]>(
    doufuSelectList
  );
  const [lineChartData, setLineChartData] = useState<AsinB2B.ILineChartData[]>([]);

  const getParams = useCallback((params = {}) => {
    // eslint-disable-next-line
    let newParams: any = {
      headersParams: {
        StoreId: currentShop.id,
      },
      asin: currentAsin,
      method: statistic,
      attributes,
    };

    if (dateRangeItem === 'week' || dateRangeItem === 'month') {
      newParams.timeMethod = dateRangeItem.toUpperCase();
      const { startDate, endDate } = storage.get(`${asinB2BDateRange}_date`);
      newParams.startTime = startDate;
      newParams.endTime = endDate;
    } else {
      const type = String(dateRangeItem);
      const cycle = handleRange(type);
      newParams.cycle = cycle;
    }

    newParams = Object.assign(newParams, params);
    return newParams;
  }, [
    currentAsin, 
    currentShop, 
    dateRangeItem, 
    attributes, 
    statistic,
  ]);

  // 判断当前是否为按月/周查看
  const judgeWeekMonth = useCallback(() => {
    if (dateRangeItem === 'week' || dateRangeItem === 'month') {
      setHomochronousvisible(true);
      setHomochronous(dateRangeItem);
    } else {
      setHomochronousvisible(false);
    }
  }, [dateRangeItem]);

  useEffect(() => {
    if (Number(currentShop.id) === -1) {
      return;
    }

    new Promise((resolve, reject) => {
      const payload = getParams();
      dispatch({
        type: 'asinB2B/getinitData',
        payload,
        resolve,
        reject,
      });
    }).then(datas => {
      const {
        data,
      } = datas as AsinB2B.IResponse;
      if (isObject(data)) {
        // console.log(data, 'datas');
        judgeWeekMonth();
        setLineChartData(data.lineChart as AsinB2B.ILineChartData[]);
        setUpdate(data.updateTime);
        setDoufuList([...handleDouFu(doufuSelectList, data.tofuBlocData)]); // 豆腐块数据
      } else {
        message.error(data.toString());
      }
      
    }).catch(err => {
      console.error(err);
    });

  }, [dispatch, currentShop, getParams, judgeWeekMonth, dateRangeItem, chCondition]);

  // 统计周期回调
  const statisticCallback = (value: string) => {
    setStatistic(value);
    // const params = {
    //   method: value,
    //   skus: checkedSkus,
    // };
    // changeLineChart(params);
  };

  // 周期的更改
  const handleRangeChange = (dates: DefinedCalendar.IChangeParams) => {
    setDateRangeItem(dates.selectItem);
    setChCondition(!chCondition); // why? 更改不同月份时，不会重新渲染dateRangeItem
  };

  
  return (
    <div className={styles.b2b}>
      <header className={styles.head}>
        <Update update={update}/>
        <div className={styles.right}>
          <DefinedCalendar 
            className={styles.rangeDate} 
            storageKey={asinB2BDateRange}
            change={handleRangeChange}
          />
        </div>
      </header>
      <DouFu list={doufuList} />
      <div className={styles.lineChart} ref={lineChartRef}>
        <header>
          {
            homochronousvisible ? 
              <Checkbox checked={showWeekMonth} 
                onChange={() => setShowWeekMonth(!showWeekMonth)}
              >
                上{homochronous === 'week' ? '周' : '月'}
                同期
              </Checkbox> : ''
          }
          <Checkbox 
            checked={ishc}
            onChange={() => setIshc(!ishc)}
            style={{
              marginLeft: 20,
            }}
          >
              上年同期
          </Checkbox>
          <Statistic 
            value={statistic} 
            cb={statisticCallback}
            style={{
              marginLeft: 20,
            }}
          />
        </header>
        <LineChart 
          datas={lineChartData} 
          ishc={ishc}
          isweekMonth={showWeekMonth}
          weekOrMonth={dateRangeItem}
        />
      </div>
    </div>
  );
};


export default B2B;
