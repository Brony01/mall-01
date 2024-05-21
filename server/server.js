const express = require('express');
const cors = require('cors');
const app = express();
const server_port = require('./config/config.default').server_port;
const connectMongo = require('./db/connect');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// 配置 CORS 中间件
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const indexRouter = require('./routers');

function verifyToken(token) {
    let cert = fs.readFileSync(path.join(__dirname, './config/rsa_public_key.pem'));
    try {
        let result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {};
        let { exp = 0 } = result, current = Math.floor(Date.now() / 1000);
        if (current <= exp) {
            res = result.data || {};
        }
    } catch (e) {

    }
    return res;
}

app.use((req, res, next) => {
    let token = req.headers.authorization;
    const cookie = req.cookies;
    const url = req.url;
    let cert = fs.readFileSync(path.join(__dirname, './config/rsa_public_key.pem'));
    if (url.indexOf('/api/login') !== 0) {
        try {
            let result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {};
            let { exp = 0 } = result, current = Math.floor(Date.now() / 1000);
            req.payload = result;
            if (current <= exp) {
                res.setHeader('Cache-Control', 'no-cache');
                next();
            }
        } catch (e) {
            if (url.indexOf('/api/refreshtoken') !== -1) {
                next();
                return;
            }
            res.status(200);
            res.send({ status: 1000, msg: '登录信息失效，请重新登录' });
        }
    } else {
        next();
    }
});

app.use('/api', require('./routers'));

const startServer = function () {
    app.listen(server_port, () => {
        logger.info('服务器启动成功, 监听端口:' + server_port);
    });
}

connectMongo(startServer);
