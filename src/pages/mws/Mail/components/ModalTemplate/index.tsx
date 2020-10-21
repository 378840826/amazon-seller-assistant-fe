import React from 'react';
import { Modal, Table, Typography } from 'antd';
import styles from './index.less';
import { ColumnProps } from 'antd/es/table';
import { ITemplates } from '@/models/mail';

export interface IModalTemplate{
  modal: boolean;
  templates: ITemplates[];
  cancelModal: () => void;
  onSelectTemplateId: (id: number) => void;
}
const { Paragraph } = Typography;

const ModalTemplate: React.FC<IModalTemplate> = ({ 
  templates, modal, cancelModal, onSelectTemplateId, 
}) => {
  const onInsert = (id: number) => {
    onSelectTemplateId(id);
    cancelModal();
  };
 
  const columns: ColumnProps<ITemplates>[] = [
    {
      title: '模板类型',
      dataIndex: 'templateType',
      align: 'center',
      ellipsis: true,
      width: 180,
  
    },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      align: 'center',
      ellipsis: true,
      width: 211,
    },
    {
      title: '主题',
      dataIndex: 'templateSubject',
      align: 'left',
      width: 343,
      render: (text) => <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>,
    }, {
      title: () => <div className={styles.table_last_th}></div>,
      align: 'center',
      width: 60,
      render: (text, record) => <span className={styles.insert} 
        onClick={() => onInsert(record.templateId)}>载入</span>,
    },
  ];
  return (
    <>
      <Modal
        centered
        visible={modal}
        onCancel={cancelModal}
        className={styles.__modal}
        footer={null}
        width={854}
        bodyStyle={{ padding: '30px 14px 30px 30px' }}
      >
        <Table
          columns={columns}
          dataSource={templates}
          rowKey="templateId"
          pagination={false}
          scroll={{ x: 'max-content', y: '240px' }}
          className={styles.__table}
          locale={{ emptyText: 'Oops! 没有更多数据啦' }}
        />
      </Modal>
    </>
  );
};
export default ModalTemplate;
