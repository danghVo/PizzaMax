import * as httpRequest from '~/utils/httpRequest';
import { dataTransform } from '~/utils';

const path = 'admin/user/';

export const getAllUser = async () => {
    const userList = await httpRequest.get(path + 'getAll');

    return userList.map((user) => dataTransform.user(user));
};

export const createAdmin = async (payload) => {
    const res = await httpRequest.post(path + 'createAdmin', payload);

    if (res.error) {
        return res;
    }

    return res.map((user) => dataTransform.user(user));
};
