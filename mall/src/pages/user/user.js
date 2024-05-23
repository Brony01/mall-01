import React, { Component } from 'react';
import { Button, Card, Form, Icon, Input, message, Modal, Popconfirm, Select, Table } from 'antd';
import moment from 'moment';
import { reqAddUser, reqDeleteUser, reqUpdateUser, reqUserList } from 'api';

const { Option } = Select;
const iconStyle = { color: 'rgba(0,0,0,.25)' };

class User extends Component {
    state = {
        visible: false,
        confirmLoading: false,
        loading: false,
        record: {},
        isUpdate: false,
        tableData: [],
        roles: [],
        searchText: ''
    }

    constructor() {
        super()
        this.cardTitle = (
            <Button type="primary" onClick={(e) => {
                e.stopPropagation();
                this.showModal(false)
            }}>创建用户</Button>
        )
        this.columns = [
            {
                title: '姓名',
                dataIndex: 'username',
            },
            {
                title: '手机',
                dataIndex: 'phone',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '角色',
                dataIndex: 'role_id',
                render: (record) => (this.initTableRoleText(record))
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                sorter: (a, b) => a.create_time - b.create_time,
                sortDirections: ['descend', 'ascend'],
                render: (create_time) => (moment(create_time).format('YYYY-MM-DD HH:mm:ss'))
            },
            {
                title: '操作',
                render: (record) => (
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={(e) => {
                            e.stopPropagation();
                            this.deleteUser(record)
                        }}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type='link'>删除</Button>
                        <Button type='link' onClick={(e) => {
                            e.stopPropagation();
                            this.showModal(record)
                        }}>更新</Button>
                    </Popconfirm>
                )
            },
        ];
    }

    showModal = (record) => {
        this.setState({
            visible: true,
            isUpdate: record ? true : false,
            record
        });
    };
    handleAddUser = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ confirmLoading: true });
                const { isUpdate, record } = this.state;
                let res = {};
                if (isUpdate) {
                    values = { ...values, _id: record._id };  // Update existing user
                    res = await reqUpdateUser(values);
                } else {
                    res = await reqAddUser(values);  // Add new user
                }
                if (res.status === 0) {
                    message.success('操作成功！');
                    this.setState({ visible: false, confirmLoading: false });
                    this.props.form.resetFields();
                    this.getUserList();
                } else {
                    message.error('操作失败：' + res.msg);
                    this.setState({ confirmLoading: false });
                }
            }
        });
    };

    deleteUser = async (record) => {
        this.setState({ loading: true });
        const res = await reqDeleteUser({ _id: record._id });
        if (res) {
            message.success('删除成功！');
            this.getUserList();
        }
    };

    handleCancel = () => {
        this.setState({ visible: false, confirmLoading: false });
        this.props.form.resetFields();
    };

    getUserList = async () => {
        this.setState({ loading: true });
        const res = await reqUserList();
        if (res && res.data) {
            this.setState({
                loading: false,
                tableData: res.data.users,
                roles: res.data.roles
            });
        }
    };

    onSearch = (value) => {
        this.setState({ searchText: value.toLowerCase() });  // Convert search text to lower case
    };

    filterData = () => {
        const { tableData, searchText } = this.state;
        return tableData.filter(item =>
            (item.username && item.username.toLowerCase().includes(searchText)) ||
            (item.phone && item.phone.includes(searchText)) ||
            (item.email && item.email.toLowerCase().includes(searchText))
        );
    };


    // 初始化table角色显示文字
    // Part of a component that displays user information
    initTableRoleText = (role_id) => {
        const { roles } = this.state;
        const role = roles.find(r => r._id === role_id);
        return role ? role.name : '待分配角色';  // Fallback in case role isn't found
    }

    componentDidMount() {
        this.getUserList();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {visible, confirmLoading, loading, tableData, record, isUpdate, roles} = this.state;
        const filteredData = this.filterData();
        const selectView = roles.map(item => {
            return (
                <Option key={item._id} value={item._id}>{item.name}</Option>
            )
        })
        return (
            <Card title={this.cardTitle} extra={
                <Input.Search
                    placeholder="搜索用户"
                    onSearch={this.onSearch}
                    style={{ width: 200 }}
                />
            }>
                <Modal
                    title={isUpdate ? "更新用户" : "创建用户"}
                    visible={visible}
                    onOk={this.handleAddUser}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <Form onSubmit={this.handleAddUser} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                    rules: [{required: true, message: '请输入用户名!'}],
                                    initialValue: record.username
                                }
                            )(
                                <Input
                                    prefix={<Icon type="user" style={iconStyle}/>}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        {
                            isUpdate ? null : <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [
                                        { required: true, message: '请输入密码!' },
                                        { min: 8, message: '密码至少为8位' },
                                        { max: 16, message: '密码最多为16位' },
                                        { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/, message: '密码需包含大小写字母及数字' }
                                    ],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={iconStyle}/>}
                                        type="password"
                                        placeholder="Password"
                                    />,
                                )}
                            </Form.Item>
                        }
                        <Form.Item>
                            {getFieldDecorator('phone', {
                                // rules: [{ required: true, pattern:/^1[3456789]\d{9}$/, message: '请输入正确的手机号!' }],
                                initialValue: record.phone
                            })(
                                <Input
                                    prefix={<Icon type="phone" style={iconStyle}/>}
                                    type="number"
                                    placeholder="请输入手机号"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('email', {
                                rules: [
                                    { required: true, message: '请输入邮箱地址!' },
                                    { type: 'email', message: '邮箱地址格式错误!' }
                                ],
                                initialValue: record.email
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={iconStyle}/>}
                                    type="email"
                                    placeholder="请输入邮箱"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('role_id', {
                                rules: [{required: true, message: '请选择角色!'}],
                                initialValue: record.role_id
                            })(
                                <Select placeholder='请选择角色！'>
                                    {selectView}
                                </Select>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Table
                    dataSource={filteredData}
                    columns={this.columns}
                    bordered
                    loading={loading}
                    rowKey='_id'
                    size='small'
                    pagination={{
                        defaultCurrent: 1,
                        pageSize: 3,
                        total: filteredData.length
                    }}
                />
            </Card>
        )
    }
}

export default Form.create({name: 'normal_login'})(User);
