/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, ReactElement } from 'react';
import { Button, Typography, Rate } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { IConnectState } from '@/models/connect';
import { useSelector, useDispatch, Link } from 'umi';
import {
  requestErrorFeedback,
  requestFeedback,
  getAmazonShopPageUrl,
  Iconfont,
} from '@/utils/utils';
import CustomCols from './CustomCols';
import GoodsImg from '@/pages/components/GoodsImg';
import { DndProvider } from 'react-dnd';
import HTMLBackend from 'react-dnd-html5-backend';
import CardContainer from './CardContainer';
import DragLayer from './DragLayer';
import { ICardData } from './Card';
import styles from './index.less';

const { Text } = Typography;

// 商品图片 asin sku
function renderGoods(props: { asin: string; sku: string; img: string }): ReactElement;
function renderGoods(props: { asin: ReactElement; sku: string; img: string }): ReactElement;
function renderGoods(
  props: { asin: string | ReactElement; sku: string; img: string }
): ReactElement {
  const { sku, asin, img } = props;
  return (
    <div className={styles.goodsContainer}>
      <GoodsImg src={img} width={30} />
      <div className={styles.goodsInfo}>
        <div>{asin}</div>
        <div>{sku}</div>
      </div>
    </div>
  );
}

// 未绑定/授权/导入
const renderNotData = (type: 'mwsShop' | 'ppcShop' | 'bsImport') => {
  const icon = <Iconfont type="icon-zhankai-copy" className={styles.linkIcon} />;
  const dict = {
    mwsShop: <>店铺未绑定，<Link to="/shop/bind" target="_blank">去绑定{icon}</Link></>,
    ppcShop: <>未完成广告授权，<Link to="/ppc/shop" target="_blank">去授权{icon}</Link></>,
    bsImport: <>未导入报表，<Link to="/report/import" target="_blank">去导入{icon}</Link></>,
  };
  return (
    <div className={styles.notData}>
      <div>{ dict[type] }</div>
    </div>
  );
};

const BiBoard: React.FC = () => {
  const dispatch = useDispatch();
  const page = useSelector((state: IConnectState) => state.biBoard);
  const {
    queue,
    customCols,
    data: {
      fisKanban,
      ajKanban,
      followKanban,
      buyboxPercentageKanban,
      mailKanban,
      reviewKanban,
      feedbackKanban,
      acKeywordKanban,
      adKeywordKanban,
      adIneligibleKanban,
    },
  } = page;
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId, marketplace, sellerId } = currentShop;

  // 切换店铺后重新加载
  useEffect(() => {
    if (currentShopId !== '-1') {
      dispatch({
        type: 'biBoard/fetchKanbanData',
        payload: {
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId]);

  // 点击加入跟卖监控
  const handleAddMonitor = (asin: string) => {
    dispatch({
      type: 'biBoard/addCompetitorMonitor',
      payload: { asin },
      callback: requestFeedback,
    });
  };

  // 一行星星
  const star = (defaultValue: number) => (
    <Rate
      className={styles.star}
      disabled
      defaultValue={defaultValue}
      character={() => (<StarFilled />)}
    />
  );

  // 一条数据-review
  const renderReviewKanbanIten = (starNum: number, num: number, unansweredNum: number) => (
    <div className={styles.reviewItem}>
      <span className={styles.left}>{star(starNum)}</span>
      <div className={styles.red}>
        <span>{num}个</span>
        <Text type="secondary">（未回复{unansweredNum}个）</Text>
      </div>
    </div>
  );

  // 一条内容-现有库存预计可售
  const renderFisKanbanItem = (record: API.IFisKanban) => (
    <div className={styles.fisKanbanItem} key={record.asin}>
      { renderGoods(record) }
      <div className={styles.red}>{record.availableDays}天</div>
    </div>
  );

  // 一条内容-智能调价
  const renderAjKanbanItem = (record: API.IAjKanban) => (
    <div className={styles.ajKanbanItem} key={record.ruleName}>
      <div>{record.ruleName}</div>
      <div className={styles.red}>{record.ajFrequency}次</div>
    </div>
  );

  // 全部内容-跟卖监控
  const renderFollowKanban = (record: API.IFollowKanban) => (
    <>
      <div className={styles.followKanbanItem}>
        <span className={styles.left}>监控</span>
        <div className={styles.red}>{record.monitoringCount}次</div>
      </div>
      <div className={styles.followKanbanItem}>
        <span className={styles.left}>被跟卖ASIN</span>
        <div className={styles.red}>
          <span>{record.followAsinCount}个</span>
          <Text type="secondary">（未加入buybox调价{record.followAsinNotJoninBuyboxAj}个）</Text>
        </div>
      </div>
      <div className={styles.followKanbanItem}>
        <span className={styles.left}>Buybox被抢ASIN</span>
        <div className={styles.red}>
          <span>{record.buyboxLostAsinCount}个</span>
          <Text type="secondary">（未加入buybox调价{record.buyboxLostAsinNotJoninBuyboxAj}个）</Text>
        </div>
      </div>
    </>
  );

  // 一条内容-购物车占比
  const renderBuyboxPercentageKanbanItem = (record: API.IBuyboxPercentage) => (
    <div className={styles.buyboxPercentageKanbanItem} key={record.asin}>
      { renderGoods(record) }
      <div className={styles.red}>
        {record.buyboxPercentage && record.buyboxPercentage.toFixed(2)}%
        {
          record.isJoinFollowMonitoring
            ? <Button type="link" className={styles.hide}>加入跟卖监控</Button>
            : <Button type="link" onClick={() => handleAddMonitor(record.asin)}>加入跟卖监控</Button>
        }
      </div>
    </div>
  );

  // 全部内容-邮件
  const renderMailKanban = (record: API.IMailKanban) => (
    <>
      <div className={styles.mailKanbanItem}>
        <span className={styles.left}>未回复邮件</span>
        <div className={styles.red}>{record.unMailNumber}封</div>
      </div>
      <div className={styles.mailKanbanItem}>
        <span className={styles.left}>最紧急邮件</span>
        <div className={styles.red}>
          {record.urgentMailTimeLeftHours}h{record.urgentMailTimeLeftMinute}m 超时
        </div>
      </div>
    </>
  );

  // 全部内容-Review
  const renderReviewKanban = (record: API.IReviewKanban) => (
    <div className={styles.reviewContent}>
      { renderReviewKanbanIten(1, record.oneStar, record.oneStarUnanswered) }
      { renderReviewKanbanIten(2, record.twoStar, record.twoStarUnanswered) }
      { renderReviewKanbanIten(3, record.threeStar, record.threeStarUnanswered) }
      { renderReviewKanbanIten(4, record.fourStar, record.fourStarUnanswered) }
      { renderReviewKanbanIten(5, record.fiveStar, record.fiveStarUnanswered) }
    </div>
  );

  // 全部内容-Feedback
  const renderFeedbackKanban = (record: API.IFeedbackKanban) => (
    <>
      <div className={styles.feedbackItem}>
        <span className={styles.left}>{ star(1) }</span>
        <div className={styles.red}>
          {record.oneStar}个
        </div>
      </div>
      <div className={styles.feedbackItem}>
        <span className={styles.left}>{ star(2) }</span>
        <div className={styles.red}>
          {record.twoStar}个
        </div>
      </div>
      <div className={styles.feedbackItem}>
        <span className={styles.left}>{ star(3) }</span>
        <div className={styles.red}>
          {record.threeStar}个
        </div>
      </div>
    </>
  );

  // 一条内容-ac关键词
  const renderAcKeywordKanbanItem = (record: API.IKanbanAsinInfos) => (
    <div className={styles.acKeywordKanbanItem} key={record.asin}>
      { renderGoods({
        ...record,
        asin: (
          <>
            { record.asin }
            <Text type="secondary">
              （新增 <span className={styles.red}>{record.addKeyword}</span>）
            </Text>
          </>
        ),
      })}
      <div className={styles.acKeywordInfo}>
        <Text type="secondary">
          <div>标题：{record.titleNotIncluded.map((keyword: string) => `${keyword}、`)}</div>
          <div>Bullet Point：{record.bpNotIncluded.map((keyword: string) => `${keyword}、`)}</div>
          <div>描述：{record.descriptionNotIncluded.map((keyword: string) => `${keyword}、`)}</div>
        </Text>
      </div>
    </div>
  );

  // 一条内容-广告关键词表现
  const renderAdKeywordKanbanItem = (record: API.IAdKeywordKanban) => (
    <div className={styles.adKeywordKanbanItem} key={record.keyword}>
      <div className={styles.row}>
        <span>{record.keyword}</span>
        <span>
          ACoS≥<span className={styles.red}>{record.acos.toFixed(2)}%</span>
        </span>
      </div>
      <Text type="secondary" className={styles.smallFont}>{record.adCampaignsName} &gt; {record.adGroupName}</Text>
    </div>
  );

  // 一条内容-广告Ineligible原因
  const renderAdIneligibleKanbanItem = (record: API.IAdIneligibleKanban) => (
    <div className={styles.adIneligibleKanbanItem} key={record.asin}>
      <div className={styles.goodsContainer}>
        <GoodsImg src={record.img} width={30} />
        <div className={styles.goodsInfo}>
          <div className={styles.row}>
            <span>{record.asin}</span>
            <span className={styles.red}>{record.Ineligible}</span>
          </div>
          <div>{record.sku}</div>
        </div>
      </div>
    </div>
  );

  // 全部卡片
  const allCard = {
    fisKanban: {
      title: '现有库存预计可售',
      link: '/replenishment',
      linkText: '更多',
      content: (
        <div className={styles.fisContent}>
          { fisKanban.map((item) => renderFisKanbanItem(item)) }
        </div>
      ),
    },
    ajKanban: {
      title: '智能调价',
      titleExplain: '今天',
      link: '/reprice/history',
      linkText: '更多',
      content: (
        <div className={styles.ajContent}>
          { ajKanban.map((item) => renderAjKanbanItem(item)) }
        </div>
      ),
    },
    followKanban: {
      title: '跟卖监控',
      titleExplain: '今天',
      link: '/competitor/monitor',
      linkText: '更多',
      content: renderFollowKanban(followKanban),
    },
    buyboxPercentageKanban: {
      title: '购物车占比',
      titleExplain: buyboxPercentageKanban.lastTime ? `更新至${buyboxPercentageKanban.lastTime}` : '',
      link: '/',
      linkText: '更多',
      content: (
        <div className={styles.buyboxPercentageContent}>
          {
            buyboxPercentageKanban.buyboxPercentage.length
              ?
              buyboxPercentageKanban.buyboxPercentage.map(
                (item) => renderBuyboxPercentageKanbanItem(item)
              )
              : renderNotData('bsImport')
          }
        </div>
      ),
      annotation: '需每天导入Business Report',
      isNotData: !buyboxPercentageKanban.buyboxPercentage.length,
    },
    mailKanban: {
      title: '邮件',
      link: '/mail/no-reply',
      linkText: '详情',
      content: renderMailKanban(mailKanban),
    },
    reviewKanban: {
      title: 'Review',
      titleExplain: '最近7天新增',
      link: '/review/list',
      linkText: '详情',
      annotation: '需加入评论监控',
      content: renderReviewKanban(reviewKanban),
    },
    feedbackKanban: {
      title: 'Feedback',
      titleExplain: '最近30天新增',
      link: getAmazonShopPageUrl(marketplace, sellerId),
      linkText: '详情',
      content: renderFeedbackKanban(feedbackKanban),
    },
    acKeywordKanban: {
      title: 'Amazon\'s Choice 关键词',
      titleExplain: acKeywordKanban.lastTime ? `更新至${acKeywordKanban.lastTime}` : '',
      link: '/dynamic/asin-overview',
      linkText: '更多',
      annotation: '需加入ASIN动态监控',
      content: <>{acKeywordKanban.asinInfos.map((item) => renderAcKeywordKanbanItem(item))}</>,
    },
    adKeywordKanban: {
      title: '广告关键词表现',
      titleExplain: '最近7天',
      // link: '/ppc/targeting',
      link: '/overview/bi',
      linkText: '更多',
      annotation: '需设置提醒规则',
      content: (
        <div className={styles.adKeywordContent}>
          <div style={{ textAlign: 'center' }}>功能正在开发中</div>
          { adKeywordKanban.map((item) => renderAdKeywordKanbanItem(item)) }
        </div>
      ),
    },
    adIneligibleKanban: {
      title: '广告Ineligible原因',
      // link: '/ppc/product',
      link: '/overview/bi',
      linkText: '更多',
      content: (
        <div className={styles.adIneligibleContent}>
          <div style={{ textAlign: 'center' }}>功能正在开发中</div>
          { adIneligibleKanban.map((item) => renderAdIneligibleKanbanItem(item)) }
        </div>
      ),
    },
  };

  // 按顺序显示
  const showCards: ICardData[] = [];
  queue.forEach((key, index: number) => {
    const card = { ...allCard[key], customKey: key, id: index };
    if (customCols[key]) {
      showCards.push(card);
    }
  });

  // 修改位置
  const handleSortChange = (newQueue: string[]) => {
    dispatch({
      type: 'biBoard/updateQueue',
      payload: [...newQueue],
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.customBtn}>
        <CustomCols />
      </div>
      <DndProvider backend={HTMLBackend}>
        <CardContainer cardDataList={showCards} onSortChange={handleSortChange} />
        <DragLayer cardDataList={showCards} />
      </DndProvider>
    </div>
  );
};

export default BiBoard;
