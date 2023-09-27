import axios from 'axios';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true,
});

// httpRequest.interceptors.request.use((config) => {
//     // if(document.cookie)
//     return config;
// });

httpRequest.interceptors.response.use(
    (respone) => respone,
    async (error) => {
        if (error.response.data === 'jwt expired') {
            await httpRequest.get('/auth/refreshToken');
            const prevRequest = error?.config;
            prevRequest.sent = true;
            return await httpRequest(prevRequest);
        }

        return Promise.reject(error);
    },
);

export const get = async (path, option = {}) => {
    const respone = await httpRequest.get(path, option);

    return respone.data;
};

export const post = async (path, payload, option = {}) => {
    const respone = await httpRequest.post(path, payload, option);

    return respone.data;
};
