import React from 'react';
import {
  Carousel, Input, Card, List, Button,
} from 'antd';

const { Search } = Input;

const hotItems = [
  { title: '小米12 Pro', price: '¥2999' },
  { title: 'Redmi K50', price: '¥2099' },
];

const HomePage = () => (
  <div>
    <Search placeholder="请输入商品名称" onSearch={(value) => console.log(value)} enterButton />

    <Carousel autoplay>
      <div><img src="轮播图1.png" alt="轮播图1" /></div>
      <div><img src="轮播图2.png" alt="轮播图2" /></div>
      <div><img src="轮播图3.png" alt="轮播图3" /></div>
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

    <div className="categories">
      <Button>专题</Button>
      <Button>活动</Button>
      <Button>优惠</Button>
      <Button>特惠</Button>
    </div>
  </div>
);

export default HomePage;
