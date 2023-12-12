export default function checkDiscountAvail(discount) {
    if (!discount) return false;

    const startAt = Date.parse(discount.startAt);
    const endAt = Date.parse(discount.endAt);

    const now = Date.now();
    if (startAt <= now && endAt >= now) {
        return true;
    } else return false;
}
