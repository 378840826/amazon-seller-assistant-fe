import React from 'react';
import { connect } from 'dva';
// import Reset from '../Reset';
import { Popconfirm, message, Switch } from 'antd';
import { validate } from '@/utils/utils';
import styles from './index.less';
import { IConnectState, IConnectProps } from '@/models/connect';
import { ISubModelState } from '@/models/sub';
import OperaShop from '../OperaShop';
import EditableCell from '@/pages/components/EditableCell';
import RoleList from '../RoleList';
export interface ITableListConnectProps extends IConnectProps{
  sub: ISubModelState;
}

const okButtonProps = {
  style: { width: '83px', height: '30px' },
};

const cancelButtonProps = {
  style: { width: '83px', height: '30px' },
};

const TableList: React.FC<ITableListConnectProps> = function({ 
  sub, 
  dispatch,
}){
  const userList = sub.userList; 
  const storeList = sub.storeList;
  const roleList = sub.roleList;

  const popConfirm = (id: string) => {
    dispatch({
      type: 'sub/deleteUser',
      payload: {
        id: id,
      },
      callback: () => {
        dispatch({
          type: 'user/fetchCurrent',
        });
      },
    });
  };

  const confirmUname = (value: string, id: string) => {
    value = value.trim();
    if (!validate.username.test(value)){
      message.error('长度4~16，支持字母、数字、下划线，不允许为纯数字');
      return;
    }
    dispatch({
      type: 'user/existUsername',
      payload: {
        username: value,
      },
      callback: (res: { code: number; data: { exist: boolean }}) => {
        if (res.code === 200){
          if (res.data.exist){
            message.error('用户名已存在');
            return;
          }
        }
        dispatch({
          type: 'sub/modifySUsername',
          payload: {
            username: value,
            id,
          },
        });
      },
    });
  };
  const changeSwitch = (checked: boolean, id: string) => {
    dispatch({
      type: 'sub/updateState',
      payload: {
        id,
        checked: !checked,
      },
    });
  };
  const confirmEmail = (value: string, id: string) => {
    value = value.trim();
    if (!validate.email.test(value)){
      message.error('邮箱格式不正确');
      return;
    }
    dispatch({
      type: 'user/existEmail',
      payload: {
        email: value,
      },
      callback: (res: { code: number; data: { exist: boolean } }) => {
        if (res.code === 200){
          if (res.data.exist){
            message.error('邮箱已存在');
            return;
          }
          dispatch({
            type: 'sub/modifySEmail',
            payload: {
              email: value,
              id,
            },
          });
        }
      },
    });
  };

  const confirmPass = (value: string, id: string) => {
    if (!validate.password.test(value)){
      message.error('长度在6~16，至少包含字母、数字、和英文符号中的两种');
      return;
    }
    dispatch({
      type: 'sub/modifySPassword',
      payload: {
        password: value,
        id,
      },
    });
  };
  return (
    <div className={styles.table}>
      <table>
        <thead>
          <tr>
            <th className={styles.username}>
              <div>状态</div>
            </th>
            <th className={styles.switch}>
              <div>用户名</div>
            </th>
            <th className={styles.email}>
              <div>邮箱</div>
            </th>
            <th className={styles.password}>
              <div>密码</div>
            </th>
            <th className={styles.operaShop}>
              <div>管理店铺</div>
            </th>
            <th className={styles.roleList}>
              <div>角色</div>
            </th>
            <th className={styles.operaDelete}>
              <div>操作</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 && userList.map((item) => (
            <tr key={item.id}>
              <td>
                <div className={styles.__center}>
                  <Switch 
                    onChange={(checked) => changeSwitch(checked, item.id)}
                    className={styles.__switch} 
                    checked={!item.state}

                  />
                </div>
              </td>
              <td>
                <div className={styles.__center}>
                  <EditableCell 
                    inputValue={item.username}
                    maxLength={16}
                    confirmCallback={(value) => confirmUname( value, item.id)}
                  />
                </div>
              </td>
              <td>
                <div className={styles.__center}>
                  <EditableCell 
                    inputValue={item.email}
                    maxLength={100}
                    confirmCallback={(value) => confirmEmail(value, item.id)}
                  />
                </div>
              </td>
              <td>
                <div className={styles.__center}>
                  <EditableCell 
                    inputValue={'********'}
                    maxLength={16}
                    confirmCallback={(value) => confirmPass(value, item.id)}
                  />
                </div>
              </td>
              <td>
                <div>
                  <OperaShop stores={item.stores} id={item.id} storeList={storeList}/>
                </div>
              </td>
              <td>
                <div>
                  <RoleList id={item.id} samList={roleList} data={item.roleList}/>
                </div>
              </td>
              <td>
                <div className={styles.delete}>
                  <Popconfirm overlayClassName="__sub_pop" title="确定要删除该子账号吗？" 
                    okText="确定" 
                    cancelText="取消" 
                    icon={null}
                    onConfirm={() => popConfirm(item.id)}
                    okButtonProps={okButtonProps}
                    cancelButtonProps = {cancelButtonProps}
                  >
                    <a href="#">删除</a>
                  </Popconfirm>
                </div>
              </td>
            </tr>
          )  
          )}
          {!userList.length && 
            <tr>
              <td colSpan={7}>
                <div>可添加子账号分管店铺，最多可添加10个子账号</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};
export default connect(({ sub }: IConnectState) => ({
  sub,
}))(TableList);
