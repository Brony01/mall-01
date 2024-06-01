import React, { useState, useEffect } from 'react';
import {
    Card, Input, Select, Table, Typography, Button, message,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { reqProductList } from 'api';
import { formatNumber } from '../../utils/common';

const { Option } = Select;
const { Text } = Typography;
const PAGE_SIZE = 5;

const ProductListPage = ({ history, location }) => {
    const [pageNum, setPageNum] = useState(1);
    const [selectValue, setSelectValue] = useState('1');
    const [productListSource, setProductListSource] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState(location.state?.searchText || '');
    const [categoryId, setCategoryId] = useState(location.state?.categoryId || '');

    useEffect(() => {
        getProductList(1);
    }, [categoryId]);

    const getProductList = async (pageNum) => {
        setLoading(true);
        try {
            const res = await reqProductList({ pageNum, pageSize: PAGE_SIZE, categoryId });
            if (res.status === 0) {
                const { total, list } = res.data;
                const filteredList = list.filter(item => item.status === 1); // 过滤掉下架商品
                filteredList.forEach((item) => item.price = formatNumber(item.price));
                setProductListSource(filteredList);
                setTotal(filteredList.length);
            } else {
                message.error('获取商品列表失败');
            }
        } catch (error) {
            message.error('获取商品列表失败');
        }
        setLoading(false);
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filterData = () => {
        if (!searchText) {
            return productListSource;
        }
        if (selectValue === '1') {
            return productListSource.filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        return productListSource.filter((product) => product.desc.toLowerCase().includes(searchText.toLowerCase()));
    };

    const handleDetail = (data) => {
        history.push({
            pathname: '/mainpage/product/detail',
            state: { productId: data._id },
        });
    };

    const filteredData = filterData();
    const title = (
        <div>
            <Select defaultValue="1" style={{ width: '7rem' }} onChange={setSelectValue}>
                <Option value="1">按名称搜索</Option>
                <Option value="2">按描述搜索</Option>
            </Select>
            <Input.Search placeholder="搜索商品" onSearch={handleSearch} style={{ width: 200 }} />
        </div>
    );
    const addComponment = (
        <span>
      <Button icon="plus" type="primary">添加商品</Button>
    </span>
    );

    const columns = [
        { title: '商品名称', dataIndex: 'name' },
        { title: '价格', dataIndex: 'price', render: (record) => (`￥${record}`) },
        { title: '商品描述', dataIndex: 'desc' },
        { title: '访问量', dataIndex: 'visitCount' },
        { title: '收藏量', dataIndex: 'favoriteCount' },
        { title: '成交量', dataIndex: 'orderCount' },
        {
            title: '商品图片',
            dataIndex: 'imgs',
            render: (imgs) => (
                <img src={imgs[0]} alt="商品图片" style={{ width: 50 }} />
            )
        },
        {
            title: '秒杀状态',
            render: (record) => {
                if (record.seckillPrice) {
                    const now = new Date();
                    const seckillStart = new Date(record.seckillStart);
                    const seckillEnd = new Date(record.seckillEnd);
                    if (now < seckillStart) {
                        return <Text type="warning">秒杀未开始</Text>;
                    }
                    if (now >= seckillStart && now <= seckillEnd) {
                        return (
                            <span>
                <Text type="danger">秒杀进行中</Text>
                <br />
                <Text>库存: {record.seckillStock}</Text>
                <br />
                <Text>结束时间: {seckillEnd.toLocaleString()}</Text>
              </span>
                        );
                    }
                    if (now > seckillEnd) {
                        return <Text type="secondary">秒杀已结束</Text>;
                    }
                }
                return null;
            },
        },
        {
            title: '操作',
            render: (record) => (
                <span>
          <Button type="link" onClick={() => handleDetail(record)}>详情</Button>
        </span>
            ),
        },
    ];

    return (
        <Card title={title} extra={addComponment} style={{ marginRight: ' 5% ', marginLeft: ' 5% ', marginTop:'60px'}}>
            <Table
                dataSource={filteredData}
                columns={columns}
                bordered
                loading={loading}
                rowKey="_id"
                size="small"
                pagination={{ defaultCurrent: 1, pageSize: 5, total: filteredData.length }}
            />
        </Card>
    );
};

export default withRouter(ProductListPage);
