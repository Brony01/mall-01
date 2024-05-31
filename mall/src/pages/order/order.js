import React, { Component } from 'react';
import { Table, Spin } from 'antd';
import {reqAllOrders} from "../../api";
import {Link, withRouter} from "react-router-dom";

class OrdersPage extends Component {
  state = {
    orders: [],
    loading: true,
  };

  columns = [
    {
      title: '订单号',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
      <Link to={{
        pathname: `/order-manage/detail`,
        state: { order: record._id }
      }}>查看</Link>
    </span>
      ),
    }
  ];

  componentDidMount() {
    reqAllOrders().then((res) => {
      if(res.status === 0) {
        this.setState({
          orders: res.data,
          loading: false,
        });
      }else{
        console.log(res.msg);
      }
    });
  }

  render() {
    const { orders, loading } = this.state;

    return (
      <Spin spinning={loading}>
        <Table dataSource={orders} columns={this.columns} rowKey="_id" />
      </Spin>
    );
  }
}

export default withRouter(OrdersPage);