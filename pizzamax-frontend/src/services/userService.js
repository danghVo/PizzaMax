import * as httpRequest from '~/utils/httpRequest';

const path = 'user/';

export const register = async (payload, option = {}) => {
    const res = await httpRequest.post(path + 'register', payload, option);
    const status = res.split(' ')[0];
    const message = res.replace(status, '').trim();

    return parseInt(status) ? message : '';
};
