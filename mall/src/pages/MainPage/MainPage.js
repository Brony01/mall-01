import React from 'react';
import {
  Carousel, Input, Card, List, Button,
} from 'antd';

const { Search } = Input;

class MainPage extends React.Component {
  render() {
    const hotItems = [
      { title: '商品1', price: '¥100' },
      { title: '商品2', price: '¥200' },
      { title: '商品3', price: '¥300' },
    ];

    const categories = ['分类1', '分类2', '分类3', '分类4'];

    return (
      <div>
        {/* 搜索框 */}
        <Search placeholder="搜索商品" onSearch={(value) => console.log(value)} enterButton />

        {/* 轮播图 */}
        <Carousel autoplay>
          <div><h3>轮播图片1</h3></div>
          <div><h3>轮播图片2</h3></div>
          <div><h3>轮播图片3</h3></div>
        </Carousel>

        {/* 热门商品 */}
        <Card title="热门商品">
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={hotItems}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.title}>{item.price}</Card>
              </List.Item>
            )}
          />
        </Card>

        {/* 分类索引 */}
        <Card title="分类">
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={categories}
            renderItem={(item) => (
              <List.Item>
                <Button>{item}</Button>
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  }
}

export default MainPage;
