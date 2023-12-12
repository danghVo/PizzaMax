import * as httpRequest from '~/utils/httpRequest';
import { dataTransform } from '~/utils';

const path = 'product/';

export const getAll = async () => {
    const res = await httpRequest.get(path + 'getAllProducts');

    return dataTransform.product(res);
};

export const addProduct = async (payload) => {
    const res = await httpRequest.post('admin/' + path + 'create', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return dataTransform.product(res);
};

export const updateProduct = async (payload) => {
    const id = payload.id;

    const res = await httpRequest.patch('admin/' + path + 'update/' + id, payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return dataTransform.product(res);
};

export const deleteProduct = async (payload) => {
    const res = await httpRequest.destroy('admin/' + path + 'delete/' + payload.productId);

    if (res.error) {
        return res;
    }

    return dataTransform.product(res);
};

export const toggleHideProduct = async (payload) => {
    const res = await httpRequest.patch('admin/' + path + 'toggleHide/' + payload.productId);

    if (res.error) {
        return res;
    }

    return dataTransform.product(res);
};
