import React from 'react';
import styles from './index.less';
import {
  Button,
  message,
} from 'antd';
import { 
  useSelector, 
  ConnectProps, 
  ICompetingGoodsModelState,
  useDispatch,
} from 'umi';
import AsinDetail from './AsinDetails';

interface IProps {
  data: CompetingGoods.ICompetingOneData;
  currency: string;
  marketplace: API.Site;
}

interface IPage extends ConnectProps {
  competingGoods: ICompetingGoodsModelState;
}

const Recommend: React.FC<IProps> = props => {
  const {
    data,
  } = props;

  const dispatch = useDispatch();
  const chosens = useSelector((state: IPage) => state.competingGoods.chosens);

  const changeChosens = () => {
    if (chosens.length >= 10) {
      message.error('最多只能添加10个竞品');
      return;
    }
    
    dispatch({
      type: 'competingGoods/changeChosens',
      payload: data,
    });
  };
  
  // 是否已添加
  const getBtnStatus = () => {
    let isSelect = false;
    chosens.forEach((item) => {
      if (item.asin === data.asin) {
        isSelect = true;
      }
    });

    if (isSelect) {
      return <Button className={`${styles.addBtnItem} ${styles.disabled}`}>已选</Button>;
    }

    return <Button className={styles.addBtnItem} onClick={changeChosens}>选择</Button>;
  };


  return <div className={styles.listStyle}>
    <AsinDetail asininfo={data}/>
    { getBtnStatus() }
  </div>;
};

export default Recommend;
