import React, { useState, useRef, useEffect } from 'react';
import styles from './index.less';
import {
  useDispatch,
  useSelector,
} from 'umi';
import echarts from 'echarts';
import classnames from 'classnames';

// ---
import Update from './components/Update';
import Empty from './components/Empty';
import ShowData from '@/components/ShowData';
import { strToMoneyStr } from '@/utils/utils';
import GoodsImg from '@/pages/components/GoodsImg';
import { bigIcon } from '@/pages/components/GoodsIcon';
import {
  Rate, 
  Tooltip,
  Radio,
  Input,
  Form,
} from 'antd';
import {
  QuestionCircleOutlined,
} from '@ant-design/icons';


const AsinBase: React.FC = () => {
  const dispatch = useDispatch();
  const barRef = useRef(null) as any; // eslint-disable-line
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const asin = useSelector((state: AsinBase.IAsinGlobal) => state.asinGlobal.asin );
  const [form] = Form.useForm();

  const [update, setUpdate] = useState<string>('2020-08-12 17:54:02 PDT(太平洋)');
  const [lgImg, setLgImg] = useState<string>(''); // 大图
  const [imgs, setImgs] = useState<{
    isMain: boolean;
    img: string;
  }[]>([]); // 大图左侧的图片列表
  const [asinInfo, setAsinInfo] = useState<AsinBase.IInitResponse|null>(null);
  const [defaultSku, setDefaultSku] = useState<string>(''); // 选中的sku
  const [priceEs, setPriceEs] = useState<AsinBase.IProductAsinSkuVo|null>(null); // 价格估算及饼图占比

  //判断小数点
  const [priceVal, setPriceVal] = useState('');

  // 初始化请求
  useEffect(() => {
    if (currentShop.id) {
      new Promise((resolve, reject) => {
        dispatch({
          type: 'asinBase/getinitData',
          resolve,
          reject,
          payload: {
            headersParams: {
              StoreId: currentShop.id,
            },
            asin,
          },
        });
      }).then(datas => {

        const {
          data,
          code,
        } = datas as {
          data: AsinBase.IInitResponse;
          code: number;
        };

        if (code === 500) {
          return;
        }

        const { 
          updateTime,
          productImageVos,
          productAsinSkuVo,
        } = data;
        setAsinInfo(data);
        productImageVos.forEach(item => {
          if (item.isMain) {
            setLgImg(item.img);
          }
        });
        setImgs(productImageVos);
        setUpdate(updateTime);
        setDefaultSku(productAsinSkuVo.sku);
        setPriceEs(productAsinSkuVo);
        form.setFieldsValue({
          cost: productAsinSkuVo.cost,
          freight: productAsinSkuVo.freight,
          promotionFee: productAsinSkuVo.promotionFee,
          storageFee: productAsinSkuVo.storageFee,
          otherFee: productAsinSkuVo.otherFee,
          price: productAsinSkuVo.price,
        });
      });
    }
    
  }, [dispatch, currentShop, asin, form]);

  // 饼图渲染
  useEffect(() => {
    if (barRef && priceEs !== null) {
      const myChart = echarts.init(barRef.current);
      myChart.hideLoading();
      const pieValue = 1.5;
      const data = [
        { value: priceEs?.costPer, name: '成本' },
        { value: priceEs?.freightPer, name: '头程' },
        { value: priceEs?.promotionFeePer, name: '推广费用' },
        { value: priceEs?.storageFeePer, name: '仓储费用' },
        { value: priceEs?.otherFeePer, name: '其他费用' },
        { value: priceEs?.fbaFeePer, name: 'FBA fee' },
        { value: priceEs?.commissionPer, name: '佣金' },
      ];

      // 去掉0的数据项
      const newData: {}[] = [];
      data.forEach(item => {
        if (item.value === 0) {
          // data.splice(i, 1);
        } else {
          newData.push(item);
          newData.push({
            value: pieValue,
            name: '',
            itemStyle: {
              normal: {
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
              },
            },
          });
        }
      });

      if (newData.length === 2) {
        newData.pop();
      }

      const option = {
        color: [
          '#6eb9ff', 
          '#86e2e8',
          '#8aeba6',
          '#c5eb8a',
          '#f8e285',
          '#f68c9e',
          '#bd98f2',
        ],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            height: 260,
            top: 30,
            left: 0,
            data: newData,
            hoverAnimation: false,
            labelLine: {
              normal: {
                length: 25,
                length2: 8,
                lineStyle: {
                  type: 'solid',
                  // color: '#d9d9d9',
                },
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 0,
                shadowOffsetX: 0,
              },
            },
            label: {
              normal: {
                formatter: (params: ReturnProduct.IPieTextType) => {
                  let num = 0;
                  if (params.name === ''){
                    return '';
                  }
                  
                  for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    if (params.name === item.name) {
                      num = item.value;
                    }
                  }
                  return `{name|${params.name}：}{c|${ num }%}`;
                },
                borderWidth: 0,
                borderRadius: 4,
                align: 'center',
                color: '#3494BD',
                rich: {
                  name: {
                    color: '#555',
                    fontSize: 14,
                    // width: 60,
                  },
                  c: {
                    fontWeight: 550,
                    color: '#222',
                    fontSize: 14,
                  },
                },
              },
            },
          },
        ],
      };
      myChart.setOption(option as {});
    }
  }, [barRef, priceEs]);

  // 切换sku
  const tabSku = (sku: string) => {
    setDefaultSku(sku);
    new Promise((resolve, reject ) => {
      dispatch({
        type: 'asinBase/tabSkuData',
        resolve,
        reject,
        payload: {
          sku,
          headersParams: {
            StoreId: currentShop.id,
          },
        },
      });
    }).then(datas => {
      const { 
        data,
      } = datas as {
        data: AsinBase.IProductAsinSkuVo;
      };
      setPriceEs(data);
      form.setFieldsValue({
        cost: data.cost,
        freight: data.freight,
        promotionFee: data.promotionFee,
        storageFee: data.storageFee,
        otherFee: data.otherFee,
        price: data.price,
      });
    }).catch(err => {
      console.error(err);
    });
  };

  // 表单修改时
  const formChange = () => {
    const payload = {
      headersParams: {
        StoreId: currentShop.id,
      },
      sku: defaultSku,
      ...form.getFieldsValue(),
    };
    new Promise((resolve, reject) => {
      dispatch({
        type: 'asinBase/updatePriceEstimated',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      const {
        data,
      } = datas as {
        data: AsinBase.IProductAsinSkuVo;
      };
      setPriceEs(data);
    }).catch(err => {
      console.error(err);
    });
  };

  // 切换大图
  const switchImg = ({ img }: {isMain: boolean; img: string }) => {
    setLgImg(img);
    imgs.forEach(item => {
      if (item.img === img) {
        item.isMain = true;
      } else {
        item.isMain = false;
      }
    });
    setImgs([...imgs]);
  };

  const transitionInput = (value: string) => {
    return strToMoneyStr(value);
  };

  return (
    <div className={styles.baseBox}>
      <div className={styles.base}>
        <Update update={update} style={{
          padding: '8px 0 10px',
        }}/>
        <header className={styles.headProduct}>
          <div className={styles.productImgs}>
            <ul>
              { imgs.map((item, i) => {
                if (item.isMain) {
                  return <li 
                    key={i} 
                    className={styles.active} 
                    onClick={() => switchImg(item)}>
                    <GoodsImg src={item.img} alt="商品" width={40} />
                  </li>;
                }
                return <li 
                  key={i} 
                  onClick={() => switchImg(item)}>
                  <GoodsImg src={item.img} alt="商品" width={40} />
                </li>;
              })}
            </ul>
            <GoodsImg src={lgImg} alt="商品" className={styles.imgLg} width={316} />
          </div>
          <div className={styles.infos}>
            <p className={styles.title}>
              <a href={asinInfo?.url} target="_blank" rel="noreferrer" title={asinInfo?.title}>{asinInfo?.title}</a>
            </p>
            <p className={styles.seller}>{asinInfo?.brandName}</p>
            <div className={styles.rate}>
              <>
                <Rate value={asinInfo?.reviewScore || 0} disabled allowHalf style={{
                  fontSize: 15,
                  color: '#FFAF4D',
                }}/>
                <span className={styles.num}>{asinInfo?.reviewScore || 0}</span>
              </>
              <span className={styles.text}>
                {asinInfo?.reviewCount || 0}条评论 
                <span className={styles.decollator}>|</span> 
                {asinInfo?.answerQuestionNum || 0}条Q&A
              </span>
            </div>
            <div className={classnames(
              styles.icons,
              asinInfo?.isAc
              || asinInfo?.isBs
              || asinInfo?.idAdd
              || asinInfo?.isCoupon
              || asinInfo?.isPrime
              || asinInfo?.isPrime
              || asinInfo?.isPromotion
              || asinInfo?.isNr ? '' : 'none',
            )}>
              <span className={styles.iconItem} style={{
                display: asinInfo?.isAc ? 'inline-block' : 'none',
              }}>
                <Tooltip title="keyword">
                  {bigIcon.ac()}
                </Tooltip>
              </span>
              
              <span className={styles.iconItem} style={{
                display: asinInfo?.isBs ? 'inline-block' : 'none',
              }}>
                <Tooltip title="category名称">
                  {bigIcon.bs()}
                </Tooltip>
              </span>

              <span className={styles.iconItem} style={{
                display: asinInfo?.idAdd ? 'inline-block' : 'none',
              }}>
                <Tooltip title="Add-on item">
                  {bigIcon.add()}
                </Tooltip>
              </span>

              <span className={styles.iconItem} style={{
                display: asinInfo?.isCoupon ? 'inline-block' : 'none',
              }}>
                <Tooltip title={asinInfo?.coupon}>
                  {bigIcon.coupon()}
                </Tooltip>
              </span>

              <span className={styles.iconItem} style={{
                display: asinInfo?.isPrime ? 'inline-block' : 'none',
              }}>
                <Tooltip title="Prime">
                  {bigIcon.prime()}
                </Tooltip>
              </span>

              <span className={styles.iconItem} style={{
                display: asinInfo?.isPromotion ? 'inline-block' : 'none',
              }}>
                <Tooltip title="Promotion">
                  {bigIcon.promotion()}
                </Tooltip>
              </span>

              <span className={styles.iconItem} style={{
                display: asinInfo?.isNr ? 'inline-block' : 'none',
              }}>
                <Tooltip title={asinInfo?.nrCategory}>
                  {bigIcon.nr()}
                </Tooltip>
              </span>
            </div>
            <p className={styles.price}>
              Price：
              <span className={styles.num}>
                <ShowData value={asinInfo?.price} fillZero isCurrency/>
              </span>
            </p>
            <p className={styles.dayPrice} style={{
              display: asinInfo?.dealType ? 'block' : 'none',
            }}>
              {asinInfo?.dealType}： 
              <span className={styles.num}>
                {asinInfo?.dealPrice === null ? '-' : currentShop.currency + asinInfo?.dealPrice}
              </span>
            </p>
            <div className={styles.sellers}>
              <div className={styles.left} style={{
                display: asinInfo?.isBuyBox ? 'block' : 'none',
              }}>
                <p>Buybox卖家：{asinInfo?.sellerName}</p>
                <p>卖家数：{asinInfo?.usedNewSellNum}</p>
              </div>
              <div className={styles.right}>
                <p>发货方式：{asinInfo?.fulfillmentChannel}</p>
                <span>上架时间：{asinInfo?.openDate}</span>
              </div>
            </div>
            <div className={styles.ranking}>
              {
                asinInfo?.ranking.map((item, i) => {
                  return <p key={i}>
                    <Tooltip title={`
                      ${item.isTopCategory ? '大类' : '小类'}排名：#${item.categoryRanking} ${item.categoryName}`
                    }>
                      <>
                        <span className={styles.num}>#{item.categoryRanking} </span>
                        {item.categoryName}
                      </>
                    </Tooltip>
                  </p>;
                })
              }
            </div>
            <div className={styles.variant}>
              <div className={styles.left}>
                <p>Color：{asinInfo?.color ? asinInfo?.color : '—'}</p>
                <p>包装重量：{asinInfo?.shippingWeight ? asinInfo?.shippingWeight : '—'}</p>
              </div>
              <div className={styles.right}>
                <p>Size：{asinInfo?.size ? asinInfo?.size : '—'}</p>
                <span>包装尺寸：{asinInfo?.productDimensions ? asinInfo?.productDimensions : '—'}</span>
              </div>
            </div>
          </div>
        </header>
        <main className={styles.datas}>
          <header>
            <span className={styles.text}>SKU：</span>
            <Radio.Group value={defaultSku} >
              {
                asinInfo?.skus.map((item, i) => {
                  return <Radio value={item} onChange={() => tabSku(item)} key={i}>{item}</Radio>;
                })
              }
            </Radio.Group>
          </header>

          <div className={styles.box}>
            <div className={styles.profit}>
              <Form form={form} 
                onChange={formChange}
                name="asinTable"
                initialValues={{ remember: true }}
                id="asinTable"
              >
                <h2 onClick={formChange}>利润估算：</h2>

                <div className={styles.common}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>售价：</span>
                    <span>{currentShop.currency}</span>
                    <Form.Item
                      name="price"
                      normalize={transitionInput}
                      rules={[
                        { required: true, message: '售价不能为空或0' },
                        { pattern: new RegExp(/^[1-9]\d{0,7}(\.\d{1,3})?$|^0(\.\d{1,2})?$/),
                          message: priceVal.charAt(priceVal.length - 1) === '.' ? '请输入小数，最多两位！' : '超过限制，请重新输入！' },
                        { pattern: new RegExp(/[^0]/), message: '售价不能为0' },
                      ]}
                    >
                      <Input
                        className={ styles.input }
                        onChange={ (e) => setPriceVal(e.target.value) }
                      />
                    </Form.Item>
                    <span className={styles.placehoader} style={{
                      display: priceEs?.priceCny === null ? 'none' : 'inline-block',
                    }}>
                    （￥<ShowData value={priceEs?.priceCny}/>）
                    </span>
                  </label>
                </div>
                
                <div className={styles.common}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>采购成本：</span>
                    <span>{currentShop.currency}</span>
                    <Form.Item name="cost" normalize={transitionInput}>
                      <Input className={ styles.input } />
                    </Form.Item>
                    <span className={styles.placehoader} style={{
                      display: priceEs?.costCny === null ? 'none' : 'inline-block',
                    }}>
                    （￥<ShowData value={priceEs?.costCny}/>）
                    </span>
                  </label>
                </div>

                <div className={styles.common}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>头程：</span>
                    <span>{currentShop.currency}</span>
                    <Form.Item name="freight" normalize={transitionInput}>
                      <Input className={ styles.input }/>
                    </Form.Item>
                    <span className={styles.placehoader} style={{
                      display: priceEs?.freightCny === null ? 'none' : 'inline-block',
                    }}>
                      （￥<ShowData value={priceEs?.freightCny}/>）
                    </span>
                  </label>
                </div>

                <div className={styles.base}>
                  <span className={styles.text}>佣金：</span>
                  <span className={styles.va1}>
                    <ShowData value={priceEs?.commission} isCurrency/>
                  </span>
                  <span className={styles.va12} style={{
                    display: priceEs?.commissionCny === null ? 'none' : 'inline-block',
                  }}>
                    （￥<ShowData value={priceEs?.commissionCny}/>）
                  </span>
                </div>

                <div className={styles.base}>
                  <span className={styles.text}>FBA fee：</span>
                  <span className={styles.va1}>
                    <ShowData value={priceEs?.fbaFee} isCurrency/>
                  </span>
                  <span className={styles.va12} style={{
                    display: priceEs?.fbaFeeCny === null ? 'none' : 'inline-block',
                  }}>
                    （￥<ShowData value={priceEs?.fbaFeeCny}/>）
                  </span>
                </div>

                <div className={styles.common}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>
                      推广费用：
                      <Tooltip title="推广费用=ASIN最近60天的广告花费/总销量；若广告花费不为0，总销量为0，则推广费用为空；">
                        <QuestionCircleOutlined className={styles.icon}/>
                      </Tooltip>
                    </span>
                    <span>{currentShop.currency}</span>
                    <Form.Item name="promotionFee" normalize={transitionInput}>
                      <Input className={ styles.input }/>
                    </Form.Item>
                    <span className={styles.placehoader} style={{
                      display: priceEs?.promotionFeePer === null ? 'none' : 'inline-block',
                    }}>
                      （￥<ShowData value={priceEs?.promotionFeePer}/>）
                    </span>
                  </label>
                </div>

                <div className={styles.common}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>
                    仓储费用：
                      <Tooltip overlayStyle={{
                        maxWidth: 285,
                      }} title="平均每件货物的仓储费用（从入仓到卖出）">
                        <QuestionCircleOutlined className={styles.icon}/>
                      </Tooltip>
                    </span>
                    <span>{currentShop.currency}</span>
                    <Form.Item name="storageFee" normalize={transitionInput}>
                      <Input className={ styles.input }/>
                    </Form.Item>
                    <span className={styles.placehoader} style={{
                      display: priceEs?.storageFeeCny === null ? 'none' : 'inline-block',
                    }}>
                      （￥<ShowData value={priceEs?.storageFeeCny}/>）
                    </span>
                  </label>
                </div>

                <div className={styles.common}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>其他：</span>
                    <span>{currentShop.currency}</span>
                    <Form.Item name="otherFee" normalize={transitionInput}>
                      <Input className={ styles.input }/>
                    </Form.Item>
                    <span className={styles.placehoader} style={{
                      display: priceEs?.otherFeeCny === null ? 'none' : 'inline-block',
                    }}>
                      （￥<ShowData value={priceEs?.otherFeeCny}/>）
                    </span>
                  </label>
                </div>
              
                <div className={styles.base}>
                  <span className={styles.text}>利润：</span>
                  <span className={styles.va1}>
                    <ShowData value={priceEs?.profit} isCurrency/>
                  </span>
                  <span className={styles.va12}>
                  （￥<ShowData value={priceEs?.profitCny}/>）
                  </span>
                </div>

                <div className={styles.base}>
                  <span className={styles.text}>利润率：</span>
                  <span className={styles.va1}>
                    {
                      priceEs?.profitMargin === null || priceEs?.profitMargin === undefined ? 
                        <Empty /> : 
                        `${priceEs?.profitMargin}%`
                    }
                  </span>
                </div>
              </Form>
            </div>
            <div className={styles.costPrice}>
              <h2>成本估算：</h2>
              <p>总成本：<ShowData value={priceEs?.totalCost} isCurrency /></p>
              <div className={styles.bar} ref={barRef as React.RefObject<HTMLDivElement>}></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AsinBase;
