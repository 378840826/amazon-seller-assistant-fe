/**
 * 全球站点时钟
 *  （不需要流逝了）
 */
import React from 'react';
import moment from 'moment-timezone';
import styles from './index.less';

interface IProps {
  currentTime: number;
}

const list = [
  {
    name: '太平洋',
    marketplace: 'US',
    code: 'America/Los_Angeles',
  }, {
    name: '英国',
    marketplace: 'UK',
    code: 'Europe/London',
  }, {
    name: '德国',
    marketplace: 'DE',
    code: 'Europe/Paris',
  }, {
    name: '法国',
    marketplace: 'FR',
    code: 'Europe/Paris',
  }, {
    name: '西班牙',
    marketplace: 'ES',
    code: 'Europe/Paris',
  }, {
    name: '意大利',
    marketplace: 'IT',
    code: 'Europe/Paris',
  }, {
    name: '日本',
    marketplace: 'JP',
    code: 'Asia/Tokyo',
  }, 
];

const WorldSiteTimeClock: React.FC<IProps> = props => {
  const { currentTime } = props;

  function getSiteTime(siteCode: string) {
    return moment(currentTime).tz(siteCode).format('YYYY-MM-DD HH:mm');
    // const full = moment(currentTime).tz(siteCode).format('YYYY-MM-DD HH:mm');
    // const arr = full.split(':');
    // return (
    //   <div>
    //     {arr[0]}<span className={styles.flicker}>:</span>{arr[1]}
    //   </div>
    // );
  }

  return (
    <div className={styles.container}>
      {
        list.map(item => (
          <div key={item.marketplace}>
            <div className={styles.name}>{item.name}</div>：
            <div>{ getSiteTime(item.code) }</div>
          </div>
        ))
      }
    </div>
  );
};

export default WorldSiteTimeClock;
