import React, { useState } from 'react';
import styles from './index.less';
import GlobalFooter from '@/components/GlobalFooter';

const Privacy: React.FC = () => {
  const [show, setShow] = useState(true);
  return (
    <div className={styles.privacy}>
      <div className={styles.bar}></div>
      <div className={styles.privacy_container}>
        <div className={['clearfix', styles.header].join(' ')}>
          <div className={styles.left}>
            <p>
              <b>隐私政策</b>
              <br/>
              <i>PRIVACY POLICY</i>
            </p>
          </div>
          <div className={styles.right}>
            <p>
              <span onClick={() => setShow(true)} className={[styles.pointer, show ? styles.active : ''].join(' ')}>中文</span> &nbsp;&nbsp;|&nbsp;&nbsp;
              <span onClick={() => setShow(false)} className={[styles.pointer, show ? '' : styles.active].join(' ')}>English</span>
            </p>
          </div>

        </div>
        <div className={styles.display_content}>
          <div className={[styles.content1, show ? styles.show : styles.hide].join(' ')} >
            <p className={styles.title1}>本隐私权政策部分将帮助您了解以下内容：</p>
            <div className={styles.title4}>
                    1.我们如何收集和使用您的个人信息
              <br/> 2.我们如何使用Cookie和同类技术
              <br/> 3. 我们是否共享、转让、公开披露您的个人信息
              <br/> 4. 我们如何保护您的个人信息
              <br/> 5. 您如何管理您的个人信息
              <br/> 6. 如何联系我们
              <br/>

            </div>

            <div className={styles.title1}>1.我们如何收集和使用您的信息</div>
            <div className={styles.title4}>我们会出于本政策所述的以下目的，收集和使用您的个人信息：</div>
            <div className={styles.title2}>(1)帮助您成为我们的会员</div>
            <div className={styles.title4}>
              为成为我们的会员，以便我们为您提供会员服务，您需要提供电子邮箱地址，
              并创建用户名和密码。如果您仅需使用浏览首页、功能介绍、FAQ等内容，您不需要注册成为我们的会员及提供上述信息。
            </div>
            <div className={styles.title2}>(2)向您展示相关的产品和服务</div>
            <div className={styles.title4}>
              为通知您我们新推出的产品和服务，我们会收集您的邮箱等信息，如果您不想接受我们给您发送的提醒，您可随时退订相关邮件。
            </div>
            <div className={styles.title2}>(3)为向您提供相关的提醒服务</div>
            <div className={styles.title4}>
              为向您提供相关的提醒服务，我们会收集您的邮箱等信息，如果您不想接受我们给您发送的提醒，您可随时取消相应产品的提醒功能。
            </div>
            <p className={styles.title3}>a.您向我们提供的信息</p>
            <p className={styles.title4}>您在注册过程中需要提供邮箱等信息。</p>
            <p className={styles.title3}>b.我们在您使用服务过程中收集的信息</p>
            <p className={styles.title4}>
                    我们会根据您输入的搜索内容，向您提供更契合您需求的页面展示和搜索结果。
              <br/> 
              当您使用我们网站的产品或服务时，我们会自动收集您对我们服务的详细使用情况，作为有关网络日志保存。
              例如您的搜索查询内容、IP地址、浏览器的类型、电信运营商、使用的语言、访问日期和时间及您访问的网页记录等。
              <br/> 
              绑定店铺的过程中，我们会收集您所有店铺的SellerID以及MWS Auth Token等信息，
              用于后续向亚马逊请求店铺的相关数据，由于亚马逊的安全设定，与本站开发相关的MWS Auth
              Token仅可用于本网站的开发者访问亚马逊的数据接口，其他开发者无法通过Token访问接口从而获得您的店铺数据，但是为了安全起见，
              请勿向其他开发者泄露MWS Auth Token。
              <br/> 我们会收集您绑定的所有店铺的商品信息，用于向您展示及便于您对商品进行管理，包括商品标题、价格、发货方式、库存等。
              <br/> 我们会收集您绑定的所有店铺的订单和广告等信息，用于向您展示相关的统计数据及便于您对订单和广告进行管理。
              <br/> 以上信息均通过亚马逊官方提供的MWS数据接口进行定时获取和自动同步，您可以在亚马逊Seller Central后台取消授权，从而停止接口的所有数据访问。
              <br/> 我们将信息用于本政策未载明的其他用途，或者将基于特定目的收集而来的信息用于其他目的时，会事先征求您的同意。
              <br/> 如我们停止运营网站的产品或服务，我们将及时停止继续收集您个人信息的活动，将停止运营的通知以公告的形式通知您，对所持有的个人信息进行删除处理。
              <br/>

            </p>

            <p className={styles.title1}>2.我们如何使用 Cookie 和同类技术</p>
            <p className={styles.title4}>
              为确保网站正常运转、为您获得更人性化的访问体验，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。
              Cookie 通常包含标识符、站点名称以及一些号码和字符。借助于 Cookie，网站能够存储您的偏好和使用状态等数据。
              <br/> 
              您可根据自己的偏好管理或删除 Cookie。
              有关详情，请参见AboutCookies.org。
              您可以清除计算机上保存的所有 Cookie，大部分网络浏览器都设有阻止 Cookie 的功能。
              但如果您这么做，则需要在每一次访问我们的网站时更改用户设置。
              如需详细了解如何更改浏览器设置，请访问您使用的浏览器的相关设置页面。
            </p>

            <p className={styles.title1}>3.我们是否共享、转让、公开披露您的个人信息</p>
            <p className={styles.title4}>我们不会与其他公司、组织和个人共享、转让、公开披露您的个人信息。</p>

            <p className={styles.title1}>4.您如何管理您的个人信息</p>
            <p className={styles.title4}>您可以通过以下方式访问及管理您的个人信息：</p>
            <p className={styles.title2}>(1)访问/修改您的个人信息</p>
            <p className={styles.title4}>
              如果您希望访问或编辑您的账户中的个人基本资料信息、更改您的密码等，您可以通过登录账号通过“个人中心”执行此类操作。
            </p>
            <p className={styles.title2}>(2)删除您的个人信息</p>
            <p className={styles.title4}>您可以通过注册邮箱联系我们，要求删除您的部分个人信息。在以下情形中，您可以向我们提出删除个人信息的请求:
              <br/> a.如果我们收集、使用您的个人信息，却未征得您的明确同意；
              <br/> b.如果我们处理个人信息的行为严重违反了与您的约定；
              <br/> c.如果您不再使用我们的产品或服务，或您主动注销了账号；
              <br/> d.如果我们永久不再为您提供产品或服务。
            </p>
            <p> 若我们决定响应您的删除请求，我们会发送最终确认邮件，您回复确认删除后，我们系统管理员会及时删除您的账号信息并邮件通知您删除结果。</p>


            <p className={styles.title1}>5.我们如何保护您的个人信息</p>
            <p className={styles.title4}>
              我们已采取符合业界标准、合理可行的安全防护措施保护您提供的个人信息安全，防止个人信息遭到未经授权访问、公开披露、使用、修改、损坏或丢失。
              例如，我们会对网站提供HTTPS（Hyper Text Transfer
                    Protocol over Secure Socket Layer）协议安全浏览方式；
                    我们会使用加密技术提高个人信息的安全性；我们会使用受信赖的保护机制防止个人信息遭到恶意攻击；
            </p>

            <p className={styles.title1}>6.本隐私权政策如何更新</p>
            <p className={styles.title4}>我们的隐私权政策可能变更，本文顶部显示更新时间。</p>

            <p className={styles.title1}>7.如何联系我们</p>
            <p className={styles.title4}>
              如对本政策内容有任何疑问、意见或建议，您可通过管理员邮箱（ wailin08@qq.com ）或技术支持邮箱（ support@amzics.com ）与我们联系，
              我们将在7天内回复您的请求。
            </p>
            <p className={styles.end}>更新日期：2018年08月13日</p>
          </div>
          <div className={[styles.content2, show ? styles.hide : styles.show].join(' ')}>
            <p className={styles.title1}>
              This privacy policy section will help you understand the following:
            </p>
            <p className={styles.title4}>
                    1．How we collect and use your personal information
              <br/> 2．How do we use cookies and similar technologies?
              <br/> 3．Do we share, transfer, and publicly reveal your personal information?
              <br/> 4．How do we protect your personal information?
              <br/> 5．How do you manage your personal information?
              <br/> 6．Update of this privacy policy
              <br/> 7．How to contact us
              <br/>

            </p>

            <p className={styles.title1}>1. How do we collect and use your information?</p>
            <p className={styles.title4}>
              We collect and use your personal information 
              for the purposes described in this policy:
            </p>
            <p className={styles.title2}>(1) Helping you become our member</p>
            <p className={styles.title4}>
              In order to be our member so that we can provide you with membership services,
              you will need to provide an email address and create a username and password.
              If you only need to use the home page, 
              function introduction, FAQ, etc., 
              you do not need to register to become our member and provide the above information.
            </p>
            <p className={styles.title2}>(2)Showing products and services to you</p>
            <p className={styles.title4}>
              In order to inform you of our new products and services, 
              we will collect information such as your email address.
              If you do not want to accept the reminders we send you, 
              you can unsubscribe at any time.
            </p>
            <p className={styles.title2}>(3) To provide you with reminder services</p>
            <p className={styles.title4}>
              In order to provide you with relevant reminder services, 
              we will collect information such as your email address. 
              If you do not want to accept the reminder we sent you, 
              you can cancel the reminder function of the corresponding product at any time.</p>
            <p className={styles.title3}>a. Information you provide to us</p>
            <p className={styles.title4}>
              You will need to provide information such as your 
              mailbox during the registration process.
            </p>
            <p className={styles.title3}>
              b. Information we collect during your use of the service
            </p>
            <p className={styles.title4}>
                    Based on the search you entered, 
                    we will provide you with page impressions and search results 
                    that better suit your needs.
              <br/> 
              When you use the products or services on our website, 
              we will automatically collect your detailed usage of 
              our services as a related web log. 
              For example, your search query content, 
              IP address, type of browser, telecom carrier, language used, 
              date and time of access, and web page history you visit.
              <br/> 
              In the process of binding the store,
              you have to provide the authorization to our application.
              we will collect information such as SellerID and 
              MWS Auth Token from all your stores, 
              and then use it to request the relevant data of the store from Amazon. 
              Due to Amazon&apos;s security system, 
              the MWS Auth Token related to us is only can use to access Amazon&apos;s 
              data interface by our application,
              any other developers cannot access and obtain your store data with this Token,
              but for security,do not reveal MWS Auth Token to other developers.
              <br/>
               We will collect product information for all the stores you bind 
               to show you and manage your products, 
               including product titles, prices, fulfillment, inventory, and more.
              <br/> 
              We will collect information such as orders and advertisements 
              from all the stores you bind to show you relevant statistics 
              and make it easy for you to manage your orders and ads.
              <br/> 
              All of the above information is periodically acquired and 
              automatically synchronized through the official MWS data interface provided by Amazon.
               You can remove the authorization anytime by visiting the Amazon Seller Central.
              <br/>
               When we use the information for other purposes not covered by this policy, 
               or if the information collected for a specific purpose is used for other purposes, 
               you will be asked for your prior consent.
              <br/> 
              If we stop operating the products or services of our website, 
              we will stop the activities of collecting your personal 
              information in a timely manner, 
              and notify you of the notice of stopping the operation,
               and delete the personal information held by us.
              <br/>
            </p>


            <p className={styles.title1}>2.How do we use cookie and similar technologies?</p>
            <p className={styles.title4}>
                    To ensure that your site is up and running for a more personalized experience, 
                    we store a small data file called a cookie
                    on your computer or mobile device. Cookie usually contain an identifier, 
                    a site name, and some numbers and characters.
                    With cookie, websites can store data such as your preferences and usage status.
              <br/> 
              You can manage or delete cookies based on your preferences. 
              For more information, see AboutCookies.org.
                    You can clear all cookies saved on your computer, 
                    and most web browsers have the ability to block cookies. 
                    But if you do, you will need to change the user settings each 
                    time you visit our website.
                    For more information on how to change your browser settings, 
                    please visit the relevant settings
                    page of the browser you are using.
              <br/>
            </p>

            <p className={styles.title1}>
              3. Do we share,transfer or publicly disclose your personal information?
            </p>
            <div className={styles.title4}>
                We do not share, transfer, 
                or publicly disclose your personal information with other companies, 
                organizations, and individuals.
            </div>

            <p className={styles.title1}>4.How do we protect your personal information?</p>
            <div className={styles.title4}>
                    We have taken reasonable and practicable security measures to 
                    protect the personal information you provide and prevent unauthorized
                    access, public disclosure, use, modification, 
                    damage or loss of personal information. For example,
                    we will provide HTTPS (Hyper Text Transfer Protocol over Secure Socket Layer) 
                    protocol secure
                    browsing method; we will use encryption technology 
                    to improve the security of personal information;
                    we will use trusted protection mechanism to prevent personal 
                    information from being maliciously attacked;
            </div>

            <p className={styles.title1}>5.How do you manage your personal information?</p>
            <p className={styles.title4}>
                    You can access and manage your personal information in the following ways:
            </p>
            <p className={styles.title2}>(1) Accessing/modifying your personal information</p>
            <p className={styles.title4}>
              If you wish to access or edit personal profile information, 
              change your password, etc. in your account,
              you can do this through the Personal Center via your login account.
            </p>
            <p className={styles.title2}>(2) Delete your personal information</p>
            <p className={styles.title4}>
                You can request to delete some of your personal information by contacting us 
                at the registration email address.
                 In the following situations, you can ask us to delete your personal information:
              <br/> 
              a. If we collect and use your personal information, 
              we do not obtain your explicit consent;
              <br/> 
              b. If we deal with personal information, 
              it is a serious violation of your agreement;
              <br/> 
              c. If you no longer use our products or services, 
              or you have voluntarily canceled your account;
              <br/> 
              d. If we permanently do not provide you with products or services.
              <br/> 
              If we decide to respond to your removal request, 
              we will send a final confirmation email. 
              After you reply and confirm the deletion, 
              our system administrator will promptly delete your account
              information and email you to delete the result.

            </p>
            <p className={styles.title1}>6.Update of this privacy policy</p>
            <p className={styles.title4}>
              Our privacy policy may change,the update time is shown at the top of this article.
            </p>
            <p className={styles.title1}>7.How to contact us</p>
            <p className={styles.title4}>
              If you have any questions, 
              comments or suggestions about the content of this policy, 
              you can contact us through the administrator&apos;s email address (wailin08@qq.com) 
              or technical support email (support@amzics.com),
              we will reply to your request within 7 days;</p>
            <p className={styles.end}>last updated：2018-08-13</p>
          </div>
        </div>
      </div>
      <GlobalFooter className={styles.__index_privacy}/>
    </div>
  );
 
};
export default Privacy;
