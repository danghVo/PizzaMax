import { createSlice } from '@reduxjs/toolkit';
import { addBanner, getBanner, removeBanner, updateBanner } from './systemThunk';

const systemSlice = createSlice({
    name: 'system',
    initialState: {
        vnp_result: null,
        inform: {
            message: '',
            type: '',
        },
        login: false,
        orderInform: 0,
        orderInformMessage: [],
        banners: [],
        formApiStatus: {
            status: null,
            errMessage: '',
        },
        reFetch: false,
    },
    reducers: {
        updateResult(state, action) {
            state.vnp_result = action.payload;
        },
        setInform(state, action) {
            state.inform.type = action.payload.type;
            state.inform.message = action.payload.message;
        },
        requireLogin(state, action) {
            state.login = action.payload;
        },
        orderInform(state, action) {
            state.orderInform += 1;
            state.orderInformMessage.push(action.payload);
        },
        setApiStart(state, action) {
            if (action.payload) {
                state.formApiStatus.status = action.payload;
            } else
                state.formApiStatus = {
                    status: null,
                    errorMessage: '',
                };
        },
        reFetch(state, action) {
            state.reFetch = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBanner.fulfilled, (state, action) => {
                state.banners = action.payload;
            })
            .addCase(addBanner.fulfilled, (state, action) => {
                const result = action.payload;
                if (result.error) {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'error';
                } else {
                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };

                    state.banners = action.payload;
                }
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                const result = action.payload;
                if (result.error) {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'error';
                } else {
                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };

                    state.banners = action.payload;
                }
            })
            .addCase(removeBanner.fulfilled, (state, action) => {
                const result = action.payload;
                if (result.error) {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'error';
                } else {
                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };

                    state.banners = action.payload;
                }
            });
    },
});

export default systemSlice;
