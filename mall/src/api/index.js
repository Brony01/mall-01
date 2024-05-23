import request from '../utils/ajax';

export const reqLogin = (data) => request('/login', 'POST', data);

export const refreshToken = (data) => request('/refreshToken');

export const reqAddUser = (data) => request('/manage/user/add', 'POST', data);

export const reqDeleteUser = (data) => request('/manage/user/delete', 'POST', data);

export const reqUpdateUser = (data) => request('/manage/user/update', 'POST', data);

export const reqUserList = (data) => request('/manage/user/list', 'GET', data);

export const reqCatagoryList = (data) => request('/manage/category/list', 'GET', data);

export const reqAddCategory = (data) => request('/manage/category/add', 'POST', data);

export const reqDeleteCategory = (data) => request('/manage/category/delete', 'POST', data);

export const reqUpdateCategory = (data) => request('/manage/category/update', 'POST', data);

export const reqCategoryName = (data) => request('/manage/category/info', 'GET', data);

export const reqAddProduct = (data) => request('/manage/product/add', 'POST', data);

export const reqProductStatus = (data) => request('/manage/product/updateStatus', 'POST', data);

export const reqProductUpdate = (data) => request('/manage/product/update', 'POST', data);

// 删除产品
export const reqDeleteProduct = (data) => request('/manage/product/delete', 'POST', data);

// 获取产品列表
export const reqProductList = (data) => request('/manage/product/list', 'GET', data);

// 搜索产品
export const reqSearchProduct = (data) => request('/manage/product/search', 'GET', data);

// 添加角色
export const reqAddRole = (data) => request('/manage/role/add', 'POST', data);

// 删除角色
export const reqDeleteRole = (data) => request('/manage/role/delete', 'POST', data);

// 角色列表
export const reqRoleList = (data) => request('/manage/role/list', 'GET', data);

// 设置权限
export const reqSettingRole = (data) => request('/manage/role/update', 'POST', data);
