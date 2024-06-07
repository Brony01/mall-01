import React from 'react';
import {Button, Card, List, message, Typography, Modal, Radio, Divider} from 'antd';
import { withRouter } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { reqCancelOrder, reqConfirmReceipt, reqCreateOrder, reqGetOrderDetails, reqRequestAfterSales, reqUpdateOrder } from '../../api';
import { connect } from "react-redux";
import {NavBar, Space} from "antd-mobile";

const { Text } = Typography;
const { confirm } = Modal;

class OrderDetailsPage extends React.Component {
    state = {
        orderId: this.props.location.state.orderId || '',
        order: {}, // 存储订单详情的对象
        products: [], // 存储订单中的商品
        afterSalesType: '', // 选择的售后类型
    };

    componentDidMount() {
        this.fetchOrderDetails();
    }

    fetchOrderDetails = async () => {
        const { orderId } = this.state;
        if (orderId) {
            const res = await reqGetOrderDetails(orderId);
            if (res.status === 0) {
                this.setState({ order: res.data, products: res.data.products });
            } else {
                message.error('获取订单详情失败');
            }
        }
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    handlePayment = () => {
        const { products, orderId } = this.state;
        const totalAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);

        this.props.history.push({
            pathname: '/checkout',
            state: { products, totalAmount, orderId },
        });
    };

    handleCancelOrder = async () => {
        const { orderId } = this.state;
        const res = await reqCancelOrder({ orderId });
        if (res.status === 0) {
            message.success('订单已取消');
            this.setState({ order: { ...this.state.order, status: '已取消' } });
        } else {
            message.error(res.msg || '取消订单失败');
        }
    };

    handleConfirmReceipt = async () => {
        const { orderId } = this.state;
        try {
            const res = await reqUpdateOrder({ orderId, status: '交易成功' });
            if (res.status === 0) {
                message.success('已确认收货');
                this.setState({ order: { ...this.state.order, status: '交易成功' } });
            } else {
                message.error('确认收货失败');
            }
        } catch (error) {
            message.error('确认收货失败');
        }
    };

    handleRequestAfterSales = () => {
        confirm({
            title: '选择售后类型',
            content: (
                <Radio.Group onChange={(e) => this.setState({ afterSalesType: e.target.value })}>
                    <Radio value="仅退款">仅退款</Radio>
                    <Radio value="退货退款">退货退款</Radio>
                </Radio.Group>
            ),
            onOk: async () => {
                const { orderId, afterSalesType } = this.state;
                try {
                    const res = await reqUpdateOrder({ orderId, status: `售后处理中(${afterSalesType})` });
                    if (res.status === 0) {
                        message.success('售后请求已提交');
                        this.setState({ order: { ...this.state.order, status: `售后处理中(${afterSalesType})` } });
                    } else {
                        message.error('售后请求提交失败');
                    }
                } catch (error) {
                    message.error('售后请求提交失败');
                }
            },
            onCancel() {
                message.info('取消售后请求');
            },
        });
    };

    handleReorder = async () => {
        const { products } = this.state;
        const { userInfo } = this.props;
        const totalAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);

        if (products.length === 0) {
            message.warning('没有商品可以重新下单');
            return;
        }

        try {
            const res = await reqCreateOrder({ userId: userInfo._id, products, totalAmount });
            if (res.status === 0) {
                this.props.history.push({
                    pathname: '/checkout',
                    state: { products, totalAmount, orderId: res.data._id },
                });
            } else {
                message.error('重新下单失败');
            }
        } catch (error) {
            message.error('重新下单失败');
        }
    };

    render() {
        const { orderId, products, order } = this.state;

        const totalAmount = order.originalAmount;
        const finalAmount = order.totalAmount;

        return (
            <div style={{backgroundColor:'white', height:'100vh'}}>
                <NavBar onBack={this.handleBack} style={{ fontSize: 25, fontWeight:700 }}>{`订单号: ${orderId}`}</NavBar>
                <div style={{ padding:'0 5%' }}>
                    {/*<ArrowLeftOutlined onClick={}  />*/}
                    <List
                        itemLayout="vertical"
                        dataSource={products}
                        renderItem={(product) => (
                            <List.Item key={product._id}>
                                <Card
                                    bordered={false}
                                    style={{width:'100%', borderRadius:15}}>
                                    <Space >
                                        <div>
                                            <img src={product.imgs[0]} alt={product.name} style={{ width: '80px'}}/>
                                        </div>
                                        <div>
                                            <span style={{fontSize:20, fontWeight:700, color:'black'}}>{`${product.name}`}</span>
                                            <br/>
                                            <span style={{fontSize:16, fontWeight:500}}>{`${product.desc}`}</span>
                                            <br/>
                                            <span>{`价格: ¥${product.price} | 数量: ${product.quantity}`}</span>
                                        </div>
                                    </Space>
                                </Card>
                                <Divider/>
                            </List.Item>
                        )}
                    />
                    <div style={{textAlign: 'right'}}>
                        <span>总金额: ¥{totalAmount}</span>
                        <br/>
                        <span>优惠金额: ¥{totalAmount - finalAmount}</span>
                        <br/>
                        <span>应付金额: ¥{finalAmount}</span>
                        <br/>
                        <span>订单状态: {order.status || '未知状态'}</span>
                        <br/>
                    </div>


                    {order.status === '待付款' && (
                        <>
                            <Button type="primary" onClick={this.handlePayment}>去支付</Button>
                            <Button onClick={this.handleCancelOrder} style={{marginLeft: 10 }}>取消订单</Button>
                        </>
                    )}
                    {order.status === '待收货' && (
                        <>
                            <Button type="primary" onClick={this.handleConfirmReceipt}>确认收货</Button>
                            <Button onClick={this.handleRequestAfterSales} style={{ marginLeft: 10 }}>售后</Button>
                        </>
                    )}
                    {order.status === '交易成功' && (
                        <Button type="primary" onClick={this.handleRequestAfterSales}>售后</Button>
                    )}
                    {(order.status && order.status.includes('未通过')) && (
                        <Button type="primary" onClick={this.handleRequestAfterSales}>再次申请售后</Button>
                    )}
                    {(order.status && order.status.includes('通过')) && null}
                    {order.status === '已取消' && (
                        <Button type="primary" onClick={this.handleReorder}>重新下单</Button>
                    )}
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginUserInfo,
});

export default withRouter(connect(mapStateToProps)(OrderDetailsPage));
