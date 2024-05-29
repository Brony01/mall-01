import React, { useState, useEffect } from 'react';
import { List, Card, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqCatagoryList } from 'api'; // 引入获取分类列表的请求

const CategoryPage = ({ history }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // 获取一级分类列表
    const fetchCategories = async () => {
      try {
        const res = await reqCatagoryList({ parentId: '0' });
        if (res.status === 0) {
          setCategories(res.data);
          setSelectedCategory(res.data[0]);
        } else {
          message.error('获取分类列表失败');
        }
      } catch (error) {
        message.error('获取分类列表失败');
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    try {
      const res = await reqCatagoryList({ parentId: category._id });
      if (res.status === 0) {
        setSelectedCategory({ ...category, items: res.data });
      } else {
        message.error('获取子分类列表失败');
      }
    } catch (error) {
      message.error('获取子分类列表失败');
    }
  };

  const handleItemClick = (item) => {
    history.push({
      pathname: '/mainpage/products',
      state: { categoryId: item._id },
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '20%' }}>
        <List
          dataSource={categories}
          renderItem={(category) => (
            <List.Item onClick={() => handleCategoryClick(category)}>
              <div>{category.name}</div>
            </List.Item>
          )}
        />
      </div>
      <div style={{ width: '80%' }}>
        {selectedCategory && (
          <Card title={selectedCategory.name}>
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={selectedCategory.items || []}
              renderItem={(item) => (
                <List.Item>
                  <Card onClick={() => handleItemClick(item)}>{item.name}</Card>
                </List.Item>
              )}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default withRouter(CategoryPage);
