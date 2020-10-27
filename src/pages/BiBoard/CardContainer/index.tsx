/**
 * filename: List
 * overview: 用来存放下方 Card 列表的 List 组件
 */

import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'umi';
import { IConnectState } from '@/models/connect';
import BiCard, { ICardData } from '../Card';
import styles from './index.less';

interface IProps {
  cardDataList: ICardData[];
  onSortChange: (list: string[]) => void;
}

const List: React.FC<IProps> = props => {
  const dispatch = useDispatch();
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['biBoard/fetchKanbanData'];
  const { cardDataList, onSortChange } = props;
  const [, drop] = useDrop({
    accept: 'card',
  });

  // 点击 X 按钮, 同步到自定义列
  const onClose = (customKey: string) => {
    const col = {
      [customKey]: false,
    };
    dispatch({
      type: 'biBoard/updateCustomCols',
      payload: col,
    });
  };

  // 拖拽卡片
  const handleMoveCard = useCallback((dragIndex, hoverIndex) => {
    const dragCard = cardDataList[dragIndex];
    const newList = [...cardDataList];
    // 删除被移动的,插入到移动后的位置
    newList.splice(dragIndex, 1);
    newList.splice(hoverIndex, 0, dragCard);
    // 回调
    onSortChange(newList.map(card => card.customKey));
  }, [cardDataList, onSortChange]);

  return (
    <div className={styles.cardListContainer} ref={drop}>
      {
        cardDataList.map((card, index: number) => (
          <BiCard
            index={index}
            onMoveCard={handleMoveCard}
            loading={loading}
            key={card.title}
            cardClassName={styles.card}
            onClose={() => onClose(card.customKey)}
            { ...card }
          />
        ))
      }
    </div>
  );
};

export default List;
