import React, { useState, useEffect } from 'react';
import {
    Card, Typography, Button, message, List,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { reqProductList, reqHotProducts, reqSeckillProducts } from '../../api';
import { formatNumber } from '../../utils/common';
import { Space } from "antd-mobile";

const { Text } = Typography;
const PAGE_SIZE = 5;

const ProductListPage = ({ history, location }) => {
    const [pageNum, setPageNum] = useState(1);
    const [productListSource, setProductListSource] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [categoryId, setCategoryId] = useState(location.state?.categoryId || '');
    const [pCategoryId, setParentCategoryId] = useState(location.state?.pCategoryId || '');
    const [searchText, setSearchText] = useState(location.state?.searchText || '');
    const [hotItems, setHotItems] = useState([]);
    const [seckillItems, setSeckillItems] = useState({ ongoing: [], upcoming: [] });

    useEffect(() => {
        if (location.state?.categoryId && location.state?.pCategoryId) {
            console.log('Received Category ID:', location.state.categoryId); // 添加日志
            console.log('Received Parent Category ID:', location.state.pCategoryId); // 添加日志
            setCategoryId(location.state.categoryId);
            setParentCategoryId(location.state.pCategoryId);
            setSearchText('');
        } else if (location.state?.searchText) {
            setSearchText(location.state.searchText);
            setCategoryId('');
            setParentCategoryId('');
        }
        getProductList(1);
        fetchHotProducts();
        fetchSeckillProducts();
    }, [location.state]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchSeckillProducts();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const getProductList = async (pageNum) => {
        setLoading(true);
        try {
            const res = await reqProductList({ pageNum, pageSize: PAGE_SIZE, categoryId, pCategoryId, searchText });
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

    const fetchHotProducts = async () => {
        try {
            const res = await reqHotProducts();
            if (res.status === 0) {
                const list = res.data;
                const filteredList = list.filter(item => item.status === 1); // 过滤掉下架商品
                setHotItems(filteredList);
            } else {
                message.error('获取热门商品失败');
            }
        } catch (error) {
            message.error('获取热门商品失败');
        }
    };

    const fetchSeckillProducts = async () => {
        try {
            const res = await reqSeckillProducts({ categoryId, pCategoryId });
            if (res.status === 0) {
                setSeckillItems(res.data);
            } else {
                message.error('获取秒杀商品失败');
            }
        } catch (error) {
            //message.error('获取秒杀商品失败');
        }
    };

    const handleDetail = (data) => {
        history.push({
            pathname: '/mainpage/product/detail',
            state: { productId: data._id },
        });
    };

    const handleItemClick = (productId) => {
        history.push({
            pathname: '/mainpage/product/detail',
            state: { productId, from: location.state?.from || 'productList' },
        });
    };

    const handleBack = () => {
        const from = location.state?.from;
        if (from === 'category') {
            history.push('/mainpage/category');
        } else if (from === 'header') {
            history.push('/mainpage/home');
        } else {
            history.goBack();
        }
    };

    const formatTimeLeft = (endTime) => {
        const totalSeconds = Math.floor((new Date(endTime) - new Date()) / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}小时 ${minutes}分钟 ${seconds}秒`;
    };

    return (
        <div style={{ padding: '0 5%' }}>
            <Button onClick={handleBack} style={{ marginBottom: '10px' }}>返回</Button>
            <Space direction='vertical' style={{ width: '100%' }}>
                <Card bordered={false} style={{ borderRadius: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.1)', }}>
                    <h1 style={{ fontSize: 20, fontWeight: 700 }}>正在进行的秒杀</h1>
                    <List
                        grid={{ gutter: 16, xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                        dataSource={seckillItems.ongoing.filter(item => item.status === 1)}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    cover={<img alt="product" src={item.imgs[0]} />}
                                    title={item.name}
                                    onClick={() => handleItemClick(item._id)}
                                >
                                    {`价格: ${item.price}￥`}
                                    <br />
                                    {`秒杀结束时间: ${new Date(item.seckillEnd).toLocaleString()}`}
                                    <br />
                                    {`剩余时间: ${formatTimeLeft(item.seckillEnd)}`}
                                </Card>
                            </List.Item>
                        )}
                    />
                </Card>
                <Card bordered={false} style={{ borderRadius: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.1)', }}>
                    <h1 style={{ fontSize: 20, fontWeight: 700 }}>即将开始的秒杀</h1>
                    <List
                        grid={{ gutter: 16, xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                        dataSource={seckillItems.upcoming.filter(item => item.status === 1)}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    cover={<img alt="product" src={item.imgs[0]} />}
                                    title={item.name}
                                    onClick={() => handleItemClick(item._id)}
                                >
                                    {`价格: ${item.price}￥`}
                                    <br />
                                    {`秒杀开始时间: ${new Date(item.seckillStart).toLocaleString()}`}
                                    <br />
                                    {`倒计时: ${formatTimeLeft(item.seckillStart)}`}
                                </Card>
                            </List.Item>
                        )}
                    />
                </Card>
                <br />
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>精选好物</h1>
                <List
                    grid={{ gutter: 16, xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                    dataSource={productListSource}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                hoverable
                                style={{ borderRadius: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.1)', }}
                                cover={<div style={{ display: 'flex', justifyContent: 'center', padding: '20px', }}>
                                    <img alt="product" src={item.imgs[0]} style={{ borderRadius: 20 }} /></div>}
                                onClick={() => handleItemClick(item._id)}
                            >
                                <Card.Meta
                                    title={(
                                        <div style={{ textAlign: 'center' }}>
                                            {`${item.name}`}
                                        </div>
                                    )}
                                    description={(
                                        <div style={{ textAlign: 'center' }}>
                                            <div>{`描述: ${item.desc}`}</div>
                                            <br />
                                            <div style={{
                                                fontSize: 20,
                                                fontWeight: 700,
                                                color: '#f00'
                                            }}>{`${item.price}￥`}</div>
                                        </div>
                                    )}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            </Space>
        </div>
    );
};

export default withRouter(ProductListPage);
