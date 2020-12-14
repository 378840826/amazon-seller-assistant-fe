import React, { useState } from 'react';
import { Input } from 'antd';
import { Link } from 'umi';
import styles from './index.less';

const GlobalSearch: React.FC = () => {
  const [text, setText] = useState<string>();
  const [ulVisible, setUlVisible] = useState<boolean>(false);

  const dict = {
    调价设定: '/product/list?search=',
    调价记录: '/reprice/history?code=',
    订单: '/order?asinRelatedSearch=',
    评论: '/review/list?asin=',
    报表: '/report/asin-overview?search=',
    动态: '/asin/dt?asin=',
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
      <Link to={`${dict[item]}${text}`} onClick={handleClick}>
        搜索<span>&ldquo;{text}&rdquo;</span>的{item}
      </Link>
    </li>
  ));

  return (
    <>
      <Input
        className={styles.Input}
        maxLength={20}
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
