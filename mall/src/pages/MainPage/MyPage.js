import React, { useState, useEffect } from 'react';
import {
  List, Card, Button, message, Descriptions, Avatar,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Space } from 'antd-mobile';
import Meta from 'antd/es/card/Meta';
import {
  reqGetAvailableCoupons, reqClaimCoupon, reqGetUserCoupons, reqGetOrders,
} from '../../api';
import IconFont from './icons/IconFont';
import './css/card.css';

const MyPage = ({ history, userInfo }) => {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [userCoupons, setUserCoupons] = useState([]);
  const [orders, setOrders] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const iconSize = windowWidth < 768 ? 30 : 50;
  const frontSize = windowWidth < 576 ? 13 : 18;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    { title: '全部', icon: <IconFont style={{ fontSize: iconSize }} type="icon-dingdan" />, status: 'all' },
    { title: '收货', icon: <IconFont style={{ fontSize: iconSize }} type="icon-daishouhuo" />, status: '待收货' },
    { title: '退换', icon: <IconFont style={{ fontSize: iconSize }} type="icon-tuihuanshenqing" />, status: '退款/售后' },
    { title: '待付款', icon: <IconFont style={{ fontSize: iconSize }} type="icon-daifukuan" />, status: '待付款' },
    { title: '待发货', icon: <IconFont style={{ fontSize: iconSize }} type="icon-a-daifahuo2x" />, status: '待发货' },
    { title: '已取消', icon: <IconFont style={{ fontSize: iconSize }} type="icon-yiquxiao" />, status: '已取消' },
  ];

  const otherItems = [
    // { title: '地址管理', icon: <IconFont style={{ fontSize: iconSize }} type="icon-dizhi" />, page: '/address' },
    { title: '足迹', icon: <IconFont style={{ fontSize: iconSize }} type="icon-wodezuji" />, page: '/footprint' },
    // { title: '我的关注', icon: <IconFont style={{ fontSize: iconSize }} type="icon-wodewendawodeguanzhu" />, page: '/favorites' },
    { title: '收藏', icon: <IconFont style={{ fontSize: iconSize }} type="icon-shoucang" />, page: '/favorite' },
    // { title: '我的评价', icon: <IconFont style={{ fontSize: iconSize }} type="icon-wodepingjia" />, page: '/reviews' },
  ];

  const unclaimedCoupons = availableCoupons.filter((coupon) => !coupon.isClaimed);
  const claimedCoupons = userCoupons.filter((coupon) => coupon.isClaimed);

  return (
    <div style={{ backgroundColor: '#F4F5F9', marginRight: ' 5% ', marginLeft: ' 5% ' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card bordered={false} style={{ marginTop: 16, borderRadius: 10, boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
          <Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
            title="会员"
            description={`积分： ${userInfo.points}   成长值：${userInfo.growth}`}
          />
        </Card>

        <Card
          bordered={false}
          style={{
            borderRadius: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>我的订单</h1>
          <List
            style={{ width: '100%' }}
            grid={{
              gutter: 16,
              xs: 3,
              sm: 4,
              md: 6,
              lg: 6,
              xl: 6,
              xxl: 6,
            }}
            dataSource={menuItems}
            renderItem={(item) => (
              <List.Item>
                <Card
                  bordered={false}
                  onClick={() => handleOrderClick(item.status)}
                  style={{ textAlign: 'center' }}
                >
                  {item.icon}
                  <p style={{ marginTop: 20 }}>{item.title}</p>
                </Card>
              </List.Item>
            )}
          />
        </Card>

        <Card
          bordered={false}
          style={{
            borderRadius: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>更多功能</h1>
          <List
            grid={{
              gutter: 16,
              xs: 3,
              sm: 4,
              md: 4,
              lg: 6,
              xl: 6,
              xxl: 6,
            }}
            dataSource={otherItems}
            renderItem={(item) => (
              <List.Item>
                <Card
                  onClick={() => handlePageNavigation(item.page)}
                  bordered={false}
                  style={{ textAlign: 'center', margin: '0px', padding: '0px' }}
                >
                  {item.icon}
                  <p style={{ marginTop: 20 }}>{item.title}</p>
                </Card>
              </List.Item>
            )}
          />
        </Card>
        <Card bordered={false} style={{ borderRadius: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>待领取优惠券</h1>
          <List
            itemLayout="vertical"
            dataSource={unclaimedCoupons}
            renderItem={(coupon) => (
              <List.Item key={coupon._id}>
                <Card style={{ borderRadius: 10, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 50, right: 30 }}>
                    <Button
                      onClick={() => handleClaimCoupon(coupon._id)}
                      icon="plus"
                      type="danger"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Descriptions title={`优惠券代码: ${coupon.code}`}>
                      <Descriptions.Item label="优惠金额">
                        ¥
                        {coupon.discount}
                      </Descriptions.Item>
                      <Descriptions.Item label="最低消费">
                        ¥
                        {coupon.minSpend}
                      </Descriptions.Item>
                      <Descriptions.Item label="有效期">{new Date(coupon.expiryDate).toLocaleDateString()}</Descriptions.Item>
                    </Descriptions>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Card>
        <Card bordered={false} style={{ borderRadius: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>我的优惠券</h1>
          <List
            itemLayout="vertical"
            dataSource={claimedCoupons}
            renderItem={(coupon) => (
              <List.Item key={coupon._id}>
                <Card style={{ borderRadius: 10 }}>
                  <Descriptions
                    title={`优惠券代码： ${coupon.code}`}
                    column={{
                      xxl: 4, xl: 4, lg: 2, md: 2, sm: 2, xs: 1,
                    }}
                  >
                    <Descriptions.Item>
                      优惠金额： ¥
                      {coupon.discount}
                    </Descriptions.Item>
                    <Descriptions.Item>
                      最低消费： ¥
                      {coupon.minSpend}
                    </Descriptions.Item>
                    <Descriptions.Item>
                      有效期：
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item>
                      状态：
                      {coupon.isClaimed ? '已领取' : '未领取'}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.loginUserInfo,
});

export default connect(mapStateToProps)(withRouter(MyPage));
