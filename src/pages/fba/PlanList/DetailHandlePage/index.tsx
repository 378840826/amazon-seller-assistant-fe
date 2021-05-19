/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 14:41:31
 * @LastEditTime: 2021-05-19 14:02:02
 * 
 * 处理页面
 */
import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Modal,
  Form,
  Select,
  Button,
  message,
  Popconfirm,
} from 'antd';
import { useDispatch, useSelector, ConnectProps, IPianListState } from 'umi';
import { labelling, wayPacking } from '../../config';
import Line from '@/components/Line';
import moment from 'moment';
import { requestErrorFeedback, Iconfont } from '@/utils/utils';
import Log from './Log';
import Shipment from './Shipment';
import Product from './Product';
import HandlePage from './HandlePage';
import AssociatShipment from './AssociatShipment';
import Verify from './Verify';


interface IProps {
  id: string;
  logistics: string[]; // 物流方式
  storeId: string;
  showText: '详情'|'处理' | '核实';
  isinvalid: boolean; // 是否已作废
}

interface IPage extends ConnectProps {
  planList: IPianListState;
}

interface IData extends planList.IPlanDetail{
  modifys: planList.ILog[];
  products: planList.IProductList[];
  verifyProducts: planList.IVerifyProductRecord[];
  shipmentPlans: planList.IHandlePageRecord[];
}

const { Item } = Form;
const { Option } = Select;
const delProductIds: string[] = []; // 删除的商品明细id

const Details: React.FC<IProps> = function(props) {
  const {
    id,
    logistics,
    storeId,
    showText,
    isinvalid,
  } = props;

  const warehouses = useSelector((state: IPage) => state.planList.warehouses);
  const [visible, setVisible] = useState<boolean>(false);
  const [nav, setNav] = useState<'product' | 'shipment' | 'log'>('product');
  // 用来显示不同内容的，基本：未处理, 已核实/未处理, 已处理； 处理页面是从fba已核实未处理下面的去处理点击过去的；核实页面是核实库存页面
  const [pageName, setPageName] = useState<'基本页面'|'核实页面'|'处理页面' | '处理生成Shipment'>('基本页面');
  const [verify, setVerify] = useState<boolean>(false); // 可发量核实
  const [dispose, setDispose] = useState<boolean>(false); // 是否已处理
  const [isFBA, setisFBA] = useState<boolean>(false); // true为FBA货件详情，false为海外自营仓货件详情
  const [baseData, setBaseData] = useState<planList.IPlanDetail|null>(null); // 货件计划详情（头部的基本数据）
  const [logData, setLogData] = useState<planList.ILog[]>([]); // 操作日志列表
  const [productData, setProductData] = useState<planList.IProductList[]>([]); // 商品明细列表
  const [spinAddress, setSpinAddress] = useState<planList.IAddressLine[]>([]); // 发货地址下拉列表
  const [verifyData, setVerifyData] = useState<planList.IVerifyProductRecord[]>([]); // 核实页面商品明细的数据
  const [handleData, setHandleData] = useState<planList.IHandlePageRecord[]>([]); // 处理页面的表格数据
  const [requestVerifyLoading, setRequestVerifyLoading] = useState<boolean>(false);
  const [batchapplyProduct, setBatchProduct] = useState<string[]>([]); // 批量应用可发量选中的商品（行）

  const initValues = {
    areCasesRequired: String(wayPacking[0].value),
    labelingType: labelling[1].value,
  };
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    showText === '核实' && setPageName('核实页面');
    showText === '处理' && setPageName('处理页面');
  }, [showText]);

  // 初始化请求目的仓库下拉列表
  useEffect(() => {
    visible && dispatch({
      type: 'planList/getWarehouses',
      callback: requestErrorFeedback,
      payload: {
        nonfba: false,
        nonDomestic: true,
      },
    });
  }, [dispatch, visible]);

  // 发货地址
  const getSpinAddress = useCallback((storeId: string) => {
    if (!visible) {
      return;
    }

    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'fbaBase/getSpinAddress',
        reject,
        resolve,
        payload: {
          storeId,
        },
        callback: requestErrorFeedback,
      });
    });

    promise.then(res => {
      const { code, message: msg, data = [] } = res as {
        code: number;
        message?: string;
        data?: planList.IAddressLine[];
      };
      if (code === 200) {
        setSpinAddress(data);
        return;
      }
      message.error(msg || '该店铺下无关联的发货地址！');
    });
    
  }, [dispatch, visible]);

  // 初始化信息
  const request = useCallback((type = showText) => {
    // 如果是核实页面，需要请求另外一个接口
    let requestUrl = '';
    switch (type) {
    case '处理':
      requestUrl = 'planList/planHandlePageInitData';
      break;
    case '核实':
      requestUrl = 'planList/planVerifyPageInitData';
      break;
    default:
      requestUrl = 'planList/planVerify';
      break;
    }
    
    // 货件计划详情（头部的基本数据）
    new Promise((resolve, reject) => {
      dispatch({
        type: requestUrl,
        resolve,
        reject,
        payload: { id, ascending: false },
      });
    }).then(datas => {
      const { 
        code,
        message: msg,
        data,
      } = datas as {
        code: number;
        message?: string;
        data: IData;
      };  

      if (code === 200) {
        setBaseData(data);
        setLogData(data.modifys);
        setProductData(data.products);  
        setVerify(data.verifyType);
        setDispose(data.pstate === '已处理');
        setisFBA(data.warehouseType === 'fba');
        showText === '核实' && setVerifyData(data.verifyProducts);
        (showText === '处理' || pageName === '处理页面') && setHandleData(data.shipmentPlans);
        form.setFieldsValue({ 
          shippingType: data.shippingType,
          addressLine1: data.addressLine1,
          warehouseDe: data.warehouseDe,
        });
        return;
      }
      message.error(msg);
    });
  }, [dispatch, id, form, showText, pageName]);

  useEffect(() => {
    getSpinAddress(storeId);
  }, [getSpinAddress, storeId]); 

  useEffect(() => {
    if (!visible) {
      return;
    }

    request();
  }, [visible, request]);

  // 货件计划作废（单个）
  const updateItemPlan = function(id: string) {
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/updatePlan',
        resolve,
        reject,
        payload: {
          ids: [id],
        },
      });
    });
    
    promise.then(res => {
      const { code, message: msg } = res as Global.IBaseResponse;
      if (code === 200) {
        message.success(msg || '操作成功！');
        setVisible(false);
        return;
      }

      message.error(msg || '操作失败！');
    });
  };

  // 未核实时 - 商品明细修改申报量
  const changeShenBaoLiangCallback = function(id: string, newValue: number) {
    const tempObj = productData.find(item => item.id === id);
    tempObj && (tempObj.declareNum = String(newValue));
    setProductData([...productData]);
  };

  const changeShipmentName = function(val: string, mwsShipmentId: string) {
    const temp = handleData.find(item => item.mwsShipmentId === mwsShipmentId);
    temp && (temp.shipmentName = val);
    setHandleData([...handleData]);
  };

  // 未处理的货件 - 商品明细删除商品按钮
  const delProduct = function(id: string) {
    const index = productData.findIndex(item => item.id === id);
    if (index > -1) {
      delProductIds.push(id);
      productData.splice(index, 1);
      setProductData([...productData]);
    }
  };

  // 已核实未处理的货件，可以撤销核实
  const untoVerify = function() {
    // 撤销成功后，要更改列表
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/untoVerify',
        resolve,
        reject,
        payload: { id },
      });
    });

    promise.then(res => {
      const { code, message: msg } = res as Global.IBaseResponse;
      if (code === 200) {
        message.success(msg || '撤销成功！');
        setVisible(false);
        return;
      }
      message.error(msg || '撤销失败！');
    });
  };


  // 保存更改
  const save = function() {
    const data = form.getFieldsValue();
    data.id = id;
    data.areCasesRequired = data.areCasesRequired === 'true'; // 是否原包装
    data.products = productData;
    data.productIds = delProductIds;
    
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/updateDetails',
        resolve,
        reject,
        payload: data,
      });
    });

    promise.then(res => {
      const { code, message: msg } = res as Global.IBaseResponse;
      if (code === 200) {
        message.success(msg || '修改成功！');
        return;
      }
      message.error(msg || '修改失败！');
    });
  };

  const batchApplyshipments = function() {
    console.log(batchapplyProduct, 'batchapplyProduct');
    for (const item of productData) {
      if (batchapplyProduct.includes(item.id)) {
        item.verifyNum = item.declareNum;
      }
    }
    
    setProductData([...productData]);
  };

  // 核实
  const toVerify = function() {
    setRequestVerifyLoading(true);
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/planVerifySubmit',
        resolve,
        reject,
        payload: { id, products: verifyData },
      });
    });

    promise.then(res => {
      const { code, message: msg } = res as Global.IBaseResponse;
      
      setRequestVerifyLoading(false);
      if (code === 200) {
        message.success(msg || '核实成功！');
        setVisible(false);
        return;
      }
      message.error(msg || '核实失败！');
    });
  };

  // 确定生成Shipment
  const createShipment = function() {
    const generateShipmentPlans: { mwsShipmentId: string; shipmentName: string }[] = [];
    handleData.map(item => {
      generateShipmentPlans.push({
        mwsShipmentId: item.mwsShipmentId,
        shipmentName: item.shipmentName,
      });
    });
    
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/createShipment',
        resolve,
        reject,
        payload: { 
          id,
          generateShipmentPlans,
        },
      });
    });

    promise.then(res => {
      const { code, message: msg } = res as Global.IBaseResponse;

      if (code === 200) {
        message.success(msg || '成功生成！');
        return;
      }

      message.error(msg || '生成失败！');
    });
  };

  // 去处理按钮
  const toHandle = function() {
    // request('处理');
    setPageName('处理页面');
  };

  const changeVerifyNum = function(newValue: number, id: string) {
    console.log(newValue);
    const temp = verifyData.find((item: planList.IVerifyProductRecord) => item.id === id);
    temp && (
      temp.verifyNum = String(newValue),
      setVerifyData([...verifyData])
    );
  };

  // 根据不同条件生成按钮
  const GetFooter = function() {
    
    // 核实页面
    if (showText === '核实') {
      return <div>
        <Button onClick={() => setVisible(false)}>取消</Button>
        <Button type="primary" onClick={toVerify} loading={requestVerifyLoading}>核实</Button>
      </div>;
    }

    if (showText === '处理' || pageName === '处理页面') {
      return <div>
        <Button onClick={() => setVisible(false)}>取消</Button>
        <Button type="primary" onClick={createShipment}>确定生成Shipment</Button>
      </div>;
    }

    if (showText === '详情') {
      // 已核实已处理或者已作废
      if (!isinvalid || (dispose && verify)) {
        return <Button onClick={() => setVisible(false)}>取消</Button>;
      }

      // 未核实未处理
      if (!dispose && !verify) {
        return <div>
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Popconfirm 
            title="作废后不可恢复，确定作废？"
            placement="top"
            overlayClassName={styles.delTooltip}
            onConfirm={() => updateItemPlan(String(id))}
            icon={<Iconfont type="icon-tishi2" />}
          >
            <Button>作废</Button>
          </Popconfirm>
          <Button type="primary" onClick={save}>保存</Button>
        </div>;
      }
      
      // 已核实未处理
      if (verify && verify) {
        return <div>
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Popconfirm 
            title="作废后不可恢复，确定作废？"
            placement="top"
            overlayClassName={styles.delTooltip}
            onConfirm={() => updateItemPlan(String(id))}
            icon={<Iconfont type="icon-tishi2" />}
          >
            <Button>作废</Button>
          </Popconfirm>
          <Button type="primary" onClick={save}>保存</Button>
          {<Button type="primary" onClick={toHandle}>去处理</Button>}
          < AssociatShipment id={baseData?.shipmentId}/>
        </div>;
      }

      return <div>
        <Button onClick={() => setVisible(false)}>取消</Button>
        {
          // 未处理的货件都有作废按钮
          !dispose && <Popconfirm 
            title="作废后不可恢复，确定作废？"
            placement="top"
            overlayClassName={styles.delTooltip}
            onConfirm={() => updateItemPlan(String(id))}
            icon={<Iconfont type="icon-tishi2" />}
          >
            <Button>作废</Button>
          </Popconfirm>
        }
        {
          // 已核实未处理的货件(海外自营仓和fba货件)，显示撤销按钮
          verify && !dispose && <Popconfirm 
            title="确定要将已核实的货件撤销吗？"
            placement="top"
            overlayClassName={styles.delTooltip}
            onConfirm={untoVerify}
            icon={<Iconfont type="icon-tishi2" />}
          ><Button type="primary">撤销核实</Button></Popconfirm>
        }
        { 
          // 未处理的货件都有保存按钮
          !dispose && <Button type="primary" onClick={save}>保存</Button>
        }
        {
          // 已核实未处理的fba货件有“去处理”按钮
          (verify && !dispose && isFBA) && <Button type="primary" onClick={toHandle}>去处理</Button>
        }
      </div>;
    }

    return <></>;
  };

  return <div className={styles.box}>
    <Modal visible={visible}
      centered
      maskClosable={false}
      width={1180}
      wrapClassName={styles.modalBox}
      // onCancel={() => setVisible(false)}
      footer={<GetFooter />}
    >
      <header className={styles.topHead}>货件计划详情</header>
      <Form 
        className={styles.details}
        initialValues={initValues}
        form={form}
        layout="horizontal">
        <div className={styles.leftLayout}>
          <div className={styles.item}>
            <span className={styles.text}>状态：</span>
            <span className={styles.content}>{baseData?.state ? '正常' : '作废'}</span>
          </div>
          <div className={classnames(styles.item, styles.planId)}>
            <span className={styles.text}>货件计划ID：</span>
            <span className={styles.content} title={baseData?.shipmentId }>
              {baseData?.shipmentId ? baseData?.shipmentId : <Line/>}
            </span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>ShipmentID：</span>
            <span className={styles.content}>
              {baseData?.mwsShipmentId ? baseData?.mwsShipmentId : <Line/>}
            </span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>发货单号：</span>
            <span className={styles.content}>
              {baseData?.invoiceId ? baseData?.invoiceId : <Line/>}
            </span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>站点：</span>
            <span className={styles.content}>
              {baseData?.countryCode ? baseData?.countryCode : <Line/>}
            </span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>店铺名称：</span>
            <span className={styles.content}>
              {baseData?.storeName ? baseData?.storeName : <Line/>}
            </span>
          </div>
        </div>
        
        <div className={styles.centerLayout}>
          <div className={styles.item}>
            <span className={styles.text}>目的仓库：</span>
            { dispose && !isFBA ? baseData?.warehouseDe : 
              <Item name="warehouseDe" className={styles.select}>
                <Select>
                  {warehouses.map((item, index) => {
                    return <Option value={item.name} key={index}>{item.name}</Option>;
                  })}
                </Select>
              </Item>
            }
          </div>
          <div className={styles.item}>
            <span className={styles.text}>物流方式：</span>
            { dispose ? baseData?.shippingType : 
              <Item name="shippingType" className={styles.select}>
                <Select>
                  {logistics && logistics.map((item, index) => {
                    return <Option value={item} key={index}>{item}</Option>;
                  })}
                </Select>
              </Item>
            }
          </div>
          <div className={styles.item}>
            <span className={styles.text}>包装方式：</span>
            {/* eslint-disable-next-line */}
            { dispose ? (baseData?.areCasesRequired ? '原厂包装' : '混装') : 
              <Item name="areCasesRequired" className={classnames(styles.select, styles.wayPacking)}>
                <Select>
                  {wayPacking.map((item, i) => {
                    return <Option value={String(item.value)} key={i}>{item.label}</Option>;
                  })}
                </Select>
              </Item>
            }
          </div>
          <div className={styles.item}>
            <span className={styles.text}>贴标方：</span>
            { dispose ? labelling.find(item => item.value === baseData?.labelingType)?.label : 
              <Item name="labelingType" className={classnames(styles.select, styles.labeling)}>
                <Select>
                  {labelling.map((item, i) => {
                    return <Option value={item.value} key={i}>{item.label}</Option>;
                  })}
                </Select>
              </Item>
            }
          </div>
          <div className={styles.item}>
            <span className={styles.text}>发货地址：</span>
            { dispose ? baseData?.addressLine1 : 
              <Item name="addressLine1" className={styles.select}>
                <Select>
                  {spinAddress.map((item, i) => {
                    return <Option value={item.addressLine1} key={i}>{item.addressLine1}</Option>;
                  })}
                </Select>
              </Item>
            }
          </div>
          <div className={styles.item}>
            <span className={styles.text}>可发量核实：</span>
            <span className={classnames(styles.content, verify ? styles.success : styles.error)}>
              {verify ? '仓库已核实' : '仓库未核实' }
            </span>
          </div>
        </div>
        
        <div className={styles.rightLayout}>
          <div className={styles.item}>
            <span className={styles.text}>处理状态：</span>
            <span className={classnames(styles.content, dispose ? styles.success : styles.error)}>
              { dispose ? '已处理' : '未处理'}
            </span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>创建人：</span>
            <span className={styles.content}>
              {baseData?.userName ? baseData?.userName : <Line/>}
            </span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>创建时间：</span>
            <span className={styles.content}>
              {baseData?.gmtCreate ? moment(baseData?.gmtCreate).format('YYYY-MM-DD HH:mm:ss') : <Line/>}
            </span>
          </div>
          <div className={styles.item}>
            <span className={styles.text}>更新时间：</span>
            <span className={styles.content}>
              {baseData?.gmtModified ? moment(baseData?.gmtModified).format('YYYY-MM-DD HH:mm:ss') : <Line/>}
            </span>
          </div>
        </div>
      </Form>

      {
        pageName === '基本页面' && (<>
          <div className={styles.navs} >
            <nav className={styles.nav}>
              <span className={classnames(
                styles.navItem, 
                nav === 'product' ? styles.active : ''
              )}
              onClick={() => setNav('product')}
              >商品明细</span>
              <span className={classnames(
                styles.navItem, 
                nav === 'shipment' ? styles.active : '',
                !isFBA && 'none'
              )}
              onClick={() => setNav('shipment')}
              >Shipment信息</span>
              <span className={classnames(
                styles.navItem, 
                nav === 'log' ? styles.active : ''
              )}
              onClick={() => setNav('log')}
              >操作日志</span>
            </nav>
            { 
              // 已核实未处理的页面有这个，并且只有在商品列表才有
              (nav === 'product' && verify && !dispose ) && <Button 
                type="primary" onClick={batchApplyshipments}>批量应用可发量</Button> 
            }
          </div>

          {/* 商品明细 */}
          { nav === 'product' && <Product 
            data={productData} 
            changeShenBaoLiangCallback={changeShenBaoLiangCallback}
            dispose={dispose}
            verify={verify}
            delProduct={delProduct}
            shopId={baseData?.storeId}
            setBatchProduct={setBatchProduct}
          /> }

          {/*  Shipment信息 */}
          { nav === 'shipment' && <Shipment data={[]}/>}
          
          {/* 操作日志 */}
          { nav === 'log' && <Log data={logData}/> }
        </>)
      }

      {
        pageName === '处理页面' && <HandlePage 
          data={handleData} 
          site={baseData?.countryCode as API.Site} 
          changeShipmentName={changeShipmentName}/>
      }
      
      {
        pageName === '核实页面' && <Verify id={id} 
          data={verifyData} 
          theadData={baseData}
          changeVerifyNum={changeVerifyNum}
          shopId={baseData?.storeId}
          areCasesRequired={baseData?.areCasesRequired}
        />
      }

    </Modal>
    <span onClick={() => setVisible(!visible)}>{showText}</span>
  </div>;
};


export default Details;
