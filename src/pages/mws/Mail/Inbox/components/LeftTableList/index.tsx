import React, { ReactText } from 'react';
import { Table } from 'antd';
import { connect } from 'umi';

import { ColumnProps, TablePaginationConfig } from 'antd/es/table';
import { Typography, message } from 'antd';
import CountDown from '../Countdown';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import styles from './index.less';
import { IConnectState } from '@/models/connect';
import { IInbox } from '@/pages/mws/Mail/inbox';

const { Paragraph } = Typography;
interface ILeftTableList {
  state: IInbox['state'];
  StoreId: IInbox['StoreId'];
  dispatch: IInbox['dispatch'];
  request: (params: API.IParams) => void;
}
const LeftTableList: React.FC<ILeftTableList> = ({ state, StoreId, dispatch, request }) => {

  const { msg, tableInfo, tableLoading, rowSelection, id } = state;
  const rowLeftSelection = {
    selectedRowKeys: rowSelection,
    columnWidth: 25,
    onChange: (selectedRowKeys: ReactText[]) => {
      dispatch({
        type: 'mail/modifyInboxRowSelection',
        payload: selectedRowKeys,
      });
    },
  };
  const paginationProps: TablePaginationConfig = {
    size: 'small',
    current: tableInfo.current,
    total: tableInfo.total,
    showSizeChanger: false,
    defaultPageSize: tableInfo.size,
    showLessItems: true,
  };
  const onTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    request({
      current,
      size: pageSize,
    });
  };

  const updateReplay = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: API.IParams) => {
    e.stopPropagation();
    dispatch({
      type: 'mail/updateStatus',
      payload: {
        data: {
          headerParams: { StoreId },
          ids: [item.id],
          status: item.hasReplied ? 'replied-false' : 'replied-true',
        },
      },
      callback: (msg: string) => {
        message.success(msg);
      },
    });
  };
  const columns: ColumnProps<API.IParams>[] = [{
    title: () => (<span className={styles.select_all}>全选</span>),
    width: 124,
    align: 'left',
    render: (text, item) => {
      return (
        <div>
          <Paragraph ellipsis className={styles.subject}>{item.subject}</Paragraph>
          <Paragraph ellipsis={{ rows: 2 }} className={styles.content}>{item.content}</Paragraph>
        </div>
      );
    },
  }, {
    title: '',
    width: 100,
    align: 'right',
    ellipsis: true,
    render: (text, item) => {
      return (
        <div style={{ paddingRight: '5px' }}>
          {
            item.hasReplied ? 
              <div className={classnames(styles.orange, styles.before_hover)}>已回复</div> 
              : 
              <div className={styles.before_hover}>未回复</div>}
          {item.hasReplied ? 
            <div className={styles.after_hover} 
              onClick={(e) => updateReplay(e, item)}>
              <Iconfont className={styles.icon_no} type="icon-message"/>
              <div>标志未回复</div>
            </div> 
            :
            <div className={styles.after_hover} 
              onClick={(e) => updateReplay(e, item)}>
              <Iconfont className={styles.icon_has} type="icon-message1"/>
              <div>标志已回复</div>
            </div> 
          }
          <div className={styles.count}>
            <div>剩余</div>
            <CountDown className={styles.countDown} time={item.countDown} timeKey={item.key}/>
          </div>
          <div className={styles.date}>{item.receivingTime}</div>
        </div>
      );
    },
  }];
  return (
    <div>
      <Table
        rowKey="id"
        className={styles.__table}
        columns={columns}
        rowSelection={{
          type: 'checkbox',
          ...rowLeftSelection,
        }}
        pagination={{ ...paginationProps }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 325px)' }}
        onChange={onTableChange}
        dataSource={tableInfo.records}
        loading={tableLoading}
        locale={{ emptyText: msg === '' ? 'Oops! 没有更多数据啦' : msg }}
        rowClassName={(item) => {
          if (item.id === id ) {
            return styles.row_clicked;
          }
        }}
        onRow={record => {
          return {
            onClick: event => {
              event.stopPropagation();
              if (record.id !== id){
                dispatch({
                  type: 'mail/modifyInboxId',
                  payload: record.id,
                });
              }

            }, // 点击行
          };
        }}
      />
    </div>
  );
};
export default connect(({ global, mail }: IConnectState) => ({
  StoreId: global.shop.current.id,
  state: mail.inbox,
}))( LeftTableList);
