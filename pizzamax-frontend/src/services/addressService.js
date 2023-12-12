import * as httpRequest from '~/utils/httpRequest';
import { dataTransform } from '~/utils';

const path = 'address/';

export const getAllShopAddress = async () => {
    const res = await httpRequest.get(path + 'getAllShopAddress');

    return {
        addresses: dataTransform.address(res),
        rawAddresses: res,
    };
};

export const currentLocation = async (payload) => {
    const res = await httpRequest.post(path + 'currentLocation', payload);

    if (res.error) {
        return res;
    }

    return dataTransform.currentAddress(res);
};

export const addShopAddress = async (payload) => {
    const res = await httpRequest.post('admin/' + path + 'addAddress', payload);

    if (res.error) {
        return res;
    }

    return {
        addresses: dataTransform.address(res),
        rawAddresses: res,
    };
};

export const updateShopAddress = async (payload) => {
    const res = await httpRequest.patch('admin/' + path + 'update/' + payload.id, payload);

    if (res.error) {
        return res;
    }

    return {
        addresses: dataTransform.address(res),
        rawAddresses: res,
    };
};

export const deleteShopAddress = async (payload) => {
    const res = await httpRequest.destroy('admin/' + path + 'delete/' + payload.id);

    if (res.error) {
        return res;
    }

    return {
        addresses: dataTransform.address(res),
        rawAddresses: res,
    };
};
