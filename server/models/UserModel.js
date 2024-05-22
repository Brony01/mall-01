const mongoose = require('mongoose');
const md5 = require('blueimp-md5');

// Define Schema (describes the structure of documents)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Username
    password: { type: String, required: true }, // Password
    phone: { type: String }, // Phone number
    email: { type: String }, // Email address
    create_time: { type: Number, default: Date.now }, // Creation time
    role_id: { type: String } // Role ID
});

// Define Model (corresponds to the collection and can operate on it)
const UserModel = mongoose.model('users', userSchema);

// Initialize default super admin user if not exists
const initializeAdminUser = async () => {
    const userExists = await UserModel.findOne({ username: 'admin' }).exec();
    if (!userExists) {
        const hashedPassword = md5('admin');
        await UserModel.create({ username: 'admin', password: hashedPassword });
        console.log('Initialized super admin user: Username: admin, Password: admin');
    }
};

initializeAdminUser();

// Export the Model
module.exports = UserModel;
