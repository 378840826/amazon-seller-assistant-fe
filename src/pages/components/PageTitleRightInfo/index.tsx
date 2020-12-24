/**
 * 适用于带标题页面的 功能余量和更新时间等 显示在页面标题右侧
 * 邮件特殊处理
 */
import React, { ReactElement } from 'react';
import { useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import styles from './index.less';

interface IProps {
  // 功能名称
  functionName: string;
  // 如果有更新时间需要显示
  updateTime?: string;
  // 其他内容, 如 特殊格式的更新时间 按钮 等自定义内容
  rightElement?: ReactElement;
  // 整体样式
  containerStyle?: React.CSSProperties;
}

// 名称对应的描述和单位
const nameDict = {
  '绑定店铺': ['剩余可绑定店铺', '个'],
  '广告授权店铺': ['剩余可授权店铺', '个'],
  '子账号': ['剩余设置子账号', '个'],
  '智能调价': ['剩余可开启智能调价SKU', '个'],
  'ASIN报表导出': ['本月剩余可导出次数', '次'],
  'ASIN动态监控': ['剩余可添加ASIN', '个'],
  '跟卖监控': ['剩余可添加ASIN', '个'],
  'Review监控': ['剩余可添加ASIN', '个'],
  '搜索排名监控': ['剩余可添加任务', '个'],
  '自动邮件': ['本月剩余可发送邮件', '封'],
  '手动邮件': ['本月剩余可发送邮件', '封'],
  '补货计划导出': ['本月剩余可导出次数', '次'],
  'PPC托管': ['剩余可托管', '个'],
};

const PageTitleRightInfo: React.FC<IProps> = (props) => {
  const { functionName, updateTime, rightElement, containerStyle } = props;
  const user = useSelector((state: IConnectState) => state.user);
  const { currentUser: { memberFunctionalSurplus } } = user;
  let remainingNumber = 0;
  let autoMail = 0;
  let manualMail = 0;
  // 邮件需要显示两个数值
  if (functionName === '邮件') {
    memberFunctionalSurplus?.forEach(item => {
      item.functionName === '自动邮件' ? autoMail = item.frequency : null;
      item.functionName === '手动邮件' ? manualMail = item.frequency : null;
    });
  } else {
  // 找到 functionName 对应的数据
    remainingNumber = memberFunctionalSurplus?.find(item => 
      item.functionName === functionName
    )?.frequency || 0;
  }

  const nameAndUnit = nameDict[functionName];

  return (
    <div className={styles.pageTitleRight} style={containerStyle}>
      {
        functionName === '邮件'
          ?
          <div className={styles.remaining}>
            本月剩余可发送邮件：
            <span>手动{manualMail}封，自动{autoMail}封</span>
          </div>
          :
          <div className={styles.remaining}>
            {nameAndUnit[0]}：
            <span>{remainingNumber}{nameAndUnit[1]}</span>
          </div>
      }
      {
        updateTime
          ?
          <div className={styles.updateTime}>
            <span>更新时间：</span>{updateTime}
          </div>
          : null
      }
      { rightElement }
    </div>
  );
};

export default PageTitleRightInfo;
