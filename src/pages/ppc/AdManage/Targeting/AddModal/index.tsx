/**
 * 添加 targeting 弹窗
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import {
  Select,
  Button,
  Modal,
  message,
  Tabs,
  Table,
  Typography,
  Input,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import { ISimpleGroup } from '../../index.d';
import BatchSetBid, { IComputedBidParams } from '../../components/BatchSetBid';
import DetailSetDropdown from './DetailSetDropdown';
import editable from '@/pages/components/EditableCell';
import GoodsImg from '@/pages/components/GoodsImg';
import GoodsIcon from '@/pages/components/GoodsIcon';
import { requestErrorFeedback, requestFeedback, getShowPrice, strToMoneyStr } from '@/utils/utils';
import { createIdTargeting, getBidExprVlaue, isValidTargetingBid } from '../../utils';
import { IBrand, ICategoryTargeting, IGoodsTargeting } from '../../index.d';
import classnames from 'classnames';
import commonStyles from '../../common.less';
import styles from './index.less';

const { Option } = Select;
const { TabPane } = Tabs;
const { Paragraph } = Typography;
const { TextArea } = Input;

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const AddTargetingModal: React.FC<IProps> = function(props) {
  const dispatch = useDispatch();
  const { visible, setVisible } = props;
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    suggestedCategory: loadingEffect['adManage/fetchSuggestedCategory'],
    add: loadingEffect['adManage/addTargeting'],
    fetchGroupList: loadingEffect['adManage/fetchSimpleGroupList'],
  };
  // 店铺
  const {
    id: currentShopId, marketplace, currency,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  const adManage = useSelector((state: IConnectState) => state.adManage);
  const { treeSelectedInfo, campaignSimpleList } = adManage;
  const [addState, setAddState] = useState({
    campaignId: '',
    groupId: '',
    groupDefaultBid: 0,
  });
  // 供选择的广告组
  const [groupSimpleList, setGroupSimpleList] = useState<ISimpleGroup[]>([]);
  // 建议分类
  const [suggestedCategory, setSuggestedCategory] = useState<ICategoryTargeting[]>([]);
  // 正在进行细化的分类的id
  const [detailSettingCategoryId, setDetailSettingCategoryId] = useState<string>();
  // 建议品牌
  const [suggestedBrands, setSuggestedBrands] = useState<IBrand[]>([]);
  // 建议商品
  const [suggestedGoods, setSuggestedGoods] = useState<IGoodsTargeting[]>([]);
  // 输入商品-asin
  const [asinTextArea, setAsinTextArea] = useState<string>('');
  // 已选 Targeting
  const [selectedTargetingList, setSelectedTargetingList] = useState<any>([]);
  // 已选 Targeting 的临时 id 集合
  const [selectedTemporarIdList, setSelectedTemporarIdList] = useState<string[]>([]);
  // 已选 Targeting 的勾选，格式为临时 id, 和 Table 的 rowKey 一致
  const [checkedSelectedTargeting, setCheckedSelectedTargeting] = useState<string[]>([]);

  // 获取广告活动或广告组
  useEffect(() => {
    // 获取简单广告活动列表或广告组简单列表
    if (currentShopId !== '-1') {
      // 判断菜单树是否选中广告活动或广告组
      const { campaignId, groupId } = treeSelectedInfo;
      // 没有选中任何菜单树的情况，获取广告活动列表
      if (!campaignId) {
        dispatch({
          type: 'adManage/fetchSimpleCampaignList',
          payload: {
            headersParams: { StoreId: currentShopId },
          },
          callback: requestErrorFeedback,
        });
      } else {
        // 选中广告活动且没选中广告组的情况，获取选中广告活动下的广告组
        if (!groupId) {
          dispatch({
            type: 'adManage/fetchSimpleGroupList',
            payload: {
              headersParams: { StoreId: currentShopId },
              campaignId,
            },
            callback: (code: number, msg: string, data: ISimpleGroup[]) => {
              requestErrorFeedback(code, msg);
              setGroupSimpleList(data);
            },
          });
        }
      }
      // 如果已选中广告活动或广告组，设置 addState 
      setAddState({
        ...addState,
        campaignId: campaignId || '',
        groupId: groupId || '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId, treeSelectedInfo]);

  // 获取建议分类和建议商品
  useEffect(() => {
    if (currentShopId !== '-1' && addState.groupId) {
      dispatch({
        type: 'adManage/fetchSuggestedCategory',
        payload: {
          headersParams: { StoreId: currentShopId },
          campaignId: addState.campaignId,
          groupId: addState.groupId,
        },
        callback: (code: number, msg: string, data: ICategoryTargeting[]) => {
          requestErrorFeedback(code, msg);
          setSuggestedCategory(data.map(item => ({ ...item, bid: addState.groupDefaultBid })));
        },
      });
      dispatch({
        type: 'adManage/fetchSuggestedGoods',
        payload: {
          headersParams: { StoreId: currentShopId },
          campaignId: addState.campaignId,
          groupId: addState.groupId,
        },
        callback: (code: number, msg: string, data: IGoodsTargeting[]) => {
          requestErrorFeedback(code, msg);
          setSuggestedGoods(data.map(item => ({ ...item, bid: addState.groupDefaultBid })));
        },
      });
      // 切换广告组后清空已选表格
      setSelectedTargetingList([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentShopId, addState.groupId]);

  // 获取推荐品牌
  useEffect(() => {
    if (currentShopId !== '-1' && detailSettingCategoryId) {
      dispatch({
        type: 'adManage/fetchSuggestedBrands',
        payload: {
          headersParams: { StoreId: currentShopId },
          categoryId: detailSettingCategoryId,
        },
        callback: (code: number, msg: string, data: IBrand[]) => {
          requestErrorFeedback(code, msg);
          setSuggestedBrands(data);
        },
      });
    }
  }, [dispatch, currentShopId, detailSettingCategoryId]);

  // 更新临时id集合
  useEffect(() => {
    if (currentShopId !== '-1') {
      setSelectedTemporarIdList(selectedTargetingList.map(
        (selected: any) => selected.id)
      );
    }
  }, [currentShopId, selectedTargetingList]);

  /**
   * 获取已选Targeting的建议竞价并更新到已选列表
   * @param records 要获取建议竞价的targeting
   * @param list 已选的targeting
   */
  function getSelectedTargetingSuggestedBid(
    records: ICategoryTargeting[], list: ICategoryTargeting[]
  ): void;
  function getSelectedTargetingSuggestedBid(
    records: IGoodsTargeting[], list: IGoodsTargeting[]
  ): void;
  function getSelectedTargetingSuggestedBid(records: any, list: any) {
    let payload;
    let actionType;
    // 判断是分类还是商品
    if (records[0].asin) {
      actionType = 'adManage/fetchSuggestedGoodsSuggestedBid';
      payload = {
        headersParams: { StoreId: currentShopId },
        campaignId: addState.campaignId,
        groupId: addState.groupId,
        asins: records.map((record: IGoodsTargeting) => record.asin),
      };
    } else if (records[0].categoryId) {
      actionType = 'adManage/fetchSuggestedCategorySuggestedBid';
      payload = {
        headersParams: { StoreId: currentShopId },
        campaignId: addState.campaignId,
        groupId: addState.groupId,
        categories: records,
      };
    } else {
      console.error('获取建议竞价参数错误');
      return false;
    }
    dispatch({
      type: actionType,
      payload,
      callback: (code: number, msg: string, records: any[] ) => {        
        requestErrorFeedback(code, msg);
        const newList = [...list];
        for (let i = 0; i < newList.length; i++) {
          const categoryTargeting = newList[i];
          for (let j = 0; j < records.length; j++) {
            const resItem = createIdTargeting(records[j]);
            if (categoryTargeting.id === resItem.id) {
              categoryTargeting.suggested = resItem.suggested;
              categoryTargeting.rangeStart = resItem.rangeStart;
              categoryTargeting.rangeEnd = resItem.rangeEnd;
              records.splice(j, 1);
              j--;
              break;
            }
          }
        }
        setSelectedTargetingList(newList);
      },
    });
  }

  /**
   * 已选 targeting 应用建议竞价
   * @param targeting 需要应用建议竞价的已选 targeting
   */
  function handleApplySuggestedBid(targeting: ICategoryTargeting | IGoodsTargeting) {
    const newList = [...selectedTargetingList];
    for (let i = 0; i < newList.length; i++) {
      const tg = newList[i];
      if ( tg.id === targeting.id) {
        tg.bid = tg.suggested;
      }
    }
    setSelectedTargetingList(newList);
  }

  // 添加建议分类或建议商品到已选列表
  function selectTargeting(targetingArr: ICategoryTargeting[] | IGoodsTargeting[]) {
    // 判断是否重复
    for (let i = 0; i < selectedTargetingList.length; i++) {
      const selected = selectedTargetingList[i];
      for (let j = 0; j < targetingArr.length; j++) {
        const targeting = targetingArr[j];
        if (targeting.id === selected.id) {
          return false;
        }
      }
    }
    const newList = [...targetingArr, ...selectedTargetingList];
    setSelectedTargetingList(newList);
    getSelectedTargetingSuggestedBid(targetingArr as any, newList);
    return true;
  }

  // 点击选择建议分类或建议商品
  function handleSelect(targetingArr: ICategoryTargeting[] | IGoodsTargeting[]) {
    const result = targetingArr.map((targeting: any) => createIdTargeting(targeting));
    !selectTargeting(result) && message.error('不能重复选择');
  }

  // Targeting去重
  function getUniqueTargetingList(list: any) {
    const newList = [];
    const obj = {};
    for (let i = 0; i < list.length; i++){
      if (!obj[list[i].id as string]){
        newList.push(list[i]);
        obj[list[i].id as string] = true;
      }
    }
    return newList;
  }

  // 通过 asin 按格式生成 targeting
  function createGoodsTargeting(asins: string[], bid: number) {
    const goodsTargetingArr: IGoodsTargeting[] = asins.map(asin => (
      createIdTargeting({
        asin,
        bid,
        title: '',
        reviewScore: null,
        reviewCount: null,
        price: null,
        imgUrl: '',
      })
    ));
    return goodsTargetingArr;
  }

  // 选择批量输入的 asin
  function handleSelectAsinTextArea() {
    // 需要选择广告组才能获取建议竞价
    if (!addState.groupId) {
      message.error('请先选择广告活动和广告组');
      return;
    }
    const asinArr = asinTextArea.split((/[\n+|\s+|\\,+]/)).filter(Boolean);
    const isNotAsin = asinArr.some(asin => asin.length !== 10 || asin[0].toUpperCase() !== 'B');
    if (isNotAsin) {
      message.error('部分ASIN输入格式有误，请重新输入');
      return;
    }
    // 创建商品 targeting
    const newTargeting = createGoodsTargeting(asinArr, addState.groupDefaultBid);
    const allTargeting = [...newTargeting, ...selectedTargetingList];
    // 去重
    const newList = getUniqueTargetingList(allTargeting);
    setSelectedTargetingList(newList);
    getSelectedTargetingSuggestedBid(newTargeting, newList);
  }

  // 全选建议分类/建议商品
  function handleSelectAllSuggested(type: 'category' | 'goods') {
    let allSuggested: ICategoryTargeting[] | IGoodsTargeting[] = [];
    if (type === 'category') {
      allSuggested = suggestedCategory;
    } else if (type === 'goods') {
      allSuggested = suggestedGoods;
    }
    const all = allSuggested.map((category: any ) => createIdTargeting(category));
    // 合并并去重
    const newList = getUniqueTargetingList([...all, ...selectedTargetingList]);
    setSelectedTargetingList(newList);
    getSelectedTargetingSuggestedBid(all, newList);
  }

  // 批量操作已选 targeting（批量设置竞价）
  function handleBatchSetSelectedTargetingBid (exprParams: IComputedBidParams) {
    // 获取计算后的值和id
    const data = getBidExprVlaue({
      marketplace,
      exprParams,
      checkedIds: checkedSelectedTargeting,
      records: selectedTargetingList,
    });
    if (data) {
      const newList = [...selectedTargetingList];
      for (let i = 0; i < data.length; i++) {
        const computationItem = data[i];
        newList.forEach(newItem => {
          if (computationItem.id === newItem.id) {
            newItem.bid = Number(computationItem.bid);
          }
        });
      }
      setSelectedTargetingList(newList);
      // 用于指定关闭弹窗
      return true;
    }
  }

  // 批量操作已选 targeting（删除、应用建议竞价）
  function handleBatchSetSelectedTargeting(type: 'delete' | 'applyBid') {
    let newList: IGoodsTargeting[] | ICategoryTargeting[] = [];
    switch (type) {
    case 'delete':
      newList = selectedTargetingList.filter((item: any) => {
        let result = true;
        for (let i = 0; i < checkedSelectedTargeting.length; i++) {
          const key = checkedSelectedTargeting[i];
          if (item.id === key) {
            result = false;
            break;
          }
        }
        return result;
      });
      // 更新勾选
      setCheckedSelectedTargeting([]);
      break;
    case 'applyBid':
      newList = selectedTargetingList.map((item: any) => {
        let kw = item;
        checkedSelectedTargeting.forEach(key => {
          if (item.id === key) {
            kw = { ...item, bid: item.suggested };
          }
        });
        return kw;
      });
      break;
    default:
      console.error('handleBatchSetSelectedTargeting 参数错误');
      break;
    }
    setSelectedTargetingList(newList);
  }

  // 删除已选的 Targeting
  function handleDelete(record: ICategoryTargeting | IGoodsTargeting) {
    const newList = selectedTargetingList.filter((item: any) => {
      return item.id !== record.id;
    });
    setSelectedTargetingList(newList);
    // 更新勾选
    const newChecked = checkedSelectedTargeting.filter(key => key !== record.id);
    setCheckedSelectedTargeting(newChecked);
  }

  // 选择广告活动
  function handleCampaignChange(id: string) {
    setAddState({
      ...addState,
      campaignId: id,
      groupId: '',
    });
    setGroupSimpleList([]);
    dispatch({
      type: 'adManage/fetchSimpleGroupList',
      payload: {
        headersParams: { StoreId: currentShopId },
        campaignId: id,
      },
      callback: (code: number, msg: string, data: ISimpleGroup[]) => {
        requestErrorFeedback(code, msg);
        setGroupSimpleList(data);
      },
    });
  }

  // 选择广告组
  function handleGroupChange(groupId: string) {
    // 默认竞价
    const group = groupSimpleList.find(group => group.id === groupId);
    const groupDefaultBid = group?.defaultBid || 0;
    setAddState({
      ...addState,
      groupId: groupId,
      groupDefaultBid,
    });
  }

  // 广告活动选择器
  function renderCampaignSelect() {
    return !treeSelectedInfo.campaignId && (
      <Select
        showSearch
        // 空字符串时，placeholder不会显示
        value={addState.campaignId || undefined}
        className={commonStyles.addSelect}
        placeholder="选择广告活动"
        onChange={handleCampaignChange}
        filterOption={(input, option) => {
          return option?.children.toLowerCase().includes(input.toLowerCase());
        }}
      >
        {
          campaignSimpleList.map(item => (
            item.campaignType !== 'sb' && 
            <Option key={item.campaignId} value={item.campaignId}>{ item.name }</Option>)
          )
        }
      </Select>
    );
  }

  // 广告组选择器
  function renderGroupSelect() {
    // 已选中广告活动并且没选中广告组的情况才显示
    return addState.campaignId && !treeSelectedInfo.groupId && (
      <Select
        showSearch
        // 空字符串时，placeholder不会显示
        value={addState.groupId || undefined}
        className={commonStyles.addSelect}
        loading={loading.fetchGroupList}
        placeholder="选择广告组"
        onChange={value => handleGroupChange(value)}
        filterOption={(input, option) => {
          return option?.children.toLowerCase().includes(input.toLowerCase());
        }}
      >
        {
          groupSimpleList.map(item => (
            <Option key={item.id} value={item.id}>{ item.name }</Option>)
          )
        }
      </Select>
    );
  }

  // 添加 targeting
  function handleAdd() {
    if (!addState.campaignId || !addState.groupId) {
      message.error('请选择广告活动和广告组！');
      return;
    }
    const categories: ICategoryTargeting[] = [];
    const asins: IGoodsTargeting[] = [];
    selectedTargetingList.forEach((targeting: any) => {
      targeting.asin && asins.push(targeting);
      targeting.categoryId && categories.push(targeting);
    });
    dispatch({
      type: 'adManage/addTargeting',
      payload: {
        headersParams: { StoreId: currentShopId },
        campaignId: addState.campaignId,
        groupId: addState.groupId,
        targets: {
          categories,
          asins,
        },
      },
      callback: (code: number, msg: string) => {
        requestFeedback(code, msg);
        if (code === 200) {
          setTimeout(() => {
            window.location.replace('./manage?tab=targeting');
          }, 1000);
        }
      },
    });
  }

  // 渲染分类
  function renderCategory(record: ICategoryTargeting, selected?: boolean) {
    if (selected) {
      return (
        <>
          <div>
            {record.categoryName}
          </div>
          <div className={styles.path}>
            { record.brandId && `品牌="${record.brandName}"，` }
            {
              (record.priceGreaterThan || record.priceLessThan) && 
              `价格="${record.priceGreaterThan || '_'}-${record.priceLessThan || '_'}"，`
            }
            {
              (record.reviewRatingGreaterThan || record.reviewRatingLessThan) && 
              `评分="${record.reviewRatingGreaterThan || '_'}-${record.reviewRatingLessThan || '_'}"`
            }
          </div>
        </>
      );
    }
    return (
      <>
        <div>
          {record.categoryName}
          <DetailSetDropdown
            visible={detailSettingCategoryId === record.categoryId}
            onVisibleChange={visible => setDetailSettingCategoryId(visible ? record.categoryId : '')}
            onFiltrate={selectTargeting}
            currency={currency}
            suggestedBrands={suggestedBrands}
            categoryId={record.categoryId}
            categoryName={record.categoryName}
            categoryPath={record.path}
            bid={addState.groupDefaultBid}
          />
        </div>
        <div className={styles.path} title={record.path}>{record.path}</div>
      </>
    );
  }

  // 渲染商品
  function renderGoods(record: IGoodsTargeting) {
    // 因数据不全，手动添加的商品无法获取商品详情，只显示 asin
    if (!record.title && !record.imgUrl && !record.price) {
      return record.asin;
    }
    return (
      <div className={styles.goodsInfoContainer}>
        <GoodsImg src={record.imgUrl} alt="商品" width={46} />
        <div className={styles.goodsInfoContent}>
          <Paragraph ellipsis className={styles.goodsTitle}>
            { GoodsIcon.link() }
            <a title={record.title} href={record.imgUrl} target="_blank" rel="noopener noreferrer">{record.title}</a>
          </Paragraph>
          <div className={styles.goodsInfoLine}>
            <span className={styles.asin}>{record.asin}</span>
            <span className={styles.review}>
              <span className={styles.reviewScore}>{record.reviewScore}</span>
              <span className={styles.reviewCount}>({`${record.reviewCount}` || '-'})</span>
            </span>
            <span className={styles.price}>
              { getShowPrice(record.price, marketplace, currency) }
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 已选表格的勾选配置
  const selectedTargetingRowSelection = {
    fixed: true,
    selectedRowKeys: checkedSelectedTargeting,
    columnWidth: 36,
    onChange: (selectedRowKeys: any[]) => {
      setCheckedSelectedTargeting(selectedRowKeys);
    },
  };

  // 建议分类表格列
  const suggestedCategoryColumns: ColumnProps<ICategoryTargeting>[] = [
    {
      title: '建议分类',
      dataIndex: 'categoryName',
      width: 340,
      render: (_, record) => renderCategory(record),
    }, {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 40,
      render: (_, record) => {
        const isSelected = selectedTemporarIdList.includes(
          createIdTargeting(record).id as string
        );
        if (isSelected) {
          return <Button type="link" disabled className={styles.selectItemBtn}>已选</Button>;
        }
        return (
          <Button
            type="link"
            className={classnames(commonStyles.selectBtn, styles.selectItemBtn)}
            disabled={isSelected}
            onClick={() => handleSelect([record])}
          >选择</Button>
        );
      },
    },
  ];

  // 建议商品表格列
  const suggestedGoodsColumns: ColumnProps<IGoodsTargeting>[] = [
    {
      title: '商品信息',
      dataIndex: 'asin',
      align: 'center',
      width: 320,
      render: (_, record) => renderGoods(record),
    }, {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 40,
      render: (_, record) => {
        const isSelected = selectedTemporarIdList.includes(
          createIdTargeting(record).id as string
        );
        if (isSelected) {
          return <Button type="link" disabled className={styles.selectItemBtn}>已选</Button>;
        }
        return (
          <Button
            type="link"
            className={classnames(commonStyles.selectBtn, styles.selectItemBtn)}
            disabled={isSelected}
            onClick={() => handleSelect([record])}
          >选择</Button>
        );
      },
    },
  ];

  // 已选 Targeting 列
  const selectedColumns: ColumnProps<ICategoryTargeting & IGoodsTargeting>[] = [
    {
      title: 'Targeting',
      dataIndex: '',
      width: 240,
      render: (_, record) => {
        if (record.categoryId) {
          return renderCategory(record, true);
        } else if (record.asin) {
          return renderGoods(record);
        }
      },
    }, {
      title: '建议竞价',
      dataIndex: 'suggested',
      align: 'center',
      width: 100,
      render: (value, record) => (
        <>
          <div className={commonStyles.suggested}>
            {getShowPrice(value, marketplace, currency)}
            <Button
              disabled={!value}
              onClick={() => handleApplySuggestedBid(record)}
            >应用</Button>
          </div>
          <div>
            ({getShowPrice(record.rangeStart, marketplace, currency)}
            -
            {getShowPrice(record.rangeEnd, marketplace, currency)})
          </div>
        </>
      ),
    }, {
      title: '竞价',
      dataIndex: 'bid',
      align: 'right',
      width: 100,
      render: (value, record) => (
        editable({
          inputValue: getShowPrice(value),
          formatValueFun: strToMoneyStr,
          maxLength: 10,
          prefix: currency,
          ghostEditBtn: true,
          confirmCallback: newBid => {
            const [isValid, minBid] = isValidTargetingBid(Number(newBid), marketplace);
            if (isValid) {
              const newList = [...selectedTargetingList];
              const index = newList.findIndex(item => item.id === record.id);
              newList[index].bid = Number(newBid);
              setSelectedTargetingList(newList);
            } else {
              message.error(`竞价不能低于${minBid}`);
            }
          },
        })
      ),
    }, {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 40,
      render: (_, record) => (
        <Button
          type="link"
          className={commonStyles.deleteBtn}
          onClick={() => handleDelete(record)}
        >删除</Button>
      ),
    },
  ];

  // 渲染建议分类全选按钮
  function renderSelectAllCategoryBtn() {
    let isDisabled = true;
    suggestedCategory.forEach(suggested => {
      const id = createIdTargeting(suggested).id as string;
      if (!selectedTemporarIdList.includes(id)) {
        isDisabled = false;
      }
    });
    return isDisabled
      ? <Button type="link" disabled className={styles.selectAllBtn}>已全选</Button>
      : <Button
        type="link"
        className={styles.selectAllBtn}
        onClick={() => handleSelectAllSuggested('category')}
      >全选</Button>;
  }

  // 渲染建议商品全选按钮
  function renderSelectAllGoodsBtn() {
    let isDisabled = true;
    suggestedGoods.forEach(suggested => {
      const id = createIdTargeting(suggested).id as string;
      if (!selectedTemporarIdList.includes(id)) {
        isDisabled = false;
      }
    });
    return isDisabled
      ? <Button type="link" disabled className={styles.selectAllBtn}>已全选</Button>
      : <Button
        type="link"
        className={styles.selectAllBtn}
        onClick={() => handleSelectAllSuggested('goods')}
      >全选</Button>;
  }

  // 分类标签内容
  const categoryTabs = (
    <Tabs defaultActiveKey="suggest">
      <TabPane tab="建议分类" key="suggest">
        { renderSelectAllCategoryBtn() }
        <Table
          loading={loading.suggestedCategory}
          className={styles.suggestedTable}
          columns={suggestedCategoryColumns}
          scroll={{ x: 'max-content', y: '350px' }}
          rowKey="categoryId"
          dataSource={suggestedCategory}
          locale={{ emptyText: '未查询到建议分类，请重新选择广告组' }}
          pagination={false}
        />
      </TabPane>
      <TabPane tab="搜索分类" key="search">
        <div style={{ textAlign: 'center', width: 420, height: 405, paddingTop: 50 }}>
          功能开发中...
        </div>
      </TabPane>
    </Tabs> 
  );

  // 商品标签内容
  const goodsTabs = (
    <Tabs defaultActiveKey="suggest" >
      <TabPane tab="建议商品" key="suggest">
        { renderSelectAllGoodsBtn() }
        <Table
          loading={loading.suggestedCategory}
          className={styles.suggestedTable}
          columns={suggestedGoodsColumns}
          scroll={{ x: 'max-content', y: '350px' }}
          rowKey="asin"
          dataSource={suggestedGoods}
          locale={{ emptyText: '未查询到建议商品，请重新选择广告组' }}
          pagination={false}
        />
      </TabPane>
      <TabPane tab="搜索商品" key="search">
        <div style={{ textAlign: 'center', width: 420, height: 405, paddingTop: 50 }}>
          功能开发中...
        </div>
      </TabPane>
      <TabPane tab="批量输入" key="input">
        <TextArea
          placeholder="请输入多个ASIN，用英文逗号，空格或者换行分割"
          value={asinTextArea}
          className={styles.addTextArea}
          onChange={e => setAsinTextArea(e.target.value)}
        />
        <div className={styles.textAreaBtnContainer}>
          <Button onClick={handleSelectAsinTextArea}>选择</Button>
        </div>
      </TabPane>
    </Tabs> 
  );

  return (
    <Modal
      visible={visible}
      width={1160}
      keyboard={false}
      footer={false}
      maskClosable={false}
      className={classnames(styles.Modal, commonStyles.addModal)}
      onCancel={() => setVisible(false)}
    >
      <div className={styles.modalContainer}>
        <div className={commonStyles.addModalTitle}>添加Targeting</div>
        <div className={commonStyles.addModalContent}>
          <div className={commonStyles.addSelectContainer}>
            { renderCampaignSelect() }
            { renderGroupSelect() }
          </div>
          <div className={commonStyles.addTableContainer}>
            <div className={styles.leftContainer}>
              <Tabs defaultActiveKey="category">
                <TabPane tab="分类" key="category"> { categoryTabs } </TabPane>
                <TabPane tab="商品" key="goods"> { goodsTabs } </TabPane>
              </Tabs>
            </div>
            <div className={styles.tableContent}>
              <div className={classnames(styles.batchToolbar, !checkedSelectedTargeting.length ? styles.disabled : '')}>
                <Button onClick={() => handleBatchSetSelectedTargeting('delete')}>批量删除</Button>
                <Button onClick={() => handleBatchSetSelectedTargeting('applyBid')}>应用建议竞价</Button>
                <BatchSetBid
                  currency={currency}
                  marketplace={marketplace}
                  callback={handleBatchSetSelectedTargetingBid}
                />
              </div>
              <Table
                loading={loading.add}
                className={styles.selectedTable}
                columns={selectedColumns}
                scroll={{ x: 'max-content', y: '350px' }}
                rowKey={record => createIdTargeting(record).id as string}
                dataSource={selectedTargetingList}
                locale={{ emptyText: '请从左侧表格选择或手动输入targeting' }}
                pagination={false}
                rowSelection={selectedTargetingRowSelection}
              />
            </div>
          </div>
          <div className={commonStyles.addModalfooter}>
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button 
              type="primary"
              disabled={!selectedTargetingList.length}
              loading={loading.add}
              onClick={handleAdd}
            >添加</Button>
          </div>
        </div>
      </div>
    </Modal>
  );

};

export default AddTargetingModal;
