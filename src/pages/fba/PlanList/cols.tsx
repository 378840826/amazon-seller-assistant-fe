/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-03-16 11:08:54
 * @LastEditTime: 2021-05-19 11:42:49
 * 
 * 货件计划列表
 */
import React, { useCallback, useEffect } from 'react';
import styles from './index.less';
import ConfireDownList from '@/pages/fba/components/ConfireDownList';
import ShowData from '@/components/ShowData';
import { Popconfirm, message } from 'antd';
import { useDispatch, useSelector, ConnectProps, IFbaBaseState, Link } from 'umi';
import { Iconfont, requestErrorFeedback } from '@/utils/utils';
import moment from 'moment';
import DetailHandlePage from './DetailHandlePage';
import { fba } from '@/utils/routes';

interface IProps {
  sortedInfo: null|Global.ISortedType;
  addSuccessCallbal: () => void;
}

interface IPage extends ConnectProps {
  fbaBase: IFbaBaseState;
}

const Columns = (props: IProps ) => {
  const { sortedInfo, addSuccessCallbal } = props;
  const dispatch = useDispatch();

  const logistics = useSelector((state: IPage) => state.fbaBase.logistics);

  const getLogistics = useCallback(() => {
    logistics.length === 0 && dispatch({
      type: 'fbaBase/getLogistics',
      callback: requestErrorFeedback,
    });
  }, [dispatch, logistics]);

  useEffect(() => {
    getLogistics();
  }, [getLogistics]);


  // 修改物流方式的回调
  const changeLogistics = function(newValue: string, id: string) {
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/updateLogistics',
        resolve,
        reject,
        payload: { id, shipping: newValue },
      });
    });

    return promise.then(res => {
      const { code, message: msg } = res as Global.IBaseResponse;
      if (code === 200) {
        message.success(msg || '修改成功');
        return Promise.resolve(true);
      }
      message.error(msg || '修改失败！');
      return Promise.resolve(false);
    });
  };

  // 货件计划作废（单个）
  const updateItemPlan = function(id: string) {
    const promise = new Promise((resolve, reject) => {
      dispatch({
        type: 'planList/updatePlan',
        resolve,
        reject,
        payload: {
          ids: [id],
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
  
  return [
    {
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      title: '状态',
      width: 60,
      render: (val: boolean) => val ? '正常' : '作废',
    },
    {
      dataIndex: 'shipmentId',
      key: 'shipmentId',
      align: 'center',
      title: '货件计划ID',
      width: 150,
    },
    {
      dataIndex: 'mwsShipmentId',
      key: 'mwsShipmentId',
      align: 'center',
      title: 'ShipmentID',
      width: 120,
      render: (value: string[]) => (
        <>{ value?.map(item => <div key={item}>{item}</div>) }</>
      ),
    },
    {
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      align: 'center',
      title: '发货单号',
      width: 120,
      render: (value: string[]) => (
        <>
          {
            value?.map(item => {
              <div>{item}</div>;
            })
          }
        </>
      ),
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
      dataIndex: 'warehouseDe',
      key: 'warehouseDe',
      align: 'center',
      title: '目的仓库',
      width: 100,
    },
    {
      dataIndex: 'shippingType',
      key: 'shippingType',
      align: 'center',
      title: '物流方式',
      width: 100,
      render(val: string, record: planList.IPlanDetail) {
        if (record.pstate === '已处理' || record.state === false) {
          return <span title="该货件计划已处理或已作废，无法修改物流方式">{val}</span>;
        }
        return <ConfireDownList 
          onConfirm={(newValue: string) => changeLogistics(newValue, record.id)} 
          dataList={logistics} 
          val={val}
          selectStyle={{ fontSize: 12, minWidth: 80 }}
        />;
      },
    },
    {
      dataIndex: 'mskuSum',
      key: 'mskuSum',
      align: 'center',
      title: 'MSKU种类',
      width: 100,
    },
    {
      dataIndex: 'declareSum',
      key: 'declareSum',
      align: 'center',
      title: '申报量',
      width: 100,
      render: (val: number) => <ShowData value={val} fillNumber={0} isMoney/>,
    },
    {
      dataIndex: 'verifySum',
      key: 'verifySum',
      align: 'center',
      title: '国内仓可发量',
      width: 110,
      render: (val: number) => <ShowData value={val} fillNumber={0} isMoney/>,
    },
    {
      dataIndex: 'disparitySum',
      key: 'disparitySum',
      align: 'center',
      title: '库存缺口',
      width: 100,
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'disparitySum' ? sortedInfo?.order : null,
      showSorterTooltip: false,
      render(val: number) {
        return <span className={styles.queryNumberCol}>
          <ShowData value={val} isMoney fillNumber={0} />
        </span>;
      },
    },
    {
      dataIndex: 'verifyType',
      key: 'verifyType',
      align: 'center',
      title: '可发量核实',
      width: 130,
      render: (val: boolean) => val ? '仓库已核实' : '待仓库核实',
    },
    {
      dataIndex: 'pstate',
      key: 'pstate',
      align: 'center',
      title: '处理状态',
      width: 100,
      render(val: string) {
        return val;
      },
    },
    {
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      title: '创建人',
      width: 100,
    },
    {
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      align: 'center',
      title: '创建时间',
      width: 110,
      render: (val: string) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      align: 'center',
      title: '更新时间',
      width: 110,
      render: (val: string) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'remarkText',
      key: 'remarkText',
      align: 'center',
      title: '备注',
      width: 170,
    },
    {
      dataIndex: 'id',
      key: 'id',
      align: 'let',
      title: '操作',
      fixed: 'right',
      width: 85,
      className: styles.handleCol,
      render(id: string, record: planList.IPlanDetail) {
        const { state, pstate, verifyType, warehouseDe = 'fba' } = record;
        // 未核实未处理 作废 核实
        return <div className={styles.handleCol}>
          < DetailHandlePage 
            showText="详情" 
            id={id}
            logistics={logistics}
            isinvalid={state}
            storeId={record.storeId}
            addSuccessCallbal={addSuccessCallbal}

          />
          {
            // 已处理的货件计划不能点击“作废”；已作废的货件计划也不能点击“作废”
            (state === false || pstate === '已处理') ? null : (
              <Popconfirm 
                title="作废后不可恢复，确定作废？"
                placement="left"
                overlayClassName={styles.delTooltip}
                onConfirm={() => updateItemPlan(String(record.id))}
                icon={<Iconfont type="icon-tishi2" />}
              >
                <span>作废</span>
              </Popconfirm>)
          }
          {/* { 
            // 已处理和已作废的货件计划，不能点击“核实”；未核实的货件计划，可以点击“核实”；已核实但是未处理的货件计划，可以点击“核实”；
            // 已核实过的货件也不显示核实按钮了
            (state && (pstate !== '未处理' || !verifyType)) && < DetailHandlePage 
              showText="核实" 
              id={id}
              logistics={logistics}
              isinvalid={state}
              storeId={record.storeId}/>
            // (pstate !== '已处理' || !state || !verifyType) && (< Verify id={record.id} />)
          } */}
          { 
            // 上面的“核实”按钮逻辑增加了“已核实过的布显示核实按钮”逻辑 和原型+文档描述的不符。目前无法确定那个正确
            // 已处理和已作废的货件计划，不能点击“核实”；未核实的货件计划，可以点击“核实”；已核实但是未处理的货件计划，可以点击“核实”；
            // 未处理一定未核实
            (state && (pstate === '未处理')) && < DetailHandlePage 
              showText="核实" 
              id={id}
              logistics={logistics}
              isinvalid={state}
              storeId={record.storeId}
              addSuccessCallbal={addSuccessCallbal}/>
            // (pstate !== '已处理' || !state || !verifyType) && (< Verify id={record.id} />)
          }
          {/* {(verifyType && pstate === '未处理') && <span >处理</span>} */}
          {
            // 已核实已处理的货件 FBA货件弹出确定生成shipment ,海外自营仓货件跳转到发货单列表
            (state && verifyType) && (
              warehouseDe === 'fba' ? < DetailHandlePage 
                showText="处理" 
                id={id}
                logistics={logistics}
                isinvalid={state}
                storeId={record.storeId}
                addSuccessCallbal={addSuccessCallbal}/> : <Link to={fba.dispatchList}>处理</Link>)
          }
        </div>;
      },
    },
  ];
};

export default Columns;
