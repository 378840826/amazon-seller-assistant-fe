import React, { useEffect } from 'react';
import { changeHS } from '@/utils/utils';
import { useDispatch } from 'umi';
interface ICountDownProps{
  timeKey: number;
  time: number | string;
  className: string;
}

const CountDown: React.FC<ICountDownProps> = ({ timeKey, className, time }) => {
  const dispatch = useDispatch();  
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({
        type: 'mail/reduceCountDown',
        payload: timeKey,
      });
    }, 60000);
    return () => {
      clearInterval(timer);
    };
  }, [dispatch, timeKey]);
  return (
    <div className={className}>
      { time === '' ? <div className="null_bar"></div> : changeHS(time)}
    </div>
  );
};
export default CountDown;
