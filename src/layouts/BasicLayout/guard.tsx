import React from 'react';
import { useSelector } from 'umi';


const Guard: React.FC = (props) => {
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  console.log(currentShop);
  

  return <h2>hello wrold</h2>;

};


export default Guard;
