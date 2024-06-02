import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

class AddForm extends Component {
    static propTypes = {
        categoryList: PropTypes.array.isRequired,
        setForm: PropTypes.func.isRequired,
        currentRowData: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.props.setForm(this.props.form);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { categoryList, currentRowData } = this.props;
        return (
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
                <Form.Item label="选择分类">
                    {getFieldDecorator('categoryId', {
                        rules: [{ required: true, message: '请选择分类!' }],
                        initialValue: currentRowData._id
                    })(
                        <Select placeholder="选择分类">
                            <Option value={'0'} key={'0'}>一级分类</Option>
                            {categoryList.map(item => <Option value={item._id} key={item._id}>{item.name}</Option>)}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="分类名称">
                    {getFieldDecorator('categoryName', {
                        rules: [{ required: true, message: '请输入分类名称!' }],
                    })(<Input placeholder="输入分类" />)}
                </Form.Item>
                <Form.Item label="分类图片URL">
                    {getFieldDecorator('imageUrl', {
                        rules: [{ required: true, message: '请输入分类图片URL!' }],
                    })(<Input placeholder="输入分类图片URL" />)}
                </Form.Item>
            </Form>
        );
    }
}

const WrappedAddForm = Form.create()(AddForm);
export default WrappedAddForm;
