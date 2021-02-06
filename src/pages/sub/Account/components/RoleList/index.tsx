import React, { useState } from 'react';
import styles from './index.less';
import { useDispatch } from 'umi';
import { Dropdown, Checkbox, Row, Col } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { DownOutlined } from '@ant-design/icons';

interface ISubAccount{
    id: string;
    data: CheckboxValueType[];//选中的子账号id
    samList: API.IParams[];//所有子账号
}
const CheckboxGroup = Checkbox.Group;
const SubAccount: React.FC<ISubAccount> = ({ id, data, samList }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    indeterminate: !!data.length && data.length < samList.length,
    checkedList: data,
    checkAll: data.length === samList.length,
    visible: false, //菜单是否显示
  });

  //全选框
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setState((state) => ({
      ...state,
      indeterminate: false,
      checkedList: e.target.checked ? samList.map(item => item.id) : [],
      checkAll: e.target.checked,
    }));
  };
  //单选框
  const onChange = (checked: CheckboxValueType[]) => {
    dispatch({
      type: 'sub/updateRole',
      payload: {
        data: {
          id,
          roleList: checked,
        },
      },
      callback: () => {
        setState((state) => ({
          ...state,
          checkedList: checked,
          checkAll: checked.length === samList.length,
          indeterminate: !!checked.length && checked.length < samList.length,
        }));
      },
    });
    
  };
  //属性的变化
  const onVisibleChange = (visible: boolean) => {
    setState((state) => ({
      ...state,
      visible,
    }));
  };
  const showNameList = () => {
    const filterAry = samList.filter( item => state.checkedList.includes(item.id))
      .map(item => item.roleName);
    return filterAry.join('，');
  };
  const menu = () => {
    return (
      <div className={styles.__menu}>
        <div>
          <Checkbox 
            indeterminate={state.indeterminate} 
            onChange={onCheckAllChange} 
            checked={state.checkAll}>
        全选
          </Checkbox>
        </div>
        <div className={styles.__checkbox_list}>
          <CheckboxGroup 
            value={state.checkedList}
            onChange={onChange} >
            {samList.map( (item: API.IParams, index: number) => {
              return (
                <Row key={index}>
                  <Col span="24">
                    <Checkbox value={item.id}>{item.roleName}</Checkbox>
                  </Col>
                </Row>
              );
            })}
          </CheckboxGroup>
        </div>
      </div>
    );
  };
  return (
    <Dropdown 
      overlay={menu} 
      placement="bottomLeft" 
      trigger={['click']}
      visible={state.visible}
      onVisibleChange ={(visible) => onVisibleChange(visible) }
    >
      <div className={styles.__dropDown_wrap}>
        <div className={styles.__ellipsis}>{showNameList()}</div>
        <i className={styles.__icon}><DownOutlined/></i>
      </div>
    </Dropdown>
  );
}
;
export default SubAccount;
