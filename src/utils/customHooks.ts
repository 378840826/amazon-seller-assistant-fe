import { useRef, useCallback } from 'react';
import { Input } from 'antd';

/**
 * 支持antd Input 光标操作
 */
export function useAntInputCursor() {
  const ref = useRef(null);
  // dom 中的元素对象
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let domRef: any;

  const setValue = useCallback((value: string) => {
    ref.current.handleChange({
      target: {
        value,
      },
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setRef = (target: any) => {
    ref.current = target;
    if (!target) {
      domRef = null;
      return;
    }
    if (target instanceof Input) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      domRef = (ref.current as any).input as any;
    } else if (target instanceof Input.TextArea) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      domRef = (ref.current as any).resizableTextArea.textArea as any;
    } else {
      throw new Error('only support antd Input or Input.TextArea');
    }
  };

  /** 获取光标所在位置 */
  const getCursorPos = () => {
    // 获取光标位置
    const CaretPos = {
      start: 0,
      end: 0,
    };
    if (domRef.selectionStart) {
      // Firefox support
      CaretPos.start = domRef.selectionStart;
    }
    if (domRef.selectionEnd) {
      CaretPos.end = domRef.selectionEnd;
    }
    return CaretPos;
  };

  /** 设置光标位置，不支持区间 */
  const setCursorPos = (pos: number) => {
    domRef.focus();
    domRef.setSelectionRange(pos, pos);
  };

  /** 在某一个位置插入字符串， 不支持区间 */
  const insertAt = (pos: number, str: string) => {
    const originValue: string = domRef.value;
    if (!originValue) {
      domRef.value = str;
    } else {
      const newPos = Math.min(Math.max(0, pos), originValue.length);
      if (originValue.length <= newPos) {
        domRef.value = originValue + str;
      } else {
        domRef.value = originValue.substr(0, newPos) + str + originValue.substr(newPos);
      }
    }
    setCursorPos(pos + str.length);
    domRef.focus();
    setValue(domRef.value);
  };

  return { setRef, getCursorPos, setCursorPos, insertAt };
}

