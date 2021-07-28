/*
 * 打印核实单
 * @Author: your name
 * @Date: 2021-05-12 10:37:09
 * @LastEditTime: 2021-05-19 15:51:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /amzics-react/src/pages/fba/PlanList/Verify/Print/index.ts
 */
import React, { useRef, PureComponent } from 'react';
import styles from './index.less';
import { Button } from 'antd';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';

interface IProps {
  product: planList.IVerifyProductRecord[];
  theadData: planList.IPlanDetail|null;
  areCasesRequired?: boolean;
}

interface IPrintProps {
  product: planList.IVerifyProductRecord[];
}

interface IPrintState {
  product: planList.IVerifyProductRecord[];
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

let count = 0;
const rowCount = 12; // 每页的行数

const Print: React.FC<IProps> = props => {
  const { product, theadData, areCasesRequired } = props;
  const componentRef = useRef<any>(); // eslint-disable-line

  class ComponentToPrint extends PureComponent<IPrintProps, IPrintState> {
    constructor(props: IPrintProps) {
      super(props);
      this.state = {
        product: product,
      };
    }
    
    render() {
      return (<div className={styles.box}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>创建日期</th>
              <th colSpan={6}>{theadData?.gmtCreate && moment(theadData?.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</th>
            </tr>
            <tr>
              <th>货件计划ID</th>
              <th colSpan={6}>{theadData?.shipmentId}</th>
            </tr>
            <tr>
              <th>MSKU</th>
              <th>申报量</th>
              <th>可发量</th>
              <th>FnSKU</th>
              <th>SKU</th>
              <th>中文名称</th>
              <th>包装方式</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.product.map((item, index: number) => {
                const currnetIndex = index + 1;
                if ( 
                  (currnetIndex > 2 && currnetIndex % rowCount === 0) 
                  || currnetIndex === this.state.product.length
                ) {
                  count++;
                  return <>
                    <tr>
                      <td>{item.sellerSku}</td>
                      <td>{item.declareNum}</td>
                      <td>{item.verifyNum}</td>
                      <td>{item.fnsku}</td>
                      <td>{item.sellerSku}</td>
                      <td>{item.itemNameNa ? item.itemNameNa : '—'}</td>
                      <td>{areCasesRequired ? ' 原厂包装' : '混装'}</td>
                    </tr>
                    <tr>
                      <td 
                        colSpan={7} 
                        style={{ backgroundColor: 'pink', textAlign: 'right' }}
                      >
                          第{count}页 共{Math.ceil(this.state.product.length / rowCount)}页
                      </td>
                    </tr>
                  </>;
                }
  
                return <tr key={index}>
                  <td>{item.sellerSku}</td>
                  <td>{item.declareNum}</td>
                  <td>{item.verifyNum}</td>
                  <td>{item.fnsku}</td>
                  <td>{item.sellerSku}</td>
                  <td>{item.itemNameNa ? item.itemNameNa : '—'}</td>
                  <td>{areCasesRequired ? ' 原厂包装' : '混装'}</td>
                </tr>;
              })
            }
          </tbody>
        </table>
      </div>);
    }
  }
  

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => console.log(document.querySelector('#content')),
    pageStyle,
  });

  return <div className={styles.box}>
    <Button onClick={handlePrint} type="primary">打印核实单</Button>
    <div style={{ display: 'none' }}>
      <ComponentToPrint ref={componentRef} product={product}/>
    </div>
  </div>;
};


export default Print;
