import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import { Input, Spin } from 'antd';
import { connect } from 'umi';
import ProductInfo from '../productInfo';
import SkuInfo from '../skuInfo';
import classnames from 'classnames';
import { getHeight } from '@/pages/asinPandect/ComPro/components/TableVirtual';
import { IConnectState, IConnectProps } from '@/models/connect';
import { Column, Table as RTable } from 'react-virtualized';
import 'react-virtualized/styles.css';
interface IContainerLeft extends IConnectProps{
  StoreId: string;
  asinChange: (param: string[]) => void;
}
interface IState{
  loading: boolean;
  searchTerms: string;
  notSelectedList: IItems[];
  selectedList: IItems[];
  emptyText: string;
}
interface IItems{
  imgLink: string;
  title: string;
  titleLink: string;
  asin: string;
  skuInfo: {
    sku: string;
    skuStatus: string;
  }[];
}
const { Search } = Input;

const ContainerLeft: React.FC<IContainerLeft> = ({
  StoreId,
  dispatch,
  asinChange,
}) => {

  const [state, setState] = useState<IState>({
    loading: false,
    searchTerms: '',
    notSelectedList: [],
    selectedList: [],
    emptyText: '',
  });
  

  useEffect(() => {
    setState((state) => ({
      ...state,
      loading: true,
    }));

    dispatch({
      type: 'dynamic/msSearchProduct',
      payload: {
        data: {
          headersParams: { StoreId },
        },
        params: {
          searchTerms: state.searchTerms,
        },
      },
      callback: (res: {code: number; data: IItems[]; message: string}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            notSelectedList: res.data,
            loading: false,
          }));
        } else {
          setState((state) => ({
            ...state,
            loading: false,
            notSelectedList: [],
            emptyText: res.message,
          }));
        }
      },
    });
  }, [dispatch, state.searchTerms, StoreId]);


  //搜索框点击
  const onSearch = (value: string) => {
    const searchTerms = value.trim();
    setState((state) => ({
      ...state,
      searchTerms,
    }));
  }; 

  //选中 /全选
  const onSelectList = (record?: IItems) => {
    const asinList: string[] = [];
    if (record){ //选中单个
      const selectedList = state.selectedList.concat(record);
      selectedList.map(item => asinList.push(item.asin));
      setState((state) => ({
        ...state,
        selectedList: state.selectedList.concat(record),
      }));
    } else { //全选
      const hash = {};
      const config = [...state.notSelectedList, ...state.selectedList];
      const newSelectedList = config.reduceRight((item: IItems[], next) => {
        hash[next.asin] ? '' : hash[next.asin] = true && item.push(next);
        return item;
      }, []);
      newSelectedList.map(item => asinList.push(item.asin));
      setState((state) => ({
        ...state,
        selectedList: newSelectedList,
      }));
    }
    asinChange(asinList);
  };

  //删除/全删
  const onRemoveList = (record?: IItems) => {
    const asinList: string[] = [];
    if (record){ //删除单个
      const newSelectList = state.selectedList.filter(item => item.asin !== record.asin);
      newSelectList.map(item => asinList.push(item.asin));
      setState((state) => ({
        ...state,
        selectedList: newSelectList,
      }));
    } else { //全删
      setState((state) => ({
        ...state,
        selectedList: [],
      }));
    }
    asinChange(asinList);
  };

  //商品信息cellRenderer
  const goodsCellRender = ({ rowData }: API.IParams) => {
    return (
      <ProductInfo item={rowData} className={styles.__product_info}/>
    );
  };

  const skuCellRender = ({ rowData }: API.IParams) => {
    const { skuInfo: text } = rowData;
    return (
      text === '' ?
        <div className="null_bar"></div>
        :
        <SkuInfo item={text}/>
    );
  };

  const operatorCellRender = ({ rowData }: API.IParams) => {
    return (
      state.selectedList.filter((item) => item.asin === rowData.asin).length > 0 ? 
        <span className={styles.select_already}>已选</span>
        :
        <span className={styles.select_yes} onClick={() => onSelectList(rowData)}>选择</span>
    );
  };
  const deleteCellRender = ({ rowData }: API.IParams) => {
    return (
      <span onClick={() => onRemoveList(rowData)} className={styles.select_no}>删除</span>
    );
  };

  //rowCount为0时候的显示
  const noRowsRenderer = () => {
    return (
      <div className={styles.__no_data}>Oops! 没有找到相关的信息</div>
    );
  };
  return (
    <div>
      <div className={styles.search_container}>
        <Search 
          size="middle" 
          allowClear
          className={styles.search_input}
          placeholder="输入标题、ASIN或SKU" 
          onSearch={(value, event) => {
            if (!event?.['__proto__']?.type){
              onSearch(value);
            }
          }}
          disabled={state.loading}
          enterButton={<Iconfont type="icon-sousuo" className={styles.icon_sousuo}/>} />
      </div>
     
      <div className={styles.tables}>
        <div className={styles.not_select_table}>
          <span 
            onClick={() => onSelectList()}
            className={classnames(styles.select_button, styles.all_button)}>
            全选
          </span>
          <Spin spinning={state.loading}>
            <RTable
              width={624}
              height={getHeight({
                dataLength: state.notSelectedList.length,
                headerHeight: 44,
                rowHeight: 46,
                maxHeight: 200,
              })}
              headerHeight={44}
              rowHeight={46}
              className={styles.__virtual_table}
              rowCount={state.notSelectedList.length}
              noRowsRenderer={noRowsRenderer}
              rowGetter={({ index }: {index: number}) => state.notSelectedList[index]}
              rowClassName={( { index }: {index: number}) => index % 2 === 1 ? 'darkRow' : '' }
            >
              <Column 
                label="商品信息"
                width={346}
                headerClassName={styles.__goods_column}
                className={styles.__goods_body}
                cellRenderer={goodsCellRender}
                dataKey="asin"
              />
              <Column  
                label="SKU"
                width={213}
                headerClassName={styles.__sku_column}
                className={styles.__sku_body}
                cellRenderer={skuCellRender}
                dataKey="asin"/>
              <Column  
                label="操作"
                width={50}
                headerClassName={styles.__operator_column}
                className={styles.__operator_body}
                cellRenderer={operatorCellRender}
                dataKey="asin"/>
            </RTable>
          </Spin>
        </div>
        <div className={styles.selected_table}>
          <div className={styles.selected_table_bar}>
            <span className={styles.all_button}>已选</span>
            <span 
              onClick={() => onRemoveList()}
              className={classnames(styles.remove_button, styles.all_button)}>删除全部</span>
          </div>
          
          <RTable
            width={624}
            height={getHeight({
              dataLength: state.selectedList.length,
              headerHeight: 44,
              rowHeight: 46,
              maxHeight: 200,
            })}
            headerHeight={44}
            rowHeight={46}
            className={styles.__virtual_table}
            rowCount={state.selectedList.length}
            noRowsRenderer={noRowsRenderer}
            rowGetter={({ index }: {index: number}) => state.selectedList[index]}
            rowClassName={( { index }: {index: number}) => index % 2 === 1 ? 'darkRow' : '' }
          >
            <Column 
              label="商品信息"
              width={346}
              headerClassName={styles.__goods_column}
              className={styles.__goods_body}
              cellRenderer={goodsCellRender}
              dataKey="asin"
            />
            <Column  
              label="SKU"
              width={213}
              headerClassName={styles.__sku_column}
              className={styles.__sku_body}
              cellRenderer={skuCellRender}
              dataKey="asin"/>
            <Column  
              label="操作"
              width={50}
              headerClassName={styles.__operator_column}
              className={styles.__operator_body}
              cellRenderer={deleteCellRender}
              dataKey="asin"/>
          </RTable>
        </div>
      </div>
    </div>
  );
};
export default connect(({ global }: IConnectState) => ({
  StoreId: global.shop.current.id,
}))(ContainerLeft);
