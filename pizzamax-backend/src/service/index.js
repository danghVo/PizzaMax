const fs = require('fs');
const path = require('path');
const services = {};

fs.readdirSync(__dirname)
    .filter((file) => file != 'index.js')
    .forEach((file) => {
        const service = require(path.join(__dirname, file));

        services[service.serviceName] = service;
    });

module.exports = services;
