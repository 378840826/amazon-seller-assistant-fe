/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { IConnectProps } from '@/models/connect';
import styles from './index.less';

const hrefStyle = `data:text/css;base64,aWZyYW1le2hlaWdodDogMjYwcHg7fQ0KLmxvZ2
luUGFuZWwgLnRpdGxle2Rpc3BsYXk6bm9uZTt9DQouaW1wb3dlckJveCAucXJjb2Rle3dpZHRoOjIwMHB4O21hcmdpbi1
0b3A6MDt9DQouaW1wb3dlckJveCAuaW5mb3tjb2xvcjojODg4O30NC
i5pbXBvd2VyQm94IC5zdGF0dXNfaWNvbiB7ZGlzcGxheTpub25lO30N
Ci5pbXBvd2VyQm94IC5zdGF0dXMge3RleHQtYWxpZ246Y2VudGVyO30=`;
const WeChat: React.FC<IConnectProps> = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = false;
    script.src = 'http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
    document.head.appendChild(script);

    setTimeout(function(){
      // eslint-disable-next-line no-undef
      new WxLogin({
        // eslint-disable-next-line @typescript-eslint/camelcase
        self_redirect: false,
        id: 'wxContainer', 
        appid: 'wxea22122e145d648c', 
        scope: 'snsapi_login', 
        // eslint-disable-next-line @typescript-eslint/camelcase
        redirect_uri: `${location.origin}/api/system/user/wechat-login`,
        // redirect_uri: `http://dev.workics.cn/api/system/user/wechat-login`,
        state: `${ (new Date()).getTime()}`,
        style: 'black',
        href: hrefStyle,
      });

      const qrcodeBox = document.getElementById('wxContainer');
      const iframes = qrcodeBox?.getElementsByTagName('iframe');
      if (iframes?.length){
        const ifr = iframes[0];
        ifr.setAttribute('sandbox', 'allow-scripts allow-top-navigation allow-same-origin');
      }
    }, 1000);
  }, []);
  return (
    <div className={styles.wechat} id="wxContainer">
    </div>
  );
};
export default WeChat;
