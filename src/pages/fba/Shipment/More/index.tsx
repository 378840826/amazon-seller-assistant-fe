/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-18 15:38:05
 * @LastEditTime: 2021-04-23 16:37:10
 */
import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Popover,
} from 'antd';
import Logisticis from './Logisticis';
import PackageList from './PackageList';
import Mark from './Mark';

interface IProps {
  isShipment: boolean; 
}

const More: React.FC<IProps> = props => {
  const { isShipment } = props;
  const [visible, setVisible] = useState<boolean>(true);


  // 上传物流信息
  const uploadLogisticis = function() {
    //
  };

  const popoverConfig = {
    trigger: 'click',
    placement: 'left' as 'left',
  };

  return <div className={styles.box}>
    <Popover 
      placement="bottomRight" 
      title={''} 
      content={<div className={styles.list}>
        {
          isShipment && <>
            <Logisticis />
            <PackageList />
            <Mark/>
            <Popover {...popoverConfig}>
              <span onClick={uploadLogisticis} className={styles.item}>标记出运</span>
            </Popover>
            {/* <Popover {...popoverConfig}>
              <span onClick={uploadLogisticis} className={styles.item}>删除</span>
            </Popover> */}
          </>
        }
        <Popover {...popoverConfig}>
          <span onClick={uploadLogisticis} className={styles.item}>取消</span>
        </Popover>
      </div>} 
      trigger="click"
      visible={visible}
      onVisibleChange={val => setVisible(val)}
    >
      <span className={classnames(styles.showText, visible && styles.active)}>更多</span>
    </Popover>
  </div>;
};

export default More;
