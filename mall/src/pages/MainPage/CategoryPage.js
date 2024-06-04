import React, { useState, useEffect, useRef } from 'react';
import { List, Card, message, Divider } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqCatagoryList } from 'api';
import { SideBar } from 'antd-mobile';
import 'antd-mobile/es/global';

const { Meta } = Card;

const CategoryPage = ({ history }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await reqCatagoryList({ parentId: '0' });
                if (res.status === 0) {
                    setCategories(res.data);
                    const firstCategory = res.data[0];
                    if (firstCategory) {
                        const subRes = await reqCatagoryList({ parentId: firstCategory._id });
                        if (subRes.status === 0) {
                            setSelectedCategory({ ...firstCategory, items: subRes.data });
                        } else {
                            message.error('获取子分类列表失败');
                        }
                    }
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
        console.log('Selected Category ID:', item._id); // 添加日志
        history.push({
            pathname: '/mainpage/products',
            state: { categoryId: item._id, pCategoryId: selectedCategory._id, from: 'category' },
        });
    };

    return (
        <div className="main-content">
            <div className="page-content" style={{ display: 'flex', marginRight: '5%', marginLeft: '5%', height: '100vh' }}>
                <SideBar
                    activeKey={selectedCategory?._id}
                    onChange={(key) => {
                        const category = categories.find(cat => cat._id === key);
                        handleCategoryClick(category);
                    }}
                    style={{
                        backgroundColor: 'white',
                        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                        width: '20%',
                        borderRadius: '4px',
                        overflowY: 'auto',
                    }}
                >
                    {categories.map(category => (
                        <SideBar.Item
                            key={category._id}
                            title={category.name}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                transition: 'background 0.3s, color 0.3s',
                                backgroundColor: selectedCategory?._id === category._id ? '#1890ff' : 'white',
                                color: selectedCategory?._id === category._id ? 'white' : 'rgba(0, 0, 0, 0.85)',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                marginBottom: '10px'
                            }}
                            onMouseEnter={e => {
                                if (selectedCategory?._id !== category._id) {
                                    e.currentTarget.style.backgroundColor = '#e6f7ff';
                                }
                            }}
                            onMouseLeave={e => {
                                if (selectedCategory?._id !== category._id) {
                                    e.currentTarget.style.backgroundColor = 'white';
                                }
                            }}
                        />
                    ))}
                </SideBar>
                <div style={{ width: '80%', padding: '0 10px', backgroundColor: 'white', overflowY: 'auto' }} ref={contentRef}>
                    {selectedCategory && (
                        <Card
                            bordered={false}
                            style={{ margin: '0' }}
                        >
                            <h1 style={{ fontSize: 20, fontWeight: 700 }}>{selectedCategory.name}</h1>
                            <Divider />
                            <List
                                grid={{ gutter: 16, xs: 2, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                                dataSource={selectedCategory.items || []}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Card
                                            hoverable={true}
                                            cover={<img style={{ borderRadius: 10 }} src={item.imageUrl} alt={item.name} />}
                                            style={{ borderRadius: 10 }}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <Meta
                                                title={<div style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12
                                                }}>
                                                    {item.name}
                                                </div>}
                                            />
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
