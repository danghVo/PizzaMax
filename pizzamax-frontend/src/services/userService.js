import * as httpRequest from '~/utils/httpRequest';
import { dataTransform } from '~/utils';

const path = 'user/';

export const register = async (payload, option = {}) => {
    const res = await httpRequest.post(path + 'register', payload, option);

    return dataTransform.user(res);
};

export const getInforByToken = async (option = {}) => {
    const res = await httpRequest.get(path + 'getInforByToken');

    return dataTransform.user(res);
};

export const addAddress = async (payload, option = {}) => {
    const res = await httpRequest.post(path + payload.uuid + '/addAddress', { ...payload, uuid: undefined });

    return res;
};

export const getAllUserAddress = async (payload, option = {}) => {
    const res = await httpRequest.get(path + payload.uuid + '/getAllAddress');

    return dataTransform.address(res);
};

export const addFavor = async (payload, option = {}) => {
    const res = await httpRequest.post(path + payload.uuid + '/addFavor/' + payload.productId);

    return res;
};

export const removeFavor = async (payload, option = {}) => {
    const res = await httpRequest.destroy(path + payload.uuid + '/removeFavor/' + payload.productId);

    return res;
};
