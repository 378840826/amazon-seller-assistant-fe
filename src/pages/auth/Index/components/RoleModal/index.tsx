import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'umi';
import styles from './index.less';
import { 
  Form, 
  Row, 
  Col, 
  Input,
  Button,
  Tree,
  Checkbox,
  Radio,
  TreeProps,
} from 'antd';
interface IRoleModal{
    id: number;
    samList: API.IParams[];
    roleList: API.IParams[];
    onCancel: () => void;
    records: API.IParams[];
    getRecordsList: () => void;
}
interface IOptions{
    label: string;
    value: string;
}
const defaultState = {
  roleName: '',
  roleDescription: '',
  samList: [],
  roleState: true,
  permissionList: [],
  
};
const { TextArea } = Input;

const ItemLabel = () => {
  return (
    <div className={styles.__item_label}>
      <span>角色名称：</span>
      <span className={styles._icon}>*</span>
    </div>
  );
};

const tailLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatRoleList = (arr: any[]): TreeProps['treeData'] => {
  return arr.reduce((a, b) => {
    return Array.isArray(b.children) ? a.concat({
      title: b.permissionName,
      key: b.id,
      children: formatRoleList(b.children),
    })
      :
      a.concat({
        title: b.permissionName,
        key: b.id,
      });
  }, []);
};

const RoleModal: React.FC<IRoleModal> = ({
  id,
  records,
  samList,
  roleList,
  onCancel,
  getRecordsList,
}) => {
  const refObj = useRef<HTMLDivElement >(null);
  const dispatch = useDispatch();
  const [height, setHeight] = useState(0);
  const selectedIndex = records.findIndex(item => item.id === id);
  const permissionCodeList = selectedIndex > -1 ? records[selectedIndex].permissionList : [] ;
  const [checkedKeys, setCheckedKeys] = useState(permissionCodeList);
  
  const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
    setCheckedKeys(checkedKeys);
  };
  const onFinish = (values: API.IParams) => {
    if (id === -1){
      dispatch({
        type: 'dynamic/addRole',
        payload: {
          data: {
            ...values,
            permissionList: checkedKeys,
          },
        },
        callback: () => {
          onCancel();
          getRecordsList();
        },
      });
    } else {
      dispatch({
        type: 'dynamic/updateRole',
        payload: {
          data: {
            ...values,
            permissionList: checkedKeys,
            id,
          },
        },
        callback: () => {
          onCancel();
          getRecordsList();
        },
      });
    }
  };

  //获取到initialValues
  const renderId = () => {
    if (id === -1){
      return {
        ['roleName']: defaultState.roleName,
        ['roleDescription']: defaultState.roleDescription,
        ['samList']: defaultState.samList,
        ['roleState']: defaultState.roleState,
      };
    }
   
    return {
      ['roleName']: records[selectedIndex].roleName,
      ['roleDescription']: records[selectedIndex].roleDescription,
      ['samList']: records[selectedIndex].samList,
      ['roleState']: records[selectedIndex].roleState,
    };
  };

  useEffect(() => {
    const height = refObj.current;
    height ? setHeight(height.clientHeight - 46) : 0;
  }, []);


  return (
    <div>
      <Form 
        className={styles.__form}
        onFinish={onFinish}
        colon={false}
        initialValues={renderId()}
      >
        <Row >
          <Col span={12} style={{ paddingRight: '50px' }}>
            <div className={styles.title}>角色</div> 
            <Form.Item
              {...tailLayout}
              label={<ItemLabel/>}
              name="roleName"
              className={styles.__role_item}
              required={false}
              validateTrigger={['onBlur', 'onFocus']}
              rules={[
                { required: true, message: '用户名不能为空', validateTrigger: 'onBlur' },
                { type: 'string', max: 10, message: '用户名不能超过10个字符', validateTrigger: 'onBlur' },
                { message: '', validateTrigger: 'onFocus' },
              ]}
            >
              <Input type="text"/>
            </Form.Item>
            <Form.Item
              {...tailLayout}
              label="角色描述："
              name="roleDescription"
            >
              <TextArea className={styles.__textarea}/>
            </Form.Item>
            <Form.Item
              {...tailLayout}
              label="关联子账号："
              name="samList">
              <Checkbox.Group className={styles.__groups}>
                <Row>
                  {
                    samList.map((item, index) => {
                      return (
                        <Col span={24} key={index}>
                          <Checkbox
                            value={item.id}
                          >
                            {item.username}
                          </Checkbox>
                        </Col>
                      );
                    })
                  }
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              label="状态："
              name="roleState"
              className={styles.__radioGroup}>
              <Radio.Group name="radioGroup">
                <Radio value={true}>启用</Radio>
                <Radio value={false}>停用</Radio> 
              </Radio.Group>
            </Form.Item>
          
          </Col>
          <Col span={12} style={{ borderLeft: '1px solid #dadada', paddingLeft: '50px' }} ref={refObj}>
            <div className={styles.title} style={{ marginLeft: '22px', marginBottom: '7px' }}>权限</div>
            <div className={styles.__tree_wrap}>
              <Tree
                style={{ maxHeight: `${height}px`, overflow: 'auto' }}
                className={styles.__tree}
                checkable
                checkedKeys={checkedKeys}
                onCheck={onCheck}
                treeData={formatRoleList(roleList)}
              />
            </div>
          </Col>
        </Row>  
        <Row style={{ paddingTop: '20px' }}>
          <Form.Item className={styles.__cancel_btn}>
            <Button htmlType="button" 
              className={styles.__button}
              onClick={() => onCancel()}
            >
          取消
            </Button>
            <Button type="primary" htmlType="submit">
          保存
            </Button>
          </Form.Item>
        </Row> 
      </Form>
    </div>

  );
}
;
export default RoleModal;
