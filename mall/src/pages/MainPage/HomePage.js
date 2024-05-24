import React from 'react';
import {
  Carousel, Input, Card, List, Button,
} from 'antd';
import { withRouter } from 'react-router-dom';
import specialIcon from './icons/special.png'; // 假设你将图标保存到此路径
import eventIcon from './icons/special.png';
import discountIcon from './icons/special.png';
import promotionIcon from './icons/special.png';

const { Search } = Input;

const hotItems = [
  { title: '小米12 Pro', price: '¥2999' },
  { title: 'Redmi K50', price: '¥2099' },
];

const HomePage = ({ history }) => {
  const handleSearch = (value) => {
    history.push({
      pathname: '/mainpage/products',
      state: { searchText: value },
    });
  };

  return (
    <div>
      <Search placeholder="请输入商品名称 如: 手机" onSearch={handleSearch} enterButton />

      <Carousel autoplay>
        <div><img src="轮播图1.png" alt="轮播图1" /></div>
        <div><img src="轮播图2.png" alt="轮播图2" /></div>
        <div><img src="轮播图3.png" alt="轮播图3" /></div>
      </Carousel>

      <div className="categories">
        <Button icon={<img src={specialIcon} alt="专题" />}>专题</Button>
        <Button icon={<img src={eventIcon} alt="活动" />}>活动</Button>
        <Button icon={<img src={discountIcon} alt="优惠" />}>优惠</Button>
        <Button icon={<img src={promotionIcon} alt="特惠" />}>特惠</Button>
      </div>

      <Card title="品牌制造商直供">
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
};

export default withRouter(HomePage);
