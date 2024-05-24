import React, { useState, useEffect } from 'react';
import {
  List, Button, Card, Checkbox, InputNumber, message,
} from 'antd';
import { reqGetCart, reqUpdateCart, reqDeleteCartItem } from 'api';

const CartPage = ({ history }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const userId = '当前用户的ID'; // 从用户登录信息中获取
      try {
        const res = await reqGetCart({ userId });
        setCartItems(res.data.products || []);
        setSelectedItems(new Array(res.data.products.length).fill(false));
      } catch (error) {
        message.error('获取购物车信息失败');
      }
    };

    fetchCart();
  }, []);

  const handleSelectAll = (e) => {
    setSelectedItems(cartItems.map(() => e.target.checked));
  };

  const handleSelectItem = (index) => (e) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = e.target.checked;
    setSelectedItems(newSelectedItems);
  };

  const handleQuantityChange = (index) => async (value) => {
    const newItems = [...cartItems];
    newItems[index].quantity = value;
    setCartItems(newItems);

    const { productId } = newItems[index];
    const userId = '当前用户的ID'; // 从用户登录信息中获取
    try {
      await reqUpdateCart({ userId, productId, quantity: value });
      message.success('更新购物车成功');
    } catch (error) {
      message.error('更新购物车失败');
    }
  };

  const handleCheckout = () => {
    history.push('/checkout');
  };

  const handleDeleteItem = (index) => async () => {
    const newItems = [...cartItems];
    const { productId } = newItems[index];
    const userId = '当前用户的ID'; // 从用户登录信息中获取

    try {
      await reqDeleteCartItem({ userId, productId });
      newItems.splice(index, 1);
      setCartItems(newItems);
      message.success('删除购物车商品成功');
    } catch (error) {
      message.error('删除购物车商品失败');
    }
  };

  const totalPrice = cartItems.reduce((total, item, index) => {
    if (selectedItems[index]) {
      return total + item.price * item.quantity;
    }
    return total;
  }, 0);

  return (
    <Card title="购物车">
      <Checkbox onChange={handleSelectAll}>全选</Checkbox>
      <List
        dataSource={cartItems}
        renderItem={(item, index) => (
          <List.Item actions={[
            <InputNumber min={1} max={10} value={item.quantity} onChange={handleQuantityChange(index)} />,
            <Button type="link" onClick={handleDeleteItem(index)}>删除</Button>,
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
        <Button type="primary" onClick={handleCheckout}>去结算</Button>
      </div>
    </Card>
  );
};

export default CartPage;
