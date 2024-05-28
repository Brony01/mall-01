import React, { useState, useEffect } from 'react';
import {
  List, Card, Button, message,
} from 'antd';
import { withRouter } from 'react-router-dom';
import {
  reqGetAvailableCoupons, reqClaimCoupon, reqGetUserCoupons, reqGetOrders,
} from 'api';
import { connect } from 'react-redux';

const MyPage = ({ history, userInfo }) => {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [userCoupons, setUserCoupons] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAvailableCoupons();
    fetchUserCoupons();
    fetchOrders();
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const res = await reqGetAvailableCoupons();
      if (res.status === 0) {
        setAvailableCoupons(res.data);
      } else {
        message.error('获取可领取优惠券失败');
      }
    } catch (error) {
      message.error('获取可领取优惠券失败');
    }
  };

  const fetchUserCoupons = async () => {
    try {
      const res = await reqGetUserCoupons({ userId: userInfo._id });
      if (res.status === 0) {
        setUserCoupons(res.data);
      } else {
        message.error('获取用户优惠券失败');
      }
    } catch (error) {
      message.error('获取用户优惠券失败');
    }
  };

  const fetchOrders = async () => {
    const userId = userInfo._id;
    try {
      const res = await reqGetOrders({ userId });
      setOrders(res.data);
    } catch (error) {
      message.error('获取订单信息失败');
    }
  };

  const handleClaimCoupon = async (couponId) => {
    try {
      const res = await reqClaimCoupon({ userId: userInfo._id, couponId });
      if (res.status === 0) {
        message.success('优惠券领取成功');
        fetchAvailableCoupons();
        fetchUserCoupons();
      } else {
        message.error('领取优惠券失败');
      }
    } catch (error) {
      message.error('领取优惠券失败');
    }
  };

  const handleOrderClick = (status) => {
    const filteredOrders = status === 'all' ? orders : orders.filter((order) => {
      if (status === '退款/售后') {
        return order.status.includes('退款') || order.status.startsWith('售后处理中');
      }
      return order.status === status;
    });
    history.push({
      pathname: '/order',
      state: { orders: filteredOrders },
    });
  };

  const handlePageNavigation = (page) => {
    history.push(page);
  };

  const menuItems = [
    { title: '全部订单', icon: 'order-icon-url', status: 'all' },
    { title: '待付款', icon: 'payment-icon-url', status: '待付款' },
    { title: '待发货', icon: 'delivery-icon-url', status: '待发货' },
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
      </div>
      <Card title="可领取优惠券">
        <List
          itemLayout="vertical"
          dataSource={availableCoupons}
          renderItem={(coupon) => (
            <List.Item key={coupon._id}>
              <Card>
                <p>
                  优惠券代码:
                  {coupon.code}
                </p>
                <p>
                  优惠金额: ¥
                  {coupon.discount}
                </p>
                <p>
                  最低消费: ¥
                  {coupon.minSpend}
                </p>
                <p>
                  有效期:
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </p>
                <Button onClick={() => handleClaimCoupon(coupon._id)}>领取</Button>
              </Card>
            </List.Item>
          )}
        />
      </Card>
      <Card title="我的优惠券">
        <List
          itemLayout="vertical"
          dataSource={userCoupons}
          renderItem={(coupon) => (
            <List.Item key={coupon._id}>
              <Card>
                <p>
                  优惠券代码:
                  {coupon.code}
                </p>
                <p>
                  优惠金额: ¥
                  {coupon.discount}
                </p>
                <p>
                  最低消费: ¥
                  {coupon.minSpend}
                </p>
                <p>
                  有效期:
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </p>
                <p>{coupon.isClaimed ? '已领取' : '未领取'}</p>
              </Card>
            </List.Item>
          )}
        />
      </Card>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={menuItems}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.title}
              onClick={() => handleOrderClick(item.status)}
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
            <Card title={item.title} onClick={() => handlePageNavigation(item.page)}>
              <img src={item.icon} alt={item.title} />
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.loginUserInfo,
});

export default connect(mapStateToProps)(withRouter(MyPage));
