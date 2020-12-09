import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Input, Row, Col, Upload, Button, message } from 'antd';
import Dialogue from '../Dialogue';
import ModalTemplate from '../ModalTemplate';
import { ITemplates } from '@/models/mail';
import styles from './index.less';
import BraftEditor, { EditorState } from 'braft-editor';
import 'braft-editor/dist/index.css';
import { IConnectState, IConnectProps } from '@/models/connect';
import { RcFile } from 'antd/lib/upload';
import moment from 'moment';
import { UploadFile } from 'antd/lib/upload/interface';
import { pathList } from '../OrderInfo';
import classnames from 'classnames';

interface IRightFeedback extends IConnectProps{
  mailContent: API.IParams[];
  StoreId: string;
  id: string | number;
  templateList: ITemplates[];
  onAdd: (params: API.IParams) => void;
}
interface IState{
  modal: boolean;
  fileList: RcFile[];
  sendStatus: boolean;
}

const filterList = (files: UploadFile[]) => {
  return files.filter( (item: UploadFile) => item.status !== 'error');
};
const controls: import('braft-editor').ControlType[] | undefined = [];
const RightFeedback: React.FC<IRightFeedback> = ({ mailContent, onAdd, StoreId, 
  dispatch, id, templateList }) => {
  const [form] = Form.useForm();
  const isInbox = pathList.indexOf(location.pathname);
  const height = isInbox > -1 ? 'calc(100vh - 245px)' : 'calc(100vh - 200px)';
  const braftClassName = isInbox > -1 ? 'height233' : 'height276';
  // '233px' : '276px'; 
  const [state, setState] = useState<IState>({
    modal: false, //控制模态框是否展示的
    sendStatus: false, //邮件回复按钮disable状态
    fileList: [],
  });
 

  //点击提交
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    const content = values.content;
    const contentHTML = `${content.toHTML()}`;

    let files: UploadFile['originFileObj'][] = [];
    if (content === undefined || contentHTML === '<p></p>'){
      message.error('正文内容不能为空!');
      return;
    }  
   
    if (values.uploadItem !== undefined){
      files = filterList(values.uploadItem).map( (item: UploadFile) => item.originFileObj); 
    }
  
    const pathname = location.pathname;
    setState((state) => ({
      ...state,
      sendStatus: true,
    }));
    dispatch({
      type: 'mail/receiveOrSendEmailSubmit',
      payload: {
        pathname,
        StoreId,
        id,
        subject: values.subject === undefined ? '' : values.subject,
        content: contentHTML,
        file: files,
      },
      callback: (res: {code: number;message: string}) => {
        setState((state) => ({
          ...state,
          sendStatus: false,
        }));
        const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        let status = 'success';
        if (res.code === 200){
          status = 'success';
        } else {
          status = 'fail';
          message.error(res.message);
        }
        onAdd({ content: contentHTML, status, time, type: 'me' });
      },
    });
    
  };

  //点击清空
  const onReset = () => {
    form.resetFields();
    setState((state) => ({
      ...state,
      fileList: [],
    }));
  };

  //点击关闭模版
  const onToggleModal = (modal: boolean) => {
    setState( (state) => ({
      ...state,
      modal,
    }));
  };
  //取消按钮点击
  const goBack = (id: number) => {
    dispatch({
      type: 'mail/modifyInboxId',
      payload: id,
    });
  };

  //点击【载入】
  const onSelectTemplateId = (templateId: number) => {
    const type = pathList.indexOf(location.pathname) > -1 ? 'mail/receiveListTemplateLoad'
      :
      'mail/sendListTemplateLoad';
    dispatch({
      type,
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
        },
        params: {
          templateId,
          id,
        },
      },
      callback: (data: { subject: string; content: string }) => {
        form.setFieldsValue({
          subject: data.subject,
          content: BraftEditor.createEditorState(data.content),
        });
      },
    });
  };

  const handleChange = (editorState: EditorState) => {
    form.setFieldsValue({ 'content': editorState });
  };

  //upload相关
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => { 
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = ({ fileList }: any) => {
    setState((state) => ({
      ...state,
      fileList,
    }));
  };
  //upload 之前  超过5M，上传文件的地址，上传文件格式一样不能显示
  const beforeUpload = (file: UploadFile) => {
    const count = [];
    const files = state.fileList;
    const isLimit5M = file.size / 1024 / 1024 < 5;
    const allowFileType = ['application/msword', 'text/plain', 'application/vnd.ms-excel', 'application/pdf'];
    if (allowFileType.indexOf(file.type) < 0) {
      file.status = 'error';
      message.error('附件仅支持.doc .txt .xls .pdf文件'); 
      return false;
    }
    if (!isLimit5M) {
      file.status = 'error';
      message.error('超过5M限制，不允许上传~');
      return false;
    }
    files.map((item, index) => {
      if (item.name === file.name){
        file.status = 'error';
        count.push(index);
      }
    });
    if (count.length > 0){
      message.error('文件名相同!');
      return false;
    }
    file.status = 'done';
    return false;
  } ;
  return (
    <div className={styles.container} style={{ height: height }}>
      <div className={styles.flexBox}>
        <div className={styles.dialogue_overflow}>
          <div className={styles.dialogues}>
            {
              mailContent.map((item, index) => <Dialogue key={index} item={item}/>)
            }
          </div>
        </div>
       
        <div className={styles.template_overflow}>
          <div className={styles.template}>
            <Form name="template" 
              form={form}
              onFinish={onFinish}
            >
              <Form.Item
                name="subject"
              >
                <Input 
                  autoComplete="off"
                  className={styles.template_input} 
                  placeholder="主题"
                  maxLength={100}
                />
              </Form.Item>
              <Form.Item
                name="content"
              >
                <BraftEditor
                  onChange={handleChange}
                  controls={controls}
                  contentClassName={classnames(styles.__textarea, styles[`${braftClassName}`])}
                  placeholder="请输入正文内容"
                />
              </Form.Item>
              <Form.Item
                className={styles.buttons}
              >
                <div className={styles.__upload_both}>
                  <div className={styles.__upload_left}>
                    <Form.Item 
                      name="uploadItem"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      
                    >
                      <Upload
                        name="file"
                        onChange={onChange}
                        beforeUpload={beforeUpload}
                        accept=".doc,.txt,.xls,.pdf"
                      >
                        <Button className={styles.select_file}>+选择文件</Button>
                      </Upload>
                    </Form.Item>
                    <div className={styles.tips}>
                      附件仅支持.doc  .txt  .xls  .pdf文件，大小不可超过5MB
                    </div>
                  </div>
                  <div className={styles.__upload_right}>
                    <Row gutter={[14, 16]}>
                      <Col span={24} style={{ textAlign: 'right' }}>
                        <Button onClick={onReset} style={{ marginRight: '14px' }}>清空</Button>
                        <Button onClick={() => onToggleModal(true)}>模板</Button>
                        <ModalTemplate 
                          templates={templateList}
                          modal={state.modal}
                          cancelModal={() => onToggleModal(false)}
                          onSelectTemplateId={onSelectTemplateId}
                        />
                      </Col>
                    </Row>
                    <Row gutter={[14, 16]}>
                      <Col span={24} style={{ textAlign: 'right' }}>
                        <Button style={{ marginRight: '14px' }} onClick={() => goBack(-1)}>取消</Button>
                        <Button disabled={state.sendStatus} type="primary" htmlType="submit">回复</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Form.Item>
            </Form>
            
          </div>
        </div>
      </div>
      
    </div>
  );
};
export default connect(({ global, mail }: IConnectState) => ({
  StoreId: global.shop.current.id,
  id: mail.inbox.id,
  templateList: mail.templateList,
}))(RightFeedback) ;
