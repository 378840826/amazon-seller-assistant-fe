import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Input, Row, Col, Upload, Button, message } from 'antd';
import Dialogue from '../Dialogue';
import ModalTemplate from '../ModalTemplate';
import { ITemplates } from '@/models/mail';
import styles from './index.less';
import { IConnectState, IConnectProps } from '@/models/connect';
import { RcFile } from 'antd/lib/upload';


const { TextArea } = Input;
interface IRightFeedback extends IConnectProps{
  mailContent: API.IParams[];
  StoreId: string;
  id: number;
  templateList: ITemplates[];
}
const RightFeedback: React.FC<IRightFeedback> = ({ mailContent, StoreId, 
  dispatch, id, templateList }) => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    modal: false, //控制模态框是否展示的
  });
  const inboxPaths = ['/mws/mail/inbox', '/mws/mail/reply', '/mws/mail/no-reply'];
  //点击提交
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    if (values.subject === undefined){
      message.error('正文内容不能为空!');
    } else {
      //
      const formData = new FormData();
      values.uploadItem.forEach( (file: RcFile) => {
        formData.append('files[]', file);
      });
      console.log('onFinish:', values);
    }
  };

  //点击清空
  const onReset = () => {
    form.resetFields();
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
    const type = inboxPaths.indexOf(location.pathname) > -1 ? 'mail/receiveListTemplateLoad'
      :
      'mail/sendListTemplateLoad';
    dispatch({
      type,
      payload: {
        headerParams: {
          StoreId,
        },
        params: {
          templateId,
          id,
        },
      },
      callback: (data: { subject: string; content: string }) => {
        form.setFieldsValue({
          subject: data.subject,
          content: data.content,
        });
      },
    });

    
  };

  //upload相关
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  //upload 之前
  const beforeUpload = (file: RcFile) => {
    const isLimit5M = file.size / 1024 / 1024 < 5;
    if (!isLimit5M) {
      message.error('超过5M限制，不允许上传~');
    }
    return false;
  } ;

  
  return (
    <div className={styles.container}>
      <div className={styles.flexBox}>
        <div className={styles.dialogue_overflow}>
          <div className={styles.dialogues}>
            {
              mailContent.map((item, index) => <Dialogue key={index} item={item}/>)
            }
          </div>
        </div>
        <div className={styles.divide}></div>
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
                <TextArea 
                  className={styles.__textarea}
                  autoSize={{ minRows: 10 }}
                />
              </Form.Item>
              <Form.Item
                className={styles.buttons}
              >
                <Row>
                  <Col span={16}>
                    <Form.Item 
                      name="uploadItem"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      
                    >
                      <Upload
                        name="file"
                        beforeUpload={beforeUpload}
                        className={styles.__upload}
                        accept=".doc,.txt,.xls,.pdf"
                      >
                        <Button className={styles.select_file}>+选择文件</Button>
                      </Upload>
                    </Form.Item>
                    <div className={styles.tips}>
                      附件仅支持.doc  .txt  .xls  .pdf文件，大小不可超过5MB
                    </div>
                  </Col>
                  <Col span={8}>
                    <Row gutter={[14, 16]}>
                      <Col span={12}>
                        <Button onClick={onReset}>清空</Button>
                      </Col>
                      <Col span={12}>
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
                      <Col span={12}>
                        <Button onClick={() => goBack(-1)}>取消</Button>
                      </Col>
                      <Col span={12}>
                        <Button type="primary" htmlType="submit">回复</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
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
