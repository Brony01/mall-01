import React from 'react';
import { Card, List, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetProductDetails, reqGetOrderDetails } from '../../api'; // 新增请求以获取商品详情

const { Text } = Typography;

class OrderDetailsPage extends React.Component {
  state = {
    orderId: this.props.location.state.orderId || '',
    order: {}, // 存储订单详情的对象
    products: [], // 存储订单中的商品
  };

  componentDidMount() {
    this.fetchProductDetails();
  }

  fetchProductDetails = async () => {
    if (this.state.orderId) {
      const orderId = this.state.orderId;
      const res = await reqGetOrderDetails(orderId);

      if (res.status === 0) {
        this.setState({ order: res.data });
      }
    }

    console.log(this.state.order)

    const products = this.state.order.products;
    this.setState({ products: products })

  };

  render() {
    const { orderId, products } = this.state;
    console.log(products)

    return (
      <Card title={`订单号: ${orderId}`}>
        <List
          itemLayout="vertical"
          dataSource={products}
          renderItem={(product) => (
            <List.Item key={product._id}>
              <List.Item.Meta
                title={product.name}
                description={`价格: ¥${product.price} | 数量: ${product.quantity}`}
              />
            </List.Item>
          )}
        />
        <Text>总金额: ¥{products.reduce((total, product) => total + product.price * product.quantity, 0)}</Text>
      </Card>
    );
  }
}

export default withRouter(OrderDetailsPage);
