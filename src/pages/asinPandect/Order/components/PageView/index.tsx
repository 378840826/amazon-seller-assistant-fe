import React, { useState, useRef, useEffect } from 'react';
import styles from './index.less';
import { CloseOutlined } from '@ant-design/icons';
import notImg from '@/assets/stamp.png';
import { Iconfont } from '@/utils/utils';
import { Tooltip, Popover } from 'antd';
import { isEmptyObj } from '@/utils/huang';
import { useDispatch, useSelector } from 'umi';


interface IProps {
  visible?: boolean;
  num: number;
  symbol: string;
  req: {}; // 请求参数
}

interface IList {
  title: string;
  img: string;
  price: number;
  asin: string;
  relatedSalesFrequency: number;
  bigCategoryRank: number;
  bigCategory: string;
  sku: string;
}

const PageView: React.FC<IProps> = (props) => {
  const {
    req,
    symbol,
  } = props;
  const dispatch = useDispatch();
  const [visible, setVisible] = useState<boolean>(false);
  const alerts = useRef(null);
  const test = useRef(null);
  const [list, setList] = useState<IList[]>([]);
  const currentAsin = useSelector((state: AsinOrder.IGlobalAsinTYpe) => state.asinGlobal.asin);
  
  // 请求参数
  useEffect(() => {
    if (visible && !isEmptyObj(req)) {
      new Promise((resolve, reject) => {
        dispatch({
          type: 'asinOrder/getGuanLianSales',
          resolve,
          reject,
          payload: req,
        });
      }).then(datas => {
        const { data } = datas as {
          data: [];
        };
        if (Array.isArray(data)) {
          setList(data);
        }
      }).catch(err => {
        console.error(err);
      });
    }
  }, [dispatch, req, visible]);
  
  const hide = () => {
    setVisible(false);
  };

  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible);
  };

  const handleDetailClick = () => {
    hide();
  };

  const clickDetail = () => {
    setVisible(true);
  };

  // eslint-disable-next-line
  return (
    <Popover
      visible={visible}
      destroyTooltipOnHide
      ref={test}
      trigger="click"
      placement="left"
      onClick={hide}
      onVisibleChange={handleVisibleChange}
      content={
        <div 
          className={`${styles.PageView} page_view_order`}
          ref={alerts}
        >
          <header>
            {currentAsin}关联销售
            <CloseOutlined onClick={handleDetailClick} />
          </header>
          <ul className={styles.list}>
            {
              list.map((item, i) => {
                const link = `https://www.amazon.com/dp/${item.asin}`;
                return <li key={i}>
                  <div className={styles.imgs}>
                    <span className={styles.number}>{i + 1}</span>
                    <img src={item.img || notImg} alt="产品图片"/>
                  </div>
                  <div className={styles.box}>
                    <Tooltip title={item.title}>
                      <a className={styles.title} href={link} rel="noopener noreferrer" target="_blank">
                        <Iconfont 
                          type="icon-lianjie" 
                          className={styles.icon}
                        />
                        {item.title}
                      </a>
                    </Tooltip>
                    <p className={styles.pTwo}>
                      <span>{item.asin}</span>
                      <span className={styles.price}>{symbol}{item.price || 0}</span>
                    </p>
                    <p>{item.sku}</p>
                    <div className={styles.detail}>
                      <p className={styles.sales}>
                        关联销售：
                        <span>{item.relatedSalesFrequency || 0}次</span>
                      </p>
                      <p>
                        <span className={`${styles.ranking} ${ item.bigCategoryRank ? '' : 'none' }`} >
                          #{item.bigCategoryRank}
                        </span>
                        &nbsp;{item.bigCategory || <span style={{
                          color: '#999',
                        }}>—</span>}
                      </p>
                    </div>
                  </div>
                </li>;
              })
            }
          </ul>
          {/* <Spin spinning={listLoading}></Spin> */}
        </div>
      }
    >
      <span 
        className={styles.showName}
        onClick={clickDetail}
      >
        详情
      </span>
    </Popover>
  );

};

export default PageView;
