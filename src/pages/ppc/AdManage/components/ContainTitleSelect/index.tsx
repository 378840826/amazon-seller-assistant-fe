/**
 * 整合 title 的下拉选择器
 */
import React, { ReactElement } from 'react';
import { Select } from 'antd';
import styles from './index.less';

const { Option } = Select;

interface IProps {
  /** 标题 (在未进行选择的情况下 下拉框显示的文字) */
  title: string;
  value: string;
  options: {
    value: string;
    element: ReactElement | string;
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    optionProps?: { [key: string]: any };
  }[];
  width?: number;
  changeCallback: (newValue: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectProps?: { [key: string]: any };
}

const ContainTitleSelect: React.FC<IProps> = (props) => {  
  const { value, options, width, title, changeCallback, selectProps } = props;
  
  return (
    <div
      className={value === '' ? styles.hideClearIcon : null}
      style={{ width: width || 106 }}
    >
      <Select
        { ...selectProps }
        style={{ width: width || '100%' }}
        allowClear
        defaultValue=""
        value={value}
        onChange={value => changeCallback(value || '')}
      >
        <Option className={styles.none} value="">{title}</Option>
        {
          options.map(item => (
            <Option
              { ...item.optionProps }
              className={item.className}
              key={item.value}
              value={item.value}
            >
              {item.element}
            </Option>)
          )
        }
      </Select>
    </div>
  );
};

export default ContainTitleSelect;
