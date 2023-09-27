import * as httpRequest from '~/utils/httpRequest';

const path = 'product/';

const dataTransform = (data) => {
    return data.map((item) => ({
        ...item,
        discOptions: item.discOptions.map((disc) => ({
            ...disc,
            subOptions: disc.subOptions.sort((a, b) => a.price - b.price),
        })),
    }));
};

export const getAll = async () => {
    const res = await httpRequest.get(path + 'getAll');

    return dataTransform(res);
};
