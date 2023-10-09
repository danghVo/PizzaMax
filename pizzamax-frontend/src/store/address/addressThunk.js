import { createAsyncThunk } from '@reduxjs/toolkit';

import { addressService, userService } from '~/services';

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
