const mongoose = require('mongoose');

// Define Schema (describes the structure of documents)
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    parentId: { type: String, required: true, default: '0' },
    update_at: { type: Date, default: Date.now }
});

// Define Model (corresponds to collection and can operate on the collection)
const CategoryModel = mongoose.model('categorys', categorySchema);

// Export the Model
module.exports = CategoryModel;
