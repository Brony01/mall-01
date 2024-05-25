const express = require('express');
const md5 = require('blueimp-md5');
const atob = require('atob');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/UserModel');
const CategoryModel = require('../models/CategoryModel');
const ProductModel = require('../models/ProductModel');
const RoleModel = require('../models/RoleModel');
const CartModel = require('../models/CartModel');
const CouponModel = require('../models/CouponModel');
const FavoriteModel = require('../models/FavoriteModel');
const OrderModel = require('../models/OrderModel');
const FootprintModel = require('../models/FootprintModel');

// 生成token的方法
function generateToken(data = {}) {
    const created = Math.floor(Date.now() / 1000);
    const cert = fs.readFileSync(path.join(__dirname, '../config/rsa_private_key.pem')); // 私钥
    const token = jwt.sign({
        data,
        exp: created + 3600 * 24
        // exp: created + 15
    }, cert, { algorithm: 'RS256' });
    return token;
}

// 得到路由器对象
const router = express.Router();

// 指定需要过滤的属性
const filter = { password: 0, __v: 0 };

// 登陆
router.post('/login', (req, res) => {
    let { username, password } = req.body;
    username = atob(username);
    password = atob(password);
    // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
    UserModel.findOne({ username, password: md5(password) }, filter)
        .then(user => {
            res.setHeader('Cache-Control', 'no-store');
            if (user) { // 登陆成功
                // 生成一个cookie(userid: user._id), 并交给浏览器保存
                res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
                let token = generateToken({ username });
                if (user.role_id) {
                    RoleModel.findOne({ _id: user.role_id })
                        .then(role => {
                            user._doc.role = role;
                            console.log('role user', user);
                            res.send({ status: 0, data: user, token: token });
                        });
                } else {
                    user._doc.role = { menus: [] };
                    // 返回登陆成功信息(包含user)
                    res.send({ status: 0, data: user, token: token });
                }
            } else {// 登陆失败
                res.send({ status: 1, msg: '用户名或密码不正确!' });
            }
        })
        .catch(error => {
            console.error('登陆异常', error);
            res.send({ status: 1, msg: '登陆异常, 请重新尝试' });
        });
});

router.post('/refreshToken', (req, res) => {
    const token = req.headers.authorization;
    res.setHeader('Cache-Control', 'no-store');
    if (token) {
        const token = generateToken();
        res.send({ status: 100, token: token });
    }
});

// 添加用户
router.post('/manage/user/add', (req, res) => {
    // 读取请求参数数据
    const { username, password } = req.body;
    // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
    // 查询(根据username)
    UserModel.findOne({ username })
        .then(user => {
            // 如果user有值(已存在)
            if (user) {
                // 返回提示错误的信息
                res.send({ status: 1, msg: '此用户已存在' });
                return new Promise(() => { });
            } else { // 没值(不存在)
                // 保存
                return UserModel.create({ ...req.body, password: md5(password || '123456') });
            }
        })
        .then(user => {
            // 返回包含user的json数据
            res.send({ status: 0, data: user });
        })
        .catch(error => {
            console.error('注册异常', error);
            res.send({ status: 1, msg: '添加用户异常, 请重新尝试' });
        });
});

// 更新用户
router.post('/manage/user/update', (req, res) => {
    const user = req.body;
    if (user.username === 'admin') {
        res.send({ status: 1, msg: '用户名错误！' });
    }
    UserModel.findOneAndUpdate({ _id: user._id }, user)
        .then(oldUser => {
            const data = Object.assign(oldUser, user);
            // 返回
            res.send({ status: 0 });
        })
        .catch(error => {
            console.error('更新用户异常', error);
            res.send({ status: 1, msg: '更新用户异常, 请重新尝试' });
        });
});

// 删除用户
router.post('/manage/user/delete', (req, res) => {
    const { _id } = req.body;
    UserModel.deleteOne({ _id })
        .then((doc) => {
            res.send({ status: 0, data: doc });
        });
});

// 获取所有用户列表
router.get('/manage/user/list', (req, res) => {
    UserModel.find({ username: { '$ne': 'admin' } }, { password: 0, __v: 0 }).sort({ "_id": -1 })
        .then(users => {
            RoleModel.find().then(roles => {
                res.send({ status: 0, data: { users, roles } });
            });
        })
        .catch(error => {
            console.error('获取用户列表异常', error);
            res.send({ status: 1, msg: '获取用户列表异常, 请重新尝试' });
        });
});

// 添加分类
router.post('/manage/category/add', (req, res) => {
    const { categoryName, parentId } = req.body;
    CategoryModel.create({ name: categoryName, parentId: parentId || '0' })
        .then(category => {
            res.send({ status: 0, data: category });
        })
        .catch(error => {
            console.error('添加分类异常', error);
            res.send({ status: 1, msg: '添加分类异常, 请重新尝试' });
        });
});

// 删除分类
router.post('/manage/category/delete', (req, res) => {
    const { _id } = req.body;
    CategoryModel.deleteMany({ $or: [{ _id: _id }, { parentId: _id }] })
        .then(category => {
            res.send({ status: 0, data: category });
        })
        .catch(error => {
            console.error('删除分类异常', error);
            res.send({ status: 1, msg: '删除分类异常, 请重新尝试' });
        });
});

// 获取分类列表
router.get('/manage/category/list', (req, res)=> {
    const parentId = req.query.parentId || '0';
    CategoryModel.find({ parentId }).sort({ "_id": -1 })
        .then(categorys => {
            res.send({ status: 0, data: categorys });
        })
        .catch(error => {
            console.error('获取分类列表异常', error);
            res.send({ status: 1, msg: '获取分类列表异常, 请重新尝试' });
        });
});

// 更新分类名称
router.post('/manage/category/update', (req, res) => {
    const { categoryId, categoryName } = req.body;
    CategoryModel.findOneAndUpdate({ _id: categoryId }, { name: categoryName })
        .then(oldCategory => {
            res.send({ status: 0 });
        })
        .catch(error => {
            console.error('更新分类名称异常', error);
            res.send({ status: 1, msg: '更新分类名称异常, 请重新尝试' });
        });
});

// 根据分类ID获取分类
router.get('/manage/category/info', (req, res) => {
    const categoryId = req.query.categoryId;
    CategoryModel.findOne({ _id: categoryId })
        .then(category => {
            res.send({ status: 0, data: category });
        })
        .catch(error => {
            console.error('获取分类信息异常', error);
            res.send({ status: 1, msg: '获取分类信息异常, 请重新尝试' });
        });
});

// 添加产品
router.post('/manage/product/add', (req, res) => {
    const product = req.body;
    ProductModel.create(product)
        .then(product => {
            res.send({ status: 0, data: product });
        })
        .catch(error => {
            console.error('添加产品异常', error);
            res.send({ status: 1, msg: '添加产品异常, 请重新尝试' });
        });
});

// 删除产品
router.post('/manage/product/delete', (req, res) => {
    const { _id } = req.body;
    ProductModel.deleteOne({ _id })
        .then(product => {
            res.send({ status: 0, data: product });
        })
        .catch(error => {
            console.error('删除产品异常', error);
            res.send({ status: 1, msg: '删除产品异常, 请重新尝试' });
        });
});

// 获取产品分页列表
router.get('/manage/product/list', (req, res) => {
    const { pageNum, pageSize } = req.query;
    ProductModel.find().sort({ "_id": -1 })
        .then(products => {
            res.send({ status: 0, data: pageFilter(products, pageNum, pageSize) });
        })
        .catch(error => {
            console.error('获取商品列表异常', error);
            res.send({ status: 1, msg: '获取商品列表异常, 请重新尝试' });
        });
});

// 搜索产品列表
router.get('/manage/product/search', (req, res) => {
    const { pageNum, pageSize, searchName, productName, productDesc } = req.query;
    let contition = {};
    if (productName) {
        contition = { name: new RegExp(`^.*${productName}.*$`) };
    } else if (productDesc) {
        contition = { desc: new RegExp(`^.*${productDesc}.*$`) };
    }
    ProductModel.find(contition)
        .then(products => {
            res.send({ status: 0, data: pageFilter(products, pageNum, pageSize) });
        })
        .catch(error => {
            console.error('搜索商品列表异常', error);
            res.send({ status: 1, msg: '搜索商品列表异常, 请重新尝试' });
        });
});

// 更新产品
router.post('/manage/product/update', (req, res) => {
    const product = req.body;
    ProductModel.findOneAndUpdate({ _id: product._id }, product)
        .then(oldProduct => {
            res.send({ status: 0 });
        })
        .catch(error => {
            console.error('更新商品异常', error);
            res.send({ status: 1, msg: '更新商品名称异常, 请重新尝试' });
        });
});

// 更新产品状态(上架/下架)
router.post('/manage/product/updateStatus', (req, res) => {
    const { productId, status } = req.body;
    ProductModel.findOneAndUpdate({ _id: productId }, { status })
        .then(oldProduct => {
            res.send({ status: 0 });
        })
        .catch(error => {
            console.error('更新产品状态异常', error);
            res.send({ status: 1, msg: '更新产品状态异常, 请重新尝试' });
        });
});

// 添加角色
router.post('/manage/role/add', (req, res) => {
    const { roleName } = req.body;
    RoleModel.create({ name: roleName })
        .then(role => {
            res.send({ status: 0, data: role });
        })
        .catch(error => {
            res.send({ status: 1, msg: '添加角色异常, 请重新尝试' });
        });
});

// 删除角色
router.post('/manage/role/delete', (req, res) => {
    const { _id } = req.body;
    RoleModel.deleteOne({ _id })
        .then(data => {
            res.send({ status: 0, data });
        })
        .catch(error => {
            res.send({ status: 1, msg: '添加角色异常, 请重新尝试' });
        });
});

// 获取角色列表
router.get('/manage/role/list', (req, res) => {
    RoleModel.find().sort({ "_id": -1 })
        .then(roles => {
            res.send({ status: 0, data: roles });
        })
        .catch(error => {
            console.error('获取角色列表异常', error);
            res.send({ status: 1, msg: '获取角色列表异常, 请重新尝试' });
        });
});

// 设置权限
router.post('/manage/role/update', (req, res) => {
    const role = req.body;
    role.auth_time = Date.now();
    RoleModel.findOneAndUpdate({ _id: role._id }, role)
        .then(oldRole => {
            res.send({ status: 0, data: { ...oldRole._doc, ...role } });
        })
        .catch(error => {
            console.error('更新角色异常', error);
            res.send({ status: 1, msg: '更新角色异常, 请重新尝试' });
        });
});

// 购物车
router.post('/cart/add', async (req, res) => {
    const { userId, productId, quantity, price } = req.body;
    try {
        let cart = await CartModel.findOne({ userId });
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity, price });
            }
        } else {
            cart = new CartModel({ userId, products: [{ productId, quantity, price }] });
        }
        await cart.save();
        res.send({ status: 0 });
    } catch (error) {
        res.send({ status: 1, msg: '添加到购物车失败' });
    }
});

router.get('/cart', async (req, res) => {
    const { userId } = req.query;
    try {
        const cart = await CartModel.findOne({ userId });
        res.send({ status: 0, data: cart });
    } catch (error) {
        res.send({ status: 1, msg: '获取购物车信息失败' });
    }
});

router.post('/cart/update', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await CartModel.findOne({ userId });
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                res.send({ status: 0 });
            } else {
                res.send({ status: 1, msg: '商品不在购物车中' });
            }
        } else {
            res.send({ status: 1, msg: '购物车不存在' });
        }
    } catch (error) {
        res.send({ status: 1, msg: '更新购物车失败' });
    }
});

router.post('/cart/delete', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let cart = await CartModel.findOne({ userId });
        if (cart) {
            cart.products = cart.products.filter(p => p.productId !== productId);
            await cart.save();
            res.send({ status: 0 });
        } else {
            res.send({ status: 1, msg: '购物车不存在' });
        }
    } catch (error) {
        res.send({ status: 1, msg: '删除购物车商品失败' });
    }
});

// 收藏
router.post('/favorite/add', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let favorite = await FavoriteModel.findOne({ userId });
        if (favorite) {
            const productIndex = favorite.products.findIndex(p => p.productId.equals(productId));
            if (productIndex === -1) {
                favorite.products.push({ productId: mongoose.Types.ObjectId(productId) });
            }
        } else {
            favorite = new FavoriteModel({ userId, products: [{ productId: mongoose.Types.ObjectId(productId) }] });
        }
        await favorite.save();
        res.send({ status: 0 });
    } catch (error) {
        res.send({ status: 1, msg: '添加到收藏失败' });
    }
});

router.get('/favorite', async (req, res) => {
    const { userId } = req.query;
    try {
        const favorite = await FavoriteModel.findOne({ userId }).populate('products.productId');
        if (favorite) {
            const populatedProducts = favorite.products.map((product) => ({
                ...product._doc,
                productDetails: product.productId
            }));
            res.send({ status: 0, data: populatedProducts });
        } else {
            res.send({ status: 0, data: [] });
        }
    } catch (error) {
        res.send({ status: 1, msg: '获取收藏信息失败' });
    }
});

router.post('/favorite/delete', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let favorite = await FavoriteModel.findOne({ userId });
        if (favorite) {
            favorite.products = favorite.products.filter(p => !p.productId.equals(productId));
            await favorite.save();
            res.send({ status: 0 });
        } else {
            res.send({ status: 1, msg: '收藏列表不存在' });
        }
    } catch (error) {
        res.send({ status: 1, msg: '删除收藏商品失败' });
    }
});

// 足迹
router.post('/footprint/add', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let footprint = await FootprintModel.findOne({ userId });
        if (footprint) {
            const productIndex = footprint.products.findIndex(p => p.productId.equals(productId));
            if (productIndex === -1) {
                footprint.products.push({ productId: mongoose.Types.ObjectId(productId) });
            }
        } else {
            footprint = new FootprintModel({ userId, products: [{ productId: mongoose.Types.ObjectId(productId) }] });
        }
        await footprint.save();
        res.send({ status: 0 });
    } catch (error) {
        res.send({ status: 1, msg: '添加到足迹失败' });
    }
});

router.get('/footprint', async (req, res) => {
    const { userId } = req.query;
    try {
        const footprint = await FootprintModel.findOne({ userId }).populate('products.productId');
        if (footprint) {
            const populatedProducts = footprint.products.map((product) => ({
                ...product._doc,
                productDetails: product.productId
            }));
            res.send({ status: 0, data: populatedProducts });
        } else {
            res.send({ status: 0, data: [] });
        }
    } catch (error) {
        res.send({ status: 1, msg: '获取足迹信息失败' });
    }
});

// 订单
router.post('/order/create', async (req, res) => {
    const { userId, products, totalAmount } = req.body;
    try {
        const order = new OrderModel({ userId, products, totalAmount, status: '待付款' });
        await order.save();
        res.send({ status: 0, data: order });
    } catch (error) {
        res.send({ status: 1, msg: '创建订单失败' });
    }
});

router.get('/order', async (req, res) => {
    const { userId } = req.query;
    try {
        const orders = await OrderModel.find({ userId });
        res.send({ status: 0, data: orders });
    } catch (error) {
        res.send({ status: 1, msg: '获取订单信息失败' });
    }
});

router.post('/order/update', async (req, res) => {
    const { orderId, status } = req.body;
    try {
        await OrderModel.findOneAndUpdate({ _id: orderId }, { status });
        res.send({ status: 0 });
    } catch (error) {
        res.send({ status: 1, msg: '更新订单状态失败' });
    }
});

router.post('/order/delete', async (req, res) => {
    const { orderId } = req.body;
    try {
        await OrderModel.deleteOne({ _id: orderId });
        res.send({ status: 0 });
    } catch (error) {
        res.send({ status: 1, msg: '删除订单失败' });
    }
});

// 优惠券
router.post('/coupon/add', async (req, res) => {
    const { code, discount, expiryDate, userId } = req.body;
    try {
        const coupon = new CouponModel({ code, discount, expiryDate, userId });
        await coupon.save();
        res.send({ status: 0 });
    } catch (error) {
        res.send({ status: 1, msg: '添加优惠券失败' });
    }
});

router.get('/coupon', async (req, res) => {
    const { userId } = req.query;
    try {
        const coupons = await CouponModel.find({ userId });
        res.send({ status: 0, data: coupons });
    } catch (error) {
        res.send({ status: 1, msg: '获取优惠券信息失败' });
    }
});

// 商品详情
router.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await ProductModel.findById(productId);
        if (product) {
            res.send({ status: 0, data: product });
        } else {
            res.send({ status: 1, msg: '商品不存在' });
        }
    } catch (error) {
        res.send({ status: 1, msg: '获取商品详情失败' });
    }
});

/*
得到指定数组的分页信息对象
*/
function pageFilter(arr, pageNum, pageSize) {
    pageNum = pageNum * 1;
    pageSize = pageSize * 1;
    const total = arr.length;
    const pages = Math.floor((total + pageSize - 1) / pageSize);
    const start = pageSize * (pageNum - 1);
    const end = start + pageSize <= total ? start + pageSize : total;
    const list = [];
    for (let i = start; i < end; i++) {
        list.push(arr[i]);
    }

    return {
        pageNum,
        total,
        pages,
        pageSize,
        list
    };
}

module.exports = router;
