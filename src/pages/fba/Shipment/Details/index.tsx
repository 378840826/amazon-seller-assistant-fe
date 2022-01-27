/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 14:41:31
 * @LastEditTime: 2021-04-24 09:13:33
 * 
 * shipment 详情
 */
import React, { useEffect, useState, useRef, PureComponent } from 'react';
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
import InputEditBox from '@/pages/fba/components/InputEditBox';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import Lebal from './label';

interface IProps {
  visible: boolean;
  method: 'FBA'| 'overseas'; // 发货方式 FBA和每外仓库
  dispose: boolean; // 是否已处理
  verify: boolean; // 是否已核实
  onCancel: () => void;
  onUpdateShipment: (
    params: 
      { [key: string]: string; id: string; shipmentName: string }
  ) => Promise<boolean>;
  site: API.Site;
  id: string;
}

interface IPage extends ConnectProps {
  fbaBase: IFbaBaseState;
}

interface IPrintProps {
  data: Shipment.IShipmentDetails;
  combined: number;
}
interface ILabelType {
  modalvisible: boolean;
  recordData: Shipment.IProductList;  
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
        shipmentName, 
        userName, 
        gmtCreate,
        mwsShipmentId,
        productItemVos,
        areCasesRequired,
      },
      combined,

    } = this.props;

    return (<div className={styles.printtable}>
      <table>
        <thead>
          <tr>
            <td >创建日期</td>
            <td colSpan={5}>{gmtCreate && moment(gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</td>
          </tr>
          <tr>
            <td >创建人</td>
            <td colSpan={5}>{userName}</td>
          </tr>
          <tr>
            <td >Shipment名称</td>
            <td colSpan={5}>{shipmentName}</td>
          </tr>
          <tr>
            <td width={270}>ShipmentID</td>
            <td colSpan={5}>{mwsShipmentId}</td>
          </tr>
          <tr>
            <th>MSKU</th>
            <th>申报量</th>
            <th>FnSKU</th>
            <th>SKU</th>
            <th>中文名称</th>
            <th>包装方式</th>
          </tr>
          {
            productItemVos?.map((item, index) => (
              <tr key={index}>
                <td width={270} >{item.sellerSku}</td>
                <td width={120}>{item.declareNum}</td>
                <td width={120}>{item.fnsku}</td>
                <td width={120}>{item.sku}</td>
                <td width={320}>{item.nameNa ? item.nameNa : '-'}</td>
                <td width={100}>{areCasesRequired }</td>
              </tr>
            ))
          }
          <tr>
            <td>合计</td>
            <td>{combined}</td>
            <td colSpan={4}></td>
          </tr>
          
        </thead>
      </table>
    </div>);
  }
}


const { Option } = Select;
const { Item } = Form;
const Details: React.FC<IProps> = function(props) {
  const {
    visible = true,
    dispose = true,
    verify = true,
    onCancel,
    onUpdateShipment,
    site,
    id,
  } = props;

  const logistics = useSelector((state: IPage) => state.fbaBase.logistics);

  const [nav, setNav] = useState<'product' | 'log'>('product');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Shipment.IShipmentDetails>({} as Shipment.IShipmentDetails);
  const [product, setProduct] = useState<Shipment.IProductList[]>([]);
  const [log, setLog] = useState<Shipment.ILogs[]>([]);
  const [lebalModalData, setLabelModalData] = useState<ILabelType>({
    modalvisible: false,
    recordData: {
      id: '-1',
      url: '',
      itemName: '',
      asin1: '',
      sku: '',
      sellerSku: '',
      fnsku: '',
      declareNum: 0,
      issuedNum: 0,
      receiveNum: 0,
      mskuState: '',
      nameNa: '',
    },   
  });

  const [shipmentProductDeleteIds, setShipmentProductDeleteIds] = useState<string[]>([]);
  //合计申报量
  const [combined, setCombined] = useState<number>(0);


  const componentRef = useRef<any>(); // eslint-disable-line
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  //打印清单
  const printlist = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => {
      // 点击打印关闭弹窗
      onCancel();
    },
    pageStyle: pageStyle,
  });

  //加上合计
  const printlists = async() => {  
    let sum = 0;
    await data.productItemVos.forEach(item => {
      sum += item.declareNum * 1;
    });

    setCombined(sum);
    printlist && printlist();
  
  };

  useEffect(() => {
    data && form.setFieldsValue({
      shippingType: data.shippingType,
      shipmentName: data.shipmentName,
    });
  }, [logistics, data, form]);

  useEffect(() => {
    if (id === '-1') {
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

      
      if (code === 200) {
        
        setData({ ...data });
        setProduct([...data.productItemVos]);
        setLog([...data.shipmentModifies]);
        setShipmentProductDeleteIds([]);
        setLoading(false);
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

  // 删除商品
  const delProduct = function(id: string) {
    if (product.length === 1) {
      message.warning('商品不能为空！');
      return;
    }
    //后端要求将删除的id传过去
    shipmentProductDeleteIds.push(id);
    setShipmentProductDeleteIds([...shipmentProductDeleteIds]);

    const index = product.findIndex(item => item.id === id);
    if (index > -1) {
      product.splice(index, 1);
      setProduct([...product]);
    }
  };

  // 保存
  function handleSave() {
    const formVal = form.getFieldsValue();
    onUpdateShipment({ 
      id, 
      ...formVal, 
      shipmentProductQos: product, 
      shipmentProductDeleteIds: shipmentProductDeleteIds });
  }

  //批量打印的回调
  const batchPrintClick = () => {
    setLabelModalData({ modalvisible: true, recordData: product[0] });
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
      <Spin spinning={loading}>
        <Form 
          className={styles.details} 
          layout="horizontal"
          form={form}
        >
          <div className={styles.leftLayout}>
            <div className={styles.item}>
              <span className={styles.text}>状态：</span>
              <span className={styles.content}>{data.shipmentStatus}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>ShipmentID：</span>
              <span className={styles.content}>{data.mwsShipmentId}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>Shipment名称：</span>
              <span className={styles.content}>
                <Item name="shipmentName" className={styles.select}>
                  <InputEditBox
                    value={String(data.shipmentName)}
                    chagneCallback={val => form.setFieldsValue({ shipmentName: val })}
                  />
                </Item>
              </span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>货件计划ID：</span>
              <span className={styles.content}>{data.shipmentId}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>发货单号：</span>
              <span className={styles.content}>{data.invoiceId}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>站点：</span>
              <span className={styles.content}>{data.countryCode}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>店铺名称：</span>
              <span className={styles.content}>{data.storeName}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>目的仓库：</span>
              <span className={styles.content}>{data.warehouseDe}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>亚马逊仓库代码：</span>
              <span className={styles.content}>{data.destinationFulfillmentCenterId}</span>
            </div>
          </div>
          
          <div className={styles.centerLayout}>
            <div className={styles.item}>
              <span className={styles.text}>物流方式：</span>
              <Item name="shippingType" className={styles.selectBox}>
                <Select size="small" className={styles.select}>
                  {logistics.map((item, i) => <Option value={item} key={i}>
                    {item}
                  </Option>)}
                </Select>
              </Item>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>物流单号：</span>
              {data.shippingId}
            </div>
            <div className={styles.item}>
              <span className={styles.text}>物流跟踪号：</span>
              {data.trackingId}
            </div>
            <div className={styles.item}>
              <span className={styles.text}>包装方式：</span>
              {data.areCasesRequired}
            </div>
            <div className={styles.item}>
              <span className={styles.text}>贴标方：</span>
              <span className={styles.content}>{data.labelingType}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>发货地址：</span>
              <span className={styles.content}>{data.addressLine1}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>ReferenceID：</span>
              <span className={styles.content}>{data.referenceId}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>产品种类：</span>
              <span className={styles.content}>{data.mskuNum}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>申报量：</span>
              <span className={styles.content}>{data.declareNum}</span>
            </div>
          </div>
          
          <div className={styles.rightLayout}>
            <div className={styles.item}>
              <span className={styles.text}>已发量：</span>
              <span className={styles.content}>{data.issuedNum}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>已收量：</span>
              <span className={styles.content}>{data.receivedNum}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>创建人：</span>
              <span className={styles.content}>{data.userName}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>创建时间：</span>
              <span className={styles.content}>{data.gmtCreate}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>开始收货日期：</span>
              <span className={styles.content}>{data.receivingTime}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>更新时间：</span>
              <span className={styles.content}>{data.gmtModified}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.text}>装箱单附件：</span>
              {
                data.txtUrl ? <a href={data.txtUrl} download>点击下载</a> : '未上传'
              }
            </div>
            
          </div>
        </Form>

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
          <Button onClick={batchPrintClick} type="primary" className={styles.batchbutton}>批量打印标签</Button>         
          <Lebal 
            site={site} 
            data={product} 
            modalData={lebalModalData} 
            onCancle={() => {
              lebalModalData.modalvisible = false; 
              setLabelModalData({ ...lebalModalData });
            }}
          />
        </div>
        
        {/* // 商品 */}
        {
          !loading
            && nav === 'product'
            && <Product
              verify={verify}
              dispose={dispose}
              site={site}
              data={product}
              updateDeclared={updateDeclared}
              delProduct={delProduct}
            />
        }
        {/* 操作日志 */}
        {
          !loading && nav === 'log' && <Log dispose={dispose} data={log}/>
        }
        <footer className={styles.btns}>
          <Button onClick={onCancel}>取消</Button>
          <Button onClick={handleSave} type="primary">保存</Button>
          <Button onClick={printlists} type="primary">打印清单</Button>
        </footer>
        <div style={{ display: 'none' }}>
          <ComponentToPrint ref={componentRef} data={data} combined={combined} />
        </div>
      </Spin>
    </Modal>
  </div>;
};


export default Details;
