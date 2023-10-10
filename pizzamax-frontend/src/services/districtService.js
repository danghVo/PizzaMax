import { districtRequest } from '~/utils';

const provinceCode = {
    ['Cần Thơ']: '92',
    ['Hồ Chí Minh']: '79',
};

export const getDistricts = async (payload) => {
    const res = await districtRequest.get(provinceCode[payload], {
        params: { depth: 2 },
    });

    return res.districts.map((district) => district.name);
};
