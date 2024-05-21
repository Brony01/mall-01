import React, { Component } from 'react';
import { Form, Input, Button, Icon, message } from 'antd';
import { Redirect, withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUserInfo } from '../login/action'; // Ensure correct import path
import './register.less';

class Register extends Component {
    state = {
        redirectToLogin: false,
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // Automatically assign the default role ID for 普通用户 during the registration process
                // Note: The role_id is now handled directly in the action rather than passed from here
                this.props.registerUserInfo(values, () => {
                    message.success('注册成功！');
                    this.setState({ redirectToLogin: true });
                    this.props.history.push('/login'); // Directly navigate to login page
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        if (this.state.redirectToLogin) {
            return <Redirect to="/login"/>;
        }

        return (
            <div className="register">
                <div className="header">注册页面</div>
                <div className="content">
                    <section className="register-form">
                        <Form onSubmit={this.handleSubmit}>
                            <div className="register-label">
                                <span>信息管理系统</span>
                            </div>
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: '请输入用户名!' }],
                                })(<Input prefix={<Icon type="user"/>} placeholder="用户名" />)}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [
                                        { required: true, message: '请输入密码!' },
                                        { min: 8, message: '密码至少为8位' },
                                        { max: 16, message: '密码最多为16位' },
                                        { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/, message: '密码需包含大小写字母及数字'}
                                    ],
                                })(<Input.Password prefix={<Icon type="lock"/>} type="password" placeholder="密码" />)}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('email', {
                                    rules: [
                                        { required: true, message: '请输入邮箱地址!' },
                                        { type: 'email', message: '邮箱地址格式错误!' }
                                    ],
                                })(<Input prefix={<Icon type="mail"/>} type="email" placeholder="邮箱" />)}
                            </Form.Item>
                            <Form.Item className="form-item-button">
                                <Button type="primary" htmlType="submit">
                                    注册
                                </Button>
                                <Button type="default" style={{ marginLeft: "0px" }} onClick={() => this.props.history.push('/login')}>
                                    返回
                                </Button>
                            </Form.Item>
                        </Form>
                    </section>
                </div>
                <div className="footer">
                    <span>Made with ❤ by Brony</span>
                </div>
            </div>
        );
    }
}

const WrappedRegisterForm = Form.create({ name: 'register_form' })(Register);
const mapStateToProps = state => ({
    userInfo: state.loginUserInfo,
});
const mapDispatchToProps = { registerUserInfo };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedRegisterForm));
