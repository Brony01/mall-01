const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discount: { type: Number, required: true },
    minSpend: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    isClaimed: { type: Boolean, default: false },
});

const userCouponSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coupons: [couponSchema]
});

const CouponModel = mongoose.model('UserCoupons', userCouponSchema);

module.exports = CouponModel;
