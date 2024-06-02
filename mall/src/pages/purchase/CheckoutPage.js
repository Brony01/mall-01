import React, { useState, useEffect } from 'react';
import {Card, Button, message, List, Select, Typography, Divider} from 'antd';
import { withRouter } from 'react-router-dom';
import {reqConfirmOrder, reqGetUserCoupons, reqUseCoupon} from '../../api';
import { connect } from 'react-redux';
import {Space} from "antd-mobile";

const { Text } = Typography;
const { Option } = Select;

class CheckoutPage extends React.Component {
    state = {
        products: [],
        totalAmount: 0,
        originalAmount: 0,
        orderId: null,
        coupons: [],
        selectedCoupon: null,
        discount: 0
    };

    componentDidMount() {
        const { location } = this.props;
        if (location.state && location.state.products && location.state.products.length > 0) {
            this.setState({
                products: location.state.products,
                totalAmount: location.state.totalAmount,
                originalAmount: location.state.originalAmount,
                orderId: location.state.orderId
            });
            this.fetchUserCoupons();
        } else {
            message.error('未能获取订单信息，请返回购物车重新结算');
            this.props.history.push('/mainpage/cart');
        }
    }

    fetchUserCoupons = async () => {
        const { userInfo } = this.props;
        try {
            const res = await reqGetUserCoupons({ userId: userInfo._id });
            if (res.status === 0) {
                this.setState({ coupons: res.data });
            } else {
                message.error('获取用户优惠券失败');
            }
        } catch (error) {
            message.error('获取用户优惠券失败');
        }
    };

    handleConfirmPayment = async () => {
        const { orderId, selectedCoupon, totalAmount, discount } = this.state;
        const finalAmount = totalAmount - discount;
        try {
            const res = await reqConfirmOrder({ orderId, couponId: selectedCoupon, finalAmount });
            if (res.status === 0) {
                message.success('支付成功');
                await reqUseCoupon({ userId: this.props.userInfo._id, couponId: selectedCoupon });
                this.props.history.push({
                    pathname: '/order-confirmed',
                    state: {
                        totalAmount: finalAmount,
                        orderId: this.state.orderId,
                    }
                });
            } else {
                message.error('支付失败');
            }
        } catch (error) {
            message.error('支付失败');
        }
    };

    handleCouponChange = (value) => {
        const selectedCoupon = this.state.coupons.find(coupon => coupon._id === value);
        const discount = selectedCoupon ? selectedCoupon.discount : 0;
        this.setState({ selectedCoupon: value, discount });
    };

    handleBack = () => {
        this.props.history.push('/mainpage/cart');
    };

    render() {
        const { products, totalAmount, originalAmount, orderId, coupons, discount } = this.state;
        const finalAmount = totalAmount - discount;

        return (
            <Card title="支付页面">
                <p>订单号: {orderId}</p>
                <p>商品列表:</p>
                <ul>
                    {products.map((product, index) => (
                        <li key={index}>
                            <Space>
                                <img src={product.imgs[0]} alt={product.name}
                                     style={{width: '80px', marginRight: '10px'}}/>
                                <Space direction='vertical'>
                                    <span style={{fontWeight: 700}}>{product.name}</span>
                                    <span>描述: {product.desc}</span>
                                    <Space>
                                        <span>数量: {product.quantity}</span>
                                        <span>价格: ¥{product.price}</span>
                                    </Space>

                                </Space>
                            </Space>
                            <Divider/>
                            {/*名称: {product.name} - 数量: {product.quantity}件 - 价格: ¥{product.price} - 描述: {product.desc}*/}
                        </li>
                    ))}
                </ul>
                <Select
                    placeholder="选择优惠券"
                    style={{width: '100%', marginBottom: '1rem'}}
                    onChange={this.handleCouponChange}
                >
                    {coupons.map((coupon) => (
                        <Option key={coupon._id} value={coupon._id} disabled={originalAmount < coupon.minSpend}>
                            {coupon.code} -
                            满{coupon.minSpend}减{coupon.discount} (有效期: {new Date(coupon.expiryDate).toLocaleDateString()})
                        </Option>
                    ))}
                </Select>
                <Space direction='vertical'>
                    <span>优惠金额: ¥{discount}</span>
                    <span>应付金额: ¥{finalAmount}</span>
                </Space>
                <div style={{display: 'flex', justifyContent: 'space-between', margin: 20}}>
                    <Button type="default" onClick={this.handleBack}>返回购物车</Button>
                    <Button type="default" onClick={this.handleConfirmPayment}>确认支付</Button>
                </div>

            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginUserInfo,
});

export default connect(mapStateToProps)(withRouter(CheckoutPage));
