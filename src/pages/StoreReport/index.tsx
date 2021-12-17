/*
 * 店铺报表
 */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Form, Select, Table, Switch, Button } from 'antd';
import PageTitleRightInfo from '@/pages/components/PageTitleRightInfo';
import { IConnectState } from '@/models/connect';
import { requestErrorFeedback, storage, toUrl } from '@/utils/utils';
import CustomCols from './CustomCols';
import { getColumns } from './cols';
import styles from './index.less';
import { SortOrder } from 'antd/es/table/interface';
import BiweeklyRangePicker, { IChangeDates } from '@/pages/components/BiweeklyRangePicker';

const { Item } = Form;
const { Option } = Select;

const StoreReport: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  // loading
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['storeReport/fetchList'];
  const pageData = useSelector((state: IConnectState) => state.storeReport);
  const {
    regionSiteStore,
    customCols,
    list: { records, updateTime, totalIndicators },
    searchParams: { order, sort },
  } = pageData;
  // 环比开关
  const [ratioSwitchChecked, setRatioSwitchChecked] = useState<boolean>(false);
  // 日期
  const calendarStorageBaseKey = 'storeReport_dateRange';
  // 导出按钮 loading
  const [exportBtnLoading, setExportBtnLoading] = useState<boolean>(false);

  useEffect(() => {
    // 获取地区/站点/店铺
    dispatch({
      type: 'storeReport/fetchRegionSiteStore',
      payload: {},
      callback: requestErrorFeedback,
    });
    // 日期范围
    const { startDate, endDate, selectedKey } = storage.get(calendarStorageBaseKey);
    let payload;
    // timeMethod 参数在特定情况下才需要， 不然后端会报错
    if (['WEEK', 'BIWEEKLY', 'MONTH', 'SEASON'].includes(selectedKey.toUpperCase())) {
      payload = {
        startTime: startDate,
        endTime: endDate,
        timeMethod: selectedKey,
      };
    } else {
      payload = {
        startTime: startDate,
        endTime: endDate,
      };
    }
    dispatch({
      type: 'storeReport/fetchList',
      payload,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // 特殊处理表格的样式，后续优化
  useEffect(() => {
    window.document.querySelectorAll('.x-peculiar-td-content').forEach(
      div => div.closest('td')?.classList.add('x-peculiar-td')
    );
  });

  // 合计行的数据要正确显示需要特殊处理
  // 因为多级表头的存在，合计行的 key 需要和多级表头的第一个子表头的 key 对应才能显示
  // 第一个子表头全部为"环比"， key 的规律是在主表头 key 的末尾加上 'RingRatio'
  function createTotalData() {
    const r = {
      ...totalIndicators,
      storeId: '',
      storeName: '合计',
      marketplace: '',
      // 合计的金额为 RMB
      currency: '￥',
    } as StoreReport.IStoreReport;
    Object.keys(totalIndicators).forEach(key => {
      r[`${key}RingRatio`] = totalIndicators[key];
    });
    return r;
  }

  // 合计行数据
  const totalRowData = createTotalData();

  // 筛选参数变化
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleFormChange(value: any, formValues: any) {
    // 非切换币种时（切换地区站点店铺时）
    if (value.currency === undefined) {
      // 重新请求地区站点店铺筛选项
      dispatch({
        type: 'storeReport/fetchRegionSiteStore',
        payload: value,
        callback: requestErrorFeedback,
      });
    }
    dispatch({
      type: 'storeReport/fetchList',
      payload: { ...value, ...formValues },
      callback: requestErrorFeedback,
    });
  }

  // 表格参数变化(排序)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleTableChange (_: any, __: any, sorter: any) {
    const { field: sort, order } = sorter;
    dispatch({
      type: 'storeReport/sortList',
      // 不支持取消排序
      payload: { sort, order: order || 'descend' },
    });
  }

  // 日期改变
  function handleDateRangeChange(dates: IChangeDates) {
    const { startDate, endDate, selectedKey } = dates;
    let payload;
    // timeMethod 参数在特定情况下才需要给后端， 不然后端会报错
    if (['WEEK', 'BIWEEKLY', 'MONTH', 'SEASON'].includes(selectedKey.toUpperCase())) {
      payload = {
        startTime: startDate,
        endTime: endDate,
        timeMethod: selectedKey,
      };
    } else {
      payload = {
        startTime: startDate,
        endTime: endDate,
      };
    }
    dispatch({
      type: 'storeReport/fetchList',
      payload,
      callback: requestErrorFeedback,
    });
  }

  // 导出链接
  function getDownloadUrl() {
    const baseUrl = '/api/mws/store-report/export-excel';
    const params = toUrl(pageData.searchParams);
    return `${baseUrl}${params}`;
  }

  // 下载 loading 
  function handleClickDownload() {
    setExportBtnLoading(true);
    setTimeout(() => setExportBtnLoading(false), 2000);
  }

  // 根据自定义列数据获取 Table 的 columns 数据
  const columns = getColumns({
    customCols,
    sort,
    order,
    ratioSwitchChecked,
    dispatch,
    totalRowData,
  });

  const tableConfig = {
    className: styles.Table,
    sticky: true,
    // size: 'middle',
    pageSizeOptions: false,
    loading,
    rowKey: 'storeId',
    dataSource: records,
    locale: { emptyText: '未获取到数据' },
    columns,
    sortDirections: ['descend', 'ascend'] as SortOrder[],
    onChange: handleTableChange,
    showSorterTooltip: false,
    scroll: { x: 'max-content', y: 'calc(100vh - 300px)', scrollToFirstRowOnChange: true },
    pagination: false,
  };

  return (
    <div className={styles.container}>
      <PageTitleRightInfo updateTime={updateTime} />
      <span className={styles.pageTitleAddition}>（所有站点数据直接按照日期统计，不转换时区）</span>
      <div className={styles.toolBar}>
        <Form
          className={styles.Form}
          onValuesChange={handleFormChange}
          form={form} 
          initialValues={{
            currency: 'original',
          }}
        >
          <Item name="region">
            <Select placeholder="全部地区" allowClear className={styles.Select}>
              {
                regionSiteStore.regionList.map(item => (
                  <Option value={item.region} key={item.region}>{item.chinesRegion}</Option>
                ))
              }
            </Select>
          </Item>
          <Item name="marketplace">
            <Select placeholder="全部站点" allowClear className={styles.Select}>
              {
                regionSiteStore.marketplaceList.map(item => (
                  <Option value={item} key={item}>{item}</Option>
                ))
              }
            </Select>
          </Item>
          <Item name="storeName">
            <Select placeholder="全部店铺" allowClear className={styles.storeNameSelect}>
              {
                regionSiteStore.storeNameList.map(item => (
                  <Option value={item} key={item}>{item}</Option>
                ))
              }
            </Select>
          </Item>
          <Item name="currency">
            <Select className={styles.Select}>
              <Option value="original">原币种</Option>
              <Option value="rmb">人民币</Option>
            </Select>
          </Item>
        </Form>
        <div className={styles.toolBarRight}>
          <span className={styles.ratioSwitchContainer}>
            <span>环比：</span>
            <Switch
              className={styles.ratioSwitch}
              checked={ratioSwitchChecked}
              onChange={v => setRatioSwitchChecked(v)}
            />
          </span>
          <BiweeklyRangePicker 
            defaultSelectedKey={'30'}
            localStorageKey={calendarStorageBaseKey}
            onChange={handleDateRangeChange}
            containerClassName={styles.BiweeklyRangePicker}
          />
          <Button loading={exportBtnLoading} disabled>
            <a download href={getDownloadUrl()} onClick={() => handleClickDownload()}>导出</a>
          </Button>
          <CustomCols colsItems={customCols} />
        </div>
      </div>
      <Table {...tableConfig} />
    </div>
  );
};

export default StoreReport;
