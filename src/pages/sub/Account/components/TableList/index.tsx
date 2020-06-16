import React from 'react';
import { connect } from 'dva';
import Reset from '../Reset';
import { Popconfirm } from 'antd';
import styles from './index.less';
import { IConnectState, IConnectProps } from '@/models/connect';
import { ISubModelState } from '@/models/sub';
import OperaShop from '../OperaShop';
export interface ITableListConnectProps extends IConnectProps{
  sub: ISubModelState;
}

const okButtonProps = {
  style: { width: '83px', height: '30px' },
};

const cancelButtonProps = {
  style: { width: '83px', height: '30px' },
};

const TableList: React.FC<ITableListConnectProps> = function({ sub, dispatch }){
  const userList = sub.userList; 
  const popConfirm = (id: string) => {
    dispatch({
      type: 'sub/deleteUser',
      payload: {
        id: id,
      },
    });
  };
  return (
    <div className={styles.table}>
      <table>
        <thead>
          <tr>
            <th className={styles.username}>
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
            <th className={styles.operaDelete}>
              <div>操作</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 && userList.map((item) => (
            <tr key={item.id}>
              <td>
                <div>
                  <Reset 
                    type="username"
                    id={item.id}
                    showMsg={item.username}
                  />
                </div>
              </td>
              <td>
                <div>
                  <Reset 
                    type="email"
                    id={item.id}
                    showMsg={item.email}/>
                </div>
              </td>
              <td>
                <div>
                  <Reset
                    type="password"
                    id={item.id}
                    showMsg="*********"
                  />
                </div>
              </td>
              <td>
                <div >
                  <OperaShop stores={item.stores} id={item.id}/>
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
              <td colSpan={5}>
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
