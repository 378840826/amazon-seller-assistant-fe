import React from 'react';
import styles from './index.less';
import { useSelector, useDispatch } from 'umi';
import Rate from '@/components/Rate';

interface IProps {
  list: AsinB2B.IDouFuListTyep[];
  cb?: (params: string[]) => void; // 点击豆腐块的回调
}

const Toolbar: React.FC<IProps> = (props) => {
  const {
    list: douFuList = [], // 列表
    cb,
  } = props;

  const dispatch = useDispatch();
  // 选中店铺
  const current = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const { currency } = current;

  // 已选中的豆腐块
  const selectDouFu = useSelector((state: AsinB2B.IDFChecke) => state.asinB2B.dfCheckedTypes);
  // 选中颜色
  const colors = useSelector((state: AsinB2B.IDFChecke) => state.asinB2B.doufuSelectColor);
  const maxLength = 2; // 最大选中限制

  // 豆腐块的改变
  const change = (label: string) => {
    let checkeds = [];
    if (label === '') {
      return;
    }

    if (selectDouFu.length >= maxLength) {
      if (selectDouFu.indexOf(label) > -1) {
        const index = selectDouFu.indexOf(label);
        const newColor = colors.splice(index, 1)[0];
        colors.push(newColor);
      } else {
        const newColor = colors.shift();
        colors.push(newColor as string);
      }

      dispatch({
        type: 'asinB2B/changeColor',
        payload: {
          colors,
        },
      });
    }

    // 选中的直接删除
    if (selectDouFu.indexOf(label) > -1) {
      const index = selectDouFu.indexOf(label);
      selectDouFu.splice(index, 1);
      checkeds = [...selectDouFu];
    } else {
      // 限制数量
      if (selectDouFu.length >= maxLength) {
        selectDouFu.shift();
      }
      checkeds = [...selectDouFu, label];
    }

    dispatch({
      type: 'asinB2B/changeCheckedType',
      payload: {
        checkeds,
      },
    });

    cb ? cb(checkeds) : null;
  };

  // 默认颜色的配置
  const handlecolor = (value: string) => {
    if (value === '') {
      return '';
    }

    if (selectDouFu.indexOf(value) === -1) {
      return 'transparent';
    }

    const index = selectDouFu.indexOf(value);
    return colors[index];
  };

  return (
    <div className={styles.toolbar}>
      {
        douFuList.map((item, i) => {
          let showSymbol = false; // 是否显示货币符号
          let percent = false; // 百分比货号
          const flag = item.lastData === null || item.lastData === undefined;
          const mianflag = item.data === undefined || item.data === null; // 主要数据是否为空

          if (
            item.label === 'B2B销售额'
            || item.label === 'B2B平均售价'
            || item.label === 'B2B平均客单价'
          ) {
            showSymbol = true;
          }

          if (item.label === 'B2B销售额占比') {
            percent = true;
          }

          return <div className={`${styles.item}`} 
            style={{
              borderTop: handlecolor(item.value) === 'transparent' ? '' : `3px solid ${ handlecolor(item.value)}`,
              backgroundColor: handlecolor(item.value) === 'transparent' ? 'transparent' : '#FAFAFA',
              display: item.show ? 'flex' : 'none',
            }}
            onClick={() => change(item.value) }
            key={i}>
            <div className={styles.left_div} > 
              <span className={styles.title}>
                <span className={styles.title}>
                  <span style={{
                    display: mianflag ? 'none' : 'inline-block',
                  }}>{ showSymbol ? currency : ''}</span>
                  <span style={{
                    display: mianflag ? 'none' : 'inline-block',
                  }}>{item.data}</span>
                  <span style={{
                    display: mianflag ? 'none' : 'inline-block',
                  }}>{percent ? '%' : ''}</span>
                  <span style={{
                    display: !mianflag ? 'none' : 'inline-block',
                    color: '#999',
                  }}>—</span>
                </span>
              </span>
              <span className={styles.text}>{item.label}</span>
            </div>
            <div className={styles.right_div}>
              <p className={styles.title}>
                上期：
                <span className={styles.text}>
                  <span className={ flag ? 'none' : ''}>{(showSymbol ? currency : '')}</span>
                  { flag ? 
                    <span style={{
                      color: '#999',
                    }}>—</span> : item.lastData
                  }
                </span>
              </p>
              <p>
                环比：
                <span className={styles.text}>
                  <Rate value={item.ratio}/>
                </span>
              </p>
            </div>
          </div>; 
        })
      }
    </div>
  );
};

export default Toolbar;
