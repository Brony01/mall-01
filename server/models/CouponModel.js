const mongoose = require('mongoose');

// 定义优惠券Schema
const couponSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discount: { type: Number, required: true }, // 折扣金额
    expiryDate: { type: Date, required: true },
    userId: { type: String, required: true }
});

// 定义模型
const CouponModel = mongoose.model('coupons', couponSchema);

// 导出模型
module.exports = CouponModel;
