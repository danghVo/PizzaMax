const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const routers = require('./router/authRouter');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

app.use(cors({ origin: true }));
app.use(express.json());

Object.values(routers).forEach((router) => {
    app.use('/api/auth', router);
});

app.listen({ port: 4001 }, async () => {
    console.log(`Server on port 4001`);
});
