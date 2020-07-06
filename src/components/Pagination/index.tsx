/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-05-27 14:13:29
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\components\Pagination\index.tsx
 */ 

import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Pagination, Button, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

interface IProps {
  mySize?: 'small' | 'default' | 'large'; // 分页尺寸，目前只有一份小的样式
  align?: 'left' | 'center' | 'right'; // 分页显示位置 默认right
  className?: string; 
  pageSizeOptions?: string[]; // 展示页数量 默认20 50 100
  isShowTotal?: boolean; // 是否显示 默认显示
  callback?: (current: number, size: number) => void; // 页数、大小、选中页改变时触发
  current?: number; // 当前页
  pageSize?: number; // 大小
  totalText?: string; // 总数量的文字描述 %d为占位符 例：列表数量为%d个
  // changeisBackTop?: boolean; // 分页改变时页面是否回到顶部，操作DOM 找不到更好的解决方式
  total: number; // 总数量
}

const Page: React.FC<IProps> = (props) => {
  // state
  const [current, setCurrent] = useState<number>(props.current || 1); // 当前页数
  const [pageSize, setPageSize] = useState<number>(props.pageSize || 20); // 页数大小
  const [total, setTotal] = useState<number>(props.total || 0);

  // 普通
  const align: string = props.align || 'right'; // 对齐方式 默认右边
  const mySize: string = props.mySize || 'small';
  let totalDetails: string = props.totalText || '共%d个';
  let aligStyles: string = styles.right;
  let sizeStyles: string = styles.small;
  let isShowTotal = true; // 是否显示总数量

  useEffect(() => {
    setCurrent(props.current || 1);
    setPageSize(props.pageSize || 20);
    setTotal(props.total || 0);
  }, [props]);

  // 显示方式
  if (align === 'right') {
    aligStyles = styles.right;
  } else if (align === 'center') {
    aligStyles = styles.center;
  } else {
    aligStyles = styles.left;
  }

  // 分页尺寸 
  if (mySize === 'small') {
    sizeStyles = styles.small;
  } else if (mySize === 'default') {
    sizeStyles = styles.default;
  } else {
    sizeStyles = styles.large;
  }

  // 是否显示总数量
  if (props.isShowTotal === false) {
    isShowTotal = false;
  }

  // 总数量文字的替换
  if (props.totalText) {
    if (props.totalText.indexOf('%d') === -1) {
      throw new Error('数量描述格式错误！');
    } else {
      totalDetails = props.totalText.replace('%d', total.toString()) as string;
    }
  } else {
    totalDetails = totalDetails.replace('%d', total.toString());
  }

  // 页面回到顶部
  // const changeBackTop = () => {
  //   if (props.changeisBackTop === false) {
  //     return;
  //   }
  //   document.documentElement.scrollTop = document.body.scrollTop = 0;
  // };
  
  // 页码改变的回调
  const onChange = (current: number) => {
    setCurrent(current);
    // changeBackTop();
    if (props.callback) {
      props.callback(current, pageSize);
    }
  };

  // 改变每页大小
  const clickPageSize = (pageSize: string): void => {
    setPageSize(Number(pageSize));
    // changeBackTop();
    if (props.callback) {
      props.callback(1, Number(pageSize));
    }
  };

  
  // 分页配置 
  const pageConfig = {
    total,
    current,
    pageSize: pageSize,
    onChange,
    showQuickJumper: {
      goButton: <Button>GO</Button>,
    },
    showSizeChanger: false,
    showLessItems: false,
    pageSizeOptions: props.pageSizeOptions || ['20', '50', '100'],
  };
  
  
  return (
    <ConfigProvider locale={zhCN}>
      <div className={`
        ${styles.g_page} 
        ${aligStyles} 
        ${sizeStyles} 
        ${props.className}
        g-page
      `}>
        <div className={styles.total} style={{ visibility: isShowTotal ? 'visible' : 'hidden' }}>{totalDetails}</div>
        <div className={styles.g_page_box}>
          <div className={styles.select_list}>
            <em className={styles.pageshowText}>每页显示</em>
            { pageConfig.pageSizeOptions.map((item: string, index: number) => {
              const pageSize: string = pageConfig.pageSize.toString();
              if (item === pageSize) {
                return <span key={index} 
                  data-value={item} 
                  onClick={ () => {
                    clickPageSize(item); 
                  }} 
                  className="active"
                >
                  {item}
                </span>;
              }
              return <span key={index} onClick={() => {
                clickPageSize(item); 
              }} >{item}</span>;
            })}
          </div>
          <Pagination {...pageConfig}></Pagination>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Page;
