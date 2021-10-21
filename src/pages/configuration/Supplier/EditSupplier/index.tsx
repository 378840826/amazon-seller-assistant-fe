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
  editSupplierSuccess: () => void;
  initdata: Supplier.ISupplierList | null;
}

const EditSupplier: React.FC<IProps> = props => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const { onCancel, userList, editSupplierSuccess, initdata } = props;

  const { settlementType, collectionCreateQos } = initdata as Supplier.ISupplierList;
  const [isAddCollection, setIsAddCollection] = useState<boolean>(false);
  //是否有标签字样
  const [isAddWord, setIsAddWord] = useState<boolean>(false);

  //是否月结
  const [isPayByMonthly, setIsPayMonthly] = useState<string>('now');

  const [buyerNameValue, setBuyerNameValue] = useState<string>('');
  const [usersList, setUsersList] = useState<string[]>([]);

  //初始化一些数据
  useEffect(() => {
    //是否月结
    setIsPayMonthly(settlementType);

    if (collectionCreateQos.length <= 0) {
      form.setFieldsValue({ collectionCreateQos: [{
        name: '',
        bankName: '',
        bankAccount: '',
      }],
      });
    }
    //判断一下是否有增加字样
    initdata?.collectionCreateQos.some((item: any) => {// eslint-disable-line
      const flag = false;
      for (const key in item) {        
        if (item[key]) {
          return true;
        }
      }
      return flag;
    }) ? setIsAddWord(true) : setIsAddWord(false);

    userList.map(item => {
      usersList.push(item.username);
      setUsersList([...usersList]);
    });

  }, []);//eslint-disable-line react-hooks/exhaustive-deps
  
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

  //自定义采购员
  const onbuyerNameChange = (event: any) => { // eslint-disable-line
    setBuyerNameValue(event.target.value);
  };

  const addbuyerNameItem = () => {
    usersList.unshift(buyerNameValue);
    setUsersList([...usersList]);
    setBuyerNameValue('');
  };


  //确定添加
  const modalOnOk = () => {

    const data = form.getFieldsValue();

    //给采购员idbuyerId找出来
    /**
    const index = userList.findIndex(item => item.username === data.buyerName);
    data.buyerId = userList[index].id;
    */

    //给id找出来
    data.id = initdata?.id;

    
    //先出一系列的判断 
    const emptys = [undefined, null, ''];
    if (!data.name) {
      message.error('供应商名称不能为空');
      return;
    }
    if (
      emptys.includes(data.contactsName)
      || emptys.includes(data.buyerName)
      || emptys.includes(data.settlementType)
    ){
      message.error('请正确填写供应商基本信息');
      return;
    }

    if (
      data.settlementType === 'after'
      && (emptys.includes(data.cyclePay) || emptys.includes(data.dayPay))
    ) {
      message.error('请正确填写供应商结算信息');
      return;
    }

    if (data.settlementType === 'now' && emptys.includes(data.proportionPay)) {
      message.error('请正确填写供应商结算信息');
      return;
    }

    //长度判断
    
    if ( data.name.length >= 40 || data.contactsName.length >= 40){
      message.error('请正确填写供应商信息长度');
      return;
    }
    
    if (data.contactsPhone && data.contactsPhone.length > 11 ){
      message.error('请正确填写联系人电话');
      return;
    }
    
    //1-31号判断
    if (data.cyclePay < 1 || data.cyclePay > 2000) {
      message.error('结算周期在1-2000之间');
      return;
    }

    if (data.dayPay < 1 || data.dayPay > 31) {
      message.error('付款日在1-31之间');
      return;
    }

    new Promise((resolve, reject) => {
      dispatch({
        type: 'supplier/updateSupplier',
        payload: { ...data },
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
        editSupplierSuccess();
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
    width={1274}
    onCancel={onCancel}
    onOk={modalOnOk}
    className={styles.modal}
  >
    <div className={styles.title}>编辑供应商资料</div>
    <Form
      name="form"
      form={form}      
      onValuesChange={modalFormChange}
      initialValues={initdata as Supplier.ISupplierList}
    >
      <p>基本信息</p>
      <div className={styles.flex}>
        <div className={styles.singleItem}>
          <span className={styles.leftspan}>供应商名称：
            <span className={styles.icon}>*</span></span>
          <Item name="name" className={styles.leftspan} rules={[{
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
            <Select className={styles.searchList}
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
                userList.map((item, index) => {
                  return <Option value={item.username} key={index}>{item.username}</Option>;
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
          <Item name="contactsName" rules={[{
            required: true,
            message: '联系人不能为空',
          }, {
            max: 40,
            message: '联系人长度不超过40',
          }]}>
            <Input></Input>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.centerspan}>联系电话：</span>
          <Item name="contactsPhone" rules={[{
            max: 11,
            message: '联系电话长度不超过11',
          }]}>
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.rightspan}>邮箱：</span>
          <Item name="email">
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.leftspan}>QQ：</span>
          <Item name="qq">
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.centerspan}>微信：</span>
          <Item name="wechat">
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.rightspan}>传真：</span>
          <Item name="fax">
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.leftspan}>地址：</span>
          <Item name="addressLine1">
            <Input/>
          </Item>
        </div>
        <div className={styles.singleItem}>
          <span className={styles.centerspan}>备注：</span>
          <Item name="remarkText">
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
              <Input placeholder="1-31号"/>
            </Item> 
          </div>
        </> : 
          <div className={styles.flex}>
            <span className={styles.paymentspan}>预付比例：                
              <span className={styles.icon}>*</span></span>
            <Item name="proportionPay" normalize={proportionPayLimit} rules={[{
              required: true,
              message: '请输入预付比例',
            }, {
              validator: proPortionPayLimit,
            }]}>
              <Input suffix="%"/>
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
                      <Item name={[index, 'name']}>
                        <Input style={{ width: 250 }}/>
                      </Item>
                    </div>
                    <div className={styles.flex} style={{ width: 405 }}>
                      <span style={{ width: 110 }}>银行/机构名称：</span>
                      <Item name={[index, 'bankName']}>
                        <Input style={{ width: 250 }}/>
                      </Item>
                    </div>
                    <div className={styles.flex} >
                      <span style={{ width: 110 }}>银行/收款账号: </span>
                      <Item name={[index, 'bankAccount']}>
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
                              }}>增加</span>
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

export default EditSupplier;
