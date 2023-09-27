import * as httpRequest from '~/utils/httpRequest';
import { checkFailMessage } from '~/utils';

const path = 'auth/';

export const login = async (payload, option = {}) => {
    const res = await httpRequest.post(path + 'login', payload, option);

    return res;
};

export const refreshToken = async (payload, option = {}) => {
    const res = await httpRequest.post(path + 'refreshToken');

    const failMessage = checkFailMessage(res);

    if (!failMessage) {
        window.localStorage.setItem(
            'token',
            JSON.stringify({ accessToken: res.accessToken, refreshToken: res.refreshToken }),
        );
    }

    return failMessage;
};
