import React from 'react';
import { Card, Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqUpdateOrder } from 'api';
import { connect } from 'react-redux';

class CheckoutPage extends React.Component {
    state = {
        order: {
            products: [],
            totalAmount: 0,
            status: '待付款',
            orderId: null,
        },
    };

    componentDidMount() {
        const { location } = this.props;
        if (location.state && location.state.products && location.state.products.length > 0) {
            this.setState({ order: { ...location.state, status: '待付款', orderId: location.state.orderId } });
        } else {
            message.error('未能获取订单信息，请返回购物车重新结算');
            this.props.history.push('/mainpage/cart');
        }
    }

    handleConfirmPayment = async () => {
        const { orderId } = this.state.order;
        try {
            await reqUpdateOrder({ orderId, status: '待发货' });
            message.success('支付成功');
            this.props.history.push('/order-confirmed');
        } catch (error) {
            message.error('支付失败');
        }
    };

    handleBack = () => {
        this.props.history.push('/mainpage/cart');
    };

    render() {
        const { products, totalAmount, status, orderId } = this.state.order;
        return (
            <Card title="支付页面">
                <p>订单号: {orderId}</p>
                <p>商品列表:</p>
                <ul>
                    {products.map((product, index) => (
                        <li key={index}>
                            名称: {product.name} - 数量: {product.quantity}件 - 价格: ¥{product.price} - 描述: {product.desc}
                        </li>
                    ))}
                </ul>
                <p>总金额: ¥{totalAmount}</p>
                <p>状态: {status}</p>
                <Button type="primary" onClick={this.handleConfirmPayment}>确认支付</Button>
                <Button type="default" onClick={this.handleBack}>返回购物车</Button>
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginUserInfo, // 从Redux store中获取用户信息
});

export default connect(mapStateToProps)(withRouter(CheckoutPage));
