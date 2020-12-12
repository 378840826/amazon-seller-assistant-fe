/**
 * 多行编辑框
 * 可换行
 */
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import './iconfont.less';
import {
  Input,
  message,
  Spin,
} from 'antd';
import classnames from 'classnames';
import { LoadingOutlined } from '@ant-design/icons';
interface IProps {
  style: React.CSSProperties;
  defaultValue: string; // 初始值
  id: string;
  shopId: string;
  onOk: (value: string) => Promise<boolean|unknown>; // true 修改值， false不修改值
  successText?: string; // 修改成功后的提示、return Promise.resolve(true);
  errorText?: string; // 修改失败后的提示、return Promise.resolve(false);
}

const MultilLineEdit: React.FC<IProps> = props => {
  const {
    defaultValue,
    onOk,
    successText,
    errorText,
  } = props;
  const [showValue, setShowValue] = useState<string>(''); // 显示的值
  const [editValue, setEditValue] = useState<string>(defaultValue); // 编辑框的值
  const [visible, setVisible] = useState<boolean>(false); // 是否显示输入框
  const [loading, setLoading] = useState<boolean>(false); // 确定按钮的loading

  const boxRef = useRef(null);


  useEffect(() => {
    window.addEventListener('click', () => {
      setVisible(false);
    });
  }, [boxRef]);

  /**
   * 
   * @param value 要处理的值
   * @param type 转换成默认显示值，还是编辑框的值
   * toShow转换成默认显示的值 toEdit转换成textarea的值
   */
  const handleValue = (value: string, type = 'toShow'): string => {
    if (type === 'toShow') {
      let newValue = '<div>';
      newValue += value.replace(/[\r\n]/g, '</div><div>');
      newValue += `<i class="iconfont update-icon">&#xe66e;</i></div>`;
      return newValue;
    }

    let showValue = '';
    showValue = value.replace('<i class="iconfont update-icon">&#xe66e;</i></div>', '');
    showValue = showValue.replace(/<\/div><div>/g, '\r\n');
    showValue = showValue.replace('<div>', '');
    return showValue;
  };

  // 初始化值 - 重新修改值
  useEffect(() => {
    setShowValue(handleValue(defaultValue));
  }, [defaultValue]);
  
  // 取消按钮
  const editCancel = () => {
    setVisible(false);
    setEditValue(handleValue(showValue, 'toEdit'));
  };

  // 确定按钮
  const editConfire = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    
    onOk(editValue).then(isSuccess => {
      setLoading(false);
      if (isSuccess) {
        setShowValue(handleValue(editValue));
        setVisible(false);
        successText ? message.success(successText) : '';
      } else {
        errorText ? message.error(errorText) : '';
      }
    }).catch(err => {
      err ? console.error(err) : '';
      setLoading(false);
      setVisible(true);
    });
  };

  // 加载中
  const antIcon = <LoadingOutlined style={{
    fontSize: 20,
  }} spin />;

  return <div className={styles.editBox} 
    onClick={e => e.nativeEvent.stopImmediatePropagation()} ref={boxRef}>
    <div className={classnames(
      styles.showBox,
      visible ? 'none' : '',
    )}>
      <div
        className={styles.showContentDiv} 
        dangerouslySetInnerHTML={{ __html: showValue }}
        onClick={() => setVisible(!visible)}
      />
    </div>
    <div className={classnames(
      styles.editInputBox,
      visible ? '' : 'none',
    )}>
      <Input.TextArea
        value={editValue} 
        className={`${styles.textarea} h-scroll`}
        onChange={e => setEditValue(e.target.value)}
      />
      <div className={styles.btns}>
        <span className={styles.cancel} onClick={editCancel}></span>
        <span className={
          classnames(
            styles.confire, 
            styles.btn,
            loading ? styles.loadingBox : '',
            loading ? 'h-disabled' : '',
          )
        } onClick={editConfire}>
          <Spin spinning={loading} indicator={antIcon} >
            <span className={styles.loading}></span>
          </Spin>
        </span>
      </div>
    </div>
  </div>;
};

export default MultilLineEdit;
