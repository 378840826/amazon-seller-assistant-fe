/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 14:41:31
 * @LastEditTime: 2021-05-18 10:39:34
 * 
 * 发货单详情
 */
import React, { useEffect, useState, useRef, PureComponent } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Modal,
  Form,
  Button,
  message,
  Select,
} from 'antd';
import { useDispatch } from 'umi';
import Product from './Product';
import Log from './Log';
import { useReactToPrint } from 'react-to-print';
import InputEditBox from '@/pages/fba/components/InputEditBox';
import moment from 'moment';
import Label from './label';

const { Item } = Form;
const { Option } = Select;

interface IProps {
  visible: boolean;
  onCancel: () => void;
  site: API.Site;
  data: DispatchList.IDispatchDetail;
  logistics: string[];
  onUpdateDispatch: (params: { [key: string]: string; id: string }) => Promise<boolean>;
}

interface IPrintProps {
  data: DispatchList.IDispatchDetail;
  combined: number;
}

interface ILabelType {
  modalvisible: boolean;
  recordData: DispatchList.IProductVos;  
}

const pageStyle = `
  @media print {
    html, body {
      width: 100%;
      height: initial !important;
      overflow: initial !important;
      -webkit-print-color-adjust: exact;
    }
    section {page-break-before: always;}
  }
`;

class ComponentToPrint extends PureComponent<IPrintProps> {
  constructor(props: IPrintProps) {
    super(props);
  }

  render() {
    const { 
      data: { 
        gmtCreate, 
        shippingType, 
        userName,
        mwsShipmentId, 
        invoiceId, 
        casesRequired, 
        productItemVos, 
        shipmentName,
      }, 
      combined,
    } = this.props;
    return (
      <div className={styles.printtable}>
        <table>
          <thead>
            <tr>
              <td>创建日期</td>
              <td colSpan={6}>{gmtCreate && moment(gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
            <tr>
              <td>创建人</td>
              <td colSpan={6}>{userName}</td>
            </tr>
            <tr>
              <td>Shipment名称</td>
              <td colSpan={6}>{shipmentName}</td>
            </tr>
            <tr>
              <td>ShipmentID</td>
              <td colSpan={6}>{mwsShipmentId}</td>
            </tr>
            <tr>
              <td>发货单号</td>
              <td colSpan={6}>{invoiceId}</td>
            </tr>
            <tr>
              <td>拣货员</td>
              <td colSpan={6}></td>
            </tr>
            <tr>
              <td>物流方式</td>
              <td colSpan={6}>{shippingType}</td>
            </tr>
            <tr>
              <th>MSKU</th>
              <th>发货量</th>
              <th>实际发货量</th>
              <th>FNSKU</th>
              <th>SKU</th>
              <th>中文名称</th>
              <th>包装方式</th>
            </tr>
          </thead>
          <tbody>
            {
              productItemVos?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td width={240}>{item.sellerSku}</td>
                    <td width={110}>{item.declareNum}</td>
                    <td width={110}></td>
                    <td width={110}>{item.fnsku}</td>
                    <td width={110}>{item.sku}</td>
                    <td width={270}>{item.nameNa ? item.nameNa : '-' }</td>
                    <td width={100}>{casesRequired}</td>
                  </tr>
                );
              })
            }
            <tr>
              <td>合计</td>
              <td>{combined}</td>
              <td colSpan={5}></td>
            </tr>
          </tbody>
        </table>
      </div>);
  }
}

const Details: React.FC<IProps> = function(props) {
  const {
    visible = true,
    onCancel,
    site,
    data,
    logistics,
    onUpdateDispatch,
  } = props;

  const [form] = Form.useForm();
  form.setFieldsValue({ 
    shippingType: data.shippingType,
    shippingId: data.shippingId,
    trackingId: data.trackingId,
    remarkText: data.remarkText,
  });

  const [nav, setNav] = useState<'product' | 'log' | 'notShow'>('product');
  const [initData, setInitData] = useState<DispatchList.IDispatchDetail|null>(null); // 
  const [productVos, setProductVos] = useState<DispatchList.IProductVos[]>([]); // 商品明细
  const [logs, setLogs] = useState<DispatchList.IDispatchLog[]|null>(null); // 操作日志
  const 
    [printdata, setPrintdata] = 
      useState<DispatchList.IDispatchDetail>({} as DispatchList.IDispatchDetail);

  //合计申报量
  const [combined, setCombined] = useState<number>(0);

  const componentRef = useRef<any>(); // eslint-disable-line
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    
    pageStyle: pageStyle,
  });

  //加上合计
  const printlists = async() => {  
    let sum = 0;
    await productVos.forEach(item => {
      sum += Number(item.declareNum);
    });

    setCombined(sum);
    handlePrint && handlePrint();
  
  };

  const [lebalModalData, setLabelModalData] = useState<ILabelType>({
    modalvisible: false,
    recordData: {
      id: '',
      url: '',
      itemName: '',
      asin1: '',
      sku: '',
      sellerSku: '',
      fnsku: '',
      issuedNum: 0,
      receiveNum: 0,
      disparityNum: 0,
      nameNa: '',
      locationNo: [],
      declareNum: '',
    },   
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!visible) {
      return;
    }
    // 获取需要打印的数据
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'fbaDispatchList/getInvoiceDetail',
        resolve,
        reject,
        payload: { id: data.id },
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    promise.then((res: any) => {
      const { code, data, message: msg } = res;
      if (code === 200) {
        setInitData({ ...data });
        setProductVos([...data.productItemVos]);
        setLogs([...data.shipmentModifies]);
        setPrintdata({ ...data });
      } else {
        message.error(msg || '获取初始化数据失败！请重试');
      }
    });
  }, [dispatch, visible, data]);

  function handleSave() {
    const formVal = form.getFieldsValue();
    onUpdateDispatch({ id: data.id, ...formVal });
  }

  //批量打印的回调
  const batchPrintClick = () => {
    setLabelModalData({ modalvisible: true, recordData: productVos[0] });
  };

  return <div className={styles.box}>
    <Modal
      visible={visible}
      centered
      maskClosable={false}
      width={1180}
      wrapClassName={styles.modalBox}
      onCancel={onCancel}
      footer={null}
    >
      <header className={styles.topHead}>发货单详情</header>
      <Form form={form} className={styles.details} layout="horizontal">
        <div className={styles.leftLayout}>
          <div className={styles.item}>
            <span className={styles.text}>状态：</span>
            <span className={styles.content}>{initData?.state}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>发货单号：</span>
            <span className={styles.content} title={initData?.invoiceId}>
              {initData?.invoiceId}
            </span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>货件计划ID：</span>
            <span className={styles.content} title={initData?.shipmentId}>
              {initData?.shipmentId}
            </span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>ShipmentID：</span>
            <span className={styles.content}>{initData?.mwsShipmentId}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>站点：</span>
            <span className={styles.content}>{initData?.countryCode}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>店铺名称：</span>
            <span className={styles.content}>{initData?.storeName}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>目的仓库：</span>
            <span className={styles.content}>{initData?.warehouseDe}</span>
          </div>
          
        </div>
        
        <div className={styles.centerLayout}>
          <div className={styles.item}>
            <span className={styles.text}>亚马逊仓库代码：</span>
            <span className={styles.content}>{initData?.destinationFulfillmentCenterId}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>物流方式：</span>
            <Item name="shippingType" className={styles.select}>
              <Select dropdownMatchSelectWidth={false}>
                {logistics && logistics.map((item, index) => {
                  return <Option value={item} key={index}>{item}</Option>;
                })}
              </Select>
            </Item>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>物流单号：</span>
            <Item name="shippingId" className={styles.select}>
              <InputEditBox
                value={String(data.shippingId)}
                chagneCallback={val => form.setFieldsValue({ shippingId: val })}
              />
            </Item>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>物流跟踪号：</span>
            <Item name="trackingId" className={styles.select}>
              <InputEditBox
                value={String(data.trackingId)}
                chagneCallback={val => form.setFieldsValue({ trackingId: val })}
              />
            </Item>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>包装方式：</span>
            {initData?.casesRequired}
          </div>
          <div className={styles.item}>
            <span className={styles.text}>贴标方：</span>
            <span className={styles.content}>{initData?.labelingType}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>发货仓库：</span>
            <span className={styles.content}>{initData?.warehouseName}</span>
          </div>
        </div>
        
        <div className={styles.rightLayout}>
          <div className={styles.item}>
            <span className={styles.text}>发货地址：</span>
            <span className={styles.content}>{initData?.addressLine1}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>清单打印：</span>
            <span className={styles.content}>{initData?.printingState}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>创建人：</span>
            <span className={styles.content}>{initData?.userName}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>创建时间：</span>
            <span className={styles.content}>{initData?.gmtCreate}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>更新时间：</span>
            <span className={styles.content}>{initData?.gmtModified}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>预计到仓时间：</span>
            <span className={styles.content}>{initData?.estimatedTime}</span>
          </div>
          <div className={styles.remark}>
            <span className={styles.text}>备注：</span>
            <Item name="remarkText" className={styles.select}>
              <InputEditBox
                value={String(data.remarkText)}
                chagneCallback={val => {
                  if (String(val).length > 40) {
                    message.warning('备注不得超过40个字符');
                    form.setFieldsValue({ remarkText: String(val).slice(0, 40) });
                    return;
                  }
                  form.setFieldsValue({ remarkText: val });
                  return Promise.resolve(val);
                }}
              />
            </Item>
          </div>
        </div>
      </Form>

      <div className={styles.navs}>
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
        <Button onClick={batchPrintClick} type="primary" className={styles.batchbutton}>批量打印标签</Button>
        <Label 
          site={site} 
          data={productVos} 
          modalData={lebalModalData} 
          onCancle={() => {
            lebalModalData.modalvisible = false; 
            setLabelModalData({ ...lebalModalData });
          }}
        />
      </div>
      
      { nav === 'product' && <Product site={site} data={productVos}/> }
      { nav === 'log' && <Log data={logs}/> }
      <footer className={styles.btns}>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={handleSave} type="primary">保存</Button>
        <Button onClick={printlists} type="primary">打印发货单</Button>
      </footer>

      <div style={{ display: 'none' }}>
        <ComponentToPrint ref={componentRef} data={printdata} combined={combined}/>
      </div>
    </Modal>
  </div>;
};


export default Details;
