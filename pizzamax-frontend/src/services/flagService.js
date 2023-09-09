import * as flagRequest from '~/utils/flagRequest';

export const getFlag = async () => {
    const res = await flagRequest.get('all');

    const filter = res.filter((item) => {
        return item.idd.suffixes && item.name.common.length < 20;
    });

    return filter;
};
