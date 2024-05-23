import React from 'react';
import { List, Card } from 'antd';

const myInfo = [
  { title: '积分', value: '5000' },
  { title: '成长值', value: '1000' },
  { title: '优惠券', value: '暂无' },
];

const MyPage = () => (
  <Card title="我的页面">
    <List
      dataSource={myInfo}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta title={item.title} description={item.value} />
        </List.Item>
      )}
    />
  </Card>
);

export default MyPage;
