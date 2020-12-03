import React from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import {
  useDispatch,
} from 'umi';
import { Popconfirm } from 'antd';
import AsinDetail from './AsinDetails';

interface IProps {
  data: CompetingGoods.ICompetingOneData;
  currency: string;
  index: number;
  marketplace: API.Site;
}

const Recommend: React.FC<IProps> = props => {
  const {
    data,
    index,
  } = props;

  const dispatch = useDispatch();
  const delChosenItem = () => {
    dispatch({
      type: 'competingGoods/delChosenItem',
      index,
    });
  };


  return <div className={styles.listStyle}>
    <AsinDetail asininfo={data} />
    <Popconfirm
      title="删除竞品后，此商品将无法按竞品调价，继续删除？"
      onConfirm={delChosenItem}
      okText="继续"
      cancelText="取消"
      placement="left"
      className={styles.delIcon}
    >
      <Iconfont type="icon-guanbi1" />
    </Popconfirm>
  </div>;
};

export default Recommend;
