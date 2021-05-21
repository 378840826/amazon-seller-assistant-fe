/**
 *  否定Targeting（否定品牌/ASIN，targeting广告组独有）
 */
import React, { useEffect, ReactText, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Button, Modal, Table, Tabs, Input, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
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
    treeSelectedInfo,
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
          searchParams: {
            groupId: treeSelectedInfo.groupId,
            current: 1,
            code: '',
          },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId, treeSelectedInfo.groupId]);

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
            groupId: treeSelectedInfo.groupId,
            neTargetIds: checkedIds,
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
        searchParams: {
          code: value,
          current: 1,
        },
      },
      callback: requestErrorFeedback,
    });
  }

  // 全部表格列
  const columns: ColumnProps<API.IAdNegativeTargeting>[] = [
    {
      title: '否定品牌或ASIN',
      dataIndex: 'neTargetId',
      width: 360,
      render: (_, record) => record.targetText,
    }, {
      title: <>添加时间<Iconfont className={commonStyles.iconQuestion} type="icon-yiwen" title="北京时间" /></>,
      dataIndex: 'addTime',
      key: 'addTime',
      align: 'center',
      width: 220,
    },
  ];

  // 表格参数变化
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleTableChange (pagination: any) {
    const { current, pageSize: size } = pagination;
    dispatch({
      type: 'adManage/fetchNegativeTargetingList',
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: { current, size },
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
    const asinArr = asinInputText.split((/[\n+|\s+|\\,+]/)).filter(Boolean);
    if (!asinArr.length) {
      message.error('请输入ASIN');
      return;
    }
    const notAsin = asinArr.find(asin => asin.length !== 10 || asin[0].toUpperCase() !== 'B');
    if (notAsin) {
      message.error(`ASIN: ${notAsin} 的格式有误，请重新输入`);
      return;
    }
    dispatch({
      type: 'adManage/addNegativeTargeting',
      payload: {
        headersParams: { StoreId: currentShopId },
        groupId: treeSelectedInfo.groupId,
        expressValues: asinArr,
      },
      callback: requestFeedback,
    });
    setVisible(false);
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
        <MySearch placeholder="输入广品牌或ASIN" defaultValue="" handleSearch={handleSearch} />
      </div>
      <div className={styles.tableContainer}>
        <Table
          size="middle"
          showSorterTooltip={false}
          rowSelection={{ ...rowSelection }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 296px)', scrollToFirstRowOnChange: true }}
          loading={loadingTable}
          columns={columns}
          rowKey="neTargetId"
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
              <div style={{ textAlign: 'center', height: 278, paddingTop: 50 }}>
                功能开发中...
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </div>
  );
};

export default NegativeTargeting;
