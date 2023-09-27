module.exports = function randomBytes(byte = 32) {
    const randomByte = crypto.randomBytes(byte).toString('hex');

    return randomByte;
};

const crypto = require('crypto');
