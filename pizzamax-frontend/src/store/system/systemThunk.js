import { createAsyncThunk } from '@reduxjs/toolkit';
import { bannerService } from '~/services';

export const getBanner = createAsyncThunk('banner/getBanner', async () => {
    const res = await bannerService.getAllBanner();

    return res;
});

export const addBanner = createAsyncThunk('banner/addBanner', async (payload) => {
    const res = await bannerService.addBanner(payload);

    return res;
});

export const updateBanner = createAsyncThunk('banner/updateBanner', async (payload) => {
    const res = await bannerService.updateBanner(payload);

    return res;
});

export const removeBanner = createAsyncThunk('banner/removeBanner', async (payload) => {
    const res = await bannerService.removeBanner(payload);

    return res;
});
