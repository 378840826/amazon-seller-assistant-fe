import React, { useRef, useMemo, ReactElement, useEffect } from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Card } from 'antd';
import { Iconfont } from '@/utils/utils';
import { Link } from 'umi';
import classnames from 'classnames';
import { throttle } from 'lodash';
import styles from './index.less';

export interface ICardData {
  id: number;
  customKey: string;
  title: string;
  titleExplain?: string;
  content: ReactElement;
  annotation?: string;
  link?: string;
  linkText?: string;
  isNotData?: boolean;
}

interface IProps extends ICardData {
  index: number;
  cardClassName?: string;
  loading?: boolean;
  onClose: () => void;
  onMoveCard: (dragIndex: number, hoverIndex: number) => void;
}

const BiCard: React.FC<IProps> = props => {
  const {
    index,
    title,
    titleExplain,
    content,
    annotation,
    link,
    linkText,
    cardClassName,
    loading,
    onClose,
    onMoveCard,
    isNotData,
  } = props;

  const ref = useRef<HTMLDivElement>(null);

  // 拖动
  const [{ isDragging }, drag, dragPreview] = useDrag({
    // item 中包含 index 属性，则在 drop 组件 hover 和 drop 时可以根据第一个参数获取到 index 值
    item: { type: 'card', index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 接收
  const [, drop] = useDrop({
    accept: 'card',
    hover: throttle((item: { type: string; index: number }) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      // 拖拽元素下标与 hover 元素下标一样时 不操作
      if (dragIndex === hoverIndex) {
        return;
      }
      // 执行 move 回调函数
      onMoveCard(dragIndex, hoverIndex);
      // 将 hoverIndex 赋值给 item(drag) 的 index 属性
      item.index = hoverIndex;
    }, 100, { trailing: false }),
  });

  // drag 用于拖动 drop 用于接收
  drop(ref);
  
  // 用 dragPreview 包裹组件，拖动时可预览, 这里是把预览设为空，方便用自定义组件来替代
  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  // 移动中预览的卡片的 className
  const activeClassName: string = useMemo(() => {
    return isDragging ? 'activeCard' : '';
  }, [isDragging]);

  // 没有内容的卡片 className
  const notDataClassName: string = isNotData ? styles.notData : '';

  return (
    <div ref={ref} className={styles[activeClassName]}>
      <Card
        size="small"
        // title 触发拖动事件
        title={drag(
          <div className={styles.titleContainer} title="拖动改变卡片顺序">
            <span className={styles.title}>{title}</span>
            {titleExplain ? <span className={styles.titleExplain}>（{titleExplain}）</span> : null}
          </div>
        )}
        extra={<Iconfont title="隐藏" type="icon-guanbi1" className={styles.close} onClick={onClose} />}
        loading={loading}
        className={classnames(styles.card, cardClassName, notDataClassName)}
      >
        <div className={classnames(styles.content, 'h-scroll')}>
          {content}
        </div>
        <div className={styles.footer}>
          <span className={styles.annotation}>
            {annotation ? <>注：{annotation}</> : null}
          </span>
          <span className={styles.link}>
            {
              link ?
                <>
                  {
                    link.includes('://')
                      ?
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {linkText}
                        <Iconfont type="icon-zhankai-copy" className={styles.linkIcon} />
                      </a>
                      :
                      <Link to={link} target="_blank">
                        {linkText}
                        <Iconfont type="icon-zhankai-copy" className={styles.linkIcon} />
                      </Link>
                  }
                </>
                : null
            }
          </span>
        </div>
      </Card>
    </div>
  );
};

export default BiCard;
