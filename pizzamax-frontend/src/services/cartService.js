import { httpRequest } from '~/utils';

const path = 'cart/';

export const addToCart = async (payload, option = {}) => {
    const res = await httpRequest.post(path + payload.uuid + '/addToCart', payload);

    return res;
};

export const removeFromCart = async (payload, option = {}) => {
    const res = await httpRequest.destroy(path + payload.uuid + '/removeFromCart/' + payload.detailUUID);

    return res;
};

export const increase = async (payload, option = {}) => {
    const res = await httpRequest.patch(path + payload.uuid + '/updateProduct/' + payload.detailUUID, {
        quantity: payload.quantity,
    });

    return res;
};

export const decrease = async (payload, option = {}) => {
    const res = await httpRequest.patch(path + payload.uuid + '/updateProduct/' + payload.detailUUID, {
        quantity: payload.quantity,
    });

    return res;
};
