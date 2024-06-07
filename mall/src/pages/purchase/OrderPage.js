import React from 'react';
import { Card, List, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { ArrowLeftOutlined } from "@ant-design/icons";
import {NavBar} from "antd-mobile";

class OrderPage extends React.Component {
    state = {
        orders: [],
    };

    componentDidMount() {
        const { location } = this.props;
        const orders = location.state && location.state.orders;
        if (orders) {
            this.setState({ orders });
        }
    }

    handleOrderClick = (orderId) => {
        // 在这里执行你想要的操作，例如跳转到一个详细的订单页面
        this.props.history.push({
            pathname: '/order-details',
            state: { orderId },
        });
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    render() {
        const { orders } = this.state;

        return (
            <div>
                <NavBar onBack={this.handleBack} style={{ fontSize: 25, fontWeight:700, background: 'white'}}>订单</NavBar>
                {/*<ArrowLeftOutlined onClick={this.handleBack} style={{ fontSize: 25 }} />*/}
                <Card style={{padding:'0 3%'}}>
                    <List
                        itemLayout="vertical"
                        dataSource={orders}
                        renderItem={(order) => (
                            <List.Item key={order._id} onClick={() => this.handleOrderClick(order._id)}>
                                <List.Item.Meta
                                    title={`订单号: ${order._id}`}
                                    description={`优惠前: ¥${order.originalAmount} | 实际支付: ¥${order.totalAmount} | 状态: ${order.status}`}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginUserInfo,
});

export default connect(mapStateToProps)(OrderPage);
