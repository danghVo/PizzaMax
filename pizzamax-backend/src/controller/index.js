const fs = require('fs');
const path = require('path');
const controllers = {};

fs.readdirSync(__dirname)
    .filter((file) => file != 'index.js')
    .forEach((file) => {
        const controller = require(path.join(__dirname, file));

        controllers[controller.controllerName] = controller;
    });

module.exports = controllers;
