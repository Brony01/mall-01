import React from 'react';
import { Card, Button } from 'antd';

const OrderConfirmedPage = ({ history }) => (
  <Card title="支付成功">
    <p>您的订单已成功支付！</p>
    <Button type="primary" onClick={() => history.push('/orders')}>查看订单详情</Button>
  </Card>
);

export default OrderConfirmedPage;
