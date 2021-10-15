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
  shipmentData: Shipment.IShipmentList;
  handleMarkShipped: () => void;
  handleCancelShipment: () => void;
}

const More: React.FC<IProps> = props => {
  const {
    shipmentData: { mwsShipmentId, shipmentState, zipUrl, id },
    handleMarkShipped, handleCancelShipment,
  } = props;
  const [visible, setVisible] = useState<boolean>(false);
  // 是否已出运， 待修改
  const isShipped = shipmentState !== 'WORKING';

  // const popoverConfig = {
  //   trigger: 'click',
  //   placement: 'left' as 'left',
  // };
   
  //生成下载MSKU模板链接
  function getDownloadUrl() {
    const baseUrl = '/api/mws/shipment/plan/get/itemList/download';
    return `${baseUrl}?id=${id}`;
  }

  return <div className={styles.box}>
    <Popover 
      placement="bottomRight" 
      title={''} 
      content={<div className={styles.list}>
        {
          // 如果shipment已出运，就只有“取消”，其他按钮都没有了
          !isShipped && <>
            <a download href={getDownloadUrl()} className={styles.item}>下载SKU列表</a>
            <Logisticis mwsShipmentId={mwsShipmentId}/>
            <PackageList mwsShipmentId={mwsShipmentId} />
            <Mark zipUrl={zipUrl}/>
            <span onClick={() => handleMarkShipped()} className={styles.item}>标记出运</span>
            {/* 删除功能先搁置
            <Popover {...popoverConfig}>
              <span onClick={} className={styles.item}>删除</span>
            </Popover> */}
          </>
        }
        <span onClick={handleCancelShipment} className={styles.item}>取消</span>
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
