const fs = require('fs');
const path = require('path');
const routers = {};

fs.readdirSync(__dirname)
    .filter((file) => file != 'index.js' && file.indexOf('.') !== undefined)
    .forEach((file) => {
        const route = require(path.join(__dirname, file));

        routers[route.name] = route.router;
    });

module.exports = routers;
