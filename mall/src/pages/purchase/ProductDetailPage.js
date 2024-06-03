import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, Icon, List, message, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqAddToCart, reqAddToFavorites, reqAddToFootprints, reqCreateOrder, reqGetProductDetails, reqSeckill } from '../../api';
import { Space } from "antd-mobile";
import { StarOutline } from "antd-mobile-icons";

const { Text } = Typography;
const listStyle = { fontSize: 15, marginRight: '1rem' };

class ProductDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            countdown: null,
            isSeckillActive: false,
            seckillStatus: '',
        };
        this.title = (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 10' }}>
                <Icon type="arrow-left" onClick={this.goBack} style={{ fontSize: 20 }} />
                <StarOutline onClick={this.handleAddToFavorites} style={{ fontSize: 20 }} />
            </div>
        );
    }

    componentDidMount() {
        this.fetchProductDetails();
    }

    componentWillUnmount() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    fetchProductDetails = async () => {
        const { productId } = this.props.location.state;
        try {
            const res = await reqGetProductDetails(productId);
            if (res.status === 0) {
                this.setState({ product: res.data }, this.startCountdown);
                await reqAddToFootprints({ userId: this.props.userInfo._id, productId });
            } else {
                message.error(res.msg || '获取商品详情失败');
            }
        } catch (error) {
            message.error('获取商品详情失败');
        }
    }

    startCountdown = () => {
        const { seckillStart, seckillEnd } = this.state.product;
        if (!seckillStart || !seckillEnd) return;

        const startTime = new Date(seckillStart).getTime();
        const endTime = new Date(seckillEnd).getTime();
        this.countdownInterval = setInterval(() => {
            const now = new Date().getTime();

            if (now < startTime) {
                const distance = startTime - now;
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                this.setState({
                    countdown: `秒杀未开始，倒计时: ${hours}小时 ${minutes}分钟 ${seconds}秒`,
                    isSeckillActive: false,
                    seckillStatus: 'not_started'
                });
            } else if (now >= startTime && now <= endTime) {
                const distance = endTime - now;
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                this.setState({
                    countdown: `秒杀进行中，剩余时间: ${hours}小时 ${minutes}分钟 ${seconds}秒`,
                    isSeckillActive: true,
                    seckillStatus: 'ongoing'
                });
            } else {
                clearInterval(this.countdownInterval);
                this.setState({
                    countdown: '秒杀已结束',
                    isSeckillActive: false,
                    seckillStatus: 'ended'
                });
            }
        }, 1000);
    }

    goBack = () => {
        const { from } = this.props.location.state;
        if (from === 'cart') {
            this.props.history.push('/mainpage/cart');
        } else if (from === 'productList') {
            this.props.history.push('/mainpage/product/list');
        } else if (from === 'category') {
            this.props.history.push('/mainpage/category');
        } else if (from === 'header') {
            this.props.history.push('/mainpage/home');
        } else {
            this.props.history.goBack();
        }
    }

    handleBuyNow = async () => {
        const { _id: productId, name, imgs, desc, price } = this.state.product;
        const { userInfo } = this.props;
        const products = [{ productId, name, imgs, desc, quantity: 1, price }];
        const totalAmount = price;
        const originalAmount = totalAmount;

        try {
            const res = await reqCreateOrder({ userId: userInfo._id, products, totalAmount, originalAmount });
            if (res.status === 0) {
                this.props.history.push({
                    pathname: '/checkout',
                    state: { products, totalAmount, orderId: res.data._id, originalAmount },
                });
            } else {
                message.error('创建订单失败');
            }
        } catch (error) {
            message.error('创建订单失败');
        }
    }

    handleSeckill = async () => {
        const { _id: productId, name, imgs, desc, seckillPrice } = this.state.product;
        const { userInfo } = this.props;

        try {
            const res = await reqSeckill({ productId, userId: userInfo._id });
            if (res.status === 0) {
                const { orderId } = res.data._id;
                const products = [{ productId, name, imgs, desc, quantity: 1, price: seckillPrice}];
                const totalAmount = seckillPrice;
                const originalAmount = totalAmount;
                this.props.history.push({
                    pathname: '/checkout',
                    state: { products, totalAmount, orderId, originalAmount },
                });
                message.success('秒杀成功');
            } else {
                message.error(res.msg || '秒杀失败');
            }
        } catch (error) {
            message.error('秒杀失败');
        }
    }

    handleAddToCart = async () => {
        const { _id: productId, name, desc, price, imgs } = this.state.product;
        const { userInfo } = this.props;

        try {
            await reqAddToCart({
                userId: userInfo._id,
                productId,
                name,
                desc,
                quantity: 1,
                price,
                imgs
            });
            message.success('商品已加入购物车');
        } catch (error) {
            message.error('添加到购物车失败');
        }
    }

    handleAddToFavorites = async () => {
        const { _id: productId } = this.state.product;
        const { userInfo } = this.props;

        try {
            await reqAddToFavorites({
                userId: userInfo._id,
                productId
            });
            message.success('商品已收藏');
        } catch (error) {
            message.error('收藏商品失败');
        }
    }

    handleHome = () => {
        this.props.history.push('/mainpage/home');
    }

    handleCart = () => {
        this.props.history.push('/mainpage/cart');
    }

    render() {
        const { product, countdown, isSeckillActive, seckillStatus } = this.state;
        if (!product) {
            return <p>加载中...</p>;
        }

        const listTitle = [
            '商品名称', '商品描述', '商品价格', '商品详情'
        ];

        return (
            <Card title={this.title} style={{ marginRight: ' 5% ', marginLeft: ' 5% ' }}>
                <img src={product.imgs[0]} alt={product.name} style={{ width: '100%', marginBottom: '1rem' }} />
                <List bordered>
                    <List.Item>
                        <Text style={listStyle}>{listTitle[0]}:</Text>{product.name}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>{listTitle[1]}:</Text>{product.desc}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>{listTitle[2]}:</Text>¥{product.price}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>{listTitle[3]}:</Text>{product.detail}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>访问量:</Text>{product.visitCount}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>收藏量:</Text>{product.favoriteCount}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>成交量:</Text>{product.orderCount}
                    </List.Item>
                    {product.seckillPrice && (
                        <>
                            <List.Item>
                                <Text style={listStyle}>秒杀价格:</Text>¥{product.seckillPrice}
                            </List.Item>
                            <List.Item>
                                <Text style={listStyle}>秒杀库存:</Text>{product.seckillStock}
                            </List.Item>
                            <List.Item>
                                <Text style={listStyle}>秒杀状态:</Text>{countdown}
                            </List.Item>
                        </>
                    )}
                </List>

                <div style={{ display: 'flex', justifyContent: 'center', padding: 10, margin: 10 }}>
                    <Space>
                        <Button type="default" onClick={this.handleBuyNow}>立即购买</Button>
                        <Button type="default" onClick={this.handleAddToCart}>加入购物车</Button>
                        {product.seckillPrice && (
                            <Button type="danger" onClick={this.handleSeckill} disabled={!isSeckillActive}>秒杀抢购</Button>
                        )}
                    </Space>
                </div>
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginUserInfo,
});

export default connect(mapStateToProps)(withRouter(ProductDetailPage));
