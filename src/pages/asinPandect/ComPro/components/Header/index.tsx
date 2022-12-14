import React, { useState, useEffect, ReactText, useRef } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { toUrl } from '@/utils/utils';
import { IConnectState, IConnectProps } from '@/models/connect';
import CustomList from '../CustomList';
import AddFilter from '../AddFilter';
import { initial } from '../../../models/comPro';
import SeniorFilter from '../SeniorFilter';
import { Input,
  Button, 
  Form, 
  Row, 
  Col,
  Radio,
  Dropdown,
  message,
} from 'antd';
import { Iconfont } from '@/utils/utils';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { RadioChangeEvent } from 'antd/lib/radio';
const { Search } = Input;

const switchList = [
  { value: 'all', name: '不限' },
  { value: true, name: '开启' },
  { value: false, name: '暂停' },
];
interface IHeader extends IConnectProps{
  currentShop: API.IParams;
  tableLoading: boolean;
  send: API.IParams;
  selectedRows: ReactText[];
  asin: string;
}
// const ForwardChild = forwardRef(SeniorFilter);

const Header: React.FC<IHeader> = ({ 
  dispatch, 
  currentShop,
  tableLoading,
  send,
  selectedRows,
  asin }) => {
  const searchTerms = send.searchTerms;
  const switchStatus = send.switchStatus;
  const { id: StoreId, storeName, marketplace } = currentShop;
  const [form] = Form.useForm();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childRef = useRef<any>(null);
  const [state, setState] = useState({
    filterOpen: false, //高级筛选是否打开
    addOpen: false, //添加竞品是否打开
    customOpen: false, //自定义列是否打开
    freOpen: false, //频率监控是否打开
    frequency: 1, //频率
    downLoading: false, //导出是否loading
  });

  useEffect(() => {
    setState((state) => ({
      ...state,
      filterOpen: false,
      addOpen: false,
      customOpen: false,
      freOpen: false,
    }));
  }, [StoreId]);

  useEffect(() => {
    dispatch({
      type: 'comPro/cpMsFrequency',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
        },
      },
      callback: (frequency: number) => {
        setState((state) => ({
          ...state,
          frequency,
        }));
      },
    });
  }, [dispatch, StoreId]);

  const toggleEvent = (key: string) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calc = (state: any) => {
      const obj = { ...state, [key]: !state[key] };
      if (key === 'filterOpen') {
        Object.assign(obj, { 'addOpen': false });
      }
      if (key === 'addOpen') {
        Object.assign(obj, { 'filterOpen': false });
      }
      return obj;
    };
    setState((state) => ({
      ...(calc(state)),
    }));
  };

  useEffect(() => {
    dispatch({
      type: 'comPro/updateSelected',
      payload: [],
    });
  }, [state.addOpen, dispatch]);
 
  const onMenuFinish = (value: {frequency: number}) => {
    dispatch({
      type: 'comPro/cpMsFreUpdate',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
        },
        params: value,
      },
      callback: () => {
        setState((state) => ({
          ...state,
          frequency: value.frequency,
          freOpen: false,
        }));
      },
    });
  };
  //搜索
  const onSearch = (value: string) => {
    value = value.trim();
    if (value === searchTerms) {
      return; 
    }
    childRef.current?.clear();
    dispatch({
      type: 'comPro/updateSend',
      payload: {
        ...initial,
        searchTerms: value,
        switchStatus: send.switchStatus,
      },
    });

  };
 
  //单选框开关切换
  const changeCheckbox = (e: RadioChangeEvent) => {
    const value = e.target.value;
    childRef.current?.clear();
    dispatch({
      type: 'comPro/updateSend',
      payload: {
        ...initial,
        searchTerms: send.searchTerms,
        switchStatus: value,
      },
    });
  };
 
  const tableExport = () => {
    setState((state) => ({
      ...state,
      downLoading: true,
    }));
    
    fetch(`/api/mws/competitive-products/monitoring-settings/export${toUrl({
      size: send.size,
      current: send.current,
      order: send.order,
      asc: send.asc,
    })}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'StoreId': StoreId,
      },
      body: JSON.stringify({
        searchTerms: send.searchTerms, 
        switchStatus: send.switchStatus,
        acKeywordStatus: send.acKeywordStatus,
        deliveryMethod: send.deliveryMethod,
        dateStart: send.dateStart,
        dateEnd: send.dateEnd,
        scopeMin: send.scopeMin,
        scopeMax: send.scopeMax,
        reviewsCountMin: send.reviewsCountMin,
        reviewsCountMax: send.reviewsCountMax,
        priceMin: send.priceMin,
        priceMax: send.priceMax,
        sellerNumMin: send.sellerNumMin,
        sellerNumMax: send.sellerNumMax,
        variantNumMin: send.variantNumMin,
        variantNumMax: send.variantNumMax,
        rankingMin: send.rankingMin,
        rankingMax: send.rankingMax,
        asin,
        ids: selectedRows,
      }),
    }).then( response => {
      if (response.ok){
        return response.blob();
      }
      throw new Error('导出失败，请稍后再试！');
    }).then(data => {
      const blobUrl = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      //站点_店铺名称_B01YQEWRQ竞品
      a.download = `${marketplace}_${storeName}_${asin}竞品.xlsx`;
      a.href = blobUrl;
      a.click();
    }).catch( err => {
      message.error(err);
    }).finally(() => {
      setState((state) => ({
        ...state,
        downLoading: false,
      }));
    });
  };
  const FreMenu = (
    <>
      {state.freOpen ? <div className={styles.menu}>
        <Form name="form"
          onFinish={onMenuFinish}
          initialValues={{
            frequency: state.frequency,
          }}
        >
          <Form.Item name="frequency">
            <Radio.Group className={styles.__radio_group}>
              <Radio value={1}>每天1次</Radio>
              <Radio value={3}>每3天1次</Radio>
              <Radio className={styles.__radio7} value={7}>每7天1次</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <div className={styles.two_btn}>
              <Button onClick={() => toggleEvent('freOpen')}>取消</Button>
              <Button 
                className={styles.save_btn} 
                type="primary"
                htmlType="submit"
              >保存</Button>
            </div>
          </Form.Item>
        </Form>
      </div> : ''}
    </>
  );
  return (
    <div className={styles.header_container}>
      <div className={styles.header_container_first}>
        <Form
          form={form}
          className={styles.rule_form}
          initialValues={{
            ['switchStatus']: switchStatus,
            ['searchTerms']: searchTerms,
          }}
        >
          <Row>
            <Col flex="850px">
              <Row gutter={20}>
                <Col>
                  <Form.Item 
                    name="searchTerms"
                    className={styles.search_container}
                    label=""
                    required={false}
                  >
                    <Search 
                      size="middle"
                      allowClear
                      className="__search_input"
                      placeholder="输入标题、ASIN、品牌或卖家名称" 
                      onSearch={(value, event) => {
                        if (!event?.['__proto__']?.type){
                          onSearch(value);
                        }
                      }}
                      disabled={tableLoading}
                      enterButton={<Iconfont type="icon-sousuo" className={styles.icon_sousuo}/>} />
                  </Form.Item>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => toggleEvent('filterOpen')}>
                    高级筛选
                    {state.filterOpen ? <UpOutlined style={{ fontSize: '12px' }}/> : <DownOutlined style={{ fontSize: '12px' }} />}
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => toggleEvent('addOpen')}>
                    添加竞品
                    {state.addOpen ? <UpOutlined style={{ fontSize: '12px' }}/> : <DownOutlined style={{ fontSize: '12px' }} />}
                  </Button>
                </Col>
                <Col>
                  <Form.Item name="switchStatus" label="开关">
                    <Radio.Group onChange={changeCheckbox}>
                      {
                        switchList.map((item, index) => {
                          return (
                            <Radio value={item.value} key={index}>{item.name}</Radio>
                          );
                        })
                      }
                    </Radio.Group>  
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col flex="auto">
              <div className={styles.button_three}>
                <Dropdown
                  overlay={FreMenu}
                  placement="bottomRight"
                  trigger={['click']}
                  visible={state.freOpen}
                  onVisibleChange={() => toggleEvent('freOpen')}
                >
                  <Button>监控频率设定</Button>
                </Dropdown>
                
                <Button 
                  disabled={state.downLoading}
                  onClick={() => tableExport()}
                  className={styles.export}>
                  导出
                </Button>
                <CustomList 
                  customOpen={state.customOpen}
                  toggleEvent={toggleEvent}
                />
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <SeniorFilter
        ref ={childRef} 
        open={state.filterOpen} 
        tableLoading={tableLoading}
        toggleEvent={() => toggleEvent('filterOpen')}/>
      {state.addOpen ? <AddFilter 
        toggleEvent={() => toggleEvent('addOpen')}/> : ''}
      
    </div>
  );
};
export default connect(({ global, comPro, asinGlobal }: IConnectState) => ({
  currentShop: global.shop.current,
  send: comPro.send,
  selectedRows: comPro.selectedRows,
  asin: asinGlobal.asin,
}))(Header);
