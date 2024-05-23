import React from 'react';
import {
  Carousel, Input, Card, List,
} from 'antd';

const { Search } = Input;

const hotItems = [
  { title: '商品1', price: '¥100' },
  { title: '商品2', price: '¥200' },
  { title: '商品3', price: '¥300' },
];

const HomePage = () => (
  <div>
    <Search placeholder="搜索商品" onSearch={(value) => console.log(value)} enterButton />

    <Carousel autoplay>
      <div><h3>轮播图片1</h3></div>
      <div><h3>轮播图片2</h3></div>
      <div><h3>轮播图片3</h3></div>
    </Carousel>

    <Card title="热门商品">
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={hotItems}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title}>{item.price}</Card>
          </List.Item>
        )}
      />
    </Card>
  </div>
);

export default HomePage;
