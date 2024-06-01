import React, { Component } from 'react';
import { Icon, Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setHeadTitle } from './action';
import './index.less';

const { SubMenu } = Menu;

class BottomNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  render() {
    let getCurrentReqPath = this.props.location.pathname;
    if (getCurrentReqPath.includes('/product')) {
      getCurrentReqPath = '/product';
    }

    const menuItems = [
      { key: '/mainpage/home', icon: 'home', title: '首页' },
      { key: '/mainpage/category', icon: 'appstore', title: '分类' },
      { key: '/mainpage/cart', icon: 'shopping-cart', title: '购物车' },
      { key: '/mainpage/my', icon: 'user', title: '我的' },
    ];

    return (
      <div className="bottom-nav">
        <Menu mode="horizontal" theme="dark" selectedKeys={[getCurrentReqPath]}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key}>
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </div>
    );
  }
}

BottomNav.propTypes = {
  setHeadTitle: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userInfo: state.loginUserInfo,
});
const mapDispatchToProps = (dispatch) => ({
  setHeadTitle: (title) => {
    dispatch(setHeadTitle(title));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BottomNav));
