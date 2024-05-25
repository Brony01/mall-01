import React, { useState, useEffect } from 'react';
import {
  Card, Button, List, Typography, message,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetProducts } from 'api';

const { Text } = Typography;

const ProductPage = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await reqGetProducts();
      if (res.status === 0) {
        setProducts(res.data);
      } else {
        message.error('获取商品列表失败');
      }
    } catch (error) {
      message.error('获取商品列表失败');
    }
    setLoading(false);
  };

  const handleDetail = (product) => {
    history.push({
      pathname: '/mainpage/product/detail',
      state: { productId: product._id },
    });
  };

  return (
    <Card title="商品列表">
      <List
        dataSource={products}
        renderItem={(product) => (
          <List.Item>
            <Card
              title={product.name}
              extra={<Button type="link" onClick={() => handleDetail(product)}>详情</Button>}
            >
              <Text>{product.desc}</Text>
              <Text>
                价格: ¥
                {product.price}
              </Text>
            </Card>
          </List.Item>
        )}
        loading={loading}
      />
    </Card>
  );
};

export default withRouter(ProductPage);
