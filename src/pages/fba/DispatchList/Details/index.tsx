/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 14:41:31
 * @LastEditTime: 2021-05-18 10:39:34
 */
import React, { useEffect, useState, useRef, PureComponent } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Modal,
  Form,
  Button,
  message,
} from 'antd';
import { useDispatch } from 'umi';
import Product from './Product';
import Log from './Log';
import CheckInventory from './CheckInventory';
import DisposePage from './DisposePage';
import AsyncEditBox from '../../components/AsyncEditBox';
import { useReactToPrint } from 'react-to-print';

interface IProps {
  visible: boolean;
  method: 'FBA'| 'overseas'; // 发货方式 FBA和每外仓库
  dispose: boolean; // 是否已处理
  verify: boolean; // 是否已核实
  pageName?: 'dispose' | 'verify';
  onCancel: () => void;
  site: API.Site;
  data: DispatchList.IDispatchDetail;
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
    dispose = true,
    verify = true,
    pageName,
    onCancel,
    site,
    data,
  } = props;

  console.log(props, 'ppppp');
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

  const initValues = {
    method: '1',
    packaging: '1',
    paste: '1',
    location: '1',
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (pageName === 'verify' || pageName === 'dispose') {
      setNav('notShow');
      return;
    }
    setNav('product');
  }, [pageName]);

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

  const ruleNameCallback = () => (
    Promise.resolve(true)
  );


  return <div className={styles.box}>
    <Modal visible={visible}
      centered
      maskClosable={false}
      width={1180}
      wrapClassName={styles.modalBox}
      onCancel={onCancel}
      footer={null}
    >
      <header className={styles.topHead}>发货单详情</header>
      <Form className={styles.details} initialValues={initValues} layout="horizontal">
        <div className={styles.leftLayout}>
          <div className={styles.item}>
            <span className={styles.text}>状态：</span>
            <span className={styles.content}>{initData?.state}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>货件计划ID：</span>
            <span className={styles.content}>{initData?.shipmentId}</span>
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
            xxx
          </div>
          <div className={styles.item}>
            <span className={styles.text}>物流单号：</span>
            xxx
          </div>
          <div className={styles.item}>
            <span className={styles.text}>物流跟踪号：</span>
            xxx
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
            <AsyncEditBox 
              onOk={() => ruleNameCallback()} 
              value={'可修改'}
              errorText="修改失败"
              style={{ padding: 0 }}
              successText="修改成功"
            />
          </div>
        </div>
      </Form>

      <div className={classnames(
        styles.navs,
        pageName === 'dispose' || pageName === 'verify' ? 'none' : ''
      )}>
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
        nav === 'product' && <Product 
          verify={verify} 
          dispose={dispose} 
          site={site}
          data={productVos}
        />
      }
      {/* 操作日志 */}
      {
        nav === 'log' && <Log dispose={dispose} data={logs}/>
      }
      {/* 核实库存页面 */}
      {
        pageName === 'verify' && <CheckInventory site={site}/>
      }
      {/* 处理（预览&生成Shipment） */}
      { pageName === 'dispose' && <DisposePage site={site}/> }
      <footer className={styles.btns}>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={onCancel} type="primary">保存</Button>
        <Button onClick={handlePrint} type="primary">打印发货单</Button>
      </footer>

      <div style={{ display: 'none' }}>
        <ComponentToPrint ref={componentRef} a="333"/>
      </div>
    </Modal>
  </div>;
};


export default Details;
