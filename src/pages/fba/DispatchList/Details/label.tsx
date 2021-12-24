import React, { useState, useEffect, useRef, PureComponent } from 'react';
import styles from './index.less';
import { Radio, Modal, Table, Form, Input, message, Popconfirm, Select } from 'antd';
import { history } from 'umi';
import { strToUnsignedIntStr } from '@/utils/utils';
import { product } from '@/utils/routes';
import GoodsImg from '@/pages/components/GoodsImg';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import Barcode from '../../components/Barcode';
import InputEditBox from '@/pages/fba/components/InputEditBox';
import { useReactToPrint } from 'react-to-print';


const { Item } = Form;

interface IProps{
    modalData: {
      modalvisible: boolean;
      recordData: DispatchList.IProductVos; 
    };
    onCancle: () => void;
    data: DispatchList.IProductVos[] | null;
    site: API.Site; 
}

interface ILebal extends DispatchList.IProductVos{
    issuuednumdata: number[];
}

interface IPreviewdata{
    isPrintSKU: boolean;
    isPrintProductname: boolean;
    isPrintMSKU: boolean;
    isPrintNameNa: boolean;
    barcodeFontsize: number;
    barcodewidthprops: number;
    lebalwidthprops: number;
    columnnumprops: number;
    lebalheightprops: number;
    printHeight: number;
}

interface IPrint {
    tabledata: ILebal[];
    previewdata: IPreviewdata;
    selfdata: string[];
}

const correspondingWight = 1050; //A4纸宽对应的px值；
const correspondingHeight = 1560;
//连接打印机的打印页面
class Printpage extends PureComponent<IPrint>{
  constructor(props: IPrint){
    super(props);    
  }

  render(){
    const {
      tabledata,
      selfdata,
      previewdata: {
        isPrintSKU,
        barcodeFontsize,
        barcodewidthprops,
        lebalwidthprops,
        isPrintProductname,
        columnnumprops,
        isPrintNameNa,
        isPrintMSKU,
        printHeight,
      },
    } = this.props;
    return (
      <div className={styles.firstdiv}>    
        {
          tabledata.map((item, index) => {
            return (
              item.issuuednumdata.map((key, i) => {
                return (
                  <div 
                    key={`${index}-${i}`} 
                    className={styles.flexcenter}
                    style={{ width: columnnumprops, height: printHeight, overflow: 'hidden' }}
                  >
                    <div className="lebaldiv" style={{ width: lebalwidthprops, height: printHeight }}>
                      <div className={styles.flexcenter}>
                        <Barcode 
                          fontSize={barcodeFontsize} 
                          value={item.fnsku} 
                          barcodewidthprops={barcodewidthprops} 
                          id={`${item.id}`}/>
                      </div>
                      <div className={styles.flexcenter}>
                        {isPrintProductname ? item.itemName : ''}
                      </div>
                      <div className={styles.flexcenter}>
                        {isPrintNameNa ? item.nameNa : ''}
                      </div>
                      <div className={styles.flexcenter}>
                        {isPrintSKU ? item.sku : ''}
                      </div>
                      <div className={styles.flexcenter}>
                        {isPrintMSKU ? item.sellerSku : ''}
                      </div>
                      {
                        selfdata.map((item, index) => {
                          return <div key={index} className={styles.flexcenter}>{item}</div>;
                        })
                      }
                      <div className={styles.flexcenter}>Made in CHina</div>
                    </div>
                  </div>
                );
              })
            );
          })
        }
      </div>
    );
  }
}

const { Option } = Select;
const Lebal: React.FC<IProps> = (props) => {
  const {
    modalData: {
      modalvisible,
      recordData,
    },
    onCancle, 
    data,
    site,
  } = props;
    
  const [form] = Form.useForm();
  const componentRef = useRef<any>();//eslint-disable-line
  //是否打印sku
  const [isPrintSKU, setIsPrintSKU] = useState<boolean>(false);
  //是否打印货品名称
  const [isPrintProductname, setIsPrintProductname] = useState<boolean>(false);
  const [isPrintMSKU, setIsPrintMSKU] = useState<boolean>(false);
  const [isPrintNameNa, setIsPritNameNa] = useState<boolean>(false);

  //const [printTemplate, setPrintTemplate] = useState<boolean>(false);
  //是否有提示语
  const [isinclus, setIsinclus] = useState<string>('');
  const [barcodeinclus, setBarcodeinclus] = useState<string>('');

  //是否去绑定sku的气泡框
  const [skuVisible, setSkuVisible] = useState<boolean>(false);

  const [tabledata, setTabledata] = useState<ILebal[] >([]);

  //自定义内容
  const [selfdata, setSelfdata] = useState<string[]>(['']);
  //添加自定义文本框是否有气泡框
  const [isAddSelfcontent, setIsAddSelfcontent] = useState<boolean>(false);
    
  //传给打印预览的值
  const [previewdata, setPreviewdata] = useState<IPreviewdata>({
    isPrintSKU: false,
    isPrintProductname: false,
    barcodeFontsize: 20,
    barcodewidthprops: 250,
    lebalwidthprops: 250,
    columnnumprops: 262,
    lebalheightprops: 200,
    isPrintNameNa: false,
    isPrintMSKU: false,
    printHeight: 50,
  });

  //传给条形码的值
  const [barcodeFontsizeprops, setBarcodeFontsizeprops] = useState<number>(20);
  const [barcodewidthprops, setBarcodewidthprops] = useState<number>(250);

  //传给标签大小的值
  const [lebalwidthprops, setLebalwidthprops] = useState<number>(350);
  const [columnnumprops, setColumnnumprops] = useState<number>(350);
  //const [lebalheightprops, setLebalheightprops] = useState<number>(200);
  const [printHeight, setPrintHeight] = useState<number>(156);
  //const [printWidth, setPrintWidth] = useState<number>(42);

  //优化一下卡顿问题
  const [printvisible, setPrintvisible] = useState<boolean>(false);

  //表单默认值，传给打印模板的值
  const formInitialValue = ({
    isPrintProductname: false,
    isPrintSKU: false,
    isPrintMSKU: false,
    isPrintNameNa: false,
    lebalheight: '10',
    lebalwidth: 50,
    barcodeWidth: 50,
    barcodeFontsize: 20,
    unitnum: 1,
    columnnum: 3,  
  }); 

  //点击修改打印数量的回调
  const updateDeclared = function(newval: number, index: number){
    tabledata[index].issuedNum = newval;
    setTabledata([...tabledata]);
  };

  //修改统一打印数量的值
  const handleunitnum = (e: any) => {//eslint-disable-line
    const newvalue = tabledata.map((item) => {
      item.issuedNum = e.target.value;
      return item;
    });
    setTabledata([...newvalue]);
  };

  //给每个属性添加一个数组
  useEffect(() => {
    const datas = (data || []).map((item) => { 
      const dd = new Array(item.issuedNum * 1);
      for (let i = 0;i < dd.length;i++){
        dd[i] = 0;
      }
      return Object.assign(item, { issuuednumdata: dd });    
    });
    setTabledata(datas);
  }, [props]);//eslint-disable-line react-hooks/exhaustive-deps

  const widthlimitfn = () => {
    const lebalwidth = form.getFieldValue('lebalwidth'); 
    const columnnum = form.getFieldValue('columnnum');
    const barcodeWidth = form.getFieldValue('barcodeWidth');
    const barcodeFontsize = form.getFieldValue('barcodeFontsize');
    const lebalheight = form.getFieldValue('lebalheight');
    const isPrintProductname = form.getFieldValue('isPrintProductname');
    const isPrintSKU = form.getFieldValue('isPrintSKU');
    const isPrintMSKU = form.getFieldValue('isPrintMSKU');
    const isPrintNameNa = form.getFieldValue('isPrintNameNa');

            
    //改变传给barcode的值
    setBarcodeFontsizeprops(barcodeFontsize * 1);
    setBarcodewidthprops(barcodeWidth * 5);
        
    //传给打印预览的值
    setLebalwidthprops(lebalwidth * 5);
    setColumnnumprops(Math.floor( correspondingWight / columnnum));
    //setLebalheightprops(lebalheight * 5);
    //是否打印文字内容
    setIsPrintProductname(isPrintProductname);
    setIsPrintSKU(isPrintSKU);
    setIsPrintMSKU(isPrintMSKU);
    setIsPritNameNa(isPrintNameNa);

    //标签的高
    setPrintHeight(correspondingHeight / lebalheight );

        
    if (lebalwidth * 5 < barcodeWidth * 5){
      setBarcodeinclus('条码宽度应小于标签宽度');            
    } else {
      setBarcodeinclus('');
    }
    if (lebalwidth * columnnum > 210){
      setIsinclus(
        `标签总宽度（${lebalwidth}*${columnnum}=${lebalwidth * columnnum}mm）不能超过a4纸宽度（210mm），请修改列数或宽度`
      );        
    } else {
      setIsinclus('');
    } 
    isPrintSKU || setSkuVisible(false);
    isPrintSKU && tabledata.some(item => item.sku === null) && setSkuVisible(true);

    for (let i = 0;i < selfdata.length;i++){
      const changedata = form.getFieldValue(`text${i}`);
      selfdata[i] = changedata;
      setSelfdata([...selfdata]);
    }
  };  
  //点击删除的回调
  const handledelete = function(id: string){
    if (tabledata.length === 1){
      message.warning('商品不能为空');
    }
    const index = tabledata.findIndex(item => item.id === id);
    if (index > -1){
      tabledata.splice(index, 1);
      setTabledata([...tabledata]);
    }
  };

  //点击加号图片的回调
  const addIconClick = () => {
    if (selfdata.length >= 10){
      setIsAddSelfcontent(true);
      return;
    }
    const d1 = selfdata.concat(''); 
    setSelfdata(d1);
  };
  //点击减号图标的回调
  const jianIconClick = () => {
    const d2 = selfdata.slice(0, -1);
    setSelfdata(d2);
    setIsAddSelfcontent(false);
  };
    
  //全部列
  const columns = [{
    title: '图片品名SKU',
    width: 325,
    dataIndex: 'itemName',
    key: 'itemName',  
    align: 'center',
    render(value: string, record: DispatchList.IProductVos){
      const { 
        itemName,
        sku,
        url,
      } = record;
      return <div className={styles.productCol}>
        <GoodsImg src={url} alt="商品" width={36}/>
        <div className={styles.coldetails}>
          <a href={getAmazonAsinUrl(value, site)} 
            className={styles.coltitle}
            target="_blank"
            rel="noreferrer"
            title={itemName}
          >
            <Iconfont type="icon-lianjie" className={styles.collinkIcon}/>{itemName}</a>
          <footer>
            <span className={styles.colsku}>{sku}</span>
          </footer>
        </div>
      </div>;
    },            
  }, {
    title: '打印数量',
    width: 178, 
    dataIndex: 'issuedNum',
    key: 'issuedNum', 
    align: 'center',
    render(val: string, record: DispatchList.IProductVos, index: number) {            
      return <InputEditBox 
        value={`${record.issuedNum ? record.issuedNum : 0}`} 
        chagneCallback={(val) => updateDeclared(val as number, index)} 
      />;   
    },
  }, {
    title: '操作',
    key: 'handle',
    dataIndex: 'handle', 
    align: 'center', 
    render( _: string, record: DispatchList.IProductVos){
      return <span className={styles.handledelete} onClick={() => {
        handledelete(record.id); 
      }}>删除</span>;
    },
  }];
  const limitedInput = function(val: string) {
    return strToUnsignedIntStr(val);
  };
 
  const pagestyle = `
  @page {
    size: auto;
    margin: 40px 40px;
  }
  @media print {
    html, body {
    height: initial !important;
    overflow: initial !important;
    -webkit-print-color-adjust: exact;
  }
}
`;

  //点击打印预览的回调
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: pagestyle,
  });

  const modleonok = () => {  
    setPrintvisible(true);   
    if (isinclus === '' 
          && barcodeinclus === '' 
            && tabledata.some( item => item.issuedNum * 1 !== 0)){
      setPreviewdata({
        isPrintSKU: isPrintSKU,
        isPrintProductname: isPrintProductname,
        barcodeFontsize: barcodeFontsizeprops,
        barcodewidthprops: barcodewidthprops,
        lebalwidthprops: lebalwidthprops,
        columnnumprops: columnnumprops,
        lebalheightprops: printHeight,
        isPrintMSKU: isPrintMSKU,
        isPrintNameNa: isPrintNameNa,
        printHeight: printHeight,
      }); 
      const datas = tabledata.map((item) => {
        const dd = new Array(item.issuedNum * 1);
        for (let i = 0;i < dd.length;i++){
          dd[i] = 0;
        }
        return Object.assign(item, { issuuednumdata: dd });    
      });
      setTabledata(datas);
      setSkuVisible(false);
      setIsAddSelfcontent(false);
      //setPrintTemplate(!printTemplate);
      setTimeout(() => {
        handleprint && handleprint();
        setPrintvisible(false);
      }, 1000);        
    }
  };
   
  return (
    <div>
      <Modal 
        visible={modalvisible}
        mask={true}
        maskClosable={false}
        maskStyle={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        className={styles.modal}
        width={1116}
        onOk={modleonok}
        onCancel={onCancle}
        centered
      >
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.title}>打印</div>
            <Form form={form} initialValues={formInitialValue} name="lebalinfo" onFieldsChange={widthlimitfn}>
              <div className={styles.singlediv}>
                <span className={styles.span} style={{ width: 80 }}>标签尺寸：</span>  
                <span>高:</span>
                <Item name="lebalheight" normalize={limitedInput}> 
                  <Select>
                    <Option value="3">100</Option>
                    <Option value="4">75</Option>
                    <Option value="6">50</Option>
                    <Option value="8">37.5</Option>
                    <Option value="10">30</Option>
                    <Option value="12">25</Option>
                  </Select>
                </Item >
                <span>mm</span>
                <span style={{ marginLeft: 5 }}>宽</span>
                <Item name="lebalwidth" normalize={limitedInput} >
                  <Input/>
                </Item>
                <span>mm</span>
                <span className={styles.inclus}>{isinclus}</span>            
              </div>
              <div className={styles.singlediv}>
                <span className={styles.span}>货品名称：</span>
                <Item name="isPrintProductname"> 
                  <Radio.Group>
                    <Radio value={false}>不打印</Radio>                               
                    <Radio value={true}>打印货品名称</Radio>                       
                  </Radio.Group>
                </Item>                       
              </div>
              <div className={styles.singlediv}>
                <span className={styles.span}>中文名称：</span>
                <Item name="isPrintNameNa"> 
                  <Radio.Group>
                    <Radio value={false}>不打印</Radio>
                    <Radio value={true}>打印中文名称</Radio>                       
                  </Radio.Group>
                </Item>                       
              </div>
              <div className={styles.singlediv}>
                <span className={styles.span}>SKU：</span>
                <Item name="isPrintSKU">                  
                  <Radio.Group>
                    <Radio value={false}>不打印</Radio>
                    <Radio value={true}>
                      <Popconfirm
                        title="目前还未关联SKU,是否去关联"
                        visible={skuVisible}
                        okText="去关联"
                        cancelText="取消"
                        onCancel={() => {
                          setSkuVisible(false);form.setFieldsValue({ isPrintSKU: false }); 
                        }}
                        onConfirm={() => {
                          history.push(product.skuData); 
                        }}
                      >
                        <span>打印</span>
                      </Popconfirm>
                    </Radio>
                  </Radio.Group>
                </Item>                       
              </div>
              <div className={styles.singlediv}>
                <span className={styles.span}>MSKU：</span>
                <Item name="isPrintMSKU"> 
                  <Radio.Group>
                    <Radio value={false}>不打印</Radio>                               
                    <Radio value={true}>打印MSKU</Radio>                       
                  </Radio.Group>
                </Item>                       
              </div>
              <div className={styles.singlediv}>
                <span className={styles.span}>每页列数：</span>
                <Item name="columnnum">
                  <Radio.Group>
                    <Radio value={1}>1列</Radio>
                    <Radio value={2}>2列</Radio>
                    <Radio value={3}>3列</Radio>
                    <Radio value={4}>4列</Radio>
                  </Radio.Group>
                </Item>                
              </div>
              <div className={styles.singlediv}>
                <span className={styles.span}>条码字体：</span>
                <Item name="barcodeFontsize" normalize={limitedInput}>
                  <Input/>
                </Item>
                <span>pt</span>
              </div>
              <div className={styles.singlediv}>
                <span className={styles.span}>条码宽度：</span>
                <Item name="barcodeWidth" normalize={limitedInput} style={{ marginTop: 14 }}>
                  <Input/>
                </Item>
                <span>pt</span>
                <span className={styles.inclus}>{barcodeinclus}</span>
              </div>
              <div className={styles.singlediv}>
                <div className={styles.selfflex}>
                  <span style={{ marginTop: 14 }}>自定义内容：</span>
                  <div>
                    {
                      selfdata.map((item, index) => {
                        if (index === selfdata.length - 1){
                          return <div 
                            key={index} 
                            className={styles.selfflex} 
                            style={{ marginTop: 14 }}
                          >
                            <span>文本{index + 1}</span>
                            <Item name={`text${index}`}>
                              <Input className={styles.text}/>
                            </Item>                           
                            <Iconfont 
                              type="icon-zengjiatianjiajiahao" 
                              style={{ display: selfdata[0] ? 'block' : 'none' }}
                              className={styles.jianicon} 
                              onClick={addIconClick}/>
                            <Iconfont 
                              type="icon-jian1"
                              style={{ display: selfdata.length >= 2 ? 'block' : 'none' }} 
                              className={styles.addicon} 
                              onClick={jianIconClick} />
                            <Popconfirm
                              title="已超过10个，不能继续添加"
                              visible={isAddSelfcontent}
                              onCancel={() => {
                                setIsAddSelfcontent(false); 
                              }}
                              onConfirm={() => {
                                setIsAddSelfcontent(false);
                              }}
                            ></Popconfirm> 
                          </div>;      
                        }
                        return <div 
                          key={index} 
                          className={styles.selfflex} 
                          style={{ marginTop: 14 }}
                        >
                          <span>文本{index + 1}</span>
                          <Item name={`text${index}`}>
                            <Input className={styles.text}/>
                          </Item>                           
                        </div>;                                               
                      })
                    }                                                       
                  </div>
                </div>               
              </div> 
              <div className={styles.singlediv}>
                <span className={styles.lastspan}>设置批量打印数量：</span>
                <Item name="unitnum" normalize={limitedInput} > 
                  <Input onChange={handleunitnum}/>
                </Item>
              </div>
            </Form>
            <Table
              columns={columns as []} 
              dataSource={tabledata} 
              className={styles.table}
              pagination={false}
              rowKey="id"
            />
          </div>
          <div className={styles.right}>
            <div className={styles.title} >标签预览</div>
            <div className={styles.border}>
              <div 
                style={{ width: lebalwidthprops, height: printHeight }} 
                className={styles.flexcenterpre}
              >
                <div>
                  <div className={styles.lebal}>
                    <Barcode 
                      fontSize={barcodeFontsizeprops} 
                      value={recordData.fnsku} 
                      barcodewidthprops={barcodewidthprops} 
                      id={`${recordData.id}`}></Barcode>
                  </div>
                  <div className={styles.flexcenterpre}>
                    {isPrintProductname ? recordData.itemName : ''}
                  </div>
                  <div className={styles.flexcenterpre}>
                    {isPrintNameNa ? recordData.nameNa : ''}
                  </div>
                  <div className={styles.flexcenterpre}>
                    {isPrintSKU ? recordData.sku : ''}
                  </div>
                  <div className={styles.flexcenterpre}>
                    {isPrintMSKU ? recordData.sellerSku : ''}
                  </div>
                  {
                    selfdata.map((item, index) => {
                      return <div key={index} className={styles.flexcenterpre}>{item}</div>;
                    })
                  }
                  <div className={styles.flexcenterpre}>Made in CHina</div>
                </div>
              </div>
            </div>
          </div>              
        </div>
      </Modal>
      {
        printvisible ? <div style={{ display: 'none' }}>      
          <Printpage 
            ref={componentRef}
            tabledata={tabledata} 
            previewdata={previewdata} 
            selfdata={selfdata}></Printpage>
        </div> : null
      }           
    </div>); 
};
export default Lebal;
