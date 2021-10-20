/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-25 11:56:45
 * @LastEditTime: 2021-04-29 17:16:49
 * 
 * 添加MSKU
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Modal, Form, Input, Radio, Upload, Tabs, message, Select, Button, Table } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { states, packWeightUnit, packSizeUnit, packTextureUnit, shopDownlist, sumVolumeOversize, sumWeightOversize } from '../config';
import { useSelector, ConnectProps, IConfigurationBaseState, IWarehouseLocationState, useDispatch, ISupplierState } from 'umi';

import PackInfo from './PackInfo';
import CostPrice from './CostPrice';
import TableNotData from '@/components/TableNotData';
import { strToMoneyStr } from '@/utils/utils';
import editable from '@/pages/components/EditableCell';

interface IPage extends ConnectProps {
  configurationBase: IConfigurationBaseState;
  warehouseLocation: IWarehouseLocationState;
  supplier: ISupplierState;
}

interface IProps {
  initData: skuData.IRecord;
  updateSku: (newData: skuData.IRecord) => void;
  supplierList: Supplier.ISupplierList[];
}

const { Item } = Form;
const { TabPane } = Tabs;
// let lastFetchId = 0;
const AddSku: React.FC<IProps> = props => {
  const { initData, updateSku, supplierList } = props;
  const { suppliers } = initData;

  const shops = useSelector((state: IPage) => state.configurationBase.shops);
  const warehouses = useSelector((state: IPage) => state.warehouseLocation.warehouses);
  //const supplierList = useSelector((state: IPage) => state.supplier.supplierList);

  const [loading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string|null>(null); // 首页图片
  const [packImage, setPackImage] = useState<string|null>(null); // 包装图片
  const [nav, setNav] = useState<string>('1');
  // const [fetching, setFetching] = useState<boolean>(false); // 搜索MSKU时的loading
  // 添加 MSKU 时，当前选中的站点下的全部 msku
  const [storeSku, setStoreSku] = useState<skuData.IMskuList[]>([]);
  const [skuListData, setSkuListData] = useState<skuData.IMskuList[]>([]);
  // msku列表
  const [mskuTableData, setMskuTableData] = useState<skuData.IMskuList[]>([]);
  // 库位号下拉列表
  const [locationNum, setLocatioNum] = useState<skuData.ILocations[]>([]);
  // 库位号列表
  const [locations, setLocations] = useState<skuData.ILocations[]>([]);
  //供应商下拉列表
  const [supplierDownList, setsupplierDownList] = useState<Supplier.ISupplierList[]>([]);
  //供应商表格数据
  const [supplierTableData, setSupplierTableData] = useState<skuData.ISupplierDownList[]>([]);

  const [productvolumeisOversize, setProductvolumeisOversize] = useState<boolean>(false);
  const [packWeightisOversize, setPackWeightisOversize] = useState<boolean>(false);
  const [isOversize, setIsOversize] = useState<boolean>(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { Option } = Select;

  useEffect(() => {
    form.setFieldsValue({ ... initData });
    setImageUrl(initData.imageUrl || '');
    setPackImage(initData.pimageUrl || '');
    setMskuTableData([...initData.mskus]);
    setLocations([...initData.locationNos]);

    // 其它包装材质
    const index = packTextureUnit.findIndex(item => item.value === initData.packingMaterial);
    if (index === -1) {
      form.setFieldsValue({
        packingMaterial: packTextureUnit[4].value,
        otherPacking: initData.packingMaterial,
      });
    }
  }, [initData, form]);

  // 请求仓库列表
  useEffect(() => {
    visible && dispatch({
      type: 'warehouseLocation/getWarehouseList',
      payload: {
        state: true,
      },
    });
  }, [dispatch, visible]);

  //请求全部供应商列表
  useEffect(() => {
    //给表格数据找出来
    setSupplierTableData([...suppliers]);
    setsupplierDownList([...supplierList]);

    /** 
    new Promise((resolve, reject) => {
      dispatch({
        type: 'supplier/getSupplierList',
        reject,
        resolve,
        payload: {
          state: 'enabled',
          match: 'SupplierName',
          code: null,
          settlementType: null,
        },
      });    
    }).then((datas) => {
      const {
        code,
        message: msg,
      } = datas as {
        code: number;
        message: string;
      };     
      if (code === 200 ){
        setsupplierDownList([...supplierList]);
        return;
      }
      message.error(msg);
    }); //eslint-disable-next-line react-hooks/exhaustive-deps
    */   
  }, [suppliers, supplierList]);//eslint-disable-next-line react-hooks/exhaustive-deps


  const onCancel = function() {
    setVisible(false);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 4 }}>上传</div>
    </div>
  );

  // 站点改变时,修改下拉列表
  const changeStore = function(val: string ) {
    form.setFieldsValue({
      storeName: undefined,
    });

    dispatch({
      type: 'configurationBase/getShop',
      payload: { marketplace: val ? val : null },
    });
  };

  // 请求店铺下的全部 msku
  const getStoreMsku = function(storeId: string) {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'skuData/getMskuList',
        resolve,
        reject,
        // code 为接口要求不必须参数
        payload: { id: storeId, code: '' },
      });
    }).then(datas => {
      const {
        code,
        message: msg,
        data,
      } = datas as {
        code: number;
        message: string;
        data: skuData.IMskuList[];
      };

      if (code === 200) {
        if (data.length === 0) {
          message.error('暂无MSKU');
        }
        setSkuListData([...data]);
        setStoreSku([...data]);
        return;
      }
      message.error(msg || '请求MSKU列表失败，请重试！');
    });
  };

  // 搜索msku
  const search = (value: string) => {
    const newList = storeSku.filter(
      msku => msku.sellerSku.toLowerCase().includes(value.toLowerCase())
    );
    setSkuListData(newList);
  };
  

  // 请求库位号
  const requestLocationNum = function(locationId: number, code: string|null = null) {
    const payload = {
      id: locationId,
      code,
    };

    new Promise((resolve, reject) => {
      dispatch({
        type: 'skuData/getLocationList',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      const {
        code,
        data,
      } = datas as {
        code: number;
        data: skuData.ILocations[];
      };
      if (code === 200) {
        setLocatioNum([...data]);
        return;
      }
      message.error('获取库位号列表失败');
    });
  };

  // 搜索库位号
  const searchLocation = function(code: string) {
    const warehouseId = form.getFieldValue('warehouseName'); // 仓库ids    
    requestLocationNum(warehouseId, code);
  };

  // 添加msku
  const addMsku = function() {
    const datas = form.getFieldsValue();
    const mskuList = datas.mskuList;

    let marketplace = datas.marketplace;
    let storeName = datas.storeName;

    if (!marketplace || !storeName) {
      message.error('请选择站点和店铺！');
      return;
    }

    marketplace = shopDownlist.find(item => item.value === marketplace);
    marketplace = marketplace.label;

    storeName = shops.find(item => item.value === storeName);
    storeName = storeName.label;
    
    if (
      mskuList === undefined 
      || mskuList === ''
      || mskuList === null
      || mskuList.length === 0
    ) {
      message.error('请选择MSKU');
      return;
    }
    
    form.setFieldsValue({
      mskuList: [],
    });

    mskuList.forEach((item: string) => {
      const mskuIndex = skuListData.findIndex(childItem => childItem.sellerSku === item);
      // 不能重复
      const repetition = mskuTableData.find(t => t.sellerSku === item);
      if (repetition) {
        message.warning(`MSKU：${repetition.sellerSku} 已添加，无需重复添加`);
        return;
      }
      mskuTableData.push({
        sellerSku: item,
        asin1: skuListData[mskuIndex].asin1,
        storeId: skuListData[mskuIndex].storeId,
        marketplace,
        storeName,
      });
    });  
    setMskuTableData([...mskuTableData]);
  };

  // 删除sku
  const delMsku = function(sellerSku: string) {
    for (let i = 0; i < sellerSku.length; i++) {
      const item = mskuTableData[i];
      if (item.sellerSku === sellerSku) {
        mskuTableData.splice(i, 1);
        break;
      }
    }

    setMskuTableData([...mskuTableData]);
  };

  // 删除库位号
  const delBedNumber = function(locationId: string) {
    const index = locations.findIndex(item => item.locationId === locationId);
    locations.splice(index, 1);
    setLocations([...locations]);
  };

  // 添加库位号
  const addbedNumber = function() {
    const datas = form.getFieldsValue();
    const locationNos = datas.locationNo; // 库位号
    // 从全部数据中找到要添加的数据
    const filterTargets = locationNum.filter(item => {
      return locationNos.includes(item.locationNo);
    });
    // 阻止重复添加
    const repetition = locations.find(item => {
      return filterTargets.find(t => {
        if (t.locationId === item.locationId) {
          return true;
        }
      });
    });
    if (repetition) {
      message.error('请勿重复添加');
      return;
    }
    setLocations([...locations, ...filterTargets]);
  };
  //添加供应商
  const addSupplier = function() {
    const datas = form.getFieldsValue();
    const { supplierprice, placeUrl, currencyType, supplierId } = datas;
    const emptys = [undefined, null, '', []];

    //先出判断
    if (!supplierprice || !placeUrl) {
      message.error('请填写采购单价或下单链接');
      return;
    }
    //供应商
    if (emptys.includes(supplierId)) {
      message.error('请选择供应商');
      return;
    }
    //大小值
    if (supplierprice < 0 || supplierprice > 100000000) {
      message.error('最大输入值不超过10000 0000.00');
      return;
    }
    //长度判断
    if (placeUrl.length > 256) {
      message.error('下单链接最大长度不超过256位字符');
      return;
    }


    //给供应商名称找出来
    supplierId.forEach((item: string) => {
      const idindex = supplierDownList.findIndex( childItem => childItem.id === item);

      //去重
      const repetition = supplierTableData.find( repetion => repetion.supplierId === item);
      if (repetition) {
        message.warning(`供应商：${repetition.supplierName} 已添加，不可重复添加`);
        return;
      }

      supplierTableData.push({
        supplierId: item,
        supplierName: supplierDownList[idindex].name,
        currencyType: currencyType,
        price: supplierprice,
        placeUrl: placeUrl,
      });
    });
    setSupplierTableData([...supplierTableData]);
  };
  //搜索供应商
  const suppliersearch = (value: string) => {
    const newList = supplierList.filter(
      supplier => supplier.name.toLowerCase().includes(value.toLowerCase())
    );
    setsupplierDownList([...newList]);
  };

  //供应商表格下单链接编辑
  const handleUpdatePlaceUrl = function(record: {supplierId: string; val: string}) {
    new Promise((resolve, reject) => {
      //找到对应的下标
      supplierTableData.forEach( () => {
        const supplierTableIndex = 
          supplierTableData.findIndex(childItem => childItem.supplierId === record.supplierId);
        supplierTableData[supplierTableIndex].placeUrl = record.val;
        setSupplierTableData([...supplierTableData]);
      });
      resolve;
      reject;
    });    
    return Promise.resolve(true);  
  };
  //供应商表格采购单价编辑
  const handleUpdatePrice = function(record: {supplierId: string; val: number}) {
    new Promise((resolve, reject) => {
      //找到对应的下标
      supplierTableData.forEach( () => {
        const supplierTableIndex = 
          supplierTableData.findIndex(childItem => childItem.supplierId === record.supplierId);
        supplierTableData[supplierTableIndex].price = record.val;
        setSupplierTableData([...supplierTableData]);
      });
      resolve;
      reject;
    });    
    return Promise.resolve(true);  
  };
  //删除供应商
  const deletesupplier = (supplierId: string) => {
    for (let i = 0; i < supplierTableData.length; i++) {
      const item = supplierTableData[i];
      if (item.supplierId === supplierId) {
        supplierTableData.splice(i, 1);
        break;
      }
    }
    setSupplierTableData([...supplierTableData]);
  };

  //供应商币种编辑
  const currencyTypeChange = (supplierId: string, value: string) => {
    
    const supplierTableIndex = 
      supplierTableData.findIndex(childItem => childItem.supplierId === supplierId);
    supplierTableData[supplierTableIndex].currencyType = value;
    setSupplierTableData([...supplierTableData]);
    
  };
   
  const supplierChange = (supplierId: string, value: string) => {
    //表格内容修改先去重
    /** 
    const repeatIndex = supplierTableData.find( repetion => repetion.supplierId === value);
    if (repeatIndex) {
      message.warning(`供应商：${repeatIndex.supplierName} 已添加，不可重复添加`);
      return;
    }
    */

    const supplierTableIndex = 
      supplierTableData.findIndex(childItem => childItem.supplierId === supplierId);
    supplierTableData[supplierTableIndex].supplierId = value;
    //nsme=原id对应的name
    const supplierListIndex = 
    supplierList.findIndex(childItem => childItem.id === value);
      
    supplierTableData[supplierTableIndex].supplierName = supplierDownList[supplierListIndex].name;
    setSupplierTableData([...supplierTableData]);
  };
  
  const mskuColumns = [
    {
      title: '站点',
      align: 'center',
      dataIndex: 'marketplace',
      key: 'marketplace',
    },
    {
      title: '店铺名称',
      align: 'center',
      dataIndex: 'storeName',
      key: 'storeName',
    },
    {
      title: 'MSKU',
      align: 'center',
      dataIndex: 'sellerSku',
      key: 'sellerSku',
    },
    {
      title: '操作',
      key: 'handle',
      dataIndex: 'sellerSku',
      align: 'center',
      width: 100,
      render(val: string) {
        return <span className={styles.handleCol} onClick={() => delMsku(val)}>删除</span>;
      },
    },
  ];

  //供应商表格列
  const supplierColumns = [{
    title: '供应商',
    align: 'left',
    dataIndex: 'supplierName',
    key: 'supplierName',
    width: 240, 
    render(value: string, record: skuData.ISupplierDownList) {
      return (
        <Select
          bordered={false} 
          style={{ width: 225 }}
          defaultValue={value} 
          onChange={(val) => supplierChange(record.supplierId, val)}>         
          {
            supplierList.map((item, index) => {
              return (
                <Option 
                  value={item.id} 
                  key={index} 
                  disabled={record.supplierId === item.id ? true : false}>
                  {item.name}
                </Option>
              );
            })
          }
        </Select>
      );     
    },      
  }, {
    title: '采购单价',
    align: 'right',
    dataIndex: 'price',
    key: 'price',
    width: 133,
    render(value: number, record: skuData.ISupplierDownList) {
      return (
        editable({
          inputValue: String(value),
          maxLength: 20,
          confirmCallback: val => {
            handleUpdatePrice({ supplierId: record.supplierId, val: Number(val) });
          },
        })               
      );
    },
  }, {
    title: '下单链接',
    align: 'left',
    dataIndex: 'placeUrl',
    key: 'placeUrl',
    width: 292,
    render(value: string, record: skuData.ISupplierDownList) {
      return (
        editable({
          inputValue: value,
          maxLength: 256,
          confirmCallback: val => {
            handleUpdatePlaceUrl({ supplierId: record.supplierId, val: val });
          },
        })
      );
    },
  }, {
    title: '币种',
    align: 'center',
    dataIndex: 'currencyType',
    key: 'currencyType',
    width: 119,
    render(value: string, record: skuData.ISupplierDownList) {
      return (
        <Select 
          style={{ width: 90 }} 
          defaultValue={value} 
          onChange={(val) => currencyTypeChange(record.supplierId, val)}>
          <Option value="人民币">人民币</Option>
          <Option value="美元">美元</Option>
          <Option value="英镑">英镑</Option>
          <Option value="加元">加元</Option>
          <Option value="欧元">欧元</Option>
          <Option value="日元">日元</Option>
        </Select>);
    },
  }, {
    title: '操作',
    align: 'center',
    width: 56,
    render(_: any, record: skuData.ISupplierDownList) { // eslint-disable-line
      return <span 
        onClick={() => deletesupplier(record.supplierId)} 
        className={styles.handleCol}>删除</span>;
    },
  }];

  // 库位号
  const columns = [
    {
      title: '仓库',
      align: 'center',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
    },
    {
      title: '库位号',
      align: 'center',
      dataIndex: 'locationNo',
      key: 'locationNo',
    },
    {
      title: '操作',
      key: 'locationId',
      dataIndex: 'locationId',
      align: 'center',
      width: 100,
      render(val: string) {
        return <span className={styles.handleCol} onClick={() => delBedNumber(val)}>删除</span>;
      },
    },
  ];

  // msku
  const mskuTableConfig = {
    pagination: false as false,
    dataSource: mskuTableData as [],
    columns: mskuColumns as [],
    className: styles.table,
    scroll: {
      y: 226,
    },
    rowKey: (record: { sellerSku: string}) => record.sellerSku,
    locale: {
      emptyText: <TableNotData hint="选择要添加的MSKU" style={{ padding: 20 }}/>,
    },
  };

  // 库位号
  const tableConfig = {
    pagination: false as false,
    dataSource: locations as [],
    columns: columns as [],
    className: styles.table,
    scroll: {
      y: 226,
    },
    rowKey: (record: { locationId: string}) => record.locationId,
    locale: {
      emptyText: <TableNotData hint="未添加库位号" style={{ padding: 20 }}/>,
    },
  };

  //确认提交
  const submitConfirm = () => {
    let datas = form.getFieldsValue();
    datas = Object.assign({}, initData, datas);
    datas.id = initData.id;
    datas.mskuProducts = mskuTableData;
    datas.locations = locations;
    datas.imageUrl = imageUrl;
    datas.pimageUrl = packImage;
    

    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'skuData/updateSku',
        resolve,
        reject,
        payload: datas,
      });
    });

    promise.then(res => {
      const {
        code,
        message: msg,
      } = res as Global.IBaseResponse;

      if (code === 200) {
        message.success(msg || '修改成功！');
        datas.mskus = datas.mskuProducts || [];
        datas.locationNos = datas.locations || [];
        updateSku(datas);
        onCancel();
        return;
      }
      message.error(msg || '修改失败！');
    });
  };

  //供应商表格配置
  const supplierTableConfig = {
    pagination: false as false,
    dataSource: supplierTableData as [],
    columns: supplierColumns as [],
    className: styles.table,
    scroll: {
      y: 226,
    },
    rowKey: (record: { supplierId: string}) => record.supplierId,
    locale: {
      emptyText: <TableNotData hint="选择要添加的供应商" style={{ padding: 20 }}/>,
    },
  };

  // Modal 配置
  const modalConfig = {
    visible,
    okText: '保存',
    title: '编辑SKU',
    width: 1280,
    wrapClassName: styles.box,
    onCancel,
    onOk() {
      let datas = form.getFieldsValue();
      datas = Object.assign({}, initData, datas);
      const empyts = [null, undefined, ''];
      datas.id = initData.id;
      datas.mskuProducts = mskuTableData;
      datas.locations = locations;
      datas.imageUrl = imageUrl;
      datas.pimageUrl = packImage;
      datas.suppliers = supplierTableData;

      // 体积、重量是否大于1000
      /**
      if (
        (datas.packingLong && Number(datas.packingLong) > 1000)
        || datas.packingWide && Number(datas.packingWide) > 1000
        || datas.packingHigh && Number(datas.packingHigh) > 1000
        || datas.packingWeight && Number(datas.packingWeight) > 1000
        || datas.commodityLong && Number(datas.commodityLong) > 1000
        || datas.commodityWide && Number(datas.commodityWide) > 1000
        || datas.commodityHigh && Number(datas.commodityHigh) > 1000
        || datas.commodityWeight && Number(datas.commodityWeight) > 1000
      ) {
        message.error('体积长宽高或重量值不能大于1000');
        return;
      }
      */

      // 包装重量重量是否大于68038
      const weightresult = sumWeightOversize(datas.packingWeightType, datas.packingWeight);
      setPackWeightisOversize(weightresult);

      // 包装体积：创建时填写，长宽高，最大值是1000，都必填
      if (
        !datas.packingLong
        || !datas.packingWide
        || !datas.packingHigh
      ) {
        message.error('包装体积长宽高不能为空');
        return;
      }
      
      // 包装材质
      if (datas.packingMaterial === 'other') {
        if (empyts.includes(datas.otherPacking)) {
          message.error('包装材质不能为空');
          return;
        }
        datas.packingMaterial = datas.otherPacking;
      }

      //包装体积是否oversize
      const volumnResult = sumVolumeOversize(datas.packingType, {
        width: datas.packingLong || 0,
        wide: datas.packingWide || 0,
        height: datas.packingHigh || 0,
      });
      setProductvolumeisOversize(volumnResult);
   
      if (weightresult || volumnResult) {
        setIsOversize(true);
        return;
      }

      // 错误禁止提交
      const fieldError = form.getFieldsError().find(err => {
        return err.errors.length && err;
      });
      if (fieldError) {
        message.error(fieldError.errors[0]);
        return;
      }

      submitConfirm();
    },
  };

  // 图片上传  index首页  package包装图
  const getUploadConfig = function(type: 'index'|'package') {
    return { 
      accept: 'image/png, image/jpeg', // 支持上传的类型
      showUploadList: false, // 是否显示上传列表,
      method: 'POST' as 'POST',
      action: '/api/mws/shipment/sku/product/create/imageUpload', // 地址
      withCredentials: true,
      maxCount: 1,
      name: 'pic',
      beforeUpload(file: File) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('只允许上传jpg, png格式图片');
        }
        if (file.size > 2097152) {
          message.error('文件大小不能超过2M');
          return false;
        }
        return isJpgOrPng;
      },
      onChange(res: any) { // eslint-disable-line
        const { file: {
          status,
          response,
        } } = res;
        if (status === 'done') {
          const { code, message: msg, data: { error = [] } = {} } = response as {
            code: number;
            message: string;
            data: {
              error: string[];
            };
          };

          if (code === 200) {
            type === 'index' && setImageUrl(msg);
            type === 'package' && setPackImage(msg);
            return;
          }


          Modal.error({
            title: msg,
            width: 500,
            icon: <></>,
            content: <div>
              {error.map((item: string, i: number) => <p key={i}>{item}</p>)}
            </div>,
          });
        }
      },
    };
  };

  // form change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormVlaueChange = (changeVal: any, all: any) => {
    const keys = Object.keys(changeVal);
    // 如果修改了 站点或店铺
    if (keys.includes('marketplace') || keys.includes('storeName')) {
      // 店铺为空时，清空 msku
      if (!all.marketplace || !changeVal.storeName) {
        setSkuListData([]);
        setStoreSku([]);
      } else {
        getStoreMsku(all.storeName);
      }
      // 清除下拉框中已选的 msku
      form.setFieldsValue({ mskuList: undefined });
    }
  };

  //限制采购单价
  const priceLimit = function(_: any, value: string) {// eslint-disable-line
    if (Number(value) < 0 || Number(value) > 100000000) {
      return Promise.reject('最大输入值不超过10000 0000.00');
    }
    return Promise.resolve();
  };

  const priceStrLimit = (value: string) => {
    return strToMoneyStr(value); 
  };

  return <div>
    <span 
      onClick={() => setVisible(!visible)} 
      className={classnames(styles.showText, visible && styles.active)}>编辑</span>
    <Modal {...modalConfig}>
      <div className={styles.content}>
        <header className={styles.title}>基本信息</header>
        <Form 
          form={form} 
          colon={false} 
          labelAlign="left"
          layout="inline"
          className={styles.form}
          name="editSku"
          autoComplete="off"
          initialValues={{
            state: states[0].value,
            packingType: packSizeUnit[0].value,
            packingWeightType: packWeightUnit[0].value,
            commodityType: packSizeUnit[0].value,
            commodityWeightType: packWeightUnit[0].value,
            packingMaterial: packTextureUnit[0].value,
            isFragile: false,
            currencyType: '人民币',
          }}
          onValuesChange={handleFormVlaueChange}
        >
          <div className={styles.base}>
            <div className={styles.leftLayout}>
              <Item name="sku" label="SKU：" rules={[{
                required: true,
                message: 'SKU不能为空',
              }, {
                max: 40,
                message: 'SKU长度不能超过40个字符',
              }]}>
                <Input />
              </Item>
              <Item name="nameUs" label="英文品名：" rules={[{
                required: true,
                message: '英文品名不能为空',
              }, {
                max: 200,
                message: '英文品名长度不能超过200个字符',
              }]}>
                <Input />
              </Item>
              <Item name="customsCode" label="海外编码：" rules={[{
                pattern: /^\d{10}$/,
                message: '海外编码为10位纯数字',
              }]}>
                <Input />
              </Item>
              <Item className={styles.state} name="state" label="状态：">
                <Radio.Group options={states}></Radio.Group>
              </Item>
            </div>
            <div className={styles.centerLayout}>
              <Item name="nameNa" label="中文品名：" rules={[{
                required: true,
                message: '中文品名不能为空',
              }, {
                max: 80,
                message: '中文品名长度不能超过80个字符',
              }]}>
                <Input />
              </Item>
              <Item name="category" label="品类：" rules={[{
                required: true,
                message: '品类不能为空',
              }, {
                max: 40,
                message: '品类长度不能超过40个字符',
              }]}>
                <Input />
              </Item>
              <Item name="salesman" label="开发业务员：" rules={[{
                max: 200,
                message: '开发业务员长度不能超过200个字符',
              }]}>
                <Input />
              </Item>
            </div>
            <div className={styles.rightLayout}>
              <div className={styles.item}>
                <span className={styles.text}>首页</span>
                <Upload listType="picture-card" {...getUploadConfig('index')}>
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%' }} /> : uploadButton}
                </Upload>
              </div>
              <div className={styles.item}>
                <span className={styles.text}>包装图</span>
                <Upload listType="picture-card" {...getUploadConfig('package')}>
                  {packImage ? <img src={packImage} alt="avatar" style={{ width: '100%', height: '100%' }} /> : uploadButton}
                </Upload>
              </div>
            </div>
          </div>
          <nav className={styles.nav}>
            <Tabs activeKey={nav} onChange={key => setNav(key)}>
              <TabPane tab="包装信息" key="1">
                <PackInfo/>
              </TabPane>
              <TabPane tab="MSKU" key="2">
                <div className={styles.mskuBox}>
                  <header className={styles.topHead}>
                    <Form.Item name="marketplace" className={styles.site}>
                      <Select allowClear placeholder="选择站点" listItemHeight={10} listHeight={250} onChange={store => changeStore(store as string)}>
                        { shopDownlist.map((item, index) => {
                          return <Select.Option key={index} value={item.value}>
                            {item.label}
                          </Select.Option>;
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item name="storeName" className={styles.shop}>
                      <Select allowClear placeholder="选择店铺">
                        { shops.map((item, index) => {
                          return <Select.Option key={index} value={item.value}>
                            {item.label}
                          </Select.Option>;
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item className={styles.search} name="mskuList">
                      <Select
                        style={{ width: 320, margin: '0 20px 0 40px' }}
                        mode="multiple"
                        onSearch={search}
                        maxTagCount={2}
                        placeholder="搜索MSKU"
                        // notFoundContent={fetching ? <Spin size="small" /> : null}
                        listItemHeight={10} 
                        listHeight={250}
                      >
                        {
                          skuListData.map((item, index) => {
                            return <Select.Option 
                              key={index} 
                              value={item.sellerSku}>
                              {item.sellerSku}
                            </Select.Option>;
                          })
                        }
                      </Select>
                    </Form.Item>
                    <Button type="primary" onClick={addMsku}>添加</Button>
                  </header>
                  <Table {...mskuTableConfig}/>
                </div>
              </TabPane>
              <TabPane tab="库位号" key="3">
                <div className={styles.bedNumberBox}>
                  <header className={styles.form}>
                    <Form.Item name="warehouseName" className={styles.warehouses}>
                      <Select 
                        placeholder="选择仓库"
                        onChange={(locationId: number) => {
                          requestLocationNum(locationId);
                          form.setFieldsValue({ locationNo: [] });
                        }}
                      >
                        { warehouses.map((item, index) => {
                          return <Select.Option key={index} value={item.id}>
                            {item.name}
                          </Select.Option>;
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item className={styles.locationSearch} name="locationNo">
                      <Select 
                        placeholder="库位号" 
                        allowClear 
                        showSearch
                        onSearch={(code: string) => searchLocation(code)}
                        mode="multiple"
                        maxTagCount={1}
                      >
                        {locationNum.map(item => {
                          return <Select.Option key={item.locationNo} value={item.locationNo}>
                            {item.locationNo}
                          </Select.Option>;
                        })}
                      </Select>
                    </Form.Item>
                    <Button type="primary" onClick={addbedNumber}>添加</Button>
                  </header>
                  <Table {...tableConfig}/>
                </div>
              </TabPane>
              <TabPane tab="成本价格" key="4">
                <CostPrice />
              </TabPane>
              <TabPane tab="供应商" key="5">
                <div className={styles.mskuBox}>
                  <header className={styles.topHead}>
                    <Item className={styles.search} name="supplierId" rules={[{
                      required: true,
                      message: '请选择供应商',
                    }]}>     
                      <Select
                        optionFilterProp="children"
                        style={{ width: 180, marginRight: 18 }}
                        mode="multiple"
                        placeholder="供应商"                     
                        onSearch={suppliersearch}
                        maxTagCount={1}>
                        {
                          supplierDownList.map((item, index) => {
                            return (
                              <Select.Option 
                                key={index} 
                                value={item.id}>
                                {item.name}
                              </Select.Option>);
                          })
                        }
                      </Select>
                    </Item>
                    <Item name="currencyType" className={styles.search} rules={[{
                      required: true,
                      message: '请选择币种',
                    }]}>
                      <Select style={{ width: 90 }}>         
                        <Option value="人民币">人民币</Option>
                        <Option value="美元">美元</Option>
                        <Option value="英镑">英镑</Option>
                        <Option value="加元">加元</Option>
                        <Option value="欧元">欧元</Option>
                        <Option value="日元">日元</Option>
                      </Select>
                    </Item>
                    <Item name="supplierprice" normalize={priceStrLimit} rules={[{
                      required: true,
                      message: '请填写采购单价',
                    }, {
                      validator: priceLimit,
                    }]} >
                      <Input style={{ width: 180 }} placeholder="采购单价"></Input>
                    </Item>
                    <Item name="placeUrl" rules={[{
                      required: true,
                      message: '请填写下单链接',
                    }, {
                      max: 256,
                      message: '下单链接不能超过256个字符',
                    }]}>
                      <Input style={{ width: 280, margin: '0 18px' }} placeholder="下单链接"></Input>
                    </Item>
                    <Button type="primary" onClick={addSupplier}>添加</Button>     
                  </header>
                  <Table {...supplierTableConfig}></Table> 
                </div>;               
              </TabPane>
            </Tabs>
          </nav>
        </Form>
      </div>
    </Modal>
    <Modal
      visible={isOversize}
      centered
      onCancel={() => setIsOversize(false)}
      onOk={() => {
        submitConfirm();
        setIsOversize(false);
      }}
      width={580}
    >
      {
        productvolumeisOversize ? <p>最长边超过274cm或(长度+围度)*2超过419cm</p> : ''        
      }
      {
        packWeightisOversize ? <p>包装重量超过68038g</p> : ''
      }
      <p>请确认该商品是否属于特殊大件？</p>      
    </Modal>
  </div>;
};


export default AddSku;
