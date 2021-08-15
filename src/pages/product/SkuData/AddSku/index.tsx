/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-25 11:56:45
 * @LastEditTime: 2021-04-29 15:03:40
 * 
 * 添加MSKU
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Modal, Form, Input, Radio, Upload, Tabs, message, Select, Button, Table, Spin } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { states, packWeightUnit, packSizeUnit, packTextureUnit, shopDownlist } from '../config';
import { useSelector, ConnectProps, IConfigurationBaseState, IWarehouseLocationState, useDispatch } from 'umi';
import PackInfo from './PackInfo';
import CostPrice from './CostPrice';
import TableNotData from '@/components/TableNotData';

interface IProps {
  visible: boolean;
  onCancel: () => void;
}

interface IPage extends ConnectProps {
  configurationBase: IConfigurationBaseState;
  warehouseLocation: IWarehouseLocationState;
}


const { Item } = Form;
const { TabPane } = Tabs;
let lastFetchId = 0;
const AddSku: React.FC<IProps> = props => {
  const { visible, onCancel } = props;

  const shops = useSelector((state: IPage) => state.configurationBase.shops);
  const warehouses = useSelector((state: IPage) => state.warehouseLocation.warehouses);

  const [loading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string|null>(null); // 首页图片
  const [packImage, setPackImage] = useState<string|null>(null); // 包装图片
  const [nav, setNav] = useState<string>('1');
  const [fetching, setFetching] = useState<boolean>(false); // 搜索MSKU时的loading
  const [skuData, setSkuData] = useState<skuData.IMskuList[]>([]);
  // msku列表
  const [data, setData] = useState<skuData.IMskuList[]>([]);
  // 库位号下拉列表
  const [locationNum, setLocatioNum] = useState<skuData.ILocations[]>([]);
  // 库位号列表
  const [locations, setLocations] = useState<skuData.ILocations[]>([]);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // 请求仓库列表
  useEffect(() => {
    dispatch({
      type: 'warehouseLocation/getWarehouseList',
      payload: {
        state: true,
      },
    });
  }, [dispatch]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 4 }}>上传</div>
    </div>
  );

  // 站点改变时,修改下拉列表
  const changeStore = function(val: string) {
    form.setFieldsValue({
      storeName: undefined,
    });

    dispatch({
      type: 'configurationBase/getShop',
      payload: { marketplace: val },
    });
  };

  // 搜索msku
  const search = (value: string) => {
    const fetchId = lastFetchId;
    const { storeName: id } = form.getFieldsValue();

    if (!id) {
      message.error('未选中店铺');
      return;
    }

    setSkuData([...[]]);
    setFetching(true);

    if (fetchId !== lastFetchId) {
      // for fetch callback order
      return;
    }

    new Promise((resolve, reject) => {
      dispatch({
        type: 'skuData/getMskuList',
        resolve,
        reject,
        payload: {
          id,
          code: value,
        },
      });
    }).then(datas => {
      lastFetchId += 1;
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
        setSkuData([...data]);
        setFetching(false);
        return;
      }
      message.error(msg || '请求MSKU列表失败，请重试！');
    });
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

    if (!marketplace) {
      message.error('请选择站点！');
      return;
    }

    if (!storeName) {
      message.error('请选择店铺！');
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
      const mskuIndex = skuData.findIndex(childItem => childItem.sellerSku === item);

      data.push({
        sellerSku: item,
        asin1: '', // 后端用不上这个
        storeId: skuData[mskuIndex].storeId,
        marketplace,
        storeName,
      });
    });
    
    setData([...data]);
  };

  // 删除sku
  const delMsku = function(sellerSku: string) {
    for (let i = 0; i < sellerSku.length; i++) {
      const item = data[i];
      if (item.sellerSku === sellerSku) {
        data.splice(i, 1);
        break;
      }
    }

    setData([...data]);
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
    

    for ( const item of locationNos) {
      // const isExist = locations.find(citem => citem.locationNo === item); // 是否已存在
      const locationNo = locationNum.find(citem => citem.locationNo === item);
      locationNo && locations.push(locationNo);
    }
    
    setLocations([...locations]);
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
    dataSource: data as [],
    columns: mskuColumns as [],
    className: styles.table,
    scroll: {
      y: 226,
    },
    rowKey: (record: { sellerSku: string}) => record.sellerSku,
    locale: {
      emptyText: <TableNotData hint="输入要添加的MSKU" style={{ padding: 20 }}/>,
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

  // Modal 配置
  const modalConfig = {
    visible,
    okText: '保存',
    title: '添加SKU',
    width: 1280,
    wrapClassName: styles.box,
    onCancel,
    onOk() {
      const datas = form.getFieldsValue();
      const empyts = [null, undefined, ''];
      datas.mskuProducts = data;
      datas.locations = locations;
      datas.imageUrl = imageUrl;
      datas.pimageUrl = packImage;

      if (empyts.includes(datas.sku)) {
        message.error('SKU不能为空');
        return;
      }

      if (empyts.includes(datas.nameNa)) {
        message.error('中文品名不能为空');
        return;
      }

      if (empyts.includes(datas.packingWeight)) {
        message.error('包装重量不能为空');
        return;
      }

      // 体积、重量是否大于1000
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

      const promise = new Promise((resolve, reject) => {
        dispatch({
          type: 'skuData/addSku',
          resolve,
          reject,
          payload: datas,
        });
      });

      promise.then(datas => {
        const {
          code,
          message: msg,
        } = datas as Global.IBaseResponse;
        if (code === 200) {
          message.success(msg || '添加成功！');
          onCancel();
          return;
        }
        message.error(msg || '添加失败！');
      });
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
      beforeUpload(file: { type: string}) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('只允许上传jpg, png格式图片');
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

  return <Modal {...modalConfig}>
    <div className={styles.content}>
      <header className={styles.title}>基本信息</header>
      <Form 
        form={form} 
        colon={false} 
        labelAlign="left" 
        layout="inline"
        className={styles.form}
        name="addsku"
        autoComplete="off"
        initialValues={{
          state: states[0].value,
          packingType: packSizeUnit[0].value,
          packingWeightType: packWeightUnit[0].value,
          commodityType: packSizeUnit[0].value,
          commodityWeightType: packWeightUnit[0].value,
          packingMaterial: packTextureUnit[0].value,
          isFragile: false,
        }}
      >
        <div className={styles.base}>
          <div className={styles.leftLayout}>
            <Item name="sku" label="SKU：" rules={[{
              required: true,
            }]}>
              <Input maxLength={40}/>
            </Item>
            <Item name="nameUs" label="英文品名：" rules={[{
              required: true,
            }]}>
              <Input maxLength={200}/>
            </Item>
            <Item name="customsCode" label="海外编码：">
              <Input />
            </Item>
            <Item className={styles.state} name="state" label="状态：">
              <Radio.Group options={states}></Radio.Group>
            </Item>
          </div>
          <div className={styles.centerLayout}>
            <Item name="nameNa" label="中文品名：" rules={[{
              required: true,
            }]}>
              <Input maxLength={80}/>
            </Item>
            <Item name="category" label="品类：" rules={[{
              required: true,
            }]}>
              <Input maxLength={40}/>
            </Item>
            <Item name="salesman" label="开发业务员：">
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
              <PackInfo form={form}/>
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
                      maxTagCount={1}
                      placeholder="输入MSKU"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      listItemHeight={10} 
                      listHeight={250}
                    >
                      {
                        skuData.map((item, index) => {
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
          </Tabs>
        </nav>
      </Form>
    </div>
  </Modal>;
};


export default AddSku;