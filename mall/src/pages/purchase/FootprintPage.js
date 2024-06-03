import React, { useState, useEffect } from 'react';
import {
    List, Card, message, Button,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetFootprints, reqDeleteFootprintItem } from 'api';
import { connect } from 'react-redux';
import Meta from "antd/es/card/Meta";
import { Space } from "antd-mobile";

const FootprintPage = ({ history, userInfo }) => {
    const [footprints, setFootprints] = useState([]);

    useEffect(() => {
        const fetchFootprints = async () => {
            const userId = userInfo._id;
            try {
                const res = await reqGetFootprints({ userId });
                if (res.status === 0) {
                    setFootprints(res.data || []);
                } else {
                    message.error(res.msg || '获取足迹信息失败');
                }
            } catch (error) {
                message.error('获取足迹信息失败');
            }
        };

        fetchFootprints();
    }, [userInfo]);

    const handleDetail = (productId) => {
        history.push({
            pathname: '/mainpage/product/detail',
            state: { productId },
        });
    };

    const handleDelete = async (productId) => {
        const userId = userInfo._id;
        try {
            await reqDeleteFootprintItem({ userId, productId });
            setFootprints(footprints.filter((item) => item.productDetails._id !== productId));
            message.success('删除足迹商品成功');
        } catch (error) {
            message.error('删除足迹商品失败');
        }
    };

    const handleBack = () => {
        history.push('/mainpage/my');
    };

    return (
        <Card title="我的足迹" extra={<Button onClick={handleBack}>返回</Button>} style={{ marginRight: '5%', marginLeft: '5%', marginTop: '20px' }}>
            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 3 }}
                dataSource={footprints}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            cover={
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', }}>
                                    <img src={item.productDetails.imgs[0]} alt={item.productDetails.name} style={{ borderRadius: 5, maxHeight: '200px', objectFit: 'cover' }} />
                                </div>
                            }
                            style={{ borderRadius: 5, marginBottom: '10px' }}
                        >
                            <Meta title={<div style={{ textAlign: 'center' }}>{item.productDetails.name}</div>}
                                  description={<div style={{ textAlign: 'center' }}>
                                      <p>{item.productDetails.desc}</p>
                                      <p>{new Date(item.lastVisited).toLocaleString()}</p>
                                  </div>} />
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                                <Space>
                                    <Button type="default" onClick={() => handleDetail(item.productDetails._id)}>详情</Button>
                                    <Button type="danger" onClick={() => handleDelete(item.productDetails._id)}>删除</Button>
                                </Space>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </Card>
    );
};

const mapStateToProps = (state) => ({
    userInfo: state.loginUserInfo,
});

export default connect(mapStateToProps)(withRouter(FootprintPage));
