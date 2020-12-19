import React, { Dispatch, SetStateAction } from 'react';
import { Input, Radio } from 'antd';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';
import { IParams } from '../../index';
const { Search } = Input;

const checkboxList = [
  { name: '全部', key: 'all' },
  { name: '开启', key: 'open' },
  { name: '暂停', key: 'close' },
];
const checkACList = [
  { name: '全部', key: 'all' },
  { name: '是', key: 'yes' },
  { name: '否', key: 'no' },
];
interface IOperatorBar{
  searchTerms: string;
  switchStatus: string;
  isAc: string;
  loading: boolean;
  setParams: Dispatch<SetStateAction<IParams>>;
}
const OperatorBar: React.FC<IOperatorBar> = ({
  searchTerms,
  switchStatus,
  isAc,
  loading,
  setParams,
}) => {

  //radio的值切换
  const changeRadio = (type: string, checked: string) => {
    setParams((params: IParams) => ({
      ...params,
      [type]: checked,
    }));
  };
  const onSearch = (value: string) => {
   
    setParams((params: IParams) => ({
      ...params,
      searchTerms: value.trim(),
    }));
  };
  return (
    <div className={styles.bar}>
      <div className={styles.search_container}>
        <Search 
          size="middle" 
          allowClear
          className={styles.search_input}
          placeholder="输入标题、ASIN、SKU或关键词" 
          defaultValue={searchTerms}
          onSearch={(value, event) => {
            if (!event?.['__proto__']?.type){
              onSearch(value);
            }
          }}
          disabled={loading}
          enterButton={<Iconfont type="icon-sousuo" className={styles.icon_sousuo}/>} />
      </div>
      <div className={styles.source}>
        <span className={styles.font_source}>状态：</span>
        <Radio.Group 
          onChange={(checked) => changeRadio('switchStatus', checked.target.value)} 
          defaultValue={switchStatus}
          disabled={loading}
        >
          {
            checkboxList.map((item) => {
              return (
                <Radio key={item.key} value={item.key}>{item.name}</Radio>
              );
            })
          }
        </Radio.Group>
      </div>
      <div className={styles.source}>
        <span className={styles.font_source}>当前是否Amazon&apos;s Choice：</span>
        <Radio.Group 
          onChange={(checked) => changeRadio('isAc', checked.target.value)} 
          defaultValue={isAc}
          disabled={loading}
        >
          {
            checkACList.map((item) => {
              return (
                <Radio key={item.key} value={item.key}>{item.name}</Radio>
              );
            })
          }
        </Radio.Group>
      </div>
    </div>
  );
};
export default OperatorBar;
