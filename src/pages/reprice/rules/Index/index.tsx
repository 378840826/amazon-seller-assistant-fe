/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-19 16:31:52
 * 智能调价 - 调价规则列表
 */
import React, { useState, useCallback, useEffect } from 'react';
import styles from './index.less';
import { useDispatch } from 'umi';
import { useSelector, history, Link } from 'umi';
import { getRuleType } from '../config';
import classnames from 'classnames';
import { getSiteDate } from '@/utils/huang';
import {
  ruleAddRouter,
  ruleAddSalesRouter,
  ruleAddCartRouter,
  ruleAddCompetitorRouter,
  productListRouter,
} from '@/utils/routes';

// component
import AsyncEditBox from '@/components/AsyncEditBox';
import TimeSelectBox from '../components/TimeSelectBox';
import MultiLineEdit from './components/MultiLineEdit';
import {
  Button,
  Table,
  Select,
  message,
  Popconfirm,
} from 'antd';

const { Option } = Select;
const Rules: React.FC = () => {
  // dva
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  // hooks
  const dispatch = useDispatch();

  // state 
  const [dataSource, setDataSource] = useState<Rules.ITableResponseType[]>([]);
  const [siteText, setTimeText] = useState<string>(''); // 站点时间
  const [loading, setLoading] = useState<boolean>(true);

  const requestFn = useCallback(() => {
    if (Number(currentShop.id) === -1) {
      return;
    }
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'rules/rulesList',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
        },
      });
    }).then(datas => {
      setLoading(false);
      const { 
        data,
      } = datas as {
        data: {
          records: Rules.ITableResponseType[];
        };
      };
      if (data.records && Array.isArray(data.records)) {
        setDataSource(data.records);
      } else {
        setDataSource([]);
      }
    });
  }, [dispatch, currentShop]);
  
  useEffect(() => {
    requestFn();
  }, [requestFn]);

  useEffect(() => {
    const siteInfo = getSiteDate(currentShop.marketplace);
    if (siteInfo && siteInfo.timeText) {
      setTimeText(siteInfo.timeText);
    }
  }, [currentShop]);

  // 修改规则名称的回调
  /**
   * @param value 名称
   * @param id 规则ID 
   * @param description 规则说明
   */
  const ruleNameCallback = (value: string, id: string, description: string) => (
    new Promise((resolve, reject) => {
      let flag = false;

      dataSource.forEach(item => {
        if (item.name === value) {
          flag = true;
        }
        
        if (item.id === id) {
          item.name = value;
        }
      });

      setDataSource([...dataSource]);

      if (flag) {
        message.error('规则名称已存在');
        return reject('规则名称已存在');
      }

      dispatch({
        type: 'rules/setRuleName',
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
          id,
          description,
          name: value,
        },
        resolve,
        reject,
      });
    }).then(() => {
      return true;
    })
  );

  // 更改规则说明
  const setDescription = (value: string, id: string, name: string) => (
    new Promise((resolve, reject) => {
      dispatch({
        type: 'rules/setRuleName',
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
          id,
          description: value,
          name,
        },
        resolve,
        reject,
      });
    }).then(datas => {
      const {
        message: msg,
      } = datas as {
        message: string;
      };
      if (msg === '修改成功') {
        message.success(msg);
      } else {
        message.error(msg || '修改失败');
      }
      return true;
    })
     
  );

  // 更改定时
  const setTiming = (timing: string, id: string) => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'rules/setTiming',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
          id,
          timing,
        },
      });
    }).then(data => {
      const {
        message: msg,
      } = data as {
        message: string;
      };
      
      if (msg === '设置成功') {
        message.success(msg);
      } else {
        message.error(msg || '修改失败~');
      }
    });
  };

  // 删除规则
  const delRule = (id: string, system: boolean, count: number) => {
    if (system) {
      message.error('系统规则不允许删除！');
      return;
    }
    if (Number(count) !== 0) {
      message.error(`有${count}个商品使用此调价规则，不允许删除`);
      return;
    }

    new Promise((resolve, reject) => {
      dispatch({
        type: 'rules/deleteRule',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
          id,
        },
      });
    }).then(datas => {
      const { message: msg } = datas as {
        message: string;
      };
      
      if (msg === '删除成功!') {
        message.success(msg);
        dataSource.forEach((item, i) => {
          if (item.id === id) {
            dataSource.splice(i, 1);
          }
        });
        setDataSource([...dataSource]);
      } else {
        message.error(msg || '删除失败！');
      }
    });
  };

  // 表头
  const columns = [
    {
      dataIndex: 'id',
      title: '规则ID',
      align: 'center',
      width: 200,
    },
    {
      dataIndex: 'type',
      title: '规则类型',
      align: 'left',
      width: 300,
      className: styles.typeCol,
      render(value: string) {
        return getRuleType(value);
      },
    },
    {
      dataIndex: 'name',
      title: '规则名称',
      align: 'left',
      width: 330,
      render: (value: string, { id, description }: Rules.ITableResponseType) => (
        <AsyncEditBox 
          onOk={(val) => ruleNameCallback(val, id, description)} 
          value={value} 
          errorText="修改失败" 
          successText="修改成功"
          maxLength={20}
        />
      ),
    },
    {
      dataIndex: 'description',
      title: '规则说明',
      align: 'left',
      width: 300,
      render(value: string, { id, name }: Rules.ITableResponseType) {
        return <MultiLineEdit 
          defaultValue={String(value)}
          shopId={currentShop.id}
          style={{
            marginLeft: 0,
          }}
          onOk={(val) => setDescription(val, id, name)}
          id={id}/>;
      },
    },
    {
      dataIndex: 'timing',
      title: <span>时间<br/><span className="secondary">（{siteText}）</span></span>,
      align: 'center',
      width: 190,
      render(value: string, { id, type }: Rules.ITableResponseType) {
        if (type === 'sell') {
          return <TimeSelectBox value={value} onOk={timing => setTiming(timing, id)}/>;
          
        }
        return <Select 
          defaultValue={value} 
          className={styles.tableSelect} 
          bordered={false} onChange={val => setTiming(val, id)}
          dropdownClassName={styles.globalSelect}
        >
          <Option value="20">每20分钟</Option>
          <Option value="60">每60分钟</Option>
        </Select>;
      },
    },
    {
      dataIndex: 'productCount',
      title: '商品数量',
      align: 'center',
      width: 88,
      render: (val: number) => {
        if (val > 0) {
          return <Link to={productListRouter} target="_blank">{val}</Link>;
        }
        return val;
      },
    },
    {
      dataIndex: 'updateTime',
      title: '更新时间',
      align: 'center',
      width: 190,
    },
    {
      dataIndex: 'handleCol',
      title: '操作',
      align: 'center',
      width: 130,
      render(value: string, { id, type, system, productCount }: Rules.ITableResponseType) {
        let router = '';
        switch (type) {
        case 'sell':
          router = ruleAddSalesRouter;
          break;
        case 'buybox':
          router = ruleAddCartRouter;
          break;
        case 'competitor':
          router = ruleAddCompetitorRouter;
          break;
        default:
          //
        }
        return <div className={styles.handleCol}>
          <Link 
            className={styles.setting} 
            to={`${router}?type=settings&id=${id}`}
          >
            设置
          </Link>
          <span className={classnames(
            styles.del,
            system ? styles.disabled : '',
          )}>
            {
              system ? '删除' : <Popconfirm
                title="确定删除规则？"
                onConfirm={() => delRule(id, system, productCount)}
                okText="确定"
                cancelText="取消"
                placement="bottom"
                overlayStyle={{
                  width: 155,
                }}
              > 
                删除
              </Popconfirm>
            }
          </span>
        </div>;
      },
    },
  ];

  // 添加规则
  const addRuleItem = () => {
    if (dataSource.length > 20) {
      message.error('每个店铺最多添加20个规则');
    } else {
      history.push(ruleAddRouter);
    }
  };

  let rowCount = 0;
  const tableConfig = {
    columns: columns as [],
    dataSource,
    loading,
    rowKey: () => rowCount++,
    scroll: {
      y: 'calc(100vh - 180px)',
    },
  };
 
  return <div className={styles.rulesBox}>
    <Button className={styles.addBtn} type="primary" onClick={addRuleItem}>
      添加规则
    </Button>
    <main className={styles.table}>
      <Table {...tableConfig} pagination={false} />
    </main>
  </div>;
};

export default Rules;
