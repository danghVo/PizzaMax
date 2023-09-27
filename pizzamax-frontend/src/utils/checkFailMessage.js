export const checkFailMessage = (respone) => {
    if (typeof respone !== 'string') return null;

    return respone;
};
