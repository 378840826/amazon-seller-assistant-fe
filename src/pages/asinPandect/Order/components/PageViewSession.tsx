import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { 
  Tooltip,
} from 'antd';

const PageViewSession = () => {
  return <Tooltip title="指该商品在周期内，被一起购买的商品，以及购买的次数，按次数从多到少排列">
    <div>
      关联销售次数
      &nbsp;
      <QuestionCircleOutlined style={{
        fontSize: 12,
        color: '#999',
      }}/>
    </div>
  </Tooltip>;
};

export default PageViewSession;
