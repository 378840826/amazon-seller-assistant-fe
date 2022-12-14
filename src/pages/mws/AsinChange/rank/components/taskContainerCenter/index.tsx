import React, { useState, useEffect, ChangeEvent } from 'react';
import BraftEditor, { EditorState } from 'braft-editor';
import 'braft-editor/dist/index.css';
import { connect } from 'umi';
import { Iconfont } from '@/utils/utils';
import { ColumnProps } from 'antd/es/table';
import styles from './index.less';
import classnames from 'classnames';
import { Table, Tabs, Input, Form, Button, Row, Col } from 'antd';
import { IConnectState, IConnectProps } from '@/models/connect';

interface IContainerCenter extends IConnectProps{
  StoreId: string;
  asinList: string[];
  keywordChange: (params: string[]) => void;
}
interface IState{
  loading: boolean;
  searchKeyword: string;
  selectedList: API.IParams[];
  keywordList: API.IParams[]; 
  keywordListMsg: string;
  oldStringAsinList: string;
  keyword: string;
}
const { TabPane } = Tabs;
const { Search } = Input;

const commonColumns: ColumnProps<API.IParams>[] = [{
  title: () => { 
    return (<div className={styles.__keyword_title}>关键词</div>) ; 
  },
  align: 'left',
  width: 335,
  render: (record) => {
    return (
      <div className={styles.__keyword}>{record.title}</div>
    );
  },
}];
const ContainerCenter: React.FC<IContainerCenter> = ({
  StoreId,
  dispatch,
  asinList,
  keywordChange,
}) => {
  const [state, setState] = useState<IState>({
    loading: false, //建议关键词搜索loading
    searchKeyword: '',
    keyword: '',
    oldStringAsinList: '', //上一次的asinList的JSON.Stringify格式
    selectedList: [], //第二个表格中选中的列表
    keywordList: [], //第一个表格中关键词列表
    keywordListMsg: '', //表格中code !== 200时返回的message
  });
  
  useEffect(() => {
    const list: string[] = [];
    state.selectedList.map(item => list.push(item.title));
    keywordChange(list);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedList]);
  useEffect(() => {
    setState((state) => ({
      ...state,
      loading: true,
    }));
    if (state.oldStringAsinList !== JSON.stringify(asinList)){
      setState((state) => ({
        ...state,
        searchKeyword: '',
        keyword: '',
        oldStringAsinList: JSON.stringify(asinList),
      }));
    }
    dispatch({
      type: 'dynamic/msSearchKeyword',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
          searchKeyword: state.searchKeyword,
          asinList,
        },
      },
      callback: (res: {code: number; data: API.IParams[];message: string}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            keywordList: res.data,
            keywordListMsg: '',
            loading: false,
          }));
        } else {
          setState((state) => ({
            ...state,
            keywordList: [],
            keywordListMsg: res.message,
            loading: false,
          }));
        }
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, state.searchKeyword, StoreId, asinList]);
 
  //搜索关键词
  const onSearch = (value: string) => {
    setState((state) => ({
      ...state,
      searchKeyword: value.trim(),
    }));
  };

  const selectAllMethod = (list: API.IParams[]) => {
    const hash = {};
    const config = [...list, ...state.selectedList];
    const newSelectedList = config.reduceRight((item: API.IParams[], next) => {
      hash[next.title] ? '' : hash[next.title] = true && item.push(next);
      return item;
    }, []);
    setState((state) => ({
      ...state,
      selectedList: newSelectedList,
    }));
  };
  
  //选中/ 全选
  const onSelectList = (record?: API.IParams) => {
    if (record){ //选中
      setState((state) => ({
        ...state,
        selectedList: state.selectedList.concat(record),
      }));
    } else { //全选
      selectAllMethod(state.keywordList);
    }
  };
  //删除/全删
  const onRemoveList = (record?: API.IParams) => {
    if (record){
      const newSelectList = state.selectedList.filter(item => item.title !== record.title);
      setState((state) => ({
        ...state,
        selectedList: newSelectList,
      }));
    } else {
      setState((state) => ({
        ...state,
        selectedList: [],
      }));
    }
  };

  //建议关键词输入框内容变化
  const onKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setState((state) => ({
      ...state,
      keyword: e.target.value,
    }));
  };
  
  //多行文本框输入内容变化
  const onSelectKeywords = (value: {content: EditorState}) => {
    const content = value.content;
    const contentHTML = content ? `${content.toHTML()}` : '<p></p>';
    const htmlList = contentHTML.split(/<\/?p[^>]*>/gi);
    const filterList = htmlList.map((item: string) => item.trim()).filter((item: string) => item !== '');
    console.log('filterList:', filterList);
    const formatList: API.IParams[] = [];
    filterList.map((item: string) => formatList.push({ title: item }));
    selectAllMethod(formatList);
  };
  const unCheckedColumns: ColumnProps<API.IParams>[] = commonColumns.concat({
    title: '操作',
    align: 'center',
    width: 55,
    render: (record) => {
      return (
        state.selectedList.filter((item) => item.title === record.title).length > 0 ? 
          <span className={styles.select_already}>已选</span>
          :
          <span className={styles.select_yes} onClick={() => onSelectList(record)}>选择</span>
      );
    },
  });
  const checkedColumns: ColumnProps<API.IParams>[] = commonColumns.concat({
    title: '操作',
    align: 'center',
    width: 55,
    render: (record) => {
      return (
        <span onClick={() => onRemoveList(record)} className={styles.select_no}>删除</span>
      );
    },
  });
  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="建议关键词" key="1">
          <div className={styles.search_container}>
            <Search 
              size="middle" 
              allowClear
              className={styles.search_input}
              placeholder="输入关键词" 
              value={state.keyword}
              onChange={value => onKeywordChange(value)}
              onSearch={(value, event) => {
                if (!event?.['__proto__']?.type){
                  onSearch(value);
                }
              }}
              disabled={state.loading}
              enterButton={<Iconfont type="icon-sousuo" className={styles.icon_sousuo}/>} />
          </div>
          <div className={styles.not_select_table}>
            <span 
              onClick={() => onSelectList()}
              className={classnames(styles.select_button, styles.all_button)}>
            全选
            </span>
            <Table
              pagination={false}
              className={styles.table}
              loading={state.loading}
              dataSource={state.keywordList}
              rowKey="title"
              columns={unCheckedColumns}
              scroll={{ y: '220px' }}
              rowClassName={(_, index) => index % 2 === 1 ? 'darkRow' : ''}
              locale={{ emptyText: state.keywordListMsg === '' ? 'Oops! 没有找到相关的信息' : state.keywordListMsg }}
            />
          </div>
        </TabPane>
        <TabPane tab="输入关键词" key="2">
          <div className={styles.select_keywords}>
            <Form 
              name="select_form"
              onFinish={onSelectKeywords}
            >
              <Row>
                <Col flex={'400px'}>
                  <Form.Item
                    name="content">
                    <BraftEditor
                      controls={[]}
                      contentClassName={styles.__textarea}
                      placeholder="请输入关键词"
                    />
                  </Form.Item>
                </Col>
                <Col flex={'67px'}>
                  <Form.Item className={styles.__button_select_container}>
                    <Button className={styles.__submit} htmlType="submit" type="link">选择</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>    
          </div>
        </TabPane>
      </Tabs>
      
      <div className={styles.selected_table}>
        <div className={styles.selected_table_bar}>
          <span className={styles.all_button}>已选</span>
          <span 
            onClick={() => onRemoveList()}
            className={classnames(styles.remove_button, styles.all_button)}>删除全部</span>
        </div>
        <Table
          pagination={false}
          className={styles.table}
          rowKey="title"
          dataSource={state.selectedList}
          columns={checkedColumns}
          rowClassName={(_, index) => index % 2 === 1 ? 'darkRow' : ''}
          scroll={{ y: '220px' }}
          locale={{ emptyText: 'Oops! 没有更多选中的数据啦' }}
        />
      </div>
      
    </>
  );
};
export default connect(({ global }: IConnectState) => ({
  StoreId: global.shop.current.id,
}))(ContainerCenter);
