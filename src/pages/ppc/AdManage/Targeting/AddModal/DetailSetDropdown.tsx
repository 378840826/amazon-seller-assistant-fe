/**
 * 分类细化
 */
import React from 'react';
import { Dropdown, Form, Button, Select, Input, Slider, message } from 'antd';
import { strToMoneyStr } from '@/utils/utils';
import { createIdTargeting } from '../../utils';
import { IBrand, ICategoryTargeting } from '../../index.d';
import classnames from 'classnames';
import styles from './index.less';

const { Item: FormItem } = Form;
const { Option } = Select;

interface IProps {
  visible: boolean;
  currency: string;
  categoryId: string;
  categoryName: string;
  categoryPath: string;
  suggestedBrands: IBrand[];
  bid: number;
  onVisibleChange: (visible: boolean) => void;
  onFiltrate: (values: ICategoryTargeting[]) => boolean;
}

// 品牌id-品牌名称 的临时分隔符
const separator = '-';

const DetailSetDropdown: React.FC<IProps> = function(props) {
  const [form] = Form.useForm();
  const {
    visible,
    onVisibleChange,
    onFiltrate,
    currency,
    suggestedBrands,
    bid,
    categoryId,
    categoryName,
    categoryPath,
  } = props;

  // 确定
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleFiltrate(values: any) {
    if (
      (values.review && values.review[0] === 0 && values.review[1] === 5) &&
      !values.brand.length &&
      !values.priceLessThan &&
      !values.priceGreaterThan
    ) {
      message.error('细化条件不能为空');
      return;
    }
    // 根据品牌个数生成多条数据，未选择品牌也要生成一条数据
    const reviewRatingGreaterThan = String(values.review[0]);
    const reviewRatingLessThan = String(values.review[1]);
    const priceGreaterThan = values.priceGreaterThan;
    const priceLessThan = values.priceLessThan;
    const targeting = {
      categoryId,
      categoryName,
      bid,
      priceLessThan,
      priceGreaterThan,
      reviewRatingLessThan,
      reviewRatingGreaterThan,
      path: categoryPath,
    };
    let targetingArr = [];
    if (!values.brand.length) {
      targetingArr = [createIdTargeting(targeting)];
    }
    if (values.brand.length) {
      targetingArr = values.brand.map((brandKey: string) => {
        const [brandId, brandName] = brandKey.split(separator);
        const targeting = createIdTargeting({
          categoryId,
          categoryName,
          bid,
          brandId,
          brandName,
          priceLessThan,
          priceGreaterThan,
          reviewRatingLessThan,
          reviewRatingGreaterThan,
          path: categoryPath,
        });
        return targeting;
      });
    }
    onFiltrate(targetingArr) ? onVisibleChange(false) : message.error('细化条件已存在');
  }

  const overlay = (
    <div>
      <Form
        className={styles.detailSetForm}
        form={form}
        onFinish={handleFiltrate}
      >
        <FormItem label="品牌" name="brand" labelAlign="left" initialValue={[]}>
          <Select
            mode="multiple"
            allowClear
            className={styles.detailSetSelect}
            placeholder="选择/搜索推荐品牌"
            filterOption={(input, option) => {
              return option?.children.toLowerCase().includes(input.toLowerCase());
            }}
          >
            {
              suggestedBrands.map(item => (
                <Option
                  key={`${item.brandId}${separator}${item.brandName}`}
                  value={`${item.brandId}${separator}${item.brandName}`}
                >
                  { item.brandName }
                </Option>)
              )
            }
          </Select>
        </FormItem>
        <FormItem label={`价格区间(${currency})`} labelAlign="left">
          <FormItem
            name="priceGreaterThan"
            getValueFromEvent={e => strToMoneyStr(e.target.value)}
            className={styles.FormRangeItem}
          >
            <Input placeholder="min" />
          </FormItem>
          <span className={styles.rangeHyphen}>-</span>
          <FormItem
            name="priceLessThan"
            getValueFromEvent={e => strToMoneyStr(e.target.value)}
            className={styles.FormRangeItem}
          >
            <Input placeholder="max" />
          </FormItem>
        </FormItem>
        <div className={styles.reviewScoreSelect}>
          <FormItem label="review区间" name="review" labelAlign="left" initialValue={[0, 5]}
            rules={[
              () => ({
                validator(_, value) {
                  if (value[0] === value[1]) {
                    return Promise.reject(new Error('review区间需要一个区间值！'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Slider range marks={[0, 1, 2, 3, 4, 5]} min={0} max={5} />
          </FormItem>
          <div className={styles.reviewScoreTips}>0-5星</div>
        </div>
        <div className={styles.btns}>
          <Button onClick={() => onVisibleChange(false)}>取消</Button>
          <Button type="primary" htmlType="submit" >保存</Button>
        </div>
      </Form>
    </div>
  );

  return (
    <Dropdown
      overlay={overlay}
      trigger={['click']}
      placement="bottomRight"
      visible={visible}
      className={classnames(styles.Dropdown, visible ? styles.btnActive : '')}
      onVisibleChange={onVisibleChange}
    >
      <Button type="link">细化</Button>
    </Dropdown>
  );
};

export default DetailSetDropdown;
