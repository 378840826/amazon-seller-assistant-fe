/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-05 18:04:01
 * 
 * SP标准模式 - 【投放方式】 -自动独有的部分
 */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';

import ShowData from '@/components/ShowData';
import {
  Form,
  Switch,
  Input,
  Radio,
  Table,
  message,
} from 'antd';
import { useDispatch } from 'umi';
import { strToMoneyStr, strToNaturalNumStr } from '@/utils/utils';
import EditBox from '../../components/EditBox';


export interface IRecord {
  state: boolean;
  showType: string;
  type: string; // 后端的字段
  bid: number;
}

interface IProps {
  currency: string;
  marketplace: string;
}

const { Item } = Form;
const SpAuto: React.FC<IProps> = props => {
  const { currency, marketplace } = props;

  const dispatch = useDispatch();

  let targetingGroupTableCount = 0;
  const bid = marketplace === 'JP' ? 40 : 0.75; // 日本站默认40

  const [autoGroupBidType, setautoGroupBidType] = useState<string>('auto');
  const [dataSource, setDataSource] = useState<IRecord[]>([ 
    { state: true, showType: 'Close Match', bid, type: 'queryHighRelMatches' },
    { state: true, showType: 'Loose Match', bid, type: 'queryBroadRelMatches' },
    { state: true, showType: 'Substitudes', bid, type: 'asinSubstituteRelated' },
    { state: true, showType: 'Complements', bid, type: 'asinAccessoryRelated' },
  ]);

  useEffect(() => {
    let tem = JSON.stringify(dataSource);
    tem = JSON.parse(tem);
    dispatch({
      type: 'createGroup/setAutoTargetGroupList',
      payload: tem,
    });
  }, [dataSource, dispatch]);

  // 状态修改
  const changeState = (state: boolean, index: number) => {
    dataSource[index].state = state ? false : true;
    setDataSource([...dataSource]);
  };

  // 竞价修改
  const bidCallback = (bid: number, index: number) => {
    const min = marketplace === 'JP' ? 2 : 0.02; // 日本的竞价和竞价的最小值都是2日元
    if (bid < min) {
      message.error(`竞价必须大于等于${min}`);
      return Promise.resolve(false);
    }

    dataSource[index].bid = bid;
    return Promise.resolve(true);
  };

  return <div>
    <Item name={['other', 'bidType']} className={styles.bidType}>
      <Radio.Group onChange={e => setautoGroupBidType(e.target.value)}>
        <Radio value="auto">默认竞价</Radio>
        <Radio value="manual">按Targeting Group设置竞价</Radio>
      </Radio.Group>
    </Item>
    <div className={classnames(styles.defaultBid, autoGroupBidType === 'auto' ? '' : 'none')}>
      {currency}
      <Item name={['auto', 'defaultBid']} normalize={val => {
        if (marketplace === 'JP') {
          return strToNaturalNumStr(val);
        }
        return strToMoneyStr(val);
      }}
      rules={[{
        required: true,
        validator(rule, value) {
          const min = marketplace === 'JP' ? 2 : 0.02;
          if (isNaN(value) || value < min) {
            return Promise.reject(`广告组默认竞价至少${currency}${min}`);
          }
          return Promise.resolve();
        },
      }]}>
        <Input placeholder={`至少${currency}${marketplace === 'JP' ? 2 : 0.02}`} autoComplete="off" />
      </Item>
    </div>
    <div className={classnames(styles.targetingGroupTable, autoGroupBidType !== 'auto' ? '' : 'none')}>
      <Table
        pagination={false}
        rowKey={() => targetingGroupTableCount++}
        columns={[
          {
            title: '状态', align: 'center', dataIndex: 'state', render(val: boolean, record: {}, index: number) {
              return <Switch 
                checked={val} 
                className={'h-switch'} 
                onClick={() => changeState(val, index)} />;
            },
          },
          { title: 'Targeting Group', align: 'center', dataIndex: 'showType' },
          {
            title: '建议竞价', align: 'center', dataIndex: '', render() {
              return <ShowData value={null} />;
              // 现在后端暂时拿不到建议竞价
              // return <div className={styles.suggestBidCol}>
              //   <div className={styles.oneRow}>
              //     <span><ShowData value={222} isCurrency /></span>
              //     <Button size="small">应用</Button>
              //   </div>
              //   <p className={styles.secondary}>
              //     （<ShowData value={2} isCurrency />-<ShowData value={58.2} isCurrency />）
              //   </p>
              // </div>;
            },
          },
          {
            title: '竞价', 
            align: 'right', 
            dataIndex: 'bid', 
            width: 150,
            className: styles.thBidCol, 
            render(value: string, record: {}, index: number) {
              return <EditBox
                value={String(value)} 
                currency={currency} 
                marketplace={marketplace as API.Site}
                chagneCallback={(bid) => bidCallback(bid, index)}
              />;
            },
          },
        ]}
        dataSource={dataSource}
      />
    </div>
  </div>;
};


export default SpAuto;
