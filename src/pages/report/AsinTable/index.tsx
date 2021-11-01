import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import { Link, useDispatch, useSelector } from 'umi';

import {
  Tabs,
} from 'antd';
import ChildAsin from './ChildAsin';
import ParentAsin from './ParentAsin';
import { Iconfont, storage } from '@/utils/utils';
import { storageKeys } from '@/utils/huang';
import { getCalendarFields } from './config';

interface ITags {
  tag: string;
  asin: string;
}

const { TabPane } = Tabs;
const { adinTableCalendar } = storageKeys;
const AsinTable = () => {
  const dispatch = useDispatch();
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  // 为保证数据完整，请导入每天的Business Report 是否显示
  const [messagedata, setMessagedata] = useState<boolean>(false);
  // 为提高利润统计的准确性，请在商品列表导入成本、运费 是否显示 (1 : 弹窗提示 (当前页asin有成本或运费为空) 0 : 不弹窗 (当前页asin没有成本或运费没填的情况))
  const [messageprofit, setMessageProfit] = useState<boolean>(false);
  // 未完成广告授权 是否显示（子asin列表校验店铺是否已通过MWS绑定或者广告授权）
  const [messagead, setMessageAd] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('child'); // 当前选中的menu
  
  const [visible, setVisible] = useState<boolean>(false); // 显示消息框
  const [isShow, setIsShow] = useState<boolean>(false); // 是否有消息提醒

  // 保存数据库的值
  const [messagedataAsync, setMessagedataAsync] = useState<boolean>(false); 
  const [messageprofitAsync, setMessageprofitAsync] = useState<boolean>(false);
  const [messageadAsync, setMessageadAsync] = useState<boolean>(false);

  const [calendar, setCalendar] = useState<string>(storage.get(`${adinTableCalendar}_dc_itemKey`) || '7'); // 日历
  const [canlendarFlag, setCanlendarFlag] = useState<boolean>(false); // 控制请求、比如点击2月、再点击3月时，

  // 接收消息（为提高利润统计的准确性，请在商品列表导入成本、运费 ）
  const receptionMessage = (messageprofit: boolean) => {
    setMessageProfit(messageprofit);
    setMessageprofitAsync(messageprofit);
  };

  //tab共享传参标识
  const [tabTag, setTabTag] = useState<ITags>({
    tag: 'child',
    asin: '',
  });
  // 计算没导入的数量
  const messageLength = [];
  if (messagedataAsync) {
    messageLength.push('messagedataAsync');
  }
  if (messageprofitAsync) {
    messageLength.push('messageprofitAsync');
  }
  if (messageadAsync) {
    messageLength.push('messageadAsync');
  }
  //商品父ASIN 跳转过来传接收参数
  useEffect(() => {
    if (history.state && history.state.state && history.state.state.tag) {
      setTabTag({
        tag: history.state.state.tag,
        asin: history.state.state.parentasin,
      });
    }
  }, []);

  const checkData = useCallback(function() {
    if (currentShop.id === '-1' || currentShop.sellerId === 'sellerId-1') {
      return;
    }

    let type = 'asinTable/getChildCheckIntactShop';

    if (currentTab === 'parent') {
      type = 'asinTable/getParentCheckIntactShop';
    }

    new Promise((resolve, reject) => {
      dispatch({
        type,
        resolve,
        reject,
        payload: {
          sellerId: currentShop.sellerId,
          marketplace: currentShop.marketplace,
          ...getCalendarFields(calendar, adinTableCalendar),
        },
      });
    }).then(datas => {
      const [data1, data2] = datas as {
        code: number;
      }[];
      const {
        code: code1,
      } = data1;

      const {
        code: code2,
      } = data2;
      
      if (code1 !== 200) {
        // 为保证数据完整，请上传该周期每天的Business Report
        setMessagedata(true);
        setIsShow(true);
        setMessagedataAsync(true);
        messageLength.push(messageadAsync, messagedata);
        // 数据导入齐全
      } else {
        setMessagedata(false);
        setMessagedataAsync(false);
      }

      if (code2 !== 200) {
        // 为保证数据完整，请完成广告授权
        setMessageAd(true);
        setIsShow(true);
        setMessageadAsync(true);
        messageLength.push(messagead);
      } else {
        // 已通过MWS绑定店铺并且完成广告授权
        setMessageAd(false);
        setMessageadAsync(false);
      }
    });
  }, [dispatch, currentShop, currentTab, calendar]);


  useEffect(() => {
    checkData();
  }, [checkData, canlendarFlag]);

  // 周期改变时，重新验证是否导入数据和通过MWS绑定或者广告授权
  const canlendarCallback = (calendar: string) => {
    setCalendar(calendar);
    setCanlendarFlag(!canlendarFlag);
  };

  // 忽略
  useEffect(() => {
    if (!messagedata && !messageprofit && !messagead ) {
      setVisible(false);
    }
  }, [messagedata, messageprofit, messagead]);

  // 子ASIN和父ASIN的区别
  function tabCallback(key: string) {
    setCurrentTab(key);
    setTabTag({ ...tabTag, tag: key });
    setVisible(false);
    if (key === 'child') {
      setTabTag({
        tag: 'child',
        asin: '',
      });
    }
  }

  // 点击消息框
  const clickmessageIcon = () => {
    setVisible(!visible);
    setMessagedata(messagedataAsync);
    setMessageProfit(messageprofitAsync);
    setMessageAd(messageadAsync);
  };

  return <div className={styles.asinTable}>
    <Tabs activeKey={tabTag.tag} className={styles.tabs} onChange={tabCallback} animated>
      <TabPane tab="子ASIN" key="child">
        
      </TabPane>
      <TabPane tab="父ASIN" key="parent">
      </TabPane>
    </Tabs>
    {tabTag.tag === 'child' ? <ChildAsin 
      tabValue={tabTag.tag}  
      receptionMessage={receptionMessage} 
      canlendarCallback={canlendarCallback}
      setTabTag={setTabTag}
      clickmessageIcon={clickmessageIcon}
      visible={visible}
      setMessagedata={setMessagedata}
      messagedata={messagedata}
      setMessageProfit={setMessageProfit}
      messageprofit={messageprofit}
      setMessageAd={setMessageAd}
      messagead={messagead}
      isShow={isShow}
      messageLength={messageLength}
    /> : 
      <ParentAsin 
        tabValue={tabTag.tag} 
        receptionMessage={receptionMessage} 
        canlendarCallback={canlendarCallback}
        parentAsin={tabTag.asin}
        clickmessageIcon={clickmessageIcon}
        visible={visible}
        setMessagedata={setMessagedata}
        messagedata={messagedata}
        setMessageProfit={setMessageProfit}
        messageprofit={messageprofit}
        setMessageAd={setMessageAd}
        messagead={messagead}
        isShow={isShow}
        messageLength={messageLength}
      />
    }
  </div>;
};

export default AsinTable;
