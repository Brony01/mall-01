import React, { useState, useEffect } from 'react';
import {
  Card, Input, Select, Table, Typography, Button, message,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { reqProductList, reqProductStatus, reqDeleteProduct } from 'api';
import { formatNumber } from '../../utils/common';

const { Option } = Select;
const { Text } = Typography;
const PAGE_SIZE = 5;

const ProductListPage = ({ history }) => {
  const [pageNum, setPageNum] = useState(1);
  const [selectValue, setSelectValue] = useState('1');
  const [productListSource, setProductListSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getProductList(1);
  }, []);

  const getProductList = async (pageNum) => {
    setLoading(true);
    const res = await reqProductList({ pageNum, pageSize: PAGE_SIZE });
    const { total, list } = res.data;
    if (res.status === 0 && list.length > 0) {
      list.forEach((item) => item.price = formatNumber(item.price));
      setProductListSource(list);
      setTotal(total);
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filterData = () => {
    if (!searchText) {
      return productListSource;
    } if (selectValue === '1') {
      return productListSource.filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    return productListSource.filter((product) => product.desc.toLowerCase().includes(searchText.toLowerCase()));
  };

  const handleDetail = (data) => {
    history.push({
      pathname: '/mainpage/product/detail',
      state: data,
    });
  };

  const filteredData = filterData();
  const title = (
    <div>
      <Select defaultValue="1" style={{ width: '7rem' }} onChange={setSelectValue}>
        <Option value="1">按名称搜索</Option>
        <Option value="2">按描述搜索</Option>
      </Select>
      <Input.Search placeholder="搜索商品" onSearch={handleSearch} style={{ width: 200 }} />
    </div>
  );
  const addComponment = (
    <span>
      <Button icon="plus" type="primary">添加商品</Button>
    </span>
  );

  const columns = [
    { title: '商品名称', dataIndex: 'name' },
    { title: '价格', dataIndex: 'price', render: (record) => (`￥${record}`) },
    { title: '商品描述', dataIndex: 'desc' },
    {
      title: '操作',
      render: (record) => (
        <span>
          <Button type="link" onClick={() => handleDetail(record)}>详情</Button>
        </span>
      ),
    },
  ];

  return (
    <Card title={title} extra={addComponment}>
      <Table
        dataSource={filteredData}
        columns={columns}
        bordered
        loading={loading}
        rowKey="_id"
        size="small"
        pagination={{ defaultCurrent: 1, pageSize: 5, total: filteredData.length }}
      />
    </Card>
  );
};

export default withRouter(ProductListPage);
