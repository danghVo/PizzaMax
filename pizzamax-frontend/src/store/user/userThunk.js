import { createAsyncThunk } from '@reduxjs/toolkit';

import { userService, authService, productService } from '~/services';
import { cartSlice } from '../cart';

export const login = createAsyncThunk('user/login', async (payload, { dispatch }) => {
    const result = await authService.login(payload);

    if (result.carts) dispatch(cartSlice.actions.setCartFromUser(result.carts));

    return result;
});

export const getInforByToken = createAsyncThunk('user/getInforByToken', async (payload, { dispatch }) => {
    const result = await userService.getInforByToken(payload);
    dispatch(cartSlice.actions.setCartFromUser(result.carts));

    return result;
});

export const register = createAsyncThunk('user/register', async (payload, { dispatch }) => {
    const result = await userService.register(payload);

    return result;
});

export const logOut = createAsyncThunk('user/logOut', async (payload, { dispatch }) => {
    const result = await authService.logOut();

    return result;
});

export const addFavor = createAsyncThunk('user/addFavor', async (payload, { getState }) => {
    const result = await userService.addFavor({ ...payload, uuid: getState().user.uuid });

    return { result, data: payload };
});

export const removeFavor = createAsyncThunk('user/removeFavor', async (payload, { getState }) => {
    const result = await userService.removeFavor({ ...payload, uuid: getState().user.uuid });

    return { result, data: payload };
});
