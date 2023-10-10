module.exports = function uniqueValue(arr) {
    return arr.reduce((accu, current) => (accu.includes(current) ? accu : [...accu, current]), []);
};
