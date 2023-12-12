import { createAsyncThunk } from '@reduxjs/toolkit';

import { productService, timesService, typesService, discountService } from '~/services';
import { systemSlice } from '../system';

export const transformProductList = (res) => {
    const types = res.products.reduce(
        (accu, curr) => (accu.includes(curr.type) ? [...accu] : [...accu, curr.type]),
        [],
    );

    const products = types.map((type) => {
        let products = res.products.filter((item) => item.type === type);

        return {
            type: type,
            products,
        };
    });

    return {
        ...res,
        products,
    };
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const res = await productService.getAll();

    return transformProductList(res);
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (payload) => {
    const res = await productService.updateProduct(payload);

    return transformProductList(res);
});

export const addProduct = createAsyncThunk('products/addProducts', async (payload) => {
    const res = await productService.addProduct(payload);

    return transformProductList(res);
});

export const deleteProduct = createAsyncThunk('products/deleteProducts', async (payload, { dispatch }) => {
    const res = await productService.deleteProduct(payload);

    if (res.error) {
        dispatch(systemSlice.actions.setInform({ type: 'error', message: res.error }));
        return res;
    }

    return transformProductList(res);
});

export const toggleHideProduct = createAsyncThunk('products/toggleHideProduct', async (payload, { dispatch }) => {
    const res = await productService.toggleHideProduct(payload);

    if (res.error) {
        dispatch(systemSlice.actions.setInform({ type: 'error', message: res.error }));
        return res;
    }

    return transformProductList(res);
});

export const typesDetail = createAsyncThunk('products/typesDetail', async () => {
    const res = await typesService.getTypesDetail();

    return res;
});

export const addType = createAsyncThunk('products/addType', async (payload) => {
    const res = await typesService.addType(payload);

    return res;
});

export const updateType = createAsyncThunk('products/updateType', async (payload) => {
    const res = await typesService.updateType(payload);

    return res;
});

export const deleteType = createAsyncThunk('products/deleteType', async (payload, { dispatch }) => {
    const res = await typesService.deleteType(payload);

    if (res.error) {
        dispatch(systemSlice.actions.setInform({ type: 'error', message: res.error }));
        return res;
    }

    return res;
});

export const timesDetail = createAsyncThunk('products/timesDetail', async () => {
    const res = await timesService.getTimesDetail();

    return res;
});

export const addTime = createAsyncThunk('products/addTime', async (payload) => {
    const res = await timesService.addTime(payload);

    return res;
});

export const updateTime = createAsyncThunk('products/updateTime', async (payload) => {
    const res = await timesService.updateTime(payload);

    return res;
});

export const deleteTime = createAsyncThunk('products/deleteTime', async (payload, { dispatch }) => {
    const res = await timesService.deleteTime(payload);

    if (res.error) {
        dispatch(systemSlice.actions.setInform({ type: 'error', message: res.error }));
        return res;
    }

    return res;
});

export const discountsDetail = createAsyncThunk('products/discountsDetail', async () => {
    const res = await discountService.getDiscountsDetail();

    return res;
});

export const addDiscount = createAsyncThunk('products/addDiscount', async (payload) => {
    const res = await discountService.addDiscount(payload);

    return res;
});

export const updateDiscount = createAsyncThunk('products/updateDiscount', async (payload) => {
    const res = await discountService.updateDiscount(payload);

    return res;
});

export const deleteDiscount = createAsyncThunk('products/deleteDiscount', async (payload, { dispatch }) => {
    const res = await discountService.deleteDiscount(payload);

    if (res.error) {
        dispatch(systemSlice.actions.setInform({ type: 'error', message: res.error }));
        return res;
    }

    return res;
});
