import React, { useState } from 'react';
import { Input } from 'antd';
import { Link } from 'umi';
import styles from './index.less';

const GlobalSearch: React.FC = () => {
  const [text, setText] = useState<string>();
  const [ulVisible, setUlVisible] = useState<boolean>(false);

  const dict = {
    调价设定: '/mws/goods/list?search=',
    调价记录: '/mws/reprice/history?code=',
    关键词: '/mws/keywords/monitor?code=',
    订单: '/mws/order/list?asinRelatedSearch=',
    评论: '/mws/comment/monitor?asin=',
    报表: '/mws/order/unscramble?combination=',
    动态: '/mws/goods/change?asin=',
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
