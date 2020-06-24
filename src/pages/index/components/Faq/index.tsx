import React from 'react';
import styles from './index.less';
const Faq = () => {
  return (
    <div className={styles.faqContainer}>
      <div className={styles.title}>FAQ</div>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={ styles.q1}>
            <div className={styles.head}>安知是做什么的？</div>
            <div className={styles.body}>
            安知是为亚马逊卖家量身打造的亚马逊数据选品运营分析工具。使用安知，可以帮助您在亚马逊上洞悉市场趋势、监控各种数据、提升流量和了解运营效果，从而成功打造亚马逊上最火的商品。
            </div>
          </div>
          <div className={styles.q2}>
            <div className={styles.head}>支持哪些站点？</div>
            <div className={styles.body}>
            目前安知支持Amazon美国站，未来还会支持Amazon的更多站点。
            </div>
          </div>
          <div className={styles.q3}>
            <div className={styles.head}>收费方式是怎样的？</div>
            <div className={styles.body}>
            安知采取按使用量计费的模式，用多少付多少，公测期间全部功能免费开放！
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.q4}>
            <div className={styles.head}>安知会窃取我的商品数据信息吗？</div>
            <div className={styles.body}>
            安知尊重并保护所有卖家的个人隐私权，会严格保证每一位用户数据的安全不被侵犯，
            绝不会通过出卖或利用用户数据来进行直接或间接的牟利。
            根据国家相关规定，私自泄露用户数据的行为将会受到法律严惩。
            </div>
          </div>
          <div className={styles.q5}>
            <div className={styles.head}>使用会造成账号的关联吗？</div>
            <div className={styles.body}>
            不会的。使用安知无需绑定亚马逊卖家账号，也就不存在账号关联的问题了。
            </div>
          </div>
          <div className={styles.q6}>
            <div className={styles.head}>有没有使用说明书？</div>
            <div className={styles.body}>
            有的，注册之后，请点击页面上的帮助按钮获取使用说明书。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Faq;
