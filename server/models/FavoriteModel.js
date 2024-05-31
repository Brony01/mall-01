const mongoose = require('mongoose');

// 定义收藏Schema
const favoriteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: mongoose.Types.ObjectId, ref: 'products' },
            addTime: { type: Number, default: Date.now },
            imgs: { type: [String], default: [] },
        }
    ]
});

// 定义模型
const FavoriteModel = mongoose.model('favorites', favoriteSchema);

// 导出模型
module.exports = FavoriteModel;
