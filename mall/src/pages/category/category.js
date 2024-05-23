import React, { Component } from 'react';
import { Breadcrumb, Button, Card, Icon, Input, Modal, Table } from 'antd';
import { reqAddCategory, reqCatagoryList, reqDeleteCategory, reqUpdateCategory } from 'api';
import AddForm from './add-form';
import UpdateForm from './update-form';

const { confirm } = Modal;

export default class Category extends Component {
    state = {
        loading: false,
        categoryList: [], // 一级列表
        subCategoryList: [], // 子分类列表
        parentId: '0', // 初始获取一级列表
        subCategoryListNavName: '',
        showModal: 0, // 0: 都不显示；1：显示添加一级分类；2：修改分类
        currentRowData: {}, // 默认一级
        confirmLoading: false,
        searchText: '' // 添加搜索文本状态
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
                    this.getCategoryList();
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
        const { data } = await reqCatagoryList(params);
        if (parentId === '0') {
            this.setState({ categoryList: data, loading: false }); // 一级列表
        } else {
            this.setState({ subCategoryList: data, loading: false }); // 子列表
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
            currentRowData: { _id: '0', name: '一级分类' } // 默认一级
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

    addCategoryModalHandleOk = e => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    confirmLoading: true
                });
                const { categoryId, categoryName } = values;
                const params = {
                    categoryName,
                    parentId: categoryId
                };
                const { status } = await reqAddCategory(params);
                this.form.resetFields();
                if (status === 0) {
                    this.setState({
                        showModal: 0,
                        confirmLoading: false
                    });
                    // 当前列表才去请求
                    if (this.state.parentId === categoryId) {
                        this.getCategoryList();
                    } else if (categoryId === '0') {
                        // 在二级列表下添加一级列表项
                    }
                }
            }
        });
    };

    updateCategoryModalHandleOk = e => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    confirmLoading: true
                });
                const params = {
                    categoryName: values.categoryName,
                    categoryId: this.state.currentRowData._id
                };
                this.form.resetFields();
                const { status } = await reqUpdateCategory(params);
                if (status === 0) {
                    this.setState({
                        showModal: 0,
                        confirmLoading: false
                    });
                    // 更新列表
                    this.getCategoryList();
                }
            }
        });
    };

    modalHandleCancel = e => {
        this.setState({
            showModal: 0,
            currentRowData: {}
        });
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
                <Breadcrumb.Item>{subCategoryListNavName}</Breadcrumb.Item>
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
                        setForm={form => {
                            this.form = form;
                        }}
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
                        setForm={form => {
                            this.form = form;
                        }}
                        currentRowData={currentRowData}
                    />
                </Modal>
            </div>
        );
    }
}
