import React from 'react';
import { Card, Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqCreateOrder, reqUpdateOrder } from 'api';

class CheckoutPage extends React.Component {
    state = {
        order: {
            products: [],
            totalAmount: 0,
            status: '待支付',
            orderId: null,
        },
    };

    componentDidMount() {
        const { location } = this.props;
        if (location.state && location.state.products && location.state.products.length > 0) {
            this.setState({ order: { ...location.state, status: '待支付' } }, this.createOrder);
        } else {
            message.error('未能获取订单信息，请返回购物车重新结算');
            this.props.history.push('/mainpage/cart');
        }
    }

    createOrder = async () => {
        const { products, totalAmount } = this.state.order;
        const userId = this.props.userInfo._id; // 从用户登录信息中获取
        try {
            const res = await reqCreateOrder({ userId, products, totalAmount });
            if (res.status === 0) {
                this.setState({
                    order: {
                        ...this.state.order,
                        orderId: res.data._id,
                    },
                });
            } else {
                message.error('创建订单失败');
            }
        } catch (error) {
            message.error('创建订单失败');
        }
    };

    handleConfirmPayment = async () => {
        const { orderId } = this.state.order;
        try {
            await reqUpdateOrder({ orderId, status: '已支付' });
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
        const { products, totalAmount, status } = this.state.order;
        return (
            <Card title="支付页面">
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

export default withRouter(CheckoutPage);
