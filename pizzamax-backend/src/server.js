const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { sequelize } = require('./models');
const cookieParser = require('cookie-parser');

const routers = require('./router');
const authRouters = require('./router/authRouter');
const adminRouters = require('./router/adminRouter');
const authenticate = require('./middlewares/authenticate');
const io = require('./socket');

const server = http.createServer(app);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.all(/\/api\/.*/, authenticate);

Object.values(routers).forEach((router) => {
    app.use('/api', router);
});

Object.values(adminRouters).forEach((router) => {
    app.use('/api/admin', router);
});

Object.values(authRouters).forEach((router) => {
    app.use('/api/auth', router);
});

server.listen(4000, async () => {
    console.log(`Server on port 4000`);

    try {
        await sequelize.sync();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

io.attach(server, {
    cors: {
        origin: 'http://localhost:3000',
    },
});
