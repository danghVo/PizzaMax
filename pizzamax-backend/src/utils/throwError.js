module.exports = function thowError(code, message) {
    throw new Error(code + ' ' + message).message;
};
