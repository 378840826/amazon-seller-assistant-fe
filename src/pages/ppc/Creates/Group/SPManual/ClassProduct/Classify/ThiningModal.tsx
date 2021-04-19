import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Popover,
  Form,
  Input,
  Slider,
  Button,
  message,
  Select,
} from 'antd';
import { useDispatch } from 'umi';
import { strToMoneyStr } from '@/utils/utils';

interface IProps {
  classText: string;
  classId: string;
  currency: string;
  storeId: string|number;
  onConfirm: (data: CreateCampaign.IThiningConfirmCallback) => Promise<boolean>;
}

interface IBrandType {
  brandId: string;
  brandName: string;
}

const { Item } = Form;
const Thining: React.FC<IProps> = (props) => {
  const { currency, onConfirm, classText, classId, storeId } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [brands, setBrands] = useState<IBrandType[]>([]); // 用来渲染品牌的（含搜索后的）
  const [scores, setScores] = useState<[number, number]>([0, 5]);// 选中的评分
  
  
  useEffect(() => {
    if (!visible || brands.length) {
      return;
    }

    // 其它行的品牌细化也会记录选中的品牌
    form.setFieldsValue({ brandName: undefined });

    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'createGroup/getThiningBrands',
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
          vos: IBrandType[];
        };
      };

      if (code !== 200) {
        message.error(msg);
        return;
      }
      setBrands([...data.vos]);
    });
  }, [dispatch, classId, visible, form, brands, storeId]);

  // 确定
  const confirm = () => {
    let flag = true;
    const data = form.getFieldsValue();
    
    const priceMin = data.thining ? data.thining.priceMin : '';
    const priceMax = data.thining ? data.thining.priceMax : '';
    console.log(data.brandName, 'data.brandName');
    
    if (
      scores[0] !== 0 
      || scores[1] !== 5
      || (data.brandName && data.brandName.length !== 0)
      || ![undefined, '', null, '0.'].includes(priceMin)
      || ![undefined, '', null, '0.'].includes(priceMax)
    ) {
      flag = false;
    }
    if (flag) {
      message.error('细化条件不能为空！');
      return;
    }

    if (data.brandName && data.brandName.length > 50) {
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
      checkedBrands: data.brandName || [],
      priceLessThan: priceMin,
      priceGreaterThan: priceMax,
      reviewRatingLessThan: scores[0],
      reviewRatingGreaterThan: scores[1],
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
        <Form form={form}>
          <div className={styles.brandList}>
            <Item label="品牌：" name="brandName" className={styles.brandInput}>
              <Select 
                mode="multiple"
                allowClear
                placeholder="选择或输入品牌"
                loading={loading}
                maxTagCount={2}
              >
                {brands.map((item, index) => {
                  return <Select.Option key={index} value={item.brandId}>
                    {item.brandName}
                  </Select.Option>;
                })}  
              </Select>
            </Item>
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
