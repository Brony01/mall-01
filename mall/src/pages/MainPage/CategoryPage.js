import React, { useState } from 'react';
import { List, Card } from 'antd';

const categories = [
  { title: '服装', items: ['上衣', '裤子', '鞋子'] },
  { title: '手机数码', items: ['手机', '平板', '配件'] },
  { title: '家用电器', items: ['冰箱', '洗衣机', '空调'] },
  { title: '家具家装', items: ['沙发', '床', '桌椅'] },
  { title: '汽车用品', items: ['导航', '配件', '工具'] },
  { title: '电脑办公', items: ['笔记本', '台式机', '打印机'] },
];

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '20%' }}>
        <List
          dataSource={categories}
          renderItem={(category) => (
            <List.Item onClick={() => setSelectedCategory(category)}>
              <div>{category.title}</div>
            </List.Item>
          )}
        />
      </div>
      <div style={{ width: '80%' }}>
        <Card title={selectedCategory.title}>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={selectedCategory.items}
            renderItem={(item) => (
              <List.Item>
                <Card>{item}</Card>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default CategoryPage;
