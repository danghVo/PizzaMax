import * as httpRequest from '~/utils/httpRequest';
import { dataTransform } from '~/utils';

const path = 'admin/discount/';

export const getDiscountsDetail = async () => {
    const res = await httpRequest.get(path + 'getAll');

    return dataTransform.discount(res);
};

export const addDiscount = async (payload) => {
    const res = await httpRequest.post(path + 'create', payload);

    if (res.error) {
        return res;
    }

    return dataTransform.discount(res);
};

export const updateDiscount = async (payload) => {
    const res = await httpRequest.patch(path + 'update/' + payload.id, payload);

    if (res.error) {
        return res;
    }

    return dataTransform.discount(res);
};

export const deleteDiscount = async (payload) => {
    const res = await httpRequest.destroy(path + 'delete/' + payload.id);

    if (res.error) {
        return res;
    }

    return dataTransform.discount(res);
};
