import React from 'react';
import styles from './index.less';
import GlobalFooter from '@/components/GlobalFooter';

const Logs: React.FC = () => {
  return (
    <div className={styles.update_log}>
      <div className={styles.bar}></div>
      <div className={[styles.update_log_container, styles.w].join(' ')} >
        <p className={styles.title}>更新日志</p>
        <div className={styles.content}>
          <div className={styles.item}>
            <p>安知助手V2.9.3版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.ASIN广告解读，新增“广告类型”统计；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2020-05-07</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.8.2版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.新增竞品设定功能，可将全站任意ASIN设定为竞品，提供相关竞品推荐；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2020-04-11</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.8.1版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.店铺总览改版，新增“各店铺数据汇总”模块；曲线图增加列表查看方式；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2020-04-10</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.8.0版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.调价规则2.0上线，拆分三种类型的调价规则；支持规则和条件的添加；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2020-04-10</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.7.0版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.新增ASIN动态汇总，提升管理效率；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2020-02-27</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.6.0版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.新增BusinessReport解读，对ASIN的销售指标，进行多周期、多维度的统计；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2020-02-18</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.5.8版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.广告系统新增SearchTerm模块，支持搜索词的快捷投放或否定；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2019-12-17</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.5.7版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.广告系统新增ASIN广告解读；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2019-11-29</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.5.6版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.广告系统新增ASIN总体表现，支持ASIN的广告表现进行多维度分析；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2019-11-13</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.5.5版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.广告系统新增广告数据分析模块，包括广告系列、广告组、广告、Targeting的多维度数据分析；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2019-11-13</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.5.4版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.广告系统新增店铺报告；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2019-11-13</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.5.3版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.广告系统新增广告总览；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2019-11-13</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.5.2版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.广告系统新增广告创建模块，支持广告系列、广告组、广告、Targeting和否定Targeting的创建和添加；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2019-11-05</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.5.1版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.广告系统新增广告管理模块，包括广告系列、广告组、广告、Targeting和否定Targeting，
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2019-10-21</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.5.0版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>1.广告系统新增广告系列、广告组的定时功能；</span>
                <span className={styles.item_div_list3_right}>更新时间：2019-10-16</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.4.0版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>1.新增ASIN动态功能，记录ASIN的所有变化；</span>
                <span className={styles.item_div_list3_right}>更新时间：2019-07-26</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.3.1版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>
                  1.新增BusinessReport导入功能，支持按天导入或批量导入；
                </span>
                <span className={styles.item_div_list3_right}>更新时间：2019-04-10</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.2.1版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>1.新增评论和订单的客户智能匹配功能；</span>
                <span className={styles.item_div_list3_right}>更新时间：2019-04-10</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.2.0版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>1.新增订单列表功能，支持订单的多种条件筛选；</span>
                <span className={styles.item_div_list3_right}>更新时间：2019-03-13</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.1.0版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>1.新增订单解读功能，支持按日周月查看各种订单指标的历史曲线；</span>
                <span className={styles.item_div_list3_right}>更新时间：2019-02-18</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V2.0.0版</p>
            <div className={styles.item_div}>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>1.新增关键词监控设定，ASIN按需开启监控；</span>
                <span className={styles.item_div_list3_right}>更新时间：2019-01-31</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V1.3.2版</p>
            <div className={styles.item_div}>
              <p>1.新增了实时改价的功能，支持批量改价、文件批量导入售价；</p>
              <p>2.修复了Amazon&apos;s Choice总览数据导出失败等bug；</p>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>3.优化了Amazon&apos;s Choice的查询效率；</span>
                <span className={styles.item_div_list3_right}>更新时间：2018-09-11</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V1.3.1版</p>
            <div className={styles.item_div}>
              <p>1.新增了商品管理_快速设置的功能，支持快速设置售价、最低价、最高价；</p>
              <p>2.修复了新增库存提醒规则，日期错误等bug；</p>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>3.完善了调价触发条件的描述；</span>
                <span className={styles.item_div_list3_right}>更新时间：2018-09-11</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V1.2.5版</p>
            <div className={styles.item_div}>
              <p>1.新增了消息中心，评论提醒和库存提醒整合；</p>
              <p>2.修复了批量查询ASIN失败等bug；</p>
              <p>3.修复了评论监控中，评论重复的bug；</p>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>4.新增了FBA Fee和佣金两个字段；</span>
                <span className={styles.item_div_list3_right}>更新时间：2018-08-21</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V1.2.4版</p>
            <div className={styles.item_div}>
              <p>1.新增了评论监控的功能，支持好评、差评提醒；</p>
              <p>2.新增了Reviews这个字段；</p>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>3.修复了SKU和ASIN不对应等bug；</span>
                <span className={styles.item_div_list3_right}>更新时间：2018-08-11</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V1.2.3版</p>
            <div className={styles.item_div}>
              <p>1.新增了库存年龄状况监控的功能，支持库存提醒；</p>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>2.修复了SKU和ASIN不对应等bug；</span>
                <span className={styles.item_div_list3_right}>更新时间：2018-08-01</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V1.2.2版</p>
            <div className={styles.item_div}>
              <p>1.新增了按订单量的功能；</p>
              <p>2.修复了订单量没有触发调价等bug；</p>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>3.优化了Amazon&apos;s Choice的查询效率；</span>
                <span className={styles.item_div_list3_right}>更新时间：2018-07-21</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V1.2.1版</p>
            <div className={styles.item_div}>
              <p>1.新增了Amazon&apos;s Choice跟踪的功能；</p>
              <p>2.修复了文件导入失败等bug；</p>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>3.优化了商品管理_订单量的查询效率；</span>
                <span className={styles.item_div_list3_right}>更新时间：2018-07-11</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V1.1.3版</p>
            <div className={styles.item_div}>
              <p>1.新增了报表管理功能，支持各类报表下载；</p>
              <p>2.修复了商品列表、调价规则列表没有加载等bug；</p>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>3.优化了商品列表的查询效率；</span>
                <span className={styles.item_div_list3_right}>更新时间：2018-07-01</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V1.1.2版</p>
            <div className={styles.item_div}>
              <p>1.新增了批量查询ASIN/SKU的功能；</p>
              <p>2.修复了没有生成调价记录等bug；</p>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>3.优化了商品列表的查询效率；</span>
                <span className={styles.item_div_list3_right}>更新时间：2018-06-11</span>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <p>安知助手V1.1.1版</p>
            <div className={styles.item_div}>
              <p>1.新增了智能调价功能；</p>
              <p>2.修复了店铺绑定失败等bug；</p>
              <div className="clearfix">
                <span className={styles.item_div_list3_left}>3.优化了商品列表的查询效率；</span>
                <span className={styles.item_div_list3_right}>更新时间：2018-05-11</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlobalFooter className={styles.__index_logs}/>
    </div>
  );
 
};
export default Logs;
