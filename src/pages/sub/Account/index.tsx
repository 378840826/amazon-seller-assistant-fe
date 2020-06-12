import React, { useEffect } from 'react';
import { connect } from 'dva';
import { IConnectState, IConnectProps } from '@/models/connect';
import { IUserModelState } from '@/models/user';
import AddAccount from './components/AddAccount';
import TableList from './components/TableList';
import styles from './index.less';
interface ICenterConnectProps extends IConnectProps {
  user: IUserModelState;
}
const SubAccount: React.FC<ICenterConnectProps> = function({ user, dispatch }){
  const topAccount = user.currentUser.topAccount;
  useEffect(() => {
    dispatch({
      type: 'sub/getStoreList',
    });

    dispatch({
      type: 'sub/getUserList',
    });

  }, [dispatch]);
  return (
    <div className={styles.home}>
      {topAccount && 
        <div className={styles.showContainer}>
          <AddAccount/>
          <TableList/>
        </div>
      }
      {!topAccount && 
       <p className={styles.tips}>当前账号不是主账号哦!</p>
      }
    </div>
  );
};
export default connect(({ user }: IConnectState) => ({
  user,
}))(SubAccount);
