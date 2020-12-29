import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Popover,
  Form,
  Input,
  Slider,
  Button,
  Checkbox,
  message,
  Spin,
} from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useDispatch } from 'umi';
import { strToMoneyStr } from '@/utils/utils';

interface IProps {
  classText: string;
  classId: string;
  currency: string;
  storeId: string|number;
  onConfirm: (data: CreateCampaign.IThiningConfirmCallback) => Promise<boolean>;
}

const { Item } = Form;
let originalBrands: {
  brandId: number;
  brandName: string;
}[] = []; // 原始的后端数据
const protectBrands: string[] = []; // 数据库得到的品牌列表
const Thining: React.FC<IProps> = (props) => {
  const { currency, onConfirm, classText, classId, storeId } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string|null>(null);
  const [brands, setBrands] = useState<string[]>([]); // 用来渲染品牌的（含搜索后的）
  const [checkedValues, setCheckedValues] = useState<CheckboxValueType[]>([]);// 选中的品牌
  const [scores, setScores] = useState<[number, number]>([0, 5]);// 选中的评分
  
  
  useEffect(() => {
    if (!visible || brands.length) {
      return;
    }

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'createCampagin/getThiningBrands',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: storeId,
          },
          id: classId,
        },
      });
    }).then(datas => {
      setLoading(false);
      const {
        code,
        message: msg,
        data,
      } = datas as {
        code: number;
        message: string;
        data: {
          vos: {
            brandId: number;
          brandName: string;
          }[];
        };
      };
      const temArray: string[] = [];

      if (code !== 200) {
        message.error(msg);
        return;
      }
      
      originalBrands = data.vos;
      data.vos.forEach(item => {
        temArray.push(item.brandName);
        protectBrands.push(item.brandName);
      });
      setBrands([...temArray]);
    });
  }, [dispatch, classId, visible]); // eslint-disable-line


  useEffect(() => {
    const pattern = new RegExp(`.*${inputValue}.*`, 'igm');
    const temArray: string[] = [];

    if (['', null, undefined].includes(inputValue)) {
      setBrands([...protectBrands]);
      return;
    }

    protectBrands.forEach(item => {
      if (item.search(pattern) > -1) {
        temArray.push(item);
        
      } 
    });
    setBrands([...temArray]);
  }, [inputValue]); // eslint-disable-line

  // 确定
  const confirm = () => {
    let flag = true;
    const data = form.getFieldsValue();
    
    const priceMin = data.thining.priceMin;
    const priceMax = data.thining.priceMax;
    if (
      scores[0] !== 0 
      || scores[1] !== 5
      || checkedValues.length !== 0
      || ![undefined, '', null, '0.'].includes(priceMin)
      || ![undefined, '', null, '0.'].includes(priceMax)
    ) {
      flag = false;
    }
    if (flag) {
      message.error('细化条件不能为空！');
      return;
    }

    if (checkedValues.length > 50) {
      message.error('最多选择50个品牌');
      return;
    }

    if (priceMin && priceMax && Number(priceMin) > Number(priceMax)) {
      message.error('最大价格必须大于最小价格');
      return;
    }

    onConfirm({
      classText,
      classId,
      checkedBrands: checkedValues,
      priceLessThan: priceMin,
      priceGreaterThan: priceMax,
      reviewRatingLessThan: scores[0],
      reviewRatingGreaterThan: scores[1],
      originalBrands, // 将后端的数据传上去，要查找品牌ID
    }).then(isSuccess => {
      isSuccess && setVisible(false);
    });
  };

  return (
    <Popover
      visible={visible}
      destroyTooltipOnHide
      trigger="click"
      placement="right"
      onVisibleChange={(visible) => setVisible(visible)}
      overlayClassName={styles.thiningBox}
      content={
        <div>
          <Form form={form} colon={false}> 
            <div className={styles.brandList}>
              <Item label="品牌：" name="brandName" className={styles.brandInput}>
                <Input 
                  placeholder="选择或输入品牌"
                  autoComplete="off"
                  onChange={e => setInputValue(e.target.value)}
                  allowClear/>
              </Item>
              <div className={styles.list}>
                <Checkbox.Group 
                  options={brands}
                  className={classnames( loading ? 'none' : '',)}
                  defaultValue={checkedValues}
                  onChange={values => setCheckedValues(values)} />
                <p className={classnames(
                  styles.notHint,
                  brands.length === 0 ? '' : 'none',
                  loading ? 'none' : '',
                )}>搜索结果不存在或分类关键字无品牌</p>
                
                <Spin spinning={loading} className={styles.loading} />
              </div>
            </div>
            <div className={styles.priceRange}>
              <span className={styles.text}>
                价格区间<span className={styles.subtitle}>（{currency}）</span>：
              </span>
              <Item 
                name={['thining', 'priceMin']} 
                normalize={val => strToMoneyStr(val)}
              >
                <Input autoComplete="off"/>
              </Item>
              <span className={styles.line}>—</span>
              <Item 
                name={['thining', 'priceMax']} 
                normalize={val => strToMoneyStr(val)}
              >
                <Input autoComplete="off"/>
              </Item>
            </div>
            <div className={styles.slider}>
              <span className={styles.title}>Review区间：</span>
              <Slider
                range defaultValue={scores}
                min={0}
                max={5}
                onChange={val => setScores(val)}
                marks={{
                  0: '0',
                  1: '1',
                  2: '2',
                  3: '3',
                  4: '4',
                  5: '5',
                }}
                disabled={false} 
              />
              <span className={styles.descript}>0-5星</span>
            </div>
            <footer>
              <Button onClick={() => setVisible(false)}>取消</Button>
              <Button type="primary" onClick={confirm}>确定</Button>
            </footer>
          </Form>
        </div>
      }
    >
      <span 
        className={classnames(
          styles.thiningDefaultText,
          visible ? styles.active : '',
        )}
        onClick={() => setVisible(!visible)}
      >
        细化
      </span>
    </Popover>
  );
};

export default Thining;
