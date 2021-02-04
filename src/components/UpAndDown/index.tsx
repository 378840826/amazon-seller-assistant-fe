/**
 * @param {className ？} 传入的类名
 * @param {value} 显示的值 number类型，每三位加一个逗号
 * @param {isAdd} 默认false,带箭头的显示方式 为true为带有加减号的形式
 * @param {inline} 默认false最外层的div display:block,为true时显示为inline-block
 */
import React from 'react';
import classnames from 'classnames';
import { Iconfont, toThousands } from '@/utils/utils';
import styles from './index.less';

interface IUpAndDown{
    className?: string;
    value: number | string;
    isAdd?: boolean;
    inline?: boolean;
}
const RenderArrow = ({ value }: IUpAndDown) => {
  return (
    <>
      { value > 0 ? 
        <>
          <span className={styles.__font}>{toThousands(value)}</span>
          <Iconfont className={styles.green} type="icon-xiajiang"/> 
        </>
        :
        <>
          <span>{toThousands(Math.abs(value as number))}</span>
          <Iconfont className={styles.red} type="icon-xiajiang"/>
        </>
      }
    </>
  );
};


const UpAndDown: React.FC<IUpAndDown> = ({ 
  className, 
  value, 
  isAdd = false,
  inline = false,
}) => {
  if (value === '') {
    return <div className="null_bar"></div>; 
  } else if (value === 0) {
    return (
      <div className={classnames(className)}>
        <div>{toThousands(value)}</div>
      </div>
    ); 
  }
  return (
    <div className={classnames(className, { [styles.inline]: inline })}>
      {
        isAdd ? 
          <>
            { value > 0 ? 
              <span className={styles.green}>+{value}</span>
              :
              <span className={styles.red}>-{toThousands(Math.abs(value as number))}</span>
            }
          
          </> : <RenderArrow value={value}/>
      }
    </div>
  );
}
;
export default UpAndDown;
