import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './index.less';

const BottomNav = ({ history }) => {
  const [current, setCurrent] = useState('/mainpage/home');
  const [position, setPosition] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const initCurrent = '/mainpage/home';
    setCurrent(initCurrent);
    updateSlidePosition(initCurrent);
  }, []);

  const menuItems = [
    { key: '/mainpage/home', title: '首页' },
    { key: '/mainpage/category', title: '分类' },
    { key: '/mainpage/cart', title: '购物车' },
    { key: '/mainpage/my', title: '我的' }
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
      console.log(`Key: ${key}, OffsetLeft: ${left}, OffsetWidth: ${width}`);
      setPosition({ left, width });
    }
  };

  return (
      <div className="bottom-nav">
        <ul id="nav">
          <li className="slide1" style={{ left: position.left, width: position.width }}></li>
          <li className="slide2" style={{ left: position.left, width: position.width }}></li>
          {menuItems.map((item) => (
              <li key={item.key}>
                <Link
                    to={item.key}
                    data-key={item.key}
                    className={current === item.key ? 'active' : ''}
                    onClick={() => handleClick(item.key)}
                >
                  {item.title}
                </Link>
              </li>
          ))}
        </ul>
      </div>
  );
};

export default withRouter(BottomNav);
