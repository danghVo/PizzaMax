import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userService } from '~/services';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: '',
        phoneNumber: '',
        farvoriteList: [],
        message: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, () => {})
            .addCase(register.fulfilled, (state, action) => {
                state.message = action.payload;
            });
    },
});

export const login = createAsyncThunk('user/login', async (payload, { dispatch }) => {});

export const register = createAsyncThunk('user/register', async (payload, { dispatch }) => {
    const message = await userService.register(payload);

    return message;
});

export default userSlice;
