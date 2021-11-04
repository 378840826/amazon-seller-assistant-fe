import React, { useState, useEffect, useCallback } from 'react';
import commonStyles from '../commonStyles.less';
import styles from './index.less';
import { Iconfont, storage } from '@/utils/utils';
import { storageKeys } from '@/utils/huang';
import classnames from 'classnames';
import { getLabel, getLabelEnglish, getCalendarFields } from '../config';
import {
  useDispatch,
  useSelector,
} from 'umi';
import { IConnectState } from '@/models/connect';

// 组件
import Update from '../components/Update';
import TableNotData from '@/components/TableNotData';
import DefinedCalendar from '@/components/DefinedCalendar';
import { DownOutlined } from '@ant-design/icons';
import Summary from './Summary';
import { childAsinCols } from './cols';
import CustomCol from './CustomCol';
import Filtern from './Filtern';
import Message from '../components/Message';
import {
  Menu,
  Button,
  Table,
  Dropdown,
  Switch,
  message,
  Input,
  Form,
  Modal,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface ITags {
  tag: string;
  asin: string;
}
interface IProps {
  tabValue: string;
  receptionMessage: (messageprofit: boolean) => void;
  canlendarCallback: (calendar: string) => void;
  setTabTag: ({ tag, asin }: ITags) => void;
  clickmessageIcon: () => void;
  visible: boolean;
  setMessagedata: Function;
  setMessageProfit: Function;
  setMessageAd: Function;
  messagedata: boolean;
  messageprofit: boolean;
  messagead: boolean;
  isShow: boolean;
  messageLength: string[];
}

const { adinTableCalendar } = storageKeys;
const ChildAsin: React.FC<IProps> = props => {
  const {
    tabValue,
    receptionMessage,
    setTabTag,
    clickmessageIcon,
    visible,
    setMessagedata,
    setMessageProfit,
    setMessageAd,
    messagedata,
    messageprofit,
    messagead,
    isShow,
    messageLength,
  } = props;
  // dva
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const isGroups = useSelector((state: AsinTable.IDvaState) => state.asinTable.isGroups);
  const childCustomcol = useSelector(
    (state: AsinTable.IDvaState) => state.asinTable.childCustomcol
  );
  const functionCount = useSelector((state: IConnectState) => state.user.currentUser.memberFunctionalSurplus.find(item => item.functionName === 'ASIN报表导出')?.frequency || 0);  

  // hooks
  const [searchForm] = Form.useForm();
  const dispatch = useDispatch();

  // state
  const [visiblefiltern, setVisibleFiltern] = useState<boolean>(false); // 高级筛选是否显示
  const [conditions, setConditions] = useState<API.IParams[]>([]); // 偏好列表
  const [ratio, setRatio] = useState<boolean>(false); // 环比按钮
  const [visibleCustom, setVisibleCustom] = useState<boolean>(false); // 自定义列是否显示
  // 高级筛选条件组
  const [screecondition, setScreecondition] = useState<AsinTable.IFiltrateList[]>([]);
  // 删除高级筛选表单值的表单
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<AsinTable.IChildResocds[]>([]);
  const [summary, setSummary] = useState<AsinTable.IChildSummaryType|null>(null);
  const [calendar, setCalendar] = useState<string>(storage.get(`${adinTableCalendar}_dc_itemKey`) || '7'); // 日历
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [order, setOrder] = useState<string>('');
  const [sort, setSort] = useState<boolean>(false);
  const [exportText, setExportText] = useState<string>('导出');
  const [update, setUpdate] = useState<string>('');
  const [calendarFlag, setCalendarFlag] = useState<boolean>(false);

  // 保存当前点击筛选的偏好ID ，删除如果是当前ID,就删除掉
  const [loadPreferenceId, setLoadPreferenceId] = useState<string>('');
  useEffect(() => {
    document.addEventListener('click', () => {
      visibleCustom ? setVisibleCustom(false) : null;
    });
  }, [visibleCustom]);

  // 首次点击高级筛选时，请求高级筛选分组数据、之后不在请求
  useEffect(() => {
    if (currentShop.id === '-1' || currentShop.sellerId === 'sellerId-1') {
      return;
    }

    if (!isGroups && visiblefiltern) {
      dispatch({
        type: 'asinTable/getChildGroups',
        payload: {
          sellerId: 'AFHAE9RJVUMB',
          marketplace: currentShop.marketplace,
          headersParams: {
            StoreId: currentShop.id,
          },
        },
      });
    }
  }, [dispatch, isGroups, visiblefiltern, currentShop]);

  // 请求列表数据
  const requestFn = useCallback((params = {}) => {
    if (currentShop.id === '-1' || currentShop.sellerId === 'sellerId-1') {
      return;
    }
    // 基础参数
    const baseParams = {
      headersParams: {
        StoreId: currentShop.id,
      },
      sellerId: currentShop.sellerId,
      marketplace: currentShop.marketplace,
      ...getCalendarFields(calendar, adinTableCalendar),
    };
    // 筛选参数
    const filtern = searchForm.getFieldsValue();
    const filternparams = {};
    // const filtrations = ['search']; // 不加入条件组
    const filtrations = ['']; // 不加入条件组
    for (const key in filtern) {
      const value = filtern[key];
      if (filtrations.indexOf(key) > -1) {
        continue;
      }
      if (value !== undefined && value !== null && value !== '' ) {
        filternparams[key] = value;
      }
    }
    // 查询参数
    const searchParams = {
      size: pageSize,
      current,
      order,
      asc: sort,
    };
    const payload = { baseParams, searchParams, filternparams };
    Object.assign(payload, params);

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'asinTable/getChildInitList',
        reject,
        resolve,
        // payload: Object.assign(childQueryParams, payload),
        payload: {
          // ...queryParams,
          ...payload.baseParams,
          ...payload.searchParams,
          ...payload.filternparams,
        },
      });
    }).then(datas => {
      setLoading(false);
      const {
        data,
      } = datas as {
        data: AsinTable.IChildAsinInitValues;
      };
      const { page } = data;
      setSummary(data.totalIndicators);
      receptionMessage(data.costAndFreightStatus === '1' ? true : false);
      setUpdate(data.updateTime);
      if (page) {
        setDataSource(page.records);
        setCurrent(page.current);
        setPageSize(page.size);
        setTotal(page.total);
        setSort(page.asc);
        setOrder(page.order);
      } else {
        setDataSource([]);
        setCurrent(1);
        setPageSize(20);
        setTotal(0);
        setSort(false);
      }
    });
  }, [dispatch, currentShop, searchForm, calendar, calendarFlag]); // eslint-disable-line
  
  // 子ASIN 子asin列表载入偏好
  const getChildPreference = useCallback(() => {
    if (currentShop.id === '-1' || currentShop.sellerId === 'sellerId-1') {
      return;
    }
    new Promise((resolve, reject) => {
      dispatch({
        type: 'asinTable/getChildPreference',
        payload: {
          headersParams: {
            StoreId: currentShop.id,
          },
          sellerId: currentShop.sellerId,
          marketplace: currentShop.marketplace,
        },
        resolve,
        reject,
      });
    }).then(datas => {
      const {
        data: {
          preferenceList,
        },
      } = datas as {
        data: {
          preferenceList: API.IParams[];
        };
      };
      setConditions(preferenceList);
    });
  }, [dispatch, currentShop]);

  useEffect(() => {
    if (tabValue === 'child') {
      requestFn();
      getChildPreference();
    }
  }, [tabValue, requestFn, getChildPreference]);

  // 搜索框
  const changeSearch = (val: string, event: any) => { // eslint-disable-line
    if (val === '' && 'button' in event && event.target.className === 'ant-input') {
      // console.log('点击删除图标不筛选');
      return;
    }
    requestFn({
      searchParams: { search: val, size: pageSize, current: 1, order: '', asc: false },
    });
  };

  // 删除单个偏好
  const delPreferential = (id: string) => {
    conditions.forEach((item, i) => {
      if (item.id === id) {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'asinTable/delPreference',
            resolve,
            reject,
            payload: {
              headersParams: {
                StoreId: currentShop.id,
              },
              sellerId: currentShop.sellerId,
              marketplace: currentShop.marketplace,
              id,
            },
          });
        }).then(datas => {
          const { message: msg } = datas as { message: string };
          if (msg === '删除成功') {
            message.success(msg);
            conditions.splice(i, 1);
            setConditions([...conditions]);

            // 当前筛选的是否是这个偏好的数据
            if (loadPreferenceId === id) {
              searchForm.resetFields();
              requestFn();
            }
          } else {
            message.error(msg);
          }
        });
      }
    });
  };

  // 删除单个条件
  const delScreeCondition = (label: string) => {
    for (let i = 0; i < screecondition.length; i++) {
      const item = screecondition[i].label;
      if (item === label) {
        screecondition.splice(i, 1);
        setScreecondition([...screecondition]);
        const field = getLabelEnglish(label);
        searchForm.resetFields([`${field}Min`, `${field}Max`]);
        requestFn();
        break;
      }
    }
  };

  // 取消高级筛选
  const cancelFiltrate = () => {
    setVisibleFiltern(false);
  };

  // 清空条件
  const delAllScreeCondition = () => {
    setScreecondition([]);
    searchForm.resetFields();
    requestFn();
  };

  /**
   * 保存偏好回调
   * @param val 偏好名称名字
   * @param data 高级筛选的表单数据
   * 返回一个Promise给ChildAsinFiltern组件， false表示条件不通过或者提交未成功
   */
  const preferentialConfirmCallback = (val: string, data: {}): Promise<boolean> => {
    let isSection = true; // 区间是否全为空
    let isReturn = true; // 条件是否通过
    
    // 最多10个
    if (conditions.length >= 10) {
      message.error('最多保存10个偏好');
      // resolve(false);
      isReturn = false;
    }

    // 是否重复
    for (let i = 0; i < conditions.length; i++) {
      const item = conditions[i];
      if (item.text === val) {
        message.error('偏好名称不能重复');
        isReturn = false;
      }
    }

    // 验证区间是否为空
    for (const key in data) {
      const item = data[key];
      if (item) {
        isSection = false;
        break;
      }
    }
    if (isSection) {
      message.error('区间不能全为空');
      isReturn = false;
    }

    if (isReturn === false) {
      return Promise.resolve(false);
    }

    return new Promise((resolve, reject) => {
      dispatch({
        type: 'asinTable/addPreference',
        resolve,
        reject,
        payload: {
          preferenceName: val,
          ...data,
          sellerId: currentShop.sellerId,
          marketplace: currentShop.marketplace,
          headersParams: {
            StoreId: currentShop.id,
          },
        },
      });
    }).then(datas => {
      const {
        message: msg,
        data,
      } = datas as {
        message: string;
        data: {
          preferenceId: string;
        };
      };

      if (msg === '保存成功') {
        message.success(msg);
        conditions.push({
          preferenceName: val,
          id: data.preferenceId,
        });
        setConditions([...conditions]);
        return Promise.resolve(true);
      }

      message.error(msg);
      return Promise.resolve(false);
    });
  };

  // 高级筛选确定按钮
  const confirmFiltrateCallback = () => {
    const data = searchForm.getFieldsValue();

    const arr = [];
    const filtrations = ['status', 'adType', 'groupId', 'search', 'independentAsin']; // 不加入条件组

    for (const key in data) {
      if (filtrations.indexOf(key) > -1) {
        continue;
      }

      const value = data[key];

      if (value !== undefined && value !== null && value !== '') {
        const str = key.slice(0, -3);
        const type = key.slice(-3);
        const item = value;
        const chineseName = getLabel(str);
        let min = '';
        let max = '';


        if (type === 'Min') {
          min = item;
        } else {
          max = item;
        }

        let isExist = false; // 是否已存在
        let esistIndex = 0; // 存在的位置
        // 查看数据是否有已保存的类目
        for (let i = 0; i < arr.length; i++) {
          const arrItem = arr[i];
          if (arrItem.label === chineseName) {
            isExist = true;
            esistIndex = i;
            break;
          }
        }

        if (isExist) {
          if (type === 'Min') {
            arr[esistIndex].min = item;
          }
          if (type === 'Max') {
            arr[esistIndex].max = item;
          }
        } else {
          const obj: AsinTable.IFiltrateList = {
            label: chineseName as string,
            min,
            max,
          };
          arr.push(obj);
        }
      }
    }
    setScreecondition([...arr]);
    setVisibleFiltern(false);
    requestFn();
  };

  // 排序
  const sortCallback = (order: string, asc: boolean) => {
    requestFn({
      searchParams: {
        order,
        asc,
        size: pageSize,
      },
    });
  };

  const pageConfig = {
    pageSizeOptions: ['20', '50', '100'],
    total,
    pageSize,
    current,
    showQuickJumper: true, // 快速跳转到某一页
    showTotal: (total: number) => `共 ${total} 个`,
    onChange(current: number, size: number | undefined) {
      setCurrent(current);
      setPageSize(size as number);
      requestFn({
        searchParams: {
          size, current, asc: sort, order,
        },
      });
    },
    showSizeChanger: true, // pageSize 切换器
    className: 'h-page-small',
  };

  const columns = childAsinCols({
    ratio, // 环比按钮
    order,
    marketplace: currentShop.marketplace,
    childCustomcol,
    sortCallback,
    site: currentShop.marketplace,
    setTabTag: setTabTag,
  });

  let count = 1;
  const tableConfig = {
    pagination: pageConfig,
    columns: columns as [],
    dataSource,
    loading,
    rowKey: () => count++,
    scroll: {
      x: 'max-content',
      y: 'calc(100vh - 328px)',
      scrollToFirstRowOnChange: true,
    },
    locale: {
      emptyText: <TableNotData hint="周期内没有数据，请重新筛选条件" />,
    },
    summary: () => <Summary 
      childCustomcol={childCustomcol} 
      data={summary} 
    />,
  };

  // 自定义列容器
  const customBox = (
    <Menu>
      <Menu.Item className="customBox">
        <CustomCol />
      </Menu.Item>
    </Menu>
  );
  
  // 点击偏好名称
  const clickPreferenceName = (id: string) => {
    setVisibleFiltern(true);
    conditions.forEach(item => {
      if (item.id === id) {
        setLoadPreferenceId(id);
        if (item.adType === null ) {
          item.adType = undefined;
        }
        searchForm.setFieldsValue(item);
        setRatio(true);
        requestFn();
      }
    });
  };
  
  const calendarChange = (selectItem: string) => {
    setCalendar(selectItem);
    setCalendarFlag(!calendarFlag);
    props.canlendarCallback(selectItem);
  };

  // 导出
  const uploadTable = () => {
    if (functionCount <= 0 ) {
      message.error(`当前会员等级本月剩余可导出：${functionCount}次`);
      return;
    }

    Modal.confirm({
      title: '本次导出将消耗1次导出次数',
      icon: null,
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk() {
        const payload = {
          headersParams: {
            StoreId: currentShop.id,
          },
          current,
          size: pageSize,
          sellerId: currentShop.sellerId,
          marketplace: currentShop.marketplace,
          search: searchForm.getFieldValue(['search']),
          ...getCalendarFields(calendar, adinTableCalendar),
          ...searchForm.getFieldsValue(),
        };
    
        setExportText('正在导出');
        new Promise((resolve, reject) => {
          dispatch({
            type: 'asinTable/exportChildTable',
            payload,
            reject,
            resolve,
          });
        }).then(datas => {
          const { type, message: msg } = datas as {
            type: string;
            message: string;
          };
          // 返回的是blob的数据格式，如果格式不是application/octet-stream 的话，就证明导出失败了
          setExportText('导出');
          if (!type || type !== 'application/octet-stream') {
            message.error(msg || '导出失败！');
            return;
          }
          
          dispatch({
            type: 'user/updateMemberFunctionalSurplus',
            payload: {
              functionName: 'ASIN报表导出',
            },
          });
          
          const content = datas as BlobPart;
          const blob = new Blob([content], {
            type: 'application/octet-stream;charset=utf-8',
          });
          const {
            startDate,
            endDate,
          } = storage.get(`${adinTableCalendar}_dc_dateRange`);
          const fileName = `${currentShop.storeName}__${startDate}__${endDate}.xlsx`;
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
          
        }).catch(err => {
          console.error(err);
          message.error('导出失败！');
          setExportText('导出失败');
        });
      },
    });
  };

  return <div className={styles.childAsin}>
    <div className={`${commonStyles.search} clearfix`}>
      <Update update={update} style={{
        position: 'absolute',
        right: 0,
        top: -33,
      }}/>
      <Form form={searchForm} style={{
        'float': 'left',
      }}>
        <Form.Item name="search" className={commonStyles.searchInput}>
          <Input.Search
            allowClear
            className="h-search"
            placeholder="输入标题、ASIN、SKU"
            style={{
              'float': 'left',
            }}
            enterButton={<Iconfont type="icon-sousuo" />}
            onSearch={changeSearch}
            autoComplete="off"
          />
        </Form.Item>
      </Form>

      <Button className={commonStyles.filternBtn}
        onClick={() => setVisibleFiltern(!visiblefiltern)}
      >
        高级筛选
        <DownOutlined className={`${commonStyles.arrowIcon} ${visiblefiltern ? commonStyles.active : ''}`} />
      </Button>
      <div className={commonStyles.conditions}>
        <span className={commonStyles.nameText} style={{
          display: conditions.length ? 'inline-block' : 'none',
        }}>一键筛选：</span>
        {
          conditions.map((item, i) => {
            return <div key={i} data-id={item.id} className={commonStyles.condition}>
              <span
                className={commonStyles.text} 
                title={item.preferenceName} 
                onClick={() => clickPreferenceName(item.id)}
              >
                {item.preferenceName}
              </span>
              <span
                className={commonStyles.closeIcon}
                title="点击删除"
                onClick={() => delPreferential(item.id)}
              >
                <Iconfont type="icon-close" />
              </span>
            </div>;
          })
        }
      </div>

      <div className={commonStyles.rightLayout}>
        <Message
          clickmessageIcon={clickmessageIcon}
          visible={visible}
          setMessagedata={setMessagedata}
          messagedata={messagedata}
          setMessageProfit={setMessageProfit}
          messageprofit={messageprofit}
          setMessageAd={setMessageAd}
          messagead={messagead}
          isShow={isShow}
          messageLength={messageLength}
          marginRight={19}
        />
        <div className={commonStyles.ratioSwitch}>
          <span className={commonStyles.text}>环比：</span>
          <Switch
            className="h-switch" checked={ratio}
            onChange={() => setRatio(!ratio)}
          />
        </div>
        <div className={commonStyles.calendar}>
          <DefinedCalendar 
            itemKey={calendar} 
            storageKey={adinTableCalendar} 
            index={1}
            change={({ selectItemKey }) => calendarChange(selectItemKey)}
            style={{
              width: 280,
            }} />
        </div>
        <Button style={{
          width: 82,
        }} onClick={uploadTable}>{exportText}</Button>
        <div className="customBox" style={{
          position: 'relative',
        }}>
          <Dropdown overlay={customBox} trigger={['click']}
            getPopupContainer={() => document.querySelector('.customBox') as HTMLElement}
            visible={visibleCustom}
            placement="bottomLeft"
          >
            <Button onClick={(e) => {
              setVisibleCustom(!visibleCustom);
              e.nativeEvent.stopImmediatePropagation();
            }}>
              自定义列
              <DownOutlined
                className={`
                  ${visibleCustom ? commonStyles.active : ''}
                  ${commonStyles.downArrow}
                `}
              />
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>

    {/* 条件组 */}
    <div className={
      classnames(
        commonStyles.conditionBox,
        visiblefiltern ? 'none' : '',
        screecondition.length ? '' : 'none',
      )
    }>
      {
        screecondition.map((item, i: number) => {
          return <div key={i} className={commonStyles.conditionItem} >
            <span className={commonStyles.textName}>{item.label}：</span>
            <span className={commonStyles.min}>
              {
                item.min
                ||
                <span className={classnames(commonStyles.emptyLine, commonStyles.left)}></span>
              }
            </span>
            <span className={commonStyles.line}> - </span>
            <span className={commonStyles.max}>
              {
                item.max
                ||
                <span className={classnames(commonStyles.emptyLine, commonStyles.rgiht)}></span>
              }
            </span>
            <span
              className={commonStyles.close}
              onClick={() => delScreeCondition(item.label)}
              title="删除条件"
            >
              <CloseOutlined />
            </span>
          </div>;
        })
      }
      <span
        className={commonStyles.clearAll}
        onClick={delAllScreeCondition}
        title="删除所有条件"
      >清空条件</span>
    </div>

    {/* 高级筛选 */}
    <div className={commonStyles.filtern} style={{
      display: visiblefiltern ? 'block' : 'none',
    }}>
      <Filtern
        preferentialConfirmCallback={preferentialConfirmCallback}
        cancelFiltrate={cancelFiltrate}
        confirmFiltrateCallback={confirmFiltrateCallback}
        form={searchForm}
      />
    </div>

    <div className={styles.table}>
      <Table {...tableConfig} />
    </div>
  </div>;
};

export default ChildAsin;
