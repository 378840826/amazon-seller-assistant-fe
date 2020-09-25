import React, { useEffect, useState } from 'react';
import { useDispatch } from 'umi';
import moment from 'moment';
import { 
  Form,
  Input,
  Checkbox,
  Select,
  Button,
  Row,
  Col,
  Radio,
  TimePicker,
  Spin,
  message,
  Tooltip,
} from 'antd';
import styles from './index.less';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { Iconfont } from '@/utils/utils';
interface IOverlay{
  id: number;
  StoreId: string;
  onCancel: () => void;
  onSave: () => void;
}
const { TextArea } = Input;
const { RangePicker } = TimePicker;
const { Option } = Select;
const orderStateList = [
  { name: 'Shipped', value: '配送完成后' },
  { name: 'Shipping', value: '发货后' },
  { name: 'Unshipped', value: '下单后' },
];

const formItemLayout = {
  labelCol: { span: 3, offset: 0 },
  wrapperCol: { span: 8, offset: 0 },
};

const rangeItemLayout = {
  labelCol: { span: 3, offset: 0 },
  wrapperCol: { span: 21, offset: 0 },
};

const templateItemLayout = {
  labelCol: { span: 3, offset: 0 },
  wrapperCol: { span: 21, offset: 0 },
};

const limitItemLayout = {
  labelCol: { span: 5, offset: 0 },
  wrapperCol: { span: 10, offset: 0 },
};
const dayList = [1, 2, 3, 4, 5, 6, 7, 10, 14, 30];

const defaultState = {
  message: '', //接口返回的错误信息
  ruleName: '',
  orderStatus: 'Shipped', //默认配送完成后
  timeNumber: 3, //默认时间天数3
  start: '09',
  end: '21',
  id: -1,
  templateList: [],
  sendingStatus: 'notSending', //默认不再发送
  skuStatus: 'exclude', //默认为排除
  skuList: [],
};

const Overlay: React.FC<IOverlay> = ({ StoreId, id, onCancel, onSave }) => {
  const [state, setState] = useState<API.IParams>(defaultState);
  const [loading, setLoading] = useState(true);//打开弹框加载的loading
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'mail/addOrUpdateRule',
      payload: {
        StoreId,
        id,
      },
      callback: (res: { code: number; data: API.IParams; message: string }) => {
        const { code, data } = res;
        if (code === 200){
          if (id === -1){
            setState((state) => ({
              ...state,
              ...defaultState,
              templateList: data,
            }));
          } else {
            setState((state) => ({
              ...state,
              ...defaultState,
              ...data,
            }));
          }
        } else {
          setState((state) => ({
            ...state,
            ...defaultState,
            message: res.message,
          }));
        }
        setLoading(false); 
      },
    });
  
  }, [StoreId, dispatch, id]);

  const onChange = (values: CheckboxValueType[]) => { //values获取到的是templateId
    if (values.length > 2){
      values.shift();
    }
    const lists = state.templateList;
    lists.map((item: API.IParams) => {
      if (values.indexOf(item.templateId) > -1){
        item.templateStatus = true;
      } else {
        item.templateStatus = false;
      }
    });
    setState((state) => ({
      ...state,
      templateList: lists,
    }));
  };
  
  const getCheckedList = () => {
    return state.templateList.filter((item: API.IParams) => item.templateStatus === true)
      .map((item: API.IParams) => item.templateId); 
  };

  const onFinish = (values: API.IParams) => {
    console.log('values:', values);
    const { rangeTime, skuList } = values;
    const start = Number(rangeTime[0].format('HH'));
    const end = Number(rangeTime[1].format('HH')); 
    const split = skuList.split(/\n|\r\n/);
    const trim = split.map((item: string) => item.trim()).filter((item: string) => item !== '');
    const params = {
      ruleName: values.ruleName.trim(),
      orderStatus: values.orderStatus,
      timeNumber: values.timeNumber,
      start,
      end,
      templateList: values.templateList.map((item: CheckboxValueType) => Number(item)),
      sendingStatus: values.sendingStatus,
      skuStatus: values.skuStatus,
      skuList: trim,
    };
    setConfirmLoading(true);
    dispatch({
      type: 'mail/saveUpdateOrAddRule',
      payload: {
        StoreId,
        id,
        params,
      },
      callback: (res: {code: number; message: string}) => {
        onCancel();
        setConfirmLoading(false);
        if (res.code === 200){
          onSave();
        } else {
          message.error(res.message);
        }
      },
    });
  };
  return (
    <div>
      {loading && <Spin/>}
      {!loading && 
        <Form
          name="rule_form"
          className={styles.rule_form}
          onFinish ={onFinish}
          initialValues={{
            ['ruleName']: state.ruleName,
            ['orderStatus']: state.orderStatus,
            ['timeNumber']: state.timeNumber,
            ['templateList']: getCheckedList(),
            ['rangeTime']: [moment(state.start, 'HH'), moment(state.end, 'HH')],
            ['sendingStatus']: state.sendingStatus,
            ['skuStatus']: state.skuStatus,
            ['skuList']: state.skuList.join('\n'),
          }}
        >
          <Form.Item 
            name="ruleName"
            label="规则名称"
            required={false}
            {...formItemLayout}
            rules={[{ required: true, message: '规则名称不能为空!' }]}
          >
            <Input placeholder="" maxLength={10}/>
          </Form.Item>
          <Form.Item 
            label="触发时间"
            {...rangeItemLayout}
          >
            <Row gutter={10}>
              <Col span={7}>
                <Form.Item name="orderStatus">
                  <Select
                  >
                    {orderStateList.map((item) => {
                      return (
                        <Option key={item.name} value={item.name}>{item.value}</Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="timeNumber">
                  <Select>
                    {dayList.map((item) => {
                      return (
                        <Option key={item} value={item}>{item}天</Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="rangeTime">
                  <RangePicker
                    format="HH"
                  />
                </Form.Item>
              </Col>
              <Col span={1} style={{ lineHeight: '30px' }}>
                <Tooltip placement="top" title="采用站点当地的时间，建议在下单高峰期发送">
                  <Iconfont type="icon-yiwen" style={{ cursor: 'pointer' }}/>
                </Tooltip>
                
              </Col>
            </Row>
          </Form.Item>
          <Form.Item 
            label="模板"
            name="templateList"
            required={false}
            {...templateItemLayout}
            rules={[{ required: true, message: '模板不能为空!' }]}
          >
            <Checkbox.Group 
              className={styles.__checkbox}
              value={getCheckedList()}
              onChange={onChange}
            >
              <Row>
                {state.templateList.map((item: API.IParams, index: number) => {
                  return (
                    <Col span={8} key={index}>
                      <Checkbox value={item.templateId}>{item.templateName}</Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            label="若亚马逊邮件被客户退订导致发送失败"
            name="sendingStatus"
          >
            <Radio.Group>
              <Row>
                <Col span={12}>
                  <Radio value="notSending">不再发送剩余模板</Radio>
                </Col>
                <Col span={12}>
                  <Radio value="continueSending">继续发送剩余模板</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...limitItemLayout} label="排除/限定SKU" name="skuStatus">
            <Radio.Group>
              <Radio value="exclude">排除SKU</Radio>
              <Radio value="restrict">限定SKU</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="skuList">
            <TextArea
              rows={5}
              placeholder="请输入SKU，一行一个"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }} 
            labelCol={{ span: 0 }} wrapperCol={{ span: 12, offset: 0 }}>
            <Button htmlType="button" disabled={confirmLoading} onClick={() => onCancel()}>
          取消
            </Button>
            <Button type="primary" disabled={confirmLoading} htmlType="submit">
          保存
            </Button>
          </Form.Item>
        </Form>
      }
    </div>
  );
};
export default Overlay;
