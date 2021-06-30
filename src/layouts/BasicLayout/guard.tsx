import React, { useEffect } from 'react';
import { useSelector, useDispatch, history } from 'umi';

const Guard: React.FC = (props) => {
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'global/fetchShopList',
    });
  }, [dispatch]);

  useEffect(() => {
    if (currentShop.id === undefined ) {
      const url = '/shop/list';
      location.pathname === url ? null : history.push(url);
    }
  }, [currentShop]);

  
  return <>{currentShop && currentShop.id > '-1' ? props.children : ''}</>;

};


export default Guard;
