import React, { Component } from "react";
import { Icon, Menu } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setHeadTitle } from "./action";
import menuLists from "config/menuConfig";
import "./index.less";

const { SubMenu } = Menu;

class BottomNav extends Component {
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

    menuNav_map = (menuConfig) => {
        return menuConfig.map((item) => {
            if (item.children) {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.menuNav_map(item.children)}
                    </SubMenu>
                );
            } else {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                );
            }
        });
    };

    menuNav_reduce = (arr) => {
        const { setHeadTitle } = this.props;
        return arr.reduce((pre, item) => {
            if (this.hasAuth(item)) {
                if (item.children) {
                    pre.push(
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.menuNav_reduce(item.children)}
                        </SubMenu>
                    );
                } else {
                    pre.push(
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={() => setHeadTitle(item.title)}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
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
            <div className="bottom-nav">
                <Menu mode="horizontal" theme="dark" selectedKeys={[getCurrentReqPath]}>
                    {this.menuNav_reduce(menuLists)}
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
