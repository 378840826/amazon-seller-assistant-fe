/*
 * 广告定时插件
 * 没有提供初始化时数据的回给
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  weekNumberToChinese,
  getAxis,
  weekTransition,
  dateTransitionTdIndex,
  times,
  rowtranstionWeek,
} from './util';
import {
  Button,
} from 'antd';

interface ITableRows {
  head: any[][]; // eslint-disable-line
  list: {
    time: number; // 时间
    select: boolean; // 是否已选中
    week?: string; // 星期几
  }[][];
}

interface IA {
  startX: number;
  endX: number;
  startY: number;
  endY: number;
}

type ICheckedType = 'true' | 'false';

export interface IDateItem {
  startTime: string;
  endTime: string;
}

export interface ITimingInitValueType {
  mon: IDateItem[];
  tues: IDateItem[];
  wed: IDateItem[];
  thur: IDateItem[];
  fri: IDateItem[];
  sat: IDateItem[];
  sun: IDateItem[];
}

export interface ITimingSelectProps {
  initValues?: ITimingInitValueType;
  onSelect?: (activeTime: ITimingInitValueType) => void;
}

let downStartX = 0; // 点击时开始的X坐标
let downStartY = 0; // 点击时开始的Y坐标
// let upX = 0; // 鼠标松开的X坐标
// let upY = 0; // 鼠标松开的Y坐标
let tds: null|NodeListOf<HTMLElement> = null; // 数据
const TimeSelectBox: React.FC<ITimingSelectProps> = props => {
  const { initValues, onSelect } = props;

  // 表格初始化依赖
  const [tableRows, settableRows] = useState<ITableRows>({
    head: [],
    list: [],
  });
  const tableRef = useRef(null) as any; // eslint-disable-line
  const shadeBoxRef = useRef(null) as any; // eslint-disable-line
  const [shadeVisible, setShadeVisible] = useState<boolean>(false);
  const [shadeStyle, setShadeStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    document.addEventListener('mouseover', () => {
      shadeVisible && setShadeVisible(false);
    });
  });

  // 返回数据级调用 - 精确到秒，开始时间变成::00秒  结束时间变成::59秒
  const handleData = () => {
    if (tds === null) {
      tds = document.querySelectorAll('#h-timing-table td:not(:first-child');
    }

    const data = {
      mon: [],
      tues: [],
      wed: [],
      thur: [],
      fri: [],
      sat: [],
      sun: [],
    };
    let startTime = '';

    // 处理开始时间
    function handleStartTime(startTime: string): string {
      const temp = startTime.split(':');
      let hour: number|string = Number(temp[0]);
      let minute: number|string = Number(temp[1]);
      if (minute === 29) {
        minute = 30;
      } else if (minute === 59) {
        ++hour;
        minute = '00';
      } else {
        // 00:00
        hour = '0';
        minute = '00';
      }
      return (`${hour < 10 ? `0${hour}` : hour}:${minute}:00`);
    }

    tds.forEach(item => {
      /**
       * 第一个开始的
       */
      const state = item.getAttribute('data-checked');
      const timer = item.getAttribute('data-timer') as string;
      const temp = timer.split('-');
      const tdIndex = temp[1];
      if (state === 'true') {
        startTime === '' ? startTime = times[tdIndex] : '';// 记录一段范围的开始时间

        // 边界（最后一个选中时）
        if (tdIndex === '48') {
          // 放入对应的星期内
          data[rowtranstionWeek(temp[0])].push({
            startTime: handleStartTime(startTime),
            endTime: '23:59:59',
          });
          startTime = '';
        }
      } else {
        if (startTime) {
          // 放入对应的星期内
          data[rowtranstionWeek(temp[0])].push({
            startTime: handleStartTime(startTime),
            endTime: `${times[tdIndex]}:59`,
          });
          startTime = '';
        }
      }
    });
    onSelect && onSelect(data);
  };

  
  // 初始化表格
  for (let i = 0; i < 2; i++) {
    tableRows.head[i] = [];
    for (let j = 0; j <= 48; j++) {
      if (j === 0) {
        tableRows.head[i][0] = <>
          星期<span>/</span>时间 
        </>;
        continue;
      }
      tableRows.head[i].push(String(j));
    }
  }

  // 设置单元格选中或删除(为什么不通过数据驱动？ 太卡了)
  const setTdStyle = useCallback((isChecked: ICheckedType, el: Element) => {
    const temp = isChecked === 'true' ? 'false' : 'true';
    el.setAttribute('data-checked', temp);
  }, []);

  /**
   * 鼠标移动或松开时--设置单元格选中或取消选中
   * @param {Number} endX  鼠标最后的X坐标
   * @param {Number} endY  鼠标最后的Y坐标
   */
  const setTdStatus = useCallback((endX: number, endY: number) => {
    if (tds === null) {
      tds = document.querySelectorAll('#h-timing-table td:not(:first-child');
    }
   
    const tdWidth = parseInt(getComputedStyle(tds[0]).width.slice(0, -2));
    const tdHeight = parseInt(getComputedStyle(tds[0]).height.slice(0, -2));
    let priviteStartX = downStartX, privateStartY = downStartY; // 起始坐标
    let priviteEndX = endX, privateEndY = endY; // 结束坐标
    let flag = true; // 记录是否有未选中的，只要有，那全选按钮就不会选中

    if (endX < downStartX) {
      priviteStartX = endX;
      priviteEndX = downStartX;
    }

    if (endY < downStartY) {
      privateStartY = endY;
      privateEndY = downStartY;
    }

    tds.forEach(item => {
      const tdStatus = item.getAttribute('data-checked') as ICheckedType; // // 当前的格子是否已选中
      const offsetLeft: number = item.offsetLeft; // 单元格的偏移量
      const offsetTop: number = item.offsetTop;

      if (
        offsetLeft + tdWidth > priviteStartX
        && offsetLeft < priviteEndX
        && offsetTop + tdHeight > privateStartY
        && offsetTop < privateEndY
      ) {
        setTdStyle(tdStatus, item);
      } 

      if (flag) {
        tdStatus === 'true' || tdStatus === null ? flag = false : '';
      }
    });
    handleData();
  }, [setTdStyle]); // eslint-disable-line

  // 计算鼠标点击到松开的距离
  const sumMouseDIST = (params: IA) => {
    const {
      startX = 0,
      endX = 0,
      startY = 0,
      endY = 0,
    } = params;
    let width = 0, height = 0, left = 0, top = 0;

    if (endX > startX && endY > startY) {
      // 左上 → 右下
      width = endX - startX;
      height = endY - startY;
      left = startX;
      top = startY;
    } else if (endX < startX && endY < startY) {
      // 右下 → 左上
      width = startX - endX;
      height = startY - endY;
      left = endX + 5;
      top = endY + 5;
    } else if (endX < startX && endY > startY) {
      // 右上 → 左下
      width = startX - endX;
      height = endY - startY;
      left = endX ;
      top = startY - 10;
    } else if (endX > startX && endY < startY) {
      // 左下 → 右上
      width = endX - startX ;
      height = startY - endY;
      left = startX ;
      top = endY + 10;
    } 
    setShadeStyle({
      left,
      top,
      width,
      height,
    });
  };

  // 绑定事件，用来处理是否离开了
  useEffect(() => {
    if (shadeVisible && shadeBoxRef.current) {
      shadeBoxRef.current.addEventListener('mouseover', (e: { target: HTMLElement}) => {
        // 移动出选中区后的处理 
        if (e.target && !e.target.classList.contains('td-select-time')) {
          setShadeVisible(false);
          return false;
        }
      });
    }
  }, [shadeBoxRef, shadeVisible]);


  // 鼠标在格子上移动
  const mouseMove = useCallback((e) => {
    // 移动出选中区后的处理 
    if (!e.target.classList.contains('td-select-time')) {
      setShadeVisible(false);
      return;
    }

    const { x, y } = getAxis(e);
    sumMouseDIST({
      startX: downStartX,
      endX: x,
      startY: downStartY,
      endY: y,
    });
  }, []);

  // 鼠标点下时间格子
  const mouseDown = useCallback((e: { button: number }) => {
    if (e.button !== 0) {
      return;
    }
    
    setShadeVisible(true);
    const { x, y } = getAxis(e);
    downStartX = x;
    downStartY = y;

    // 初始化值
    setShadeStyle({
      left: x - 5,
      top: y - 5,
      width: 0,
      height: 0,
    });

    tableRef.current.addEventListener('mousemove', mouseMove);
  }, [mouseMove]);

  // 鼠标从时间格子松开
  const mouseUp = useCallback((e: { button: number }) => {
    if (e.button !== 0) {
      return;
    }
    setShadeVisible(false);
    tableRef.current.removeEventListener('mousemove', mouseMove);

    const { x, y } = getAxis(e);
    setTdStatus(x, y);
  }, [mouseMove, setTdStatus]);

  // 全选按钮
  const allSelect = () => {
    if (tds === null) {
      tds = document.querySelectorAll('#h-timing-table td:not(:first-child');
    }
    tds.forEach(item => {
      setTdStyle('false', item);
    });
    if (onSelect) {
      const day = [{ startTime: '00:00', endTime: '23:59' }];
      onSelect({
        mon: day,
        tues: day,
        wed: day,
        thur: day,
        fri: day,
        sat: day,
        sun: day,
      });
    }
  };

  // 清空按钮
  const clearBtn = () => {
    if (tds === null) {
      tds = document.querySelectorAll('#h-timing-table td:not(:first-child');
    }
    tds.forEach(item => {
      setTdStyle('true', item);
    });
    onSelect && onSelect({
      mon: [],
      tues: [],
      wed: [],
      thur: [],
      fri: [],
      sat: [],
      sun: [],
    });
  };


  // 绑定事件并初始值值
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.removeEventListener('mousedown', mouseDown);
      tableRef.current.removeEventListener('mouseup', mouseUp);
      tableRef.current.addEventListener('mousedown', mouseDown);
      tableRef.current.addEventListener('mouseup', mouseUp);

      // 默认初始化表格
      for (let i = 0; i < 7; i++) {
        tableRows.list[i] = [];
        for (let j = 0; j <= 48; j++) {
          if (j === 0) {
            tableRows.list[i][0] = {
              time: 0,
              select: false,
              week: weekNumberToChinese(i + 1),
            };
            continue;
          }

          tableRows.list[i].push({
            time: j,
            select: false,
          });
        }
      }
      settableRows({ ...tableRows });

      // 初始化赋值
      if (initValues) {
        for (const key in initValues) {
          const rowItems = tableRows.list[weekTransition(key)];
          const dataItem: IDateItem[] = initValues[key];
          dataItem.forEach(item => {
            const temp = dateTransitionTdIndex(item);            
            rowItems.forEach(item => {
              if (temp.includes(item.time)) {
                item.select = true;
              }
            });
          });
        }
        settableRows({ ...tableRows });
      }
    }
  }, [tableRef, initValues]);  // eslint-disable-line


  // 禁目鼠标右键
  const tablePreventDefault = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
    e.preventDefault();
    return false;
  };


  return <div 
    className={classnames(styles.timeSelectBox, 'h-timing')} 
    onMouseOver={e => e.nativeEvent.stopImmediatePropagation()}>
    <header>
      <Button onClick={allSelect}>全选</Button>
      <Button onClick={clearBtn}>清空</Button>
    </header>
    {/* 选区 */}
    <div className={classnames(styles.shadeBox, 'h-timing-box')} ref={shadeBoxRef}>
      <div className={classnames(styles.shade, shadeVisible ? '' : 'none')} style={{ ...shadeStyle }}></div>

      <table className={styles.table} onContextMenu={tablePreventDefault}>
        <thead>
          {
            tableRows.head.map((trItem, i) => {
              return <tr key={i}>
                {trItem.map((tdItem, tdIndex) => {
                  if (i === 0 && tdIndex === 0) {
                    return <th 
                      key={tdIndex} 
                      className={styles.thHeading} 
                      rowSpan={2}>{tdItem}</th>;
                  }

                  if (i === 1 && tdIndex === 0) {
                    return;
                  }

                  // 第一行
                  if (i === 0 && tdIndex === 12) {
                    return <th key={tdIndex} colSpan={12}>00：00 - 05：59</th>;
                  }
                  if (i === 0 && tdIndex < 12) {
                    return;
                  }

                  if (i === 0 && tdIndex === 24) {
                    return <th key={tdIndex} colSpan={12}>06：00 - 11：59</th>;
                  }
                  if (i === 0 && tdIndex < 24) {
                    return;
                  }

                  if (i === 0 && tdIndex === 34) {
                    return <th key={tdIndex} colSpan={12}>12：00 - 17：59</th>;
                  }
                  if (i === 0 && tdIndex < 34) {
                    return;
                  }

                  if (i === 0 && tdIndex === 48) {
                    return <th key={tdIndex} colSpan={12}>18：00 - 23：59</th>;
                  }
                  if (i === 0 && tdIndex < 48) {
                    return;
                  }

                  // 第二行
                  if (tdIndex % 2 === 0) {
                    return <th 
                      key={tdIndex} colSpan={2}
                      className={styles.hour}
                    >
                      {tdIndex / 2 - 1}
                    </th>;
                  }
                })}
              </tr>;
            })
          }
        </thead>
        <tbody id="h-timing-table" ref={tableRef}>
          {
            tableRows.list.map((trItem, i) => {
              return <tr key={i}>
                {trItem.map((tdItem, tdIndex) => {
                  return tdItem.week ? <td 
                    key={tdIndex}
                  >{tdItem.week}</td> : <td
                    key={tdIndex}
                    data-checked={tdItem.select}
                    className="td-select-time"
                    data-timer={`${i}-${tdIndex}`}
                  ></td>;
                })}
              </tr>;
            })
          }
        </tbody>
      </table>
    </div>
  </div>;
};

export default TimeSelectBox;
