import React from 'react';
import { Card, Button } from 'antd';
import { withRouter } from 'react-router-dom';

const OrderConfirmedPage = ({ history, location }) => {
  const handleHome = () => {
    history.push('/mainpage/home');
  };

  const handleOrders = () => {
    history.push({
      pathname: '/order-details',
      state: { orderId: location.state.orderId },
    });
  };

  const { totalAmount } = location.state || {};

  return (
    <Card title="订单确认">
      <p>您的订单已成功支付！</p>
      <p>
        支付金额: ¥
        {totalAmount}
      </p>
      <div>
        <Button type="primary" onClick={handleHome}>返回首页</Button>
        <Button type="default" onClick={handleOrders}>查看订单</Button>
      </div>
    </Card>
  );
};

export default withRouter(OrderConfirmedPage);
