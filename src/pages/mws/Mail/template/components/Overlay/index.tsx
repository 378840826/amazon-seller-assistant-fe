import React, { useState, useEffect } from 'react';
import BraftEditor, { EditorState } from 'braft-editor';
import { useAntInputCursor } from '@/utils/customHooks';
import { Iconfont } from '@/utils/utils';
import 'braft-editor/dist/index.css';
import { ContentUtils } from 'braft-utils';
import { useDispatch } from 'umi';
import { 
  Form,
  Spin,
  Input,
  Select,
  Button,
  Row,
  Col,
  Modal,
} from 'antd';
import styles from './index.less';


const { Option } = Select;
const formItem1Layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 13 },
};
const formItem2Layout = {
  labelCol: { span: 2, align: 'middle' },
  wrapperCol: { span: 22 },
};


const defaultState: IOverlayState = {
  id: -1,
  templateType: 'Review邀请',
  templateName: '',
  templateSubject: '',
  templateContent: BraftEditor.createEditorState(null),
};
interface IOverlayState{
  id: number;
  templateType: 'Review邀请' | 'Feedback邀请' | 'Review+Feedback邀请' | '常见问题回复';
  templateName: string;
  templateSubject: string;
  templateContent: EditorState;
}
interface IOverlay{
  StoreId: string;
  id: number;
  onCancel: () => void;
  onConfirm: () => void;
  
}
const templateNames = ['Review邀请', 'Feedback邀请', 'Review+Feedback邀请', '常见问题回复'];
const controls: import('braft-editor').ControlType[] | undefined = [];
const InsertList = [
  'product_link:product_name',
  'shop_link:seller_name',
  'order_id',
  'order_link:View Order',
  'review_link:product_name',
  'feedback_link:Feedback',
  'contact_link: Contact Us',
  '快递公司名称: 快递单号'];
const Overlay: React.FC<IOverlay> = ({ StoreId, id, onCancel, onConfirm }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { setRef, getCursorPos, insertAt } = useAntInputCursor();
  const [state, setState] = useState(defaultState);
  const [type, setType] = useState('templateContent');//默认一开始是内容选中
  const [loading, setLoading] = useState(true);//一开始就加载中
  const [confirmLoading, setConfirmLoading] = useState(false);//确定按钮的点击之后的加载状  
  useEffect(() => {
    if (id !== -1){
      dispatch({
        type: 'mail/updateTemplate',
        payload: {
          data: {
            headersParams: { StoreId },
          },
          params: { id },
        },
        callback: (res: {data: IOverlayState; code: number}) => {
          if (res.code === 200){
            setState((state) => ({
              ...state,
              ...res.data,
              templateContent: BraftEditor.createEditorState(res.data.templateContent),
            }));
          }
          setLoading(false);
          form.setFieldsValue({ 
            ...defaultState, 
            ...res.data, 
            templateContent: BraftEditor.createEditorState(res.data.templateContent), 
          });
          
        },
      });
    } else {
      form.setFieldsValue({ 
        ...defaultState, 
      });
      setLoading(false);
    }

  }, [StoreId, dispatch, id, form]);

  const handleChange = (editorState: EditorState, type: string) => {
    form.setFieldsValue({ [type]: editorState });
    setState((state) => ({
      ...state,
      [type]: editorState,
    }));
  };

  const onFocus = (type: string) => {
    setType(type);
  };
  
  const onFinish = (values: API.IParams) => {
    if (values.templateSubject.trim() === ''){
      Modal.error({ content: '模板主题不能为空!', centered: true });
      return;
    }
    const params = { 
      ...values,
      templateContent: values.templateContent.toHTML(), 
    };
   
    setConfirmLoading(true);
    dispatch({
      type: 'mail/saveOrUpdateTemplate',
      payload: {
        id,
        StoreId,
        params,
      },
      callback: (res: {code: number; message: string}) => {
        const { code, message } = res;
        if (code === 200){
          onConfirm();
        } else {
          Modal.error({ content: message, centered: true });
        }
        setConfirmLoading(false);
      },
    });
  };

  const onClickInsert = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let insetText = e.target.innerText;
    if (type === 'templateSubject'){
      if (insetText !== 'order_id'){
        Modal.error({ content: '主题只能插入order_id，不允许插入其他参数', centered: true });
        return;
      } 
      insetText = `{{${insetText}}}`;
      const textLength = insetText.length;
      const subjectLength = form.getFieldValue('templateSubject').trim().length; 
      if ( Number(textLength + subjectLength ) > 100){
        return;
      }

      const pos = getCursorPos().start;
      insertAt(pos, insetText);
    } else {
      form.setFieldsValue({ 
        templateContent: ContentUtils.insertText(state.templateContent, `{{${insetText}}}`), 
      });
    }
  };
  return (
    <div>
      {loading && <Spin/>}
      {!loading && 
        <Form
          form={form}
          colon={false}
          className={styles.rule_form}
          onFinish={onFinish}
        >
          <Row>
            <Col span={19}>
              <Form.Item
                label="模板名称 :"
                name="templateName"
                {...formItem1Layout}
                required={false}
                rules={[{ required: true, message: '模板名称不能为空!' }]}
              >
                <Input type="text"/>
              </Form.Item>
            </Col>
            <Col span={5}>
            </Col>
          </Row>
          <Row>
            <Col span={19}>
              <Form.Item
                label="模板类型 :"
                name="templateType"
                {...formItem1Layout}
              >
                <Select style={{ textAlign: 'left' }}>
                  {templateNames.map((item, index) => {
                    return <Option key={index} value={item}>{item}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
            </Col>
          </Row>
        
          <Row className={styles.content_edit}>
            <Col span={19}>
              <Form.Item
                label="主题 :"
                name="templateSubject"
                className={styles.item_subject}
                {...formItem2Layout}
              >
                <Input 
                  bordered={false} 
                  autoComplete="off" 
                  style={{ height: '38px' }}
                  maxLength={100} 
                  ref={setRef} 
                  onFocus={() => onFocus('templateSubject')}/>
              </Form.Item>
              <Form.Item  
                name="templateContent" 
                label="正文 :"
                className={styles.item_content}
                {...formItem2Layout}
              >
                <BraftEditor
                  onChange={(editState) => handleChange(editState, 'templateContent')}
                  controls={controls}
                  onFocus={() => onFocus('templateContent')}
                  contentClassName={styles.braftEditor_content}
                  placeholder="请输入正文内容"
                />
              </Form.Item>
                
            </Col>
            <Col span={5} className={styles.click_area}>
              <div className={styles.title}>点击插入参数</div>

              <div onClick={onClickInsert}>
                {InsertList.map((item, index) => {
                  return (
                    <div key={index} className={styles.btn_div}>
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
          <Row style={{ paddingTop: '20px' }}>
            <Col span={19}>
              <Form.Item 
                label=" "
                className={styles.buttons}
                style={{ marginBottom: 0 }} 
                {...formItem1Layout}>
                <>
                  <Button htmlType="button" disabled={confirmLoading} onClick={() => onCancel()}>
                  取消
                  </Button>
                  <Button type="primary" disabled={confirmLoading} htmlType="submit">
                  保存
                  </Button>
                </>
              </Form.Item>
            </Col>
            <Col span={5}>
              <div className={styles.tips}>
                <Iconfont className={styles.orange} type="icon-yiwen"/> 请勿在邮件中提及违禁字眼
              </div>
            </Col>
          </Row>
        </Form>
      }
    </div>
  );
};
export default Overlay;
