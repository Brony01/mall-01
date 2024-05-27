import React from 'react';
import { Button, Card, List, message, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqConfirmOrder } from 'api';

const { Text } = Typography;

class CheckoutPage extends React.Component {
    state = {
        products: [],
        totalAmount: 0,
        orderId: ''
    };

    componentDidMount() {
        const { products, totalAmount, orderId } = this.props.location.state;
        this.setState({ products, totalAmount, orderId });
    }

    handleConfirmOrder = async () => {
        const { orderId } = this.state;
        try {
            const res = await reqConfirmOrder({ orderId });
            if (res.status === 0) {
                this.props.history.push({
                    pathname: '/order-confirmed',
                    state: { totalAmount: this.state.totalAmount }
                });
            } else {
                message.error('支付失败');
            }
        } catch (error) {
            message.error('支付失败');
        }
    };

    render() {
        const { products, totalAmount } = this.state;

        return (
            <Card title="订单结算">
                <List
                    itemLayout="vertical"
                    dataSource={products}
                    renderItem={(product) => (
                        <List.Item key={product.productId}>
                            <List.Item.Meta
                                title={product.name}
                                description={`价格: ¥${product.price} | 数量: ${product.quantity}`}
                            />
                        </List.Item>
                    )}
                />
                <Text>总金额: ¥{totalAmount}</Text>
                <br />
                <br />
                <Button type="primary" onClick={this.handleConfirmOrder}>确认支付</Button>
            </Card>
        );
    }
}

export default withRouter(CheckoutPage);
