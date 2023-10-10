import * as httpRequest from '~/utils/httpRequest';
import { dataTransform } from '~/utils';

const path = 'product/';

export const getAll = async () => {
    const res = await httpRequest.get(path + 'getAllProducts');

    return dataTransform.product(res);
};
