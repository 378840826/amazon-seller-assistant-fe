import React from 'react';
import styles from './index.less';
import { Link } from 'umi';
import { Iconfont } from '@/utils/utils';


const Snav: React.FC<Snav.IProps> = (props) => {
  const {
    navList,
    style,
    className,
  } = props;
  
  return (
    <nav className={`${styles.snav} ${className}`} style={style}>
      {
        navList.map((item, i) => {
          const index = i + 1;
          if (item.type === 'Link') {
            return <div key={index} className={styles.item}>
              <Link 
                to={{
                  pathname: item.path,
                  state: item.state,
                  search: item.search,
                }} 
                key={index}
              >
                {item.label}
              </Link> 
              {index !== navList.length ? 
                <Iconfont type="icon-zhankai-copy" className={styles.icon}/> 
                : ''
              }
            </div>;
          }

          if (item.type === 'a') {
            return <div key={index} className={styles.item}>
              <a 
                key={index}
                href={item.path}
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a> 
              {index !== navList.length ? 
                <Iconfont type="icon-zhankai-copy" className={styles.icon}/> 
                : ''
              }
            </div>;
          }

          return <div key={index} className={styles.item}>
            <span>{item.label}</span>
            {index !== navList.length ? 
              <Iconfont 
                type="icon-zhankai-copy" className={styles.icon} /> 
              : '' 
            }
          </div>;
        })
      }
    </nav>
  );
};

export default Snav;
