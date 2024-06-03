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
      title: '原总金额',
      dataIndex: 'originalAmount',
      key: 'originalAmount',
    },
    {
      title: '折扣后总金额',
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
        // 对订单按照createTime字段进行降序排序
        const sortedOrders = res.data.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
        this.setState({
          orders: sortedOrders,
          loading: false,
        });
      } else {
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
