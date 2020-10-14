import React from 'react';
import cs from 'classnames';
import './style.less';
import { Iconfont } from '@/utils/utils';


interface IProps {
  content: string;
  headerText?: () => void;
}
interface IState {
  showAll: boolean;
  content: string; 
  btnText: string;
  needHidden: boolean;
  
}

class TextContainer extends React.Component<IProps, IState, {}> {
  constructor(props: any) { // eslint-disable-line 
    super(props);
    this.state = {
      content: props.content,
      showAll: false,
      btnText: '全文',
      needHidden: true, //  文字超出4行 需要隐藏
    };
  }

  /**
   * @description: 处理content文案的点击展开收起
   * @return: null
   */
  handleContent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const showAll = this.state.showAll;
    this.setState({
      showAll: !showAll,
    });
  };

  // 判断文本超出行数
  isElementCollision = (ele: any, rowCount = 1, cssStyles: StyleSheet, removeChild: any) => { // eslint-disable-line
    if (!ele) {
      return false;
    }

    const clonedNode = ele.cloneNode(true);
    // 给clone的dom增加样式
    clonedNode.style.overflow = 'visible';
    clonedNode.style.display = 'inline-block';
    clonedNode.style.width = 'auto';
    clonedNode.style.whiteSpace = 'nowrap';
    clonedNode.style.visibility = 'hidden';
    // 将传入的css字体样式赋值
    if (cssStyles) {
      Object.keys(cssStyles).forEach(item => {
        clonedNode.style[item] = cssStyles[item];
      });
    }

    // 给clone的dom增加id属性
    const _time = new Date().getTime();

    const containerID = `collision_node_id_${_time}` ;
    clonedNode.setAttribute('id', containerID);

    const tmpNode = document.getElementById(containerID);
    let newNode = clonedNode;
    if (tmpNode) {
      document.body.replaceChild(clonedNode, tmpNode);
    } else {
      newNode = document.body.appendChild(clonedNode);
    }
    // 新增的dom宽度与原dom的宽度*限制行数做对比
    const differ = newNode.offsetWidth - ele.offsetWidth * rowCount + 40;
    // console.log(differ, 'differ');
    if (removeChild) {
      document.body.removeChild(newNode);
    }
    return differ > 0;
  };


  componentDidMount = () => {
    const cssStyles = {
      fontSize: '14px', 
      fontWeight: '400', 
      lineHeight: '18px',
    };
    // eslint-disable-next-line
    const needHidden = this.isElementCollision(this.refs['content'], 1, cssStyles as any, true);
    this.setState({
      needHidden,
    });
  };

  render() {
    const { needHidden, showAll } = this.state;
    const headerText = this.props.headerText;
    return (
      <div className="text-container">
        <div
          // eslint-disable-next-line
          ref={'content'} 
          className={cs('content', { 'hidden-text': !showAll && needHidden })}>
          {headerText ? headerText() : null}
          { this.props.children }
          
        </div>
        {needHidden && (
          <div
            className="content-btn"
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              this.handleContent(e);
            }}>
            {
              !showAll ? 
                <div className="text-container-onn">
                  <span className="text">展开</span>
                  <Iconfont type="icon-zhankai"
                    className={`icon`} style={{
                      color: '#999',
                    }} />
                </div> : <div className="text-container-off" style={{
                  color: '#999',
                }}>
                  <span className="text">收起</span>
                  <Iconfont type="icon-zhankai" 
                    className="icon" style={{
                      color: '#999',
                      transform: 'rotate(182deg)',
                    }} />
                </div> 
            }
          </div>
        )}
      </div>
    );
  }
}
export default TextContainer;
