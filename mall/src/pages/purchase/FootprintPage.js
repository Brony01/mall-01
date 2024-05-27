import React, { useState, useEffect } from 'react';
import {
  List, Card, message, Button,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetFootprints } from 'api';
import { connect } from 'react-redux';
import { reqDeleteFootprintItem } from '../../api';

const FootprintPage = ({ history, userInfo }) => {
  const [footprints, setFootprints] = useState([]);

  useEffect(() => {
    const fetchFootprints = async () => {
      const userId = userInfo._id;
      try {
        const res = await reqGetFootprints({ userId });
        if (res.status === 0) {
          setFootprints(res.data || []);
        } else {
          message.error(res.msg || '获取足迹信息失败');
        }
      } catch (error) {
        message.error('获取足迹信息失败');
      }
    };

    fetchFootprints();
  }, [userInfo]);

  const handleDetail = (productId) => {
    history.push({
      pathname: '/mainpage/product/detail',
      state: { productId },
    });
  };

  const handleDelete = async (productId) => {
    const userId = userInfo._id;
    try {
      await reqDeleteFootprintItem({ userId, productId });
      setFootprints(footprints.filter((item) => item.productDetails._id !== productId));
      message.success('删除足迹商品成功');
    } catch (error) {
      message.error('删除足迹商品失败');
    }
  };

  return (
    <Card title="我的足迹">
      <List
        dataSource={footprints}
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
              {new Date(item.lastVisited).toLocaleString()}
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

export default connect(mapStateToProps)(withRouter(FootprintPage));
