import React from 'react';
import { Card } from 'antd';
import { withRouter } from 'react-router-dom';

const OrderDetailsPage = ({ location }) => {
  const orders = location.state.orders || [];

  return (
    <Card title="订单详情">
      {orders.map((order, index) => (
        <div key={index}>
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
        </div>
      ))}
    </Card>
  );
};

export default withRouter(OrderDetailsPage);
