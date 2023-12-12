import * as httpRequest from '~/utils/httpRequest';
import { checkFailMessage, dataTransform } from '~/utils';

const path = 'auth/';

export const login = async (payload, option = {}) => {
    const res = await httpRequest.post(path + 'login', payload, option);

    return {
        ...res,
        carts: res.carts
            ? {
                  carts: res.carts.carts.map((cart) => dataTransform.cart(cart)),
                  currentCart: dataTransform.cart(res.carts.currentCart),
              }
            : null,
    };
};

export const refreshToken = async (payload, option = {}) => {
    const res = await httpRequest.post(path + 'refreshToken');
};

export const logOut = async (payload, option = {}) => {
    const res = await httpRequest.get(path + 'logout');

    return res;
};
