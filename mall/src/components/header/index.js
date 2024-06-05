import React, { Component } from 'react';
import { Button, Modal, Input } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LOG_OUT } from '../../pages/login/action-type';
import store from '../../utils/storeUtils';
import { getCurrentDate } from '../../utils/common';
import './index.less';
import { SearchBar, Space } from "antd-mobile";

class HeaderSelf extends Component {
    state = {
        env: process.env.NODE_ENV,
    };

    exitConfirm = (e) => {
        e.preventDefault();
        Modal.confirm({
            title: '退出',
            content: '确定退出？',
            okText: '退出',
            cancelText: '取消',
            confirmLoading: true,
            onOk: () => {
                return new Promise((resolve, reject) => {
                    this.exitTimerID = setTimeout(() => {
                        store.clearAll();
                        store.user = null;
                        resolve(null);
                        this.props.logout();
                        this.props.history.replace('/');
                    }, 500);
                }).catch(() => console.log('Oops errors!'));
            },
        });
    };

    componentWillUnmount() {
        clearInterval(this.timerID);
        clearInterval(this.exitTimerID);
    }

    clock() {
        this.setState({
            date: getCurrentDate(new Date()),
        });
    }

    handleSearch = (value) => {
        if (this.props.location.pathname !== '/mainpage/products') {
            this.props.history.push({
                pathname: '/mainpage/products',
                state: { searchText: value, from: 'header' },
            });
        } else {
            this.props.history.replace({
                pathname: '/mainpage/products',
                state: { searchText: value, from: 'header' },
            });
        }
    };

    render() {
        const { userInfo } = this.props;
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>Hello，{userInfo.username}</span>
                    <SearchBar style={{ width: '60%' }} placeholder="请输入商品名称 如: 手机" onSearch={this.handleSearch} enterButton />
                    <Button type='link' onClick={this.exitConfirm}>退出</Button>
                </div>
            </div>
        );
    }
}

HeaderSelf.propTypes = {
    headTitle: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    headTitle: state.getHeadTitle,
    userInfo: state.loginUserInfo,
});

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch({
                type: LOG_OUT,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderSelf));
