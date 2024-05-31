const mongoose = require('mongoose');

// 定义足迹Schema
const footprintSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: mongoose.Types.ObjectId, ref: 'products' },
            lastVisited: { type: Date, default: Date.now }, // 添加 lastVisited 字段
            imgs: { type: [String], default: [] }
        }
    ]
});

// 定义模型
const FootprintModel = mongoose.model('footprints', footprintSchema);

// 导出模型
module.exports = FootprintModel;
