/**
 *  否定Targeting（否定品牌/ASIN）
 */
import React, { useEffect, ReactText, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Button, Modal, Table, Tabs, Input, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import { defaultFiltrateParams } from '@/models/adManage';
import { Iconfont, requestErrorFeedback, requestFeedback } from '@/utils/utils';
import MySearch from '../components/Search';
import TableNotData from '@/components/TableNotData';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import commonStyles from '../common.less';
import styles from './index.less';

const { TabPane } = Tabs;
const { TextArea } = Input;

const NegativeTargeting: React.FC = function() {
  const dispatch = useDispatch();
  // 店铺 id
  const {
    id: currentShopId,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  // loading
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loadingTable = loadingEffect['adManage/fetchNegativeTargetingList'];
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const {
    negativeTargetingTab: { list, searchParams, checkedIds },
  } = adManage;
  const { total, records } = list;
  const { current, size } = searchParams;
  // 添加否定 targeting
  const [visible, setVisible] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>('asin');
  const [asinInputText, setAsinInputText] = useState<string>('');

  useEffect(() => {
    if (currentShopId !== '-1') {
      // 列表
      dispatch({
        type: 'adManage/fetchNegativeTargetingList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: { current: 1 },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId]);

  // 批量归档
  function handleBatchArchive() {
    Modal.confirm({
      content: (
        <>
          <ExclamationCircleOutlined className={commonStyles.warnIcon} />归档后不可重新开启，确认归档吗？
        </>
      ),
      icon: null,
      className: commonStyles.modalConfirm,
      maskClosable: true,
      centered: true,
      onOk() {
        dispatch({
          type: 'adManage/batchNegativeTargetingArchive',
          payload: {
            headersParams: { StoreId: currentShopId },
            ids: checkedIds,
          },
          callback: requestFeedback,
        });
      },
    });
  }

  // 执行搜索
  function handleSearch(value: string) {
    dispatch({
      type: 'adManage/fetchNegativeTargetingList',
      payload: {
        headersParams: { StoreId: currentShopId },
        filtrateParams: {
          // 重置筛选参数
          ...defaultFiltrateParams,
          search: value,
        },
      },
      callback: requestErrorFeedback,
    });
  }

  // 全部表格列
  const columns: ColumnProps<API.IAdNegativeTarget>[] = [
    {
      title: '否定品牌或ASIN',
      dataIndex: 'targeting',
      key: 'targeting',
      width: 360,
    }, {
      title: <>添加时间<Iconfont className={commonStyles.iconQuestion} type="icon-yiwen" title="北京时间" /></>,
      dataIndex: 'addTime',
      key: 'addTime',
      align: 'center',
      width: 220,
    },
  ];

  // 表格参数变化（翻页和排序变化）
  // eslint-disable-next-line max-params
  function handleTableChange (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pagination: any, __: any, sorter: any, action: any) {
    const { current, pageSize: size } = pagination;
    const { field: sort, order } = sorter;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let params: { [key: string]: any } = {};
    const actionType = action.action;
    if (actionType === 'paginate') {
      // 由翻页触发的, 只传分页参数，model 中会获取旧的排序参数
      params = { current, size };
    } else if (actionType === 'sort') {
      // 由排序触发的， 重置页码为 1
      params = { current: 1, size, sort, order };
    }
    dispatch({
      type: 'adManage/fetchNegativeTargetingList',
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: params,
      },
      callback: requestErrorFeedback,
    });
  }

  // asin 输入框输入
  function handleTextAreaChange(event: { target: { value: string } }) {
    const { target: { value } } = event;
    setAsinInputText(value);
  }

  // 勾选配置
  const rowSelection = {
    fixed: true,
    selectedRowKeys: checkedIds,
    columnWidth: 36,
    onChange: (selectedRowKeys: ReactText[]) => {
      dispatch({
        type: 'adManage/updateNegativeTargetingChecked',
        payload: selectedRowKeys,
      });
    },
  };

  // 添加 asin
  function handleAddAsin() {
    const asin = asinInputText.replace(/(^\s*)|(\s*$)/g, '');
    if (asin === '') {
      message.error('请输入ASIN');
      return;
    }
    dispatch({
      type: 'adManage/addNegativeTargeting',
      payload: {
        headersParams: { StoreId: currentShopId },
        asin,
      },
      callback: requestFeedback,
    });
  }

  // 分页器配置
  const paginationProps = {
    current,
    pageSize: size,
    total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => (<>共 {total} 个</>),
  };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <Button type="primary" onClick={() => setVisible(true)}>
          添加否定Targeting
        </Button>
        <Button disabled={!checkedIds.length} onClick={() => handleBatchArchive()}>归档</Button>
        <MySearch placeholder="输入广告活动、广告组、ASIN/SKU或关键词" defaultValue="" handleSearch={handleSearch} />
      </div>
      <div className={styles.tableContainer}>
        <Table
          size="middle"
          showSorterTooltip={false}
          rowSelection={{ ...rowSelection }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 266px)', scrollToFirstRowOnChange: true }}
          loading={loadingTable}
          columns={columns}
          rowKey="id"
          dataSource={records}
          locale={{ emptyText: <TableNotData style={{ padding: 50 }} hint="没有找到相关数据" /> }}
          pagination={{ ...paginationProps, size: 'default' }}
          onChange={handleTableChange}
        />
      </div>
      <Modal
        visible={visible}
        width={700}
        keyboard={false}
        footer={false}
        className={styles.Modal}
        onCancel={() => setVisible(false)}
      >
        <div className={styles.modalTitle}>添加否定Targeting</div>
        <div className={styles.modalContent}>
          <Tabs
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key)}
          >
            <TabPane tab="ASIN" key="asin">
              <TextArea
                autoSize={{ minRows: 10, maxRows: 10 }}
                placeholder="请输入ASIN，一行一个"
                onChange={handleTextAreaChange}
                value={asinInputText}
              />
              <div className={styles.asinAddButton}>
                <Button type="primary" onClick={handleAddAsin}>添加</Button>
              </div>
            </TabPane>
            <TabPane tab="品牌" key="brand">
              Content of Tab Pane 2
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </div>
  );
};

export default NegativeTargeting;
