import React from 'react';
import styles from './index.less';
const PayRule = () => {
  return (
    <div>
      <div className={styles.title}>付费规则</div>
      <div className={styles.feeRule}>
        <table>
          <thead>
            <tr>
              <td>功能</td>
              <td>费用</td>
            </tr>
          </thead>
          <tbody>
            <tr key="1">
              <td>数据大盘</td>
              <td>免费</td>
            </tr>
            <tr>
              <td>Business Report解读</td>
              <td>免费</td>
            </tr>
            <tr key="2">
              <td>订单解读</td>
              <td>免费</td>
            </tr>
            <tr key="3">
              <td>广告总览</td>
              <td>免费</td>
            </tr>
            <tr key="4">
              <td>ASIN广告解读</td>
              <td>免费</td>
            </tr>
            <tr key="5">
              <td>广告管理</td>
              <td>免费</td>
            </tr>
            <tr key="6">
              <td>智能调价</td>
              <td>5币/ASIN/天</td>
            </tr>
            <tr key="7">
              <td>评论监控</td>
              <td>5币/ASIN/天</td>
            </tr> 
            <tr key="8">
              <td>关键词监控</td>
              <td>50币/ASIN/次</td>
            </tr> 
            <tr key="9">
              <td>ASIN动态</td>
              <td>5币/ASIN/天</td>
            </tr>
            <tr key="10">
              <td>跟卖监控</td>
              <td>10币/ASIN/天</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PayRule;
