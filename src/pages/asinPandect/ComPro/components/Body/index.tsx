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
import classnames from 'classnames';
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
  const { 
    pullTime = '', 
    lastPullTime = '', 
    id: myOwnId = '',
    updateTime = '',
    currentRanking = '',
    lastRanking = '',
    monitoringNumber = '',
    image = '',
    title = '',
    titleLink = '',
    asin = '',
    deliveryMethod = '',
    brandName = '',
    sellerName = '',
    price = '',
    ranking = '',
    categoryName = '',
    rankingChange = '',
    reviewAvgStar = '',
    priceChange = '',
    reviewCount = '',
    reviewCountChange = '',
    usedNewSellNum = '',
    variantNum = '',
    dateFirstListed = '',
    acKeyword = '',
    relatedKeywords = '',
    rise = '',
    
  } = myData;
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
  const commonObj = {
    monitoringSwitch: {
      title: '本商品',
      children: [{
        title: '监控开关',
        width: 62,
        align: 'center',
        dataIndex: 'monitoringSwitch',
        key: 'monitoringSwitch',
        render: (status: boolean, record: API.IParams) => {
          if (myOwnId === record.id){
            return (<div className={styles.__switch_own}>本商品</div>);
          }
          return (
            <div>
              <Switch 
                className={styles.__switch} 
                checked={status}
                onChange={(checked: boolean) => onSwitchChange(checked, record.id)}
              />
            </div>
          );
        },
      }],
    },
    updateTime: {
      title: () => <div>{updateTime}</div>,
      children: [{
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        align: 'center',
        width: 83,
        render: (text: string) => <span>{text}</span>,
      }],
    },
    'currentRanking': {
      title: () => rise === '' ? <ShowData value={currentRanking} fillNumber={0}/> :
        <UpAndDown value={rise ? currentRanking : -currentRanking}/>,
      children: [
        {
          title: () => (
            <div>
              <div>当前排位</div>
              <div className={styles.color888}>({pullTime ? pullTime : <div className="null_bar"></div>})</div>
            </div>
          ),
          align: 'center',
          key: 'currentRanking',
          dataIndex: 'currentRanking',
          width: 93,
          render: (text: number, record: API.IParams) => 
            record.rise === '' ? <ShowData value={text} fillNumber={0}/> :
              <UpAndDown value={record.rise ? text : -text}/>,
        },
      ],
    },
    'lastRanking': {
      title: () => <ShowData fillNumber={0} value={lastRanking}/>,
      children: [{
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
        render: (text: number, record: API.IParams) => 
          <ShowData fillNumber={0} value={record.lastRanking}/>,
      }],
    },
    'monitoringNumber': {
      title: () => <ShowData fillNumber={0} value={monitoringNumber}/>,
      children: [{
        title: '监控次数',
        align: 'center',
        width: 57,
        dataIndex: 'monitoringNumber',
        key: 'monitoringNumber',
        render: (text: number) => <span><ShowData fillNumber={0} value={text}/></span>,
      }],
    },
    'productInfo': {
      title: () => <ColumnInfo item={{
        image: image,
        title: title,
        titleLink: titleLink,
        asin: asin,
        deliveryMethod: deliveryMethod,
      }}/>,
      children: [{
        title: '商品信息',
        align: 'center',
        key: 'productInfo',
        width: 302,
        render: (record: API.IParams) => <ColumnInfo item={record}/>,
      }],
    },
    'brandName': {
      title: () => {
        if (brandName === ''){
          return (
            <div className={classnames(styles.__text_left, styles.__brand)}>
              <div className="null_bar"></div>
            </div>
          );
        }
        return (
          <div className={classnames(styles.__text_left, styles.__brand)}>
            <span>{brandName}</span>
          </div>
        );
      },
      children: [{
        title: '品牌',
        width: 124,
        className: styles.__brand,
        align: 'left',
        dataIndex: 'brandName',
        key: 'brandName',
        render: (text: string) => text === '' ? <div className="null_bar"></div> : <span>{text}</span>,
      }],
    },
    'sellerName': {
      title: () => {
        if (sellerName === '' ){
          return (
            <div className={styles.__text_left}>
              <div className="null_bar"></div>
            </div>
          );
        }
        return (
          <div className={styles.__text_left}>
            <span>{sellerName}</span>
          </div>
        );
      },
      children: [{
        title: '卖家',
        width: 128,
        align: 'left',
        dataIndex: 'sellerName',
        key: 'sellerName',
        render: (text: string) => text === '' ? <div className="null_bar"></div> : <span>{text}</span>,
      }],
    },
    'price': {
      title: () => {
        return (
          <div className={classnames(styles.price_container, styles.__price)}>
            <div className={styles.left}>
              <div><ShowData value={price} isCurrency/></div>
              <UpAndDown value={priceChange} isAdd/>
            </div>  
            <div className={styles.right}>
              <div>&nbsp;</div>
              <EchartsInfo id={myOwnId} category="price"/>
            </div>
          </div>
        );
      },
      children: [{
        title: '价格',
        className: styles.__price,
        align: 'right',
        key: 'price',
        sorter: true,
        width: 101,
        sortOrder: order === 'price' ? asc : null,
        render: (record: API.IParams) => {
          return (
            <div className={styles.price_container}>
              <div className={styles.left}>
                <div><ShowData value={record.price} isCurrency/></div>
                <UpAndDown value={record.priceChange} isAdd/>
              </div>  
              <div className={styles.right}>
                <div>&nbsp;</div>
                <EchartsInfo id={record.id} category="price"/>
              </div>
            </div>
          );
        },
      }],

    },
    'ranking': {
      title: () => {
        return (
          <div className={styles.__rank}>
            <div className={styles.rank_container}>
              <div className={styles.first_floor}>
                {ranking === '' ? 
                  <div className="null_bar"></div> : 
                  <span className={styles.orange}>#{toThousands(ranking)}</span>}
                {categoryName === '' ?
                  <div className="null_bar"></div> :
                  <span className={styles.text}>{categoryName}</span>
                }
              </div>
              <div className={styles.second_floor}>
                <UpAndDown value={rankingChange} isAdd inline/>
                <span className={styles.change}>
                  <EchartsInfo id={myOwnId} category="ranking"/>
                </span>
              </div>
            </div>
          </div>
        );
      },
      children: [{
        title: '排名',
        className: styles.__rank,
        key: 'ranking',
        sorter: true,
        align: 'left',
        width: 328,
        sortOrder: order === 'ranking' ? asc : null,
        render: (record: API.IParams) => {
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
      }],
    },
    'reviewAvgStar': {
      title: () => {
        return (
          <div className={styles.price_container}>
            <div className={styles.left}>
              {reviewAvgStar === '' ? <div><div className="null_bar"></div> </div>
                : <div>{reviewAvgStar}</div>}
              <UpAndDown value={priceChange} isAdd/>
            </div>  
            <div className={styles.right}>
              <div>&nbsp;</div>
              <EchartsInfo id={myOwnId} category="score"/>
            </div>
          </div>
        );
      },
      children: [{
        title: '评分',
        key: 'reviewAvgStar',
        align: 'right',
        sorter: true,
        width: 66,
        sortOrder: order === 'reviewAvgStar' ? asc : null,
        render: (record: API.IParams) => {
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
      }],
    },
    'reviewCount': {
      title: () => {
        return (
          <div className={styles.price_container}>
            <div className={styles.left}>
              <div><ShowData fillNumber={0} value={reviewCount} /></div>
              <UpAndDown value={reviewCountChange} isAdd/>
            </div>  
            <div className={styles.right}>
              <div>&nbsp;</div>
              <EchartsInfo id={myOwnId} category="count"/>
            </div>
          </div>
        );
      },
      children: [{
        title: 'Review',
        key: 'reviewCount',
        align: 'right',
        sorter: true,
        width: 86,
        sortOrder: order === 'reviewCount' ? asc : null,
        render: (record: API.IParams) => {
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
      }],
    },
    'usedNewSellNum': {
      title: () => <ShowData fillNumber={0} value={usedNewSellNum} />,
      children: [{
        title: '卖家数',
        dataIndex: 'usedNewSellNum',
        key: 'usedNewSellNum',
        align: 'center',
        sorter: true,
        width: 70,
        sortOrder: order === 'usedNewSellNum' ? asc : null,
        render: (text: number) => <ShowData fillNumber={0} value={text} />,
      }],
    },
    'variantNum': {
      title: () => <ShowData fillNumber={0} value={variantNum}/>,
      children: [{
        title: '变体数',
        dataIndex: 'variantNum',
        key: 'variantNum',
        align: 'center',
        sorter: true,
        width: 59,
        sortOrder: order === 'variantNum' ? asc : null,
        render: (text: number) => <ShowData fillNumber={0} value={text}/>,
      }],
    },
    'dateFirstListed': {
      title: () => dateFirstListed ? <span>{dateFirstListed}</span> : <div className="null_bar"></div>,
      children: [{
        title: '上架时间',
        dataIndex: 'dateFirstListed',
        key: 'dateFirstListed',
        align: 'center',
        sorter: true,
        width: 94,
        sortOrder: order === 'dateFirstListed' ? asc : null,
        render: (text: number) => <span>{text}</span>,
      }],
    },
    'acKeyword': {
      title: () => <ACKeyword value={acKeyword} id={myOwnId}/>,
      children: [{
        title: "Amazon's Choice关键词",
        key: 'acKeyword',
        dataIndex: 'acKeyword',
        align: 'center',
        width: 152,
        render: (text: string, record: API.IParams) => <ACKeyword value={text} id={record.id}/>,
      }],
    },
    'relatedKeywords': {
      title: () => <div style={{ textAlign: 'left' }}>
        <RCKeyword text={relatedKeywords}/></div>,
      children: [{
        title: '相关关键词',
        key: 'relatedKeywords',
        dataIndex: 'relatedKeywords',
        align: 'left',
        width: 192,
        render: (text: string) => <RCKeyword text={text}/>,
      }],
    },
  };
 

  //自定义显示
  const displayCols: ColumnProps<API.IParams>[] = [];
  
  Object.keys(commonObj).map(item => {
    customSelected.includes(item) ? displayCols.push(commonObj[item]) : '';
  });

  //表格点击
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTableChange = (pagination: any, _: any, sorter: any) => {
    const { current, pageSize } = pagination;
    const { columnKey, order } = sorter;
    dispatch({
      type: 'comPro/updateSend',
      payload: {
        current,
        size: pageSize,
        order: order ? columnKey : '', 
        asc: order,
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
        className={styles.__table_all}
        scroll = {records.length > 0 ? { x: 2109, y: 'calc(100vh - 389px)' } : { x: 1969 }}
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
        rowClassName={(a, index) => {
          if (a.id === myOwnId){ 
            return styles.__myOwn 
            ; 
          }
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
