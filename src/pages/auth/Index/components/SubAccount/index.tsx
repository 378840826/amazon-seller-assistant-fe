import React, { useCallback, useState } from 'react';
import styles from './index.less';
import { useDispatch } from 'umi';
import { Dropdown, Checkbox, Row, Col } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface ISubAccount{
    id: number;
    data: CheckboxValueType[];//选中的子账号id
    samList: API.IParams[];//所有子账号
    changeItem: (id: number, obj: API.IParams) => void;
}
const CheckboxGroup = Checkbox.Group;
const SubAccount: React.FC<ISubAccount> = ({ id, data, samList, changeItem }) => {
  console.log('data,samList:', data, samList);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    visible: false, //菜单是否显示
  });

  const updateSam = useCallback((checked) => {
    dispatch({
      type: 'dynamic/updateSam',
      payload: {
        data: {
          id,
          samList: checked,
        },
      },
      callback: () => {
        changeItem(id, { samList: checked } ) ;
      },
    });
  }, [changeItem, dispatch, id]);
  //全选框
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked ? samList.map(item => item.id) : [];
    updateSam(checked);
  };
  //单选框
  const onChange = (checked: CheckboxValueType[]) => {
    updateSam(checked);
  };
  //属性的变化
  const onVisibleChange = (visible: boolean) => {
    setState((state) => ({
      ...state,
      visible,
    }));
  };
  const showNameList = () => {
    const filterAry = samList.filter( item => data.includes(item.id))
      .map(item => item.username);
    return filterAry.join('，');
  };
  const menu = () => {
    return (
      <div className={styles.__menu}>
        <div>
          <Checkbox 
            indeterminate={!!data.length && data.length < samList.length} 
            onChange={onCheckAllChange} 
            checked={data.length === samList.length}>
        全选
          </Checkbox>
        </div>
        <div className={styles.__checkbox_list}>
          <CheckboxGroup 
            value={data}
            onChange={onChange} >
            {samList.map( (item: API.IParams, index: number) => {
              return (
                <Row key={index}>
                  <Col span="24">
                    <Checkbox value={item.id}>{item.username}</Checkbox>
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
        <i className={styles.__icon}>{ state.visible ? <UpOutlined/> : <DownOutlined/> }</i>
      </div>
    </Dropdown>
  );
}
;
export default SubAccount;
