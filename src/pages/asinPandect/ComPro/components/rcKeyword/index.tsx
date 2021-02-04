import React from 'react';
import { IConnectState, IConnectProps } from '@/models/connect';
import { connect } from 'umi';

interface IRCKeyword extends IConnectProps{
    text: string;
    searchTerms: string;
}
const RCKeyword: React.FC<IRCKeyword> = ({ text, searchTerms }) => {
  if (text){
    if (searchTerms){
      const keywordList = text.split('、');
      keywordList.forEach((item, index) => {
        const small = item.split(' ');
        small.map((item, index) => {
          if (item.includes(searchTerms)){
            small[index] = `<span  style="color:#ff5958">${item}</span>`;
          }
        });
        keywordList[index] = small.join(' ');
      });
      const url = `<div>${keywordList.join('、')}</div>`;
      return (
        <div dangerouslySetInnerHTML={{ __html: url }} ></div>
        
      );
    }
    return (
      <div>{text}</div>
    );
  }

  return (
    <div className="null_bar"></div>
  );
};
export default connect(({ comPro }: IConnectState) => ({
  searchTerms: comPro.send.searchTerms,
}))(RCKeyword);
