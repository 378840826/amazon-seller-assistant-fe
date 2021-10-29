import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Input, Form, Select, Button, Table, message, Popconfirm } from 'antd';
import { ISupplierState, ConnectProps, useDispatch, useSelector } from 'umi';
import { ColumnProps } from 'antd/lib/table';
import AsyncEditBox from './component/AsyncEditBox';
import MySwitch from './MySwitch';
import Addsupplier from './Addsupplier';
import EditSupplier from './EditSupplier';
import BatchSupplier from './BatchSupplier';
import { Iconfont } from '@/utils/utils';
import TableNotData from '@/components/TableNotData';


interface IPage extends ConnectProps {
  supplier: ISupplierState;
}

const { Item } = Form;
const { Option } = Select;

const SupplierList: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  //列表信息
  const supplierList = useSelector((state: IPage) => state.supplier.supplierList);
  //子账号信息
  //const userList = useSelector((state: IPage) => state.supplier.userList);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  //编辑弹框
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [initdata, setInitdata] = useState<Supplier.ISupplierList | null>(null);

  //供应商详情的初始值，添加供应商为null
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [current, setCurrent] = useState<number>(1);


  const request = useCallback((params = { currentPage: 1, pageSize: 20 }) => {
    const data = form.getFieldsValue();

    //处理一下结算方式
    if (!data.settlementType) {
      data.settlementType = null;
    }

    //传给接口的参数
    let payload = {
      currentPage: params.currentpage || 1,
      pageSize: params.pageSize || 20,
      ...data,
    };
    payload = Object.assign({}, payload, params);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'supplier/getSupplierList',
        reject,
        resolve,
        payload,
      });    
    }).then((datas) => {
      const {
        code,
        message: msg,
        data: {
          current = 1,
          size = 20,
          total = 0,
        },
      } = datas as {
        code: number;
        message: string;
        data: {
          current: number;
          size: number;
          total: number;
        };
      };     
      if (code === 200 ){
        setCurrent(Number(current));
        setPageSize(Number(size));
        setTotal(total);
        return;       
      }
      message.error(msg);
    });
  }, [form, dispatch]);

  //供应商修改
  const handleUpdateSupplier = (params: {record: Supplier.ISupplierList; val: string}) => {
    const { record, val } = params;
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'supplier/updateSupplier',
        payload: {
          ...record,
          remarkText: val,
        },
        resolve,
        reject,
      });      
    });
    return promise.then(res => {
      const { code, message: msg } = res as Global.IBaseResponse;
      if (code === 200){
        message.success(msg || '操作成功');
        //更新state数据
        dispatch({
          type: 'supplier/saveSupplierList',
          payload: supplierList.map((item) => {
            if (record.id === item.id) {
              return { ...record };
            }
            return item;
          }),
        });
      }
      //成功后关闭弹窗
      return Promise.resolve(true);
    });
  };
  //删除供应商
  const deletesupplier = (record: Supplier.ISupplierList) => {
    //全部的收款信息id
    const collectionCreateQosIds = initdata?.collectionCreateQos.map((item) => {
      return item.id;
    });
    
    new Promise((resolve, reject) => {
      dispatch({
        type: 'supplier/deleteSupplier',
        resolve,
        reject,
        payload: {
          id: record.id,
          collectionIds: collectionCreateQosIds,
        },
      });
    }).then(datas => {
      const {
        code,
        message: msg,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } = datas as any;
      if (code === 200) {
        message.success(msg || '操作成功');
        //更新state数据
        request();
        return;
      }
      message.error(msg);
    });
  };

  const formChange = () => {

    request();
  };
  //添加供应商成功
  const addSupplierSuccess = () => {
    setModalVisible(!modalVisible);
    request();
  };

  //编辑成功
  const editSupplierSuccess = () => {
    setEditVisible(!editVisible);
    request();
  };

  //初始化数据
  useEffect(() => {
    request();
    dispatch({
      type: 'supplier/getUserList',
    });//eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //表格全部列
  const column: ColumnProps<Supplier.ISupplierList>[] = [{
    title: '状态',
    width: 72,
    align: 'center',
    dataIndex: 'state',
    key: 'state',
    render(val: string, record: Supplier.ISupplierList){
      const flag = val === 'enabled' ? true : false;
      return <MySwitch id={record.id} checked={flag}/>;
    },
  }, {
    title: '供应商ID',
    width: 160,
    align: 'left',
    dataIndex: 'supplierId',
    key: 'supplierId',
  }, {
    title: '供应商名称',
    width: 160,
    align: 'left',
    dataIndex: 'name',
    key: 'name',   
  }, {
    title: '结算方式',
    width: 100,
    align: 'center',
    dataIndex: 'settlementTypeStr',
    key: 'settlementTypeStr',
  }, {
    title: '联系人',
    width: 130,
    align: 'center',
    dataIndex: 'contactsName',
    key: 'contactsName',
  }, {
    title: '联系电话',
    width: 110,
    align: 'center',
    dataIndex: 'contactsPhone',
    key: 'contactsPhone',
  }, {
    title: '邮箱',
    width: 130,
    align: 'center',
    dataIndex: 'email',
    key: 'email',
  }, {
    title: 'QQ',
    width: 100,
    align: 'center',
    dataIndex: 'qq',
    key: 'qq',
  }, {
    title: '微信',
    width: 110,
    align: 'center',
    dataIndex: 'wechat',
    key: 'wechat',
  }, {
    title: '采购员',
    width: 130,
    align: 'center',
    dataIndex: 'buyerName',
    key: 'buyerName',
  }, {
    title: '备注',
    width: 230,
    align: 'left',
    dataIndex: 'remarkText',
    key: 'remarkText',
    render(value, record){
      return <AsyncEditBox 
        onOk={val => handleUpdateSupplier({ record: record, val: val })}
        value={value}
        style={{
          padding: '6px 0 6px 0',
          margin: 0,
        }}
        maxLength={50}
      />;
    },
  }, {
    title: '创建人',
    width: 130,
    align: 'center',
    dataIndex: 'userName',
    key: 'userName',
  }, {
    title: '创建时间',
    width: 120,
    align: 'center',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
  }, {
    title: '操作',
    width: 90,
    align: 'center',
    render(_, record: Supplier.ISupplierList){
      return <><span 
        className={styles.editor} 
        onClick={ () => {
          setEditVisible(!editVisible);
          setInitdata(record);
        }}>编辑</span>
      <Popconfirm
        title="确定要删除该供应商吗"
        onConfirm={() => deletesupplier(record)}
        icon={<Iconfont type="icon-tishi2" />}
        okText="确定"
        cancelText="取消"
        placement="right"
        arrowPointAtCenter
        overlayClassName={styles.delTooltip}
      ><span className={styles.delete}>删除</span></Popconfirm>
      </>;
    },
  }];
  //表格配置项
  const tableConfig = {
    className: styles.table,
    scroll: {
      x: 'max-content',
      y: 'calc(100vh - 330px)',
    },
    dataSource: supplierList,
    columns: column,
    rowKey: (record: Supplier.ISupplierList) => String(record.id),
    locale: {
      emptyText: <TableNotData hint="没有找到相关数据，请重新选择查询条件"/>,
    },
    pagination: {
      pageSizeOptions: ['20', '50', '100'],
      total,
      pageSize,
      current: current,
      showQuickJumper: true, // 快速跳转到某一页
      showSizeChanger: true,
      showTotal: (total: number) => `共 ${total} 个`,
      onChange(currentPage: number, pageSize: number | undefined){
        request({ currentPage, pageSize });
      },
      className: classnames('h-page-small', styles.page),
    },
  };

  return <div className={styles.box}>
    <Form
      form={form} 
      className={styles.topHead}
      initialValues={{
        match: 'SupplierName',
        state: 'enabled',
        settlementType: '',
      }}
      onValuesChange={formChange}
    >
      <Item name="match">
        <Select className={styles.searchList}>
          <Option value="SupplierName">供应商名称</Option>
          <Option value="SupplierID">供应商ID</Option>
          <Option value="ContactsName">联系人</Option>
          <Option value="BuyerName">采购员</Option>
          <Option value="UserName">创建人</Option>
        </Select>
      </Item>
      <Item name="code">
        <Input.Search
          className={classnames('h-search', styles.search)}
          onSearch={formChange}
          enterButton={<Iconfont type="icon-sousuo" />}/>
      </Item>
      <Item name="settlementType">
        <Select className={styles.payment}>
          <Option value="now">现结</Option>
          <Option value="after">月结</Option>
          <Option value="">不限</Option>
        </Select>
      </Item>
      <Item name="state">
        <Select className={styles.state}>
          <Option value="enabled">启用</Option>
          <Option value="paused">停用</Option>
        </Select>
      </Item>
    </Form>
    <div className={styles.btns}>
      <Button 
        type="primary" 
        onClick={() => {
          setModalVisible(!modalVisible);
        }}> 添加供应商</Button>
      <BatchSupplier request={request}/>
      <a download href={`/api/mws/shipment/supplier/importTemplate`}>下载模板</a>
    </div> 
    <Table {...tableConfig}/>
    {
      modalVisible &&
        <Addsupplier 
          onCancel={ () => setModalVisible(!modalVisible)} 
          //userList={userList}  
          addSupplierSuccess={addSupplierSuccess}></Addsupplier>      
    }
    {
      editVisible &&
        <EditSupplier 
          onCancel={ () => setEditVisible(!editVisible)} 
          //userList={userList}  
          editSupplierSuccess={editSupplierSuccess}
          initdata={initdata}/>
    }
  </div>;
};

export default SupplierList;
