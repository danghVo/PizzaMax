const jwt = require('jsonwebtoken');

module.exports = function generateToken(data, secretKey, expiresIn = '15m') {
    return jwt.sign(data, secretKey, expiresIn ? { expiresIn } : {});
};
