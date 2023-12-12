import * as httpRequest from '~/utils/httpRequest';
import { dataTransform } from '~/utils';

const path = 'admin/type/';

export const getTypesDetail = async () => {
    const res = await httpRequest.get('type/getAll');

    return dataTransform.type(res);
};

export const addType = async (payload) => {
    const res = await httpRequest.post(path + 'create', {
        name: payload.name,
        timeId: payload.timeId,
    });

    if (res.error) {
        return res;
    }

    return dataTransform.type(res);
};

export const updateType = async (payload) => {
    const res = await httpRequest.patch(path + 'update/' + payload.id, {
        name: payload.name,
        timeId: payload.timeId,
    });

    if (res.error) {
        return res;
    }

    return dataTransform.type(res);
};

export const deleteType = async (payload) => {
    const res = await httpRequest.destroy(path + 'delete/' + payload.id);

    if (res.error) {
        return res;
    }

    return dataTransform.type(res);
};
