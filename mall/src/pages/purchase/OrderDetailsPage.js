import React from 'react';
import { Card, List, Typography, Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetOrderDetails, reqCancelOrder, reqConfirmReceipt, reqRequestAfterSales } from '../../api';

const { Text } = Typography;

class OrderDetailsPage extends React.Component {
    state = {
        orderId: this.props.location.state.orderId || '',
        order: {}, // 存储订单详情的对象
        products: [], // 存储订单中的商品
    };

    componentDidMount() {
        this.fetchProductDetails();
    }

    fetchProductDetails = async () => {
        if (this.state.orderId) {
            const orderId = this.state.orderId;
            const res = await reqGetOrderDetails(orderId);

            if (res.status === 0) {
                this.setState({ order: res.data, products: res.data.products });
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
        const res = await reqCancelOrder(this.state.orderId);
        if (res.status === 0) {
            message.success('订单已取消');
            this.setState({ order: { ...this.state.order, status: '已取消' } });
        } else {
            message.error('取消订单失败');
        }
    };

    handleConfirmReceipt = async () => {
        const res = await reqConfirmReceipt(this.state.orderId);
        if (res.status === 0) {
            message.success('已确认收货');
            this.setState({ order: { ...this.state.order, status: '已收货' } });
        } else {
            message.error('确认收货失败');
        }
    };

    handleRequestAfterSales = async () => {
        const res = await reqRequestAfterSales(this.state.orderId);
        if (res.status === 0) {
            message.success('售后请求已提交');
        } else {
            message.error('售后请求提交失败');
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
                                title={product.name}
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
                {order.status === '待收货' && (
                    <>
                        <Button type="primary" onClick={this.handleConfirmReceipt}>确认收货</Button>
                        <Button onClick={this.handleRequestAfterSales} style={{ marginLeft: 10 }}>售后</Button>
                    </>
                )}
                {order.status === '已收货' && (
                    <Button type="primary" onClick={this.handleRequestAfterSales}>售后</Button>
                )}
            </Card>
        );
    }
}

export default withRouter(OrderDetailsPage);
