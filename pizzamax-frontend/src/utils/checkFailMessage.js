const checkFailMessage = (respone) => {
    if (typeof respone !== 'string') return false;

    return respone;
};

export default checkFailMessage;
