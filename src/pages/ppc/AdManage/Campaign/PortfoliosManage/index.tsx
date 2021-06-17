/**
 * Portfolios 管理
 */
import React, { useState } from 'react';
import { Input, Dropdown, Button, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import EditableCell from './EditCell';
import { requestFeedback } from '@/utils/utils';
import { IConnectState } from '@/models/connect';
import styles from './index.less';

const { Search } = Input;

const PortfoliosManage: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺 id
  const { id: currentShopId } = useSelector((state: IConnectState) => state.global.shop.current);
  // portfolioList
  const { campaignTab: { portfolioList } } = useSelector((state: IConnectState) => state.adManage);
  const [visible, setVisible] = useState<boolean>(false);

  // 修改名称
  function handlePortfolioEditCallback(id: string, name: string) {
    if (name.replace(/(^\s*)|(\s*$)/g, '') === '') {
      return;
    }
    if (portfolioList.some(item => item.name === name)) {
      message.error('Portfolios名称已存在，请重新输入');
      return;
    }
    dispatch({
      type: 'adManage/renamePortfolio',
      payload: {
        headersParams: { StoreId: currentShopId },
        id,
        name,
      },
      callback: requestFeedback,
    });
  }

  // 添加
  function handleAddPortfolio(name: string) {
    if (name.replace(/(^\s*)|(\s*$)/g, '') === '') {
      return;
    }
    if (portfolioList.some(item => item.name === name)) {
      message.error('Portfolios名称已存在，请重新输入');
      return;
    }
    dispatch({
      type: 'adManage/addPortfolio',
      payload: {
        headersParams: { StoreId: currentShopId },
        name,
      },
      callback: requestFeedback,
    });
  }

  // 管理下拉
  const portfoliosManageMenu = (
    <div className={styles.menuDropdown}>
      <Search
        placeholder="请输入分组名称"
        enterButton="添加"
        maxLength={30}
        onSearch={value => handleAddPortfolio(value)}
      />
      <div className="h-scroll">
        {
          portfolioList.map(portfolio => {
            if (portfolio.name === '未分组') {
              return;
            }
            return (
              <div className={styles.editCellContainer} key={portfolio.id}>
                {
                  <EditableCell
                    inputValue={portfolio.name}
                    maxLength={20}
                    confirmCallback={value => handlePortfolioEditCallback(portfolio.id, value)}
                  />
                }
              </div>
            );
          })
        }
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={portfoliosManageMenu}
      trigger={['click']}
      placement="bottomRight"
      visible={visible}
      className={visible ? styles.active : ''}
      onVisibleChange={flag => setVisible(flag)}
    >
      <Button className={styles.btn}>管理</Button>
    </Dropdown>
  );
};

export default React.memo(PortfoliosManage);
