import React, { Component } from 'react';
import { Button, Card, Cascader, Form, Icon, Input, message, DatePicker } from 'antd';
import RichEditText from './richTextEdit';
import { withRouter } from 'react-router-dom';
import { reqAddProduct, reqCatagoryList, reqProductUpdate } from 'api';
import moment from "moment";

const { TextArea } = Input;

class ProductAdd extends Component {
    state = {
        loading: false,
        productClassList: [],
        cardTitle: '添加商品'
    }

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.richEditTextRef = React.createRef();
        const { state } = this.props.location;
        this.title = (
            <span><Icon type="arrow-left" onClick={() => { this.props.history.goBack() }} style={{ fontSize: 20, marginRight: 4 }} />
                {state ? '修改商品' : '添加商品'}
            </span>
        );
    }

    handleSubmit = e => {
        e.preventDefault();
        const getInputData = this.richEditTextRef.current.getInputData();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ loading: true });

                const params = {
                    categoryId: values.prdCategory[1] ? values.prdCategory[1] : values.prdCategory[0],
                    pCategoryId: values.prdCategory[0],
                    name: values.prdName,
                    price: values.prdPrice,
                    desc: values.prdDesc,
                    status: 1,
                    detail: getInputData,
                    imgs: values.imgs.split(','), // Assuming imgs is a comma-separated string of URLs
                    seckillPrice: values.seckillPrice,
                    seckillStock: values.seckillStock,
                    seckillStart: values.seckillTime ? values.seckillTime[0].toDate() : null,
                    seckillEnd: values.seckillTime ? values.seckillTime[1].toDate() : null,
                };

                const res = await (this.isUpdate ? reqProductUpdate({ ...params, _id: this.oldData._id }) : reqAddProduct(params));
                if (res.status === 0) {
                    this.setState({ loading: false });
                    message.success('添加成功！');
                    this.props.location.state = null;
                    this.props.form.resetFields();
                }
            }
        });
    };

    getProductClass = async (parentId) => {
        const { data } = await reqCatagoryList({ parentId });
        if (parentId === '0') { //一级列表
            this.initSelectOptions(data);
            return;
        }
        return data;
    };

    productLoadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        const parentId = targetOption.value;
        const data = await this.getProductClass(parentId);
        targetOption.loading = false;
        if (data && data.length > 0) {
            const optionsChildren = data.map(element => {
                return {
                    value: element._id,
                    label: element.name,
                    isLeaf: true
                };
            });
            targetOption.children = optionsChildren;
        } else {
            targetOption.isLeaf = true;
        }
        this.setState({ productClassList: [...this.state.productClassList] });
    };

    initSelectOptions = async (data) => {
        const productClassList = data.map(element => {
            return {
                value: element._id,
                label: element.name,
                isLeaf: false
            };
        });

        const { categoryId, pCategoryId } = this.oldData;
        if (categoryId) {
            const subProductClass = await this.getProductClass(pCategoryId);
            const childOptions = subProductClass.map(element => {
                return {
                    value: element._id,
                    label: element.name,
                    isLeaf: false
                };
            });
            const targetOption = productClassList.find(item => item.value === pCategoryId);
            targetOption.children = childOptions;
        }
        this.setState({ productClassList });
    };

    priceValidator = (rule, value, callback) => {
        if (value * 1 >= 0) {
            return callback();
        }
        callback('价格应大于0');
    };

    componentDidMount() {
        this.getProductClass('0');
    }

    render() {
        let prdCategory = [];
        const oldData = this.props.location.state || {};
        this.oldData = oldData;
        const { categoryId, pCategoryId, detail } = oldData;
        this.isUpdate = !!pCategoryId;
        if (categoryId) {
            prdCategory.push(pCategoryId, categoryId);
        } else if (pCategoryId) {
            prdCategory.push(pCategoryId);
        }
        const { productClassList, loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        return (
            <Card title={this.title}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="商品名称">
                        {getFieldDecorator('prdName', {
                            rules: [{ required: true, message: '请输入名称!' }],
                            initialValue: oldData.name
                        })(
                            <Input placeholder="商品名称" />,
                        )}
                    </Form.Item>
                    <Form.Item label='商品描述'>
                        {getFieldDecorator('prdDesc', {
                            rules: [{ required: true, message: '请输入描述!' }], initialValue: oldData.desc
                        })(
                            <TextArea placeholder="商品描述" autosize />,
                        )}
                    </Form.Item>
                    <Form.Item label='商品价格'>
                        {getFieldDecorator('prdPrice', {
                            rules: [{ required: true, message: '请输入价格！' },
                                { validator: this.priceValidator }
                            ],
                            initialValue: (oldData.price)
                        })(
                            <Input prefix='￥' placeholder="商品价格" suffix="元" />,
                        )}
                    </Form.Item>
                    <Form.Item label="商品分类">
                        {getFieldDecorator('prdCategory', {
                            initialValue: prdCategory,
                            rules: [{ type: 'array', required: true, message: '请输入选择分类!' }],
                        })(<Cascader placeholder='请选择商品分类' options={productClassList} loadData={this.productLoadData} />)}
                    </Form.Item>
                    <Form.Item label="商品图片URL">
                        {getFieldDecorator('imgs', {
                            rules: [{ required: true, message: '请输入商品图片URL!' }],
                            initialValue: oldData.imgs ? oldData.imgs.join(',') : ''
                        })(
                            <Input placeholder="商品图片URL（多个用逗号隔开）" />)
                        }
                    </Form.Item>
                    <Form.Item label="秒杀价格">
                        {getFieldDecorator('seckillPrice', {
                            rules: [{ required: false }],
                            initialValue: oldData.seckillPrice
                        })(
                            <Input prefix='￥' placeholder="秒杀价格" suffix="元" />,
                        )}
                    </Form.Item>
                    <Form.Item label="秒杀库存">
                        {getFieldDecorator('seckillStock', {
                            rules: [{ required: false }],
                            initialValue: oldData.seckillStock
                        })(
                            <Input placeholder="秒杀库存" />,
                        )}
                    </Form.Item>
                    <Form.Item label="秒杀时间">
                        {getFieldDecorator('seckillTime', {
                            rules: [{ required: false }],
                            initialValue: oldData.seckillStart && oldData.seckillEnd ? [moment(oldData.seckillStart), moment(oldData.seckillEnd)] : []
                        })(
                            <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                        )}
                    </Form.Item>
                    <Form.Item label="商品详情">
                        <RichEditText preDetail={detail} ref={this.richEditTextRef} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ sm: { span: 10, offset: 10 } }}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            增加
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create({ name: 'normal_login' })(withRouter(ProductAdd));
