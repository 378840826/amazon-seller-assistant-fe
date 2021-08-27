import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import DateRangePicker from '../components/DateRangePicker';
import { Iconfont, requestErrorFeedback, storage } from '@/utils/utils';
import { getRangeDate as getTimezoneDateRange } from '@/utils/huang';
import commonStyles from '../common.less';
import styles from './index.less';

const OperationRecord: React.FC = function() {
  const dispatch = useDispatch();
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    treeSelectedInfo,
    operationRecordTab: {
      list: { records, total },
      searchParams: { current, size, startTime, endTime },
    },
  } = adManage;
  
  const {
    campaignId: treeSelectedCampaignId,
    groupId: treeSelectedGroupId,
  } = treeSelectedInfo;
  // 店铺
  const {
    id: currentShopId,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  const loadingEffect = useSelector((state: IConnectState) => state.loading);
  const loading = loadingEffect.effects['adManage/fetchOperationRecords'];
  const isShowBreadcrumb = treeSelectedInfo.key.split('-').length > 2;

  useEffect(() => {
    if (currentShopId !== '-1') {
      const { start, end } = storage.get('adManageDateRange') || getTimezoneDateRange(7, false);
      dispatch({
        type: 'adManage/fetchOperationRecords',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: {
            current: 1,
            campaignId: treeSelectedCampaignId,
            groupId: treeSelectedGroupId,
            startTime: start,
            endTime: end,
          },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [currentShopId, dispatch, treeSelectedCampaignId, treeSelectedGroupId]);

  // 筛选日期范围
  const handleDateRangeChange = useCallback((rangePickerDates: string[]) => {
    const [startTime, endTime] = rangePickerDates;
    dispatch({
      type: 'adManage/fetchOperationRecords',
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: { current: 1 },
        filtrateParams: { startTime, endTime },
      },
      callback: requestErrorFeedback,
    });
  }, [currentShopId, dispatch]);

  // 全部列
  const columns: ColumnProps<API.IAdOperationRecord>[] = [
    {
      title: <>时间<Iconfont className={commonStyles.iconQuestion} type="icon-yiwen" title="北京时间" /></>,
      dataIndex: 'behaviorDate',
      align: 'center',
      width: 180,
    }, {
      title: '对象类型',
      dataIndex: 'objectType',
      align: 'center',
      width: 130,
    }, {
      title: '对象',
      dataIndex: 'objectInfo',
      width: 500,
      render: value => (
        <div className={commonStyles.breakAll}>{value}</div>
      ),
    }, {
      title: '事项',
      dataIndex: 'behaviorInfo',
      align: 'center',
      width: 80,
    }, {
      title: '原值',
      dataIndex: 'oldValue',
      width: 200,
    }, {
      title: '新值',
      dataIndex: 'newValue',
      width: 200,
    }, {
      title: '操作人',
      dataIndex: 'behaviorExecutor',
      width: 200,
    },
  ];

  // 分页器配置
  const paginationProps = {
    current,
    pageSize: size,
    total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => (<>共 {total} 条</>),
    onChange: (current: number, pageSize: number | undefined) => {
      dispatch({
        type: 'adManage/fetchOperationRecords',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: {
            current,
            pageSize,
          },
        },
        callback: requestErrorFeedback,
      });
    },
  };

  return (
    <div className={styles.page}>
      <div className={styles.tableToolBar}>
        <DateRangePicker
          startDate={startTime}
          endDate={endTime}
          callback={handleDateRangeChange}
        />
      </div>
      <Table
        rowKey="id"
        className={styles.Table}
        loading={loading}
        dataSource={records}
        columns={columns}
        scroll={{
          x: 'max-content', y: isShowBreadcrumb ? 'calc(100vh - 294px)' : 'calc(100vh - 264px)',
        }}
        pagination={{ ...paginationProps, size: 'default' }}
      />
    </div>
  );
};

export default OperationRecord;
