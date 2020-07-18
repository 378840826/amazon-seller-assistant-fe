/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-05 15:21:50
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-07-06 17:45:15
 * @FilePath: \amzics-react\src\pages\mws\comment\Settings\components\SearchDownList\index.tsx
 * 
 * 异步请求后端数据，暂时不封装成公用组件
 * 
 * 如要封装，可能有以下属性
 * maxWidth
 * maxHeight
 * align: left | center | right 
 * valign bottom |middle | top // 应该可以不做
 * children  自定义渲染下拉列表  默认应该是个<li></li>
 * { value: '值’ , }
 * RefObject<YouComponent>
 */ 
import React, { useState, createRef, RefObject } from 'react';
import styles from './index.less';
import debounce from 'lodash/debounce'; // 防抖
import { 
  Input,
  message,
  Spin,
  Button,
} from 'antd';
import { 
  useDispatch,
  useSelector,
} from 'umi';


interface IRefType extends RefObject<IRefType> {
  state: {
    value: string;
  };
}

interface IDownListItemType {
  item: {
    asin: string;
    title: string;
  };
  callback: (asin: string) => void;
}


const DownListItem: React.FC<IDownListItemType> = (props) => {
  const { item, callback } = props;
  return (
    <li 
      onClick={() => callback(item.asin)}>
      <p>{item.title}</p>
      <p>{item.asin}</p>
    </li>
  );
};

const SearchDownList: React.FC<CommectMonitor.ISearChProps> = (props) => {
  const dispatch = useDispatch();
  const [downList, setDownList] = useState<[]>([]);
  const [visible, setVisible] = useState<boolean>(false); // 是否显示下拉列表
  const [asin, setAsin] = useState<string>('');
  const [addBtnLoading, setAddBtnLoading] = useState<boolean>(false); // 添加按钮loading
  const valueRef = createRef();
  const current = useSelector((state: CommectMonitor.IGlobalType) => state.global.shop.current);

  // 请求数据  
  const asyncRequest = debounce((asin) => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'commectSettings/getSearchAsinList',
        reject,
        resolve,
        payload: {
          asin,
          headersParams: {
            StoreId: current.id,
          },
        },
      });
    }).then(datas => {
      const { data, code } = datas as {data: []; code: number};
      if ( code === 200) {
        setDownList(data);
      }
    }).catch(err => {
      message.error(err || '操作失败！');
    });
  }, 200);

  // asin
  const changeAsin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setAsin(value);

    if (value.length > 0) {
      asyncRequest(value);
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  // input 获取焦点
  const focusHandle = () => {
    const el = valueRef.current as IRefType;
    if (el.state.value && el.state.value.trim().length > 0 ) {
      setVisible(true);
    } 
  };

  // 添加ASIN到列表
  const addAsin = () => {
    setAddBtnLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'commectSettings/addMonitorSetting',
        reject,
        resolve,
        payload: {
          asin,
          headersParams: {
            StoreId: current.id,
          },
        },
      });
    }).then(datas => {
      setAddBtnLoading(false);
      const { code, message: msg } = datas as { code: number; message: string };
      if (code === 200) {
        message.success(msg || '添加成功！');
        props.callback();
      } else {
        message.error(msg || '添加失败！');
      }
    }).catch(err => {
      setAddBtnLoading(false);
      message.error(err || '添加失败!');
    });
  };

  // 下拉列表li点击的回调
  const clickCallback = (asin: string) => {
    setAsin(asin);
    setVisible(false);
    addAsin();
  };
  
  // 离开区域就隐藏了下拉列表了
  const out = () => {
    setVisible(false);
  };

  return (
    <div className={styles.down_list_box} onMouseLeave={out}>
      <header>
        <Input
          onFocus={focusHandle}
          ref={valueRef as RefObject<Input>}
          value={asin}
          onChange={ changeAsin }
          style={{ width: 280 }}/>
        <Spin spinning={addBtnLoading}>
          <Button type="primary" onClick={addAsin}>添加</Button>
        </Spin>
      </header>
      <ul className={styles.search_asin_down_list} style={{ display: (visible ? 'block' : 'none') }}>
        {
          downList.map((item, index) => {
            return <DownListItem key={index} item={item} callback={clickCallback} />;
          })
        }
      </ul>
    </div>
  );
};

export default SearchDownList;

