import React, { useState, useEffect } from 'react';
import {
  List, Card, Button, message, Descriptions, Avatar,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  reqGetAvailableCoupons, reqClaimCoupon, reqGetUserCoupons, reqGetOrders,
} from 'api';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  TagsOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  UserSwitchOutlined,
  HeartOutlined,
  StarOutlined,
  MessageOutlined, PlusOutlined,
} from '@ant-design/icons';
import { Space } from 'antd-mobile';
import IconFont from "./icons/IconFont";
import Meta from "antd/es/card/Meta";

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
    { title: '全部订单', icon: <IconFont style={{fontSize:70}} type={'icon-dingdan'}/> , status: 'all' },
    { title: '待付款', icon: <IconFont style={{fontSize:70}} type={'icon-daifukuan'}/>, status: '待付款' },
    { title: '待发货', icon: <IconFont style={{fontSize:70}} type={'icon-a-daifahuo2x'}/>, status: '待发货' },
    { title: '待收货', icon: <IconFont style={{fontSize:70}} type={'icon-daishouhuo'}/>, status: '待收货' },
    { title: '退换', icon: <IconFont style={{fontSize:70}} type={'icon-tuihuanshenqing'}/>, status: '退款/售后' },
    { title: '已取消', icon: <IconFont style={{fontSize:70}} type={'icon-yiquxiao'}/>, status: '已取消' },
  ];

  const otherItems = [
    { title: '地址管理', icon: <IconFont style={{fontSize:70}} type={'icon-dizhi'}/>, page: '/address' },
    { title: '我的足迹', icon: <IconFont style={{fontSize:70}} type={'icon-wodezuji'}/>, page: '/footprint' },
    { title: '我的关注', icon: <IconFont style={{fontSize:70}} type={'icon-wodewendawodeguanzhu'}/>, page: '/favorites' },
    { title: '我的收藏', icon: <IconFont style={{fontSize:70}} type={'icon-shoucang'}/>, page: '/favorite' },
    { title: '我的评价', icon: <IconFont style={{fontSize:70}} type={'icon-wodepingjia'}/>, page: '/reviews' },
  ];

  return (
      <div style={{backgroundColor:'#F4F5F9', padding:20,}}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {/*<div className="user-info">*/}
          {/*  <img src="user-avatar-url" alt="用户头像" />*/}
          {/*  <div>*/}
          {/*    <div>会员</div>*/}
          {/*    <div>*/}
          {/*      积分:*/}
          {/*      {' '}*/}
          {/*      {userInfo.points}*/}
          {/*      {' '}*/}
          {/*      成长值:*/}
          {/*      {' '}*/}
          {/*      {userInfo.growth}*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <Card bordered={false} style={{marginTop: 16, borderRadius:10 }}>
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
              borderRadius:20,
            }}
          >
            <h1 style={{fontSize:20, fontWeight:700}}>我的订单</h1>
            <List
                style={{width:'100%'}}
                grid={{ gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 6,
                  xxl: 3,}}
                dataSource={menuItems}
                renderItem={(item) => (
                    <List.Item>
                      <Card
                          bordered={false}
                          onClick={() => handleOrderClick(item.status)}
                          style={{ textAlign: 'center' }}
                      >
                        {item.icon}
                        <p style={{marginTop:20}}>{item.title}</p>
                      </Card>
                    </List.Item>
                )}
            />
          </Card>

          <Card
            bordered={false}
            style={{
              borderRadius:20,
            }}
          >
            <h1 style={{fontSize: 20, fontWeight: 700}}>更多功能</h1>
            <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 5,
                  xxl: 3,}}
                dataSource={otherItems}
                renderItem={(item) => (
                    <List.Item>
                      <Card
                          onClick={() => handlePageNavigation(item.page)}
                          bordered={false}
                          style={{textAlign:"center"}}
                      >
                        {item.icon}
                        <p style={{marginTop:20}} >{item.title}</p>
                      </Card>
                    </List.Item>
                )}
            />
          </Card>
          <Card bordered={false}
                style={{
                  borderRadius: 20,
                }}>
            <h1 style={{fontSize: 20, fontWeight: 700}}>待领取优惠券</h1>
            <List
                itemLayout="vertical"
                dataSource={availableCoupons}
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
                            <Descriptions.Item label="优惠金额">¥{coupon.discount}</Descriptions.Item>
                            <Descriptions.Item label="最低消费">¥{coupon.minSpend}</Descriptions.Item>
                            <Descriptions.Item label="有效期">{new Date(coupon.expiryDate).toLocaleDateString()}</Descriptions.Item>
                          </Descriptions>
                        </div>
                      </Card>
                    </List.Item>
                )}
            />
          </Card>
          <Card bordered={false}
                style={{
                  borderRadius: 20,
                }}>
            <h1 style={{fontSize: 20, fontWeight: 700}}>我的优惠券</h1>
            <List
                itemLayout="vertical"
                dataSource={userCoupons}
                renderItem={(coupon) => (
                    <List.Item key={coupon._id}>
                      <Card style={{borderRadius: 10}}>
                        <Descriptions title={`优惠券代码： ${coupon.code}`}
                                      column={{xxl: 4, xl: 4, lg: 2, md: 2, sm: 2, xs: 1}}>
                          <Descriptions.Item>优惠金额： ¥{coupon.discount}</Descriptions.Item>
                          <Descriptions.Item>最低消费： ¥{coupon.minSpend}</Descriptions.Item>
                          <Descriptions.Item>有效期：{new Date(coupon.expiryDate).toLocaleDateString()}</Descriptions.Item>
                          <Descriptions.Item>状态：{coupon.isClaimed ? '已领取' : '未领取'}</Descriptions.Item>
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
