import React, { useState, useEffect, useRef } from 'react';
import BraftEditor, { EditorState } from 'braft-editor';
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
} from 'antd';
import styles from './index.less';


const { Option } = Select;
const formItem1Layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};
const formItem2Layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
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
}
const templateNames = ['Review邀请', 'Feedback邀请', 'Review+Feedback邀请', '常见问题回复'];
const controls = [];
const InsertList = ['product_link:product_name',
  'shop_link:seller_name',
  'order_id',
  'order_link:View Order',
  'review_link:product_name',
  'feedback_link:Feedback',
  'contact_link: Contact Us',
  '快递公司名称: 快递单号'];
const Overlay: React.FC<IOverlay> = ({ StoreId, id, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [state, setState] = useState(defaultState);
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

  const handleContentChange = (editorState) => {
    form.setFieldsValue({ templateContent: editorState });
    setState((state) => ({
      ...state,
      templateContent: editorState,
    }));
  };
  
  const onFinish = (values: API.IParams) => {
    const params = { ...values, templateContent: values.templateContent.toHTML() };
    setConfirmLoading(true);
    dispatch({
      type: 'mail/saveOrUpdateTemplate',
      payload: {
        id,
        StoreId,
        params,
      },
      callback: () => {
        setConfirmLoading(false);
        onCancel();
      },
    });
  };

  const onClickInsert = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const insetText = e.target.innerText;
    form.setFieldsValue({ 
      templateContent: ContentUtils.insertText(state.templateContent, `{{${insetText}}}`), 
    });
    
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
          <Form.Item
            label="模板名称 :"
            name="templateName"
            {...formItem1Layout}
            required={false}
            rules={[{ required: true, message: '模板名称不能为空!' }]}
          >
            <Input type="text"/>
          </Form.Item>
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
          <Form.Item
            label="主题 :"
            name="templateSubject"
            required={false}
            rules={[{ required: true, message: '主题不能为空!' }]}
            {...formItem2Layout}
          >
            <Input maxLength={100} type="text"/>
          </Form.Item>
          <Form.Item
            label="正文 :"
            {...formItem2Layout}
          >
            <Row className={styles.content_edit}>
              <Col span={16}>
                <Form.Item name="templateContent">
                  <BraftEditor
                    onChange={handleContentChange}
                    controls={controls}
                    placeholder="请输入正文内容"
                  />
                </Form.Item>
              </Col>
              <Col span={8} className={styles.click_area}>
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
          </Form.Item>
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
        </Form>
      }
    </div>
  );
};
export default Overlay;
