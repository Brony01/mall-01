import React, { useState, useEffect } from 'react';
import {List, Card, message, Divider} from 'antd';
import { withRouter } from 'react-router-dom';
import { reqCatagoryList } from 'api'; // 引入获取分类列表的请求
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import Meta from "antd/es/card/Meta";
// import 'react-pro-sidebar/dist/css/styles.css';

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
      <div className="main-content">
        <div className="page-content" style={{ display: 'flex', marginRight: '5%', marginLeft: '5%' }}>
          <Sidebar
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                width: '20%',
                padding: '10px',
                borderRadius: '4px',
                height: '100vh',
                position: 'sticky',
                top: 0
              }}
              backgroundColor={'rgb(255, 255, 255)'}
          >
            <Menu>
              {categories.map(category => (
                  <MenuItem
                      key={category._id}
                      onClick={() => handleCategoryClick(category)}
                      style={{
                        padding: '10px 20px',
                        margin: '10px 0',
                        borderRadius: '4px',
                        transition: 'background 0.3s, color 0.3s',
                        fontSize: '16px',
                        fontWeight: selectedCategory?._id === category._id ? 'bold' : 'normal',
                        backgroundColor: selectedCategory?._id === category._id ? '#e6f7ff' : 'transparent',
                        color: selectedCategory?._id === category._id ? '#1890ff' : 'rgba(0, 0, 0, 0.85)',
                      }}
                      onMouseEnter={e => {
                        e.target.style.backgroundColor = '#e6f7ff';
                      }}
                      onMouseLeave={e => {
                        e.target.style.backgroundColor = selectedCategory?._id === category._id ? '#e6f7ff' : 'transparent';
                      }}
                  >
                    {category.name}
                  </MenuItem>
              ))}
            </Menu>
          </Sidebar>
          <div style={{ width: '80%', padding: '0 10px', backgroundColor: 'white' }}>
            {selectedCategory && (
                <Card
                    bordered={false}
                    // title={selectedCategory.name}
                    style={{margin: '0'}}>
                    <h1 style={{fontSize: 20, fontWeight: 700}}>{selectedCategory.name}</h1>
                    <Divider/>
                    <List
                        grid={{gutter: 16, column: 4}}
                        dataSource={selectedCategory.items || []}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    hoverable={true}
                                    cover={<img style={{borderRadius: 10}} src={item.imageUrl}/>}
                                    // alt={item.name}
                                    style={{borderRadius: 10}}
                                    onClick={() => handleItemClick(item)}>
                                    <Meta title={item.name}
                                      style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                    }}
                                    ></Meta>
                                    {/*{item.name}*/}
                                </Card>
                            </List.Item>
                        )}
                    />
                </Card>
            )}
          </div>
        </div>
      </div>
  );
};

export default withRouter(CategoryPage);
