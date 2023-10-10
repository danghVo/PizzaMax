import axios from 'axios';

const districtRequest = axios.create({
    baseURL: process.env.REACT_APP_DISTRICT_URL,
});

export const get = async (path, option = {}) => {
    const respone = await districtRequest.get(path, option);

    return respone.data;
};
