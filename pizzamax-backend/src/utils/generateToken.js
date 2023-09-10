const jwt = require('jsonwebtoken');

module.exports = function generateToken(data, secretKey, expireIn = '15m') {
    return jwt.sign(
        data,
        secretKey,
        expireIn && {
            expiresIn: expireIn,
        },
    );
};
