import React from 'react';
import { Button, Card, List, message, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqCancelOrder, reqConfirmReceipt, reqCreateOrder, reqGetOrderDetails, reqRequestAfterSales } from '../../api';
import {connect} from "react-redux";

const { Text } = Typography;

class OrderDetailsPage extends React.Component {
    state = {
        orderId: this.props.location.state.orderId || '',
        order: {}, // 存储订单详情的对象
        products: [], // 存储订单中的商品
    };

    componentDidMount() {
        this.fetchOrderDetails();
    }

    fetchOrderDetails = async () => {
        const { orderId } = this.state;
        if (orderId) {
            const res = await reqGetOrderDetails(orderId);
            if (res.status === 0) {
                this.setState({ order: res.data, products: res.data.products });
            } else {
                message.error('获取订单详情失败');
            }
        }
    };

    handlePayment = () => {
        const { products, orderId } = this.state;
        const totalAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);

        this.props.history.push({
            pathname: '/checkout',
            state: { products, totalAmount, orderId },
        });
    };

    handleCancelOrder = async () => {
        const { orderId } = this.state;
        const res = await reqCancelOrder({ orderId });
        if (res.status === 0) {
            message.success('订单已取消');
            this.setState({ order: { ...this.state.order, status: '已取消' } });
        } else {
            message.error(res.msg || '取消订单失败');
        }
    };

    handleConfirmReceipt = async () => {
        const { orderId } = this.state;
        const res = await reqConfirmReceipt({ orderId });
        if (res.status === 0) {
            message.success('已确认收货');
            this.setState({ order: { ...this.state.order, status: '已收货' } });
        } else {
            message.error(res.msg || '确认收货失败');
        }
    };

    handleRequestAfterSales = async () => {
        const { orderId } = this.state;
        const res = await reqRequestAfterSales({ orderId });
        if (res.status === 0) {
            message.success('售后请求已提交');
        } else {
            message.error(res.msg || '售后请求提交失败');
        }
    };

    handleReorder = async () => {
        const { products } = this.state;
        const { userInfo } = this.props;
        const totalAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);

        if (products.length === 0) {
            message.warning('没有商品可以重新下单');
            return;
        }

        console.log({ userId: userInfo._id, products, totalAmount })
        try {
            const res = await reqCreateOrder({ userId: userInfo._id, products, totalAmount });
            if (res.status === 0) {
                this.props.history.push({
                    pathname: '/checkout',
                    state: { products, totalAmount, orderId: res.data._id },
                });
            } else {
                message.error('重新下单失败');
            }
        } catch (error) {
            message.error('重新下单失败');
        }
    };

    render() {
        const { orderId, products, order } = this.state;

        return (
            <Card title={`订单号: ${orderId}`}>
                <List
                    itemLayout="vertical"
                    dataSource={products}
                    renderItem={(product) => (
                        <List.Item key={product._id}>
                            <List.Item.Meta
                                title={`商品名：${product.name} | 商品描述：${product.desc}`}
                                description={`价格: ¥${product.price} | 数量: ${product.quantity}`}
                            />
                        </List.Item>
                    )}
                />
                <Text>总金额: ¥{products.reduce((total, product) => total + product.price * product.quantity, 0)}</Text>
                <br />
                <br />
                <Text>订单状态: {order.status}</Text>
                <br />
                {order.status === '待付款' && (
                    <>
                        <Button type="primary" onClick={this.handlePayment}>去支付</Button>
                        <Button onClick={this.handleCancelOrder} style={{ marginLeft: 10 }}>取消订单</Button>
                    </>
                )}
                {order.status === '待发货' && (
                    <>
                        <Button onClick={this.handleCancelOrder} style={{ marginLeft: 10 }}>取消订单</Button>
                    </>
                )}
                {order.status === '待收货' && (
                    <>
                        <Button type="primary" onClick={this.handleConfirmReceipt}>确认收货</Button>
                        <Button onClick={this.handleRequestAfterSales} style={{ marginLeft: 10 }}>售后</Button>
                    </>
                )}
                {order.status === '已收货' && (
                    <Button type="primary" onClick={this.handleRequestAfterSales}>售后</Button>
                )}
                {order.status === '已取消' && (
                    <Button type="primary" onClick={this.handleReorder}>重新下单</Button>
                )}
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginUserInfo,
});

export default withRouter(connect(mapStateToProps)(OrderDetailsPage));
