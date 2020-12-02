/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-19 16:31:52
 * 智能调价 - 调价规则 - 添加规则 - 规则类型选择
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Link, history, useLocation } from 'umi';
import { 
  ruleListRouter,
  ruleAddSalesRouter,
  ruleAddCartRouter,
  ruleAddCompetitorRouter,
} from '@/utils/routes';

// component
import Snav from '@/components/Snav';
import {
  Button,
} from 'antd';


const Rules: React.FC = () => {
  const location = useLocation();
  const { state } = location;

  // 选中的规则类型
  const [ruleindex, setRuleindex] = useState<number>(0);

  // 如果是从添加返回的，默认选中之前的
  useEffect(() => {
    if (state) {
      if (state === 'sales') {
        setRuleindex(0);
      } else if (state === 'cart') {
        setRuleindex(1);
      } else if (state === 'competitor') {
        setRuleindex(2);
      }
    }
  }, [state]);

  const navList: Snav.INavList[] = [
    {
      label: '规则列表',
      path: ruleListRouter,
      type: 'Link',
    },
    {
      label: '添加规则',
    },
    {
      label: '选择规则类型',
    },
  ];

  const typeList = [
    {
      heading: '根据销售表现调价',
      details: '根据订单量、销量、销量库存比、session、转化率等各项销售指标，上调/下调一定金额或百分比',
      icon: require('@/assets/repricing/sale.png'),
      selectIcon: require('@/assets/repricing/sale_active.png'),
      path: ruleAddSalesRouter,
    },
    {
      heading: '根据黄金购物车调价',
      details: '根据是否占有黄金购物车，或占有黄金购物车时竞争对手的情况，上调/下调一定金额或百分比',
      icon: require('@/assets/repricing/cart.png'),
      selectIcon: require('@/assets/repricing/cart_active.png'),
      path: ruleAddCartRouter,
    },
    {
      heading: '根据竞品价格调价',
      details: '可同时监控亚马逊多个同类产品的价格，根据竞品的价格情况，上调/下调一定金额或百分比',
      icon: require('@/assets/repricing/competing.png'),
      selectIcon: require('@/assets/repricing/competing_active.png'),
      path: ruleAddCompetitorRouter,
    },
  ];

  // 点击
  const clickSelectType = (index: number) => {
    setRuleindex(index);
  };

  // 确定
  const clickCheckConfirm = () => {
    let toPath = '';
    typeList.forEach((item, i) => {
      if (i === ruleindex) {
        toPath = item.path;
      }
    });
    history.push(toPath);
  };


  return <div className={styles.ruleAddIndex}>
    <Snav navList={navList} style={{
      paddingTop: 14,
    }}></Snav>

    <div className={styles.typeList}>
      {
        typeList.map((item, i) => {
          return <div key={i} 
            className={classnames(
              styles.typeItem,
              ruleindex === i ? styles.active : '',
            )}
            onClick={() => clickSelectType(i)}
          >
            <h2>{item.heading}</h2>
            <img src={ruleindex === i ? item.selectIcon : item.icon}/>
            <p>{item.details}</p>
          </div>;
        })
      }
    </div>
    <footer className={styles.foot}>
      <Button><Link to={ruleListRouter}>取消</Link></Button>
      <Button type="primary" onClick={clickCheckConfirm}>下一步</Button>
    </footer>
  </div>;
};

export default Rules;
