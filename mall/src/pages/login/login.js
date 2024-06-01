import React, {Component} from 'react';
import {Button, Form, Icon, Input} from 'antd';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {getLoginUserInfo} from './action';
import LinkA from '../../components/link-a';
import './login.less';

class Login extends Component {
    state = {
        params: {
            href: 'https://github.com/Brony01',
            target: '_black',
            text: 'Bronya Zaychik',
        },
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = Object.assign(values, {username: btoa(values.username), password: btoa(values.password)});
                this.props.getLoginUserInfo(values);
            }
        });
    };

    validatorPwd = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码！');
        } else if (value === 'admin') {
            callback();
        } else if (value.length < 8 || value.length > 16) {
            callback('密码长度应为8-16位！');
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(value)) {
            callback('密码必须包含大小写字母及数字！');
        }
        callback();
    };

    render() {
        const {userInfo} = this.props;
        if (userInfo._id) {
            return <Redirect to="/mainpage/home"/>;
        }
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login">
                <div className="header"/>
                <div className="content">
                    <section className="login-form">
                        <div className="login-label">
                            <span>信息管理系统</span>
                        </div>
                        <Form onSubmit={this.handleSubmit} className="">
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [
                                        {required: true, message: '请输入用户名！'},
                                        {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能含有数字、英文、下划线!'},
                                    ],
                                    initialValue: 'admin',
                                })(
                                    <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                           placeholder="用户名"/>,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{validator: this.validatorPwd}],
                                    initialValue: 'admin',
                                })(
                                    <Input.Password
                                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        type="password"
                                        placeholder="密码"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-btn" onClick={this.onSubmit}>
                                    登录
                                </Button>
                            </Form.Item>
                            <Link to="/register">没有账号？点击注册</Link>
                        </Form>
                    </section>
                </div>
                <div className="footer">
                    <div className="content">
                        Made with ❤ by Brony<LinkA params={this.state.params}/>
                    </div>
                </div>
            </div>
        );
    }
}

const WrappeLoginForm = Form.create({name: 'normal_login'})(Login);

const mapStateToProps = state => ({
    userInfo: state.loginUserInfo,
});

const mapDispatchToProps = {getLoginUserInfo};

export default connect(mapStateToProps, mapDispatchToProps)(WrappeLoginForm);
