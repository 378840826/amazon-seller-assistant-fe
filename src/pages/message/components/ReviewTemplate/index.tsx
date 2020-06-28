import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import { useDispatch } from 'umi';
import {
  Button, 
  message,
} from 'antd';
import TextContainer from '../TextContainer';

interface IReviewTemplateProps {
  item: {
    type: string;
    asin: string;
    asinUrl: string;
    star: number;
    reviewTime: string;
    reviewerName: string;
    reviewContent: string;
    reviewLink: string;
    gmtCreate: string;
    handled: boolean;
    id: number;
  };
}

const ReviewTemplate: React.FC<IReviewTemplateProps> = ({ item }) => {
  const [condition, setCondition] = useState<boolean>(false);
  const dispatch = useDispatch();

  // 处理展开收起
  const handleUnfold = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    let target = event.target as HTMLElement;
    let prevSlbiling = target.previousElementSibling as HTMLElement; // 评论内容元素

    if (prevSlbiling && target.classList.contains('js-unfold')) {
      //
    } else {
      // 循环向上查找到展开后再找到评论内容
      for (let i = 100; i > 0; i--) {
        if (target.classList.contains('js-unfold')) {
          prevSlbiling = target.previousElementSibling as HTMLElement;
          break;
        } else {
          target = target.parentElement as HTMLElement;
        }
      }
    }

    const textEl = target.children[0];
    const textHtml = textEl.innerHTML;
    
    target.classList.toggle('active');
    if (textHtml.indexOf('展开') === -1) {
      // 收起
      prevSlbiling.style.height = '24px';
      textEl.innerHTML = '展开';
    } else {
      // 展开
      prevSlbiling.style.height = 'auto';
      textEl.innerHTML = '收起';
    }
  };

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

  // 单条数据是否显示展开按钮
  useEffect(() => {
    const contentList = document.querySelectorAll('p.content_box');
    // if (contentList.length > 0) {
    //   for (const item of contentList ) {
    //     const el = item.children[0];
    //     if (!el) {
    //       continue;
    //     }
        
    //     const height = window.getComputedStyle(el, null).height;
    //     if (parseInt(height) > 24) {
    //       item.nextElementSibling?.classList.remove('none');
    //     }
    //   }
    // }
  });
  
  return (
    <div className={styles.list_item}>
      <div className={styles.layout_one_row}>
        <p className={styles.asin}>
          <a href={item.asinUrl} target="_blank" rel="noopener noreferrer">{item.asin}</a>
          <span>新增一个{item.star}星评论</span>
        </p>
        <p className={styles.date}>
          <span>评论时间：</span>
          <span>{item.reviewTime}</span>
        </p>
        <p className="user">
          用户笔名：
          <span>{item.reviewerName}</span>
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
        <div className={`contents content_box`} >
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
