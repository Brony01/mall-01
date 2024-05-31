import React, { useState, useEffect } from 'react';
import {
  List, Card, Button, message,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetFavorites, reqDeleteFavoriteItem } from 'api';
import { connect } from 'react-redux';

const FavoritePage = ({ history, userInfo }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = userInfo._id; // 从用户登录信息中获取
      try {
        const res = await reqGetFavorites({ userId });
        if (res.status === 0) {
          setFavorites(res.data || []);
        } else {
          message.error(res.msg || '获取收藏信息失败');
        }
      } catch (error) {
        message.error('获取收藏信息失败');
      }
    };

    fetchFavorites();
  }, [userInfo]);

  const handleDetail = (productId) => {
    history.push({
      pathname: '/mainpage/product/detail/',
      state: { productId },
    });
  };

  const handleDelete = async (productId) => {
    const userId = userInfo._id; // 从用户登录信息中获取
    try {
      await reqDeleteFavoriteItem({ userId, productId });
      setFavorites(favorites.filter((item) => item.productDetails._id !== productId));
      message.success('删除收藏商品成功');
    } catch (error) {
      message.error('删除收藏商品失败');
    }
  };

  return (
      <Card title="我的收藏">
        <List
            dataSource={favorites}
            renderItem={(item) => (
                <List.Item>
                  <Card
                      title={item.productDetails.name}
                      actions={[
                        <Button type="link" onClick={() => handleDetail(item.productDetails._id)}>详情</Button>,
                        <Button type="link" onClick={() => handleDelete(item.productDetails._id)}>删除</Button>,
                      ]}
                  >
                    {item.productDetails.desc}
                    {' '}
                    -
                    {new Date(item.addTime).toLocaleString()}
                    <br />
                    <img src={item.productDetails.imgs[0]} alt={item.productDetails.name} style={{ width: '50px', marginTop: '10px' }} />
                  </Card>
                </List.Item>
            )}
        />
      </Card>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.loginUserInfo, // 从Redux store中获取用户信息
});

export default connect(mapStateToProps)(withRouter(FavoritePage));
