/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-25 11:56:45
 * @LastEditTime: 2021-04-28 16:19:04
 * 
 * SKU智能匹配
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Modal, Form, Checkbox, Radio, Input, message } from 'antd';
import { useDispatch, useSelector, ConnectProps, IConfigurationBaseState } from 'umi';
import { strToNaturalNumStr } from '@/utils/utils';

interface IProps {
  visible: boolean;
  onCancel: () => void;
}

interface IPage extends ConnectProps {
  configurationBase: IConfigurationBaseState;
}

const { Item } = Form;
const AiMatch: React.FC<IProps> = props => {
  const { visible, onCancel } = props;

  const shops = useSelector((state: IPage) => state.configurationBase.shops);
  const [radio, setRadio] = useState<string>('match1');
  const [form] = Form.useForm();
  const dispatch = useDispatch();


  // 创建表单时，请求店铺
  useEffect(() => {
    if (!visible || shops.length > 0) {
      return;
    }

    dispatch({
      type: 'configurationBase/getShop',
      payload: {
        marketplace: null,
      },
    });
  }, [dispatch, shops, visible]);
 
  const modalConfig = {
    visible,
    okText: '开始匹配',
    title: 'SKU智能匹配',
    width: 792,
    wrapClassName: styles.box,
    centered: true,
    onCancel,
    onOk() {
      console.log(form.getFieldsValue());
      const formData = form.getFieldsValue();
      const storeIds = formData.storeIds;
      const start = formData[radio].start;
      const end = formData[radio].end || null;

      if (storeIds === undefined || storeIds.length === 0) {
        message.error('未选中任何店铺！');
        return;
      }

      if (!start) {
        message.error('输入框不能为空！');
        return;
      }

      if (radio === 'match2' && !end) {
        message.error('输入框不能为空！');
        return;
      }

      const payload = {
        storeIds,
        matching: {
          matchingType: radio,
          start,
          end,
        },
      };
      const promise = new Promise((resolve, reject) => {
        dispatch({
          type: 'skuData/aiSKU',
          payload,
          reject,
          resolve,
        });
      });

      promise.then(datas => {
        const {
          code,
          message: msg,
        } = datas as Global.IBaseResponse;

        if (code === 200) {
          message.success(msg || '匹配成功！');
          return;
        }
        message.error(msg || '匹配失败！');
      });
    },
  };

  const limitedInput = function(val: string) {
    return strToNaturalNumStr(val);
  };

  return <Modal {...modalConfig}>
    <div className={styles.content}>
      <header className={styles.title}>
        <p>• 店铺绑定后，系统自动同步店铺的Merchant SKU，点击“开始匹配”，
          系统按照以下规则进行SKU和Merchant SKU的智能匹配，把SKU和Merchant SKU关联起来；</p>
        <p>• 建议每次添加SKU，使用此智能匹配功能；</p>
        <p>• 命名不规律，导致Merchant SKU和SKU无法匹配，则需要手动匹配；</p>
      </header>
      <Form 
        form={form}
        layout="inline"
        colon={false}
        className={styles.form}
      >
        <Item name="storeIds" >
          <Checkbox.Group 
            className={`${styles.shops} h-scroll`} 
            options={shops} 
          />
        </Item>
      
        <div className={styles.leftLayout}>
          <div className={styles.oneLoneLayout}>
            <Radio value="match1" checked={radio === 'match1'} onClick={() => setRadio('match1')}/>
            <span className={styles.text}>首位至第</span>
            <Item name={['match1', 'start']} normalize={limitedInput} ><Input /></Item>
            <span className={styles.text}>位匹配</span>
          </div>
          <div className={styles.teoLineLayout}>
            <Radio value="match3" checked={radio === 'match3'} onClick={() => setRadio('match3')}/>
            <span className={styles.text}>中间第</span>
            <Item name={['match3', 'start']} normalize={limitedInput} ><Input /></Item>
            <span className={styles.text}>位至末位匹配</span>
          </div>
        </div>
        <div className={styles.rightLayout}>
          <div className={styles.oneLoneLayout}>
            <Radio value="match2" checked={radio === 'match2'} onClick={() => setRadio('match2')}/>
            <span className={styles.text}>首位至第</span>
            <Item name={['match2', 'start']} normalize={limitedInput} ><Input /></Item>
            <span className={styles.text}>位匹配第</span>
            <Item name={['match2', 'end']} normalize={limitedInput} ><Input /></Item>
            <span className={styles.text}>字符匹配</span>
          </div>
          <div className={styles.teoLineLayout}>
            <Radio value="match4" checked={radio === 'match4'} onClick={() => setRadio('match4')}/>
            <span className={styles.text}>中间第</span>
            <Item name={['match4', 'start']} normalize={limitedInput} ><Input /></Item>
            <span className={styles.text}>位至末位匹配</span>
          </div>
        </div>
      </Form>
    </div>
  </Modal>;
};


export default AiMatch;
