import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card, Input, message, Select, Table, Typography } from 'antd';
import { reqDeleteProduct, reqProductList, reqProductStatus } from 'api';
import { formatNumber } from '../../utils/common';

const { Option } = Select;
const { Text } = Typography;
const PAGE_SIZE = 5;
const btnStyle = {
    marginLeft: '0.5rem'
};

class Product extends Component {
    state = {
        pageNum: 1,
        selectValue: '1',
        productListSource: [],
        total: 0,
        btnLoading: false,
        loading: false,
        searchText: '',
    };

    constructor() {
        super();
        const { loading } = this.state;
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (record) => (`￥${record}`)
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '商品图片',
                dataIndex: 'imgs',
                render: (imgs) => (
                    <img src={imgs[0]} alt="商品图片" style={{ width: 50 }} />
                )
            },
            {
                title: '状态',
                render: (record) => (
                    <span>
                        <Text type={record.status ? 'success' : 'danger'}>{record.status ? '上架' : '下架'}</Text>
                        <Button
                            size='small'
                            style={btnStyle}
                            loading={loading}
                            onClick={() => this.up_down(record)}
                            type='primary'
                        >
                            {record.status ? '下架' : '上架'}
                        </Button>
                    </span>
                )
            },
            {
                title: '操作',
                render: (record) => (
                    <span>
                        <Button type="link" onClick={() => this.productDetail(record)}>详情</Button>
                        <Button type="link" onClick={() => this.productUpdate(record)}>修改</Button>
                        <Button type="link" loading={this.state.btnLoading} onClick={() => this.productDelete(record)}>删除</Button>
                    </span>
                )
            },
        ];
    }

    up_down = async (product) => {
        this.setState({ loading: true });
        const params = {
            productId: product._id,
        };
        params.status = product.status ? 0 : 1;
        const res = await reqProductStatus(params);
        if (res.status === 0) {
            this.setState({ loading: false });
            message.success('更新成功！');
            this.getProductList(this.pageNum);
        }
    }

    productUpdate = async (record) => {
        this.props.history.push('/product/add', record);
    }

    productDelete = async (record) => {
        const res = await reqDeleteProduct({ _id: record._id });
        if (res.status === 0) {
            this.getProductList(1);
        }
    }

    // 商品详情
    productDetail = (data) => {
        this.props.history.push({
            pathname: '/product/detail',
            state: data
        });
    }

    // 搜索筛选框
    selectHandleChange = selectValue => {
        this.setState({
            selectValue,
            inputPlaceholder: selectValue === '1' ? '请输入名称' : '请输入描述',
            inputValue: ''
        });
    };

    // 添加商品
    addProductBtn = (e) => {
        e.stopPropagation();
        this.props.history.push('/product/add');
    }

    // 商品列表
    getProductList = async (pageNum) => {
        this.pageNum = pageNum; //保存全局，状态更新的时候能够定位到当前页
        this.setState({
            tableLoading: true,
        });
        let res;
        res = await reqProductList({ pageNum, pageSize: PAGE_SIZE });

        const { total, list } = res.data;
        if (res.status === 0 && list.length > 0) {
            // 格式化金额
            list.forEach(item => {
                item.price = formatNumber(item.price);
            });
            this.setState({
                total,
                productListSource: list,
                tableLoading: false,
                btnLoading: false
            });
        }
    }

    componentDidMount() {
        this.getProductList(1);
    }

    filterData = () => {
        const { productListSource, searchText, selectValue } = this.state;
        if (!searchText) {
            return productListSource;
        } else if (selectValue === '1') {
            return productListSource.filter(product =>
                product.name.toLowerCase().includes(searchText.toLowerCase())
            );
        } else {
            return productListSource.filter(product =>
                product.desc.toLowerCase().includes(searchText.toLowerCase())
            );
        }
    };


    render() {
        const { loading } = this.state;
        const filteredData = this.filterData();
        const title = () => {
            return (
                <div>
                    <Select defaultValue="1"
                            style={{ width: '7rem' }}
                            onChange={this.selectHandleChange}>
                        <Option value="1">按名称搜索</Option>
                        <Option value="2">按描述搜索</Option>
                    </Select>
                    <Input.Search
                        placeholder="搜索商品"
                        onSearch={value => this.setState({ searchText: value })}
                        style={{ width: 200 }}
                    />
                </div>
            );
        }
        const addComponment = () => (
            <span>
                <Button icon="plus" type='primary' onClick={this.addProductBtn}>添加商品</Button>
            </span>
        );

        return (
            <Card title={title()} extra={addComponment()}>
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
        );
    }
}

export default withRouter(Product);
