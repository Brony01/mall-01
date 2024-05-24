import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  List, Card, Button, message,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetFavorites, reqDeleteFavoriteItem } from 'api';

const FavoritePage = ({ history, userInfo }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await reqGetFavorites({ userId: userInfo._id });
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
  }, [userInfo._id]);

  const handleDetail = (productId) => {
    history.push({
      pathname: `/mainpage/product/detail/${productId}`,
    });
  };

  const handleDelete = async (productId) => {
    try {
      await reqDeleteFavoriteItem({ userId: userInfo._id, productId });
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
