import axios from 'axios';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true,
});

httpRequest.interceptors.response.use(
    (respone) => {
        return respone;
    },
    async (error) => {
        if (error.response.data.error === 'jwt expired') {
            await httpRequest.get('/auth/refreshToken');
            const prevRequest = error?.config;
            prevRequest.sent = true;
            return await httpRequest(prevRequest);
        } else if (error.response.data.error === 'Session expired') {
            alert('Phiên đăng nhập hết hạn');
            window.location.href = '/';
            return await httpRequest.get('/auth/logout');
        } else if (error.response.data.error === 'invalid signature') {
            alert('Phiên đăng nhập hết hạn');
            window.location.href = '/';
            return await httpRequest.get('/auth/logout');
        }

        return Promise.resolve(error).then((error) => error.response);
    },
);

export const get = async (path, option = {}) => {
    const response = await httpRequest.get(path, option);

    return response.data;
};

export const post = async (path, payload, option = {}) => {
    const response = await httpRequest.post(path, payload, option);

    return response.data;
};

export const patch = async (path, payload, option = {}) => {
    const response = await httpRequest.patch(path, payload, option);

    return response.data;
};

export const destroy = async (path, option = {}) => {
    const response = await httpRequest.delete(path, option);

    return response.data;
};
