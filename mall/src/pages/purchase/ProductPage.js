import React from 'react';
import { Card, Button } from 'antd';

const product = {
  title: '小米12 Pro',
  price: '¥2999',
  description: '高性能手机，适合各种需求',
};

const ProductPage = ({ history }) => {
  const handleBuyNow = () => {
    // 创建订单并跳转到支付页面
    history.push('/checkout');
  };

  return (
    <Card title={product.title}>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <Button type="primary" onClick={handleBuyNow}>立即购买</Button>
    </Card>
  );
};

export default ProductPage;
