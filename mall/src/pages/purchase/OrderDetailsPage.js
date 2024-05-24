import React from 'react';
import { Card } from 'antd';

const order = {
  product: '小米12 Pro',
  price: '¥2999',
  status: '已支付',
};

const OrderDetailsPage = () => (
  <Card title="订单详情">
    <p>
      商品:
      {order.product}
    </p>
    <p>
      价格:
      {order.price}
    </p>
    <p>
      状态:
      {order.status}
    </p>
  </Card>
);

export default OrderDetailsPage;
