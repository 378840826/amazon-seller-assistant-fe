import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.less';
import {
  useSelector,
  useDispatch,
  Link,
} from 'umi';
import Express from './Express';
import emptyImg from '@/assets/stamp.png';
import moment from 'moment';
import classnames from 'classnames';
import {
  Table,
  Form,
  DatePicker,
  Input,
  Radio,
  Select,
  message,
} from 'antd';
import TableNotData from '@/components/TableNotData';
import { Iconfont } from '@/utils/utils';
import { moneyFormat, getRangeDate, getSiteDate } from '@/utils/huang';
import { asinPandectBaseRouter } from '@/utils/routes';


const { Search } = Input;
const { Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Empty = () => <span className={styles.secondaryText}>—</span>;
const History: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { 
    currency,
    id: StoreId,
    marketplace,
  } = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  const [dataSource, setDataSource] = useState<RuleHistory.IRecord[]>([]);
  const [current, setCurrent] = useState<number>(1); // 当前分页
  const [pageSize, setPagesize] = useState<number>(20); // 分页大小
  const [total, setTotal] = useState<number>(0); // 总量
  const [conditions, setConditions] = useState<[]>([]); // 条件下拉列表
  const [rules, setRules] = useState<[]>([]); // 规则下拉列表
  const [selectrule, setSelectRule] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { start: start3, end: end3 } = getRangeDate(3, false);
  const { start: start7, end: end7 } = getRangeDate(7, false);
  const { start: start30, end: end30 } = getRangeDate(30, false);

  const { timeText } = getSiteDate(marketplace) as { timeText: string };

  // 调价记录列表
  const getList = useCallback((params = {}) => {
    const toolbarParams = form.getFieldsValue();
    let payload: any = { // eslint-disable-line
      headersParams: {
        StoreId,
      },
      startTime: start3,
      endTime: end3,
      size: pageSize,
    };

    payload = Object.assign({}, payload, toolbarParams, params);
    payload.startTime = moment(toolbarParams.rangepicker[0]).format('YYYY-MM-DD');
    payload.endTime = moment(toolbarParams.rangepicker[1]).format('YYYY-MM-DD');
    delete payload.rangepicker;

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'ruleHistory/getHistory',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      setLoading(false);
      const {
        data,
        code,
        message: msg,
      } = datas as {
        message: string;
        code: number;
        data: {
          records: RuleHistory.IRecord[];
          current: number;
          size: number;
          total: number;
        };
      };

      if (code === 200) {
        setCurrent(data.current);
        setPagesize(data.size);
        setTotal(data.total);
  
        if (data && data.records) {
          setDataSource(data.records);
        }
      } else {
        message.error(msg || '列表加载失败');
      }

      
    });
  }, [dispatch, StoreId, start3, end3]); // eslint-disable-line

  // 条件下拉列表
  const getConditions = useCallback(() => {
    if (selectrule === '') {
      return;
    }
    new Promise((resolve, reject) => {
      dispatch({
        type: 'ruleHistory/getHistoryConditions',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId,
          },
          ruleName: selectrule,
        },
      });
    }).then(datas => {
      const {
        data,
      } = datas as {
        data: {
          records: [];
        };
      };

      if (data && data.records) {
        setConditions(data.records);
      }
    });
  }, [dispatch, StoreId, selectrule]);

  // 规则下拉列表
  const getRuleList = useCallback(() => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'ruleHistory/getRuleList',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId,
          },
        },
      });
    }).then(datas => {
      const {
        data,
      } = datas as {
        data: {
          records: [];
        };
      };

      if (data && data.records) {
        setRules(data.records);
      }
    });
  }, [dispatch, StoreId]);


  useEffect(() => {
    if (StoreId === '-1') {
      return;
    }
    getList();
  }, [getList, StoreId]);

  useEffect(() => {
    if (StoreId === '-1') {
      return;
    }
    getRuleList();
  }, [getRuleList, StoreId]);


  useEffect(() => {
    if (StoreId === '-1') {
      return;
    }
    getConditions();
  }, [getConditions, StoreId]);

  const columns = [
    {
      title: '时间',
      dataIndex: 'adjustTime',
      align: 'center',
      width: 150,
      render(val: string) {
        return <>
          <p>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</p>
          <p className={styles.secondaryText}>({timeText})</p>
        </>;
      },
    },
    {
      title: '商品信息',
      dataIndex: 'title',
      align: 'center',
      width: 280,
      render(value: string, record: RuleHistory.IRecord) {
        const { imgLink, asin, fulfillmentChannel, link } = record;
        return <div className={styles.productCol}>
          <img src={imgLink || emptyImg} alt=""/>
          <div className={styles.details}>
            <a className={styles.title} href={link} target="_blank" rel="noreferrer" title={value}>
              <Iconfont type="icon-lianjie" className={styles.icon} />
              {value}
            </a>
            <p className={styles.foot}>
              <Link to={`${asinPandectBaseRouter}?asin=${asin}`} 
                className={styles.asin}
                target="_blank"
              >
                {asin}
              </Link>
              <Express method={fulfillmentChannel}/>
            </p>
          </div>
        </div>;
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      align: 'left',
      width: 100,
    },
    {
      title: '最低价',
      dataIndex: 'minPrice',
      align: 'right',
      width: 100,
      render: (value: number) => {
        if (value === null) {
          return <Empty />;
        }
        return currency + moneyFormat(value, 2, ',', '.');
      },
    },
    {
      title: '最高价',
      dataIndex: 'maxPrice',
      align: 'right',
      width: 100,
      render: (value: number) => {
        if (value === null) {
          return <Empty />;
        }
        return currency + moneyFormat(value, 2, ',', '.');
      },
    },
    {
      title: '调价规则',
      dataIndex: 'ruleName',
      align: 'center',
      width: 200,
    },
    {
      title: '条件',
      dataIndex: 'triggerCondition',
      align: 'left',
      width: 300,
      render(val: string) {
        return <div className={styles.conditionContent}>
          {val}
        </div>;
      },
    },
    {
      title: '触发价格',
      dataIndex: 'triggerPriceVos',
      align: 'center',
      width: 170,
      render(val: string,
        { triggerPriceVos }: {
          triggerPriceVos: {
            sellerName: string;
            price: number;
            fulfillmentChannel: string;
            shipping: number;
            sellerLink: string;
            targetType: string;
          }[];
        }
      ) {
        if (triggerPriceVos.length === 0) {
          return <Empty />;
        }

        return triggerPriceVos.map((item, i) => {
          return <div className={styles.trggerContent} key={i}>
            <p>
              { item.price ? <span title="竞品价格">{currency + item.price} + </span> : <Empty />} 
              {item.shipping ? <span title="运费">{currency + item.shipping}</span> : <Empty />}
            </p>
            <p>
              {item.sellerName ? <><a href={item.sellerLink} title="卖家名称">{item.sellerName}</a> + </> : <Empty />}
              {item.fulfillmentChannel ? <span className={styles.method} title="发货方式">（{item.fulfillmentChannel}）</span> : <Empty /> }
            </p>
          </div>;
        });
      },
    },
    {
      title: '原价格',
      dataIndex: 'oldPrice',
      align: 'right',
      width: 100,
      render: (value: number) => {
        if (value === null) {
          return <Empty />;
        }
        return currency + moneyFormat(value, 2, ',', '.');
      },
    },
    {
      title: '新价格',
      dataIndex: 'newPirce',
      align: 'right',
      width: 100,
      render: (value: number) => {
        if (value === null) {
          return <Empty />;
        }
        return currency + moneyFormat(value, 2, ',', '.');
      },
    },
    {
      title: '价格变动',
      dataIndex: 'name',
      align: 'right',
      width: 100,
      className: styles.priceChange,
      render(priceChange: number) {
        if (priceChange === null || priceChange === undefined ) {
          return <Empty />;
        }
        return priceChange > 0 ? <span 
          className={styles.successText}>{ currency + moneyFormat(priceChange, 2, ',', '.')}</span> 
          : <span className={styles.errorText}>{ currency + moneyFormat(priceChange, 2, ',', '.')}</span>;
      },
    },
  ];
  
  let keyCount = 0;
  const tableConfig = {
    columns: columns as [],
    dataSource,
    rowKey: () => keyCount++,
    className: styles.table,
    scroll: {
      x: 'max-content',
      y: 'calc(88vh - 170px)',
    },
    loading,
    locale: {
      emptyText: <TableNotData className={styles.notData} hint="没有找到调价记录，请重新选择查询条件"/>,
    },
    pagination: {
      pageSizeOptions: ['20', '50', '100'],
      total,
      pageSize,
      current,
      showQuickJumper: true, // 快速跳转到某一页
      showTotal: (total: number) => `共 ${total} 条记录`,
      onChange(current: number, size: number | undefined){
        setCurrent(current);
        setPagesize(size as number);
        const data = form.getFieldsValue();
        if (data.rangepicker.length > 0) {
          const [start, end] = data.rangepicker;
          data.startTime = moment(start).format('YYYY-MM-DD');
          data.endTime = moment(end).format('YYYY-MM-DD');
        }
        delete data.rangepicker;
        getList(Object.assign({}, data, { current, size }));
      },
      className: 'h-page-small',
    },
  };

  
  const datepickerConfig = {
    ranges: {
      '最近3天': [moment(start3), moment(end3)],
      '最近7天': [moment(start7), moment(end7)],
      '最近30天': [moment(start30), moment(end30)],
    } as any, // eslint-disable-line
    dateFormat: 'YYYY-MM-DD',
    allowClear: false,
  };

  const onValuesChange = (val: {}, allFields: { [key: string]: string }) => { // eslint-disable-line
    if (allFields.rangepicker.length > 0) {
      const [start, end] = allFields.rangepicker;
      allFields.startTime = moment(start).format('YYYY-MM-DD');
      allFields.endTime = moment(end).format('YYYY-MM-DD');
    }
  
    delete allFields.rangepicker;
    getList(allFields);
  };
  
  return <div className={styles.historyBox}>
    <Form layout="inline" className={styles.header} form={form} onValuesChange={onValuesChange}>
      <Item name="code" className={styles.search}>
        <Search
          autoComplete="off"
          placeholder="输入标题、ASIN或SKU" 
          enterButton={<Iconfont type="icon-sousuo" />} 
          className="h-search"
          allowClear
        />
      </Item>
      <div className={styles.method}>
        <Item name="fulfillmentChannel" initialValue="all" colon={false} label="发货方式：">
          <Radio.Group >
            <Radio value="all">全部</Radio>
            <Radio value="fba">FBA</Radio>
            <Radio value="fbm">FBM</Radio>
          </Radio.Group>
        </Item>
      </div>
      <div className={styles.rules}>
        <span className="text">
          调价规则：
        </span>
        <Item initialValue={null} name="ruleName" className={styles.rulesList}> 
          <Select onChange={(val: string) => setSelectRule(val)}>
            <Option value={null as any}>不限</Option> {/* eslint-disable-line */}
            {rules.map((item, i) => {
              return <Option value={item} key={i}>{item}</Option>;
            })}
          </Select>
        </Item>
      </div>

      <div className={classnames(styles.conditions)} style={{
        visibility: selectrule === '' || selectrule === null ? 'hidden' : 'visible',
        display: selectrule === '' || selectrule === null ? 'none' : 'flex',
      }}>
        <span className="text">
          条件：
        </span>
        <Item initialValue={null} name="triggerCondition" className={styles.conditaionsList} > 
          <Select dropdownClassName={styles.conditionsSelects}>
            <Option value={null as any}>不限</Option> {/* eslint-disable-line */}
            {conditions.map((item, i) => {
              return <Option value={item} key={i}>{item}</Option>;
            })}
          </Select>
        </Item>
      </div>
      <Item 
        name="rangepicker" 
        initialValue={[moment(start3, 'YYYY-MM-DD'), moment(end3, 'YYYY-MM-DD')]}
        className={styles.calendar}
      >
        <RangePicker {...datepickerConfig} className="h-range-picker"/>
      </Item>
    </Form>
    <Table {...tableConfig} />
  </div>;
};

export default History;
