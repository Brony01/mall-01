import React, { Component } from "react";
import { Icon, Menu } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setHeadTitle } from "./action";
import menuLists from "../../config/menuConfig";
import "./index.less";

const { SubMenu } = Menu;

function HeadIcon() {
    return (
        <>
            <span className="head-icon-text">商城管理系统</span>
        </>
    );
}

class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
        this.getCurrentReqParentPath(menuLists, this.props.location.pathname);
    }

    hasAuth = (item) => {
        const { userInfo } = this.props;
        const { username, role } = userInfo || {};
        const { menus } = role || { menus: [] };
        const { key, isPublic, children } = item;

        if (username === "admin" || isPublic || menus.includes(key)) {
            return true;
        } else if (children) {
            return !!children.find((child) => menus.includes(child.key));
        }
        return false;
    };

    getCurrentReqParentPath(arr, getCurrentReqPath) {
        arr.forEach((element) => {
            if (element.children) {
                element.children.forEach((cItem) => {
                    if (getCurrentReqPath.includes(cItem.key)) {
                        this.getCurrentReqParentPath = element.key;
                    }
                });
            }
        });
    }

    menuNav_map = (menuConfig, collapsed) => {
        return menuConfig.map((item) => {
            if (item.children) {
                return (
                  <SubMenu
                    key={item.key}
                    title={
                        <span>
                            <img src={item.icon} alt="icon" style={{ width: '16px', marginRight: '8px' }} />
                            {!collapsed && <span>{item.title}</span>}
                        </span>
                    }
                  >
                      {this.menuNav_map(item.children, collapsed)}
                  </SubMenu>
                );
            } else {
                return (
                  <Menu.Item key={item.key}>
                      <Link to={item.key}>
                          <img src={item.icon} alt="icon" style={{ width: '16px', marginRight: '8px' }} />
                          {!collapsed && <span>{item.title}</span>}
                      </Link>
                  </Menu.Item>
                );
            }
        });
    };

    menuNav_reduce = (arr, collapsed, isChild = false) => {
        const { setHeadTitle } = this.props;
        return arr.reduce((pre, item) => {
            if (this.hasAuth(item)) {
                if (item.children) {
                    pre.push(
                      <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <img src={item.icon} alt="icon" style={{ width: '16px', marginRight: '8px' }} />
                                {collapsed && !isChild ? null : <span>{item.title}</span>}
                            </span>
                        }
                      >
                          {this.menuNav_reduce(item.children, collapsed, true)}
                      </SubMenu>
                    );
                } else {
                    pre.push(
                      <Menu.Item key={item.key}>
                          <Link to={item.key} onClick={() => setHeadTitle(item.title)}>
                              <img src={item.icon} alt="icon" style={{ width: '16px', marginRight: '8px' }} />
                              {collapsed && !isChild ? null : <span>{item.title}</span>}
                          </Link>
                      </Menu.Item>
                    );
                }
            }
            return pre;
        }, []);
    };

    render() {
        let getCurrentReqPath = this.props.location.pathname;
        if (getCurrentReqPath.includes("/product")) {
            getCurrentReqPath = "/product";
        }
        const getCurrentReqParentPath = this.getCurrentReqParentPath;
        return (
            <div>
                <div className="left-nav">
                    <Link to="/">
                        <div className="left-nav-header">
                            <h1 className="left-nav-header-content">
                                {this.props.collapsed ? null : <HeadIcon />}
                            </h1>
                        </div>
                    </Link>
                    <div className='left-nav-content'>
                        <Menu
                            mode="inline"
                            theme="dark"
                            selectedKeys={[getCurrentReqPath]}
                            defaultOpenKeys={[getCurrentReqParentPath]}
                        >
                            {this.menuNav_reduce(menuLists, this.props.collapsed, false)}
                        </Menu>
                    </div>
                </div>
            </div>
        );
    }
}

LeftNav.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LeftNav));
