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

// ɾ����Ʒ
export const reqDeleteProduct = (data) => request('/manage/product/delete', 'POST', data);

// ��ȡ��Ʒ�б�
export const reqProductList = (data) => request('/manage/product/list', 'GET', data);

// 请求获取热门商品
export const reqHotProducts = (data) => request('/manage/product/hot', 'GET', data);

// ������Ʒ
export const reqSearchProduct = (data) => request('/manage/product/search', 'GET', data);

// 获取优惠券状态
export const reqCouponStatus = (data) => request('/coupon/status', 'GET', data);

// ��ӽ�ɫ
export const reqAddRole = (data) => request('/manage/role/add', 'POST', data);

// ɾ����ɫ
export const reqDeleteRole = (data) => request('/manage/role/delete', 'POST', data);

// ��ɫ�б�
export const reqRoleList = (data) => request('/manage/role/list', 'GET', data);

// ����Ȩ��
export const reqSettingRole = (data) => request('/manage/role/update', 'POST', data);

// ���ﳵ
export const reqAddToCart = (data) => request('/cart/add', 'POST', data);
export const reqGetCart = (data) => request('/cart', 'GET', data);
export const reqUpdateCart = (data) => request('/cart/update', 'POST', data);
export const reqDeleteCartItem = (data) => request('/cart/delete', 'POST', data);

// �ղ�
export const reqAddToFavorites = (data) => request('/favorite/add', 'POST', data);
export const reqGetFavorites = (data) => request('/favorite', 'GET', data);
export const reqDeleteFavoriteItem = (data) => request('/favorite/delete', 'POST', data);

// �㼣
export const reqAddToFootprints = (data) => request('/footprint/add', 'POST', data);
export const reqGetFootprints = (data) => request('/footprint', 'GET', data);
export const reqDeleteFootprintItem = (data) => request('/footprint/delete', 'POST', data);

export const reqCreateOrder = (data) => request('/order/create', 'POST', data);
export const reqGetOrders = (data) => request('/order', 'GET', data);
export const reqUpdateOrder = (data) => request('/order/update', 'POST', data);
export const reqDeleteOrder = (data) => request('/order/delete', 'POST', data);
export const reqCancelOrder = (data) => request('/order/cancel', 'POST', data);
// 获取所有用户的所有订单
export const reqAllOrders = () => request('/order/all', 'GET');
export const reqConfirmReceipt = (data) => request('/order/confirmReceipt', 'POST', data);
export const reqRequestAfterSales = (data) => request('/order/afterSales', 'POST', data);
export const reqClearCart = (data) => request('/cart/clear', 'POST', data);

export const reqConfirmOrder = (data) => request('/order/confirm', 'POST', data);

// ���ݶ����Ż�ȡ��������
export const reqGetOrderDetails = (orderId) => request(`/order/${orderId}`, 'GET');
// �Ż�ȯ
export const reqAddCoupon = (data) => request('/coupon/add', 'POST', data);
export const reqGetCoupons = (data) => request('/coupon', 'GET', data);

// ��Ʒ����
export const reqGetProductDetails = (productId) => request(`/product/${productId}`, 'GET');

// 获取可领取优惠券
export const reqGetAvailableCoupons = () => request('/coupons/available', 'GET');

// 领取优惠券
export const reqClaimCoupon = (data) => request('/coupon/claim', 'POST', data);

// 获取用户的优惠券
export const reqGetUserCoupons = (data) => request('/coupons/user', 'GET', data);

// 初始化优惠券
export const reqInitCoupon = (data) => request('/coupon/init', 'POST', data);

// 使用优惠券
export const reqUseCoupon = (data) => request('/coupon/use', 'POST', data);

// 秒杀
export const reqSeckill = (data) => request('/seckill', 'POST', data);

// /manage/product/seckill// 请求获取秒杀商品列表
export const reqSeckillProducts = (data) => request('/manage/product/seckill', 'GET', data);
