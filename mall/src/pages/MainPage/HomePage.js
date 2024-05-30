import React, { useState, useEffect } from 'react';
import {
  Carousel, Input, Card, List, Button,
  Tabs, message,
} from 'antd';
import { withRouter } from 'react-router-dom';
import {Space, Swiper} from 'antd-mobile';
import { reqHotProducts, reqCouponStatus, reqSeckillProducts } from 'api';

const { Search } = Input;
const { TabPane } = Tabs;

const HomePage = ({ history }) => {
  const [hotItems, setHotItems] = useState([]);
  const [couponStatus, setCouponStatus] = useState({});
  const [seckillItems, setSeckillItems] = useState({ ongoing: [], upcoming: [] });

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
      try {
        const userId = 'someUserId'; // 替换为实际用户ID
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
    history.push('/mypage');
  };

  const formatTimeLeft = (endTime) => {
    const totalSeconds = Math.floor((new Date(endTime) - new Date()) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}小时 ${minutes}分钟 ${seconds}秒`;
  };

  return (
    <div style={{
      backgroundColor:'#F4F5F9',
      padding:20,
    }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Search placeholder="请输入商品名称 如: 手机" onSearch={handleSearch} enterButton />
        <Swiper autoplay style={{
          borderRadius:20
        }}>
          <Swiper.Item key = {1}>
            <div>
              <img
                  src="https://res.vmallres.com/uomcdn/CN/cms/202405/ee061dafcb20437aa6e58e174e235c2c.jpg"
                  alt="HUAWEI Pura70系列"
              />
            </div>
          </Swiper.Item>
          <Swiper.Item key = {2}>
            <div>
              <img
                  src="https://res.vmallres.com/uomcdn/CN/cms/2024-05/5495c7a8405d47998f9804521dd500f8.jpg"
                  alt="华为Vision智慧屏4"
              />
            </div>
          </Swiper.Item>
          <Swiper.Item key = {3}>
            <div>
              <img
                  src="https://res.vmallres.com/uomcdn/CN/cms/2024-05/f1a956d19f5c44a7ab1f2a23db1eeae0.jpg"
                  alt="HUAWEI MateBook X Pro"
              />
            </div>
          </Swiper.Item>
      </Swiper>
        <Card
            bordered={false}
            title="优惠券"
            style={{
              borderRadius:20,
            }}
        >
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
          </List>
        </Card>
        <Card bordered={false}
            style={{
          borderRadius:20,
        }}>
          <h1 style={{fontSize:20, fontWeight:700}}>正在进行的秒杀</h1>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={seckillItems.ongoing}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.name}>
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
        <Card bordered={false}
              style={{
                borderRadius: 20,
              }}
        >
          <h1 style={{fontSize: 20, fontWeight: 700}}>即将开始的秒杀</h1>
          <List
              grid={{gutter: 16, column: 2}}
              dataSource={seckillItems.upcoming}
              renderItem={(item) => (
                  <List.Item>
                    <Card title={item.name}>
                      {`价格: ${item.price}￥`}
                      <br/>
                      {`秒杀开始时间: ${new Date(item.seckillStart).toLocaleString()}`}
                      <br/>
                      {`倒计时: ${formatTimeLeft(item.seckillStart)}`}
                    </Card>
                  </List.Item>
              )}
          />
        </Card>
        <span style={{fontSize: 20, fontWeight: 700}}>精选好物</span>
        <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={hotItems}
            renderItem={(item) => (
                <List.Item>
                  <Card
                      // title={item.name}
                    hoverable={true}
                    style={{
                      borderRadius: 20,
                    }}
                  >
                    {`描述: ${item.desc}`}
                    <br />
                    {`价格: ${item.price}￥`}
                    <br />
                    {`销量: ${item.orderCount}`}
                  </Card>
                </List.Item>
            )}
        />
      </Space>
    </div>
  );
};

export default withRouter(HomePage);
