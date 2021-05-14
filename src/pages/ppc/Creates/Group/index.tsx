import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Switch,
  Input,
  DatePicker,
  Form,
  Popconfirm,
  Button,
  Select,
  message,
} from 'antd';
import { ppcGroupListRouter } from '@/utils/routes';
import ProductSelect from '../components/ProductSelect';
import TimeSelectTable from '../components/TimeSelectBox';
import { 
  useSelector, 
  history, 
  useDispatch,
  ConnectProps, 
  ICreateGampaignState,
  ICreateGroupState,
} from 'umi';
import SpAuto from './SpAuto';
import SPManual from './SPManual';
import moment, { Moment } from 'moment';
import momentTimezone from 'moment-timezone';
import skip from '@/components/Skip';
import Snav from '@/components/Snav';

interface IPage extends ConnectProps {
  createCampagin: ICreateGampaignState;
  createGroup: ICreateGroupState;
}


const { Item } = Form;
let activeTime: any = { // eslint-disable-line
  fri: [],
  mon: [],
  sat: [],
  sun: [],
  thur: [],
  tues: [],
  wed: [],
};
const Group: React.FC = () => {
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const selects = useSelector((state: IPage) => state.createCampagin.selectProduct);
  const keywords = useSelector((state: IPage) => state.createGroup.keywords);
  const classifys = useSelector((state: IPage) => state.createGroup.classifys);
  const saveProducts = useSelector((state: IPage) => state.createGroup.saveProducts);
  // 自动广告组的按Targeting Group设置竞价数据
  const autoTargetGroupList = useSelector((state: IPage) => 
    state.createGroup.autoTargetGroupList
  );
  
  // base
  let { currency, marketplace, timezone, id } = currentShop;
  marketplace = 'US';
  currency = '$';
  timezone = 'Asia/Shanghai';
  id = '2';

  const [campaignType, setCampaignType] = useState<CreateCampaign.ICampaignType>('sponsoredProducts');
  const [putMathod, setPutMathod] = useState<CreateCampaign.putMathod>('auto'); // 投放方式
  const [campaignList, setCampaignList] = useState<CreateGroup.ICampaignList[]>([]);
  const siteDatetime = momentTimezone({ hour: 0, minute: 0, second: 0 }).tz(timezone).format('YYYY-MM-DD HH:mm:ss'); // 站点时间
  const [startDate, setStartDate] = useState<string>(moment().format('YYYY-MM-DD HH:mm:ss')); // 广告活动的开始时间

  const navList: Snav.INavList[] = [
    {
      label: '广告组',
      type: 'Link',
      path: ppcGroupListRouter,
      target: '_blank',
    },
    {
      label: '创建广告组',
    },
  ];

  // 请求广告活动下拉列表数据
  useEffect(() => {
    if (id === '-1') {
      return;
    }

    new Promise((resolve, reject) => {
      dispatch({
        type: 'createGroup/getCampaignList',
        resolve,
        reject,
        payload: {
          headersParams: {
            StoreId: id,
          },
        },
      });
    }).then(datas => {
      const {
        code,
        message: msg,
        data,
      } = datas as {
        code: number;
        message: string;
        data: CreateGroup.ICampaignList[];
      };
      if (code === 200) {
        setCampaignList(data);
        return;
      }
      message.error(msg || '获取广告活动列表失败');
    });
  }, [dispatch, id]);

  // 初始化广告活动名称及广告活动类型
  useEffect(() => {
    if (campaignList.length) {
      const firstData = campaignList[0];
      form.setFieldsValue({
        campaignId: firstData.campaignId,
      });
      setPutMathod(firstData.targetingType || 'classProduct'); // sd 分类/商品
      setCampaignType(firstData.campaignType);
    }
  }, [form, campaignList]);

  // 广告活动下拉列表的改变
  const campaignChange = (id: string) => {
    for (let i = 0; i < campaignList.length; i++) {
      const item = campaignList[i];
      if (item.campaignId === id) {
        setPutMathod(item.targetingType || 'classProduct'); // sd 分类/商品
        setCampaignType(item.campaignType);
        break;
      }
    }
  };
  
  function startDateChange (date: Moment | null) {
    const startDate = date?.format('YYYY-MM-DD HH:mm:ss');
    const endDate = form.getFieldValue('endDate');
    setStartDate(startDate as string);
      
    // 如果选中的结束日期小于开始日期时，将结束日期改成开始日期
    if (endDate && moment(startDate).isAfter(endDate.format('YYYY-MM-DD HH:mm:ss'))) {
      form.setFieldsValue({
        endDate: moment(startDate),
      });
    }
  }

  // 选中商品保存
  const getSelectProduct = (data: CampaignCreate.IProductSelect[]) => {
    dispatch({
      type: 'createGroup/setSelectProduct',
      payload: data,
    });
  };

  // 创建
  const saveCreate = () => {
    const data = form.getFieldsValue();
    const defaultBidMin = marketplace === 'JP' ? 2 : 0.02;
    const manualType = data.other.manualType;// 先查看当前选中的是哪一个分类下

    data.productAds = selects;
    data.activeTime = activeTime;
    data.keywords = null;
    data.targets = null;
    
    data.activeTime.timezone = timezone;
    data.activeTime.switch = data.switch;
    data.activeTime.startDate = moment(startDate).format('YYYY-MM-DD');
    data.endDate ? data.activeTime.endDate = data.endDate.format('YYYY-MM-DD') : '';
  
    if (data.endData) {
      data.endData = moment(data.endData).format('YYYY-MM-DD');
    }

    if (['', undefined, null].includes(data.name)) {
      message.error('广告组名称不能为空！');
      return;
    }

    if (data.name.length < 1 || data.name.length > 256) {
      message.error('广告组名称长度不能小于1或者大于256位');
      return;
    }

    if (putMathod === 'auto') {
      data.defaultBid = data.auto.defaultBid;
      const stringJSON = JSON.stringify(autoTargetGroupList);
        const list: any[] = JSON.parse(stringJSON);// eslint-disable-line
      list.forEach(item => {
        item.state = item.state ? 'enabled' : 'paused';
      });

      data.autoTargetGroup = list;
    } else if (putMathod === 'manual' || putMathod === 'classProduct') {
      // 手动 | sd的分类/商品
      // 关键词模式
      if ( manualType === 'keyword') { 
        if (keywords.length === 0) {
          message.error('关键词列表不能为空，请添加关键词！');
          return;
        }
        // 关键词
        data.keywords = keywords;
      } else {
        // const classProductType = data.other.classProductType;
        // 手动 商品/分类

        // if (classifys.length === 0) {
        //   message.error('分类列表不能为空，请添加分类！');
        //   return;
        // }

        data.targets = {
          categories: classifys,
          asins: saveProducts,
        };
      }
    }

    if (['', undefined, null].includes(data.defaultBid)) {
      message.error('默认竞价不能为空！');
      return;
    }
   
    if (Array.isArray(data.productAds) && data.productAds.length === 0) {
      message.error('商品广告不能为空！');
      return;
    }

    if (Number(data.defaultBid) < defaultBidMin) {
      message.error(`默认竞价必须大于等于${defaultBidMin}`);
    }

    // 删除多余数据
    // (putMathod === 'auto' || manualType !== 'keyword') && delete data.keywords;
    delete data.auto;
    delete data.other;
    delete data.startDate;
    data.endDate && delete data.endDate;
    
    new Promise((resolve, reject) => {
      dispatch({
        type: 'createGroup/createGroup',
        resolve,
        reject,
        payload: {
          ...data,
          headersParams: {
            StoreId: id,
          },
        },
      });
    }).then(datas => {
      const {
        code,
        message: msg,
      } = datas as {
        code: number;
        message: string;
      };

      if (code !== 200) {
        message.error(msg);
        return;
      }
      if ( msg === '创建成功') {
        skip({
          toPath: ppcGroupListRouter,
          pageName: '广告组列表',
        });
        return;
      } 
      message.success(msg);
    });
  };

  return <div className={styles.groupBox}>
    <nav className={styles.nav}>
      <Snav navList={navList}/>
    </nav>
    <Form form={form} 
      colon={false} 
      labelAlign="left"
      initialValues={{
        switch: true,
        other: {
          bidType: 'auto',
        },
      }}
    >
      <Item name="campaignId" label="选择广告活动：" className={styles.campaignSelect}>
        <Select 
          dropdownClassName={styles.campaignSelect} 
          onChange={campaignChange}
        >
          {campaignList.map((item, i) => {
            return <Select.Option 
              value={item.campaignId} key={i}>{item.name}</Select.Option>;
          })}
        </Select>
      </Item>

      <Item 
        validateTrigger={['onKeyUp', 'onBlur']}
        label="广告组名称："
        name="name"
        className={styles.name}
        rules={[{
          required: true,
          min: 1,
          max: 256,
          message: '广告组名称长度不能为0或大于256位！',
        }]}>
        <Input maxLength={256}/>
      </Item>
      <div className={styles.product}>
        <ProductSelect getSelectProduct={getSelectProduct}/>
      </div>
      <div className={classnames(putMathod === 'auto' ? '' : 'none')}>
        <SpAuto currency={currency} marketplace={marketplace}/>
      </div>
      
      <div className={classnames(putMathod === 'manual' || putMathod === 'classProduct' ? '' : 'none')}>
        <SPManual 
          form={form}
          currency={currency}
          marketplace={marketplace}
          storeId={id}
          campaignType={campaignType}
          putMathod={putMathod}
        />
      </div>
      <div className={styles.rangeDate}>
        <span className={styles.text}>日期范围：</span>
        <Item name="startDate" initialValue={moment(siteDatetime)}>
          <DatePicker
            placeholder="年 / 月 / 日"
            format="YYYY-MM-DD"
            allowClear={false}
            disabledDate={current => current && current < moment(siteDatetime)}
            className={styles.date}
            onChange={startDateChange}
          />
        </Item>
        <span className={styles.line}>—</span>
        <Item name="endDate">
          <DatePicker
            placeholder="年 / 月 / 日"
            format="YYYY-MM-DD"
            disabledDate={current => current && current < moment(startDate)}
            className={styles.date}
          />
        </Item>
      </div>
    
      <div className={styles.timing}>
        <Item name="switch" label="时间：" className={styles.switch} valuePropName="checked">
          <Switch className="h-switch"/>
        </Item>
        <TimeSelectTable getValues={v => activeTime = v} />
      </div>
    </Form>

    <footer className={styles.btns}>
      <Popconfirm 
        title="您确定要取消创建吗？" 
        onConfirm={() => history.push(ppcGroupListRouter)}
        overlayClassName={styles.cancelTooltip}
      >
        <Button>取消</Button>
      </Popconfirm>
      <Button
        type="primary" 
        onClick={saveCreate}
      >
        保存
      </Button>
    </footer>
  </div>;
};

export default Group;
