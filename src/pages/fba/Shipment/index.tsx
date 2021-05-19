/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-04 09:59:29
 * @LastEditTime: 2021-04-23 15:38:51
 * 
 * 货件计划列表
 *
 */
import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Iconfont } from '@/utils/utils';
import moment from 'moment';
import { DoubleRightOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, IShipmentState, ConnectProps, IConfigurationBaseState } from 'umi';
import AddPlan from './AddPlan';
import {
  Table,
  Select,
  Input,
  Form,
  Button,
  DatePicker,
  Popconfirm,
  message,
} from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import ConfireDownList from './ConfireDownList';
import Details from './Details';
import More from './More';

interface IDetailModalType {
  visible: boolean;
  method: 'FBA'| 'overseas'; // FBA和每外仓库
  dispose: boolean; // 是否已处理
  verify: boolean; // 是否已核实
  id: number;
}

interface IPage extends ConnectProps {
  shipment: IShipmentState;
  configurationBase: IConfigurationBaseState;
}

const { Option } = Select;
const { Item } = Form;
let rowSelection: number[] = []; // 选中的行
const PackageList: React.FC = function() {
 
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const shipmentList = useSelector((state: IPage) => state.shipment.shipmentList);
  const shops = useSelector((state: IPage) => state.configurationBase.shops); // 店铺列表

  const [current, setCurrent] = useState<number>(1);
  const [addVisible, setAddVisible] = useState<boolean>(false); // 添加货件
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  // 打开货件详情的初始值
  const [detailModal, setDateilModal] = useState<IDetailModalType>({
    visible: false,
    method: 'FBA',
    dispose: false,
    verify: false,
    id: -1,
  });
  const [sites, setSites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const currentDate = moment();
  const {
    marketplace,
  } = currentShop;
  const dateRange = {
    '最近7天': [moment().subtract(7, 'days'), currentDate],
    '最近30天': [moment().subtract(30, 'days'), currentDate],
    '最近60天': [moment().subtract(60, 'days'), currentDate],
    '最近90天': [moment().subtract(90, 'days'), currentDate],
    '最近180天': [moment().subtract(180, 'days'), currentDate],
    '最近365天': [moment().subtract(365, 'days'), currentDate],
  };

  const request = useCallback((params = { current: 1, pageSize: 20 }) => {
    const data = form.getFieldsValue();
    const [startTime, endTime] = data.rangeDateTime;
    data.startTime = startTime.format('YYYY-MM-DD');
    data.endTime = endTime.format('YYYY-MM-DD');
    
    Reflect.deleteProperty(data, 'rangeDateTime');

    setLoading(true);
    let payload = {
      current: params.current,
      pageSize: params.pageSize,
      ...data,
    };
    payload = Object.assign({}, payload, params);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'shipment/getShipmentList',
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
            current,
            pageSize,
            total,
          },
        },
      } = datas as {
        code: number;
        message?: string;
        data: {
          page: {
            current: number;
            pageSize: number;
            total: number;
          };
        };
      };

      setLoading(false);
      if (code === 200) {
        setCurrent(current);
        setPageSize(pageSize);
        setTotal(total);
        return;
      }
      message.error(msg);
      setCurrent(1);
      setPageSize(20);
      setTotal(0);
    });
  }, [dispatch, form]);

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
  const requestShop = useCallback((marketplace?: string) => {
    dispatch({
      type: 'configurationBase/getShop',
      payload: { marketplace },
    });
  }, [dispatch]);


  // 请求
  useEffect(() => {
    request();
    requestSite();
    requestShop();
  }, [request, requestSite, requestShop]);

  // 修改物流方式的回调
  const changeLogistics = function() {
    const count = Math.random() * 10;
    return Promise.resolve(count > 5);
  };
  
  const columns = [
    {
      dataIndex: 'shipmentState',
      key: 'shipmentState',
      align: 'state',
      title: '状态',
      width: 60,
      fixed: 'left',
    },
    {
      dataIndex: 'mwsShipmentId',
      key: 'mwsShipmentId',
      align: 'right',
      title: 'ShipmentID',
      width: 100,
      fixed: 'left',
    },
    {
      dataIndex: 'shipmentName',
      key: 'shipmentName',
      align: 'center',
      title: 'Shipment名称',
      width: 120,
      fixed: 'left',
    },
    {
      dataIndex: 'shipmentId',
      key: 'shipmentId',
      align: 'center',
      title: '货件计划ID',
      width: 120,
    },
    {
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      align: 'center',
      title: '发货单号',
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
      dataIndex: 'destinationFulfillmentCenterId',
      key: 'destinationFulfillmentCenterId',
      align: 'center',
      title: '亚马逊仓库代码',
      width: 100,
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
      width: 100,
    },
    {
      dataIndex: 'trackingId',
      key: 'trackingId',
      align: 'center',
      title: '物流跟踪号',
      width: 110,
    },
    {
      dataIndex: 'casesRequired',
      key: 'casesRequired',
      align: 'center',
      title: '包装方式',
      width: 100,
    },
    {
      dataIndex: 'labelingType',
      key: 'labelingType',
      align: 'center',
      title: '贴标方',
    },
    {
      dataIndex: 'packageLabelType',
      key: 'packageLabelType',
      align: 'center',
      title: '装箱清单',
      width: 100,
    },
    {
      dataIndex: 'referenceId',
      key: 'referenceId',
      align: 'center',
      title: 'ReferenceID',
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
      title: '申报量',
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
      title: '申收差异',
      width: 170,
    },
    {
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      title: '创建人',
      width: 170,
    },
    {
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      align: 'center',
      title: '创建时间',
      width: 170,
    },
    {
      dataIndex: 'receivingTime',
      key: 'receivingTime',
      align: 'center',
      title: '开始收货时间',
      width: 170,
    },
    {
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      align: 'center',
      title: '更新时间',
      width: 170,
    },
    {
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      title: '操作',
      fixed: 'right',
      width: 120,
      className: styles.handleCol,
      render(_: string, record: Shipment.IShipmentList, index: number) {
        return <div className={styles.handleCol}>
          <div>
            <span onClick={() => {
              setDateilModal({
                visible: true,
                dispose: false,
                verify: true,
                method: 'FBA',
                id: record.id,
              });
            }}>详情</span>
            {<span
              className={styles.create}
              onClick={() => {
                alert('提示“操作成功! 已经生成的不能再生成');
              }}>生成发货单</span>}
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
            {/* 如果shipment已经标记出运，就只有“取消”，其他按钮都没有了 */}
            <More isShipment={index > 2 ? true : false}/>
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
      onChange(current: number, pageSize: number | undefined){
        request({ current, pageSize });
      },
      className: classnames('h-page-small', styles.page),
    },
    rowSelection: {
      type: 'checkbox',
      columnWidth: 38,
      onChange (selectedRowKeys: TableRowSelection<string>) {
        rowSelection = selectedRowKeys as number[];
      },
    } as {},
    loading,
    columns: columns as [],
    dataSource: shipmentList as [],
    className: styles.table,
    rowKey: (record: {id: string}) => record.id,
    scroll: {
      y: 'calc(100vh - 333px)',
      x: 'max-content',
    },
  };

  const search = function(values: string, event: any) { // eslint-disable-line
    // 限制清空按钮
    if (values === '' && Reflect.has(event, 'button') && event.target.className === 'ant-input') {
      return;
    }

    request({ current: 1 });
  };

  // 顶部筛选框
  const searchCondition = function(values: any) { // eslint-disable-line
    console.log(values, 'form');
    
    if (
      Reflect.has(values, 'match')
      || Reflect.has(values, 'code')
    ) {
      return;
    }
    request({ current: 1 });
  };

  const cancellation = function() {
    if (rowSelection.length === 0) {
      message.error('未选中任何行！');
      return;
    }

    // 业务删除
    console.log('?');
  };

  // 标记出运
  const handleShipment = function() {
    if (rowSelection.length === 0) {
      message.error('未选中任何行！');
      return;
    }

    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'shipment/getRefereceid',
        resolve,
        reject,
        payload: {
          mwsShipmentIds: rowSelection,
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
        message?: string;
        data: {
          id: number;
          amazonReferenceId: string;
        }[];
      };

      if (code === 200) {
        const temp = JSON.stringify(shipmentList);
        const newShipmentList: Shipment.IShipmentList[] = JSON.parse(temp);
        rowSelection.map(item => {
          const datas = newShipmentList.find(dItem => item === dItem.id);
          const refereceid = data.find(({ id }) => id === item);
          datas && refereceid && (datas.referenceId = refereceid.amazonReferenceId);
        });
        dispatch({
          type: 'shipment/saveShipmentList',
          payload: newShipmentList,
        });
        return;
      }

      message.error(msg || '同步RefereceID失败，重稍后重试！');
    });
  };

  // 批量操作 -- 标记出运和删除
  const handleShipmentAndDelete = function (type: string) {
    if (rowSelection.length === 0) {
      message.error('未选中任何行！');
      return;
    }

    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'shipment/updateShipment',
        reject,
        resolve,
        payload: {
          state: type,
          mwsShipmentId: rowSelection,
        },
      });
    });

    promise.then(datas => {
      const {
        code,
        message: msg,
      } = datas as Global.IBaseResponse;

      if (code === 200) {
        const temp = JSON.stringify(shipmentList);
        const newShipmentList: Shipment.IShipmentList[] = JSON.parse(temp);
        // 标记出运
        if (type === 'SHIPPED') {
          rowSelection.map(item => {
            const data = newShipmentList.find(dItem => item === dItem.id);
            data && (data.shipmentState = 'shipped');
          });
        } else if (type === 'CANCELLED') { // 删除
          // ....
        }
        
        dispatch({
          type: 'shipment/saveShipmentList',
          payload: newShipmentList,
        });
        return;
      }
      message.error(msg);
    });
  };

  const selectBefore = (
    <Item name="match" className={styles.searchList}>
      <Select className={styles.list}>
        <Option value="MwsShipmenrId">ShipmentID</Option>
        <Option value="ShipmentName">Shipment名称</Option>
        <Option value="ShipmentId">货件计划ID</Option>
        <Option value="ReferenceId">ReferenceID</Option>
        <Option value="CenterId">亚马逊仓库代码</Option>
        <Option value="Username">创建人</Option>
      </Select>
    </Item>
  );


  return <div className={styles.box}>
    <Form 
      className={styles.topHead} 
      form={form} 
      initialValues={{
        match: 'MwsShipmenrId',
        timeMatch: 'GmtCreate',
        rangeDateTime: [moment().subtract(7, 'days'), currentDate],
      }}
      onValuesChange={searchCondition}
    >
      <Item name="code">
        <Input.Search 
          addonBefore={selectBefore} 
          enterButton={<Iconfont type="icon-sousuo" />} 
          autoComplete="off"
          allowClear
          className={classnames('h-search', styles.search)}
          onSearch={search}
        />
      </Item>
      <Item name="countryCode" className={styles.site}>
        <Select placeholder="站点">
          {sites.map((item, i) => <Option value={item} key={i}>{item}</Option>)}
        </Select>
      </Item>
      <Item name="storeId" className={styles.shopName}>
        <Select
          placeholder="店铺名称"
          optionFilterProp="children"
        >
          {shops.map(({ value, label }, i) => (
            <Option value={value} key={i}>{label}</Option>
          )) }
        </Select>
      </Item>
      <Item name="status" className={styles.state}>
        <Select placeholder="状态">
          <Option value="1">WORKING</Option>
          <Option value="2">SHIPPED</Option>
          <Option value="3">IN_TRANSIT</Option>
          <Option value="4">DELIVERED</Option>
          <Option value="5">CHECKED_IN</Option>
          <Option value="7">RECEIVING</Option>
          <Option value="8">CLOSED</Option>
          <Option value="6">CANCELLED</Option>
          <Option value="9">DELETED</Option>
          <Option value="24">ERROR</Option>
        </Select>
      </Item>
      <Item name="packageLabelStatus" className={styles.handle} >
        <Select placeholder="货箱状态">
          <Option value="1">已上传</Option>
          <Option value="2">上传失败</Option>
          <Option value="3">未上传</Option>
          <Option value="4">上传中</Option>
        </Select>
      </Item>
    </Form>
    <div className={styles.navHead}>
      <div className={styles.leftLayout}>
        <Button type="primary" 
          className={styles.addBtn}
          onClick={() => setAddVisible(!addVisible)}
          style={{
            display: 'none',
          }}
        >
          创建Shipment <DoubleRightOutlined />
        </Button>
        <Button onClick={cancellation} className={styles.addBtn}>生成发货单</Button>
        <Button onClick={handleShipment} className={styles.addBtn}>同步ReferenceID</Button>
        <Button onClick={() => handleShipmentAndDelete('SHIPPED')} className={styles.addBtn}>标记出运</Button>
        <Button onClick={() => handleShipmentAndDelete('CANCELLED')} disabled className={styles.addBtn}>删除</Button>
      </div>
      <Form form={form} className={styles.rightLayout}onFieldsChange={() => console.log(2222)}
        onValuesChange={searchCondition}>
        <Item name="timeMatch" className={styles.typeDownList}>
          <Select>
            <Option value="GmtCreate">创建日期</Option>
            <Option value="GmtModified">更新日期</Option>
            <Option value="ReceivingTime">开始收货日期</Option>
          </Select>
        </Item>
        <Item name="rangeDateTime">
          <DatePicker.RangePicker 
            allowClear={false} 
            ranges={dateRange as {}} 
          />
        </Item>
      </Form>
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
