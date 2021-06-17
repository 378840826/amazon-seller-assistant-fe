/**
 * 状态筛选下拉选择
 */
import React from 'react';
import { Select } from 'antd';
import styles from './index.less';

const { Option } = Select;

interface IProps {
  state: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (values: { [key: string]: any }) => void;
}

// 状态选择下拉
export const stateOptions = [
  { key: 'enabled', name: '开启' },
  { key: 'paused', name: '暂停' },
  { key: 'archived', name: '归档' },
].map(item => (
  <Option key={item.key} value={item.key}>
    <span className={styles[item.key]}>{item.name}</span>
  </Option>
));

const StateSelect: React.FC<IProps> = props => {
  const { state, onChange } = props;

  return (
    <div>
      状态：
      <Select
        className={styles.stateSelect}
        dropdownClassName={styles.selectDropdown}
        defaultValue=""
        value={state}
        onChange={state => {
          onChange({ state });
        }}
      >
        <Option value="">全部</Option>
        { stateOptions }
      </Select>
    </div>
  );
};

export default StateSelect;
