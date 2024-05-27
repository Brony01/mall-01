const mongoose = require('mongoose');

// Define Schema (describes the structure of documents)
const productSchema = new mongoose.Schema({
    categoryId: { type: String, required: true }, // ID of the category to which the product belongs
    pCategoryId: { type: String, required: true }, // ID of the parent category of the category to which the product belongs
    name: { type: String, required: true }, // Name of the product
    price: { type: Number, required: true }, // Price of the product
    desc: { type: String }, // Description of the product
    status: { type: Number, default: 1 }, // Product status: 1 for on sale, 2 for discontinued
    imgs: { type: [String], default: [] }, // Array of image filenames
    detail: { type: String }, // Detailed description of the product
    visitCount: { type: Number, default: 0 }, // Number of visits
    favoriteCount: { type: Number, default: 0 }, // Number of times favorited
    orderCount: { type: Number, default: 0 } // Number of times ordered
});

// Define Model (corresponds to the collection and can operate on it)
const ProductModel = mongoose.model('products', productSchema);

// Export the Model
module.exports = ProductModel;
