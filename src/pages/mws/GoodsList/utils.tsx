import React from 'react';
import { message } from 'antd';
import { Order } from '@/models/goodsList';

// 快捷设置时判断 售价/最高价/最低价 是否合理，并返回提示语（批量/单个）
export const judgeFastPrice = function (key: string, goodsRecord: API.IGoods[]) {
  let msg = '';
  for (let index = 0; index < goodsRecord.length; index++) {
    const goods = goodsRecord[index];
    switch (key) {
    // 售价 = 佣金 + FBAfee
    case 'price':
      if (goods.fulfillmentChannel === 'FBA') {
        if (!goods.fbaFee) {
          msg = 'FBAfee为空，设置失败!';
          break;
        }
        if (!goods.commission) {
          msg = '平台佣金为空，设置失败!';
          break;
        }
      } else {
        if (!goods.commission) {
          msg = '平台佣金为空，设置失败!';
          break;
        }
      }
      break;
    // 最高价 = 售价
    case 'maxPrice':
      if (!goods.price) {
        msg = '当前售价为空，设置失败！';
      } else if (goods.price <= goods.minPrice) {
        msg = '最高价必须大于最低价！';
      }
      break;
    // 最低价 = 佣金 + FBAfee
    case 'minPrice':
      if (goods.commission + goods.fbaFee >= goods.maxPrice) {
        msg = '最低价必须小于最高价，设置失败!';
        break;
      }
      if (goods.fulfillmentChannel === 'FBA') {
        if (!goods.fbaFee) {
          msg = 'FBAfee为空，设置失败!';
          break;
        }
        if (!goods.commission) {
          msg = '平台佣金为空，设置失败!';
          break;
        }
      } else {
        if (!goods.commission) {
          msg = '平台佣金为空，设置失败!';
          break;
        }
      }
      break;
    default:
      break;
    }
  }
  if (msg !== '') {
    message.error(msg);
    return false;
  }
  return true;
};

// 调价开关开启时判断有没有最高价和最低价
export const judgeRuleOpen = function (goodsRecord: API.IGoods[]) {
  for (let index = 0; index < goodsRecord.length; index++) {
    const goods = goodsRecord[index];
    if (!goods.minPrice || !goods.maxPrice) {
      message.error('开启调价前请设置最低价和最高价');
      return false;
    }
  }
  return true;
};

// 排序图标
export const renderSortIcon = function (order: Order) {
  let className = '';
  if (order === 'ascend') {
    className = 'ant-table-column-sorter-up';
  } else {
    className = 'ant-table-column-sorter-down';
  }
  return (
    <span className="ant-table-column-sorter">
      <span className={className}></span>
    </span>
  );
};
