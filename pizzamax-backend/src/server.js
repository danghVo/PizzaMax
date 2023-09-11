const express = require('express');
const app = express();
const cors = require('cors');
const { sequelize } = require('./models');

const routers = require('./router');
const authRouters = require('./router/authRouter');
const adminRouters = require('./router/adminRouter');
const authenticate = require('./validation/authenticate')

app.use(cors({ origin: true }));
app.use(express.json());

app.all(/\/api\/.*/, authenticate)

Object.values(routers).forEach((router) => {
    app.use('/api', router);
});

Object.values(adminRouters).forEach((router) => {
    app.use('/api/admin', router);
});

Object.values(authRouters).forEach((router) => {
    app.use('/api/auth', router);
});

app.listen({ port: 4000 }, async () => {
    console.log(`Server on port 4000`);

    try {
        await sequelize.sync();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
