import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { 
  Tooltip,
} from 'antd';

const PageViewSession = () => {
  return <Tooltip title="关联销售的SKU及关联销售次数">
    <div>
      关联销售次数
      &nbsp;
      <QuestionCircleOutlined style={{
        fontSize: 12,
        color: '#888',
        cursor: 'pointer',
      }}/>
    </div>
  </Tooltip>;
};

export default PageViewSession;
