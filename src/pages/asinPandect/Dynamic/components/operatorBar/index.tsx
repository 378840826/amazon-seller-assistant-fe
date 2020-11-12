import React from 'react';
import styles from './index.less';
import { Button, Tooltip } from 'antd';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import {
  operaList,
  adjustList,
  feedbackList,
  relativeList,
  raceOperaList,
  yAxisList,
} from '@/pages/mws/AsinChange/summary/components/operatorBar';

interface IDynamicCom{
  list: string[];
  properties: string[];
  modifySendState: (params: API.IParams) => void;
  updateTime: string;
}
const getNewState = (value: string, type: string[], num: number) => { //type : list/properties
  const index = type.indexOf(value);
  const newState = type;
  
  const len = type.length;
  if (index < 0){ //新点击的元素不存在
    if (len >= num){
      newState.push(value);
      newState.shift();
    } else {
      newState.push(value);
    }
  } else { //新点击的元素存在
    newState.splice(index, 1);
  }
  return newState;
};
const DynamicCom: React.FC<IDynamicCom> = ({
  list,
  properties,
  modifySendState,
  updateTime,
}) => {

  //其他几个按钮点击
  const buttonClickEvent = (value: string) => {
    const newState = getNewState(value, list, 8);
    modifySendState({ changeType: newState });
  };

  //纵坐标点击
  const yAxisClick = (value: string) => {
    const newState = getNewState(value, properties, 2);
    modifySendState({ properties: newState });
  };


  return (
  
    <div className={styles.container}>
      <div className={styles.time}>
        <span className={styles.time_font}>更新时间：</span>
        <span className={styles.time_content}>{updateTime}</span>
      </div>
      <div className={styles.buttonList} >
        <div className={styles.changeType}>
          <span>变化类型：</span>
          <i className={styles.cleanup} 
            onClick={() => modifySendState({ changeType: [], properties: [] })}>
            <Iconfont className={styles.icon_qingkong} type="icon-qingkong"/>
            <span>清空</span>
          </i>
        </div>
        <div className={styles.operaList}>
          <span>运营操作：</span>
          {operaList.map(item => {
            return (
              <Button key={item.value} 
                onClick={() => buttonClickEvent(item.value)} className={classnames(
                  { [styles.active]: list.indexOf(item.value) > -1 ? true : false,
                  })}>{item.name}</Button>
            );
          })}
        </div>
        <div className={styles.adjustList}>
          <span>平台调整：</span>
          {adjustList.map(item => {
            return (
              <Button key={item.value} 
                onClick={() => buttonClickEvent(item.value)} className={classnames(
                  { [styles.active]: list.indexOf(item.value) > -1 ? true : false,
                  })}>{item.name}</Button>
            );
          })}
        </div>
        <div className={styles.feedbackList}>
          <span>客户反馈：</span>
          {feedbackList.map(item => {
            return (
              <Button key={item.value} 
                onClick={() => buttonClickEvent(item.value)} 
                className={classnames(
                  { [styles.active]: list.indexOf(item.value) > -1 ? true : false,
                  })}>
                {item.name}
                {item.q ? <Tooltip className={classnames(styles.__tooltip, styles.tooltip_feedback)} title={item.q}><Iconfont type="icon-yiwen"/></Tooltip> : ''}
              </Button>
            );
          })}
        </div>
        <div className={styles.relativeList}>
          <span>销售相关：</span>
          {relativeList.map(item => {
            return (
              <Button key={item.value} 
                onClick={() => buttonClickEvent(item.value)} className={classnames(
                  { [styles.active]: list.indexOf(item.value) > -1 ? true : false,
                  })}>{item.name}</Button>
            );
          })}
        </div>
        <div className={styles.race_calendar}>
          <div className={styles.raceOperaList}>
            <span>对手操作：</span>
            {raceOperaList.map(item => {
              return (
                <Button key={item.value} 
                  onClick={() => buttonClickEvent(item.value)} className={classnames(
                    { [styles.active]: list.indexOf(item.value) > -1 ? true : false,
                    })}>{item.name}</Button>
              );
            })}
          </div>
        </div>
        <div className={styles.yAxis}>
          <div className={styles.yAxisList}>
            <span>纵坐标：</span>
            {yAxisList.map(item => {
              return (
                <Button key={item.value} 
                  onClick={() => yAxisClick(item.value)} className={classnames(
                    { [styles.active]: properties.indexOf(item.value) > -1 ? true : false }
                  )} >
                  {item.name}
                  {item.q ? <Tooltip className={classnames(styles.__tooltip, styles.tooltip_axis)} title={item.q}><Iconfont type="icon-yiwen"/></Tooltip> : ''}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
   
  );
};
export default DynamicCom;
