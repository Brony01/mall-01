import React from 'react';
import { Card, Button } from 'antd';

const order = {
  product: '小米12 Pro',
  price: '¥2999',
  status: '待支付',
};

const CheckoutPage = ({ history }) => {
  const handleConfirmPayment = () => {
    // 模拟支付成功
    history.push('/order-confirmed');
  };

  return (
    <Card title="支付页面">
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
      <Button type="primary" onClick={handleConfirmPayment}>确认支付</Button>
    </Card>
  );
};

export default CheckoutPage;
