import { createAsyncThunk } from '@reduxjs/toolkit';

import { userService, authService, productService, userAdminService } from '~/services';
import { cartSlice } from '../cart';
import { systemSlice } from '../system';
import { addressSlice } from '../address';
import { productsSlice } from '../products';

export const login = createAsyncThunk('user/login', async (payload, { dispatch }) => {
    const currentCart = JSON.parse(window.localStorage.getItem('currentCart'));

    const result = await authService.login({ ...payload, currentCart });

    if (!result.error) {
        dispatch(systemSlice.actions.requireLogin(false));
    }

    window.localStorage.removeItem('currentCart');

    if (result.carts) dispatch(cartSlice.actions.setCartFromUser(result.carts));

    return result;
});

export const getInforByToken = createAsyncThunk('user/getInforByToken', async (payload, { dispatch }) => {
    const result = await userService.getInforByToken(payload);

    dispatch(cartSlice.actions.setCartFromUser(result.carts));
    dispatch(productsSlice.actions.setFavoriteOfUser(result.favorite));

    return result;
});

export const register = createAsyncThunk('user/register', async (payload, { dispatch }) => {
    const result = await userService.register(payload);

    return result;
});

export const logOut = createAsyncThunk('user/logOut', async (payload, { dispatch }) => {
    const result = await authService.logOut();

    if (!result.error) {
        dispatch(addressSlice.actions.resetCurrentAddress());
        dispatch(cartSlice.actions.emptyCart());
    }

    return 1;
});

export const addFavor = createAsyncThunk('user/addFavor', async (payload, { getState, dispatch }) => {
    const result = await userService.addFavor({ ...payload, uuid: getState().user.uuid });

    if (!result.error) {
        const favorite = getState().products.favorite;

        dispatch(productsSlice.actions.setFavoriteOfUser(favorite.filter((favor) => favor !== payload.productId)));
    }

    return;
});

export const removeFavor = createAsyncThunk('user/removeFavor', async (payload, { getState, dispatch }) => {
    const result = await userService.removeFavor({ ...payload, uuid: getState().user.uuid });

    if (!result.error) {
        const favorite = getState().products.favorite;
        dispatch(productsSlice.actions.setFavoriteOfUser(result.favorite));
    }

    return;
});

export const getAllUser = createAsyncThunk('user/getAllUser', async () => {
    const result = await userAdminService.getAllUser();

    return result;
});

export const addAvatar = createAsyncThunk('user/addAvatar', async (payload, { dispatch, getState }) => {
    const result = await userService.addAvatar({ ...payload, uuid: getState().user.uuid });

    if (result.error) {
        dispatch(
            systemSlice.actions.setInform({
                type: 'error',
                message: result.error,
            }),
        );
    }

    return result;
});

export const updateUser = createAsyncThunk('user/updateUser', async (payload, { dispatch, getState }) => {
    const result = await userService.updateUser(payload);

    if (result.error) {
        dispatch(
            systemSlice.actions.setInform({
                type: 'error',
                message: result.error,
            }),
        );
    }

    return result;
});

export const updateUserAddress = createAsyncThunk('user/updateUserAddress', async (payload, { dispatch, getState }) => {
    const result = await userService.updateUserAddress(payload);

    return result;
});

export const deleteUserAddress = createAsyncThunk('user/deleteUserAddress', async (payload, { dispatch, getState }) => {
    const result = await userService.deleteUserAddress(payload);

    if (result.error) {
        dispatch(
            systemSlice.actions.setInform({
                type: 'error',
                message: 'Không thể xóa địa chỉ này',
            }),
        );
    }

    return result;
});

export const createAdmin = createAsyncThunk('user/createAdmin', async (payload, { dispatch }) => {
    const result = await userAdminService.createAdmin(payload);

    if (result.error) {
        dispatch(
            systemSlice.actions.setInform({
                type: 'error',
                message: result.error,
            }),
        );
    }

    return result;
});
