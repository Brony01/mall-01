import React, { useState, useEffect } from 'react';
import { List, Card, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { reqGetFootprints } from 'api';

const FootprintPage = ({ history }) => {
  const [footprints, setFootprints] = useState([]);

  useEffect(() => {
    const fetchFootprints = async () => {
      const userId = '当前用户的ID'; // 从用户登录信息中获取
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
  }, []);

  const handleDetail = (productId) => {
    history.push({
      pathname: '/mainpage/product/detail',
      state: { productId },
    });
  };

  return (
    <Card title="我的足迹">
      <List
        dataSource={footprints}
        renderItem={(item) => (
          <List.Item onClick={() => handleDetail(item.productDetails._id)}>
            <Card title={item.productDetails.name}>
              {item.productDetails.desc}
              {' '}
              -
              {new Date(item.viewTime).toLocaleString()}
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default withRouter(FootprintPage);
