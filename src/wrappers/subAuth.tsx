import React from 'react';
import { IConnectState, IConnectProps, IUserModelState } from '@/models/connect';
import { connect, Redirect } from 'umi';

interface ISubAuthProps extends IConnectProps{
    user: IUserModelState;
}
const SubAuth: React.FC<ISubAuthProps> = ({ user, children }) => {
  const topAccount = user.currentUser.topAccount;
  if (topAccount){
    return <div>{children}</div>;
  }
  return <Redirect to="/index"/>;
  
};
export default connect(({ user }: IConnectState) => ({
  user,
}))(SubAuth);
