import React, { useState, useEffect } from 'react';
import styles from '../index.less';
import { DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import {
  Button,
  Spin,
  Dropdown,
  Menu,
  Checkbox,
  Input,
  message,
} from 'antd';


interface IProps {
  cb: () => void;
  flag: boolean;
}

const Remind: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const {
    flag,
    cb,
  } = props;

  // store
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  const menus = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']; // 跟卖者数量列表

  // state
  const [remind, setRemind] = useState<boolean>(false); // 提醒设定显隐
  const [loading, setLoading] = useState<boolean>(true); // loading
  // 是否勾选 当跟卖者包含
  const [optFollowSeller, setOptFollowSeller] = useState<boolean>(false);
  // 是否勾选 Amazon
  const [optAmazon, setOptAmazon] = useState<boolean>(false);
  // 是否勾选 FBA卖家
  const [optFbaSeller, setOptFbaSeller] = useState<boolean>(false);
  // 是否勾选 FBM卖家
  const [optFbmSeller, setOptFbmSeller] = useState<boolean>(false);
  // 其他  (卖家id)
  const [sellerIds, setSellerIds] = useState<string>('');
  // 是否勾选 跟卖者数量
  const [optFollowSellerQuantity, setOptFollowSellerQuantity] = useState<boolean>(false);
  // 跟卖者数量
  const [followSellerQuantity, setFollowSellerQuantity] = useState<string>('1');
  // 是否勾选 Buybox卖家不是我
  const [optBuyboxSellerNotMe, setOptBuyboxSellerNotMe] = useState<boolean>(false);

  useEffect(() => {
    setRemind(false);
  }, [flag]);

  // 点击其它地方隐藏
  useEffect(() => {
    document.addEventListener('click', () => {
      setRemind(false);
    });
  });

  // 点击跟卖者的处理
  // eslint-disable-next-line
  const menuClick = (item: any) => {
    setFollowSellerQuantity(item.key);
  };

  // 初始化提醒设定
  useEffect(() => {
    if (Number(currentShop.id) === -1) {
      return;
    }
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/getFollowRemind',
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
        },
        resolve,
        reject,
      });
    }).then(datas => {
      setLoading(false);
      const { data } = datas as {
        data: {
          optFollowSeller: boolean;
          optAmazon: boolean;
          optFbaSeller: boolean;
          optFbmSeller: boolean;
          sellerIds: string;
          optFollowSellerQuantity: boolean;
          followSellerQuantity: string;
          optBuyboxSellerNotMe: boolean;
        };
      };
      setOptFollowSeller(data.optFollowSeller || false);
      setOptAmazon(data.optAmazon || false);
      setOptFbaSeller(data.optFbaSeller || false);
      setOptFbmSeller(data.optFbmSeller || false);
      setSellerIds(data.sellerIds || '');
      setOptFollowSellerQuantity(data.optFollowSellerQuantity || false);
      setFollowSellerQuantity(String(data.followSellerQuantity || 1));
      setOptBuyboxSellerNotMe(data.optBuyboxSellerNotMe || false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [dispatch, currentShop]);

  // 修改提醒设定
  const updateRemind = () => {
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/updateFollowRemind',
        payload: {
          optFollowSeller,
          optAmazon,
          optFbaSeller,
          optFbmSeller,
          sellerIds,
          optFollowSellerQuantity,
          followSellerQuantity,
          optBuyboxSellerNotMe,
          headersParams: {
            StoreId: currentShop.id,
          },
        },
        resolve,
        reject,
      });
    }).then( datas => {
      const { message: msg } = datas as { message: string };
      setLoading(false);
      message.success(msg);
      setRemind(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  // 监控提醒设定组件
  useEffect(() => {
    if (remind) {
      cb ? cb() : null;
    }
  }, [remind]); // eslint-disable-line

  const menu = (
    <Menu onClick={menuClick} selectedKeys={[followSellerQuantity]}>
      {
        menus.map(item => <Menu.Item key={item} style={{
          textAlign: 'center',
        }}>{item}</Menu.Item>)
      }
    </Menu>
  );

  const remindMenu = (
    <Menu className={styles.remind}>
      <Menu.Item>
        <div onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
          <Spin spinning={loading}>
            <p className={styles.one}>
              <Checkbox 
                checked={optFollowSeller} 
                onChange={() => setOptFollowSeller(!optFollowSeller)}>
                当前跟卖者包括</Checkbox>
            </p>
            <div className={styles.seller}>
              <Checkbox 
                checked={optAmazon} 
                onChange={() => setOptAmazon(!optAmazon)}>
                  Amazon</Checkbox>
              <Checkbox 
                checked={optFbaSeller} 
                onChange={() => setOptFbaSeller(!optFbaSeller)}>FBA卖家</Checkbox>
              <Checkbox 
                checked={optFbmSeller}
                onChange={() => setOptFbmSeller(!optFbmSeller)}
              >FBM卖家</Checkbox>
              <span>其他</span>
              <Input
                placeholder="输入其他买家ID，逗号间隔"
                onChange={e => setSellerIds(e.target.value)}
                value={sellerIds}
                style={{
                  width: 200,
                  marginLeft: 10,
                }}
              />
            </div>
            <p className={styles.downlist}>
              <Checkbox 
                checked={optFollowSellerQuantity}
                onChange={() => setOptFollowSellerQuantity(!optFollowSellerQuantity)}
              >当跟卖者数量≥&nbsp;&nbsp;</Checkbox>
              <Dropdown overlay={menu}>
                <Button>
                  <span className={styles.dwt}>{followSellerQuantity}</span>
                  <DownOutlined />
                </Button>
              </Dropdown>
            </p>
            <p className={styles.buybox}>
              <Checkbox 
                checked={optBuyboxSellerNotMe}
                onChange={() => setOptBuyboxSellerNotMe(!optBuyboxSellerNotMe)}
              >当Buybox卖家不是我</Checkbox>
            </p>
            <div className={styles.foot_btn}>
              <Button 
                className={styles.btns} 
                onClick={ () => setRemind(false)}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                className={styles.btns}
                onClick={updateRemind}
              >确定</Button>
            </div>
          </Spin>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div onClick={e => e.nativeEvent.stopImmediatePropagation()}>
      <Dropdown 
        overlay={remindMenu} 
        trigger={['click']} 
        visible={remind}
        placement="bottomRight"
      >
        <Button onClick={() => setRemind(!remind)}>提醒设定</Button>
      </Dropdown>
    </div>
  );
};

export default Remind;
