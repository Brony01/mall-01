import React from 'react';
import { List, Card, Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetOrders } from 'api';
import {connect} from "react-redux";

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
        const userId = this.props.userInfo._id; // 从用户登录信息中获取
        try {
            const res = await reqGetOrders({ userId });
            this.setState({ orders: res.data });
        } catch (error) {
            message.error('获取订单信息失败');
        }
    };

    handleOrderClick = (status) => {
        const { orders } = this.state;
        const filteredOrders = status === 'all' ? orders : orders.filter((order) => order.status === status);
        this.props.history.push({
            pathname: '/order',
            state: { orders: filteredOrders },
        });
    };

    handlePageNavigation = (page) => {
        this.props.history.push(page);
    };

    render() {
        const { userInfo } = this.state;

        const menuItems = [
            { title: '全部订单', icon: 'order-icon-url', status: 'all' },
            { title: '待付款', icon: 'payment-icon-url', status: '待付款' },
            { title: '待发货', icon: 'delivery-icon-url', status: '待发货'},
            { title: '待收货', icon: 'shipping-icon-url', status: '待收货' },
            { title: '退换售后', icon: 'aftersale-icon-url', status: '退款/售后' },
            { title: '已取消', icon: 'cancel-icon-url', status: '已取消' },
        ];

        const otherItems = [
            { title: '地址管理', icon: 'address-icon-url', page: '/address' },
            { title: '我的足迹', icon: 'footprint-icon-url', page: '/footprint' },
            { title: '我的关注', icon: 'favorites-icon-url', page: '/favorites' },
            { title: '我的收藏', icon: 'collection-icon-url', page: '/favorite' },
            { title: '我的评价', icon: 'reviews-icon-url', page: '/reviews' },
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
                    grid={{ gutter: 16, column: 5 }}
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
                            <Card title={item.title} onClick={() => this.handlePageNavigation(item.page)}>
                                <img src={item.icon} alt={item.title} />
                            </Card>
                        </List.Item>
                    )}
                />
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginUserInfo, // 从Redux store中获取用户信息
});

export default connect(mapStateToProps)(withRouter(MyPage));