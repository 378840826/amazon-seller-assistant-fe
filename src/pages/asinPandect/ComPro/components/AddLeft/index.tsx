import React from 'react';
import { Tabs, Input, Spin, Button, Form, message } from 'antd';
import { connect } from 'umi';
import TableVirtual from '../TableVirtual';
import { ISingleItem } from '../AddFilter';
import { IConnectState, IConnectProps } from '@/models/connect';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import styles from './index.less';
const { TabPane } = Tabs;
const { Search } = Input;
interface IAddLeft extends IConnectProps{
    tableLoading: boolean;
    filterData: ISingleItem[];
    allData: ISingleItem[];
    selectedList: ISingleItem[];
}
const filterReg = /^B0[A-Z0-9]{8}$/i;
const AddLeft: React.FC<IAddLeft> = ({ 
  dispatch,  
  filterData,
  selectedList,
  allData,
  tableLoading,
}) => {

  const onSelectText = (value: {content?: string}) => {
    /*
    const content = value.content;
    const contentHTML = content ? `${content.toHTML()}` : '<p></p>';
    const htmlList = contentHTML.split(/<\/?p[^>]*>/gi);
    const notEmptyList = 
      htmlList.map((item: string) => item.trim()).filter((item: string) => item !== '');
    const list = notEmptyList.filter((item1: string) => filterReg.test(item1));
    
    
    dispatch({
      type: 'comPro/addSelectText',
      payload: [...new Set(list)],
    }); 
    if (notEmptyList.length !== list.length){
      message.error('ASIN格式有误');
    }
    */

    if (value.content) {
      let asinList = value.content.split(/\n/ig);
      asinList = asinList.map((item: string) => item.trim()).filter((item: string) => item !== '');
      let list = asinList.filter((item: string) => filterReg.test(item) && item.toUpperCase());
      list = asinList.map((item: string) => item.toUpperCase()); // 转换成大写显示

      dispatch({
        type: 'comPro/addSelectText',
        payload: [...new Set(list)],
      }); 
      if (asinList.length !== list.length){
        message.error('ASIN格式有误');
      }
      return;
    }

    message.error('请输入ASIN');
  };

  //全选
  const onSelectList = () => {
    const newSet = new Set([...filterData, ...selectedList]);
    dispatch({
      type: 'comPro/updateSelected',
      payload: [...newSet],
    });
  };
  //搜索
  const onSearch = (value: string) => {
    value = value.trim();
    if (value){
      const filterData = allData.filter((item: ISingleItem) => {
        return (item.asin.includes(value) || item.title.includes(value));
      });

      dispatch({
        type: 'comPro/updateFilter',
        payload: filterData,
      });
    } else {
      dispatch({
        type: 'comPro/updateFilter',
        payload: allData,
      });
    }
  };
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="建议竞品" key="1">
          <div className={styles.suggest_container}>
            <div className={styles.search_container}>
              <Search 
                size="middle" 
                allowClear
                className={styles.search_input}
                placeholder="输入标题、ASIN" 
                onSearch={(value, event) => {
                  if (!event?.['__proto__']?.type){
                    onSearch(value);
                  }
                }}
                disabled={tableLoading}
                enterButton={<Iconfont type="icon-sousuo" className={styles.icon_sousuo}/>} />
            </div>
            <div className={styles.not_select_table}>
              <span 
                onClick={() => onSelectList()}
                className={classnames(styles.select_button, styles.all_button)}>
            全选
              </span>
              <Spin spinning={tableLoading}>
                <TableVirtual/>
              </Spin>
            </div> 
          </div>
        </TabPane>
        <TabPane tab="输入竞品" key="2">
          <div className={styles.select_keywords}>
            <Form onFinish={onSelectText}>
              <Form.Item
                name="content">
                {/* <BraftEditor
                  controls={[]}
                  contentClassName={styles.__textarea}
                  placeholder="输入ASIN，每行一个"
                /> */}
                <Input.TextArea 
                  placeholder="输入ASIN，每行一个" 
                  className={styles.__textarea}
                />
              </Form.Item>
              <Form.Item>
                <Button className={styles.__submit} htmlType="submit" type="link">选择</Button>
              </Form.Item>
            </Form>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default connect(({ comPro }: IConnectState) => ({
  tableLoading: comPro.tableLoading,
  selectedList: comPro.selectedList,
  filterData: comPro.filterData,
  allData: comPro.allData,
}))(AddLeft);
