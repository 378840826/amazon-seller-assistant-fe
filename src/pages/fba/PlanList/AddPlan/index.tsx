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
  const [searchProduct, setSearchProduct] = useState<string|'notRequest'>('');
  const [spinAddress, setSpinAddress] = useState<planList.IAddressLine[]>([]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const currentSiteShops = shops.filter(item => {
    if (item.marketplace === form.getFieldValue('countryCode')) {
      return item;
    }
  });

  const requestProduct = useCallback(
    (marketplace: string, storeId: string, code = searchProduct) => {
      if (searchProduct === 'notRequest') {
        return;
      }

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
        
        message.error(msg === '暂无数据！' ? '该店铺暂无商品' : '商品列表异常！');
        setData([]);
      }));
    }, [dispatch, searchProduct]);

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
      message.error(msg || '该店铺下无关联的发货地址！');
    });
    
  }, [dispatch, visible]);

  // 实始化表单的一些字段
  useEffect(() => {
    visible && form.setFieldsValue({
      labelingType: labelling[1].value,
      areCasesRequired: String(wayPacking[0].value),
    });
  }, [form, visible]);

  // 初始化请求
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

  // 当请求站点成功后，再请求店铺下拉列表
  useEffect(() => {
    if (!visible) {
      return;
    }
    
    if (sites.length) {
      form.setFieldsValue({ countryCode: sites[0] });
      // 不需要手动请求， 上面设置站点后 useEffect 会请求一次店铺
      // getShops(sites[0]);
    } else {
      dispatch({
        type: 'fbaBase/saveShop',
        payload: [],
      });
    }
  }, [dispatch, form, sites, visible]);

  // 当请求店铺列表成功后，再开始请求商品接口和发货地址下拉列表
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
      searchProduct === '' && getSpinAddress(shops[0].id);
    } else {
      setData([...[]]);
      dispatch({
        type: 'fbaBase/saveSpinAddress',
        payload: [],
      });
    }
  }, [dispatch, form, requestProduct, getSpinAddress, shops, visible, searchProduct]);


  // 表单初始化
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

  // 全选
  const allSelect = () => {
    const maxSelect = 1000; // 商品最大选择的数量
    if (data.length === 0 || data.length === selects.length) {
      return;
    }

    if (data.length > maxSelect) {
      message.warn(`当前店铺商品有${data.length}个，最多添加${maxSelect}个商品，已为你选择前面${maxSelect}个，请知悉`);
      setSelects([...data.slice(0, maxSelect)]);
      return;
    }

    setSelects([...data]);
  };

  // 删除单个
  const delItemSelect = (asin: string) => {
    for (let i = 0; i < selects.length; i++) {
      if (selects[i].asin1 === asin) {
        selects.splice(i, 1);
        setSelects([...selects]);
        break;
      }
    }
  };

  // 删除全部
  const delAllSelect = () => {
    if (selects.length === 0) {
      return;
    }
    setSelects([...[]]);
  };

  // 修改申报量
  const updateSaid = function(asin: string, newValue: string) {
    for (let index = 0; index < selects.length; index++) {
      const item = selects[index];
      if (item.asin1 === asin) {
        item.declareNum = String(newValue);
        break;
      }
    }
  };

  // 跳转到新窗口
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
        title: '图片/标题/ASIN/SKU',
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
            <GoodsImg alt="商品" src={url} width={46}/>
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
        title: 'FBA可售库存',
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
        title: '操作',
        align: 'center',
        dataIndex: 'asin1',
        // key: 'handle',
        width: 60,
        render(val: string, record: planList.IProductList) {
          // 右边的表格
          if (type === 'rightColumns') {
            return <span 
              className={styles.handleCol}
              onClick={() => delItemSelect(val)}>
              删除
            </span>;
          }

          let flag = false;

          for (let i = 0; i < selects.length; i++) {
            const item = selects[i];
            if (item.asin1 === val) {
              flag = true;
              break;
            }
          }

          if (flag) {
            return <span 
              className={classnames(styles.handleCol, styles.selected)}>
              已选
            </span>;
          }
  
          return <span className={styles.handleCol} onClick={() => {
            selects.push(Object.assign({}, record, { declareNum: 0 }));
            setSelects([...selects]);
          }}>选择</span>;
        },
      },
    ];

    // 右边添加申报量
    if (type === 'rightColumns') {
      const saidCol = {
        title: '申报量',
        align: 'center',
        dataIndex: 'declareNum',
        width: 80,
        render: (val: string, record: planList.IProductList) => (
          <InputEditBox
            value={val}
            chagneCallback={val => updateSaid(record.asin1, String(val))}
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

  // 搜索商品
  const searchProductCallback = (asin: string, event: any ) => { // eslint-disable-line
    // 这个条件限制当点击X图标时，不重新请求数据
    if (asin === '' && 'button' in event && event.target.className === 'ant-input') {
      setSearchProduct('notRequest');
      return;
    }
    requestProduct(form.getFieldValue('countryCode'), form.getFieldValue('storeId'));
    // setSearchProduct(asin);
  };

  // form change
  const handleFormFieldsValue = function(values: any) { // eslint-disable-line
    // 切换站点后，加载店铺
    if (values.countryCode) {
      getShops(values.countryCode);
    }

    // 切换站点或店铺时，选中的商品清空
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
    rowKey: 'contact_id',
    loading,
    locale: {
      emptyText: <span className="secondaryText">店铺无商品</span>,
    },
    scroll: {
      y: 320,
    },
    pagination: false as false,
  };

  const rightTable = {
    columns: getColumns('rightColumns') as [],
    dataSource: selects,
    rowKey: 'contact_id',
    locale: {
      emptyText: <span className="secondaryText">左边添加商品</span>,
    },
    scroll: {
      y: 320,
    },
    pagination: false as false,
  };

  // 提交创建
  const onOk = function() {
    const data = form.getFieldsValue();
    let flag = false;
    const emptys = [undefined, null, '', 0];
    data.areCasesRequired = data.areCasesRequired === 'true';
    // 为什么不直接在select option标签下直接将id作为值？后端现在要传名称和id都传给他.........
    // 多传一个目的仓库ID给后端
    data.warehouseDeId = warehouses.find(({ name: wname }) => wname === data.warehouseDe)?.id;
    // 根据选中的发货地址，将发货地址id传给后端
    data.warehouseId = spinAddress.find(
      ({ addressLine1 }) => addressLine1 === data.addressLine1)?.id;

    if (selects.length === 0) {
      message.error('未选择任何商品');
      return;
    }


    // 检查申报量是否为空
    for (let i = 0; i < selects.length; i++) {
      const item = selects[i];
      if (emptys.includes(item.declareNum) ) {
        flag = true;
        break;
      }
    }

    if (flag) {
      message.error('申请量不能为空或者小于0');
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
      <header className={styles.topHead}>创建货件计划</header>
      <Form 
        className={styles.conditions} 
        labelAlign="left"
        name="addPlan"
        form={form}
        onValuesChange={handleFormFieldsValue}
      >
        <Item name="countryCode" label="站点">
          <Select>
            {sites.map((item, index) => {
              return <Option value={item} key={index}>{item}</Option>;
            })}
          </Select>
        </Item>
        <Item name="storeId" label="店铺名称">
          <Select>
            {
              currentSiteShops.map((item, index) => (
                <Option value={item.id} key={index}>{item.storeName}</Option>
              ))
            }
          </Select>
        </Item>
        <Item name="warehouseDe" label="目的仓库">
          <Select>
            {warehouses.map((item, index) => {
              return <Option value={item.name} key={index}>{item.name}</Option>;
            })}
          </Select>
        </Item>
        <Item name="shippingType" label="物流方式">
          <Select>
            {logistics.map((item, index) => {
              return <Option value={item} key={index}>{item}</Option>;
            })}
          </Select>
        </Item>
        <Item name="areCasesRequired" label="包装方式">
          <Select>
            {wayPacking.map((item, index) => {
              return <Option value={String(item.value)} key={index}>{item.label}</Option>;
            })}
          </Select>
        </Item>
        <Item name="labelingType" label="贴标方">
          <Select>
            {labelling.map((item, index) => {
              return <Option value={item.value} key={index}>{item.label}</Option>;
            })}
          </Select>
        </Item> 
        <Item name="addressLine1" label="发货地址">
          <Select>
            {spinAddress.map((item, index) => {
              return <Option value={item.addressLine1} key={index}>{item.addressLine1}</Option>;
            })}
          </Select>
        </Item>
        <Item name="remarkText" label="备注">
          <Input maxLength={40} />
        </Item>
      </Form>
      <div className={styles.uploading}>
        <MyUPload form={form} uploadSuccess={uploadSuccess}/>
        <Button type="link" href="/api/mws/shipment/mSkuProduct/importTemplate" >下载模板</Button>
      </div>
    
      <div className={styles.productSelect}>
        <div className={styles.layoutLeft}>
          <header className={styles.head}>
            <Input.Search
              autoComplete="off"
              placeholder="输入标题、ASIN或SKU" 
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
              {data.length && data.length <= selects.length ? '已全选' : '全选'}
            </span>
          </header>
          <Table {...LeftTable} className={styles.table}/>
        </div>
        <div className={styles.layoutRight}>
          <header className={styles.head}>
            <span>已选商品</span>
            <span className={classnames(
              styles.delSelect, 
              selects.length ? '' : styles.disable,
            )} onClick={delAllSelect}>删除全部</span>
          </header>
          <Table {...rightTable} className={styles.table}/>
        </div>
      </div>
    </Modal>
  </div>;
};


export default Addplan;
