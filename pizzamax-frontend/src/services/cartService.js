import { httpRequest, dataTransform } from '~/utils';

const path = 'cart/';

export const addToCart = async (payload, option = {}) => {
    const res = await httpRequest.post(path + payload.uuid + '/addToCart', payload);

    return dataTransform.cart(res);
};

export const removeFromCart = async (payload, option = {}) => {
    const res = await httpRequest.destroy(path + payload.uuid + '/removeFromCart/' + payload.detailUUID);

    return dataTransform.cart(res);
};

export const increase = async (payload, option = {}) => {
    const res = await httpRequest.patch(path + payload.uuid + '/updateProduct/' + payload.detailUUID, {
        quantity: payload.quantity,
    });

    return dataTransform.cart(res);
};

export const decrease = async (payload, option = {}) => {
    const res = await httpRequest.patch(path + payload.uuid + '/updateProduct/' + payload.detailUUID, {
        quantity: payload.quantity,
    });

    return dataTransform.cart(res);
};

export const getDeliveryCharge = async (payload, option = {}) => {
    const res = await httpRequest.post(path + payload.uuid + '/getDeliveryCharge', {
        addressId: payload.addressId,
    });

    return dataTransform.cart(res);
};

export const checkout = async (payload, option = {}) => {
    const res = await httpRequest.patch(path + payload.uuid + '/checkout', {
        addressId: payload.addressId,
        orderWayId: payload.orderWayId,
        paymentWayId: payload.paymentWayId,
    });

    return dataTransform.cart(res);
};

export const getAllCart = async () => {
    const res = await httpRequest.get('admin/' + path + 'getAll');

    return dataTransform.filterCart(res);
};

export const updateCartStatus = async (payload) => {
    const res = await httpRequest.patch('admin/' + path + payload.uuid + '/updateStatus', {
        statusId: payload.statusId,
    });

    return dataTransform.filterCart(res);
};

export const getAllDetail = async () => {
    const res = await httpRequest.get('admin/' + path + 'getAllDetail');

    return dataTransform.detail(res);
};
