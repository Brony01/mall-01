import React from 'react';
import { Card, List, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { ArrowLeftOutlined } from "@ant-design/icons";

class OrderPage extends React.Component {
  state = {
    orders: [],
  };

  componentDidMount() {
    const { location } = this.props;
    const orders = location.state && location.state.orders;
    if (orders) {
      this.setState({ orders });
    }
  }

  handleOrderClick = (orderId) => {
    // 在这里执行你想要的操作，例如跳转到一个详细的订单页面
    this.props.history.push({
      pathname: '/order-details',
      state: { orderId },
    });
  };

  handleBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { orders } = this.state;

    return (
        <div>
          <ArrowLeftOutlined onClick={this.handleBack} style={{ fontSize: 25 }} />
          <Card title="所有订单">
            <List
                itemLayout="vertical"
                dataSource={orders}
                renderItem={(order) => (
                    <List.Item key={order._id} onClick={() => this.handleOrderClick(order._id)}>
                      <List.Item.Meta
                          title={`订单号: ${order._id}`}
                          description={`总金额: ¥${order.totalAmount} | 状态: ${order.status}`}
                      />
                    </List.Item>
                )}
            />
          </Card>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.loginUserInfo,
});

export default connect(mapStateToProps)(OrderPage);
