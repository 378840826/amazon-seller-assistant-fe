/**
 * @param {className ？} 传入的类名
 * @param {value} 显示的值 number类型，每三位加一个逗号
 * @param {isAdd} 默认false,带箭头的显示方式 为true为带有加减号的形式
 * @param {inline} 默认false最外层的div display:block,为true时显示为inline-block
 * @param {rise} 为不用靠数字正负判断上下箭头还是加减号，rise为空，那么不显示标记,默认为true
 * 
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
    rise?: boolean | string;
}
const RenderArrow = ({ value, rise }: IUpAndDown) => {
  return (
    <>
      { value > 0 ? 
        <>
          <span className={styles.__font}>{toThousands(value)}</span>
          {rise === '' ? '' : <Iconfont className={styles.green} type="icon-xiajiang"/> }
        </>
        :
        <>
          <span>{toThousands(Math.abs(value as number))}</span>
          {rise === '' ? '' : <Iconfont className={styles.red} type="icon-xiajiang"/> } 
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
  rise = true,
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
          
          </> : <RenderArrow rise={rise} value={value}/>
      }
    </div>
  );
}
;
export default UpAndDown;
