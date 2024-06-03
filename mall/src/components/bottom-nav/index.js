import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import {
  AppOutline,
  UnorderedListOutline,
  ShopbagOutline,
  UserOutline
} from 'antd-mobile-icons';
import './index.less';

const BottomNav = () => {
  const history = useHistory();
  const location = useLocation();
  const [current, setCurrent] = useState('/mainpage/home');
  const [position, setPosition] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const initCurrent = location.pathname;
    setCurrent(initCurrent);
    updateSlidePosition(initCurrent);
  }, [location.pathname]);

  const menuItems = [
    { key: '/mainpage/home', title: '首页', icon: <AppOutline /> },
    { key: '/mainpage/category', title: '分类', icon: <UnorderedListOutline /> },
    { key: '/mainpage/cart', title: '购物车', icon: <ShopbagOutline /> },
    { key: '/mainpage/my', title: '我的', icon: <UserOutline /> }
  ];

  const handleClick = (key) => {
    setCurrent(key);
    updateSlidePosition(key);
    history.push(key);
  };

  const updateSlidePosition = (key) => {
    const element = document.querySelector(`a[data-key="${key}"]`);
    if (element) {
      let correctionOffset = 0;
      if (key === '/mainpage/my') {
        correctionOffset = -3; // 针对最后一个导航项的偏移量调整
      }
      const left = element.offsetLeft + correctionOffset;
      const width = element.offsetWidth;
      setPosition({ left, width });
    }
  };

  return (
      <div className="bottom-nav-container">
        <TabBar activeKey={current} onChange={handleClick} className="bottom-nav">
          {menuItems.map(item => (
              <TabBar.Item
                  key={item.key}
                  title={item.title}
                  icon={item.icon}
                  data-key={item.key}
                  className={current === item.key ? 'active' : ''}
              />
          ))}
          <div className="slide1" style={{ left: position.left, width: position.width }}></div>
          <div className="slide2" style={{ left: position.left, width: position.width }}></div>
        </TabBar>
      </div>
  );
};

export default BottomNav;
