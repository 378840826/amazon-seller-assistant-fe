import React, { useState, useEffect } from 'react';
import styles from '../index.less';
import { useDispatch, useSelector } from 'umi';
import classnames from 'classnames';
import {
  Button,
  Spin,
  Dropdown,
  Checkbox,
  Input,
  message,
  Switch,
  Form,
  Select,
} from 'antd';


interface IProps {
  cb: () => void;
  flag: boolean;
}

const { Item } = Form;
const Remind: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const {
    flag,
    cb,
  } = props;

  // store
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  const [form] = Form.useForm();

  const menus = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']; // 跟卖者数量列表

  // state
  const [remind, setRemind] = useState<boolean>(false); // 提醒设定显隐
  const [loading, setLoading] = useState<boolean>(true); // loading

  useEffect(() => {
    setRemind(false);
  }, [flag]);

  // 点击其它地方隐藏
  useEffect(() => {
    document.addEventListener('click', () => {
      setRemind(false);
    });
  });


  // 初始化提醒设定
  useEffect(() => {
    if (Number(currentShop.id) === -1) {
      return;
    }

    if (remind === false) {
      return;
    }

    setLoading(true);
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
      form.setFieldsValue({
        optFollowSeller: data.optFollowSeller || false,
        optAmazon: data.optAmazon || false,
        optFbaSeller: data.optFbaSeller || false,
        optFbmSeller: data.optFbmSeller || false,
        optFollowSellerQuantity: data.optFollowSellerQuantity || false,
        optBuyboxSellerNotMe: data.optBuyboxSellerNotMe || false,
        followSellerQuantity: String(data.followSellerQuantity || 1),
        sellerIds: data.sellerIds || '',
      });
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [dispatch, currentShop, form, remind]);

  // 修改提醒设定
  const updateRemind = () => {
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/updateFollowRemind',
        payload: {
          ...form.getFieldsValue(),
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

  const onFieldsChange = () => {
    console.log(form.getFieldsValue());
  };

  const remindMenu = (
    <div className={styles.remind}>
      <Spin spinning={loading}>
        <Form form={form} onFieldsChange={onFieldsChange} onFinish={updateRemind}>
          <Item name="optFollowSeller" 
            label="当前跟卖者包括" 
            colon={false} 
            valuePropName="checked"
            className={styles.switchRow}
          >
            <Switch size="small" className={classnames( styles.switch)}></Switch>
          </Item>
          <div className={styles.twoRow}>
            <Item name="optAmazon" valuePropName="checked" colon={false} className={styles.checkbox}>
              <Checkbox>Amazon</Checkbox>
            </Item>
            <Item name="optFbaSeller" valuePropName="checked" colon={false} className={styles.checkbox}>
              <Checkbox>FBA</Checkbox>
            </Item>
            <Item name="optFbmSeller" valuePropName="checked" colon={false} className={styles.checkbox}>
              <Checkbox>FBM</Checkbox>
            </Item>
            <Item name="sellerIds" label="其他" colon={false} className={styles.inputs}>
              <Input className={styles.input}/>
            </Item>
          </div>
          <div className={styles.threeRow}>
            <Item 
              className={styles.switchRow}
              label="当跟卖者数量≥" 
              colon={false}
              name="optFollowSellerQuantity"
              valuePropName="checked"
            >
              <Switch size="small" className={classnames( styles.switch)}></Switch>
            </Item>
            <Item name="followSellerQuantity" className={styles.downList}>
              <Select dropdownClassName={styles.globalDownList}>
                {
                  menus.map((item => (
                    <Select.Option value={item} key={item}>{item}</Select.Option>
                  )))
                }
              </Select>
            </Item>
          </div>
          <Item 
            className={styles.switchRow}
            label="当Buybox卖家不是我" 
            colon={false}
            name="optBuyboxSellerNotMe"
            valuePropName="checked"
          >
            <Switch size="small" className={classnames( styles.switch)}></Switch>
          </Item>
          <div className={styles.btns}>
            <Button onClick={() => setRemind(false)}>取消</Button>
            <Button type="primary" htmlType="submit">确定</Button>
          </div>
        </Form>
      </Spin>
    </div>
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
