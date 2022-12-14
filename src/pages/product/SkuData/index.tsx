/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-25 10:10:18
 * @LastEditTime: 2021-04-29 16:54:50
 * 
 * SKU资料管理
 */
import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Button, Select, Table, message, Input, Modal } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import { TableRowSelection } from 'antd/lib/table/interface';
import { useDispatch, useSelector, ConnectProps, ISupplierState } from 'umi';
import { states } from './config';
import columns from './columns';
import MyMOdal from './AddSku';
import AiMatch from './AiMatch';
import { Iconfont } from '@/utils/utils';
import BatchRelevance from './BatchRelevance';
import BatchSKU from './BatchSKU';
import TableNotData from '@/components/TableNotData';
import BatchUpdateState from './BatchUpdateState';
import JsExportExcel from 'js-export-excel';

interface IPage extends ConnectProps {
  supplier: ISupplierState;
}

const SkuData: React.FC = () => {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<skuData.IRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState<boolean>(false); // 添加SKU显隐
  const [aiVisible, setAiVisible] = useState<boolean>(false); // 智能匹配显隐
  const [state, setState] = useState<string|null>(null);
  const [code, setCode] = useState<string|null>(null);
  const [selectedSkuId, setSelectedSkuId] = useState<string[]>([]);
  //获取到的数据拼接
  //const [totaldata, setTotaldata] = useState<skuData.IRecord[]>([]);
  //勾选中的数据
  //const [checkedData, setCheckedData] = useState<skuData.IRecord[]>([]);


  //const [supplierDownList, setsupplierDownList] = useState<Supplier.ISupplierList[]>([]);

  const supplierList = useSelector((state: IPage) => state.supplier.supplierList);


  const dispatch = useDispatch();

  const request = useCallback((params = { currentPage: 1, pageSize: 20, ids: [] }) => {
    let payload: any = { }; // eslint-disable-line

    payload = Object.assign({ state, code }, payload, params );
    
    payload.state === undefined && (payload.state = null);

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'skuData/getskuList',
        reject,
        resolve,
        payload,
      });
    }).then(datas => {
      setLoading(false);
      const {
        code,
        data,
        message: msg,
      } = datas as {
        code: number;
        message?: string;
        data: {
          page: {
            current: number;
            size: number;
            pages: number;
            total: number;
            records: skuData.IRecord[];
          };
        };
      };

      if (code === 200) {
        setCurrent(Number(data.page.current));
        setPageSize(Number(data.page.size));
        setTotal(data.page.total);
        setData(data.page.records);
        return;
      }
      message.error(msg || 'SKU资料管理列表请求失败！');
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, state, code]);


  //获取供应商下拉列表

  const getdownSupplier = useCallback(() => {
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
        //setsupplierDownList([...supplierList]);
        return;
      }
      message.error(msg);
    }); //eslint-disable-next-line react-hooks/exhaustive-deps       
  }, []);

  useEffect(() => {
    request();
    getdownSupplier();//eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [request]);

  /** 
  useEffect(() => {
    if (data.length <= 0) {
      return;
    }
    if (totaldata.length <= 0) {
      setTotaldata([...data]);
    }
    data.map((item) => {
      //去重
      const repeateIndex = totaldata.findIndex(childItem => childItem.id === item.id);
      if (repeateIndex <= -1) {
        totaldata.push(item);
      }
    });
    setTotaldata([...totaldata]);
    //console.log(totaldata, `totaldata`);
    //eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [data, request]);
  */

  const searchProduct = function(val: string, event: any) { // eslint-disable-line
    // 限制清空按钮
    if (val === '' && Reflect.has(event, 'button') && event.target.className === 'ant-input') {
      return;
    }
    setCode(val);
  };

  // 批量修改状态成功后的回调
  const batchStateSuccessCallback = function(state: string) {
    data.forEach(item => {
      const temp = selectedSkuId.find(cItem => cItem === item.id);
      temp && (item.state = state);
    });

    setData([...data]);
  };

  const updateSku = function(newData: skuData.IRecord) {
    // console.log(newData);

    const index = data.findIndex(item => item.id === newData.id);
    data[index] = newData;
    setData([...data]);
  };

  // 删除 sku 单个/批量
  const handleBatchDel = (id?: string) => {
    if (!id && !selectedSkuId.length) {
      message.warning('请先勾选要删除的SKU');
      return;
    }
    const ids = id ? [id] : selectedSkuId;
    const skuArr = ids.map(id => (
      data.find(item => item.id === id)?.sku
    ));
    Modal.confirm({
      title: `确定删除以下${ids.length > 1 ? `${ids.length}个` : ''}SKU？`,
      content: (
        <div className={styles.delModalContent}>
          {`${[...skuArr]}`}
        </div>
      ),
      icon: null,
      maskClosable: true,
      centered: true,
      onOk() {
        const promise = new Promise((resolve, reject) => {
          dispatch({
            type: 'skuData/batchDelete',
            resolve,
            reject,
            payload: { ids },
          });
        });
        promise.then(datas => {
          const {
            code,
            message: msg,
          } = datas as Global.IBaseResponse; 
          if (code === 200) {
            message.success(msg || '操作成功');
            request({ currentPage: current, pageSize });
            return;
          }
          message.error(msg || '操作失败');
        });
      },
    });
  };
  //批量导出按钮
  const batchexport = (id?: string) => {
    
    if (!id && !selectedSkuId.length) {
      message.warning('请先勾选要导出的SKU');
      return;
    }
    const ids = id ? [id] : selectedSkuId;
    new Promise((resolve, reject) => {
      dispatch({
        type: 'skuData/getskuList',
        reject,
        resolve,
        payload: {
          ids: ids,
          code: null,
          state: null,
          currentPage: 1,
          pageSize: 100,
        },
      });
    }).then(datas => {
      setLoading(false);
      const {
        code,
        data,
        message: msg,
      } = datas as {
        code: number;
        message?: string;
        data: {
          page: {
            records: skuData.IRecord[];
          };
        };
      };

      if (code === 200) {

        //数据处理一下，给首选供应商撸出来
        
        const dd = data.page.records.map(item => {
          const defaultsupplier = item.suppliers.find(childItem => childItem.isDefault === true);
          console.log(defaultsupplier, `defaultsupplier`);
          return Object.assign(
            item, 
            { supplierName: defaultsupplier?.supplierName }, 
            { buyprice: defaultsupplier?.price }, 
            { placeUrl: defaultsupplier?.placeUrl },
            { locationNo: item.locationNos[0]?.warehouseName as string });
        });
        

        const option = { };
        option.fileName = '批量导出SKU';
        option.datas = [{
          sheetData: dd,
          sheetName: 'sheet',
          sheetFilter: ['sku', 'nameNa',
            '', '', '', '', '', '',
            '', 'buyprice', '', 'locationNo', '', '',
            '', '', '', '', '', '', 
            'supplierName', '', 'placeUrl', 'category', '', '', 
            '', '', '', '', '', '', '', 
            '', '', '', 'salesman', 'enquiryMan', 'purchaseMan', 
            '', '', '', '', '', '',
          ],
          sheetHeader: ['SKU', '产品名称',
            'SKU别名', '属性名1', '属性值1', '属性名2', '属性值2', 'SKU属性编号',
            '产品重量(g)', '采购单价', 'SKU属性别名', '仓库名称1', '库存数量1', '货位1',
            '仓库名称2', '库存数量2', '货位2', '产品体积(长*宽*高)CM', '产品特点', '备注', 
            '供应商名称', '最小采购量(MOQ)', '采购链接', '分类', '状态', '特性标签', 
            '中文配货名称', '英文配货名称', '中文报关名', '英文报关名', '海关编码(HS code)', '包装材料名称', '包装成本(CNY)', 
            '包装重量(g)', '包装尺寸（长*宽*高）CM', '产品首图', '业务开发员', '采购询价员', '采购员', 
            '指导价', '当前成本', '平均成本', '采购备注', '材质', '用途',
          ],
        }];
        //执行导出
        const toExcel = new JsExportExcel(option);
        toExcel.saveExcel();
        return;
      }
      message.error(msg || 'SKU资料管理列表请求失败！');
    });
    /** 
    if (!id && !selectedSkuId.length) {
      message.warning('请先勾选要导出的SKU');
      return;
    }
    const ids = id ? [id] : selectedSkuId;
    //选中的问题
    ids.map(item => {
      const dd = totaldata.findIndex(childItem => childItem.id === item);
      checkedData.push(totaldata[dd]);
    });
    setCheckedData([...checkedData]);
    console.log(checkedData);
    */
  };

  const tableConfig = {
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
    },
    dataSource: data as [],
    loading,
    columns: columns({ updateSku, supplierList, onBatchDel: handleBatchDel }) as [],
    scroll: {
      x: 'max-content',
      y: 'calc(100vh - 300px)',
    },
    rowSelection: {
      type: 'checkbox',
      columnWidth: 38,
      onChange (selectedRowKeys: TableRowSelection<string>) {
        setSelectedSkuId([...selectedRowKeys as string[]]);

      },
    } as {},
    rowKey: (record: { id: string }) => record.id, // 选中ID
    locale: {
      emptyText: <TableNotData hint="未找到相关数据"/>,
    },
  };

  return <div className={styles.box}>
    <header className={styles.topHead}>
      <Input.Search
        autoComplete="off"
        placeholder="输入SKU、中文品名或英文品名" 
        enterButton={<Iconfont type="icon-sousuo" />} 
        className={classnames(styles.search, 'h-search')}
        allowClear
        onSearch={searchProduct}
      />
      <Button type="primary" onClick={() => setAddVisible(!addVisible)}>添加SKU <DoubleRightOutlined /></Button>
      
      <BatchRelevance onUploadSuccess={() => setCode('')} />
      <BatchSKU request={request}/>
      <Button onClick={() => setAiVisible(!aiVisible)}>SKU智能匹配</Button>
      <BatchUpdateState ids={selectedSkuId} successCallback={batchStateSuccessCallback}/>
      <Button onClick={() => handleBatchDel()}>批量删除</Button>
      <Button onClick={() => batchexport()}>批量导出</Button>
      <Select style={{ width: 116 }} placeholder="状态" allowClear onChange={(val: string) => setState(val)}>
        {states.map((item, index) => {
          return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>;
        })}
      </Select>
    </header>

    <Table {...tableConfig} />
    <MyMOdal
      visible={addVisible}
      onCancel={() => setAddVisible(false)}
      onSuccess={sku => {
        setCode(sku);
      }}
    />
    <AiMatch 
      visible={aiVisible} 
      onCancel={() => setAiVisible(false)} 
      successmatch={() => request()}/>
  </div>;
};

export default SkuData;
