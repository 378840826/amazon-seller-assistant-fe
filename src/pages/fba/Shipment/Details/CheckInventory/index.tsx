/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-09 11:31:55
 * @LastEditTime: 2021-05-18 10:06:56
 */
import React, { useState } from 'react';
import styles from './index.less';
import {
  Button,
  Table,
} from 'antd';
import GoodsImg from '@/pages/components/GoodsImg';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { Link } from 'umi';
import { asinPandectBaseRouter } from '@/utils/routes';
import InputEditBox from '@/pages/fba/components/InputEditBox';
interface IProps {
  site: API.Site;
}
 
const CheckInventory: React.FC<IProps> = function(props) {
  const { site } = props;

  const [data] = useState<{ name: string}[]>([
    { name: '111' },
    { name: '111' },
    { name: '111' },
    { name: '111' },
    { name: '111' },
  ]);

  const columns = [
    {
      title: <>
        图片
        <span className="secondary-text">/</span>
        标题
        <span className="secondary-text">/</span>
        ASIN
        <span className="secondary-text">/</span>
        SKU
      </>,
      key: 'sss',
      dataIndex: 'name',
      align: 'center',
      width: 380,
      render(val: string) {
        const { 
          title = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus, non recusandae id vero, quibusdam nobis rem cumque ipsam fugiat hic impedit perferendis veritatis tempora optio aliquam aut officia architecto minima.',
          asin = 'ASINSSFFSF',
          sku = 'WOHWOHFOWHOWHFOWHFOWHF',
          imgUrl = 'xxx',
        } = {};
        return <div className={styles.productCol}>
          <GoodsImg src={imgUrl} alt="商品" width={40}/>
          <div className={styles.details}>
            <a href={getAmazonAsinUrl(val, site)} 
              className={styles.title}
              target="_blank"
              rel="noreferrer"
              title={title}
            >
              <Iconfont type="icon-lianjie" className={styles.linkIcon}/>{title}</a>
            <p>中主上来看肌肤杳杳灯塔粉皮欧文后 我方会创业者伙 化粪池人上粉粉</p>
            <footer>
              <Link 
                to={`${asinPandectBaseRouter}?asin=${asin}`} 
                className={styles.asin}>{asin}
              </Link>
              <span className={styles.sku}>{sku}</span>
            </footer>
          </div>
        </div>; 
      },
    },
    {
      title: <>
        MSKU
        <span className="secondary-text">/</span>
        FnSKU
      </>,
      key: 'sss',
      dataIndex: 'name',
      align: 'left',
      width: 230,
    },
    {
      title: '申报量',
      key: 'sss',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '国内仓可发量',
      key: 'sss',
      dataIndex: 'name',
      align: 'center',
      render() {
        return <InputEditBox value={String(22)} chagneCallback={v => console.log(v)} />;
      },
    },
    {
      title: '差异量',
      key: 'sss',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '库位号',
      key: 'sss',
      dataIndex: 'name',
      align: 'center',
      render() {
        return <div>1号仓 B-4-12-11、2号仓 A-1-2-12</div>;
      },
    },
  ];


  const tableConfig = {
    columns: columns as [],
    dataSource: data,
    className: styles.table,
    scroll: {
      y: 316,
    },
    pagination: false as false,
  };


  return <div className={styles.checkInventoryBox}>
    <header className={styles.topHead}>
      <strong>商品明细</strong>
      <Button type="primary">打印发货单</Button>
    </header>
    <Table {...tableConfig}/>
  </div>;
};

export default CheckInventory;
