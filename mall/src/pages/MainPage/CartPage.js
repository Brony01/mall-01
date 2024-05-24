import React, { useState } from 'react';
import {
  List, Button, Card, Checkbox, InputNumber,
} from 'antd';

const cartItems = [
  { title: '小米12 Pro', price: 2999, quantity: 1 },
  { title: 'Redmi K50', price: 2099, quantity: 1 },
];

const CartPage = () => {
  const [selectedItems, setSelectedItems] = useState(cartItems.map(() => false));
  const [items, setItems] = useState(cartItems);

  const handleSelectAll = (e) => {
    setSelectedItems(items.map(() => e.target.checked));
  };

  const handleSelectItem = (index) => (e) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = e.target.checked;
    setSelectedItems(newSelectedItems);
  };

  const handleQuantityChange = (index) => (value) => {
    const newItems = [...items];
    newItems[index].quantity = value;
    setItems(newItems);
  };

  const totalPrice = items.reduce((total, item, index) => {
    if (selectedItems[index]) {
      return total + item.price * item.quantity;
    }
    return total;
  }, 0);

  return (
    <Card title="购物车">
      <Checkbox onChange={handleSelectAll}>全选</Checkbox>
      <List
        dataSource={items}
        renderItem={(item, index) => (
          <List.Item actions={[
            <InputNumber min={1} max={10} value={item.quantity} onChange={handleQuantityChange(index)} />,
          ]}
          >
            <Checkbox checked={selectedItems[index]} onChange={handleSelectItem(index)}>{item.title}</Checkbox>
            <div>
              {item.price}
              {' '}
              x
              {' '}
              {item.quantity}
            </div>
          </List.Item>
        )}
      />
      <div className="cart-footer">
        <div>
          总价:
          {totalPrice}
          {' '}
          元
        </div>
        <Button type="primary">去结算</Button>
      </div>
    </Card>
  );
};

export default CartPage;
