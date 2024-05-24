import React from 'react';
import { List, Card } from 'antd';

const myInfo = [
  { title: '积分', value: '5000' },
  { title: '成长值', value: '1000' },
  { title: '优惠券', value: '暂无' },
];

const MyPage = () => {
  const menuItems = [
    { title: '全部订单', icon: 'order-icon-url' },
    { title: '待付款', icon: 'payment-icon-url' },
    { title: '待收货', icon: 'shipping-icon-url' },
    { title: '退换售后', icon: 'aftersale-icon-url' },
  ];

  const otherItems = [
    { title: '地址管理', icon: 'address-icon-url' },
    { title: '我的足迹', icon: 'footprint-icon-url' },
    { title: '我的关注', icon: 'favorites-icon-url' },
    { title: '我的收藏', icon: 'collection-icon-url' },
    { title: '我的评价', icon: 'reviews-icon-url' },
  ];

  return (
    <Card title="我的页面">
      <div className="user-info">
        <img src="user-avatar-url" alt="用户头像" />
        <div>
          <div>会员</div>
          <div>积分: 5000 成长值: 1000</div>
        </div>
      </div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={menuItems}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title}><img src={item.icon} alt={item.title} /></Card>
          </List.Item>
        )}
      />
      <List
        dataSource={otherItems}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title}><img src={item.icon} alt={item.title} /></Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default MyPage;
