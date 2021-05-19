/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-04 09:59:29
 * @LastEditTime: 2021-05-11 10:09:47
 * 
 * 发货单列表
 *
 */
import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Iconfont } from '@/utils/utils';
import { useSelector, 
  useDispatch, 
  ConnectProps, 
  IWarehouseLocationState, 
  IFbaDispatchListState, 
  IConfigurationBaseState,
  ILogisticsState,
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
import ConfireDownList from './ConfireDownList';
import Details from './Details';
import AsyncEditBox from '../components/AsyncEditBox';
import { logisticMethods } from '../config';
import TableNotData from '@/components/TableNotData';
import moment from 'moment';
import Line from '@/components/Line';

interface IDetailModalType {
  visible: boolean;
  method: 'FBA'| 'overseas'; // FBA和每外仓库
  dispose: boolean; // 是否已处理
  verify: boolean; // 是否已核实
  pageName?: 'dispose' | 'verify'; // dispose页面是处理页面， verify是核实页面
  data: DispatchList.IDispatchDetail|null;
}

interface IPage extends ConnectProps {
  warehouseLocation: IWarehouseLocationState;
  fbaDispatchList: IFbaDispatchListState;
  configurationBase: IConfigurationBaseState;
  logistics: ILogisticsState;
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

  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const shops = useSelector((state: IPage) => state.configurationBase.shops); // 店铺列表
  const warehouses = useSelector((state: IPage) => state.warehouseLocation.warehouses); // 仓库列表
  const dispatchList = useSelector((state: IPage) => state.fbaDispatchList.dispatchList); // 发货单列表
  const logistics = useSelector((state: IPage) => state.logistics.logistics); // 仓库列表

  const [current, setCurrent] = useState<number>(1);
  const [addVisible, setAddVisible] = useState<boolean>(false); // 添加货件
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [sites, setSites] = useState<string[]>([]);

  // 打开货件详情的初始值
  const [detailModal, setDateilModal] = useState<IDetailModalType>({
    visible: false,
    method: 'FBA',
    dispose: false,
    verify: false,
    pageName: 'verify',
    data: null,
  });

  const {
    marketplace,
    id: StoreId,
  } = currentShop;
  const dispatch = useDispatch();

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
        type: 'logistics/getLogisticsList',
        reject,
        resolve,
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
  }, [request, requestWarehourse, requestShop, requestSite, getLogistics]);

  // 修改物流方式的回调
  const changeLogistics = function() {
    const count = Math.random() * 10;
    return Promise.resolve(count > 5);
  };

  const ruleNameCallback = (value: string) => (
    new Promise((resolve, reject) => {
      dispatch({
        type: 'sfsf/setRulsfseName',
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
          name: value,
        },
        resolve,
        reject,
      });
    }).then(() => {
      return true;
    })
  );
  
  const columns = [
    {
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      title: '状态',
      width: 80,
      fixed: 'left',
    },
    {
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      align: 'state',
      title: '发货单号',
      width: 100,
      fixed: 'left',
    },
    {
      dataIndex: 'warehouse',
      key: 'warehouse',
      align: 'right',
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
      width: 150,
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
      dataIndex: '',
      key: '',
      align: 'center',
      title: '发货量',
      width: 170,
    },
    {
      dataIndex: 'issuedNum',
      key: 'issuedNum',
      align: 'center',
      title: '已收量',
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
      render() {
        return <ConfireDownList onConfirm={changeLogistics} val="1"/>;
      },
    },
    {
      dataIndex: 'shippingId',
      key: 'shippingId',
      align: 'center',
      title: '物流单号',
      width: 150,
      render(value: string) {
        return <AsyncEditBox 
          onOk={(val) => ruleNameCallback(val)} 
          value={value}
          style={{
            padding: '6px 0 6px 14px',
          }}
          errorText="修改失败"
          successText="修改成功"
        />;
      },
    },
    {
      dataIndex: 'trackingId',
      key: 'trackingId',
      align: 'center',
      title: '物流跟踪号',
      width: 110,
      render(value: string) {
        return <AsyncEditBox 
          onOk={(val) => ruleNameCallback(val)} 
          value={value}
          style={{
            padding: '6px 0 6px 14px',
          }}
          errorText="修改失败"
          successText="修改成功"
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
      render: (val: string) => val === null ? <Line /> : moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      align: 'center',
      title: '更新时间',
      width: 110,
      render: (val: string) => val === null ? <Line /> : moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'distributionTime',
      key: 'distributionTime',
      align: 'center',
      title: '配货时间',
      width: 110,
      render: (val: string) => val === null ? <Line /> : moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      align: 'center',
      title: '发货时间',
      width: 110,
      render: (val: string) => val === null ? <Line /> : moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },

    {
      dataIndex: 'remarkText',
      key: 'remarkText',
      align: 'center',
      title: '备注',
      width: 100,
      render(value: string) {
        return <AsyncEditBox 
          onOk={(val) => ruleNameCallback(val)} 
          value={value}
          style={{
            padding: '6px 0 6px 14px',
          }}
          errorText="修改失败"
          successText="修改成功"
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
      render(_: string, record: DispatchList.IDispatchDetail, index: number) {
        return <div className={styles.handleCol}>
          <div>
            <span onClick={() => {
              setDateilModal({
                visible: true,
                dispose: false,
                verify: true,
                method: 'FBA',
                data: record,
              });
            }}>详情</span>
            {<span
              className={styles.create}
              onClick={() => {
                alert('提示“操作成功! 已经生成的不能再生成');
              }}>{index > 2 ? '标记配货' : '标记发货'}</span>}
          </div>
          <div>
            {
              <Popconfirm 
                title="暂时放着"
                placement="left"
                overlayClassName={styles.cencalModal}
                icon={<></>}
              >
                <span>打印</span>
              </Popconfirm>
            }
            {
              <Popconfirm 
                title="确定将此货件计划作废？"
                placement="left"
                overlayClassName={styles.cencalModal}
                icon={<></>}
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
    dataSource: dispatchList as [],
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
      console.log(field, 'field');
      
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

  const handleDispatch = function(stateType: string) {
    if (rowSelection.length === 0) {
      message.error('未选中任何行！');
      return;
    }

    const payload = {
      ids: rowSelection,
      stateType,
    };

    // 业务删除
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'fbaDispatchList/updateDispatch',
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
        rowSelection.map(item => {
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

  // 顶部筛选框
  const searchCondition = function(values: any) { // eslint-disable-line
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
          {shops.map(({ value, label }, i) => (
            <Option value={value} key={i}>{label}</Option>
          )) }
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
          {logisticMethods.map((item, i) => {
            return <Option value={item.value} key={i}>{item.label}</Option>;
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
        onClick={() => handleDispatch(symbols.DISTRIBUTION)} 
        className={styles.addBtn}>
          标记配货
      </Button>
      <Button 
        onClick={() => handleDispatch(symbols.DELIVERY)} 
        className={styles.addBtn}>
          标记发货
      </Button>
      <Button 
        onClick={() => handleDispatch(symbols.DELETED)} 
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
      onCancel={() => {
        detailModal.visible = false;
        setDateilModal({ ...detailModal });
      }} 
      site={marketplace} {...detailModal}
    />
  </div>;
};

export default PackageList;
