import React, { useState, useEffect } from 'react';
import {
  Carousel, Input, Card, List, Button,
  Tabs, message,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { Space, Swiper } from 'antd-mobile';
import {
  reqHotProducts, reqCouponStatus, reqSeckillProducts, reqInitCoupon,
} from 'api';
import Meta from 'antd/es/card/Meta';
import { connect } from 'react-redux';

const { Search } = Input;
const { TabPane } = Tabs;

const HomePage = ({ history, userInfo }) => {
  const [hotItems, setHotItems] = useState([]);
  const [couponStatus, setCouponStatus] = useState({ hasUnclaimed: false, hasUnused: false });
  const [seckillItems, setSeckillItems] = useState({ ongoing: [], upcoming: [] });

  const handleInitCoupons = async () => {
    try {
      const res = await reqInitCoupon({ userId: userInfo._id });
      if (res.status === 0) {
        message.success('初始化优惠券成功');
      } else {
        message.error('初始化优惠券失败');
      }
    } catch (error) {
      message.error('初始化优惠券失败');
    }
  };

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const res = await reqHotProducts();
        if (res.status === 0) {
          setHotItems(res.data);
        } else {
          message.error('获取热门商品失败');
        }
      } catch (error) {
        message.error('获取热门商品失败');
      }
    };

    const fetchCouponStatus = async () => {
      const userId = userInfo._id;
      try {
        const res = await reqCouponStatus(userId);
        if (res.status === 0) {
          setCouponStatus(res.data);
        } else {
          message.error('获取优惠券状态失败');
        }
      } catch (error) {
        message.error('获取优惠券状态失败');
      }
    };

    const fetchSeckillProducts = async () => {
      try {
        const res = await reqSeckillProducts();
        if (res.status === 0) {
          setSeckillItems(res.data);
        } else {
          message.error('获取秒杀商品失败');
        }
      } catch (error) {
        message.error('获取秒杀商品失败');
      }
    };

    fetchHotProducts();
    fetchCouponStatus();
    fetchSeckillProducts();

    const intervalId = setInterval(() => {
      fetchSeckillProducts();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (value) => {
    history.push({
      pathname: '/mainpage/products',
      state: { searchText: value },
    });
  };

  const handleCouponClick = () => {
    history.push('/mainpage/my');
  };

  const formatTimeLeft = (endTime) => {
    const totalSeconds = Math.floor((new Date(endTime) - new Date()) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}小时 ${minutes}分钟 ${seconds}秒`;
  };

  const handleItemClick = (productId) => {
    history.push({
      pathname: '/mainpage/product/detail',
      state: { productId },
    });
  };

  return (
      <div style={{ marginRight: ' 5% ', marginLeft: ' 5% ' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Swiper autoplay style={{ borderRadius: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.2)',}}>
            <Swiper.Item key={1}>
              <div>
                <img
                    src="https://res.vmallres.com/uomcdn/CN/cms/202405/ee061dafcb20437aa6e58e174e235c2c.jpg"
                    alt="HUAWEI Pura70系列"
                />
              </div>
            </Swiper.Item>
            <Swiper.Item key={2}>
              <div>
                <img
                    src="https://res.vmallres.com/uomcdn/CN/cms/2024-05/5495c7a8405d47998f9804521dd500f8.jpg"
                    alt="华为Vision智慧屏4"
                />
              </div>
            </Swiper.Item>
            <Swiper.Item key={3}>
              <div>
                <img
                    src="https://res.vmallres.com/uomcdn/CN/cms/2024-05/f1a956d19f5c44a7ab1f2a23db1eeae0.jpg"
                    alt="HUAWEI MateBook X Pro"
                />
              </div>
            </Swiper.Item>
          </Swiper>
          <Card bordered={false} title="优惠券" style={{ borderRadius: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.2)',}}>
            <List>
              {couponStatus.hasUnclaimed && (
                  <List.Item onClick={handleCouponClick}>
                    <div>有未领取的优惠券</div>
                  </List.Item>
              )}
              {couponStatus.hasUnused && (
                  <List.Item onClick={handleCouponClick}>
                    <div>有未使用的优惠券</div>
                  </List.Item>
              )}
              <List.Item onClick={handleCouponClick}>
                <Button type="link">查看详情</Button>
              </List.Item>
              <List.Item onClick={handleInitCoupons}>
                <Button type="link">初始化优惠券</Button>
              </List.Item>
            </List>
          </Card>
          <Card bordered={false} style={{ borderRadius: 20, boxShadow: '2px 0 5px rgba(0,0,0,0.1)', }}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>正在进行的秒杀</h1>
            <List
                grid={{ gutter: 16, xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 4,
                  xxl: 3, }}
                dataSource={seckillItems.ongoing}
                renderItem={(item) => (
                    <List.Item>
                      <Card
                          cover={<img alt="product" src={item.imgs[0]} />}
                          title={item.name}
                          onClick={() => handleItemClick(item._id)}
                      >
                        {`价格: ${item.price}￥`}
                        <br />
                        {`秒杀结束时间: ${new Date(item.seckillEnd).toLocaleString()}`}
                        <br />
                        {`剩余时间: ${formatTimeLeft(item.seckillEnd)}`}
                      </Card>
                    </List.Item>
                )}
            />
          </Card>
          <Card bordered={false} style={{ borderRadius: 20 , boxShadow: '2px 0 5px rgba(0,0,0,0.1)',}}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>即将开始的秒杀</h1>
            <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={seckillItems.upcoming}
                renderItem={(item) => (
                    <List.Item>
                      <Card
                          cover={<img alt="product" src={item.imgs[0]} />}
                          title={item.name}
                          onClick={() => handleItemClick(item._id)}
                      >
                        {`价格: ${item.price}￥`}
                        <br />
                        {`秒杀开始时间: ${new Date(item.seckillStart).toLocaleString()}`}
                        <br />
                        {`倒计时: ${formatTimeLeft(item.seckillStart)}`}
                      </Card>
                    </List.Item>
                )}
            />
          </Card>
          <span style={{ fontSize: 20, fontWeight: 700 }}>精选好物</span>
          <List
              grid={{ gutter: 16, xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 3, }}
              dataSource={hotItems}
              renderItem={(item) => (
                  <List.Item>
                    <Card
                        hoverable
                        style={{ borderRadius: 20 , boxShadow: '2px 0 5px rgba(0,0,0,0.1)',}}
                        cover={<div style={{ display: 'flex', justifyContent: 'center', padding: '20px',}}><img alt="product" src={item.imgs[0]} style={{borderRadius: 20}}/></div>
                        }
                        onClick={() => handleItemClick(item._id)}
                    >
                      <Meta
                          title={(
                              <div style={{ textAlign: 'center' }}>
                                {`${item.name}`}
                              </div>
                          )}
                          description={(
                              <div style={{ textAlign: 'center' }}>
                                <div>{`描述: ${item.desc}`}</div>
                                <br/>
                                <div style={{fontSize:20, fontWeight:700, color:'#f00'}}>{`${item.price}￥`}</div>
                              </div>
                          )}
                      />
                    </Card>
                  </List.Item>
              )}
          />
        </Space>
      </div>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.loginUserInfo,
});

export default connect(mapStateToProps)(withRouter(HomePage));
