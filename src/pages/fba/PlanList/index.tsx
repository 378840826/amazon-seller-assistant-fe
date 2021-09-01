/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-04 09:59:29
 * @LastEditTime: 2021-05-14 11:28:24
 * 
 * 货件计划列表
 *
 */
import React, { useEffect, useState, useCallback } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Iconfont, requestErrorFeedback } from '@/utils/utils';
import moment from 'moment';
import { DoubleRightOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, IPianListState, ConnectProps, IFbaBaseState } from 'umi';
import AddPlan from './AddPlan';
import {
  Table,
  Select,
  Input,
  Form,
  Button,
  DatePicker,
  message,
  Popconfirm,
} from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import columns from './cols';
import TableNotData from '@/components/TableNotData';

interface IPage extends ConnectProps {
  planList: IPianListState;
  fbaBase: IFbaBaseState;
}


const { Option } = Select;
const { Item } = Form;
const PackageList: React.FC = function() {
  const [form] = Form.useForm();

  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const data = useSelector((state: IPage) => state.planList.planList);
  const sites = useSelector((state: IPage) => state.planList.sites);
  const shops = useSelector((state: IPage) => state.fbaBase.shops);

  const [addVisible, setAddVisible] = useState<boolean>(false); // 添加货件
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]); // 表格选中行
  const [loading, setLoading] = useState<boolean>(true); // 表格选中行
  const [sortedInfo, setSortedInfo] = useState<null|Global.ISortedType>(null);

  const currentDate = moment();
  const {
    marketplace,
  } = currentShop;
  const dispatch = useDispatch();
  const dateRange = {
    '最近7天': [moment().subtract(7, 'days'), currentDate],
    '最近30天': [moment().subtract(30, 'days'), currentDate],
    '最近60天': [moment().subtract(60, 'days'), currentDate],
    '最近90天': [moment().subtract(90, 'days'), currentDate],
    '最近180天': [moment().subtract(180, 'days'), currentDate],
    '最近365天': [moment().subtract(365, 'days'), currentDate],
  };

  const getRequestParams = useCallback(function(params = {}) {
    const formData = form.getFieldsValue();

    formData.startTime = formData.dateTime[0].format('YYYY-MM-DD');
    formData.endTime = `${formData.dateTime[1].format('YYYY-MM-DD')} 23:59:59`;
    formData.deleted !== undefined && (formData.deleted = Boolean(formData.deleted));
    formData.verifyType !== undefined && (formData.verifyType = Boolean(formData.verifyType));
    formData.handle !== undefined && (formData.handle = Boolean(formData.handle));
    formData.code === undefined && (Reflect.deleteProperty(formData, 'match'));
    Reflect.deleteProperty(formData, 'dateTime');
    
    return Object.assign({}, formData, params);
  }, [form]);

  // 供筛选的店铺
  const shopFilter = shops.filter(shop => {
    const selectedMarketplace = form.getFieldValue('countryCode');
    if (selectedMarketplace) {
      return shop.marketplace === selectedMarketplace;
    }
    return true;
  });

  // 初始化货件列表
  const request = useCallback((params = { currentPage: 1, pageSize: 20 }) => {
    setLoading(true);
    let payload = {
      currentPage: params.currentPage,
      pageSize: params.pageSize,
      ...getRequestParams(),
    };
    payload = Object.assign({}, payload, params);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/getPlanList',
        reject,
        resolve,
        payload,
      });
    }).then(datas => {
      const {
        code,
        message: msg,
        data: {
          current = 1,
          size = 20,
          total = 0,
          records = [],
        } = {},
      } = datas as {
        code: number;
        message?: string;
        data?: {
          current: number;
          size: number;
          total: number;
          records: planList.IRecord[];
        };
      };

      setLoading(false);
      if (code === 200) {
        const tempArr: number[] = [];
        setCurrent(Number(current));
        setPageSize(size);
        setTotal(total);
        // 默认选中正常状态的
        records.forEach(item => {
          item.state && tempArr.push(item.id);
        });
        setSelectedRowKeys([...tempArr]);
        return;
      }
      message.error(msg || '获取货件列表失败！');
    });
  }, [dispatch, getRequestParams]);

  // 店铺列表
  const getShops = useCallback((marketplace = '') => {
    dispatch({
      type: 'fbaBase/getShops',
      payload: {
        marketplace,
      },
    });
  }, [dispatch]);

  const getSites = useCallback(() => {
    dispatch({
      type: 'planList/getSites',
      callback: requestErrorFeedback,
    });
  }, [dispatch]);


  // 请求
  useEffect(() => {
    request();
    getShops();
    getSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //}, [request, getShops, getSites]);

  // 当添加成功后，重新请求列表
  const addSuccessCallbal = function() {
    request();
  };

  const tableConfig = {
    pagination: {
      pageSizeOptions: ['20', '50', '100'],
      total,
      pageSize,
      current,
      showQuickJumper: true, // 快速跳转到某一页
      showSizeChanger: true,
      showTotal: (total: number) => `共 ${total} 个`,
      className: classnames('h-page-small', styles.page),
    },
    rowSelection: {
      type: 'checkbox',
      columnWidth: 38,
      selectedRowKeys,
      onChange (selectedRowKeys: TableRowSelection<string>) {
        setSelectedRowKeys(selectedRowKeys as number[]);
      },
    } as {},
    loading, 
    columns: columns({ 
      sortedInfo,
      addSuccessCallbal,
    }) as [],
    dataSource: data as [],
    // rowKey: () => tableCount++,
    className: styles.table,
    scroll: {
      y: 'calc(100vh - 330px)',
      x: 'max-content',
    },
    rowKey: (record: { id: number }) => record.id,
    locale: {
      emptyText: <TableNotData hint={'没有找到相关数据，请重新选择查询条件'}/>,
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
      
      const data = Object.assign({}, getRequestParams(), objs);
      setLoading(true);
      request(data);
      setSortedInfo({
        columnKey: asc === null ? '' : field,
        order: asc === true ? 'ascend' : 'descend',
      });
      
    },

  };

  const search = function(asin: string, event: any ) {// eslint-disable-line
    if (asin === '' && 'button' in event && event.target.className === 'ant-input') {
      return;
    }

    request();
  };

  // 货件计划作废（批量）
  const updatePlan = function() {
    if (selectedRowKeys.length === 0) {
      message.error('未选中任何行！');
      return;
    }

    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/updatePlan',
        resolve,
        reject,
        payload: {
          ids: selectedRowKeys,
        },
      });
    });
    
    promise.then(res => {
      const { code, message: msg } = res as Global.IBaseResponse;
      if (code === 200) {
        message.success(msg || '操作成功！');
        return;
      }

      message.error(msg || '操作失败！');
    });
  };


  // 筛选条件
  const formfieldChange = function (fields: any) { // eslint-disable-line
    // 如果切换了站点，清空店铺选择
    if (Reflect.has(fields, 'countryCode')) {
      form.setFieldsValue({ storeId: undefined });
    }
    // 限制搜索框输入就搜索
    if (fields.code === '' || fields.code) {
      return;
    }

    request();
  };

  const selectBefore = (
    <Item name="match" className={styles.searchList}>
      <Select className={styles.list}>
        <Option value="ShipmentId">货件计划ID</Option>
        <Option value="MwsShipmentId">ShipmentID</Option>
        <Option value="RemarkText">备注</Option>
        <Option value="Usrname">创建人</Option>
      </Select>
    </Item>
  );


  return <div className={styles.box}>
    <Form 
      className={styles.topHead} 
      form={form} initialValues={{
        match: 'ShipmentId',
        handle: 0,
        timeMatch: 'GmtCreate',
        dateTime: [moment().subtract(60, 'days'), currentDate],
        deleted: 1,
      }}
      onValuesChange={formfieldChange}
    >
      <Item name="code">
        <Input.Search 
          addonBefore={selectBefore} 
          enterButton={<Iconfont type="icon-sousuo" />} 
          autoComplete="off"
          className={classnames(styles.search)}
          onSearch={search}
          allowClear
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
      <Item name="deleted" className={styles.state}>
        <Select allowClear placeholder="状态">
          <Option value={1}>正常</Option>
          <Option value={0}>作废</Option>
        </Select>
      </Item>
      <Item name="verifyType" className={styles.opportunity}>
        <Select allowClear placeholder="可发量核实">
          <Option value={1}>仓库已核实</Option>
          <Option value={0}>待仓库核实</Option>
        </Select>
      </Item>
      <Item name="handle" className={styles.state}>
        <Select allowClear placeholder="处理状态">
          <Option value={0}>未处理</Option>
          <Option value={1}>已处理</Option>
        </Select>
      </Item>
    </Form>
    <div className={styles.navHead}>
      <div className={styles.leftLayout}>
        <Button type="primary" 
          className={styles.addBtn}
          onClick={() => setAddVisible(!addVisible)}
        >
          创建货件计划 <DoubleRightOutlined />
        </Button>
        <Popconfirm
          title="作废后不可恢复，确定作废？"
          icon={<Iconfont type="icon-tishi2" />}
          okText="确定"
          cancelText="取消"
          placement="bottom"
          arrowPointAtCenter
          overlayClassName={styles.delTooltip}
          onConfirm={updatePlan}
        > 
          <Button>作废</Button>
        </Popconfirm>
      </div>
      <Form form={form} className={styles.rightLayout} onValuesChange={formfieldChange}>
        <Item name="timeMatch" className={styles.typeDownList}>
          <Select>
            <Option value="GmtCreate">创建日期</Option>
            <Option value="GmtModified">更新日期</Option>
            <Option value="ReceivingTime">开始收货日期</Option>
          </Select>
        </Item>
        <Item name="dateTime">
          <DatePicker.RangePicker 
            allowClear={false} 
            ranges={dateRange as {}}/>
        </Item>
      </Form>
    </div>
    <main>
      <Table {...tableConfig} />
    </main>
    <AddPlan 
      visible={addVisible} 
      onCancel={() => setAddVisible(false)}
      marketplace={marketplace}
      addSuccessCallbal={addSuccessCallbal}
    />
  </div>;
};

export default PackageList;
