/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 14:41:31
 * @LastEditTime: 2021-04-24 09:13:33
 */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Modal,
  Form,
  Button,
  message,
  Spin,
  Select,
} from 'antd';
import { useDispatch, useSelector, ConnectProps, IFbaBaseState } from 'umi';
import Product from './Product';
import Log from './Log';
import { requestErrorFeedback } from '@/utils/utils';

interface IProps {
  visible: boolean;
  method: 'FBA'| 'overseas'; // 发货方式 FBA和每外仓库
  dispose: boolean; // 是否已处理
  verify: boolean; // 是否已核实
  onCancel: () => void;
  site: API.Site;
  id: number;
}

interface IPage extends ConnectProps {
  fbaBase: IFbaBaseState;
}

const { Option } = Select;
const { Item } = Form;
const Details: React.FC<IProps> = function(props) {
  const {
    visible = true,
    dispose = true,
    verify = true,
    onCancel,
    site,
    id,
  } = props;

  const logistics = useSelector((state: IPage) => state.fbaBase.logistics);

  const [nav, setNav] = useState<'product' | 'log'>('product');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Shipment.IShipmentDetails|null>(null);
  const [product, setProduct] = useState<Shipment.IProductList[]>([]);
  const [log, setLog] = useState<Shipment.ILogs[]>([]);


  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(logistics, 'logistics');
    data && form.setFieldsValue({ logisticMethod: data.shippingType });
  }, [logistics, data, form]);

  useEffect(() => {
    if (id === -1) {
      return;
    }
    setLoading(true);
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'shipment/getShipmentDetails',
        resolve,
        reject,
        payload: { id },
      });
    });

    promise.then(datas => {
      const {
        code,
        message: msg,
        data,
      } = datas as {
        code: number;
        message?: string;
        data: Shipment.IShipmentDetails;
      };

      setLoading(false);
      if (code === 200) {
        setData({ ...data });
        setProduct([...data.productItemVos]);
        setLog([...data.shipmentModifies]);
        return;
      }
      message.error(msg || '获取shipemet详情失败，请重试！');
    });

    dispatch({
      type: 'fbaBase/getLogistics',
      callback: requestErrorFeedback,
    });
  }, [id, dispatch]);

  // 修改申报量
  const updateDeclared = function(newVal: number, index: number) {
    product[index].declareNum = newVal;
    setProduct([...product]);
  };


  return <div className={styles.box}>
    <Modal visible={visible}
      centered
      maskClosable={false}
      width={1180}
      wrapClassName={styles.modalBox}
      onCancel={onCancel}
      footer={null}
    >
      <header className={styles.topHead}>Shipment详情</header>
      <div style={{ margin: '30px 0' }}>
        <Spin spinning={loading}/>
      </div>
      {
        !loading && <Form 
          className={styles.details} 
          layout="horizontal"
          form={form}
        >
          <div className={styles.leftLayout}>
            <div className={styles.item}>
              <span className={styles.text}>状态：</span>
              <span className={styles.content}>{data?.shipmentStatus}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>ShipmentID：</span>
              <span className={styles.content}>{data?.mwsShipmentId}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>Shipment名称：</span>
              <span className={styles.content}>{data?.shipmentName}可以修改</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>货件计划ID：</span>
              <span className={styles.content}>{data?.shipmentId}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>发货单号：</span>
              <span className={styles.content}>{data?.invoiceId}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>站点：</span>
              <span className={styles.content}>{data?.countryCode}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>店铺名称：</span>
              <span className={styles.content}>{data?.storeName}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>目的仓库：</span>
              <span className={styles.content}>{data?.warehouseDe}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>亚马逊仓库代码：</span>
              <span className={styles.content}>{data?.destinationFulfillmentCenterId}</span>
            </div>
          </div>
          
          <div className={styles.centerLayout}>
            <div className={styles.item}>
              <span className={styles.text}>物流方式：</span>
              <Item name="logisticMethod" className={styles.selectBox}>
                <Select size="small" className={styles.select}>
                  {logistics.map((item, i) => <Option value={item} key={i}>
                    {item}
                  </Option>)}
                </Select>
              </Item>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>物流单号：</span>
              {data?.shippingId}
            </div>
            <div className={styles.item}>
              <span className={styles.text}>物流跟踪号：</span>
              {data?.trackingId}
            </div>
            <div className={styles.item}>
              <span className={styles.text}>包装方式：</span>
              {data?.areCasesRequired}
            </div>
            <div className={styles.item}>
              <span className={styles.text}>贴标方：</span>
              <span className={styles.content}>{data?.labelingType}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>发货地址：</span>
              <span className={styles.content}>{data?.addressLine1}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>ReferenceID：</span>
              <span className={styles.content}>{data?.referenceId}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>产品种类：</span>
              <span className={styles.content}>{data?.mskuNum}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>申报量：</span>
              <span className={styles.content}>{data?.declareNum}</span>
            </div>
          </div>
          
          <div className={styles.rightLayout}>
            <div className={styles.item}>
              <span className={styles.text}>已发量：</span>
              <span className={styles.content}>{data?.issuedNum}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>已收量：</span>
              <span className={styles.content}>{data?.receivedNum}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>创建人：</span>
              <span className={styles.content}>{data?.userName}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>创建时间：</span>
              <span className={styles.content}>{data?.gmtCreate}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>开始收货日期：</span>
              <span className={styles.content}>{data?.receivingTime}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>更新时间：</span>
              <span className={styles.content}>{data?.gmtModified}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>装箱单附件：</span>
              {/* 名称后端说写死 */}
              <a href={data?.txtUrl}>下载附件</a> 
            </div>
          </div>
        </Form>
      }

      <div className={classnames(styles.navs, loading && 'none')}>
        <nav className={styles.nav}>
          <span className={classnames(
            styles.navItem, 
            nav === 'product' ? styles.active : ''
          )}
          onClick={() => setNav('product')}
          >商品明细</span>
          <span className={classnames(
            styles.navItem, 
            nav === 'log' ? styles.active : ''
          )}
          onClick={() => setNav('log')}
          >操作日志</span>
        </nav>
      </div>
      
      {/* // 商品 */}
      {
        !loading && nav === 'product' && <Product verify={verify} dispose={dispose} site={site} data={product} updateDeclared={updateDeclared} />
      }
      {/* 操作日志 */}
      {
        !loading && nav === 'log' && <Log dispose={dispose} data={log}/>
      }
      <footer className={styles.btns}>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={onCancel} type="primary">保存</Button>
        <Button onClick={onCancel} type="primary">打印清单</Button>
      </footer>
    </Modal>
  </div>;
};


export default Details;
