/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-19 17:18:28
 * @LastEditTime: 2021-05-17 15:02:59
 * 
 * 异步编辑框
 * 
 * 带确认取消按钮的
 * 
 */
import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import { LoadingOutlined } from '@ant-design/icons';
import {
  Input,
  message,
  Spin,
} from 'antd';

interface IProps {
  style?: React.CSSProperties;
  className?: string;
  size?: 'small'|'large'|'middle'; // 大值
  value: string; // 值
  onOk: (value: string) => Promise<boolean|unknown>; // true 修改值， false不修改值
  successText?: string; // 修改成功后的提示、return Promise.resolve(true);
  errorText?: string; // 修改失败后的提示、return Promise.resolve(false);
  maxLength?: number; // 输入最大长度
  maxLengthHint?: string; // 超出最大长度的提醒
}

export default (props: IProps) => {
  const {
    onOk,
    value,
    size = 'small',
    style,
    className,
    successText,
    errorText,
    maxLength = 20,
    maxLengthHint,
  } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true); // 默认编辑框显隐
  const [editValue, setEditValue] = useState<string>(value); // 编辑框的值
  const [showValue, setShowValue] = useState<string>(value); // 默认显示的值

  const inputRef = useRef<Input>(null);

  // 因为有些数据可以用除了这个组件之外的地方修改
  useEffect(() => {
    setEditValue(value);
    setShowValue(value);
  }, [value]);

  message.config({
    maxCount: 1,
  });

  // 点击编辑
  const clickEdit = () => {
    setVisible(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 200);
  };

  // 编辑框的修改监听
  const changeEditValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) {
      return;
    }
    if (e.target.value.length > maxLength) {
      maxLengthHint ? message.error(maxLengthHint) : '';
      return;
    }
    
    setEditValue(e.target.value);
  };

  // 取消修改
  const onCancelHandle = () => {
    if (loading) {
      return;
    }
    setVisible(true);
    setEditValue(showValue);
  };

  // 确定修改
  const onOkHandle = () => {
    if (showValue === editValue) {
      message.error('未修改任何值');
      return;
    }

    if (editValue.trim() === '') {
      return;
    }

    setLoading(true);
    onOk(editValue.trim()).then(isSuccess => {
      setLoading(false);
      if (isSuccess) {
        setShowValue(editValue.trim());
        setVisible(true);
        successText ? message.success(successText) : '';
      } else {
        setShowValue(showValue);
        setVisible(false);
        errorText ? message.error(errorText) : '';
      }
    }).catch(err => {
      setLoading(false);
      err ? console.error(err) : '';
    });
  };

  // 加载中
  const antIcon = <LoadingOutlined style={{
    fontSize: 20,
  }} spin />;

  return <div className={
    classnames(
      styles.box,
      className, 
      loading ? 'h-disabled' : '',
    )
  } 
  onClick={e => e.nativeEvent.stopImmediatePropagation()}
  >
    <div className={classnames(
      styles.editBox,
      'async-default-text',
      visible ? '' : 'none',
    )}>
      <div 
        className={styles.editContent} 
        onClick={clickEdit}
        style={style}>
        {showValue}
        <Iconfont 
          type="icon-xiugai" 
          className={classnames(styles.editIcon, 'h-async-default-icon')}
        />
      </div>
    </div>
    
    <div className={classnames(
      styles.editInputBox, 
      'async-editbox-input',
      visible ? 'none' : ''
    )}>
      <Input 
        value={editValue} 
        size={size}
        className={classnames(
          styles.input,
          'h-scroll',
          loading ? 'h-disabled' : '',
        )}
        onChange={changeEditValue}
        onPressEnter={onOkHandle}
        // onBlur={() => setVisible(true)}
        ref={inputRef}
      />
      <div className={styles.btns}>
        <span className={classnames(
          styles.cancel, 
          styles.btn,
          loading ? 'h-disabled' : '',
        )} onClick={onCancelHandle}></span>
        <span className={
          classnames(
            styles.confire, 
            styles.btn,
            loading ? styles.loadingBox : '',
            loading ? 'h-disabled' : '',
            showValue === editValue || editValue.trim() === '' ? styles.disable : '',
            'h-async-editbox-confire'
          )
        } onClick={onOkHandle}>
          <Spin spinning={loading} indicator={antIcon} >
            <span className={styles.loading}></span>
          </Spin>
        </span>
      </div>
    </div>
  </div>;
};
