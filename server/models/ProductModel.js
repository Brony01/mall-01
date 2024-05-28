const mongoose = require('mongoose');

// Define Schema (describes the structure of documents)
const productSchema = new mongoose.Schema({
    categoryId: { type: String, required: true },
    pCategoryId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String },
    status: { type: Number, default: 1 },
    imgs: { type: [String], default: [] },
    detail: { type: String },
    visitCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    seckillPrice: { type: Number }, // 秒杀价格
    seckillStock: { type: Number }, // 秒杀库存
    seckillStart: { type: Date }, // 秒杀开始时间
    seckillEnd: { type: Date } // 秒杀结束时间
});

// Define Model (corresponds to the collection and can operate on it)
const ProductModel = mongoose.model('products', productSchema);

// Export the Model
module.exports = ProductModel;
