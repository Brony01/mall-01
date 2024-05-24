import React from 'react';
import {List, Card, Button, message} from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetOrders } from 'api';

class MyPage extends React.Component {
    state = {
        orders: [],
        userInfo: {
            points: 5000,
            growth: 1000,
            coupons: '暂无',
        },
    };

    componentDidMount() {
        this.fetchOrders();
    }

    fetchOrders = async () => {
        const userId = '当前用户的ID'; // 从用户登录信息中获取
        try {
            const res = await reqGetOrders({ userId });
            this.setState({ orders: res.data });
        } catch (error) {
            message.error('获取订单信息失败');
        }
    };

    handleOrderClick = (status) => {
        const { orders } = this.state;
        const filteredOrders = orders.filter((order) => order.status === status);
        this.props.history.push({
            pathname: '/order-details',
            state: { orders: filteredOrders },
        });
    };

    render() {
        const { userInfo } = this.state;

        const menuItems = [
            { title: '全部订单', icon: 'order-icon-url', status: 'all' },
            { title: '待付款', icon: 'payment-icon-url', status: '待付款' },
            { title: '待收货', icon: 'shipping-icon-url', status: '待收货' },
            { title: '退换售后', icon: 'aftersale-icon-url', status: '退款/售后' },
        ];

        const otherItems = [
            { title: '地址管理', icon: 'address-icon-url' },
            { title: '我的足迹', icon: 'footprint-icon-url' },
            { title: '我的关注', icon: 'favorites-icon-url' },
            { title: '我的收藏', icon: 'collection-icon-url' },
            { title: '我的评价', icon: 'reviews-icon-url' },
        ];

        return (
            <Card title="我的页面">
                <div className="user-info">
                    <img src="user-avatar-url" alt="用户头像" />
                    <div>
                        <div>会员</div>
                        <div>积分: {userInfo.points} 成长值: {userInfo.growth}</div>
                    </div>
                </div>
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={menuItems}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                title={item.title}
                                onClick={() => this.handleOrderClick(item.status)}
                            >
                                <img src={item.icon} alt={item.title} />
                            </Card>
                        </List.Item>
                    )}
                />
                <List
                    dataSource={otherItems}
                    renderItem={(item) => (
                        <List.Item>
                            <Card title={item.title}><img src={item.icon} alt={item.title} /></Card>
                        </List.Item>
                    )}
                />
            </Card>
        );
    }
}

export default withRouter(MyPage);
