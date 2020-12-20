/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-05 15:21:50
 * @FilePath: \amzics-react\src\pages\follow\Monitor\components\SearchDownList\index.tsx

 */ 
import React, { useState, useMemo, useCallback } from 'react';
import styles from './index.less';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import { 
  AutoComplete,
  Button,
  Spin,
  message,
} from 'antd';
import { 
  useDispatch,
  useSelector,
} from 'umi';
import { IConnectState } from '@/models/connect';

interface IProps {
  successCallback: () => void; // 添加成功后的回调
}

const { Option } = AutoComplete;
const Complete: React.FC<IProps> = ({ successCallback }) => {
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const functionCount = useSelector((state: IConnectState) => state.user.currentUser.memberFunctionalSurplus.find(item => item.functionName === '跟卖监控')?.frequency || 0);  

  const dispatch = useDispatch();

  const [value, setValue] = useState('');
  const [addBtnLoading, setAddBtnLoading] = useState<boolean>(false); // 添加ASIN时给添加按钮加个状态
  const [searchLoading, setSearchLoading] = useState<boolean>(false); // true表示正在搜索下拉列表的内容
  const [options, setOptions] = useState<{ asin: string; title: string }[]>([]);


  // 下拉列表数据请求
  const request = useCallback(value => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/getFollowComplete',
        reject,
        resolve,
        payload: {
          keyword: value,
          headersParams: {
            StoreId: currentShop.id,
          },
        },
      });
    }).then(datas => {
      setSearchLoading(false);
      const { data, code } = datas as {data: []; code: number};
      if (code === 200) {
        setOptions(data);
      }
    }).catch(err => {
      setSearchLoading(false);
      message.error(err || '操作失败！');
    });
  }, [dispatch, currentShop]);
  
  // 将ASIN添加到数据库
  const addAsinRequest = useCallback((asin: string) => {
    if (functionCount <= 0 ) {
      message.error(`当前会员等级剩余可添加ASIN：${functionCount}个`);
      return;
    }

    if (asin.trim() === '') {
      message.error('ASIN不能为空!');
      return;
    }

    setAddBtnLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'tomMonitor/getFollowAddasin',
        reject,
        resolve,
        payload: {
          asin,
          headersParams: {
            StoreId: currentShop.id,
          },
        },
      });
    }).then(datas => {
      setAddBtnLoading(false);
      const { code, message: msg } = datas as { code: number; message: string };
      if (code === 200) {
        message.success(msg || '添加成功！');
        successCallback();

        dispatch({
          type: 'user/updateMemberFunctionalSurplus',
          payload: {
            functionName: '跟卖监控',
          },
        });
      } else {
        message.error(msg || '添加失败！');
      }
    }).catch(err => {
      setAddBtnLoading(false);
      message.error(err || '添加失败!');
    });
  }, [dispatch, currentShop, successCallback, functionCount]);

  const debounceRequest = useMemo(() => debounce(request, 500), [request]);

  // 输入的时候调用该方法
  const onSearch = (searchText: string) => {
    setSearchLoading(true);
    debounceRequest(searchText);
  };

  // 选中下拉列表的时候该用该方法
  const onSelect = (data: string) => {
    addAsinRequest(data.trim());
  };

  const onChange = (data: string) => {
    setValue(data);
  };

  // 添加ASIN到列表
  const addAsin = () => {
    addAsinRequest(value.trim());
  };

  return <div className={classnames(styles.downlistBox, 'h-search-downlist')}>
    <AutoComplete
      style={{
        width: 280,
        marginRight: 10,
      }}
      onChange={onChange}
      onSelect={onSelect}
      onSearch={onSearch}
      allowClear
      placeholder="请输入要监控的ASIN"
      dropdownMatchSelectWidth={500}
      dropdownClassName={styles.downlist} 
    >
      {
        // eslint-disable-next-line
        searchLoading ? <Option style={{
          textAlign: 'center',
        }} value="">
          <Spin />
        </Option> :
          options.map((item, i) => (
            <Option 
              value={item.asin} 
              key={i} 
              className={styles.optionItem}
            >
              <div className={styles.title} title={item.title}>{item.title}</div>
              <div className={styles.asin}>{item.asin}</div>
            </Option>
          ))
      }
    </AutoComplete>
    <Spin spinning={addBtnLoading}>
      <Button type="primary" onClick={addAsin}>添加</Button>
    </Spin>
  </div>;
};

export default Complete;
