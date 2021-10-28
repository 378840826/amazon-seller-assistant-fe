/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-25 10:46:44
 * @LastEditTime: 2021-04-29 16:57:56
 */
import React from 'react';
import styles from './index.less';
import GoodsImg from '@/pages/components/GoodsImg';
import { sumVolumeOversize, sumWeightOversize, packSizeUnit, packWeightUnit } from './config';
import moment from 'moment';
import EditSku from './EditSku';

interface IProps {
  updateSku: (newData: skuData.IRecord) => void;
  onBatchDel: (id: string) => void;
}

// 获取包装体积、商品体积的中文名称
const getPsLabel = function(unit: 'feet'|'m'|'cm'|'inch') {
  for (let i = 0; i < packSizeUnit.length; i++) {
    const item = packSizeUnit[i];
    if (item.value === unit) {
      return item.label;
    }
  }
};

// 获取包装体积、商品体积的中文名称
const getWeightLabel = function(unit: 'g'|'kg'|'ounce'|'pound') {
  for (let i = 0; i < packWeightUnit.length; i++) {
    const item = packWeightUnit[i];
    if (item.value === unit) {
      return item.label;
    }
  }
};

const Empty = () => <span className="secondary-text">—</span>;
const emptys = [undefined, null, ''];

const Columns = (props: IProps) => {
  const { updateSku, onBatchDel } = props;
  return [
    {
      title: '状态',
      align: 'center',
      width: 80,
      dataIndex: 'state',
      key: 'state',
      fixed: 'left',
    },
    {
      title: 'SKU',
      align: 'let',
      width: 170,
      dataIndex: 'sku',
      key: 'sku',
      fixed: 'left',
      render(val: string) {
        return <p className={styles.skuCol}>{val}</p>;
      },
    },
    {
      title: '首图',
      align: 'center',
      width: 70,
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render(val: string) {
        return <GoodsImg src={val || ''} className={styles.imgCol} width={42} />;
      },
    },
    {
      title: '包装图',
      align: 'center',
      width: 70,
      dataIndex: 'pimageUrl',
      key: 'pimageUrl',
      render(val: string) {
        return <GoodsImg src={val || ''} className={styles.imgCol} width={42} />;
      },
    },
    {
      title: '品类',
      align: 'center',
      width: 100,
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '中文品名',
      align: 'center',
      width: 100,
      dataIndex: 'nameNa',
      key: 'nameNa',
    },
    {
      title: '英文品名',
      align: 'center',
      width: 100,
      dataIndex: 'nameUs',
      key: 'nameUs',
    },
    {
      title: '商品体积',
      align: 'center',
      width: 120,
      dataIndex: 'commodityLong',
      key: 'commodityLong',
      render(_: string, record: skuData.IRecord) {
        const { commodityLong, commodityWide, commodityHigh, commodityType } = record;
        return <div 
          className={styles.productInfo} 
          title={`长度：${commodityLong || ' - '} \n宽度：${commodityWide || ' - '} \n高度：${commodityHigh || ' - '}`}
        >
          <p>{`${commodityLong || ' - '}*${commodityWide || ' - '}*${commodityHigh || ' - '} ${getPsLabel(commodityType)}`}</p>
          <span className="secondary-text">{
            sumVolumeOversize(commodityType, {
              width: commodityLong,
              wide: commodityWide,
              height: commodityHigh,
            })}</span>
        </div>;
      },
    },
    {
      title: '商品重量',
      align: 'center',
      width: 100,
      dataIndex: 'commodityWeight',
      key: 'commodityWeight',
      render(val: number, record: skuData.IRecord) {
        return <div className={styles.weightCol}>
          <p>{`${val || ' - '}${getWeightLabel(record.commodityWeightType)}`}</p>
          <span className="secondary-text">{sumWeightOversize(record.commodityWeightType, val)}</span>
        </div>;
      },
    },
    {
      title: '包装体积',
      align: 'center',
      width: 100,
      dataIndex: 'name',
      render(_: string, record: skuData.IRecord) {
        const { packingLong, packingWide, packingHigh, packingType } = record;
        return <div 
          className={styles.productInfo} 
          title={`长度：${packingLong || ' - '} \n宽度：${packingWide || ' - '} \n高度：${packingHigh || ' - '}`}
        >
          <p>{`${packingLong || ' - '}*${packingWide || ' - '}*${packingHigh || ' - '} ${getPsLabel(packingType || ' - ')}`}</p>
          <span className="secondary-text">{
            sumVolumeOversize(packingType, {
              width: packingLong,
              wide: packingWide,
              height: packingHigh,
            }) ? 'oversize' : ''}</span>
        </div>;
      },
    },
    {
      title: '包装重量',
      align: 'center',
      width: 100,
      dataIndex: 'packingWeight',
      key: 'packingWeight',
      render(val: number, record: skuData.IRecord) {
        return <div className={styles.weightCol}>
          <p>{`${val || ' - '}${getWeightLabel(record.packingWeightType)}`}</p>
          <span className="secondary-text">{
            sumWeightOversize(record.packingWeightType, val) ? 'oversize' : ''}</span>
        </div>;
      },
    },
    {
      title: '包装类型',
      align: 'center',
      width: 100,
      dataIndex: 'packingMaterial',
      render: (val: string) => (val === 'other' ? '其他' : val),
    },
    {
      title: '易碎品',
      align: 'center',
      width: 100,
      dataIndex: 'isFragile',
      render: (val: boolean) => (val ? '是' : '否'),
    },
    {
      title: '库位号',
      align: 'left',
      width: 80,
      dataIndex: 'locationNos',
      key: 'locationNos',
      render(_: string, record: skuData.IRecord ) {
        if (record.locationNos.length === 0) {
          return <Empty />;
        }

        return <div className={styles.bedNumberCol}>
          {record.locationNos.map((item, index) => {
            return <span key={index} className={styles.text}>
              {item.locationNo}
              {record.locationNos.length - 1 === index ? '' : '、'}
            </span>;
          })}</div>;
      },
    },
    {
      title: '关联MSKU',
      align: 'center',
      width: 100,
      dataIndex: 'mskus',
      key: 'mskus',
      render(data: string[]) {
        return <div>{data.length}</div>;
      },
    },
    {
      title: '采购成本',
      align: 'center',
      width: 100,
      dataIndex: 'purchasingCost',
      key: 'purchasingCost',
      render(val: string) {
        if (emptys.includes(val)) {
          return <Empty />;
        }
        return `￥${val}`;
      },
    },
    {
      title: '包装成本',
      align: 'center',
      width: 100,
      dataIndex: 'packagingCost',
      key: 'packagingCost',
      render(val: string) {
        if (emptys.includes(val)) {
          return <Empty />;
        }
        return `￥${val}`;
      },
    },
    {
      title: '指导价',
      align: 'center',
      width: 100,
      dataIndex: 'price',
      key: 'price',
      render(val: string) {
        if (emptys.includes(val)) {
          return <Empty />;
        }
        return `￥${val}`;
      },
    },
    {
      title: '业务开发员',
      align: 'center',
      width: 100,
      dataIndex: 'salesman',
      key: 'salesman',
      render(val: string) {
        if (emptys.includes(val)) {
          return <Empty />;
        }
        return val;
      },
    },
    {
      title: '创建人',
      align: 'center',
      width: 100,
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '创建时间',
      align: 'center',
      width: 100,
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      render: (val: string) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      align: 'center',
      width: 100,
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      render: (val: string) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      dataIndex: 'id',
      fixed: 'right',
      render(id: string, record: skuData.IRecord) {
        return (
          <div className={styles.operation}>
            <EditSku initData={record} updateSku={updateSku}/>
            <span className={styles.delete} onClick={() => onBatchDel(id)}>删除</span>
          </div>
        );
      },
    },
  ];
};

export default Columns;
