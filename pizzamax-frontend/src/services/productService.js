import * as httpRequest from '~/utils/httpRequest'

const path = 'product/'

export const getAll = async () => {
    const res = await httpRequest.get(path + 'getAll');

    return res;
};
