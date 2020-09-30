import React, { HTMLAttributes, useState } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import LeftTableList from '../LeftTableList';
import RightPart from '@/pages/mws/Mail/components/RightPart';
import styles from './index.less';
interface IDragPartProps extends HTMLAttributes<HTMLDivElement>{
  initialwidth: number;
  showwidth: number;
  minwidth: number;
  maxwidth: number;
  dragboxbackground: string;
}
interface IDraggableExp{
  request: (params: API.IParams) => void;
}
const DraggableExp: React.FC<IDraggableExp> = ({ request }) => {
  const [state, setState] = useState<IDragPartProps>({
    initialwidth: 345, // 左边区块初始宽度
    showwidth: 345, // 左边区块初始宽度
    minwidth: 345, // 左边区块最小宽度
    maxwidth: 492, // 左边区块最大宽度
    dragboxbackground: 'transparent', // 拖拽盒子的背景色
  });

  const dragBoxStyle = {
    left: state.initialwidth,
    background: state.dragboxbackground,
  };

  // 拖动时设置拖动box背景色，同时更新左右box的宽度
  const onDrag: DraggableEventHandler = (ev, ui) => {
   
    const newLeftBoxWidth = ui.x + state.initialwidth;
    setState((state) => ({
      ...state,
      showwidth: newLeftBoxWidth,
      dragboxbackground: 'transparent',
    }));
  };

  // 拖拽结束，重置drag-box的背景色
  const onDragStop = () => {
    setState((state) => ({
      ...state,
      dragboxbackground: 'transparent',
    }));
  };

  
  return (
    <div className={styles.container}>
     
      <div className={styles.leftContent} style={{ width: state.showwidth }}>
        <LeftTableList request={request}/>
        <Draggable
          axis="x"
          defaultPosition={{ x: 0, y: 0 }}
          onDrag={onDrag}
          onStop={onDragStop}
          bounds={{
            left: state.minwidth - state.initialwidth,
            right: state.maxwidth - state.initialwidth,
          }}
        >
          <div className={styles.dragBox} style={dragBoxStyle}></div>
        </Draggable>
      </div>
      <div className={styles.rightContent}>
        <RightPart/>
      </div>
    </div>
  );
  
};

export default DraggableExp;
