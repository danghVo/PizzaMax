const convertDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', { timeZone: 'UTC' });
};

export default convertDate;
