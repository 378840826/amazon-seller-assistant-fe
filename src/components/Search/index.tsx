/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-29 10:17:01
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\components\Search\index.tsx
 * 
 * 基于antd input 封装Search
 */ 

import React, { useRef, useState } from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import {
  Input,
  Spin,
} from 'antd';

interface ISearchProps {
  style?: {};
  className?: string;
  maxLength?: number;
  defaultValue?: string;
  id?: string;
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';
  value?: string;
  placeholder?: string;
  allowClear?: boolean;
  loading?: boolean;
  isEmpty?: boolean;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearch?: (value: string, e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}


const Search: React.FC<ISearchProps> = (props) => {
  const {
    style,
    className = '',
    defaultValue,
    maxLength,
    id,
    disabled,
    size,
    value,
    placeholder,
    allowClear,
    loading, // 搜索按钮loading
    isEmpty, // 搜索框为空时是否禁止搜索按钮 默认 - 
    onPressEnter,
    onChange,
    onSearch,
  } = props;
  const inputRef = useRef() as React.MutableRefObject<Input>;
  const antIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />;
  const [empty, setEmpty] = useState<boolean|undefined>(isEmpty);

  // 搜索
  const onClickSearch = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    // 禁用
    if (loading) {
      return;
    }
    if (disabled) {
      return;
    }

    let newValue = value;
    if (newValue === undefined) {
      newValue = inputRef.current.state.value as string;
    }
    onSearch ? onSearch(newValue, e) : null;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange ? onChange(value, e) : null;
    
    if (isEmpty) {
      value.length === 0 ? setEmpty(true) : setEmpty(false);
    }
  };

  // 回车搜索
  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 禁用
    if (loading) {
      return;
    }
    
    onPressEnter ? onPressEnter(e) : null;
  };

  return (
    <div className={`${className} ${styles.search} h-search`} style={style}>
      <Input 
        defaultValue={defaultValue}
        maxLength={maxLength}
        id={id}
        disabled={disabled}
        size={size}
        value={value}
        placeholder={placeholder}
        allowClear={allowClear}
        onChange={handleChange}
        onPressEnter={handlePressEnter}
        ref={ inputRef }
      />
      <span 
        className={`
          h-btn ${styles.btn} 
          ${ loading ? styles.btn_disabled : ''}
          ${ disabled ? styles.btn_disabled : ''}
          ${ empty ? styles.btn_empty_style : ''}
        `} 
        onClick={onClickSearch}
      >
        <Spin 
          className={styles.loading} 
          indicator={ antIcon }
          style={{ display: loading ? 'block' : 'none' }}
        />
        <Iconfont 
          type="icon-sousuo" 
          className={`h-icon ${styles.icon}`}
          style={{ display: loading ? 'none' : 'block' }}
        />
      </span>
    </div>
  );
};

export default Search;
