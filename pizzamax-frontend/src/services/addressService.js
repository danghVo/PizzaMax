import * as httpRequest from '~/utils/httpRequest';
import { dataTransform } from '~/utils';

const path = 'address/';

export const getAllShopAddress = async () => {
    const res = await httpRequest.get(path + 'getAllShopAddress');

    return dataTransform.address(res);
};
