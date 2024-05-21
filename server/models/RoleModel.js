const mongoose = require('mongoose');

// Define Schema (describes the structure of documents)
const roleSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Role name
    auth_name: { type: String }, // Authorizer's name
    auth_time: { type: Number }, // Authorization time
    create_time: { type: Number, default: Date.now }, // Creation time
    menus: { type: [String], default: [] } // Array of authorized menu paths
});

// Define Model (corresponds to the collection and can operate on it)
const RoleModel = mongoose.model('roles', roleSchema);

// Export the Model
module.exports = RoleModel;
