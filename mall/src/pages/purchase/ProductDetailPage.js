import React from 'react';
import { Card, List, Typography, Icon, Button } from 'antd';
import { withRouter } from 'react-router-dom';

const { Text } = Typography;
const listStyle = { fontSize: 15, marginRight: '1rem' };

class ProductDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.title = (
            <Icon type="arrow-left" onClick={this.goBack} style={{ fontSize: 20 }} />
        );
    }

    goBack = () => {
        this.props.history.goBack();
    }

    handleBuyNow = () => {
        this.props.history.push('/checkout');
    }

    handleAddToCart = () => {
        // 逻辑: 将商品添加到购物车
        this.props.history.push('/mainpage/cart');
    }

    handleHome = () => {
        this.props.history.push('/mainpage/home');
    }

    handleCart = () => {
        this.props.history.push('/mainpage/cart');
    }

    render() {
        const data = this.props.location.state || {
            name: '小米12 Pro',
            desc: '天玑9000+处理器 5000万像素徕卡影像 2K超视网膜 120Hz屏幕 67W快充',
            price: '¥2999',
            detail: '商品详情信息',
            coupons: ['优惠券1', '优惠券2'],
            seckill: '未参与秒杀抢购'
        };

        const listTitle = [
            '商品名称', '商品描述', '商品价格', '商品详情'
        ];

        return (
            <Card title={this.title}>
                <img src="商品图片链接" alt={data.name} style={{ width: '100%', marginBottom: '1rem' }} />
                <List
                    bordered
                >
                    <List.Item>
                        <Text style={listStyle}>{listTitle[0]}:</Text>{data.name}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>{listTitle[1]}:</Text>{data.desc}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>{listTitle[2]}:</Text>{data.price}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>{listTitle[3]}:</Text>{data.detail}
                    </List.Item>
                </List>

                <div className="coupons">
                    <h3>优惠券</h3>
                    <List
                        dataSource={data.coupons}
                        renderItem={item => (
                            <List.Item>{item}</List.Item>
                        )}
                    />
                </div>

                <div className="seckill">
                    <h3>秒杀抢购时间</h3>
                    <p>{data.seckill}</p>
                </div>

                <div className="bottom-buttons">
                    <Button onClick={this.handleHome}>首页</Button>
                    <Button onClick={this.handleCart}>购物车</Button>
                    <Button>收藏</Button>
                    <Button type="primary" onClick={this.handleBuyNow}>立即购买</Button>
                    <Button type="primary" onClick={this.handleAddToCart}>加入购物车</Button>
                </div>
            </Card>
        );
    }
}

export default withRouter(ProductDetailPage);
