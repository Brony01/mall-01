const mongoose = require('mongoose');

// 定义订单Schema
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: String, required: true },
            name: { type: String, required: true },
            desc: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            imgs: { type: [String], default: [] }
        }
    ],
    status: { type: String, required: true, default: '待付款' }, // 订单状态：待付款、待收货、已完成、退款/售后
    totalAmount: { type: Number, required: true },
    originalAmount: { type: Number, required: true },
    createTime: { type: Number, default: Date.now }
});

// 定义模型
const OrderModel = mongoose.model('orders', orderSchema);

// 导出模型
module.exports = OrderModel;
