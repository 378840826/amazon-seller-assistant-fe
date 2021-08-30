/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-06 12:01:01
 * @LastEditTime: 2021-05-18 10:10:40
 */
import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Modal,
  Form,
  Select,
  Input,
  Button,
  Table,
  message,
} from 'antd';
import ShowData from '@/components/ShowData';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { Link } from 'umi';
import GoodsImg from '@/pages/components/GoodsImg';
import {
  asinPandectBaseRouter,
} from '@/utils/routes';

interface IProps {
  visible: boolean;
  marketplace: API.Site;
  onCancel: () => void;
}

const { Item } = Form;
const { Option } = Select; 
const Addplan: React.FC<IProps> = function(props) {
  const {
    visible,
    onCancel,
    marketplace,
  } = props;

  const [data] = useState<any[]>([ // eslint-disable-line
    { asin: 1123, b: '11' },
    { asin: 1123, b: 'cc' },
    { asin: 1123, b: null },
    { asin: 1123, b: '33' },
  ]);
  const [selects, setSelects] = useState<any[]>([]);// eslint-disable-line
  const [loading] = useState<boolean>(true);
  const [asin, setAsin] = useState<string|'notRequest'>('');// eslint-disable-line

  // 全选
  const allSelect = () => {
    const maxSelect = 1000; // 商品最大选择的数量
    if (data.length === 0 || data.length === selects.length) {
      return;
    }

    if (data.length > maxSelect) {
      message.warn(`当前店铺商品有${data.length}个，最多添加${maxSelect}个商品，已为你选择前面${maxSelect}个，请知悉`);
      setSelects([...data.slice(0, maxSelect)]);
      return;
    }

    setSelects([...data]);
  };


  // 删除单个
  const delItemSelect = (asin: string) => {
    for (let i = 0; i < selects.length; i++) {
      if (selects[i].asin === asin) {
        selects.splice(i, 1);
        setSelects([...selects]);
        break;
      }
    }
  };

  // 删除全部
  const delAllSelect = () => {
    if (selects.length === 0) {
      return;
    }
    setSelects([...[]]);
  };

  const getColumns = (type: 'leftColumns'|'rightColumns') => {
    return [
      {
        title: '图片/标题/ASIN/SKU',
        align: 'center',
        dataIndex: 'title',
        // key: 'title',
        width: 310,
        render(value: string, record: any) {// eslint-disable-line
          const {
            title = '',
            imgUrl = '',
            asin = '',
            price,
            sku,
          } = record;
          const titleLink = getAmazonAsinUrl(asin, marketplace);
  
          return <div className={styles.productCol}>
            <GoodsImg alt="商品" src={imgUrl} width={46}/>
            <div className={styles.details}>
              <a href={titleLink} className={styles.title} rel="noreferrer" target="_blank" title={title}>
                <Iconfont type="icon-lianjie" className={styles.linkIcon}/>
                {title}
              </a>
              <div className={styles.info}>
                <Link 
                  to={`${asinPandectBaseRouter}?asin=${asin}`} 
                  className={styles.asin}>
                  {asin}
                </Link>
                <span className={styles.ranking}>
                  <span className={styles.score}>
                    <ShowData value={record.reviewStars} fillNumber={1}/>
                  </span>
                  （<ShowData value={record.reviewNum} fillNumber={0}/>）
                </span>
                <span className={styles.price}><ShowData value={price} isCurrency/></span>
              </div>
              <p>{sku}</p>
            </div>
          </div>;
        },
      },
      {
        title: 'MSKU/FnSKU',
        align: 'center',
        dataIndex: 'sellable',
        key: 'sellable',
        
      },
      {
        title: 'FBA可售库存',
        align: 'center',
        dataIndex: 'ranking',
        key: 'ranking',
        render(val: string) {
          return <div>{[null, ''].includes(val) ? <ShowData value={null} /> : val}</div>;
        },
      },
 
      {
        title: '操作',
        align: 'center',
        dataIndex: 'asin',
        // key: 'handle',
        width: 60,
        render(val: string, record: any) {// eslint-disable-line

          // 右边的表格
          if (type === 'rightColumns') {
            return <span 
              className={styles.handleCol}
              onClick={() => delItemSelect(val)}>
              删除
            </span>;
          }

          let flag = false;

          for (let i = 0; i < selects.length; i++) {
            const item = selects[i];
            if (item.asin === val) {
              flag = true;
              break;
            }
          }

          if (flag) {
            return <span 
              className={classnames(styles.handleCol, styles.selected)}>
              已选
            </span>;
          }
  
          return <span className={styles.handleCol} onClick={() => {
            selects.push(record);
            setSelects([...selects]);
          }}>选择</span>;
        },
      },
    ];
  };

  const searchProduct = (asin: string, event: any ) => { // eslint-disable-line
    // 这个条件限制当点击X图标时，不重新请求数据
    if (asin === '' && 'button' in event && event.target.className === 'ant-input') {
      setAsin('notRequest');
      return;
    }
    console.log(asin);
    
    setAsin(asin);
  };


  let leftCount = 0;
  const LeftTable = {
    columns: getColumns('leftColumns') as [],
    dataSource: data,
    rowKey(){
      return leftCount++;
    },
    loading,
    locale: {
      emptyText: <span className="secondaryText">店铺无商品</span>,
    },
    scroll: {
      y: 320,
    },
    pagination: false as false,
  };

  let rightCount = 0;
  const rightTable = {
    columns: getColumns('rightColumns') as [],
    dataSource: selects,
    rowKey(){
      // return record.asin;
      return rightCount++;
    },
    // loading,
    locale: {
      emptyText: <span className="secondaryText">左边添加商品</span>,
    },
    scroll: {
      y: 320,
    },
    pagination: false as false,
  };


  return <div className={styles.box}>
    <Modal visible={visible}
      closable={false}
      centered
      maskClosable={false}
      width={1285}
      wrapClassName={styles.modalBox}
      onCancel={onCancel}
    >
      <header className={styles.topHead}>创建货件计划</header>
      <Form 
        className={styles.conditions} 
        labelAlign="left"
        name="addPlan"
      >
        <Item name="site" label="站点">
          <Select>
            <Option value="1">US</Option>
            <Option value="2">US</Option>
            <Option value="3">US</Option>
            <Option value="4">US</Option>
            <Option value="5">US</Option>
          </Select>
        </Item>
        <Item name="site1" label="店铺名称">
          <Select>
            <Option value="1">US</Option>
            <Option value="2">US</Option>
            <Option value="3">US</Option>
            <Option value="4">US</Option>
            <Option value="5">US</Option>
          </Select>
        </Item>
        <Item name="site2" label="目的仓库">
          <Select>
            <Option value="1">US</Option>
            <Option value="2">US</Option>
            <Option value="3">US</Option>
            <Option value="4">US</Option>
            <Option value="5">US</Option>
          </Select>
        </Item>
        <Item name="site3" label="物流方式">
          <Select>
            <Option value="1">US</Option>
            <Option value="2">US</Option>
            <Option value="3">US</Option>
            <Option value="4">US</Option>
            <Option value="5">US</Option>
          </Select>
        </Item>
        <Item name="site4" label="包装方式">
          <Select>
            <Option value="1">US</Option>
            <Option value="2">US</Option>
            <Option value="3">US</Option>
            <Option value="4">US</Option>
            <Option value="5">US</Option>
          </Select>
        </Item>
        <Item name="site5" label="贴标方">
          <Select>
            <Option value="1">US</Option>
            <Option value="2">US</Option>
            <Option value="3">US</Option>
            <Option value="4">US</Option>
            <Option value="5">US</Option>
          </Select>
        </Item> 
        <Item name="site6" label="发货地址">
          <Select>
            <Option value="1">US</Option>
            <Option value="2">US</Option>
            <Option value="3">US</Option>
            <Option value="4">US</Option>
            <Option value="5">US</Option>
          </Select>
        </Item>
        <Item name="site7" label="备注">
          <Input />
        </Item>
      </Form>
      <div className={styles.uploading}>
        <Button type="primary" className={styles.uploadBtn}>批量上传</Button>
        <Button type="link">下载模板</Button>
      </div>
    
      <div className={styles.productSelect}>
        <div className={styles.layoutLeft}>
          <header className={styles.head}>
            <Input.Search
              autoComplete="off"
              placeholder="输入标题、ASIN或SKU" 
              enterButton={<Iconfont type="icon-sousuo" />} 
              className="h-search"
              allowClear
              onSearch={searchProduct}
            />
            <span style={{
              paddingRight: data.length > 3 ? 36 : 20,
            }} className={classnames(
              styles.allSelect, 
              data.length ? '' : styles.disable,
              data.length > 0 && data.length <= selects.length ? styles.disable : '',
            )}
            onClick={allSelect}
            >
              {data.length && data.length <= selects.length ? '已全选' : '全选'}
            </span>
          </header>
          <Table {...LeftTable} className={styles.table}/>
        </div>
        <div className={styles.layoutRight}>
          <header className={styles.head}>
            <span>已选商品</span>
            <span className={classnames(
              styles.delSelect, 
              selects.length ? '' : styles.disable,
            )} onClick={delAllSelect}>删除全部</span>
          </header>
          <Table {...rightTable} className={styles.table}/>
        </div>

      </div>
    </Modal>
  </div>;
};


export default Addplan;
