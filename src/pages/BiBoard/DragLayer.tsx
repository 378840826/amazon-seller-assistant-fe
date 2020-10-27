/**
 * 跟随鼠标的卡片
 */
import React from 'react';
import { XYCoord, useDragLayer } from 'react-dnd';
import BiCard, { ICardData } from './Card';
import styles from './index.less';

interface IProps {
  cardDataList: ICardData[];
}

// 获取坐标偏移量
const getItemStyles = (initialOffset: XYCoord | null, currentOffset: XYCoord | null) => {
  if (!initialOffset || !currentOffset) {
    return { display: 'none' };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return { transform };
};

const DragLayer: React.FC<IProps> = props => {
  const { cardDataList } = props;
  const { item, isDragging, initialOffset, currentOffset } = useDragLayer(
    monitor => ({
      item: monitor.getItem(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  return (
    isDragging 
      ?
      <div className={styles.DragLayer}>
        <div style={getItemStyles(initialOffset, currentOffset)}>
          <BiCard
            index={item.index}
            onClose={() => undefined}
            onMoveCard={() => undefined}
            {...cardDataList[item.index]} 
          />
        </div>
      </div>
      : null
  );
};

export default DragLayer;
