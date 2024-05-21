const mongoose = require('mongoose');
const config = require('../config/config.default');

let isConnectedBefore = false;

const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
    autoReconnect: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};

const connectWithCallback = callback => {
    mongoose.connect(config.dataBase, options, error => {
        if (!error) {
            callback();
        }
    });
};

mongoose.connection.on('error', () => {
    console.log('Could not connect to MongoDB. 请确保启动MongoDB服务');
});

mongoose.connection.on('disconnected', () => {
    console.log('Lost MongoDB connection...');
    if (!isConnectedBefore) {
        connectWithCallback(() => console.log('Attempting to reconnect to MongoDB...'));
    }
});

mongoose.connection.on('connected', () => {
    isConnectedBefore = true;
    console.log('Connection established to MongoDB');
});

mongoose.connection.on('reconnected', () => {
    console.log('Reconnected to MongoDB');
});

// Close the Mongoose connection when receiving SIGINT (e.g., Ctrl+C)
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Force to close the MongoDB connection');
        process.exit(0);
    });
});

module.exports = connectWithCallback;
