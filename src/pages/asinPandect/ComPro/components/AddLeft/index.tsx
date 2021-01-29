import React, { useRef } from 'react';
import { Tabs, Input, Spin, Button } from 'antd';
import { connect } from 'umi';
import TableVirtual from '../TableVirtual';
import { ISingleItem } from '../AddFilter';
import { IConnectState, IConnectProps } from '@/models/connect';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import 'react-virtualized/styles.css';
import styles from './index.less';
const { TabPane } = Tabs;
const { Search, TextArea } = Input;
interface IAddLeft extends IConnectProps{
    tableLoading: boolean;
    filterData: ISingleItem[];
    allData: ISingleItem[];
    selectedList: ISingleItem[];
}
const filterReg = /^B0[A-Z0-9]{8}$/;
const AddLeft: React.FC<IAddLeft> = ({ 
  dispatch,  
  filterData,
  selectedList,
  allData,
  tableLoading,
}) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refTextarea = useRef<any>(null);
  const onSelectText = () => {
    if (refTextarea.current){
      const list = refTextarea.current.state.value.split(/\n/ig).map( (item: string) => item.trim())
        .filter((item1: string) => filterReg.test(item1)); 
        // .filter((item1: string) => item1 !== ''); 
     
      const allAsin = allData.map(item => item.asin);
      const selected: ISingleItem[] = [];
      list.forEach( (item: string) => {
        if (allAsin.includes(item)){
          const list = allData.find((itemObj) => itemObj.asin === item );
          list ? selected.push(list) : '';
        } else {
          selected.push({
            asin: item,
            image: '',
            price: '',
            ranking: '',
            reviewAvgStar: '',
            title: '',
            titleLink: '',
            reviewCount: '',
          });
        }
      });
      const newSet = new Set([...selectedList, ...selected]);
      dispatch({
        type: 'comPro/updateSelected',
        payload: [...newSet],
      });
    }
  };

  //全选
  const onSelectList = () => {
    const newSet = new Set([...filterData, ...selectedList]);
    dispatch({
      type: 'comPro/updateSelected',
      payload: [...newSet],
    });
  };
  //搜索
  const onSearch = (value: string) => {
    value = value.trim();
    if (value){
      const filterData = allData.filter((item: ISingleItem) => {
        return (item.asin.includes(value) || item.title.includes(value));
      });

      dispatch({
        type: 'comPro/updateFilter',
        payload: filterData,
      });
    } else {
      dispatch({
        type: 'comPro/updateFilter',
        payload: allData,
      });
    }
  };
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="建议竞品" key="1">
          <div className={styles.suggest_container}>
            <div className={styles.search_container}>
              <Search 
                size="middle" 
                allowClear
                className={styles.search_input}
                placeholder="输入标题、ASIN" 
                //   value={state.keyword}
                //   onChange={value => onKeywordChange(value)}
                onSearch={(value, event) => {
                  if (!event?.['__proto__']?.type){
                    onSearch(value);
                  }
                }}
                disabled={tableLoading}
                enterButton={<Iconfont type="icon-sousuo" className={styles.icon_sousuo}/>} />
            </div>
            <div className={styles.not_select_table}>
              <span 
                onClick={() => onSelectList()}
                className={classnames(styles.select_button, styles.all_button)}>
            全选
              </span>
              <Spin spinning={tableLoading}>
                <TableVirtual/>
              </Spin>
            </div> 
          </div>
        </TabPane>
        <TabPane tab="输入竞品" key="2">
          <div className={styles.select_keywords}>
            <TextArea ref={refTextarea} placeholder="输入ASIN，每行一个" className={styles.select_textarea}/>
            <div className={styles.__select}><Button onClick={ onSelectText}>选择</Button></div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default connect(({ comPro }: IConnectState) => ({
  tableLoading: comPro.tableLoading,
  selectedList: comPro.selectedList,
  filterData: comPro.filterData,
  allData: comPro.allData,
}))(AddLeft);
