/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-06 09:22:03
 * 
 * 创建广告活动第二步 （管理模式设置）
 */
import React from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import {
  Form,
  Radio,
} from 'antd';

interface IProps {
  campaignType: CreateCampaign.ICampaignType; // 广告活动类型 SP SB SD
  pattern: CreateCampaign.IManagementMode; // 营销模式
}

const { Item } = Form;
const Pattern: React.FC<IProps> = props => {
  const { campaignType, pattern } = props;

  return <div className={styles.spsdsbBox}>
    <Item 
      name="managementMode" 
      initialValue="standard" 
      label="管理模式：" colon={false}
    >
      <Radio.Group>
        <Radio value="standard">标准模式</Radio>
        <Radio 
          value="ai" 
          // disabled={campaignType === 'sd' ? true : false}
          disabled
        >智能托管</Radio>
      </Radio.Group>
    </Item>
    <p className={styles.explain}>
      <Iconfont type="icon-tishi2" className={styles.explainIcon}/>
      说明：{
        pattern === 'standard' ? '亚马逊后台基本一致的管理流程' : '安知提供的智能化管理流程'
      }
    </p>
    <Item 
      name={['other', 'scene']} 
      initialValue="a" 
      label="营销场景：" colon={false}
      className={classnames(
        campaignType === 'sponsoredProducts' && pattern === 'ai' ? '' : 'none',
        styles.scene
      )}
    >
      <Radio.Group>
        <Radio value="a">新品测款- 稳步获取流量</Radio>
        <Radio value="b">老品优化 - 稳定ACoS</Radio>
        <Radio value="c">曝光优先 - 促进流量爆发</Radio>
        <Radio value="d">高峰期优先 -  bid分时调控</Radio>
      </Radio.Group>
    </Item>
  </div>;
};

export default Pattern;
