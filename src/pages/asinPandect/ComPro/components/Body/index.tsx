import React from 'react';
import { Table, Switch, message } from 'antd';
import { connect } from 'umi';
import { ReactText } from 'react';
import styles from './index.less';
import UpAndDown from '@/components/UpAndDown';
import ColumnInfo from '../columnMonitorInfo';
import ShowData from '@/components/ShowData';
import EchartsInfo from '../echartsInfo';
import { toThousands } from '@/utils/utils';
import ACKeyword from '../ACKeyword';
import TableNotData from '@/components/TableNotData';
import { ColumnProps } from 'antd/es/table';
import RCKeyword from '../rcKeyword';
import { IConnectState, IConnectProps } from '@/models/connect';

interface IBody extends IConnectProps{
  StoreId: string;
  myData: API.IParams;
  page: API.IParams;
  tableLoading: boolean;
  customSelected: Array<string>;
  selectedRows: ReactText[];
  errMsg: string;
  onChangeSwitch: (param: API.IParams) => void;
}
const NoData = () => {
  return (<div className={styles.__no_data}>没找到相关数据！</div>);
};
const Body: React.FC<IBody> = ({
  StoreId,
  myData,
  page,
  onChangeSwitch,
  tableLoading,
  customSelected,
  selectedRows,
  dispatch,
  errMsg,
}) => {
  const { pullTime = '', lastPullTime = '' } = myData;
  const { 
    current = 1,
    size = 20,
    total = 0,
    order = '', 
    asc = '', 
    records = [], 
  } = page;

  const onSwitchChange = (checked: boolean, id: number) => {
    dispatch({
      type: 'comPro/updateStatus',
      payload: {
        data: {
          headersParams: { StoreId },
          id,
          status: checked,
        },
      },
      callback: (res: {code: number; message: string}) => {
        if (res.code === 200){
          const newRecord = records.slice(0);
          const index = newRecord.findIndex((item: API.IParams) => item.id === id);
          newRecord[index].monitoringSwitch = checked;
          onChangeSwitch({ page: { ...page, records: newRecord } });
        } else {
          message.error(res.message);
        }
      },
    });
    
  };

  //表格复选框
  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (value: ReactText[]) => {
      dispatch({
        type: 'comPro/updateRows',
        payload: value,
      });
    },
  };
  //共同的
  const columnsCommon: ColumnProps<API.IParams>[] = [
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
      width: 83,
      render: text => <span>{text}</span>,
    },
    {
      title: () => (
        <div>
          <div>当前排位</div>
          <div className={styles.color888}>({pullTime ? pullTime : <div className="null_bar"></div>})</div>
        </div>
      ),
      width: 93,
      align: 'center',
      key: 'currentRanking',
      dataIndex: 'currentRanking',
      render: text => <UpAndDown value={text}/>,
    },
    {
      title: () => (
        <div>
          <div>上期排位</div>
          <div className={styles.color888}>({lastPullTime ? lastPullTime : <div className="null_bar"></div>})</div>
        </div>
      ),
      align: 'center',
      width: 94,
      dataIndex: 'lastRanking',
      key: 'lastRanking',
      render: text => <UpAndDown value={text}/>,
    },
    {
      title: '监控次数',
      align: 'center',
      width: 57,
      dataIndex: 'monitoringNumber',
      key: 'monitoringNumber',
      render: text => <span><ShowData fillNumber={0} value={text}/></span>,
    },
    {
      title: '商品信息',
      align: 'center',
      key: 'productInfo',
      width: 302,
      render: (record) => <ColumnInfo item={record}/>,
    },
    {
      title: '品牌',
      width: 124,
      align: 'left',
      dataIndex: 'brandName',
      key: 'brandName',
      render: (text) => text === '' ? <div className="null_bar"></div> : <span>{text}</span>,
    },
    {
      title: '卖家',
      width: 128,
      align: 'left',
      dataIndex: 'sellerName',
      key: 'sellerName',
      render: (text) => text === '' ? <div className="null_bar"></div> : <span>{text}</span>,
    },
    {
      title: '价格',
      className: styles.__price,
      align: 'right',
      key: 'price',
      sorter: true,
      width: 101,
      sortOrder: order === 'price' ? asc : null,
      render: (record) => {
        return (
          <div className={styles.price_container}>
            <div className={styles.left}>
              <div><ShowData value={record.price} isCurrency/></div>
              <UpAndDown value={record.priceChange} isAdd/>
            </div>  
            <div className={styles.right}>
              <EchartsInfo id={record.id} category="price"/>
            </div>
          </div>
        );
      },
    },
    {
      title: '排名',
      className: styles.__rank,
      key: 'ranking',
      sorter: true,
      align: 'left',
      width: 228,
      sortOrder: order === 'ranking' ? asc : null,
      render: (record) => {
        return (
          <div className={styles.rank_container}>
            <div className={styles.first_floor}>
              {record.ranking === '' ? 
                <div className="null_bar"></div> : 
                <span className={styles.orange}>#{toThousands(record.ranking)}</span>}
              {record.categoryName === '' ?
                <div className="null_bar"></div> :
                <span className={styles.text}>{record.categoryName}</span>
              }
            </div>
            <div className={styles.second_floor}>
              <UpAndDown value={record.rankingChange} isAdd inline/>
              <span className={styles.change}>
                <EchartsInfo id={record.id} category="ranking"/>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: '评分',
      key: 'reviewAvgStar',
      align: 'right',
      sorter: true,
      width: 66,
      sortOrder: order === 'reviewAvgStar' ? asc : null,
      render: (record) => {
        return (
          <div className={styles.price_container}>
            <div className={styles.left}>
              {record.reviewAvgStar === '' ? <div><div className="null_bar"></div> </div>
                : <div>{record.reviewAvgStar}</div>}
              <UpAndDown value={record.priceChange} isAdd/>
            </div>  
            <div className={styles.right}>
              <div>&nbsp;</div>
              <EchartsInfo id={record.id} category="score"/>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Review',
      key: 'reviewCount',
      align: 'right',
      sorter: true,
      width: 86,
      sortOrder: order === 'reviewCount' ? asc : null,
      render: (record) => {
        return (
          <div className={styles.price_container}>
            <div className={styles.left}>
              <div><ShowData fillNumber={0} value={record.reviewCount} /></div>
              <UpAndDown value={record.reviewCountChange} isAdd/>
            </div>  
            <div className={styles.right}>
              <div>&nbsp;</div>
              <EchartsInfo id={record.id} category="count"/>
            </div>
          </div>
        );
      },
    },
    {
      title: '卖家数',
      dataIndex: 'usedNewSellNum',
      key: 'usedNewSellNum',
      align: 'center',
      sorter: true,
      width: 70,
      sortOrder: order === 'usedNewSellNum' ? asc : null,
      render: (text) => <ShowData fillNumber={0} value={text} />,
    },
    {
      title: '变体数',
      dataIndex: 'variantNum',
      key: 'variantNum',
      align: 'center',
      sorter: true,
      width: 59,
      sortOrder: order === 'variantNum' ? asc : null,
      render: (text) => <ShowData fillNumber={0} value={text}/>,
    },
    {
      title: '上架时间',
      dataIndex: 'dateFirstListed',
      key: 'dateFirstListed',
      align: 'center',
      sorter: true,
      width: 94,
      sortOrder: order === 'dateFirstListed' ? asc : null,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Amazon's Choice关键词",
      key: 'acKeyword',
      dataIndex: 'acKeyword',
      align: 'center',
      width: 152,
      render: (text, record) => <ACKeyword value={text} id={record.id}/>,
    },
    {
      title: '相关关键词',
      key: 'relatedKeywords',
      dataIndex: 'relatedKeywords',
      align: 'left',
      width: 152,
      render: (text) => <RCKeyword text={text}/>,
      // render: (text) => <span>{text}</span>,
    },
  ];
 
  //自定义列表全部的
  const columnsAll: ColumnProps<API.IParams>[] = [
    {
      title: '监控开关',
      width: 62,
      align: 'center',
      dataIndex: 'monitoringSwitch',
      key: 'monitoringSwitch',
      render: (status, record) => <div>
        <Switch 
          className={styles.__switch} 
          checked={status}
          onChange={(checked: boolean) => onSwitchChange(checked, record.id)}
        />
      </div>,
    },
    ...columnsCommon,
  ];
  const dataSourceMy = Object.keys(myData).length ? [myData] : [];

  //自定义显示
  const displayCols: ColumnProps<API.IParams>[] = [];
  const displayMy: ColumnProps<API.IParams>[] = [{
    title: '',
    key: 'my',
    width: customSelected.includes('monitoringSwitch') ? 117 : 56,
    align: 'center',
    className: styles.column_my,
    render: () => <div className={styles.myOwn}>本商品</div>,
  }];
  columnsAll.map( (item) => {
    customSelected.includes(item.key as string) ? displayCols.push(item) : '';
  });

  //
  columnsCommon.map((item) => {
    customSelected.includes(item.key as string) ? displayMy.push(item) : '';
  });

  //表格点击
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTableChange = (pagination: any, _: any, sorter: any) => {
    const { current, pageSize } = pagination;
    const { columnKey, order } = sorter;
    dispatch({
      type: 'comPro/updateSend',
      payload: {
        query: { 
          current,
          size: pageSize, 
          order: order ? columnKey : '', 
          asc: order },
      },
    });
  };

  const paginationProps = {
    current,
    pageSize: size,
    total,
    defaultPageSize: 20,
    showSizeChanger: true,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => `共${total}个`,
  };
  return (
    <div className={styles.table_container}>
      <Table 
        rowKey="id"
        showHeader={false}
        className={styles.__table_my}
        scroll={{ x: 1969, scrollToFirstRowOnChange: true }}
        columns={displayMy} 
        dataSource={dataSourceMy}
        pagination={false}
        loading={tableLoading}
        locale={{ emptyText: <NoData/> }}
      />
      <Table
        className={styles.__table_all}
        scroll = {records.length > 0 ? { x: 1969, y: 'calc(100vh - 389px)' } : { x: 1969 }}
        rowKey="id"
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        sortDirections={['descend', 'ascend']}
        columns={displayCols} 
        dataSource={records}
        loading={tableLoading}
        onChange={onTableChange}
        pagination={{ ...paginationProps }}
        locale={{ emptyText: errMsg === '' ? 
          <TableNotData hint="没找到相关数据"/> : 
          <TableNotData hint={errMsg}/> }}
        rowClassName={(_, index) => {
          if (index % 2 === 1) {
            return styles.darkRow;
          }
        }}
      />
    </div>
  );
};
export default connect(({ global, comPro }: IConnectState) => ({
  StoreId: global.shop.current.id,
  customSelected: comPro.customSelected,
  selectedRows: comPro.selectedRows,
}))(Body);
