import React, { useState } from 'react';
import { Input } from 'antd';
import Link from 'umi/link';
import styles from './index.less';

const GlobalSearch: React.FC = () => {
  const [text, setText] = useState<string>();
  const [ulVisible, setUlVisible] = useState<boolean>(false);

  const dict = {
    调价设定: '/a',
    调价记录: '/b',
    关键词: '/c',
    订单: '/d',
    评论: '/e',
    报表: '/f',
    动态: '/g',
  };
  
  const handleChange = (event: { target: { value: string } }) => {
    const { target: { value } } = event;
    setText(value);
    setUlVisible(!!value);
  };

  const handleClick = () => {
    setUlVisible(false);
  };

  const handleFocus = () => {
    setUlVisible(!!text);
  };

  const searchOptions = Object.keys(dict).map((item: string) => (
    <li key={item}>
      <Link to={`${dict[item]}?asin=${text}`} onClick={handleClick}>
        搜索<span>&ldquo;{text}&rdquo;</span>的{item}
      </Link>
    </li>
  ));

  return (
    <>
      <Input
        placeholder="输入ASIN或SKU"
        allowClear={true}
        onChange={handleChange}
        onFocus={handleFocus}
      />
      {
        ulVisible
          ?
          <ul className={styles.optionsUl}>
            {searchOptions}
          </ul>
          : null
      }
    </>
  );
};

export default GlobalSearch;
