import React, { Component } from 'react';
import { Button, Card, List, message, Typography } from 'antd';
import { reqCancelOrder, reqGetOrderDetails, reqUpdateOrder } from '../../api';
import { withRouter } from "react-router-dom";

const { Text } = Typography;

class OrderDetail extends Component {
  state = {
    orderId: this.props.location.state.order,
    order: {},
    products: [],
    loading: true,
  };

  componentDidMount() {
    const orderId = this.state.orderId;
    console.log(orderId);
    reqGetOrderDetails(orderId).then((res) => {
      if(res.status === 0){
        this.setState({
          order: res.data,
          products: res.data.products,
          loading: false,
        });
        console.log(res.data);
      } else {
        message.error('获取订单详情失败');
      }
    });
  }

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

  handleShipOrder = async () => {
    const { orderId } = this.state;
    try {
      const res = await reqUpdateOrder({ orderId, status: '待收货' });
      if (res.status === 0) {
        message.success('订单已发货');
        this.setState({ order: { ...this.state.order, status: '待收货' } });
      } else {
        message.error('发货失败');
      }
    } catch (error) {
      message.error('发货失败');
    }
  };

  render() {
    const { orderId, products, order } = this.state;

    return (
        <Card title={`订单号: ${orderId}`}>
          <List
              itemLayout="vertical"
              dataSource={products}
              renderItem={(product) => (
                  <List.Item key={product._id}>
                    <List.Item.Meta
                        title={`商品名：${product.name} | 商品描述：${product.desc}`}
                        description={`价格: ¥${product.price} | 数量: ${product.quantity}`}
                    />
                    <img src={product.imgs[0]} alt={product.name} style={{ width: '50px', marginTop: '10px' }} />
                  </List.Item>
              )}
          />
          <Text>原总金额: ¥{order.originalAmount}</Text>
          <br />
          <Text>折扣后总金额: ¥{order.totalAmount}</Text>
          <br />
          <br />
          <Text>订单状态: {order.status || '未知状态'}</Text>

          {order.status === '待发货' && (
              <>
                <Button type="primary" onClick={this.handleShipOrder}>发货</Button>
                <Button onClick={this.handleCancelOrder} style={{ marginLeft: 10 }}>取消订单</Button>
              </>
          )}
        </Card>
    );
  }
}

export default withRouter(OrderDetail);
