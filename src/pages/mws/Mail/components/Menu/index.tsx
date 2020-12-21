import React, { useEffect } from 'react';
import styles from './index.less';
import { Link, connect } from 'umi';
import { Layout } from 'antd';
import classnames from 'classnames';
import { IMailModelState } from '@/models/mail';
import { IGlobalModelState } from '@/models/global';
import { IConnectState, IConnectProps } from '@/models/connect';
const { Content, Sider, Header } = Layout;

interface IMailConnectProps extends IConnectProps{
  global: IGlobalModelState;
  mail: IMailModelState;
  currentUser: API.ICurrentUser;
}
const SideMenu: React.FC<IMailConnectProps> = ({ 
  global, dispatch, 
  children, mail, currentUser }) => {
  const pathname = location.pathname;
  const currentId = global.shop.current.id;
  const surplus = currentUser.memberFunctionalSurplus;
  const manualSendList = surplus.filter(item => item.functionName === '手动邮件');
  const autoSendList = surplus.filter(item => item.functionName === '自动邮件');
  const manualSend = manualSendList.length > 0 ? manualSendList[0].frequency : 0;
  const autoSend = autoSendList.length > 0 ? autoSendList[0].frequency : 0;

  const lists = [
    { path: '/mail/summary', name: '邮件统计', position: 'first' },
    { path: '/mail/inbox', name: `收件箱(${mail.unreadCount})`, position: 'first' },
    { path: '/mail/reply', name: '已回复', position: 'second' },
    { path: '/mail/no-reply', name: '未回复', position: 'second' },
    { path: '/mail/outbox', name: '发件箱', position: 'first' },
    { path: '/mail/send-success', name: '发送成功', position: 'second' },
    { path: '/mail/send-fail', name: '发送失败', position: 'second' },
    { path: '/mail/sending', name: '正在发送', position: 'second' },
    { path: '/mail/rule', name: '自动邮件规则', position: 'first' },
    { path: '/mail/template', name: '邮件模板', position: 'first' },
  ];
  useEffect(() => {
    currentId !== '-1' &&
    dispatch({
      type: 'mail/getUnreadMail',
      payload: {
        data: {
          headersParams: { StoreId: currentId },
        },
      },
    });
  }, [currentId, dispatch]);
  return (
    <Layout className="site-layout-background" style={{ marginTop: '16px', minHeight: 'calc(100% - 16px)' }}>
      {
        currentId !== '-1' && 
        <>
          
          <div className={styles.email_left}>
              本月剩余可发送邮件：
            <span>手动<span className={styles.green}>{manualSend}封</span></span>，
            <span>自动<span className={styles.green}>{autoSend}封</span></span>
          </div>
         
          <Layout>
            <Sider className="site-layout-background" width={113} style={{ backgroundColor: '#f5f5f5' }}>
              <div className={styles.side}>
                {
                  lists.map((item, index) => {
                    return (
                      <div key={index} className={styles[item.position]}>
                        <Link to={item.path} 
                          className={classnames({ [styles.active]: pathname === item.path })}>
                          {item.name}
                        </Link>
                      </div>
                    );
                  })
                }
              </div>
            </Sider>
            <Content style={{ minHeight: 280 }}>{children}</Content>
          </Layout>
        
        </>
      }
      
    </Layout>
  );
};
export default connect(({ global, mail, user }: IConnectState ) => ({
  global,
  mail,
  currentUser: user.currentUser,
}))(SideMenu);
