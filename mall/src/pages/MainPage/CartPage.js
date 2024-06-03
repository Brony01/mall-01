import React, { useEffect, useState } from 'react';
import {
  Button, Card, Checkbox, Divider, InputNumber, List, message,
} from 'antd';
import { connect } from 'react-redux';
import { reqDeleteCartItem, reqGetCart, reqUpdateCart, reqCreateOrder, reqClearCart } from '../../api';
import { withRouter } from "react-router-dom";
import { Space } from "antd-mobile";
import { SafetyCertificateFilled } from "@ant-design/icons";

const CartPage = ({ history, userInfo }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const userId = userInfo._id;
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
    const userId = userInfo._id;
    try {
      await reqUpdateCart({
        userId, productId, name, desc, quantity: value,
      });
      message.success('更新购物车成功');
    } catch (error) {
      message.error('更新购物车失败');
    }
  };

  const handleCheckout = async () => {
    const selectedProducts = cartItems.filter((_, index) => selectedItems[index]);
    const totalAmount = selectedProducts.reduce((total, item) => total + item.price * item.quantity, 0);
    const originalAmount = totalAmount;
    if (selectedProducts.length === 0) {
      message.warning('请选择至少一个商品');
      return;
    }
    try {
      const res = await reqCreateOrder({ userId: userInfo._id, products: selectedProducts, totalAmount, originalAmount });
      if (res.status === 0) {
        await reqClearCart({ userId: userInfo._id });
        setCartItems([]);
        setSelectedItems([]);
        history.push({
          pathname: '/checkout',
          state: { products: selectedProducts, totalAmount, orderId: res.data._id, originalAmount },
        });
      } else {
        message.error('创建订单失败');
      }
    } catch (error) {
      message.error('创建订单失败');
    }
  };

  const handleDeleteItem = (index) => async () => {
    const newItems = [...cartItems];
    const { productId } = newItems[index];
    const userId = userInfo._id;

    try {
      await reqDeleteCartItem({ userId, productId });
      newItems.splice(index, 1);
      setCartItems(newItems);
      message.success('删除购物车商品成功');
    } catch (error) {
      message.error('删除购物车商品失败');
    }
  };

  const handleItemClick = (productId) => {
    history.push({
      pathname: '/mainpage/product/detail',
      state: { productId },
    });
  };

  const totalPrice = cartItems.reduce((total, item, index) => {
    if (selectedItems[index]) {
      return total + item.price * item.quantity;
    }
    return total;
  }, 0);

  const title = (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>购物车</div>
        <Checkbox onChange={handleSelectAll}>全选</Checkbox>
      </div>
  );

  return (
      <Card title={title}>
        <List
            dataSource={cartItems}
            renderItem={(item, index) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <Space style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Space style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                            checked={selectedItems[index]}
                            onChange={handleSelectItem(index)}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                          {item.title}
                        </Checkbox>
                        <img src={item.imgs[0]} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                        <div onClick={() => handleItemClick(item.productId)}>
                          <span style={{ fontWeight: 700 }}>名称: {item.name}</span>
                          <br />
                          单价: {item.price}
                          <br />
                          数量: {item.quantity}
                        </div>
                      </Space>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Space direction="vertical" align="center">
                          <InputNumber
                              size="small"
                              style={{ width: 50 }}
                              min={1}
                              max={10}
                              value={item.quantity}
                              onChange={handleQuantityChange(index)}
                          />
                          <Button size='small' type="danger" onClick={handleDeleteItem(index)}>删除</Button>
                        </Space>
                      </div>
                    </Space>
                    <Divider />
                  </div>
                </List.Item>
            )}
        />
        <div className="cart-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>总价: {totalPrice} 元</div>
          <Button type="default" onClick={handleCheckout}>去结算</Button>
        </div>
      </Card>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.loginUserInfo,
});

export default connect(mapStateToProps)(withRouter(CartPage));
