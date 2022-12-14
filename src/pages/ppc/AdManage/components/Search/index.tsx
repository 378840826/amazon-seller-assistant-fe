/**
 * 搜索
 */
import React, { useState } from 'react';
import { Input } from 'antd';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';

const { Search } = Input;

interface IProps {
  placeholder: string;
  defaultValue: string;
  width?: string | number;
  handleSearch: (value: string) => void;
}

const MySearch: React.FC<IProps> = (props) => {
  const { placeholder, defaultValue, width, handleSearch } = props;
  const [value, setValue] = useState<string>('');

  // 输入框 change
  function handleSearchTextChange(event: { target: { value: string } }) {
    const { target: { value } } = event;
    setValue(value);
  }

  return (
    <span className={styles.SearchContainer} style={{ width }}>
      <Search
        className={styles.Search}
        placeholder={placeholder}
        onChange={handleSearchTextChange}
        onSearch={handleSearch}
        value={value}
        defaultValue={defaultValue}
        enterButton={<Iconfont type="icon-sousuo" className={styles.enterButton} />}
      />
      {
        value
          ?
          <Iconfont 
            type="icon-close"
            className={styles.emptySearch}
            onClick={() => setValue('')}
          />
          :
          null
      }
    </span>
  );
};

export default MySearch;
