import React from 'react';

export default class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <h1 style={{ color: 'red' }}>这是一个信息管理系统，实现了轻量化第三次作业中的所有要求和加分要求，详情如下：</h1>
        <h1>使用React制作一个信息管理系统，需要有以下功能：</h1>
        <h1>1. （已实现）登录注册</h1>
        <h2>要求：（已实现）密码需进行复杂度校验，必须包含大小字母及数字，字数为8-16位，密码需加密，注册需要添加邮箱，需校验邮箱格式</h2>
        <h1>2. （已实现）菜单管理，增删改查，可以是树形表格</h1>
        <h1>3. （已实现）用户管理，增删改查并分配角色</h1>
        <h1>4. （已实现）角色管理，增删改查并分配菜单权限</h1>
        <h1>5. （已实现）权限管理，可以给角色分配菜单，用户登录后只能看到并且只能访问有权限的菜单</h1>
        <h1>补充说明：使用了antd组件库</h1>
        <h1 style={{ color: 'red' }}>加分项补充说明：（已实现）用node.js写了server</h1>
      </div>
    );
  }
}
