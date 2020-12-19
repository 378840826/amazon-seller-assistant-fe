import React, { useEffect } from 'react';
import { useSelector, useDispatch, history } from 'umi';

const Guard: React.FC = (props) => {
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const dispatch = useDispatch();

  useEffect(() => {
    const type = location.pathname.includes('/ppc') ? 'ppc' : 'mws';
    dispatch({
      type: 'global/fetchShopList',
      payload: { type },
    });
  }, [dispatch]);

  useEffect(() => {
    if (currentShop.id === undefined ) {
      const type = location.pathname.includes('/ppc') ? 'ppc' : 'mws';
      const url = type === 'mws' ? '/shop/list' : '/ppc/shop/list';
      history.push(url);
    }
  }, [currentShop]);

  
  return <>{currentShop && currentShop.id > '-1' ? props.children : ''}</>;

};


export default Guard;
