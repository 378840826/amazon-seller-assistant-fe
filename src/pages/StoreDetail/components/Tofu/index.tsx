/**
 * 一组豆腐块数据
 */
import React from 'react';
import { renderTdNumValue as renderValue } from '@/pages/StoreReport/utils';
import { AssignmentKeyName } from '../../utils';
import { moneyFormatNames, percentageFormatNames } from '../../config';
import DataBlock from '../DataBlock';
import { Spin } from 'antd';
import { getDataType } from '@/utils/utils';
import classnames from 'classnames';
import styles from './index.less';

interface IProps {
  /** 全部豆腐数据 */
  data: {
    [key: string]: number;
  };
  /** 豆腐块名称数组 */
  nameList: string[];
  /** 选中的豆腐块名称, 或包含名称和 color 字段的对象 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkedNames: any;
  /** 自定义列数据 */
  customBlock: {
    [key: string]: boolean;
  };
  colors?: string[];
  loading?: boolean;
  currency: string;
  containerClassName?: string;
  onClick: (name: string, checked: boolean) => void;
}

// 问号提示
const queryDict = {
  'PageView': '需要按天导入Business Report',
  'Session': '需要按天导入Business Report',
  '转化率': '转化率=订单量/Session',
  '优惠订单': '有优惠折扣的订单量',
  '关联销售': '本商品和其他商品一起购买的订单量',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Tofu: React.FC<IProps> = function(props) {
  const { 
    data,
    nameList,
    checkedNames,
    customBlock,
    loading,
    currency,
    onClick,
    containerClassName,
  } = props;
  const colors = props.colors || [];

  return (
    <Spin spinning={loading}>
      <div className={classnames(styles.container, containerClassName)}>
        {
          nameList.map(name => {
            const key = AssignmentKeyName.getkey(name);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let value: any = data[key];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let previousValue: any = data[`${key}Last`];
            if (moneyFormatNames.includes(name)) {
              value = renderValue({ value, prefix: currency });
              previousValue = renderValue({ value: previousValue, prefix: currency });
            } else if (percentageFormatNames.includes(name)) {
              value = renderValue({ value, suffix: '%' });
              previousValue = renderValue({ value: previousValue, suffix: '%' });
            } else {
              value = renderValue({ value });
              previousValue = renderValue({ value: previousValue });
            }
            const ratioValue = data[`${key}RingRatio`];
            let checked: boolean;
            let color: string;
            if (getDataType(checkedNames) === 'Array') {
              checked = checkedNames.includes(name);
              color = colors[checkedNames.indexOf(name)];
            } else {
              checked = checkedNames[name].checked;
              color = checkedNames[name].color;
            }
            return (customBlock[name] &&
              <DataBlock
                key={key}
                checked={checked}
                name={name}
                value={value}
                previous={previousValue}
                ratio={ratioValue}
                clickCallback={() => onClick(name, !checked)}
                color={color}
                hint={queryDict[name]}
              />
            );
          })
        }
      </div>
    </Spin>
  ); 
};

export default Tofu;
