import React, { useState, CSSProperties } from 'react';
import { connect } from 'dva';
import { Checkbox, Row, Col, Typography } from 'antd';
import { IConnectState, IConnectProps } from '@/models/connect';
import { ISubModelState } from '@/models/sub';
import styles from './index.less';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const { Text } = Typography;
interface IStoreListConnectProps extends IConnectProps{
  sub: ISubModelState;
  checkedList: CheckboxValueType[];//由列表传入
  checkboxChange: Function;
  span?: number;
}

interface IStyle {
  checkAll: CSSProperties;
  text2: CSSProperties;
  text: CSSProperties;
}
// eslint-disable-next-line comma-dangle
const style: IStyle = {
  checkAll: { height: '30px', lineHeight: '30px' },
  text2: { width: '148px', textAlign: 'left', verticalAlign: 'middle' },
  text: { width: '75px', textAlign: 'left', verticalAlign: 'middle' },
};

const StoreList: React.FC<IStoreListConnectProps> = 
({ sub, checkedList, checkboxChange, span }) => { 
  const plainOptions = sub.storeList;
  const plainIdOptions = plainOptions.map(item => {
    return item.sellerId;
  });

  const [state, setState] = useState({
    checkedList: checkedList,
    indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
    checkAll: checkedList.length === plainOptions.length });

  const emitCheckBox = (checkedList: CheckboxValueType[]) => {
    checkboxChange(checkedList);
  };
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const checkedList = e.target.checked ? plainIdOptions : [];
    emitCheckBox(checkedList);
    setState({
      checkedList: checkedList,
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  const onChange = (checkedValues: CheckboxValueType[]) => {
    emitCheckBox(checkedValues);
    setState((state) => {
      return {
        ...state,
        checkedList: checkedValues,
        indeterminate: !!checkedValues.length && checkedValues.length < plainOptions.length,
        checkAll: checkedValues.length === plainOptions.length,
      };
    });
  };
 
  return (
    <>
      {plainOptions.length > 0 && 
      <div className={styles.container}>
        <div className={styles.checkAll}>
          <Checkbox
            indeterminate={state.indeterminate}
            onChange={onCheckAllChange}
            checked={state.checkAll}
            style={style.checkAll}
          >
            全选
          </Checkbox>
        </div>
        <div className={span ? styles.listStyle : styles.addStyle}>
          <Checkbox.Group value={state.checkedList} 
            className={styles.__checkboxs} 
            onChange={onChange}>
            <Row>
              {plainOptions.map((item) => (
                <Col span={ span ? span : 8} key={item.sellerId}>
                  <Checkbox value={item.sellerId} className={styles.__checkbox}>
                    <i className={[styles.national_flag, styles[item.marketplace]].join(' ')}></i>
                    <Text ellipsis={true} style={ span ? style.text2 : style.text}>
                      {item.storeName}
                    </Text>
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      </div>
      }
    </>
  );
};
export default connect(({ sub }: IConnectState) => ({
  sub,
}))(StoreList);
