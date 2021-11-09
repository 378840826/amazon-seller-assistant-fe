/*
 查询设置和筛选等头部
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Input, Dropdown, Button, Radio, message, Modal } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { requestErrorFeedback, requestFeedback, Iconfont } from '@/utils/utils';
import { IConnectState } from '@/models/connect';
import BatchSetting from '../BatchSetting';
import styles from './index.less';

const { Search, TextArea } = Input;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const replenishment = useSelector((state: IConnectState) => state.replenishment);
  const {
    compareType,
    searchParams,
    checked,
    labels,
    batchSettingVisible,
  } = replenishment;
  
  const { replenishmentExists, skuStatus, sort } = searchParams;
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const [createTagVisible, setCreateTagVisible] = useState(false);
  // 搜索的 value
  const [searchText, setSearchText] = useState<string>('');
  // 批量搜索的
  const [batchText, setBatchText] = useState<string>('');
  const [batchVisible, setBatchVisible] = useState(false);
  // 批量设置按钮是否禁用
  let batchSetBtnDisabled = true;
  if (checked.dataRange === 2 || (checked.currentPageSkus && checked.currentPageSkus.length)) {
    batchSetBtnDisabled = false;
  }
  const loadingEffects = useSelector((state: IConnectState) => state.loading.effects);
  const addLabelLoading = loadingEffects['replenishment/fetchSettingRecord'];

  // 执行搜索
  const handleSearch = () => {
    dispatch({
      type: 'replenishment/fetchGoodsInventoryList',
      payload: {
        headersParams,
        searchParams: {
          inputContent: searchText,
          code: batchText,
          current: 1,
          order: null,
        },
      },
      callback: requestErrorFeedback,
    });
  };

  // 查询输入框 change
  const handleSearchTextChange = (event: { target: { value: string } }) => {
    const { target: { value } } = event;
    setSearchText(value);
    setBatchText('');
  };

  // 单选框 change
  const handleRadioChange = (event: RadioChangeEvent, key: string) => {
    const { target: { value } } = event;
    dispatch({
      type: 'replenishment/fetchGoodsInventoryList',
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: { 
          [key]: value,
          current: 1,
        },
      },
      callback: requestErrorFeedback,
    });
  };

  // 环比类型 change
  const handleCompareTypeChange = (event: RadioChangeEvent) => {
    const { target: { value } } = event;
    // 判断当前有没有环比排序，如果有则需要重新请求数据
    if (sort && sort.includes('Fluctuation_')) {
      dispatch({
        type: 'replenishment/fetchGoodsInventoryList',
        payload: { headersParams },
      });
    }
    dispatch({
      type: 'replenishment/changeCompareType',
      payload: value,
    });
  };

  // 添加标签
  const handleLabelAdd = (labelName: string) => {
    const name = labelName.replace(/(^\s*)|(\s*$)/g, '');
    if (labels.length >= 10) {
      message.error('最多只能创建10个标签');
      return;
    }
    if (name.length > 12) {
      message.error('标签最长12个字符');
      return;
    }
    if (name === '') {
      message.error('请输入标签名称');
      return;
    }
    if (labels.some(label => label.labelName === name)) {
      message.error('标签名称不能重复');
      return;
    }
    dispatch({
      type: 'replenishment/createLabel',
      payload: {
        name,
        headersParams,
      },
      callback: requestFeedback,
    });
  };

  // 删除标签
  const handleLabelDelete = (labelId: string) => {
    Modal.confirm({
      content: '若删除此标签，商品中的标签也将被删除',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      maskClosable: true,
      zIndex: 9999,
      onOk() {
        dispatch({
          type: 'replenishment/removeLabel',
          payload: { labelId },
          callback: requestFeedback,
        });
      },
    });
  };

  // 切换批量设置弹窗显示
  const switchBatchSettingVisible = (visible: boolean) => {
    dispatch({
      type: 'replenishment/switchBatchSettingVisible',
      payload: { visible },
    });
  };

  // 标签管理下拉
  const labelsMenu = (
    <div className={styles.labelsMenuDropdown}>
      <div className={styles.title}>标签</div>
      <Search
        enterButton="添加"
        loading={addLabelLoading}
        onSearch={value => handleLabelAdd(value)}
      />
      <div>
        {
          labels.map(label => {
            return (
              <div className={styles.labelCell} key={label.id}>
                <span title={label.labelName}>
                  {label.labelName}
                </span>
                <Iconfont
                  className={styles.deleteBtn}
                  type="icon-cuo"
                  title="删除"
                  onClick={() => handleLabelDelete(label.id)}
                />
              </div>
            );
          })
        }
      </div>
    </div>
  );

  // 批量搜索输入框 change
  const handleTextAreaChange = (event: { target: { value: string } }) => {
    let { target: { value } } = event;
    let valueArr = value.split(/\r\n|\r|\n/);
    // 超过 20 行
    if (valueArr.length > 20) {
      valueArr = valueArr.slice(0, 20);
      value = valueArr.join('\n');
    }
    setBatchText(value);
    setSearchText('');
  };

  // 批量查询框
  const searchDropdownDom = (
    <div className={styles.batchSearchDropdown}>
      <TextArea
        className={styles.TextArea}
        autoSize={{ minRows: 20, maxRows: 20 }}
        placeholder="支持ASIN、SKU混合批量查询，最多20个商品，换行间隔"
        onChange={handleTextAreaChange}
        value={batchText}
      />
      <div className={styles.btns}>
        <Button onClick={() => setBatchVisible(false)}>取消</Button>
        <Button type="primary" onClick={handleSearch}>确定</Button>
      </div>
    </div>
  );

  return (
    <div className={styles.Header}>
      <span className={styles.SearchContainer}>
        <Search
          className={styles.Search}
          placeholder="输入标题、ASIN、SKU或FNSKU"
          onChange={handleSearchTextChange}
          onSearch={handleSearch}
          value={searchText}
          enterButton={
            <Iconfont type="icon-sousuo" className={styles.sousouIcon} />
          }
        />
        {
          searchText
            ?
            <Iconfont
              type="icon-close"
              className={styles.emptySearch}
              onClick={() => setSearchText('')}
            />
            :
            null
        }
      </span>
      <Dropdown
        className={styles.batchSearch}
        overlay={searchDropdownDom}
        trigger={['click']}
        visible={batchVisible}
        onVisibleChange={flag => setBatchVisible(flag)}
      >
        <Button>
          批量查询 {batchVisible ? <UpOutlined /> : <DownOutlined />}
        </Button>
      </Dropdown>
      <Dropdown
        disabled={batchSetBtnDisabled}
        overlay={<BatchSetting />}
        visible={batchSettingVisible}
        placement="bottomRight"
        trigger={['click']}
        arrow
        onVisibleChange={flag => switchBatchSettingVisible(flag)}
      >
        <Button>
          批量设置规则 {batchSettingVisible ? <UpOutlined /> : <DownOutlined />}
        </Button>
      </Dropdown>
      <Dropdown
        overlay={labelsMenu}
        trigger={['click']}
        visible={createTagVisible}
        className={createTagVisible ? styles.active : ''}
        onVisibleChange={flag => setCreateTagVisible(flag)}
      >
        <Button>
          创建标签 {createTagVisible ? <UpOutlined /> : <DownOutlined />}
        </Button>
      </Dropdown>
      <span className={styles.radioGroup}>
        <span>环比：</span>
        <Radio.Group
          options={[
            { label: '百分比', value: 'percent' },
            { label: '数量', value: 'number' },
          ]}
          value={compareType}
          optionType="button"
          buttonStyle="solid"
          onChange={e => handleCompareTypeChange(e)}
        />
      </span>
      <span className={styles.radioGroup}>
        <span>建议补货：</span>
        <Radio.Group
          options={[
            { label: '不限', value: '' },
            { label: '是', value: '1' },
            { label: '否', value: '2' },
          ]}
          value={ replenishmentExists || '' }
          onChange={e => handleRadioChange(e, 'replenishmentExists')}
        />
      </span>
      <span>
        <span>停发：</span>
        <Radio.Group
          options={[
            { label: '不限', value: '' },
            { label: '是', value: 'stop' },
            { label: '否', value: 'normal' },
          ]}
          value={ skuStatus || '' }
          onChange={e => handleRadioChange(e, 'skuStatus')}
        />
      </span>
    </div>
  );
};

export default React.memo(Header);
