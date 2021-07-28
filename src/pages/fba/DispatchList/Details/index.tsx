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

interface IState {
  datas: { a: number; b: number; c: number }[];
}

interface IPrintProps {
  a: string;
}

const pageStyle = `
  @media print {
    section {page-break-before: always;}
    h1 {page-break-after: always;}
    .aaa {page-break-inside: avoid; color: red;}
  }
`;


let count = 0;
const rowCount = 12; // 每页的行数
class ComponentToPrint extends PureComponent<IPrintProps, IState> {
  constructor(props: IPrintProps) {
    super(props);
    this.state = {
      datas: [
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
      ],
    };
  }
  
  render() {
    return (<div className={styles.printBox}>
      <table>
        <thead>
          <tr>
            <th>创建日期</th>
            <th colSpan={6}>2021年4月24日15:59:32</th>
          </tr>
          <tr>
            <th>创建人</th>
            <th colSpan={6}>张三</th>
          </tr>
          <tr>
            <th>Shipment名称</th>
            <th colSpan={6}>Shipment名称Shipment名称Shipment名称</th>
          </tr>
          <tr>
            <th>ShipmentID</th>
            <th colSpan={6}>ShipmentIDShipmentIDShipmentID</th>
          </tr>
          <tr>
            <th>发货单号</th>
            <th colSpan={6}>SF49991988</th>
          </tr>
          <tr>
            <th>拣货员</th>
            <th colSpan={6}></th>
          </tr>
          <tr>
            <th>MSKU</th>
            <th>数量</th>
            <th>FnSKU</th>
            <th>SKU</th>
            <th>中文名称</th>
            <th className={styles.last}>包装方式1</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.datas.map((item: {}, index: number) => {
              if ((index + 1) % rowCount === 0 || index + 1 === this.state.datas.length) {
                count++;
                return <><tr>
                  <td 
                    colSpan={7} 
                    style={{ backgroundColor: 'pink', textAlign: 'right' }}
                  >
                      第{count}页 共{Math.ceil(this.state.datas.length / rowCount)}页
                  </td>
                </tr>
                <tr>
                  <td>data 1</td>
                  <td>data 2</td>
                  <td>data 3</td>
                  <td>data 4</td>
                  <td>data 5</td>
                  <td>{index}</td>
                </tr>
                </>;
              }

              return <tr key={index}>
                <td>data 1</td>
                <td>data 2</td>
                <td>data 3</td>
                <td>data 4</td>
                <td>data 5</td>
                <td className={styles.last}>{index}</td>
              </tr>;
            })
          }
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
  const [productVos, setProductVos] = useState<DispatchList.IProductVos[]|null>(null); // 商品明细
  const [logs, setLogs] = useState<DispatchList.IDispatchLog[]|null>(null); // 操作日志
  const componentRef = useRef<any>(); // eslint-disable-line
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => console.log(document.querySelector('#content')),
    pageStyle: pageStyle,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!visible) {
      return;
    }

    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'fbaDispatchList/getInvoiceDetail',
        resolve,
        reject,
        payload: {
          id: data.id,
        },
      });
    });

    promise.then(datas => {
      const {
        code, 
        data,
        message: msg,
      } = datas as {
        code: number;
        data: DispatchList.IDispatchDetail;
        message?: string;
      };

      if (code === 200) {
        setInitData({ ...data });
        setProductVos([...data.productItemVos]);
        setLogs([...data.shipmentModifies]);
        return;
      }
      
      message.error(msg || '获取初始化数据失败！请重试');
    });

    
  }, [dispatch, visible, data]);

  function handleSave() {
    const formVal = form.getFieldsValue();
    onUpdateDispatch({ id: data.id, ...formVal });
  }

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
      </div>
      
      { nav === 'product' && <Product site={site} data={productVos}/> }
      { nav === 'log' && <Log data={logs}/> }
      <footer className={styles.btns}>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={handleSave} type="primary">保存</Button>
        <Button onClick={handlePrint} type="primary">打印发货单</Button>
      </footer>

      <div style={{ display: 'none' }}>
        <ComponentToPrint ref={componentRef} a="333"/>
      </div>
    </Modal>
  </div>;
};


export default Details;
