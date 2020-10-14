import React, { useEffect } from 'react';
import styles from './index.less';
import { Link, connect } from 'umi';
import { Layout } from 'antd';
import classnames from 'classnames';
import { IMailModelState } from '@/models/mail';
import { IGlobalModelState } from '@/models/global';
import { IConnectState, IConnectProps } from '@/models/connect';
const { Content, Sider } = Layout;

interface IMailConnectProps extends IConnectProps{
  global: IGlobalModelState;
  mail: IMailModelState;
}
const SideMenu: React.FC<IMailConnectProps> = ({ global, dispatch, children, mail }) => {
  const pathname = location.pathname;
  const currentId = global.shop.current.id;

  
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
        </>
      }
      
    </Layout>
  );
};
export default connect(({ global, mail }: IConnectState ) => ({
  global,
  mail,
}))(SideMenu);
