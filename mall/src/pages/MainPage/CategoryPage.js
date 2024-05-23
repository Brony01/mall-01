import React from 'react';
import { List, Button, Card } from 'antd';

const categories = ['分类1', '分类2', '分类3', '分类4'];

const CategoryPage = () => (
  <Card title="分类">
    <List
      grid={{ gutter: 16, column: 2 }}
      dataSource={categories}
      renderItem={(item) => (
        <List.Item>
          <Button>{item}</Button>
        </List.Item>
      )}
    />
  </Card>
);

export default CategoryPage;
