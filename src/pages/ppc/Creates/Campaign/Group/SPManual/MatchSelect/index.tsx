/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-08 09:46:07
 * 匹配方式  下拉列表
 */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import {
  Select,
} from 'antd';

const { Option } = Select; 

interface IProps {
  value: string;
  keyword: string;
  changeCallback: (value: string, id: string) => Promise<boolean>;
}

// 匹配方式 -下拉列表
const MatchSelect: React.FC<IProps> = ({ value, changeCallback, keyword }) => {
  const [defaultValue, setDefaultValue] = useState<string>('');

  useEffect(() => {
    setDefaultValue(value);
  }, [value]);

  // 修改下拉列表值
  const listChange = (match: string) => {
    changeCallback(match, keyword).then(state => {
      if (state) {
        setDefaultValue(match);
      }
    });
  };
  
  return (
    <Select 
      value={defaultValue} 
      onChange={val => listChange(val)} 
      className={styles.match}
    >
      <Option value="broad">广泛</Option>
      <Option value="phrase">词组</Option>
      <Option value="exact">精准</Option>
    </Select>
  );
};

export default MatchSelect;
