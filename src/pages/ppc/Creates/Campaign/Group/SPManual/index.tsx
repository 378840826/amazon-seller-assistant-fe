import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { strToMoneyStr, strToNaturalNumStr } from '@/utils/utils';
import {
} from './config';
import {
  Form,
  Input,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import KeywordComponent from './Keyword';
import ClassProductComponent from './ClassProduct';

interface IProps {
  form: FormInstance;
  currency: string;
  marketplace: string;
  storeId: string|number;
  putMathod: CreateCampaign.putMathod;
}

const { Item } = Form;
const SPManual: React.FC<IProps> = props => {
  const { form, currency, marketplace, storeId, putMathod } = props;
  const [nav, setNav] = useState<'keyword'|'classify'>('keyword');
  const [batchSetBidVisible, setBatchSetBidVisible] = useState<boolean>(false); // 批量设置建议竞价显隐
  const [matchingVisible, setMatchingVisible] = useState<boolean>(false); // 批量修改匹配方式显隐

  // SD模式设置成这个classProduct
  useEffect(() => {
    form.setFieldsValue({
      manualType: putMathod === 'classProduct' ? 'classify' : nav, 
    });
    putMathod === 'classProduct' && setNav('classify'); // SD没有建议关键词
  }, [form, nav, putMathod]);


  // 其它地方隐藏
  useEffect(() => {
    document.addEventListener('click', () => {
      batchSetBidVisible && setBatchSetBidVisible(false);
      matchingVisible && setMatchingVisible(false);
    });
  });

  return <div>
    {/* 用来收集当前是什么选中的是关键词，还是分类商品 */}
    <Item name="manualType" hidden>
      <Input/>
    </Item>
    <Item 
      name="defaultBid" 
      label={<span>默认竞价<span className={styles.secondary}>（{currency}）</span>：</span>}
      className={styles.defaultBid}
      normalize={val => {
        if (marketplace === 'JP') {
          return strToNaturalNumStr(val);
        }
        return strToMoneyStr(val);
      }}
      rules={[{
        required: true,
        validator(rule, value) {
          const min = marketplace === 'JP' ? 2 : 0.02;
          if (isNaN(value) || value < min) {
            return Promise.reject(`默认竞价必须大于等于${min}`);
          }
          return Promise.resolve();
        },
      }]}
    >
      <Input placeholder={`至少${marketplace === 'JP' ? 2 : 0.02}`} />
    </Item>

    <div className={styles.box}>
      <nav className={classnames(
        styles.headNav,
        putMathod === 'classProduct' ? 'none' : ''
      )}>
        <span 
          className={classnames(nav === 'keyword' ? styles.active : '')}
          onClick={() => setNav('keyword')}
        >
          关键词
        </span>
        <span 
          className={classnames(nav === 'classify' ? styles.active : '')}
          onClick={() => setNav('classify')}
        >
          分类商品
        </span>
      </nav>

      {/* 关键词 */}
      {nav === 'keyword' ? <KeywordComponent
        form={form}
        currency={currency as API.Site}
        marketplace={marketplace}
        storeId ={storeId}
      /> : <ClassProductComponent 
        form={form}
        currency={currency as API.Site}
        marketplace={marketplace}
        storeId ={storeId}
        putMathod={putMathod}
      />}
    </div>
  </div>;
};

export default SPManual;
