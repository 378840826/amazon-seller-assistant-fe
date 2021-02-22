/**
 * 会员价格和等级说明
 */
import React, { useEffect } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import classnames from 'classnames';
import styles from './index.less';

const LevelExplain: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'vip/fetchMyVipInfo',
    });
  }, [dispatch]);
  const page = useSelector((state: IConnectState) => state.vip);
  const { data: { memberLevel } } = page;
  // 点击购买的跳转地址， 非vip跳转到升级年费， vip跳转到我的会员
  const link = memberLevel === '普通会员' ? '/vip/upgrade' : '/vip/membership';
  const shortBar = '—';
  const free = '免费';
  const unusable = <span className={styles.unusable} >X</span>;
  return (
    <div className={styles.page}>
      <div className={styles.livePrice}>
        <div className={classnames(styles.card, styles.vip0)}>
          <div className={styles.cardTitle}>普通会员</div>
          <div className={styles.cardContent}>
            <span>
              <span className={styles.price}>0</span>元/月
            </span>
          </div>
        </div>
        <div className={classnames(styles.card, styles.vip1)}>
          <Link to={`${link}?level=1`}>
            <div className={styles.cardTitle}>VIP</div>
            <div className={styles.cardContent}>
              <span>
                <span className={styles.price}>299</span>元/月
              </span>
              <span>
                <span className={styles.price}>2999</span>元/年
              </span>
              <span>
                <span className={styles.btn}>购买</span>
              </span>
            </div>
          </Link>
        </div>
        <div className={classnames(styles.card, styles.vip2)}>
          <Link to={`${link}?level=2`}>
            <div className={styles.cardTitle}>高级VIP</div>
            <div className={styles.cardContent}>
              <span>
                <span className={styles.price}>499</span>元/月
              </span>
              <span>
                <span className={styles.price}>4999</span>元/年
              </span>
              <span>
                <span className={styles.btn}>购买</span>
              </span>
            </div>
          </Link>
        </div>
        <div className={classnames(styles.card, styles.vip3)}>
          <Link to={`${link}?level=3`}>
            <div className={styles.cardTitle}>至尊VIP</div>
            <div className={styles.cardContent}>
              <span>
                <span className={styles.price}>999</span>元/月
              </span>
              <span>
                <span className={styles.price}>9999</span>元/年
              </span>
              <span>
                <span className={styles.btn}>购买</span>
              </span>
            </div>
          </Link>
        </div>
        <div className={classnames(styles.card, styles.vip4)}>
          <div className={styles.cardTitle}>企业会员</div>
          <div className={classnames(styles.cardContent, styles.customized)}>
            <span>联系客服</span>
          </div>
        </div>
      </div>
      <div className={styles.list}>
        <table>
          <tbody>
            <tr>
              <td>功能</td>
              <td>普通会员</td>
              <td>VIP</td>
              <td>高级VIP</td>
              <td>至尊VIP</td>
              <td>企业会员</td>
            </tr>
            <tr>
              <td>绑定店铺</td>
              <td>1个</td>
              <td>5个</td>
              <td>10个</td>
              <td>20个</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>广告授权店铺</td>
              <td>1个</td>
              <td>5个</td>
              <td>10个</td>
              <td>20个</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>子账号</td>
              <td>1个</td>
              <td>5个</td>
              <td>10个</td>
              <td>20个</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>数据大盘</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>店铺报告</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>浏览器插件</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>手动批量调价</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>商品管理</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>智能调价</td>
              <td>5个SKU</td>
              <td>50个SKU</td>
              <td>100个SKU</td>
              <td>200个SKU</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>ASIN报表查看</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>ASIN报表导出</td>
              <td>5次/月</td>
              <td>10次/月</td>
              <td>20次/月</td>
              <td>40次/月</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>ASIN成本分析</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>B2B销售分析</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>退货分析</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>订单解读</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>ASIN广告表现</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>ASIN动态监控</td>
              <td>5个ASIN</td>
              <td>50个ASIN</td>
              <td>100个ASIN</td>
              <td>200个ASIN</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>ASIN动态汇总</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>跟卖监控</td>
              <td>{unusable}</td>
              <td>50个SKU</td>
              <td>100个SKU</td>
              <td>200个SKU</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>Review监控</td>
              <td>{unusable}</td>
              <td>50个ASIN</td>
              <td>100个ASIN</td>
              <td>200个ASIN</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>搜索排名监控</td>
              <td>{unusable}</td>
              <td>100个任务</td>
              <td>200个任务</td>
              <td>400个任务</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>自动邮件</td>
              <td>500封/月</td>
              <td>2000封/月</td>
              <td>5000封/月</td>
              <td>10000封/月</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>手动邮件</td>
              <td>50封/月</td>
              <td>200封/月</td>
              <td>500封/月</td>
              <td>1000封/月</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>补货建议导出</td>
              <td>5次/月</td>
              <td>10次/月</td>
              <td>20次/月</td>
              <td>40次/月</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>补货建议查看</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>PPC托管</td>
              <td>{unusable}</td>
              <td>20个ASIN</td>
              <td>50个ASIN</td>
              <td>100个ASIN</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>PPC管理</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>PPC创建</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>PPC关键词智能推荐</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
            <tr>
              <td>PPC否定关键词智能推荐</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{free}</td>
              <td>{shortBar}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LevelExplain;
