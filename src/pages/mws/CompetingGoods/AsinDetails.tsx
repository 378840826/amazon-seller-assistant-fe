import React from 'react';
import styles from './index.less';
import HoldImg from '@/assets/stamp.png';
import Express from './Express';
import { getAmazonAsinUrl } from '@/utils/utils';
import { 
  useSelector,
} from 'umi';
import Empyt from './Empyt';
import { Iconfont } from '@/utils/utils';
import ShowData from '@/components/ShowData';

interface IProps {
  style?: React.CSSProperties;
  asininfo: CompetingGoods.ICompetingOneData|null;
}

const AsinDetails: React.FC<IProps> = props => {
  const { 
    asininfo,
    style,
  } = props;

  const {
    currency,
    marketplace,
  } = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  // value转换
  const valueTransition = (value: string|number, isSymbol = false) => { 
    return value === null || value === '' || value === undefined ? <Empyt /> 
      : `${isSymbol ? currency : '' }${value}`;
  };

  if (asininfo === null) {
    return <></>;
  }

  return <div className={styles.listItem} style={{ ...style }}>
    <img src={HoldImg} alt=""/>
    <div className={styles.details}>
      <a 
        href={getAmazonAsinUrl(asininfo.asin, marketplace)} 
        className={styles.newProductLinks}
        target="_blank"
        rel="noreferrer"
      >
        <Iconfont type="icon-lianjie" className={styles.linkIcon1}/>{asininfo.title}
      </a>
      <div className={styles.foot}>
        <p className={styles.brand} title={`品牌：${valueTransition(asininfo.brand)}`}>
          品牌：
          <span>{valueTransition(asininfo.brand)}</span>
        </p>
        <p className={styles.scale}>
          {
            valueTransition(asininfo.reviewScope) ? 
              parseFloat(valueTransition(asininfo.reviewScope) as string).toFixed(1) : 
              valueTransition(asininfo.reviewScope)
          }
          <span className={styles.scaleDetails}>({asininfo.reviewNum})</span> 
        </p>
        <p 
          className={styles.ranking} 
          title={`
          大类排名 #${valueTransition(asininfo.categoryRank) } ${valueTransition(asininfo.categoryName)}
        `}
        >
          {asininfo.categoryRank ? `#${asininfo.categoryRank}` : <Empyt />}
        </p>
        <p className={styles.asin}>{valueTransition(asininfo.asin)}</p>
        <p className={styles.seller} 
          title={`卖家 ${valueTransition(asininfo.sellerName)}`}
        > 
          卖家：
          <span className="seller-name">{valueTransition(asininfo.sellerName)}</span>
        </p>
        <span className={styles.price}><ShowData value={asininfo.price} isCurrency /></span>
        <p className={styles.freight} title={`运费：${valueTransition(asininfo.shipping, true)}`}>
          运费：
          <span><ShowData value={asininfo.shipping} isCurrency /></span>
        </p>
        <Express method={asininfo.fulfillmentChannel} style={{
          paddingLeft: 10,
        }}/>
      </div>
    </div>
  </div>;
};

export default AsinDetails;
