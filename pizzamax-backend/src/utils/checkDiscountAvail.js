module.exports = function checkDiscountAvail(discount) {
    if (!discount) return false;

    const startAt = new Date(discount.startAt).valueOf();
    const endAt = new Date(discount.endAt).valueOf();
    const now = Date.now();
    if (startAt <= now && endAt >= now) {
        return true;
    } else return false;
};
