import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { 
  useSelector,
  ConnectProps, 
  ICompetingGoodsModelState,
  useDispatch,
} from 'umi';
import {
  Spin,
  Button,
} from 'antd';
import AsinDetail from './AsinDetails';

interface IProps {
  asininfo: CompetingGoods.ICompetingOneData|null|string;
}

interface IPage extends ConnectProps {
  competingGoods: ICompetingGoodsModelState;
}

const SearchResult: React.FC<IProps> = props => {
  const {
    asininfo,
  } = props;

  
  const chosens = useSelector((state: IPage) => state.competingGoods.chosens);
  const dispatch = useDispatch();

  if (asininfo === null) {
    return <Spin size="large" className={styles.searchLoading}></Spin>;
  }

  const changeChosens = () => {

    dispatch({
      type: 'competingGoods/changeChosens',
      payload: asininfo,
    });
  };

  // 是否已添加
  const getBtnStatus = () => {
    let isSelect = false;
    if (typeof asininfo === 'string') {
      return;
    }
    chosens.forEach((item) => {
      if (item.asin === asininfo.asin) {
        isSelect = true;
      }
    });

    if (isSelect) {
      return <Button className={`${styles.addBtnItem} ${styles.disabled}`}>已选</Button>;
    }

    return <Button className={styles.addBtnItem} onClick={changeChosens}>选择</Button>;
  };


  if (asininfo === null) {
    return <></>;
  }

  if (typeof asininfo === 'string') {
    return <h2 style={{
      color: '#888',
    }}>{asininfo}</h2>;
  }

  return <div className={classnames(styles.listItem, styles.twoLayoutContent)}>
    <AsinDetail asininfo={asininfo} />
    { getBtnStatus() }
  </div>;
};

export default SearchResult;
