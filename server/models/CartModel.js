const mongoose = require('mongoose');

// 定义购物车Schema
const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: String, required: true },
            name: { type: String, required: true },
            desc: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            imgs: { type: [String], default: [] },
        }
    ],
    createTime: { type: Number, default: Date.now }
});

// 定义模型
const CartModel = mongoose.model('carts', cartSchema);

// 导出模型
module.exports = CartModel;
