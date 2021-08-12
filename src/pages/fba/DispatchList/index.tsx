/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-04 09:59:29
 * @LastEditTime: 2021-05-11 10:09:47
 * 
 * 发货单列表
 *
 */
import React, { useEffect, useState, useCallback, useRef, PureComponent } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Iconfont, requestErrorFeedback } from '@/utils/utils';
import { useSelector, 
  useDispatch, 
  ConnectProps, 
  IWarehouseLocationState, 
  IFbaDispatchListState, 
  IFbaBaseState,
} from 'umi';
import {
  Table,
  Select,
  Input,
  Form,
  Button,
  Popconfirm,
  message,
} from 'antd';
import AddPlan from './AddPlan';
import { TableRowSelection } from 'antd/lib/table/interface';
import ConfireDownList from '@/pages/fba/components/ConfireDownList';
import Details from './Details';
import AsyncEditBox from '../components/AsyncEditBox';
import TableNotData from '@/components/TableNotData';
import moment from 'moment';
import Line from '@/components/Line';
import { ColumnProps } from 'antd/es/table';
import { useReactToPrint } from 'react-to-print';

interface IDetailModalType {
  visible: boolean;
  data: DispatchList.IDispatchDetail;
}

interface IPage extends ConnectProps {
  warehouseLocation: IWarehouseLocationState;
  fbaDispatchList: IFbaDispatchListState;
  // configurationBase: IConfigurationBaseState;
  // logistics: ILogisticsState;
  fbaBase: IFbaBaseState;
}
interface IPrintType{
  printprops: DispatchList.IDispatchDetail;
  shipmentName: string;
}

const pageStyle = `
  @media print {
    section {page-break-before: always;}
    h1 {page-break-after: always;}
    .aaa {page-break-inside: avoid; color: red;}
  }
`;
const rowCount = 24; // 每页的行数
class IndexToPrint extends PureComponent<IPrintType>{
  constructor(props: IPrintType) {
    super(props);
  }

  render(){
    const { 
      printprops: { 
        gmtCreate, 
        shippingType, 
        userName, 
        mwsShipmentId, 
        invoiceId, 
        casesRequired, 
        productItemVos, 
      },
      shipmentName,
    } = this.props;
    return (
      <div className={styles.printtable}>
        <table>
          <thead>
            <tr>
              <td>创建日期</td>
              <td colSpan={5}>{gmtCreate && moment(gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
            <tr>
              <td>创建人</td>
              <td colSpan={5}>{userName}</td>
            </tr>
            <tr>
              <td>Shipment名称</td>
              <td colSpan={5}>{shipmentName}</td>
            </tr>
            <tr>
              <td>ShipmentID</td>
              <td colSpan={5}>{mwsShipmentId}</td>
            </tr>
            <tr>
              <td>发货单号</td>
              <td colSpan={5}>{invoiceId}</td>
            </tr>
            <tr>
              <td>拣货员</td>
              <td colSpan={5}>拣货员</td>
            </tr>
            <tr>
              <td>物流方式</td>
              <td colSpan={5}>{shippingType}</td>
            </tr>
            <tr>
              <th>MSKU</th>
              <th>发货量</th>
              <th>FNSKU</th>
              <th>SKU</th>
              <th>中文名称</th>
              <th>包装方式</th>
            </tr>
          </thead>
          <tbody>
            {
              (productItemVos || []).map((item, index) => {
                let count = 0;
                const currnetIndex = index + 1;
                if ( 
                  (currnetIndex > 2 && currnetIndex % rowCount === 0) 
               || currnetIndex === productItemVos.length
                ) {
                  count++;
                  return <>
                    <tr>
                      <td width={270} >{item.sellerSku}</td>
                      <td width={120}>{item.issuedNum}</td>
                      <td width={120}>{item.fnsku}</td>
                      <td width={120}>{item.sku}</td>
                      <td width={320}>-</td>
                      <td width={100}>{casesRequired}</td>
                    </tr>
                    <tr>
                      <td 
                        colSpan={7} 
                        style={{ backgroundColor: 'white', textAlign: 'right' }}
                      >
                       第{count}页 共{Math.ceil(productItemVos.length / rowCount)}页
                      </td>
                    </tr>
                  </>;
                }
                return <tr key={index}>
                  <td width={270}>{item.sellerSku}</td>
                  <td width={120}>{item.issuedNum}</td>
                  <td width={120}>{item.fnsku}</td>
                  <td width={120}>{item.sku}</td>
                  <td width={320}> -</td>
                  <td width={100}>{casesRequired}</td>
                </tr>;
              })
            }
          </tbody>
        </table>
      </div>);
  }   
}

const { Option } = Select;
const { Item } = Form;
const symbols = {
  DISTRIBUTION: 'DISTRIBUTION', // 标记配货
  DELIVERY: 'DELIVERY', // 标记发货
  DELETED: 'DELETED', // 作废
};


let rowSelection: number[] = []; // 选中的行
const PackageList: React.FC = function() {
  const [form] = Form.useForm();
  const componentRef = useRef<any>();//eslint-disable-line

  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const shops = useSelector((state: IPage) => state.fbaBase.shops); // 店铺列表
  const warehouses = useSelector((state: IPage) => state.warehouseLocation.warehouses); // 仓库列表
  const dispatchList = useSelector((state: IPage) => state.fbaDispatchList.dispatchList); // 发货单列表
  const logistics = useSelector((state: IPage) => state.fbaBase.logistics); // 仓库列表

  const [current, setCurrent] = useState<number>(1);
  const [addVisible, setAddVisible] = useState<boolean>(false); // 添加货件
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [sites, setSites] = useState<string[]>([]);

  //传递给打印的值
  const 
    [printprops, setPrintprops] = 
      useState<DispatchList.IDispatchDetail>({} as DispatchList.IDispatchDetail);
  const [shipmentName, setShipmentName] = useState<string>('');
  // 打开发货单详情的初始值
  const [detailModal, setDateilModal] = useState<IDetailModalType>({
    visible: false,
    data: {} as DispatchList.IDispatchDetail,
  });

  const {
    marketplace,
    id: StoreId,
  } = currentShop;
  const dispatch = useDispatch();

  // 供筛选的店铺
  const shopFilter = shops.filter(shop => {
    const selectedMarketplace = form.getFieldValue('countryCode');
    if (selectedMarketplace) {
      return shop.marketplace === selectedMarketplace;
    }
    return true;
  });

  // 请求列表数据
  const request = useCallback((params = { currentPage: 1, pageSize: 20 }) => {
    if (StoreId === '-1') {
      return;
    }

    const data = form.getFieldsValue();
    data.isPrint !== undefined ? data.isPrint = Boolean(data.isPrint) : '';

    setLoading(true);
    let payload = {
      ...data,
    };
    payload = Object.assign({}, payload, params);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'fbaDispatchList/getDispatchList',
        reject,
        resolve,
        payload,
      });
    }).then(datas => {
      const {
        code,
        message: msg,
        data: { 
          page: {
            current = 1,
            size = 20,
            total = 0,
          } = {},
        } = {},
      } = datas as {
        code: number;
        message?: string;
        data: {
          page: {
            current: number;
            size: number;
            total: number;
          };
        };
      };

      setLoading(false);
      if (code === 200) {
        setCurrent(Number(current));
        setPageSize(Number(size));
        setTotal(total);
        return;
      }
      message.error(msg || '发货单列表接口异常！');
    });
  }, [dispatch, StoreId, form]);

  //  请求站点
  const requestSite = useCallback(() => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'fbaDispatchList/getSites',
        resolve,
        reject,
      });
    }).then(datas => {
      const {
        code,
        message: msg,
        data,
      } = datas as {
        code: number;
        message?: string;
        data: string[];
      };
      if (code === 200) {
        setSites([...data]);
        return;
      }
      message.error(msg);
    });
  }, [dispatch]);

  // 请求店铺
  const requestShop = useCallback((marketplace?: string ) => {
    dispatch({
      type: 'configurationBase/getShop',
      payload: { marketplace: marketplace || null },
    });
  }, [dispatch]);

  // 请求仓库地址
  const requestWarehourse = useCallback(() => {
    dispatch({
      type: 'warehouseLocation/getWarehouseList',
      payload: {
        state: true,
      },
    });
  }, [dispatch]);

  const getLogistics = useCallback(() => {
    logistics.length === 0 && new Promise((resolve, reject) => {
      dispatch({
        type: 'fbaBase/getLogistics',
        reject,
        resolve,
        callback: requestErrorFeedback,
        payload: {
          state: true,
        },
      });
    });
  }, [dispatch, logistics]);


  // 请求
  useEffect(() => {
    request();
    requestWarehourse();
    requestShop();
    requestSite();
    getLogistics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // }, [request, requestWarehourse, requestShop, requestSite, getLogistics]);

  // 修改信息
  const handleUpdateDispatch = function(params: {
    id: string;
    [key: string]: string;
  }) {
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'fbaDispatchList/updateDispatch',
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
          ...params,
        },
        resolve,
        reject,
      });
    });
    return promise.then(res => {
      const { code, message: msg } = res as Global.IBaseResponse;
      if (code === 200) {
        message.success(msg || '操作成功！');
        // 更新 state 数据
        dispatch({
          type: 'fbaDispatchList/saveDispatchList',
          payload: dispatchList.map(item => {
            if (params.id === item.id) {
              return {
                ...item,
                ...params,
              };
            }
            return item;
          }),
        });
        // 如果详情弹窗是打开的，修改弹窗数据
        if (detailModal.visible && detailModal.data.id === params.id) {
          setDateilModal({
            ...detailModal,
            data: {
              ...detailModal.data,
              ...params,
            },
          });
        }
        return Promise.resolve(true);
      }
      message.error(msg || '操作失败！');
      return Promise.resolve(false);
    });
  };

  // 批量修改状态
  const handleBatchDispatch = function(stateType: string, ids?: string[]) {
    const idArray = ids || rowSelection;
    if (idArray.length === 0) {
      message.warning('请先勾选发货单！');
      return;
    }

    const payload = {
      ids: idArray,
      stateType,
    };

    // 业务删除
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'fbaDispatchList/updateDispatchState',
        resolve,
        reject,
        payload,
      });
    });

    promise.then(datas => {
      const {
        code,
        message: msg,
      } = datas as Global.IBaseResponse;

      if (code === 200) {
        message.success(msg);
        const temp = JSON.stringify(dispatchList);
        const newDispatchList: DispatchList.IListRecord[] = JSON.parse(temp);
        idArray.map(item => {
          const data = newDispatchList.find(dItem => item === dItem.id);
          switch (stateType) {
          case symbols.DISTRIBUTION : 
            data && (data.state = '已配货');
            break;
          case symbols.DELIVERY : 
            data && (data.state = '已发货');
            break;
          case symbols.DELETED : 
            data && (data.state = '已作废');
            break;
          default :
            // ee
          }
        });
        dispatch({
          type: 'fbaDispatchList/saveDispatchList',
          payload: newDispatchList,
        });
        return;
      }
      message.error(msg);
    });
  };

  //获取对应id的详情数据
  const confirmprint = (id: string) => {

    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'fbaDispatchList/getInvoiceDetail',
        resolve,
        reject,
        payload: {
          id: id,
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
        setPrintprops({ ...data });  
        return;
      }  
      message.error(msg || '获取初始化数据失败！请重试');
    });

    //获取shipment名称
    const shipmentname = new Promise((resolve, reject) => {
      dispatch({
        type: 'shipment/getShipmentDetails',
        resolve,
        reject,
        payload: { id },
      });
    });

    shipmentname.then(datas => {
      const {
        code,
        message: msg,
        data,
      } = datas as {
        code: number;
        message?: string;
        data: Shipment.IShipmentDetails;
      };

      setLoading(false);
      if (code === 200) {
        setShipmentName(data.shipmentName);
        return;
      }
      message.error(msg || '获取shipemet详情失败，请重试！');
    });
  };

  const indexprint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: pageStyle,
  });
  
  const columns: ColumnProps<DispatchList.IDispatchDetail>[] = [
    {
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      title: '状态',
      width: 80,
      fixed: 'left',
      render: val => val === '已配货' ? '已配货(待发货)' : val,
    },
    {
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      align: 'center',
      title: '发货单号',
      width: 100,
      fixed: 'left',
    },
    {
      dataIndex: 'warehouse',
      key: 'warehouse',
      align: 'center',
      title: '发货仓库',
      width: 150,
      fixed: 'left',
    },
    {
      dataIndex: 'warehouseDe',
      key: 'warehouseDe',
      align: 'center',
      title: '目的仓库',
      width: 120,
      fixed: 'left',
    },
    {
      dataIndex: 'destinationFulfillmentCenterId',
      key: 'destinationFulfillmentCenterId',
      align: 'center',
      title: '亚马逊仓库代码',
      width: 126,
    },
    {
      dataIndex: 'mwsShipmentId',
      key: 'mwsShipmentId',
      align: 'center',
      title: 'ShipmentID',
      width: 100,
    },
    {
      dataIndex: 'countryCode',
      key: 'countryCode',
      align: 'center',
      title: '站点',
      width: 100,
    },
    {
      dataIndex: 'storeName',
      key: 'storeName',
      align: 'center',
      title: '店铺名称',
      width: 100,
    },
    {
      dataIndex: 'mskuNum',
      key: 'mskuNum',
      align: 'center',
      title: 'MSKU种类',
      width: 100,
    },
    {
      dataIndex: 'declareNum',
      key: 'declareNum',
      align: 'center',
      title: '发货量',
      width: 170,
    },
    {
      dataIndex: 'issuedNum',
      key: 'issuedNum',
      align: 'center',
      title: '已发量',
      width: 170,
    },
    {
      dataIndex: 'receivedNum',
      key: 'receivedNum',
      align: 'center',
      title: '已收量',
      width: 170,
    },
    {
      dataIndex: 'disparityNum',
      key: 'disparityNum',
      align: 'center',
      title: '差异量',
      width: 170,
    },
    {
      dataIndex: 'printingState',
      key: 'printingState',
      align: 'center',
      title: '清单打印',
      width: 170,
    },
    {
      dataIndex: 'shippingType',
      key: 'shippingType',
      align: 'center',
      title: '物流方式',
      width: 100,
      render(val, record) {
        return (
          <ConfireDownList
            onConfirm={val => handleUpdateDispatch({ id: record.id, shippingType: val })}
            val={val}
            dataList={logistics} 
            selectStyle={{ fontSize: 12, minWidth: 80 }}
          />
        );
      },
    },
    {
      dataIndex: 'shippingId',
      key: 'shippingId',
      align: 'center',
      title: '物流单号',
      width: 150,
      render(value, record) {
        return <AsyncEditBox 
          onOk={val => handleUpdateDispatch({ id: record.id, shippingId: val })}
          value={value}
          style={{
            padding: '6px 0 6px 14px',
          }}
          maxLength={50}
        />;
      },
    },
    {
      dataIndex: 'trackingId',
      key: 'trackingId',
      align: 'center',
      title: '物流跟踪号',
      width: 110,
      render(value, record) {
        return <AsyncEditBox 
          onOk={val => handleUpdateDispatch({ id: record.id, trackingId: val })}
          value={value}
          style={{
            padding: '6px 0 6px 14px',
          }}
          maxLength={50}
        />;
      },
    },
    {
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      title: '创建人',
      width: 170,
    },
    {
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      align: 'center',
      title: '创建时间',
      width: 110,
      render: (val) => val === null ? <Line /> : moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      align: 'center',
      title: '更新时间',
      width: 110,
      render: (val) => val === null ? <Line /> : moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'distributionTime',
      key: 'distributionTime',
      align: 'center',
      title: '配货时间',
      width: 110,
      render: (val) => val === null ? <Line /> : moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      align: 'center',
      title: '发货时间',
      width: 110,
      render: (val) => val === null ? <Line /> : moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },

    {
      dataIndex: 'remarkText',
      key: 'remarkText',
      align: 'center',
      title: '备注',
      width: 100,
      render(value, record) {
        return <AsyncEditBox 
          onOk={val => handleUpdateDispatch({ id: record.id, remarkText: val })}
          value={value}
          style={{
            padding: '6px 0 6px 14px',
          }}
          maxLength={40}
          maxLengthHint="备注最多40个字符"
        />;
      },
    },
    {
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      title: '操作',
      fixed: 'right',
      width: 120,
      className: styles.handleCol,
      render(_, record) {
        return <div className={styles.handleCol}>
          <div>
            <span onClick={() => {
              setDateilModal({
                visible: true,
                // dispose: false,
                // verify: true,
                // method: 'FBA',
                data: record,
              });
            }}>详情</span>
            {
              record.state === '待配货' &&
              <Popconfirm 
                title="确定标记为已配货？"
                placement="left"
                overlayClassName={styles.cencalModal}
                onConfirm={() => handleBatchDispatch('DISTRIBUTION', [record.id])}
              >
                <span>标记配货</span>
              </Popconfirm>
            }
            {
              record.state === '已配货' &&
              <Popconfirm 
                title="确定标记为已发货？"
                placement="left"
                overlayClassName={styles.cencalModal}
                onConfirm={() => handleBatchDispatch('DELIVERY', [record.id])}
              >
                <span>标记发货</span>
              </Popconfirm>
            }
          </div>
          <div>
            {
              !['已作废', '已取消'].includes(record.state) &&

              <Popconfirm 
                title="确定打印"
                placement="left"
                overlayClassName={styles.cencalModal}
                onConfirm={indexprint}
                icon={<></>}
              >
                <span onClick={() => {
                  confirmprint(record.id);
                }}>打印</span>
                <div style={{ display: 'none' }}>
                  <IndexToPrint 
                    ref={componentRef} 
                    printprops={printprops} 
                    shipmentName={shipmentName}
                  ></IndexToPrint>
                </div>
              </Popconfirm>
            }
            {
              !['已作废', '已发货'].includes(record.state) &&
              <Popconfirm 
                title="确定将此发货单作废？"
                placement="left"
                overlayClassName={styles.cencalModal}
                icon={<></>}
                onConfirm={() => handleBatchDispatch('DELETED', [record.id])}
              >
                <span>作废</span>
              </Popconfirm>
            }
          </div>
        </div>;
      },
    },
  ];

  const tableConfig = {
    pagination: {
      pageSizeOptions: ['20', '50', '100'],
      total,
      pageSize,
      current: current,
      showQuickJumper: true, // 快速跳转到某一页
      showSizeChanger: true,
      showTotal: (total: number) => `共 ${total} 个`,
      className: classnames('h-page-small', styles.page),
    },
    rowSelection: {
      type: 'checkbox',
      columnWidth: 38,
      onChange (selectedRowKeys: TableRowSelection<string>) {
        rowSelection = selectedRowKeys as number[];
      },
    } as {},
    columns: columns as [],
    dataSource: dispatchList,
    className: styles.table,
    loading,
    rowKey: (record: {id: string}) => record.id,
    scroll: {
      y: 'calc(100vh - 330px)',
      x: 'max-content',
    },
    locale: {
      emptyText: <TableNotData hint="没有找到相关订单，请重新选择查询条件"/>,
    },
    onChange({ current, pageSize }: any, filters: any, sorter: any, { action }: any) { // eslint-disable-line
      const {
        field,
        order,
      } = sorter;
      let myCurrent = 1; // 当前页数
      //只有排序处理
      // eslint-disable-next-line
      const asc  = order === 'ascend' ? false : order === 'descend' ? true : null;
      if (action === 'paginate') {
        myCurrent = current as number;
      } else if (action === 'sort') {
        // 点击字段排序回到第一页
        myCurrent = 1;
      }
      // eslint-disable-next-line
      const objs: any = {
        order: asc === null ? '' : field,
        ascending: asc,
        currentPage: myCurrent,
        pageSize,
      };
      // console.log(field, 'field');
      
      const data = Object.assign({}, objs);
      setLoading(true);
      request(data);
    },
  };

  const search = function(values: string, event: any) { // eslint-disable-line
    // 限制清空按钮
    if (values === '' && Reflect.has(event, 'button') && event.target.className === 'ant-input') {
      return;
    }

    request({ currentPage: 1, pageSize });
  };

  // 顶部筛选框
  const searchCondition = function(values: any) { // eslint-disable-line
    // 如果切换了站点，清空店铺选择
    if (Reflect.has(values, 'countryCode')) {
      form.setFieldsValue({ storeId: undefined });
    }
    if (
      Reflect.has(values, 'match')
      || Reflect.has(values, 'code')
    ) {
      return;
    }
    request({ currentPage: 1, pageSize });
  };

  const selectBefore = (
    <Item name="match" className={styles.searchList}>
      <Select className={styles.list}>
        <Option value="InvoiceId">发货单号</Option>
        <Option value="MwsShipmentId">ShipmentID</Option>
        <Option value="ShippingId">物流单号</Option>
        <Option value="TrackingId">物流跟踪号</Option>
        <Option value="RemarkText">备注</Option>
      </Select>
    </Item>
  );


  return <div className={styles.box}>
    <Form 
      className={styles.topHead} 
      form={form} 
      initialValues={{
        match: 'InvoiceId',
        status: ['待配货', '已配货'],
      }}
      onValuesChange={searchCondition}
    >
      <Item name="code" className={styles.searchFrame}>
        <Input.Search
          allowClear
          addonBefore={selectBefore} 
          enterButton={<Iconfont type="icon-sousuo" />} 
          autoComplete="off"
          className={classnames('h-search', styles.search)}
          onSearch={search}
        />
      </Item>
      <Item name="countryCode" className={styles.site}>
        <Select placeholder="站点" allowClear>
          {sites.map((item, i) => <Option value={item} key={i}>{item}</Option>)}
        </Select>
      </Item>
      <Item name="storeId" className={styles.shopName}>
        <Select
          placeholder="店铺名称"
          optionFilterProp="children"
          allowClear
        >
          {
            shopFilter.map(({ id, storeName, marketplace }) => (
              <Option value={id} key={id}>{`${marketplace}-${storeName}`}</Option>
            ))
          }
        </Select>
      </Item>
      <Item name="status" className={styles.state}>
        <Select placeholder="状态" mode="multiple" maxTagCount={1}>
          <Option value="待配货">待配货</Option>
          <Option value="已配货">已配货</Option>
          <Option value="已发货">已发货</Option>
          <Option value="已取消">已取消</Option>
          <Option value="已作废">已作废</Option>
        </Select>
      </Item>
      <Item name="isPrint" className={styles.handle} >
        <Select placeholder="打印清单" allowClear>
          <Option value={1}>已打印</Option>
          <Option value={0}>未打印</Option>
        </Select>
      </Item>
      <Item name="shippingType" className={styles.handle} >
        <Select allowClear
          placeholder="物流方式">
          {logistics.map((item, i) => {
            return <Option value={item} key={i}>{item}</Option>;
          })}
        </Select>
      </Item>
      <Item name="warehouseId" className={styles.handle} >
        <Select placeholder="发货仓库" allowClear>
          {warehouses.map((item, i) => <Option value={item.id} key={i}>{item.name}</Option>)}
        </Select>
      </Item>
    </Form>
    <div className={styles.navHead}>
      <Button 
        onClick={() => handleBatchDispatch(symbols.DISTRIBUTION)} 
        className={styles.addBtn}>
          标记配货
      </Button>
      <Button 
        onClick={() => handleBatchDispatch(symbols.DELIVERY)} 
        className={styles.addBtn}>
          标记发货
      </Button>
      <Button 
        onClick={() => handleBatchDispatch(symbols.DELETED)} 
        className={styles.addBtn}>
          作废
      </Button>
    </div>
    <main>
      <Table {...tableConfig}/>
    </main>
    <AddPlan 
      visible={addVisible} 
      onCancel={() => setAddVisible(false)}
      marketplace={marketplace}
    />
    <Details 
      logistics={logistics}
      onUpdateDispatch={handleUpdateDispatch}
      onCancel={() => {
        setDateilModal({ ...detailModal, visible: false });
      }} 
      site={marketplace}
      {...detailModal}
    />
  </div>;
};

export default PackageList;
