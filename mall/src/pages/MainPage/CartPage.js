import React, { useEffect, useState } from 'react';
import {
  Button, Card, Checkbox, InputNumber, List, message,
} from 'antd';
import { reqDeleteCartItem, reqGetCart, reqUpdateCart } from 'api';
import { connect } from 'react-redux';

const CartPage = ({ history, userInfo }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const userId = userInfo._id; // 从用户登录信息中获取
    const fetchCart = async () => {
      try {
        const res = await reqGetCart({ userId });
        setCartItems(res.data.products || []);
        setSelectedItems(new Array(res.data.products.length).fill(false));
      } catch (error) {
        message.error('获取购物车信息失败');
      }
    };

    fetchCart();
  }, [userInfo]);

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

    const { productId, name, desc } = newItems[index];
    const userId = userInfo._id; // 从用户登录信息中获取
    try {
      await reqUpdateCart({
        userId, productId, name, desc, quantity: value,
      });
      message.success('更新购物车成功');
    } catch (error) {
      message.error('更新购物车失败');
    }
  };

  const handleCheckout = () => {
    const selectedProducts = cartItems.filter((_, index) => selectedItems[index]);
    const totalAmount = selectedProducts.reduce((total, item) => total + item.price * item.quantity, 0);
    if (selectedProducts.length === 0) {
      message.warning('请选择至少一个商品');
      return;
    }
    history.push({
      pathname: '/checkout',
      state: { products: selectedProducts, totalAmount },
    });
  };

  const handleDeleteItem = (index) => async () => {
    const newItems = [...cartItems];
    const { productId } = newItems[index];
    const userId = userInfo._id; // 从用户登录信息中获取

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
            <Checkbox
              checked={selectedItems[index]}
              onChange={handleSelectItem(index)}
            >
              {item.title}
            </Checkbox>
            <div>
              名称:
              {item.name}
              {'  | '}
              单价:
              {item.price}
              {'  | '}
              数量:
              {item.quantity}
              {'  | '}
              描述:
              {item.desc}
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

const mapStateToProps = (state) => ({
  userInfo: state.loginUserInfo, // 从Redux store中获取用户信息
});

export default connect(mapStateToProps)(CartPage);
