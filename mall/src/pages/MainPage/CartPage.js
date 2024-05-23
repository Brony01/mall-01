import React from 'react';
import { List, Button, Card } from 'antd';

const cartItems = [
  { title: '小米12 Pro', price: '¥2999', quantity: 1 },
  { title: 'Redmi K50', price: '¥2099', quantity: 1 },
];

const CartPage = () => (
  <Card title="购物车">
    <List
      dataSource={cartItems}
      renderItem={(item) => (
        <List.Item actions={[<Button>-</Button>, <Button>+</Button>]}>
          <List.Item.Meta title={item.title} description={item.price} />
          <div>{item.quantity}</div>
        </List.Item>
      )}
    />
    <Button type="primary">去结算</Button>
  </Card>
);

export default CartPage;
