import { createAsyncThunk } from '@reduxjs/toolkit';

import { addressService, userService } from '~/services';
import { systemSlice } from '../system';
import { address } from '~/utils/dataTransform';
import addressSlice from './addressSlice';

export const getAllShopAddress = createAsyncThunk('address/getAllShopAddress', async () => {
    const res = await addressService.getAllShopAddress();

    return res;
});

export const getAllUserAddress = createAsyncThunk('address/getAllUserAddress', async (payload) => {
    const res = await userService.getAllUserAddress(payload);

    return res;
});

export const addAddressByUser = createAsyncThunk('address/addAddressByUser', async (payload) => {
    const res = await userService.addAddress(payload);

    return res;
});

export const addShopAddress = createAsyncThunk('address/addShopAddress', async (payload) => {
    const res = await addressService.addShopAddress(payload);

    return res;
});

export const updateShopAddress = createAsyncThunk('address/updateShopAddress', async (payload) => {
    const res = await addressService.updateShopAddress(payload);

    return res;
});

export const deleteShopAddress = createAsyncThunk('address/deleteShopAddress', async (payload, { dispatch }) => {
    const res = await addressService.deleteShopAddress(payload);

    if (res.error) {
        return dispatch(
            systemSlice.actions.setInform({
                type: 'error',
                message: res.error,
            }),
        );
    }

    return res;
});
