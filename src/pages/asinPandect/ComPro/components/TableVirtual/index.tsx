import React from 'react';
import { connect } from 'umi';
import { Column, Table as RTable } from 'react-virtualized';
import ProductInfo from '../ProductInfo';
import { IConnectState, IConnectProps } from '@/models/connect';
import 'react-virtualized/styles.css';
import styles from './index.less';
interface ITableVirtual extends IConnectProps{
    typeDelete?: boolean;
    filterData: ISingleItem[];
    selectedData: ISingleItem[];
    errorMsg: string;
}
interface ISingleItem{
    image: string;
    title: string;
    titleLink: string;
    asin: string;
    price: string;
    reviewAvgStar: string;
    reviewCount: string;
    ranking: string;
  }
  // interface IGetHeight {
  //   dataLength: number;
  //   headerHeight: number;
  //   rowHeight: number;
  //   maxHeight: number;
  // }
const getHeight = ({ dataLength = 0, 
  headerHeight = 0, 
  rowHeight = 0,
  maxHeight = 0 }) => {
  if (dataLength > 0){
    const height = headerHeight + rowHeight * dataLength;
    if (height > maxHeight) {
      return maxHeight;
    }
    return height;
    
  }
  return headerHeight * 2;
  
};
const TableVirtual: React.FC<ITableVirtual> = ({
  typeDelete = false,
  filterData,
  selectedData,
  errorMsg,
  dispatch,
}) => {
  //选中单选
  const onSelectList = (data?: ISingleItem) => {
    const list = data ? selectedData.concat(data) : filterData;
    dispatch({
      type: 'comPro/updateSelected',
      payload: list,
    });
  };

  //删除单个的
  const onRemove = (data: ISingleItem) => {
    const selected = selectedData.filter(item => item.asin !== data.asin);
    dispatch({
      type: 'comPro/updateSelected',
      payload: selected,
    });
  };

  const tableConfig = typeDelete ? {
    height: getHeight({
      dataLength: selectedData.length,
      headerHeight: 44,
      rowHeight: 46,
      maxHeight: 257 }),
    rowCount: selectedData.length,
    rowGetter: ({ index }: {index: number}) => selectedData[index],
  } : {
    height: getHeight({
      dataLength: filterData.length,
      headerHeight: 44,
      rowHeight: 46,
      maxHeight: 257 }),
    rowCount: filterData.length,
    rowGetter: ({ index }: {index: number}) => filterData[index],
  };

  //商品信息cellRenderer
  const goodsCellRender = ({ rowData }: API.IParams) => {
    return (
      <ProductInfo item={rowData} className={styles.__product_info}/>
    );
  };
      
  const rankCellRender = ({ rowData }: API.IParams) => {
    const { ranking } = rowData;
    return (
      ranking === '' ?
        <div className="null_bar"></div>
        :
        <span>{ranking}</span>
    );
  };

  //rowCount为0时候的显示
  const noRowsRenderer = () => {
    return (
      <div className={styles.__no_data}>
        {errorMsg === '' ? 'Oops! 没有找到相关的信息' : errorMsg}
      </div>
    );
  };

  const operatorCellRender = ({ rowData }: API.IParams) => {
    if (typeDelete){
      return (
        <span 
          onClick={() => onRemove(rowData)}
          className={styles.remove_button}>删除</span>
      );
    }
    return (
      selectedData.filter((item) => item.asin === rowData.asin).length > 0 ? 
        <span className={styles.select_already}>已选</span>
        :
        <span className={styles.select_yes} onClick={() => onSelectList(rowData)}>选择</span>
    );
  };
  return (
    <RTable
      {...tableConfig}
      width={501}
      headerHeight={44}
      rowHeight={46}
      className={styles.__virtual_table}
      noRowsRenderer={noRowsRenderer}
      rowClassName={( { index }: {index: number}) => index % 2 === 1 ? 'darkRow' : '' }
    >
      <Column 
        label="商品信息"
        width={301}
        headerClassName={styles.__goods_column}
        className={styles.__goods_body}
        cellRenderer={goodsCellRender}
        dataKey="asin"
      />
      <Column  
        label="排名"
        width={130}
        headerClassName={styles.__sku_column}
        className={styles.__sku_body}
        cellRenderer={rankCellRender}
        dataKey="asin"/>
      <Column  
        label="操作"
        width={72}
        headerClassName={styles.__operator_column}
        className={styles.__operator_body}
        cellRenderer={operatorCellRender}
        dataKey="asin"/>
    </RTable>
  );
};
export default connect(({ comPro }: IConnectState) => ({
  filterData: comPro.filterData,
  selectedData: comPro.selectedList,
  errorMsg: comPro.errorMsg,
}))(TableVirtual);
