export let cartStatus = '';

const operateCartStatus = (statusId) => {
    switch (statusId) {
        case 1: {
            cartStatus = 'Thanh toán';
            return cartStatus;
        }
        case 2: {
            cartStatus = 'Chờ nhận hàng';
            return cartStatus;
        }
        default: {
        }
    }
};

export default operateCartStatus;
