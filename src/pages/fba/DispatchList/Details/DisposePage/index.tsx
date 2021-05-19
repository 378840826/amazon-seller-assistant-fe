/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-09 11:31:55
 * @LastEditTime: 2021-05-18 10:12:41
 */
import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Table, Badge } from 'antd';
import GoodsImg from '@/pages/components/GoodsImg';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { Link } from 'umi';
import { asinPandectBaseRouter } from '@/utils/routes';

interface IProps {
  site: API.Site;
}

const DisposePage: React.FC<IProps> = function(props) {
  const { site } = props;
  // const [data, setData] = useState<any[]>([
  //   { name: '111' },
  //   { name: '111' },
  //   { name: '111' },
  //   { name: '111' },
  //   { name: '111' },
  // ])
  const data: any = []; // eslint-disable-line
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      name: 'Screem',
      platform: 'iOS',
      version: '10.3.4.5654',
      upgradeNum: 500,
      creator: 'Jack',
      createdAt: '2014-12-24 23:12:00',
    });
  }

  const columns = [
    { title: 'ShipmentID', dataIndex: 'name', key: 'name', align: 'center', width: 350, className: styles.oneColumn },
    { title: 'Shipment名称', dataIndex: 'platform', key: 'platform', width: 120 },
    { title: '产品种类', dataIndex: 'version', key: 'version' },
    { title: '申报量', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    { title: '亚马逊仓库代码', dataIndex: 'creator', key: 'creator' },
  ];

  const expandedRowRender = () => {
    const columns = [
      { 
        title: '图片/标题/ASIN/SKU',
        dataIndex: 'date', 
        key: 'date', 
        align: 'center', 
        width: 350,
        className: styles.oneColumn,
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
      { title: 'MSKU/FnSKU', dataIndex: 'name', key: 'name', width: 120 },
      {
        title: '数量',
        key: 'state',
        render: () => (
          <span>
            <Badge status="success" />
            Finished
          </span>
        ),
      },
    ];
    return <Table columns={columns as []} expandable={{
    }} dataSource={data as []} pagination={false} />;
  };


  return <div className={styles.box}>
    <Table
      className={classnames(styles.table, 'components-table-demo-nested')}
      columns={columns as []}
      rowClassName={styles.tow}
      expandable={{
        expandedRowRender,
        expandIconColumnIndex: 5,
        indentSize: 0,
      }}
      dataSource={data}
      scroll={{
        y: 316,
        x: 'max-content',
      }}
      pagination={false}
      expandIcon= {({ expanded, onExpand, record }) =>
        expanded ? (
          <div className={classnames(
            styles.showCol,
            styles.active
          )} onClick={e => onExpand(record, e)}>
            收起
            <Iconfont type="icon-zhankai" className={styles.arrow}/>
          </div>
        ) : (
          <div className={styles.showCol} onClick={e => onExpand(record, e)}>
            展开
            <Iconfont type="icon-zhankai" className={styles.arrow}/>
          </div>
        )}
    />
  </div>;
};

export default DisposePage;
