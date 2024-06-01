import React, { Component } from 'react';
import { Button, Modal, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LOG_OUT } from '../../pages/login/action-type';
import store from '../../utils/storeUtils';
import { getCurrentDate } from '../../utils/common';
import './index.less';

class HeaderSelf extends Component {
    state = {
        date: getCurrentDate(new Date()),
    };

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: getCurrentDate(new Date()),
        });
    }

    exitConfirm = (e) => {
        e.preventDefault();
        Modal.confirm({
            title: '退出',
            content: '确定退出？',
            okText: '退出',
            cancelText: '取消',
            onOk: () => {
                store.clearAll();
                store.user = null;
                this.props.logout();
                this.props.history.replace('/');
            },
        });
    };

    render() {
        const { userInfo } = this.props;

        return (
            <div className='header'>
                <div className='header-top'>
                    <div className='left'>
                        <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />
                        <span className='username'>Hello, {userInfo.username}</span>
                    </div>
                    <div className='right'>
                        <span className='current-date'>{this.state.date}</span>
                        <Button type='link' onClick={this.exitConfirm} className='logout-button'>退出</Button>
                    </div>
                </div>
            </div>
        );
    }
}

HeaderSelf.propTypes = {
    headTitle: PropTypes.string.isRequired,
    userInfo: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    headTitle: state.getHeadTitle,
    userInfo: state.loginUserInfo,
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => {
        dispatch({
            type: LOG_OUT,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderSelf));
