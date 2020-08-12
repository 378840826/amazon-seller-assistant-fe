/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-30 14:50:27
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\layouts\AsinPandectLayout\guard.tsx
 */ 
import React from 'react';
import {
  history,
} from 'umi';


export default class Test extends React.Component {
  render() {
    const { asin } = (history.location.query);
    if (!asin) {
      return <h1 style={{
        textAlign: 'center',
        padding: 50,
      }}>必须传递一个ASIN</h1>;
    }
    return this.props.children;
  }
}
