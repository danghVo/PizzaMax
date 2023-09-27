import * as httpRequest from '~/utils/httpRequest';

const path = 'user/';

export const register = async (payload, option = {}) => {
    const res = await httpRequest.post(path + 'register', payload, option);

    return res;
};

export const getInforByToken = async (option = {}) => {
    const res = await httpRequest.get(path + 'getInforByToken');

    return res;
};
