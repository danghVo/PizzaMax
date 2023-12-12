import * as httpRequest from '~/utils/httpRequest';
import { dataTransform } from '~/utils';

const path = 'user/';

export const register = async (payload, option = {}) => {
    const res = await httpRequest.post(path + 'register', payload, option);

    return res;
};

export const getInforByToken = async (option = {}) => {
    const res = await httpRequest.get(path + 'getInforByToken');

    return dataTransform.user(res);
};

export const addAddress = async (payload, option = {}) => {
    const res = await httpRequest.post(path + payload.uuid + '/addAddress', { ...payload, uuid: undefined });

    return {
        addresses: dataTransform.address(res),
        rawAddresses: res,
    };
};

export const getAllUserAddress = async (payload, option = {}) => {
    const res = await httpRequest.get(path + payload.uuid + '/getAllAddress');

    return {
        addresses: dataTransform.address(res),
        rawAddresses: res,
    };
};

export const addFavor = async (payload, option = {}) => {
    const res = await httpRequest.post(path + payload.uuid + '/addFavor/' + payload.productId);

    return res;
};

export const removeFavor = async (payload, option = {}) => {
    const res = await httpRequest.destroy(path + payload.uuid + '/removeFavor/' + payload.productId);

    return res;
};

export const createNewCart = async (payload, option = {}) => {
    const res = await httpRequest.post(path + payload.uuid + '/createNewCart', {
        ...payload,
    });

    return {
        ...res,
        currentCart: dataTransform.cart(res.currentCart),
    };
};

export const addAvatar = async (payload, option = {}) => {
    const res = await httpRequest.patch(
        path + payload.uuid + '/addAvatar',
        { image: payload.file },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );

    if (res.error) {
        return res;
    }

    return dataTransform.user(res);
};

export const updateUser = async (payload, option = {}) => {
    const res = await httpRequest.patch(path + payload.uuid + '/update', payload);

    if (res.error) {
        return res;
    }

    return dataTransform.user(res);
};

export const updateUserAddress = async (payload, option = {}) => {
    const res = await httpRequest.patch(path + payload.uuid + '/updateAddress/' + payload.addressId, payload);

    if (res.error) {
        return res;
    }

    return {
        addresses: dataTransform.address(res),
        rawAddresses: res,
    };
};

export const deleteUserAddress = async (payload, option = {}) => {
    const res = await httpRequest.destroy(path + payload.uuid + '/deleteAddress/' + payload.addressId);

    if (res.error) {
        return res;
    }

    return {
        addresses: dataTransform.address(res),
        rawAddresses: res,
    };
};
