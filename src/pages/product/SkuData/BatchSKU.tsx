/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-27 17:48:33
 * @LastEditTime: 2021-04-28 14:55:47
 * 
 * 批量上传SKU
 */
import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Button, Popover, Upload, message, Modal, Table, Radio, Space } from 'antd';
import { useDispatch } from 'umi';
import { UploadFile, RcFile } from 'antd/lib/upload/interface';
import TableNotData from '@/components/TableNotData';


interface IProps {
  request: () => void;
}

interface IRepeatImportSkuProduct extends skuData.IRecord {
  rowNum: number;
}

interface ITableDataSource {
  num: number;
  importdata: string;
}

let count = 0;
const BatchSKU: React.FC<IProps> = (props) => {
  const { request } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  //后端返回是否有重复的情况的弹框
  const [modalvisible, setModalvisible] = useState<boolean>(false);
  //重复的sku
  const [repeatSkuData, setRepeatSkuData] = useState<IRepeatImportSkuProduct[]>([]);
  //重复sku总数量
  const [repeateSKUTotal, setRepeateSKUTotal] = useState<number>(0);
  //是否覆盖已存在的sku
  const [iscover, setIscover] = useState<boolean>(false);
  //点确认之后的弹框
  const [iscovervisible, setIscovervisible] = useState<boolean>(false);
  //文件所包含的总sku数量
  const [skuTotal, setSkuTotal] = useState<number>(0);
  //文件成功导入的数量
  const [successSKU, setSuccessSKU] = useState<number>(0);
  //跳过数量
  //const [skipSKUnum, setSkipSKUnum] = useState<number>(0);
  //表格数据
  const [tabledatasource, setTabledatasource] = useState<ITableDataSource[]>([]);


  const dispatch = useDispatch();
  

  const uploadConfig = {
    accept: '.xlsx',
    maxCount: 1,
    beforeUpload(file: RcFile ): boolean {
      const fileList = [file];
      if (fileList[0] && fileList[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        message.error('文件类型错误！只支持xlsx');
        return false;
      }
      setFileList([...fileList]);
      return false; // 返回false, 默认不自动上传，点击确定后再上传
    },
    onRemove(){
      setFileList([...[]]);
    },
  };

  // 上传文件
  const uploadFile = function() {
    if (fileList.length === 0) {
      message.error('未添加任何文件！');
      return;
    }
    
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'skuData/uploadBatchSKU',
        payload: {
          file: fileList[0],
        },
        reject,
        resolve,
      });
    });

    promise.then(datas => {
      const {
        code,
        data: { 
          error = [],
          repeatImportSkuProducts = [],
          num = 0,
        } = {},
      } = datas as {
        code: number;
        num: number;
        data: {
          error: string[];
          repeatImportSkuProducts: IRepeatImportSkuProduct[];
          num: number;
        };
      };
  
      if (code === 200) {
        setFileList([...[]]);
        //message.success('导入成功!');
        if (repeatImportSkuProducts.length > 0) {
          setRepeatSkuData([...repeatImportSkuProducts]);
          setSkuTotal(num as number);
          setRepeateSKUTotal(repeatImportSkuProducts.length as number);
          setSuccessSKU((num - repeatImportSkuProducts.length) as number);
          setTabledatasource([{ num: (num - repeatImportSkuProducts.length), importdata: '新增商品' }]);
          setModalvisible(true);
        }
        setVisible(false);
        request();
        return;
      }
  
      Modal.error({
        title: '导入失败！',
        width: 500,
        zIndex: 9999999,
        icon: <></>,
        content: <div className={styles.errorBox}>
          {error && error.map((item: string, i: number) => <p key={i}>{item}</p>)}
        </div>,
        onOk() {
          setVisible(true);
        },
      });
    });
  };
  //弹框确认覆盖重复的sku
  const coverrepeateSKU = () => {
    setModalvisible(false);

    if (!iscover) {
      //也要打开弹框
      setIscovervisible(true);
      return;
    }

    //发请求获取数据
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'skuData/coverSKU',
        payload: {
          qos: repeatSkuData,
        },
        reject,
        resolve,
      });
    });

    promise.then(datas => {
      const {
        code,
        message: msg,
        data: {
          num,
        },
      } = datas as {
        code: number;
        message: string;
        data: {
          num: number;
        };
      };
  
      if (code === 200) {
        message.success('导入成功!');
        //导入成功为总数量，跳过0
        setSuccessSKU(skuTotal);
        //跳过数量
        setRepeateSKUTotal(0 as number);
        //表格增加更新数量
        tabledatasource.push({ num: num, importdata: '更新产品' });
        setTabledatasource([...tabledatasource]);
        //打开展示弹框
        setIscovervisible(true);
        return;
      }
      message.error(msg || '覆盖SKU失败!');
    });
  };
  //表格所有列
  const columns = [{
    title: '行号',
    align: 'center',
    width: 56,
    dataIndex: 'rowNum',
    key: 'rowNum',
    render(val: number) {
      return <p className={styles.num}>{val}</p>;
    },
  }, {
    title: 'SKU',
    align: 'center',
    width: 339,
    dataIndex: 'sku',
    key: 'sku',
  }, {
    title: '商品中文名称',
    align: 'center',
    width: 431,
    dataIndex: 'nameNa',
  }];

  //sku重复弹框表格配置
  const tableConfig = {
    pagination: false as false,
    dataSource: repeatSkuData as IRepeatImportSkuProduct[],
    columns: columns as [],
    className: styles.table,
    scroll: {
      y: 220,
    },
    rowkey: count++,
    locale: {
      emptyText: <TableNotData hint="未找到相关数据"/>,
    }, 
  };
  //覆盖sku表格配置
  const coverColumn = [{
    title: '数量',
    align: 'center',
    dataIndex: 'num',
    key: 'num',
    render(val: string) {
      return <p className={styles.num}>{val}</p>;
    },
  }, {
    title: '导入数据',
    align: 'center',
    dataIndex: 'importdata',
    key: 'importdata',
  }];

  //覆盖sku表格配置
  const covertableConfig = {
    pagination: false as false,
    dataSource: tabledatasource as ITableDataSource[],
    columns: coverColumn as [],
    className: styles.table,
    rowKey: (record: { importdata: string }) => record.importdata,
    scroll: {
      y: 220,
    },
    locale: {
      emptyText: <TableNotData hint="未找到相关数据"/>,
    },
  };

  return (<>
    <Popover
      content={<div className={styles.batchRelevanceBox}>
        <div className={styles.content}>
          <div className={styles.leftLayout}>
            <span>选择文件：</span>
            <Upload {...uploadConfig} fileList={fileList}>
              <Button>+选择文件</Button>
            </Upload>
            <span 
              className={classnames(styles.notFile, fileList.length && 'none')}
            >
              {fileList.length === 0 && '未选择任何文件'}
            </span>
          </div>
          <div className={styles.rightLayout}>
            <a href="/api/mws/shipment/sku/product/importSkuProduct">下载模板</a>
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Button type="primary" onClick={uploadFile}>确定</Button>
        </div>
      </div>}
      title="批量上传SKU"
      trigger="click"
      placement="bottom"
      overlayClassName={styles.batchRelevanceBox}
      visible={visible}
      onVisibleChange={(visible) => setVisible(visible)}
    >
      <Button style={{ width: 116 }}>批量上传SKU</Button>
    </Popover>
    <Modal
      visible={modalvisible}
      centered
      width={910}
      onCancel={() => setModalvisible(false)}
      onOk={coverrepeateSKU}
      className={styles.repeateskumodal}
    >
      <p className={styles.clus}>商品导入-sku重复</p>
      <div className={styles.span}>
        <span>有</span>
        <span>
          {repeateSKUTotal}
        </span>
        <span>条记录的sku在系统已存在，数据见下表：</span>
      </div>
      <Table {...tableConfig}></Table>
      <Radio.Group defaultValue={false} onChange={ e => setIscover(e.target.value)}>
        <Space direction="vertical">
          <Radio value={false}>全部跳过，已存在的sku将不导入，也不更新系统中的商品信息</Radio>
          <Radio value={true}>全部覆盖，已存在的sku将会导入，并且更新系统中的商品信息</Radio>
        </Space>             
      </Radio.Group>
    </Modal>
    <Modal
      visible={iscovervisible}
      centered
      className={styles.showcovermodal}
      onCancel={() => setIscovervisible(false)}
      width={602}
      footer={false}
    >
      <p className={styles.clus}>商品导入完成</p>
      <div className={styles.span}>
        <span>本次导入Excel文件中包含</span>
        <span>{skuTotal}</span>
        <span>个商品，成功导入</span>
        <span>{successSKU}</span>
        <span>个，跳过</span>
        <span>{repeateSKUTotal}个</span>       
        <Table {...covertableConfig}></Table>        
      </div>
      <div className={styles.button}>
        <Button type="primary" onClick={() => setIscovervisible(false)}>关闭</Button>
      </div>    
    </Modal>
  </>);
};

export default BatchSKU;
