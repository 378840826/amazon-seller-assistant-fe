import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { Iconfont, validate } from '@/utils/utils';
import { IConnectProps } from '@/models/connect';
import { message } from 'antd';
import styles from './index.less';


interface IResetConnectProps extends IConnectProps{
  type: string;
  showMsg: string;
  id: string;
}

const Reset: React.FC<IResetConnectProps> = function ({ dispatch, type, showMsg, id }){
  const [isInChange, setInChange] = useState(false);//单选框是否处于可修改的状态
  const refInput = useRef<HTMLInputElement>(null);
  const refContainer = useRef<HTMLDivElement>(null);
  const onCancel = useCallback(() => {
    setInChange(false);
    if (refInput.current){
      refInput.current.innerText = showMsg;
    }
  }, [showMsg]);
  
  useEffect(() => {
    const handler: EventListenerOrEventListenerObject = (ev) => {
      if (refContainer.current && ev.target instanceof Node){
        // eslint-disable-next-line react/no-find-dom-node
        if (!(findDOMNode(refContainer.current)?.contains(ev.target))){
          onCancel();
        }
      }
    };
    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler);
    };

  }, [dispatch, onCancel]);
  
 
  //请求三个的修改接口
  const modifyInputVal = (val: string, resolve: Function, reject: Function) => {
    if (type === 'username'){
      dispatch({
        type: 'sub/modifySUsername',
        payload: {
          username: val,
          id: id,
        },
        callback: (res: { code: number; message: string }) => {
          if (res.code === 200){
            return resolve(val);
          } 
          return reject(res.message);
        },
      });
    } else if (type === 'password'){
      dispatch({
        type: 'sub/modifySPassword',
        payload: {
          password: val,
          id: id,
        },
        callback: (res: { code: number; message: string }) => {
          if (res.code === 200){
            if (refInput.current){
              refInput.current.innerText = '*********';
            }
            return resolve(val);
          }
          return reject(res.message);
        },
      });
    } else {
      dispatch({
        type: 'sub/modifySEmail',
        payload: {
          email: val,
          id: id,
        },
        callback: (res: { code: number; message: string }) => {
          if (res.code === 200){
            return resolve(val);
          }
          return reject(res.message);
        },
      });
    }
  };
 

  //确认修改点击
  const onBtnSave = (e: React.MouseEvent) => {
    e.nativeEvent.stopPropagation();
    e.stopPropagation();
    let inputVal = '';
    if (refInput.current){
      inputVal = refInput.current.innerText;
    }

    //如果前后都没变
    if (inputVal === showMsg || inputVal === ''){
      onCancel();
      return;
    }
   
    //校验
    new Promise((resolve, reject) => {
      if (type === 'username'){
        if (!validate.username.test(inputVal)){
          return reject('长度4~16，支持字母、中文、数字、下划线，不允许为纯数字');
        }
        dispatch({
          type: 'user/existUsername',
          payload: {
            username: inputVal,
          },
          callback: (res: { code: number; data: { exist: boolean } }) => {
            if (res.code === 200){
              if (res.data.exist){
                return reject('用户名已存在');
              }
              modifyInputVal(inputVal, resolve, reject);
            }
          },
        });
      } else if (type === 'password') {
        if (!validate.password.test(inputVal)) {
          return reject('长度在6~16，至少包含字母、数字、和英文符号中的两种');
        }
        modifyInputVal(inputVal, resolve, reject);
        
      } else {
        inputVal = inputVal.trim();
        if (!validate.email.test(inputVal)){
          return reject('邮箱格式不正确');
        }
        dispatch({
          type: 'user/existEmail',
          payload: {
            email: inputVal,
          },
          callback: (res: { code: number; data: { exist: boolean } }) => {
            if (res.code === 200){
              if (res.data.exist){
                return reject('邮箱已存在');
              }
              modifyInputVal(inputVal, resolve, reject);
            }
          },
        });
      }
    }).then(() => {
      setInChange(false);
    }, err => {
      onCancel();
      message.error(err);
    });
  };

  const onClickContainer = () => {
    setInChange(true);
    refInput.current?.focus();
    if (type === 'password'){
      if (refInput.current){
        refInput.current.innerText = '';
      }
    }
  };

  return (
    <div ref={refContainer} className={isInChange ? [styles.resetWrap, styles.active].join(' ') : [styles.resetWrap, styles.notActive].join(' ')}>
      <div className={styles.inputArea} >
        <div
          className={styles.inputContent}
          suppressContentEditableWarning={true}
          contentEditable={isInChange ? true : false}
          ref={refInput}
        >
          {showMsg}
        </div>
        <span className={styles.iconShow} onClick={onClickContainer}>
          <Iconfont className={styles.icon} type="icon-xiugai"/>
        </span>
      </div>
      <div className={styles.btn_area}>
        <div className={[styles.btnArea, styles.btnCancel].join(' ')} onClick={onCancel}></div>
        <div className={[styles.btnArea, styles.btnSave].join(' ')} onClick={onBtnSave}></div>
      </div>
    </div>
  );
};
export default connect()(Reset);
