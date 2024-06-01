import React from 'react';
import { Spin } from 'antd';

export default function () {
  return (
    <div style={{ textAlign: 'center', marginTop: '10%' }}>
      <Spin tip="努力加载中..." size="large" />
    </div>
  );
}
