import React from 'react';
import { Modal, Typography } from 'antd';
import styles from './index.less';

const { Paragraph } = Typography;
export interface ITemplates{
  templateSubject: string;
  templateName: string;
  templateType: string;
  templateId: number;
}
export interface IModalTemplate{
  modal: boolean;
  templates: ITemplates[];
  msg: string;
  cancelModal: () => void;
  onSelectTemplateId: (id: number) => void;
}


const ModalTemplate: React.FC<IModalTemplate> = ({ 
  templates, msg, modal, 
  cancelModal, onSelectTemplateId }) => {
 
  const onInsert = (templateId: number) => {
    onSelectTemplateId(templateId);
  };

  const renderTemplate = (templates: ITemplates[]) => {
    if (templates.length > 0){
      return (
        templates.map((item, index) => {
          return (
            <tr key={index}>
              <td>{item.templateType}</td>
              <td>{item.templateName}</td>
              <td>  
                <Paragraph ellipsis={{ rows: 2 }}>
                  {item.templateSubject}
                </Paragraph>
              </td>
              <td className={styles.insert}>
                <span onClick={() => onInsert(item.templateId)}>载入</span>
              </td>
            </tr>
          );
        })
      );
    }
    if (msg){
      return (
        <tr>
          <td colSpan={3}>
            <div className={styles.table_msg}>msg</div>
          </td>
          <td></td>
        </tr>
        
      );
    }
    return (
      <tr>
        <td colSpan={3}>
          <div className={styles.table_msg}>Oops! 没有更多数据啦</div>
        </td>
        <td></td>
      </tr>
    );
  };
  return (
    <>
      <Modal
        centered
        visible={modal}
        closable={false}
        onCancel={cancelModal}
        footer={null}
        width={854}
        bodyStyle={{ padding: 0 }}
      >
        <div className={styles.modal_container}>
          <div className={styles.modal_table_overflow}>
            <table className={styles.modal_table}>
              <colgroup>
                <col style={{ width: '224px', minWidth: '224px' }}></col>
                <col style={{ width: '164px', minWidth: '164px' }}></col>
                <col style={{ width: '362px', minWidth: '362px' }}></col>
                <col style={{ width: '60px', minWidth: '60px' }}></col>
              </colgroup>
              <thead>
                <tr>
                  <th>模版类型</th>
                  <th>模版名称</th>
                  <th>主题</th>
                  <th className={styles.insert}></th>
                </tr>
              </thead>
              <tbody>
                {renderTemplate(templates)}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ModalTemplate;
