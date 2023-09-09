import axios from 'axios';

const flagRequest = axios.create({
    baseURL: process.env.REACT_APP_FLAG_URL,
});

export const get = async (path, option = {}) => {
    const respone = await flagRequest.get(path, option);

    return respone.data;
};
