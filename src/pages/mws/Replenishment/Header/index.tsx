/*
 查询设置和筛选等头部
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Input, Dropdown, Button, Radio, message, Modal } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { requestErrorFeedback, requestFeedback, Iconfont, objToQueryString, day } from '@/utils/utils';
import { IConnectState } from '@/models/connect';
import CustomCols from '../CustomCols';
import Setting from '../Setting';
import styles from './index.less';

const { Search } = Input;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const replenishment = useSelector((state: IConnectState) => state.replenishment);
  const {
    customCols,
    compareType,
    searchParams,
    checked,
    labels,
    setting,
    updateTime,
  } = replenishment;
  
  const { replenishmentExists, skuStatus, inputContent, sort } = searchParams;
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId, marketplace, storeName } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const [createTagVisible, setCreateTagVisible] = useState(false);
  const batchSettingVisible = setting.visible && !setting.record.sku;
  // 搜索的 value
  const [searchText, setSearchText] = useState<string>('');
  // 批量设置按钮是否禁用
  let batchSetBtnDisabled = true;
  if (checked.dataRange === 2 || (checked.currentPageSkus && checked.currentPageSkus.length)) {
    batchSetBtnDisabled = false;
  }
  // 导出按钮 loading
  const [exportBtnLoading, setExportBtnLoading] = useState<boolean>(false);


  // 执行搜索
  const handleSearch = () => {
    dispatch({
      type: 'replenishment/fetchGoodsInventoryList',
      payload: {
        headersParams,
        searchParams: {
          inputContent: searchText,
        },
      },
      callback: requestErrorFeedback,
    });
  };

  // 查询输入框 change
  const handleSearchTextChange = (event: { target: { value: string } }) => {
    const { target: { value } } = event;
    setSearchText(value);
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

  // 切换显示批量设置弹窗
  const switchSettingVisible = (visible: boolean) => {
    dispatch({
      type: 'replenishment/switchSettingVisible',
      payload: {
        visible,
        record: {
          sku: undefined,
          skuStatus: 'normal',
          labels: [],
          shippingMethodsList: [],
          firstPass: 0,
        },
      },
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

  // 标签管理下拉
  const labelsMenu = (
    <div className={styles.labelsMenuDropdown}>
      <div className={styles.title}>标签</div>
      <Search
        enterButton="添加"
        onSearch={value => handleLabelAdd(value)}
      />
      <div>
        {
          labels.map(label => {
            return (
              <div className={styles.labelCell} key={label.id}>
                <span className={styles.labelName} title={label.labelName}>
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

  // 导出链接
  const getExportFileUrl = () => {
    const qs = objToQueryString({ inputContent, skuStatus, replenishmentExists });
    return `/api/mws/fis/download?${qs}`;
  };

  // 模拟 a 标签实现下载
  const download = (blobUrl: string) => {
    const a = document.createElement('a');
    // 文件名
    const date = day.getNowFormatTime('YYYYMMDD');
    a.download = `${date}_${marketplace}_${storeName}_补货建议.xlsx`;
    a.href = blobUrl;
    a.click();
  };

  // 导出
  const handleDownload = () => {
    setExportBtnLoading(true);
    const url = getExportFileUrl();
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        StoreId: currentShopId,
      }),
    })
      .then(res => res.blob())
      .then(data => {
        const blobUrl = window.URL.createObjectURL(data);
        download(blobUrl);
        setExportBtnLoading(false);
      });
  };
  
  return (
    <div className={styles.Header}>
      <div className={styles.updateTime}>
        <span>更新时间：</span>{updateTime}
      </div>
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
        disabled={batchSetBtnDisabled}
        overlay={<Setting />}
        visible={batchSettingVisible}
        placement="bottomRight"
        trigger={['click']}
        arrow
        onVisibleChange={visible => {
          switchSettingVisible(visible);
        }}
      >
        <Button type="primary">
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
        <Button type="primary">
          创建标签 {createTagVisible ? <UpOutlined /> : <DownOutlined />}
        </Button>
      </Dropdown>
      <span>
        <span className={styles.head}>环比：</span>
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
      <span>
        <span className={styles.head}>建议补货：</span>
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
      <span className={styles.leftLast}>
        <span className={styles.head}>停发：</span>
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
      <span className={styles.right}>
        <CustomCols colsItems={customCols} />
        <Button className={styles.export} onClick={handleDownload} loading={exportBtnLoading}>
          导出
        </Button>
      </span>
    </div>
  );
};

export default React.memo(Header);
