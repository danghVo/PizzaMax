import * as httpRequest from '~/utils/httpRequest';
import { dataTransform } from '~/utils';

const path = 'admin/time/';

export const getTimesDetail = async () => {
    const res = await httpRequest.get(path + 'getAll');

    // return dataTransform.type(res);
    return res;
};

export const addTime = async (payload) => {
    const res = await httpRequest.post(path + 'create', {
        ...payload,
    });

    if (res.error) {
        return res;
    }

    return res;
};

export const updateTime = async (payload) => {
    const res = await httpRequest.patch(path + 'update/' + payload.id, {
        ...payload,
    });

    if (res.error) {
        return res;
    }

    return res;
};

export const deleteTime = async (payload) => {
    const res = await httpRequest.destroy(path + 'delete/' + payload.id);

    if (res.error) {
        return res;
    }

    return res;
};
