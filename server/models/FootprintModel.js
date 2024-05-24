const mongoose = require('mongoose');

// 定义足迹Schema
const footprintSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: String, required: true },
            viewTime: { type: Number, default: Date.now }
        }
    ]
});

// 定义模型
const FootprintModel = mongoose.model('footprints', footprintSchema);

// 导出模型
module.exports = FootprintModel;
