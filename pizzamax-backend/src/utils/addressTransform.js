module.exports = function addressTransform(address) {
    return (
        // `${address.houseNumber ? address.houseNumber + ',' : ''}` +
        `${address.alley ? 'Hẻm ' + address.alley + ',' : ''}` +
        `${address.street ? 'Đường ' + address.street + ',' : ''}` +
        `${(address.ward || '') + ','}` +
        `${address.district ? 'Quận ' + address.district + ',' : ''}` +
        `${address.City?.name || ''},Việt Nam`
    );
};
