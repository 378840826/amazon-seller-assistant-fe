/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 14:41:31
 * @LastEditTime: 2021-05-19 14:02:02
 * 
 * 处理页面
 * 状态较混乱，后续优化可改为统一管理
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
import { useDispatch, useSelector, ConnectProps, IPianListState, history } from 'umi';
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
import { fba } from '@/utils/routes';


interface IProps {
  id: string;
  logistics: string[]; // 物流方式
  storeId: string;
  showText: '详情'|'处理' | '核实';
  isinvalid: boolean; // 是否已作废
  addSuccessCallbal: () => void;
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

const Details: React.FC<IProps> = function(props) {
  const {
    id,
    logistics,
    storeId,
    showText,
    isinvalid,
    addSuccessCallbal,   
  } = props;

  const warehouses = useSelector((state: IPage) => state.planList.warehouses);

  const [visible, setVisible] = useState<boolean>(false);
  const [nav, setNav] = useState<'product' | 'shipment' | 'log'>('product');
  // 用来显示不同内容的，基本：未处理, 已核实/未处理, 已处理； 处理页面是从fba已核实未处理下面的去处理点击过去的；核实页面是核实库存页面
  const [pageName, setPageName] = useState<'基本页面'|'核实页面'|'处理页面' | '处理生成Shipment'>('基本页面');
  const [verify, setVerify] = useState<boolean>(false); // 可发量核实
  const [dispose, setDispose] = useState<boolean>(false); // 是否已处理
  const [isFBA, setisFBA] = useState<boolean>(false); // true为FBA货件详情，false为海外自营仓货件详情
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [baseData, setBaseData] = useState<IData>({} as any); // 货件计划详情（头部的基本数据）
  const [logData, setLogData] = useState<planList.ILog[]>([]); // 操作日志列表
  const [productData, setProductData] = useState<planList.IProductList[]>([]); // 商品明细列表
  const [spinAddress, setSpinAddress] = useState<planList.IAddressLine[]>([]); // 发货地址下拉列表
  const [verifyData, setVerifyData] = useState<planList.IVerifyProductRecord[]>([]); // 核实页面商品明细的数据
  const [handleData, setHandleData] = useState<planList.IHandlePageRecord[]>([]); // 处理页面的表格数据
  // loading， 因为混乱造成的一些原因，没用 loadingEffect
  const [productListLoading, setProductListLoading] = useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false); // 确定核实
  const [saveLoading, setSaveLoading] = useState<boolean>(false); // 确定核实
  const [untoVerifyLoading, setUntoVerifyLoading] = useState<boolean>(false); // 确定取消核实
  const [createShipmentLoading, setCreateShipmentLoading] = useState<boolean>(false); // 生成shipment
  const [
    beforePreviewShipmentLoading, setBeforePreviewShipmentLoading,
  ] = useState<boolean>(false); // 去处理前的预处理
  const [createInvoiceLoading, setCreateInvoiceLoading] = useState<boolean>(false); // 生成发货单
  const [batchapplyProduct, setBatchProduct] = useState<string[]>([]); // 批量应用可发量选中的商品（行）
  const [delProductIds, setDelProductIds] = useState<string[]>([]); // 要删除的商品（后端接口要求）

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
    // FBA货件计划不能修改目标仓库
    visible && !isFBA && dispatch({
      type: 'planList/getWarehouses',
      callback: requestErrorFeedback,
      payload: {
        nonfba: !isFBA,
        nonDomestic: true,
      },
    });
  }, [dispatch, isFBA, visible]);

  // 弹窗的 title 不同状态下显示不同
  function getTitle() {
    let title = '货件计划详情';
    // FBA 货件计划的核实
    if (isFBA && showText === '核实') {
      title = '货件计划 > 核实库存';
    }
    // FBA 货件计划处理预览
    if (isFBA && showText === '处理') {
      title = '货件计划处理';
    }
    // 海外仓货件计划核实
    if (!isFBA && showText === '核实') {
      title = '可发量核实';
    }
    return title;
  }

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
    setProductListLoading(true);
    // 货件计划详情（头部的基本数据）
    new Promise((resolve, reject) => {
      dispatch({
        type: requestUrl,
        resolve,
        reject,
        payload: { id, ascending: false },
      });
    }).then(datas => {
      setProductListLoading(false);
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
        // (showText === '处理' || pageName === '处理页面') && setHandleData(data.shipmentPlans);
        data.shipmentPlans && setHandleData(data.shipmentPlans);
        form.setFieldsValue({ 
          shippingType: data.shippingType,
          addressLine1: data.addressLine1,
          warehouseDe: data.warehouseDe,
        });
        return;
      }
      message.error(msg);
    });
  }, [dispatch, id, form, showText]);

  useEffect(() => {
    getSpinAddress(storeId);
  }, [getSpinAddress, storeId]); 

  useEffect(() => {
    if (!visible) {
      return;
    }

    request();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
    // if (!newValue) {
    //   message.warning('申报量不能为0！');
    //   return;
    // }
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
      setDelProductIds([...delProductIds, id]);
      productData.splice(index, 1);
      setProductData([...productData]);
    }
  };

  // 已核实未处理的货件，可以撤销核实
  const untoVerify = function() {
    setUntoVerifyLoading(true);
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
      setUntoVerifyLoading(false);
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
    if (productData.length === 0) {
      message.warning('商品不能为空！');
      return;
    }  

    const data = form.getFieldsValue();
    data.id = id;
    data.warehouseDeId = warehouses.find(({ name: wname }) => wname === baseData.warehouseDe)?.id;
    data.areCasesRequired = data.areCasesRequired === 'true'; // 是否原包装
    data.products = productData;
    data.productIds = [...delProductIds];
    setSaveLoading(true);
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/updateDetails',
        resolve,
        reject,
        payload: data,
      });
    });

    promise.then(res => {
      setSaveLoading(false);
      setVisible(false);
      setDelProductIds([]);
      const { code, message: msg } = res as Global.IBaseResponse;
      if (code === 200) {
        message.success(msg || '修改成功！');
        addSuccessCallbal();
        return;
      }
      message.error(msg || '修改失败！');
    });
  };

  // 批量设置申报量为可发量
  const batchApplyshipments = function() {
    if (batchapplyProduct.length === 0) {
      message.warning('请先勾选要修改的商品');
      return;
    }
    for (const item of productData) {
      if (batchapplyProduct.includes(item.id) && !['', undefined, null].includes(item.verifyNum)) {
        item.declareNum = item.verifyNum;
      }
    }
    setProductData([...productData]);
  };

  // 核实
  const toVerify = function() {
    // 可发量 verifyNum 均不能为空
    const isNull = verifyData.some(item => ['', null, undefined].includes(item.verifyNum));
    if (isNull) {
      message.error('国内仓可发量不能为空！');
      return;
    }
    setVerifyLoading(true);
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
      setVerifyLoading(false);
      if (code === 200) {
        message.success(msg || '核实成功！');
        addSuccessCallbal();
        setVisible(false);
        return;
      }
      message.error(msg || '核实失败！');
    });
  };

  // 确定生成Shipment;
  const createShipment = function() {
    const generateShipmentPlans: { mwsShipmentId: string; shipmentName: string }[] = [];
    handleData.map(item => {
      generateShipmentPlans.push({
        mwsShipmentId: item.mwsShipmentId,
        shipmentName: item.shipmentName,
      });
    });
    setCreateShipmentLoading(true);
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
      setCreateShipmentLoading(false);
      const { code, message: msg } = res as Global.IBaseResponse;

      if (code === 200) {
        message.success(msg || '成功生成！');
        history.push(fba.shipment);
        return;
      }

      message.error(msg || '生成失败！');
    });
  };

  // 去处理按钮
  const toHandle = function() {
    // FBA货件计划处理前，后端需要一个预处理步骤
    if (isFBA) {
      setBeforePreviewShipmentLoading(true);
      const promise = new Promise((resolve, reject) => {
        dispatch({
          type: 'planList/beforePreviewShipment',
          resolve,
          reject,
          payload: { id },
        });
      });
      promise.then(res => {
        setBeforePreviewShipmentLoading(false);
        const { code, message: msg } = res as Global.IBaseResponse;
        if (code === 200) {
          request('处理');
          setPageName('处理页面');
          return;
        }
        message.error(msg);
      });
    } else {
      request('处理');
      setPageName('处理页面');
    }
  };

  // 生成发货单按钮
  const handleCreateInvoice = function() {
    // 商品不能为空
    if (productData.length === 0) {
      message.warning('商品不能为空！');
      return;
    }

    const payload = form.getFieldsValue();
    payload.id = id;
    payload.products = productData;
    payload.warehouseDeId = 
        warehouses.find(({ name: wname }) => wname === baseData.warehouseDe)?.id;
    payload.productIds = [...delProductIds];
    setCreateInvoiceLoading(true);
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/createInvoice',
        resolve,
        reject,
        payload,
      });
    });
    promise.then(res => {
      setCreateInvoiceLoading(false);
      const { code, message: msg } = res as Global.IBaseResponse;
      if (code === 200) {
        message.success(msg || '操作成功！');
        setVisible(false);
        return;
      }
      message.error(msg);
    });
  };

  // 修改可发量 verifyNum
  const changeVerifyNum = function(newValue: string, id: string) {
    const temp = verifyData.find((item: planList.IVerifyProductRecord) => item.id === id);
    temp && (
      temp.verifyNum = newValue,
      setVerifyData([...verifyData])
    );
  };

  // 修改申报量 declareNum
  const changeDeclareNum = function(newValue: string, id: string) {
    const temp = verifyData.find((item: planList.IVerifyProductRecord) => item.id === id);
    temp && (
      temp.declareNum = newValue,
      setVerifyData([...verifyData])
    );
  };

  // 根据不同条件生成按钮
  const GetFooter = function() {
    
    // 点击核实打开的弹窗
    if (showText === '核实') {
      const loading = verifyLoading || untoVerifyLoading;
      return <div>
        <Button onClick={() => setVisible(false)} disabled={loading}>取消</Button>
        {
          // 已核实未处理的货件(FBA和非FBA都是)，显示撤销按钮
          (verify && !dispose)
            ?
            <Popconfirm 
              disabled={loading}
              title="确定要将已核实的货件撤销吗？"
              placement="top"
              overlayClassName={styles.delTooltip}
              onConfirm={untoVerify}
              icon={<Iconfont type="icon-tishi2" />}
            >
              <Button type="primary" loading={untoVerifyLoading}>撤销核实</Button>
            </Popconfirm>
            :
            <Button
              type="primary"
              onClick={toVerify}
              loading={verifyLoading}
              disabled={untoVerifyLoading}
            >
              核实
            </Button>
        }
      </div>;
    }

    if (showText === '处理' || pageName === '处理页面') {
      return <div>
        <Button
          onClick={() => {
            setVisible(false);
            setPageName('基本页面');
          }}
          disabled={createShipmentLoading}>
          取消
        </Button>
        <Button type="primary" onClick={createShipment} loading={createShipmentLoading}>
          确定生成Shipment
        </Button>
      </div>;
    }

    // 点击详情打开的弹窗
    if (showText === '详情') {
      // 已核实已处理或者已作废
      if (!isinvalid || (dispose && verify)) {
        return <Button onClick={() => setVisible(false)}>取消</Button>;
      }

      // 未核实未处理
      if (!dispose && !verify) {
        return <div>
          <Button onClick={() => setVisible(false)} disabled={saveLoading}>取消</Button>
          <Popconfirm 
            disabled={saveLoading}
            title="作废后不可恢复，确定作废？"
            placement="top"
            overlayClassName={styles.delTooltip}
            onConfirm={() => updateItemPlan(String(id))}
            icon={<Iconfont type="icon-tishi2" />}
          >
            <Button>作废</Button>
          </Popconfirm>
          <Button type="primary" onClick={save} loading={saveLoading}>保存</Button>
        </div>;
      }
      
      // 已核实未处理
      if (verify && !dispose) {
        const loading = createInvoiceLoading || saveLoading || beforePreviewShipmentLoading;
        return <div>
          <Button onClick={() => setVisible(false)} disabled={loading}>
            取消
          </Button>
          <Popconfirm 
            disabled={loading}
            title="作废后不可恢复，确定作废？"
            placement="top"
            overlayClassName={styles.delTooltip}
            onConfirm={() => updateItemPlan(String(id))}
            icon={<Iconfont type="icon-tishi2" />}
          >
            <Button>作废</Button>
          </Popconfirm>
          <Button type="primary" onClick={save} loading={saveLoading} disabled={loading}>
            保存
          </Button>
          {
            // 海外仓计划不用处理生成shipment，直接生成发货单
            isFBA
              ?
              <Button
                type="primary"
                onClick={toHandle}
                loading={beforePreviewShipmentLoading}
                disabled={loading}
              >
                去处理
              </Button>
              :
              <Button
                type="primary"
                onClick={handleCreateInvoice}
                loading={createInvoiceLoading}
                disabled={loading}
              >
                生成发货单
              </Button>
          }
        </div>;
      }

      // 已处理
      if (isFBA && dispose) {
        return (
          <div>
            <Button onClick={() => setVisible(false)}>取消</Button>
            <AssociatShipment id={baseData.shipmentId}/>
          </div>
        );
      }
    }

    return <></>;
  };

  return <div className={styles.box}>
    <Modal visible={visible}
      centered
      maskClosable={false}
      width={1180}
      wrapClassName={styles.modalBox}
      onCancel={() => setVisible(false)}
      footer={<GetFooter />}
    >
      <header className={styles.topHead}>{getTitle()}</header>
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
              {
                baseData?.mwsShipmentId
                  ? baseData?.mwsShipmentId.map(item => `${item}、`)
                  : <Line/>
              }
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
          {/* 核实页面和处理页面不可修改基础信息 */}
          {
            pageName === '核实页面' || pageName === '处理页面'
              ?
              <>
                <div className={styles.item}>
                  <span className={styles.text}>目的仓库：</span>
                  <span className={styles.content}>
                    { baseData.warehouseDe || <Line/> }
                  </span>
                </div> 
                <div className={styles.item}>
                  <span className={styles.text}>物流方式：</span>
                  <span className={styles.content}>
                    { baseData.shippingType || <Line/> }
                  </span>
                </div>
                <div className={styles.item}>
                  <span className={styles.text}>包装方式：</span>
                  { (baseData.areCasesRequired ? '原厂包装' : '混装') }
                </div>
                <div className={styles.item}>
                  <span className={styles.text}>贴标方：</span>
                  <span className={styles.content}>
                    {
                    labelling.find(
                      item => item.value === baseData.labelingType
                    )?.label || <Line/>
                    }
                  </span>
                </div>
                <div className={styles.item}>
                  <span className={styles.text}>发货地址：</span>
                  <span className={styles.content}>
                    { baseData.addressLine1 || <Line/> }
                  </span>
                </div>
              </>
              :
              <>
                <div className={styles.item}>
                  <span className={styles.text}>目的仓库：</span>
                  <Item name="warehouseDe" className={styles.select}>
                    {
                      // FBA货件计划不可修改目标仓库，非FBA货件计划可以修改，但是不能修改为 FBA 仓和国内仓
                      isFBA
                        ? baseData.warehouseDe
                        :
                        <Select dropdownMatchSelectWidth={false}>
                          {
                            warehouses.map(
                              item => <Option value={item.name} key={item.name}>{item.name}</Option>
                            )
                          }
                        </Select>
                    }
                  </Item>
                </div> 
                <div className={styles.item}>
                  <span className={styles.text}>物流方式：</span>
                  { dispose ? baseData?.shippingType : 
                    <Item name="shippingType" className={styles.select}>
                      <Select dropdownMatchSelectWidth={false}>
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
                    <Item name="areCasesRequired" className={styles.select}>
                      <Select dropdownMatchSelectWidth={false}>
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
                    <Item name="labelingType" className={styles.select}>
                      <Select dropdownMatchSelectWidth={false}>
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
                      <Select dropdownMatchSelectWidth={false}>
                        {spinAddress.map((item, i) => (
                          <Option value={item.addressLine1} key={i}>{item.addressLine1}</Option>
                        ))}
                      </Select>
                    </Item>
                  }
                </div>
              </>
          }
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
            loading={productListLoading}
            state={baseData?.state || false}
            changeProductData={
              (products: IData['products']) => setBaseData({ ...baseData, products })
            }
          /> }

          {/*  Shipment信息 */}
          { nav === 'shipment' && <Shipment data={baseData.shipments}/>}
          
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
          changeDeclareNum={changeDeclareNum}
          shopId={baseData?.storeId}
          areCasesRequired={baseData?.areCasesRequired}
        />
      }

    </Modal>
    <span onClick={() => setVisible(!visible)}>{showText}</span>
  </div>;
};


export default Details;
