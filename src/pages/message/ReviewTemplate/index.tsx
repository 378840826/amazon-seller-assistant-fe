import React, { useState } from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import { useDispatch } from 'umi';
import {
  Button, 
  message,
} from 'antd';
import TextContainer from '../components/TextContainer';
import classnames from 'classnames';

interface IReviewTemplateProps {
  item: Message.IReviewData;
}

const ReviewTemplate: React.FC<IReviewTemplateProps> = ({ item }) => {
  const [condition, setCondition] = useState<boolean>(false);
  const dispatch = useDispatch();


  // 点击处理按钮 发送请求
  const handleButton = (id: number) => {
    setCondition(true);
    
    new Promise((resolve, reject) => {
      dispatch({
        type: 'messageModel/setMessageStatus',
        payload: {
          id,
          resolve,
          reject,
        },
      });
    }).then(response => {
      console.log(response);
    }).catch(err => {
      message.error(err || '网络错误请检查！');
      setCondition(false);
    });
  };

  
  return (
    <div className={styles.list_item}>
      <div className={styles.layout_one_row}>
        <p className={styles.asin}>
          <a href={item.asinUrl} target="_blank" rel="noopener noreferrer">{item.asin}</a>
          <span>新增一个{item.star}星评论</span>
        </p>
        <p className={styles.date}>
          <span style={{
            color: '#666',
          }}>评论时间：</span>
          <span>{item.reviewTime}</span>
        </p>
        <p className="user">
          <span style={{
            color: '#666',
          }}>用户笔名：</span>
          <span style={{
            color: '#333',
          }}>{item.reviewerName}</span>
        </p>
        {
          item.handled ? (<Button disabled >已处理</Button>) 
            : (<Button 
              disabled={condition ? true : false}
              className={condition ? '' : 'undisposed'}
              onClick={() => handleButton(item.id) }>
              {condition ? '已处理' : '标记已处理'}
            </Button>)
        }
      </div>
      <div className={`${styles.layout_two_row}`}>
        <span className={styles.title}>评论内容：</span>
        <div className={classnames('contents', 'content_box', styles.content)} >
          {/* {item.reviewContent} */}
          <TextContainer content={item.reviewContent}>
            <a href={item.reviewLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.reviewLink}
            >
              <Iconfont type="icon-lianjie" className={styles.icon} />
              {item.reviewContent}
            </a>
          </TextContainer>
        </div>
        <span className={styles.date}>{item.gmtCreate}</span>
      </div>
    </div>
  );
};

export default ReviewTemplate;
