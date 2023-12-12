import * as httpRequest from '~/utils/httpRequest';

const path = 'banner/';

export const getAllBanner = async () => {
    const res = await httpRequest.get(path + 'getAll');

    return res;
};

export const addBanner = async (payload) => {
    const res = await httpRequest.post('admin/' + path + 'create', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res;
};

export const updateBanner = async (payload) => {
    const res = await httpRequest.patch('admin/' + path + payload.id + '/update', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res;
};

export const removeBanner = async (payload) => {
    const res = await httpRequest.destroy('admin/' + path + payload.id + '/delete', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res;
};
