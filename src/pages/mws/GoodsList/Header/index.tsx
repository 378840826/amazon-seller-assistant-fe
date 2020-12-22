import React, { useState } from 'react';
import { Store } from 'redux';
import { useDispatch, useSelector } from 'umi';
import { Input, Dropdown, Button, message } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { requestErrorFeedback, requestFeedback, Iconfont } from '@/utils/utils';
import { IConnectState } from '@/models/connect';
import { ParamsValue } from '@/models/goodsList';
import CustomCols from '../CustomCols';
import Filtrate from './Filtrate';
import BatchSet from './BatchSet';
import ImportFile from './ImportFile';
import GroupEditableCell from './GroupEditableCell';
import CycleSet from './CycleSet';
import { listingStatusDict } from '../cols';
import classnames from 'classnames';
import styles from './index.less';

const { Search, TextArea } = Input;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const goodsListPage = useSelector((state: IConnectState) => state.goodsList);
  const {
    groups,
    rules,
    customCols,
    filtrateParams,
    checkedGoodsIds,
    goods: { records },
    cycle,
  } = goodsListPage;
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { currency, id: currentShopId, marketplace } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const [visible, setVisible] = useState({
    batchSearch: false,
    batchSet: false,
    filtrate: false,
    importFile: false,
    groups: false,
  });
  // 单个查询的 value
  const [searchText, setSearchText] = useState<string>('');
  // 批量查询的 value
  const [batchText, setBatchText] = useState<string>('');
  const groupsOptions = groups.map(group => ({ value: group.id, name: group.groupName }));
  const rulesOptions = rules.map(rule => ({ value: rule.id, name: rule.name }));
  // 选中的商品的 asin， 用于批量添加监控
  const checkedGoodsAsins = checkedGoodsIds.map(checkedId => {
    return records.find(goods => goods.id === checkedId )?.asin;
  });

  // 获取空筛选条件
  const getEmptyFiltrateParams = () => {
    const params = { ...filtrateParams };
    Object.keys(params).forEach(key => {
      if (key === 'groupId' || key === 'ruleId') {
        params[key] = '';
      } else {
        params[key] = undefined;
      }
    });
    return params;
  };

  // 判断筛选参数是否所有字段都为无效 value
  const isEmptyFiltrateParams = () => {
    let result = true;
    const keys = Object.keys(filtrateParams);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      if (filtrateParams[key]) {
        result = false;
        break;
      }
    }
    return result;
  };

  // 收起批量查询
  const handleHideSearchDropdown = () => {
    setVisible({ ...visible, batchSearch: false });
  };

  // 展开/收起筛选器
  const handleClickFiltrate = () => {
    setVisible({ ...visible, filtrate: !visible.filtrate });
  };
  
  // 执行筛选
  const handleFiltrate = (values: { [key: string]: Store }) => {
    setVisible({ ...visible, filtrate: !visible.filtrate });
    dispatch({
      type: 'goodsList/fetchGoodsList',
      payload: {
        headersParams,
        filtrateParams: { ...values },
        searchParams: { current: 1, order: null },
      },
      callback: requestErrorFeedback,
    });
  };

  // 执行查询和批量查询
  const handleSearch = () => {
    dispatch({
      type: 'goodsList/fetchGoodsList',
      payload: {
        headersParams,
        filtrateParams: {
          code: batchText,
          search: searchText,
        },
        searchParams: { current: 1, order: null },
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
        <Button onClick={handleHideSearchDropdown}>取消</Button>
        <Button type="primary" onClick={handleSearch}>确定</Button>
      </div>
    </div>
  );

  // 删除筛选项面包屑
  const handleClickDelete = (key: string) => {
    const newFiltrateParams = { ...filtrateParams };
    // 分组和规则的筛选值“全部” 的值是 空字符串
    if (key === 'groupId' || key === 'ruleId') {
      newFiltrateParams[key] = '';
    } else {
      newFiltrateParams[key] = undefined;
    }
    newFiltrateParams[`${key}Min`] = undefined;
    newFiltrateParams[`${key}Max`] = undefined;
    dispatch({
      type: 'goodsList/fetchGoodsList',
      payload: {
        headersParams,
        filtrateParams: newFiltrateParams,
        searchParams: { current: 1, order: null },
      },
      callback: requestErrorFeedback,
    });
  };

  // 清空筛选
  const handleClickEmpty = () => {
    setBatchText('');
    setSearchText('');
    dispatch({
      type: 'goodsList/fetchGoodsList',
      payload: {
        headersParams,
        filtrateParams: getEmptyFiltrateParams(),
        searchParams: { current: 1, order: null },
      },
      callback: requestErrorFeedback,
    });
  };

  // 修改分组名称
  const handleGroupEditCallback = (id: string, value: string) => {
    if (groups.some(group => group.groupName === value)) {
      message.error('分组名称不能重复');
      return;
    }
    dispatch({
      type: 'goodsList/modifyGroupName',
      payload: {
        id,
        groupName: value,
        headersParams,
      },
      callback: requestFeedback,
    });
  };

  // 删除分组
  const handleGroupDelete = (id: string) => {
    dispatch({
      type: 'goodsList/removeGroup',
      payload: { id },
      callback: requestFeedback,
    });
  };

  // 添加分组
  const handleGroupAdd = (groupName: string) => {
    if (groups.length >= 10) {
      message.error('最多只能添加10个分组！');
      return;
    }
    if (groups.some(group => group.groupName === groupName)) {
      message.error('分组名称不能重复');
      return;
    }
    dispatch({
      type: 'goodsList/addGroup',
      payload: {
        groupName,
        headersParams,
      },
      callback: requestFeedback,
    });
  };

  // 设置补货周期
  const handleSetCycle = (cycleValue: string) => {
    if (!cycleValue) {
      message.error('请输入补货周期');
      return;
    }
    dispatch({
      type: 'goodsList/updateCycle',
      payload: {
        headersParams,
        cycle: Number(cycleValue),
        skus: records.map(goods => goods.sku),
      },
      callback: requestFeedback,
    });
  };

  // 面包屑名称 分组调价规则单选框等显示名称而不是id
  const valueToName = (key: string, value: ParamsValue) => {
    let name: ParamsValue = '';
    switch (key) {
    case 'groupId':
      groupsOptions.forEach(group => {
        if (group.value === value) {
          name = group.name;
        }
      });
      break;
    case 'ruleId':
      rulesOptions.forEach(rule => {
        if (rule.value === value) {
          name = rule.name;
        }
      });
      break;
    case 'ac':
      name = value === 'true' ? '有' : '无';
      break;
    case 'adjustSwitch':
      name = value === 'true' ? '开' : '关';
      break;
    case 'fulfillmentChannel':
      name = value;
      break;
    case 'status':
      name = listingStatusDict[String(value)];
      break;
    case 'code': case 'search':
      name = value;
      break;          
    default:
      console.error('筛选参数key不存在');
      break;
    }
    return name;
  };

  // 生成面包屑
  const createCrumb = (values: ParamsValue[] | undefined, key: string, title: string) => {
    const empty = <span className={styles.empty}>__</span>;
    return (
      <span key={key} className={styles.tag}>
        <span className={styles.secondary}>{title}：</span>
        {
          values && values.length === 1
            ?
            <>{valueToName(key, values[0])}</>
            :
            <>{values && values[0] || empty} - { values && values[1] || empty}</>
        }
        <span
          className={styles.tagCloseIcon}
          onClick={() => {
            handleClickDelete(key);
          }}
        >
          <Iconfont type="icon-guanbi1" />
        </span>
      </span>
    );
  };

  const renderCrumbs = () => {
    if (!visible.filtrate && !isEmptyFiltrateParams()) {
      const titleDict = {
        reviewScore: '评分',
        reviewCount: 'Reviews',
        price: `售价(${currency})`,
        sellable: '可售库存',
        profit: `利润(${currency})`,
        minPrice: `最低价(${currency})`,
        maxPrice: `最高价(${currency})`,
        cost: `成本(${currency})`,
        freight: `头程(${currency})`,
        profitMargin: '利润率',
        dayOrder7Count: '7天订单',
        dayOrder30Count: '30天订单',
        ranking: '排名',
        groupId: '分组',
        ruleId: '调价规则',
        adjustSwitch: '调价开关',
        ac: 'Amazon\'s Choice',
        fulfillmentChannel: '发货方式',
        status: '状态',
        code: '批量查询',
        search: '查询',
      };
      const obj: {
        [key: string]: (Array<ParamsValue>) | undefined;
      } = {};
      Object.keys(filtrateParams).forEach(key => {
        if (filtrateParams[key]) {
          const k = key.slice(0, -3);
          if (key.slice(-3) === 'Min' || key.slice(-3) === 'Max') {
            obj[k] ? null : obj[k] = [filtrateParams[`${k}Min`], filtrateParams[`${k}Max`]];
          } else {
            obj[key] = [filtrateParams[key]];
          }
        }
      });
      const keys = Object.keys(obj);
      return (
        <div className={styles.crumbs}>
          { keys.map(key => createCrumb(obj[key], key, titleDict[key])) }
          { keys.length ? <Button type="link" onClick={handleClickEmpty}>清空条件</Button> : null }
        </div>
      );
    }
  };

  // 分组管理下拉
  const groupsMenu = (
    <div className={styles.groupsMenuDropdown}>
      <Search
        placeholder="请输入分组名称"
        enterButton="添加"
        maxLength={6}
        onSearch={value => handleGroupAdd(value)}
      />
      <div>
        {
          groups.map(group => {
            if (group.groupName === '未分组') {
              return;
            }
            return (
              <div className={styles.editCellContainer} key={group.id}>
                {
                  <GroupEditableCell
                    inputValue={group.groupName}
                    maxLength={20}
                    confirmCallback={value => handleGroupEditCallback(group.id, value)}
                    deleteCallback={() => handleGroupDelete(group.id)}
                  />
                }
              </div>
            );
          })
        }
      </div>
    </div>
  );

  return (
    <div className={styles.header}>
      <div className={styles.goodsFiltrate}>
        <span className={styles.SearchContainer}>
          <Search
            className={styles.Search}
            placeholder="输入标题、ASIN、SKU"
            onChange={handleSearchTextChange}
            onSearch={handleSearch}
            value={searchText}
            enterButton={
              <Iconfont type="icon-sousuo" style={{ fontSize: 19, paddingTop: 2 }} />
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
          visible={visible.batchSearch}
          onVisibleChange={flag => setVisible({ ...visible, batchSearch: flag })}
        >
          <Button type="primary">
            批量查询 {visible.batchSearch ? <UpOutlined /> : <DownOutlined />}
          </Button>
        </Dropdown>
        <Button
          type="primary"
          className={styles.btnFiltrate}
          onClick={handleClickFiltrate}
        >
          高级筛选 { visible.filtrate ? <UpOutlined /> : <DownOutlined /> }
        </Button>
      </div>
      {
        visible.filtrate
          ? 
          <Filtrate
            handleClickFiltrate={handleClickFiltrate}
            handleFiltrate={handleFiltrate}
            filtrateParams={filtrateParams}
            groupsOptions={groupsOptions}
            rulesOptions={rulesOptions}
            currency={currency}
            getEmptyFiltrateParams={getEmptyFiltrateParams}
          />
          : null
      }
      { renderCrumbs() }
      {/* 这个 bfcDiv 是为了创建一个 BFC 避免 margin 重叠导致难以还原设计稿 */}
      <div className={styles.bfcDiv}>
        <div className={styles.settingBar}>
          <Dropdown
            disabled={!checkedGoodsIds.length}
            overlay={<BatchSet
              groupsOptions={groupsOptions}
              rulesOptions={rulesOptions}
              currentShop={currentShop}
              goodsListRecords={records}
              checkedGoodsIds={checkedGoodsIds}
              checkedGoodsAsins={checkedGoodsAsins}
              marketplace={marketplace}
            />}
            trigger={['click']}
            visible={visible.batchSet}
            className={visible.batchSet ? styles.active : ''}
            onVisibleChange={flag => setVisible({ ...visible, batchSet: flag })}
          >
            <Button title="勾选下方多个商品，可进行批量快速设置">
              批量设置 { visible.batchSet ? <UpOutlined className="anticon-down" /> : <DownOutlined /> }
            </Button>
          </Dropdown>
          <Dropdown
            overlay={<ImportFile />}
            trigger={['click']}
            visible={visible.importFile}
            className={classnames(styles.importFile, visible.importFile ? styles.active : '')}
            onVisibleChange={flag => setVisible({ ...visible, importFile: flag })}
          >
            <Button title="支持批量导入售价、成本、头程、最低价和最高价">
                文件导入<Iconfont className={styles.icon} type="icon-tishi2" />
            </Button>
          </Dropdown>
          <Dropdown
            overlay={groupsMenu}
            trigger={['click']}
            visible={visible.groups}
            className={visible.groups ? styles.active : ''}
            onVisibleChange={flag => setVisible({ ...visible, groups: flag })}
          >
            <Button>分组管理</Button>
          </Dropdown>
          <CycleSet cycle={cycle} handleSetCycle={handleSetCycle} />
          <span>
            <CustomCols colsItems={customCols} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
