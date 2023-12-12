const errorHandle = (result, drivenError) => {
    if (result.status === 500) {
        drivenError();
    }
};

export default errorHandle;
