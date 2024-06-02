import React, { Component } from 'react';
import { Breadcrumb, Button, Card, Icon, Input, Modal, Table, message } from 'antd';
import { reqAddCategory, reqCatagoryList, reqDeleteCategory, reqUpdateCategory } from 'api';
import AddForm from './add-form';
import UpdateForm from './update-form';

const { confirm } = Modal;

export default class Category extends Component {
    state = {
        loading: false,
        categoryList: [],
        subCategoryList: [],
        parentId: '0',
        subCategoryListNavName: '',
        showModal: 0,
        currentRowData: {},
        confirmLoading: false,
        searchText: ''
    };

    constructor(props) {
        super(props);
        this.addCatagoryBtn = this.CatagoryBtn();
        this.initColumns = this.initColumns();
    }

    componentDidMount() {
        this.getCategoryList();
    }

    initColumns() {
        return [
            {
                title: '分类名称',
                key: 'name',
                dataIndex: 'name'
            },
            {
                title: '分类图片',
                key: 'imageUrl',
                dataIndex: 'imageUrl',
                render: (text) => <img src={text} alt="分类图片" style={{ width: 50 }} />
            },
            {
                title: '操作',
                key: '02',
                width: 300,
                render: record => (
                    <span>
            <Button type="link" onClick={() => this.updateCategory(record)}>修改</Button>
            <Button type="link" onClick={() => this.deleteCategory(record)}>删除</Button>
                        {this.state.parentId === '0' ? (
                            <Button type="link" onClick={() => this.getSubCategoryList(record)}>查看子分类</Button>
                        ) : null}
          </span>
                )
            }
        ];
    }

    deleteCategory = record => {
        confirm({
            title: '确认删除该分类?',
            content: record.name,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                const res = await reqDeleteCategory({ _id: record._id });
                if (res.status === 0) {
                    message.success('删除分类成功');
                    this.getCategoryList();
                } else {
                    message.error('删除分类失败');
                }
            },
            onCancel() {}
        });
    };

    updateCategory = data => {
        this.setState({
            showModal: 2,
            currentRowData: data
        });
    };

    CatagoryBtn() {
        return (
            <Button type="primary" onClick={this.addCatagory}>
                <Icon type="plus" />
                添加
            </Button>
        );
    }

    addCatagory = () => {
        this.setState({
            showModal: 1
        });
    };

    getCategoryList = async () => {
        const { parentId } = this.state;
        this.setState({ loading: true });
        const params = { parentId: parentId };
        const res = await reqCatagoryList(params);
        if (res.status === 0) {
            if (parentId === '0') {
                this.setState({ categoryList: res.data, loading: false });
            } else {
                this.setState({ subCategoryList: res.data, loading: false });
            }
        } else {
            message.error('获取分类列表失败');
        }
    };

    getSubCategoryList = data => {
        this.setState(
            {
                parentId: data._id,
                subCategoryListNavName: data.name,
                currentRowData: data
            },
            () => {
                this.getCategoryList();
            }
        );
    };

    categoryList = () => {
        this.setState({
            parentId: '0',
            subCategoryList: [],
            subCategoryListNavName: null,
            currentRowData: { _id: '0', name: '一级分类' }
        });
    };

    filterCategories = () => {
        const { categoryList, subCategoryList, parentId, searchText } = this.state;
        const list = parentId === '0' ? categoryList : subCategoryList;
        return list.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    };

    onSearch = value => {
        this.setState({ searchText: value.toLowerCase() });
    };

    addCategoryModalHandleOk = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ confirmLoading: true });
                const { categoryId, categoryName, imageUrl } = values;
                const params = { categoryName, parentId: categoryId, imageUrl };
                try {
                    const res = await reqAddCategory(params);
                    if (res.status === 0) {
                        message.success('添加分类成功');
                        this.setState({ showModal: 0, confirmLoading: false });
                        this.form.resetFields();
                        this.getCategoryList();
                    } else {
                        message.error('添加分类失败');
                    }
                } catch (error) {
                    message.error('添加分类异常, 请重新尝试');
                    this.setState({ confirmLoading: false });
                }
            }
        });
    };

    updateCategoryModalHandleOk = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ confirmLoading: true });
                const params = { categoryId: this.state.currentRowData._id, categoryName: values.categoryName, imageUrl: values.imageUrl };
                const res = await reqUpdateCategory(params);
                if (res.status === 0) {
                    message.success('更新分类成功');
                    this.setState({ showModal: 0, confirmLoading: false });
                    this.form.resetFields();
                    // 获取最新的分类列表
                    this.getCategoryList();
                    // 获取最新的子分类列表
                    if (this.state.parentId !== '0') {
                        this.getSubCategoryList({ _id: this.state.parentId });
                    }
                } else {
                    message.error('更新分类失败');
                    this.setState({ confirmLoading: false });
                }
            }
        });
    };

    modalHandleCancel = () => {
        this.setState({ showModal: 0, currentRowData: {} });
        this.form.resetFields();
    };

    render() {
        const {
            categoryList,
            loading,
            showModal,
            parentId,
            subCategoryList,
            subCategoryListNavName,
            currentRowData,
            confirmLoading
        } = this.state;
        const filteredData = this.filterCategories();

        const title = (
            <Breadcrumb>
                <Breadcrumb.Item onClick={this.categoryList} style={{ cursor: 'pointer' }}>
                    品类管理
                </Breadcrumb.Item>
                {parentId !== '0' && (
                    <Breadcrumb.Item>{subCategoryListNavName}</Breadcrumb.Item>
                )}
            </Breadcrumb>
        );

        return (
            <div>
                <Card title={title} extra={this.addCatagoryBtn}>
                    <Input.Search
                        placeholder="搜索分类"
                        onSearch={this.onSearch}
                        style={{ width: 200, marginBottom: 16 }}
                    />
                    <Table
                        dataSource={filteredData}
                        columns={this.initColumns}
                        bordered
                        rowKey="_id"
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                    />
                </Card>
                <Modal
                    title="添加分类"
                    visible={showModal === 1}
                    onOk={this.addCategoryModalHandleOk}
                    onCancel={this.modalHandleCancel}
                    confirmLoading={confirmLoading}
                >
                    <AddForm
                        categoryList={categoryList}
                        currentRowData={currentRowData}
                        setForm={form => { this.form = form; }}
                    />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showModal === 2}
                    onOk={this.updateCategoryModalHandleOk}
                    onCancel={this.modalHandleCancel}
                    confirmLoading={confirmLoading}
                >
                    <UpdateForm
                        setForm={form => { this.form = form; }}
                        currentRowData={currentRowData}
                    />
                </Modal>
            </div>
        );
    }
}
