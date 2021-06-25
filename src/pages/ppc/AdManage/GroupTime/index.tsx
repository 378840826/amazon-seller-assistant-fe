/**
 * 广告组定时设置
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, Link } from 'umi';
import { Spin, DatePicker, Switch, Button } from 'antd';
import moment, { Moment } from 'moment';
import { IConnectState } from '@/models/connect';
import { getPageQuery, Iconfont, requestErrorFeedback, requestFeedback } from '@/utils/utils';
import { getAssignUrl, disabledDate } from '../utils';
import TimeSelectTable, { ITimingInitValueType } from './TimeSelection';
import styles from './index.less';

const { RangePicker } = DatePicker;

const GroupTime: React.FC = function() {
  const dispatch = useDispatch();
  // 店铺
  const {
    id: currentShopId,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  const loadingEffect = useSelector((state: IConnectState) => state.loading);
  const loading = loadingEffect.effects['adManage/fetchGroupTime'];
  const loadingSave = loadingEffect.effects['adManage/updateGroupTime'];
  const {
    groupId, groupName, campaignId, campaignName, campaignType, campaignState,
  } = getPageQuery();
  const [date, setDate] = useState<{
    switch: boolean;
    timezone: string;
    startDate: string;
    endDate: string;
  }>({
    switch: false,
    timezone: '',
    startDate: '',
    endDate: '',
  });
  const [timing, setTiming] = useState<ITimingInitValueType>();
  // 用于 TimeSelectTable 初始化
  const [initTiming, setInitTiming] = useState<ITimingInitValueType>();

  useEffect(() => {
    if (currentShopId !== '-1') {
      dispatch({
        type: 'adManage/fetchGroupTime',
        payload: {
          headersParams: { StoreId: currentShopId },
          groupId,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (code: number, msg: string, data: any) => {
          requestErrorFeedback(code, msg);
          const newDate = {
            switch: data.switch,
            timezone: data.timezone,
            startDate: data.startDate,
            endDate: data.endDate,
          };
          const newTiming = {
            mon: data.mon,
            tues: data.tues,
            wed: data.wed,
            thur: data.thur,
            fri: data.fri,
            sat: data.sat,
            sun: data.sun,
          };
          setDate(newDate);
          setTiming(newTiming);
          setInitTiming(newTiming);
        },
      });
    }
  }, [currentShopId, dispatch, groupId]);

  // 框选时间
  function handleTimeSelect(timing: ITimingInitValueType) {
    setTiming(timing);
  }

  // 保存修改
  function handleSave() {
    dispatch({
      type: 'adManage/updateGroupTime',
      payload: {
        headersParams: { StoreId: currentShopId },
        groupId,
        ...date,
        ...timing,
      },
      callback: (code: number, msg: string) => {
        requestFeedback(code, msg);
        if (code === 200) {
          setTimeout(() => {
            window.location.replace(getAssignUrl({
              campaignType: campaignType as API.CamType,
              campaignState: campaignState as API.AdState,
              campaignId: campaignId as string,
              campaignName: campaignName as string,
            }));
          }, 1000);
        }
      },
    });
  }

  // 日期选择配置
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rangePickerConfig: any = {
    dateFormat: 'YYYY-MM-DD',
    allowClear: false,
    value: [date.startDate && moment(date.startDate), date.endDate && moment(date.endDate)],
    disabledDate,
    onChange: (_: Moment, dates: string[]) => {
      const [startDate, endDate] = dates;
      setDate({ ...date, startDate, endDate });
    },
  };

  return (
    <div className={styles.page}>
      <div className={styles.crumbs}>
        <Link to="/ppc/manage?tab=group">广告组</Link>
        <Iconfont type="icon-zhankai" className={styles.separator} />
        <Link to={
          getAssignUrl({
            campaignType: campaignType as API.CamType,
            campaignState: campaignState as API.AdState,
            campaignId: campaignId as string,
            campaignName: campaignName as string,
          })
        }>
          {groupName}
        </Link>
        <Iconfont type="icon-zhankai" className={styles.separator} />
        <span>目标设置</span>
      </div>
      <Spin spinning={loading || loadingSave || false}>
        <div className={styles.tableToolBar}>
          <div className={styles.optionItem}>
            <span>日期范围：</span>
            <span>
              <RangePicker {...rangePickerConfig} />
            </span>
          </div>
          <div className={styles.optionItem}>
            <span>时间：</span>
            <span>
              <Switch
                className={styles.Switch}
                checked={date.switch}
                onChange={v => setDate({ ...date, switch: v })}
              />
            </span>
          </div>
        </div>
        <div className={styles.timeSelectContainer}>
          <TimeSelectTable
            initValues={initTiming}
            onSelect={handleTimeSelect}
          />
        </div>
        <div className={styles.btns}>
          <Button>
            <Link to={
              getAssignUrl({
                campaignType: campaignType as API.CamType,
                campaignState: campaignState as API.AdState,
                campaignId: campaignId as string,
                campaignName: campaignName as string,
              })
            }>
              取消
            </Link>
          </Button>
          <Button type="primary" loading={loadingSave} onClick={handleSave}>保存</Button>
        </div>
      </Spin>
    </div>
  );
};

export default GroupTime;
