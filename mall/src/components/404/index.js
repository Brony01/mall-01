import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import './index.less';

/*
前台404页面
 */
class NotFound extends Component {
    goHome = () => {
        this.props.history.replace('/mainpage/home');
    };

    render() {
        return (
            <div className='not-found'>
                <div className='content'>
                    <h1>404</h1>
                    <h2>抱歉，你访问的页面不存在</h2>
                    <div>
                        <Button type='primary' onClick={this.goHome}>
                            回到首页
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    null,
    null,
)(NotFound);
