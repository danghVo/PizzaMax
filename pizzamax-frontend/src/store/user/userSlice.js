import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userService, authService } from '~/services';
import { checkFailMessage } from '~/utils';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: '',
        phoneNumber: '',
        farvoriteList: [],
        isAdmin: '',
        api: {
            message: '',
            status: '',
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, () => {})

            .addCase(register.fulfilled, (state, action) => {
                const result = action.payload;
                const status = result.split(' ')[0];
                const message = result.replace(status, '').trim();
                if (parseInt(status)) {
                    state.api.status = 'fail';
                    state.api.message = message;
                } else state.api.status = 'success';
            })

            .addCase(login.fulfilled, (state, action) => {
                const result = action.payload;

                const isFail = checkFailMessage(result);
                if (isFail) {
                    state.api.status = 'fail';
                    state.api.message = isFail;
                } else {
                    state.name = result.name;
                    state.phoneNumber = result.phoneNumber;
                    state.isAdmin = result.isAdmin;
                    state.api.status = 'success';
                }
            })

            .addCase(getInforByToken.fulfilled, (state, action) => {
                const result = action.payload;
                const isFail = checkFailMessage(result);
                if (!isFail) {
                    state.name = result.name;
                    state.phoneNumber = result.phoneNumber;
                    state.isAdmin = result.isAdmin;
                    state.api.status = 'success';
                }
            });
    },
});

export const login = createAsyncThunk('user/login', async (payload, { dispatch }) => {
    const result = await authService.login(payload);

    return result;
});

export const getInforByToken = createAsyncThunk('user/getInforByToken', async (payload, { dispatch }) => {
    const result = await userService.getInforByToken(payload);

    return result;
});

export const register = createAsyncThunk('user/register', async (payload, { dispatch }) => {
    const message = await userService.register(payload);

    return message;
});

export default userSlice;
