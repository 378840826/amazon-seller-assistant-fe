import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Input, Form, Modal, Radio, Popconfirm, message, Select, Divider } from 'antd';
import { useDispatch } from 'umi';
import { strToMoneyStr, strToUnsignedIntStr } from '@/utils/utils';

const { Item } = Form;
const { Option } = Select;

interface IProps {
  onCancel: () => void;
  userList: Array<API.IUserList>;
  addSupplierSuccess: () => void ;
}


const AddSupplier: React.FC<IProps> = props => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const { onCancel, userList, addSupplierSuccess } = props;
  const [isAddCollection, setIsAddCollection] = useState<boolean>(false);
  const [isAddWord, setIsAddWord] = useState<boolean>(false);
  const [buyerNameValue, setBuyerNameValue] = useState<string>('');
  const [usersList, setUsersList] = useState<string[]>([]);

  //是否月结
  const [isPayByMonthly, setIsPayMonthly] = useState<string>('now');
  //初始化值
  useEffect(() => {
    userList.map(item => {
      usersList.push(item.username);
      setUsersList([...usersList]);
    });  
  }, []);//eslint-disable-line react-hooks/exhaustive-deps

  const initialValues = {
    buyerName: userList[0].username,
    settlementType: 'now',
    state: 'enabled',
    collectionCreateQos: [{
      name: '',
      bankName: '',
      bankAccount: '',
    }],
  };

  //自定义采购员
  const onbuyerNameChange = (event: any) => { // eslint-disable-line
    setBuyerNameValue(event.target.value);
  };

  const addbuyerNameItem = () => {
    if (!buyerNameValue) {
      message.error('请填写采购员');
      return;
    }
    usersList.unshift(buyerNameValue);
    setUsersList([...usersList]);
    setBuyerNameValue('');
  };

  //添加供应商表单改变
  const modalFormChange = () => {
    const formdata = form.getFieldsValue();
    setIsPayMonthly(formdata.settlementType);
   
    formdata.collectionCreateQos.some((item: any) => {// eslint-disable-line
      const flag = false;
      for (const key in item) {        
        if (item[key]) {
          return true;
        }
      }
      return flag;
    }) ? setIsAddWord(true) : setIsAddWord(false);
  };
  
  //清空两端空格
  const removeSpace = function(val: string){
    const newValue = val.replace(/(^\s*)|(\s*$)/g, '');
    return newValue ? String(newValue) : '';   
  };
  
 
  //确定添加
  const modalOnOk = () => {

    const data = form.getFieldsValue(); 

    //给采购员idbuyerId找出来
    /** const index = userList.findIndex(item => item.username === data.buyerName);
    data.buyerId = userList[index].id;
    */


    //先出一系列的判断 
    const emptys = [undefined, null, ''];
    const phonereg = /^\d{11}$/;
    const qqreg = /^[1-9][0-9]{5,10}$/;
    const emailreg = /^\s*([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+\s*/;
    const wechatreg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/;
    if (!data.name) {
      message.error('供应商名称不能为空');
      return;
    }
    if (emptys.includes(data.contactsName)){
      message.error('联系人不能为空');
      return;
    }

    if (
      data.settlementType === 'after'
      && (emptys.includes(data.cyclePay) || emptys.includes(data.dayPay))
    ) {
      message.error('结算周期和结算日不能为空');
      return;
    }

    if (data.settlementType === 'now' && emptys.includes(data.proportionPay)) {
      message.error('预付比例不能为空');
      return;
    }

    //长度判断
    if ( data.name.length >= 40 || data.contactsName.length >= 40){
      message.error('供应商名称和联系人字符长度不超过40');
      return;
    }
    

    //1-31号判断
    if (data.cyclePay < 1 || data.cyclePay > 2000) {
      message.error('供应商结算周期在1-2000之间');
      return;
    }

    if (data.dayPay < 1 || data.dayPay > 31) {
      message.error('结算日在1-31号之间');
      return;
    }
    if (data.proportionPay < 0 || data.proportionPay > 100) {
      message.error('预付比例在0-100%之间');
      return;
    }

    //格式验证
    if (data.contactsPhone && !phonereg.test(data.contactsPhone) ){
      message.error('请正确填写联系电话格式');
      return;
    }
    if (data.qq && !qqreg.test(data.qq) ){
      message.error('请正确填写 QQ格式');
      return;
    }
    if (data.email && !emailreg.test(data.email) ){
      message.error('请正确填写邮箱格式');
      return;
    }
    if (data.wechat && !wechatreg.test(data.wechat) ){
      message.error('请正确填写微信格式');
      return;
    }


    new Promise((resolve, reject) => {
      dispatch({
        type: 'supplier/addSupplier',
        payload: data,
        resolve,
        reject,
      });    
    }).then( datas => {
      const { 
        code, 
        message: msg,
      } = datas as Global.IBaseResponse;
      if (code === 200){
        message.success(msg);
        addSupplierSuccess();
        return;
      }
      message.error(msg);
    });
  };

  const proportionPayLimit = (value: string) => {
    return strToMoneyStr(value); 
  };

  //限制1-31的纯数字
  const cyclePayLimit = function(_: any, value: string) {// eslint-disable-line
    if (Number(value) < 1 || Number(value) > 2000) {
      return Promise.reject('请输入1-2000的纯数字');
    }
    return Promise.resolve();
  };

  const payDayLimit = function(_: any, value: string) {// eslint-disable-line
    if (Number(value) < 1 || Number(value) > 31) {
      return Promise.reject('请输入1-31的纯数字');
    }
    return Promise.resolve();
  };

  const proPortionPayLimit = function(_: any, value: string) {// eslint-disable-line
    if (Number(value) < 0 || Number(value) > 100) {
      return Promise.reject('预付比例最大为100%');
    }
    return Promise.resolve();
  };

  return <Modal
    visible
    mask={true} 
    centered 
    width={1300}
    onCancel={onCancel}
    onOk={modalOnOk}
    className={styles.modal}
    okText="保存"
  >
    <div className={styles.title}>供应商详情</div>
    <Form
      name="form"
      form={form}      
      onValuesChange={modalFormChange}
      initialValues={initialValues}
    >
      <p>基本信息</p>
      <div className={styles.flex}>
        <div className={styles.singleItem}>
          <span className={styles.leftspan}>供应商名称：
            <span className={styles.icon}>*</span></span>
          <Item name="name" normalize={removeSpace} rules={[{
            required: true,
            message: '供应商名称长度不能为空',
          }, {
            max: 40,
            message: '供应商名称长度不超过40',
          }]}>
            <Input/>           
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.centerspan}>采购员：
            <span className={styles.icon}>*</span></span>
          <Item name="buyerName">
            <Select 
              className={styles.searchList}
              dropdownRender={menu => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                    <Input style={{ flex: 'auto' }} value={buyerNameValue} onChange={onbuyerNameChange} placeholder="请输入采购员名称"/>
                    <a
                      style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                      onClick={addbuyerNameItem}
                    >
                       添加
                    </a>
                  </div>
                </div>
              )}
            >
              {
                usersList.map((item, index) => {
                  return <Option value={item} key={index}>{item}</Option>;
                })
              }      
            </Select>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span style={{ width: 55, marginLeft: 90 }}>状态：
            <span className={styles.icon}>*</span></span>
          <Item name="state">
            <Radio.Group>
              <Radio value={'enabled'}>启用</Radio>
              <Radio value={'paused'}>停用</Radio>
            </Radio.Group>
          </Item>             
        </div>
        <div className={styles.singleItem}>
          <span className={styles.leftspan}>联系人：
            <span className={styles.icon}>*</span></span>
          <Item name="contactsName" normalize={removeSpace} rules={[{
            required: true,
            message: '联系人不能为空',
          }, {
            max: 40,
            message: '联系人长度不超过40',
          }]}>
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.centerspan}>联系电话：</span>
          <Item name="contactsPhone" normalize={removeSpace} rules={[{
            pattern: /^\d{11}$/,
            message: '请输入正确格式的联系电话',
          }]}>
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.rightspan}>邮箱：</span>
          <Item name="email" normalize={removeSpace} rules={[{
            pattern: /^\s*([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+\s*/,
            message: '请输入正确格式的邮箱',
          }]}>
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.leftspan}>QQ：</span>
          <Item name="qq" normalize={removeSpace} rules={[{
            pattern: /^[1-9][0-9]{5,10}$/,
            message: '请输入正确格式的QQ号',
          }]}>
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.centerspan}>微信：</span>
          <Item name="wechat" normalize={removeSpace} rules={[{
            pattern: /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/,
            message: '请输入正确格式的微信号',
          }]}>
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.rightspan}>传真：</span>
          <Item name="fax" normalize={removeSpace}>
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.leftspan}>地址：</span>
          <Item name="addressLine1" normalize={removeSpace}>
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.centerspan}>备注：</span>
          <Item name="remarkText" normalize={removeSpace}>
            <Input/>
          </Item>
        </div>          
      </div>
      <p>结算信息</p>
      <div className={styles.flex}>
        <span className={styles.leftspan}>结算方式：
          <span className={styles.icon}>*</span></span>
        <Item name="settlementType">
          <Radio.Group>
            <Radio value="now">现结</Radio>
            <Radio value="after">月结</Radio>
          </Radio.Group>
        </Item>
      </div>
      {
        isPayByMonthly === 'after' ? <>
          <div className={styles.flex}>
            <span className={styles.paymentspan}>结算周期：
              <span className={styles.icon}>*</span></span>
            <Item name="cyclePay" normalize={strToUnsignedIntStr} rules={[{
              required: true,
              message: '请输入结算周期',
            }, {
              validator: cyclePayLimit,
            }]}>
              <Input suffix="天"/>
            </Item>               
          </div>
          <div className={styles.flex}>
            <span className={styles.paymentspan}>结算日：
              <span className={styles.icon}>*</span>
            </span>
            <Item name="dayPay" normalize={strToUnsignedIntStr} rules={[{
              required: true,
              message: '请输入结算日',
            }, {
              validator: payDayLimit,
            }]}>
              <Input placeholder="1-31号" style={{ width: 250 }} />
            </Item> 
          </div>
        </> : 
          <div className={styles.flex}>
            <span className={styles.paymentspan}>
              预付比例：                
              <span className={styles.icon}>*</span>
            </span>
            <Item name="proportionPay" normalize={proportionPayLimit} rules={[{
              required: true,
              message: '请输入预付比例',
            }, {
              validator: proPortionPayLimit,
            }]}>
              <Input suffix="%" />
            </Item>               
          </div>
      }
      <p>收款信息</p>
      <Form.List
        name="collectionCreateQos">
        {(fields, { add, remove }) => (
          <>
            {
              fields.map((field, index) => {
                return (
                  <div key={index} className={styles.flex}>
                    <div className={styles.flex} style={{ width: 390 }}>
                      <span className={styles.numspan}>{index + 1}.</span>
                      <span style={{ width: 56 }}>收款方：</span>
                      <Item name={[index, 'name']} normalize={removeSpace}>
                        <Input style={{ width: 250 }}/>
                      </Item>
                    </div>
                    <div className={styles.flex} style={{ width: 405 }}>
                      <span style={{ width: 110 }}>银行/机构名称：</span>
                      <Item name={[index, 'bankName']} normalize={removeSpace}>
                        <Input style={{ width: 250 }}/>
                      </Item>
                    </div>
                    <div className={styles.flex} >
                      <span style={{ width: 110 }}>银行/收款账号: </span>
                      <Item name={[index, 'bankAccount']} normalize={removeSpace}>
                        <Input style={{ width: 250 }}/>
                      </Item>
                      {
                        fields.length >= 2 ? 
                          <span 
                            className={styles.delespan} 
                            onClick={ () => remove(index)}
                          >删除</span>
                          : ''
                      }
                      {
                        index === fields.length - 1 && isAddWord &&
                          <> 
                            <span 
                              className={styles.addspan} 
                              onClick={() => {
                                //判断是否能增加
                                if (fields.length >= 5){
                                  setIsAddCollection(true);
                                  return;
                                }
                                add();
                              }}>添加</span>
                            <Popconfirm
                              title="已超过5个，不能继续添加"
                              visible={isAddCollection}
                              onCancel={ () => setIsAddCollection(false) }
                              onConfirm={() => setIsAddCollection(false) }
                            />
                          </>
                      }
                    </div>             
                  </div>
                );
              })
            }
          </>
        )}                    
      </Form.List>
    </Form>
  </Modal>;
};

export default AddSupplier;
