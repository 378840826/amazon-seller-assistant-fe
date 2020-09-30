import React from 'react';
import { Table } from 'antd';
import { connect } from 'umi';

import { ColumnProps, TablePaginationConfig } from 'antd/es/table';
import { Typography } from 'antd';
import styles from './index.less';
import { IConnectState } from '@/models/connect';
import { IInbox } from '@/pages/mws/Mail/inbox';
import { renderState, renderSendType } from '../TablePage';

const { Paragraph } = Typography;
interface ILeftTableList{
  state: IInbox['state'];
  dispatch: IInbox['dispatch'];
  request: (params: API.IParams) => void;
}
const LeftTableList: React.FC<ILeftTableList> = ({ state, dispatch, request }) => {

  const { msg, tableInfo, tableLoading, id } = state;
  
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
  const columns: ColumnProps<API.IParams>[] = [{
    width: 124,
    align: 'left',
    render: (text, item) => {
      return (
        <div className={styles.__td_1}>
          <Paragraph ellipsis className={styles.subject}>{item.subject}</Paragraph>
          <Paragraph ellipsis={{ rows: 2 }} className={styles.content}>{item.content}</Paragraph>
        </div>
      );
    },
  }, {
    title: '',
    width: 104,
    align: 'right',
    ellipsis: true,
    render: (text, item) => {
      return (
        <div className={styles.__td_2}>
          <div >
            {renderState(item.status)}
          </div>
          <div>
            { renderSendType(item.sendType) }
          </div>
          
          <div className={styles.date}>{item.sendingTime}</div>
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
        pagination={{ ...paginationProps }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 280px)' }}
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
            }, 
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
