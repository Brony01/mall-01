import React from 'react';
import { Card, List, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetProductDetails } from 'api'; // 新增请求以获取商品详情

const { Text } = Typography;

class OrderDetailsPage extends React.Component {
  state = {
    orders: this.props.location.state.orders || [],
    products: {}, // 存储商品详情的对象
  };

  componentDidMount() {
    this.fetchProductDetails();
  }

  fetchProductDetails = async () => {
    const { orders } = this.state;
    const productIds = orders.flatMap(order => order.products.map(product => product.productId));
    const uniqueProductIds = [...new Set(productIds)];

    try {
      const productDetails = await Promise.all(uniqueProductIds.map(id => reqGetProductDetails(id)));
      const products = productDetails.reduce((acc, detail) => {
        acc[detail.data._id] = detail.data;
        return acc;
      }, {});

      this.setState({ products });
    } catch (error) {
      console.error('获取商品详情失败', error);
    }
  };

  render() {
    const { orders, products } = this.state;

    return (
        <Card title="订单详情">
          {orders.length === 0 ? (
              <p>暂无订单</p>
          ) : (
              <List
                  itemLayout="vertical"
                  dataSource={orders}
                  renderItem={(order) => (
                      <List.Item key={order._id}>
                        <List.Item.Meta
                            title={`订单号: ${order._id}`}
                            description={`总金额: ¥${order.totalAmount} | 状态: ${order.status}`}
                        />
                        <List
                            dataSource={order.products}
                            renderItem={(product) => {
                              const productDetail = products[product.productId] || {};
                              return (
                                  <List.Item>
                                    <Text>{productDetail.name || product.productId}</Text>
                                    <Text> - {product.quantity}件</Text>
                                    <Text> - ¥{product.price}</Text>
                                    <Text>{productDetail.desc || ''}</Text>
                                  </List.Item>
                              );
                            }}
                        />
                      </List.Item>
                  )}
              />
          )}
        </Card>
    );
  }
}

export default withRouter(OrderDetailsPage);
