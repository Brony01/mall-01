import React from 'react';
import {connect} from 'react-redux';
import {Button, Card, Icon, List, message, Typography} from 'antd';
import {withRouter} from 'react-router-dom';
import {reqAddToCart, reqAddToFavorites, reqAddToFootprints, reqCreateOrder, reqGetProductDetails} from 'api';

const {Text} = Typography;
const listStyle = {fontSize: 15, marginRight: '1rem'};

class ProductDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
        };
        this.title = (
            <Icon type="arrow-left" onClick={this.goBack} style={{fontSize: 20}}/>
        );
    }

    componentDidMount() {
        this.fetchProductDetails();
    }

    fetchProductDetails = async () => {
        const {productId} = this.props.location.state;
        try {
            const res = await reqGetProductDetails(productId);
            if (res.status === 0) {
                this.setState({product: res.data});
                await reqAddToFootprints({userId: this.props.userInfo._id, productId});
            } else {
                message.error(res.msg || '获取商品详情失败');
            }
        } catch (error) {
            message.error('获取商品详情失败');
        }
    }

    goBack = () => {
        this.props.history.goBack();
    }

    handleBuyNow = async () => {
        const {_id: productId, name, desc, price} = this.state.product;
        const {userInfo} = this.props;
        const products = [{productId, name, desc, quantity: 1, price}];
        const totalAmount = price;

        try {
            const res = await reqCreateOrder({userId: userInfo._id, products, totalAmount});
            if (res.status === 0) {
                this.props.history.push({
                    pathname: '/checkout',
                    state: {products, totalAmount, orderId: res.data._id},
                });
            } else {
                message.error('创建订单失败');
            }
        } catch (error) {
            message.error('创建订单失败');
        }
    }

    handleAddToCart = async () => {
        const {_id: productId, name, desc, price} = this.state.product;
        const {userInfo} = this.props;

        try {
            await reqAddToCart({
                userId: userInfo._id,
                productId,
                name,
                desc,
                quantity: 1,
                price
            });
            message.success('商品已加入购物车');
        } catch (error) {
            message.error('添加到购物车失败');
        }
    }

    handleAddToFavorites = async () => {
        const {_id: productId} = this.state.product;
        const {userInfo} = this.props;

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
        const {product} = this.state;
        if (!product) {
            return <p>加载中...</p>;
        }

        const listTitle = [
            '商品名称', '商品描述', '商品价格', '商品详情'
        ];

        return (
            <Card title={this.title}>
                <img src={product.imgs[0]} alt={product.name} style={{width: '100%', marginBottom: '1rem'}}/>
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
                </List>

                <div className="coupons">
                    <h3>优惠券</h3>
                    <List
                        dataSource={product.coupons}
                        renderItem={item => (
                            <List.Item>{item}</List.Item>
                        )}
                    />
                </div>

                <div className="seckill">
                    <h3>秒杀抢购时间</h3>
                    <p>{product.seckill}</p>
                </div>

                <div className="bottom-buttons">
                    <Button onClick={this.handleHome}>首页</Button>
                    <Button onClick={this.handleCart}>购物车</Button>
                    <Button onClick={this.handleAddToFavorites}>收藏</Button>
                    <Button type="primary" onClick={this.handleBuyNow}>立即购买</Button>
                    <Button type="primary" onClick={this.handleAddToCart}>加入购物车</Button>
                </div>
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginUserInfo, // 从Redux store中获取用户信息
});

export default connect(mapStateToProps)(withRouter(ProductDetailPage));
