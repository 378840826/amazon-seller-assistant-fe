/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-06 12:01:01
 * @LastEditTime: 2021-05-19 15:39:09
 */
import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Modal,
  Form,
  Select,
  Input,
  Button,
  Table,
  message,
} from 'antd';
import ShowData from '@/components/ShowData';
import { Iconfont, getAmazonAsinUrl, requestErrorFeedback, strToUnsignedIntStr } from '@/utils/utils';
import { useDispatch, useSelector, ConnectProps, IFbaBaseState, IPianListState, history } from 'umi';
import GoodsImg from '@/pages/components/GoodsImg';
import MyUPload from './Upload';
import InputEditBox from '@/pages/fba/components/InputEditBox';
import { asinPandectBaseRouter } from '@/utils/routes';
import { labelling, wayPacking } from '../../config';
import TableNotData from '@/components/TableNotData';

interface IProps {
  visible: boolean;
  marketplace: API.Site;
  onCancel: () => void;
  addSuccessCallbal: () => void;
}

interface IPage extends ConnectProps {
  fbaBase: IFbaBaseState;
  planList: IPianListState;
}


const { Item } = Form;
const { Option } = Select; 
const Addplan: React.FC<IProps> = function(props) {
  const {
    visible,
    onCancel,
    marketplace,
    addSuccessCallbal,
  } = props;

  const shops = useSelector((state: IPage) => state.fbaBase.shops);
  const logistics = useSelector((state: IPage) => state.fbaBase.logistics);
  const sites = useSelector((state: IPage) => state.planList.sites);


  const warehouses = useSelector((state: IPage) => state.planList.warehouses);
  const [data, setData] = useState<planList.IProductList[]>([]);
  const [selects, setSelects] = useState<planList.IProductList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [spinAddress, setSpinAddress] = useState<planList.IAddressLine[]>([]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const currentSiteShops = shops.filter(item => {
    if (item.marketplace === form.getFieldValue('countryCode')) {
      return item;
    }
  });

  const requestProduct = useCallback(
    (marketplace: string, storeId: string, code = '') => {
      setLoading(true);
      new Promise((resolve, reject) => {
        dispatch({
          type: 'planList/getProductList',
          reject,
          resolve,
          payload: {
            storeId,
            marketplace,
            code,
          },
        });
      }).then((datas => {
        const {
          code,
          message: msg,
          data,
        } = datas as {
          code: number;
          message?: string;
          data: planList.IProductList[];
        };

        setLoading(false);
        if (code === 200) {
          setData(data);
          return;
        }
        
        message.error(msg === '???????????????' ? '?????????????????????' : '?????????????????????');
        setData([]);
      }));
    }, [dispatch]);

  const getSites = useCallback(() => {
    dispatch({
      type: 'planList/getSites',
      callback: requestErrorFeedback,
    });
  }, [dispatch]);

  const getShops = useCallback((marketplace: string) => {
    dispatch({
      type: 'fbaBase/getShops',
      callback: requestErrorFeedback,
      payload: {
        marketplace,
      },
    });
  }, [dispatch]);

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
      message.error(msg || '???????????????????????????????????????');
    });
    
  }, [dispatch, visible]);

  // ??????????????????????????????
  useEffect(() => {
    visible && form.setFieldsValue({
      labelingType: labelling[1].value,
      areCasesRequired: String(wayPacking[0].value),
    });
  }, [form, visible]);

  // ???????????????
  useEffect(() => {
    if (!visible) {
      return;
    }

    dispatch({
      type: 'fbaBase/getLogistics',
      callback: requestErrorFeedback,
    });
    

    dispatch({
      type: 'planList/getWarehouses',
      callback: requestErrorFeedback,
      payload: {
        nonfba: false,
        nonDomestic: true,
      },
    });

  }, [visible, dispatch]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    sites.length === 0 && getSites();

  }, [sites, getSites, visible]);

  // ??????????????????????????????????????????????????????
  useEffect(() => {
    if (!visible) {
      return;
    }
    
    if (sites.length) {
      form.setFieldsValue({ countryCode: sites[0] });
      // ???????????????????????? ????????????????????? useEffect ?????????????????????
      // getShops(sites[0]);
    } else {
      dispatch({
        type: 'fbaBase/saveShop',
        payload: [],
      });
    }
  }, [dispatch, form, sites, visible]);

  // ???????????????????????????????????????????????????????????????????????????????????????
  useEffect(() => {
    if (!visible) {
      return;
    }

    if (shops.length) {
      const countryCode = form.getFieldValue('countryCode');
      form.setFieldsValue({
        storeId: shops[0].id,
      });
      
      requestProduct(countryCode, shops[0].id);
      getSpinAddress(shops[0].id);
    } else {
      setData([...[]]);
      dispatch({
        type: 'fbaBase/saveSpinAddress',
        payload: [],
      });
    }
  }, [dispatch, form, requestProduct, getSpinAddress, shops, visible]);


  // ???????????????
  useEffect(() => {
  
    if (warehouses.length) {
      form.setFieldsValue({
        warehouseDe: warehouses[0].name,
      });
    }

    if (spinAddress.length) {
      form.setFieldsValue({
        addressLine1: spinAddress[0].addressLine1,
      });
    }

    if (logistics.length) {
      form.setFieldsValue({
        shippingType: logistics[0],
      });
    }

  }, [warehouses, spinAddress, form, logistics]); 

  // ??????
  const allSelect = () => {
    const maxSelect = 1000; // ???????????????????????????
    if (data.length === 0 || data.length === selects.length) {
      return;
    }

    if (data.length > maxSelect) {
      message.warn(`?????????????????????${data.length}??????????????????${maxSelect}?????????????????????????????????${maxSelect}???????????????`);
      setSelects([...data.slice(0, maxSelect)]);
      return;
    }

    setSelects([...data]);
  };

  // ????????????
  const delItemSelect = (sellerSku: string) => {
    for (let i = 0; i < selects.length; i++) {
      if (selects[i].sellerSku === sellerSku) {
        selects.splice(i, 1);
        setSelects([...selects]);
        break;
      }
    }
  };

  // ????????????
  const delAllSelect = () => {
    if (selects.length === 0) {
      return;
    }
    setSelects([...[]]);
  };

  // ???????????????
  const updateSaid = function(sellerSku: string, newValue: string) {
    for (let index = 0; index < selects.length; index++) {
      const item = selects[index];
      if (item.sellerSku === sellerSku) {
        item.declareNum = String(newValue);
        break;
      }
    }
  };

  // ??????????????????
  const toAsin = function(asin: string) {
    const stopId = form.getFieldValue('storeId');
    
    dispatch({
      type: 'global/setCurrentShop',
      payload: {
        id: stopId,
      },
    });

    setTimeout(() => {
      history.push(`${asinPandectBaseRouter}?asin=${asin}`);
    }, 10);
  };


  const getColumns = (type: 'leftColumns'|'rightColumns') => {
    const columns = [
      {
        title: '??????/??????/ASIN/SKU',
        align: 'center',
        dataIndex: 'sku1',
        width: 280,
        render(value: string, record: planList.IProductList) {
          const {
            url = '',
            asin1 = '',
            itemName,
            sku,
          } = record;
          const titleLink = getAmazonAsinUrl(asin1, marketplace);
  
          return <div className={styles.productCol}>
            <GoodsImg alt="??????" src={url} width={46}/>
            <div className={styles.details}>
              <a href={titleLink} className={styles.title} rel="noreferrer" target="_blank" title={itemName}>
                <Iconfont type="icon-lianjie" className={styles.linkIcon}/>
                {itemName}
              </a>
              <div className={styles.info}>
                <span 
                  onClick={() => toAsin(asin1)}
                  className={styles.asin}>
                  {asin1}
                </span>
                <span className={styles.price}>{sku}</span>
              </div>
            </div>
          </div>;
        },
      },
      {
        title: 'FBA????????????',
        align: 'center',
        dataIndex: 'available',
        key: 'available',
        width: 80,
        render(val: string) {
          return <div>{[null, ''].includes(val) ? <ShowData value={null} /> : <ShowData value={val} isMoney fillNumber={0}/>}</div>;
        },
      },
      {
        title: 'MSKU/FnSKU',
        align: 'center',
        dataIndex: 'sellerSku',
        key: 'sellable',
        width: 120,
        render(val: string, record: planList.IProductList) {
          return <div>
            <p>{val}</p>
            <p>{record.fnsku}</p>
          </div>;
        },
      },
      {
        title: '??????',
        align: 'center',
        dataIndex: 'sellerSku',
        // key: 'handle',
        width: 60,
        render(val: string, record: planList.IProductList) {
          // ???????????????
          if (type === 'rightColumns') {
            return <span 
              className={styles.handleCol}
              onClick={() => delItemSelect(val)}>
              ??????
            </span>;
          }

          let flag = false;

          for (let i = 0; i < selects.length; i++) {
            const item = selects[i];
            if (item.sellerSku === val) {
              flag = true;
              break;
            }
          }

          if (flag) {
            return <span 
              className={classnames(styles.handleCol, styles.selected)}>
              ??????
            </span>;
          }
  
          return <span className={styles.handleCol} onClick={() => {
            selects.push(Object.assign({}, record, { declareNum: 0 }));
            setSelects([...selects]);
          }}>??????</span>;
        },
      },
    ];

    // ?????????????????????
    if (type === 'rightColumns') {
      const saidCol = {
        title: '?????????',
        align: 'center',
        dataIndex: 'declareNum',
        width: 80,
        render: (val: string, record: planList.IProductList) => (
          <InputEditBox
            value={val}
            chagneCallback={val => updateSaid(record.sellerSku, String(val))}
            format={{
              converterFun: strToUnsignedIntStr,
              valueRule: {
                min: '1',
                max: '99999999',
                required: true,
              },
            }}
          />
        ),
      };

      columns.splice(3, 0, saidCol);
    }

    return columns;
  };

  // ????????????
  const searchProductCallback = (asin: string, event: any ) => { // eslint-disable-line
    // ???????????????????????????X?????????????????????????????????
    if (asin === '' && 'button' in event && event.target.className === 'ant-input') {
      return;
    }
    requestProduct(form.getFieldValue('countryCode'), form.getFieldValue('storeId'), asin);
    // setSearchProduct(asin);
  };

  // form change
  const handleFormFieldsValue = function(values: any) { // eslint-disable-line
    // ??????????????????????????????
    if (values.countryCode) {
      getShops(values.countryCode);
    }

    // ????????????????????????????????????????????????
    if (values.countryCode || values.storeId) {
      const countryCode = form.getFieldValue('countryCode');
      setSelects([]); 
      values.storeId && (
        getSpinAddress(values.storeId),
        requestProduct(countryCode, values.storeId)
      );
    }
  };

  const LeftTable = {
    columns: getColumns('leftColumns') as [],
    dataSource: data,
    rowKey: 'sellerSku',
    loading,
    locale: {
      emptyText: <TableNotData hint={'??????????????????????????????????????????????????????'} />,
    },
    scroll: {
      y: 320,
    },
    pagination: false as false,
  };

  const rightTable = {
    columns: getColumns('rightColumns') as [],
    dataSource: selects,
    rowKey: 'sellerSku',
    locale: {
      emptyText: <span className="secondaryText">??????????????????</span>,
    },
    scroll: {
      y: 320,
    },
    pagination: false as false,
  };

  // ????????????
  const onOk = function() {
    const data = form.getFieldsValue();
    let flag = false;
    const emptys = [undefined, null, '', 0];
    data.areCasesRequired = data.areCasesRequired === 'true';
    // ?????????????????????select option??????????????????id???????????????????????????????????????id????????????.........
    // ????????????????????????ID?????????
    data.warehouseDeId = warehouses.find(({ name: wname }) => wname === data.warehouseDe)?.id;
    // ?????????????????????????????????????????????id????????????
    data.warehouseId = spinAddress.find(
      ({ addressLine1 }) => addressLine1 === data.addressLine1)?.id;

    if (selects.length === 0) {
      message.error('?????????????????????');
      return;
    }


    // ???????????????????????????
    for (let i = 0; i < selects.length; i++) {
      const item = selects[i];
      if (emptys.includes(item.declareNum) ) {
        flag = true;
        break;
      }
    }

    if (flag) {
      message.error('?????????????????????????????????0');
      return;
    }

    // ??????????????????
    const fieldError = form.getFieldsError().find(err => {
      return err.errors.length && err;
    });
    if (fieldError) {
      message.error(fieldError.errors[0]);
      return;
    }

    data.shipmentProductVos = selects;

    new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/addPlan',
        resolve,
        reject,
        payload: data,
      });
    }).then(datas => {
      const { code, message: msg } = datas as Global.IBaseResponse;
      if (code === 200) {
        message.success(msg);
        onCancel();
        addSuccessCallbal();
        setSelects([...[]]);
        return;
      }
      message.error(msg);
    });
  };

  const uploadSuccess = function(uploadData: planList.IProductList[]) {
    setSelects([...selects, ...uploadData]);
  };


  return <div className={styles.box}>
    <Modal visible={visible}
      closable={false}
      centered
      maskClosable={false}
      width={1285}
      wrapClassName={styles.modalBox}
      onCancel={onCancel}
      onOk={onOk}
    >
      <header className={styles.topHead}>??????????????????</header>
      <Form 
        className={styles.conditions} 
        labelAlign="left"
        name="addPlan"
        form={form}
        onValuesChange={handleFormFieldsValue}
      >
        <Item name="countryCode" label="??????">
          <Select>
            {sites.map((item, index) => {
              return <Option value={item} key={index}>{item}</Option>;
            })}
          </Select>
        </Item>
        <Item name="storeId" label="????????????">
          <Select>
            {
              currentSiteShops.map((item, index) => (
                <Option value={item.id} key={index}>{item.storeName}</Option>
              ))
            }
          </Select>
        </Item>
        <Item name="warehouseDe" label="????????????">
          <Select>
            {warehouses.map((item, index) => {
              return <Option value={item.name} key={index}>{item.name}</Option>;
            })}
          </Select>
        </Item>
        <Item name="shippingType" label="????????????">
          <Select>
            {logistics.map((item, index) => {
              return <Option value={item} key={index}>{item}</Option>;
            })}
          </Select>
        </Item>
        <Item name="areCasesRequired" label="????????????">
          <Select>
            {wayPacking.map((item, index) => {
              return <Option value={String(item.value)} key={index}>{item.label}</Option>;
            })}
          </Select>
        </Item>
        <Item name="labelingType" label="?????????">
          <Select>
            {labelling.map((item, index) => {
              return <Option value={item.value} key={index}>{item.label}</Option>;
            })}
          </Select>
        </Item> 
        <Item name="addressLine1" label="????????????">
          <Select>
            {spinAddress.map((item, index) => {
              return <Option value={item.addressLine1} key={index}>{item.addressLine1}</Option>;
            })}
          </Select>
        </Item>
        <Item name="remarkText" label="??????" rules={[{ max: 40 }]}>
          <Input />
        </Item>
      </Form>
      <div className={styles.uploading}>
        <MyUPload form={form} uploadSuccess={uploadSuccess}/>
        <Button type="link" href="/api/mws/shipment/mSkuProduct/importTemplate" >????????????</Button>
      </div>
    
      <div className={styles.productSelect}>
        <div className={styles.layoutLeft}>
          <header className={styles.head}>
            <Input.Search
              autoComplete="off"
              placeholder="???????????????ASIN???SKU" 
              enterButton={<Iconfont type="icon-sousuo" />} 
              className="h-search"
              allowClear
              onSearch={searchProductCallback}
            />
            <span style={{
              paddingRight: data.length > 3 ? 36 : 20,
            }} className={classnames(
              styles.allSelect, 
              data.length ? '' : styles.disable,
              data.length > 0 && data.length <= selects.length ? styles.disable : '',
            )}
            onClick={allSelect}
            >
              {data.length && data.length <= selects.length ? '?????????' : '??????'}
            </span>
          </header>
          <Table {...LeftTable} className={styles.table}/>
        </div>
        <div className={styles.layoutRight}>
          <header className={styles.head}>
            <span>????????????</span>
            <span className={classnames(
              styles.delSelect, 
              selects.length ? '' : styles.disable,
            )} onClick={delAllSelect}>????????????</span>
          </header>
          <Table {...rightTable} className={styles.table}/>
        </div>
      </div>
    </Modal>
  </div>;
};


export default Addplan;
