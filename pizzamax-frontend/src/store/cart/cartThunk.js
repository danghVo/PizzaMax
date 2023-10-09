import { createAsyncThunk } from '@reduxjs/toolkit';

import { cartService } from '~/services';

export const addToCart = createAsyncThunk('cart/addToCart', async (payload, { getState }) => {
    const cart = await cartService.addToCart({ ...payload, uuid: getState().cart.uuid });

    return cart;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (payload, { getState }) => {
    const cart = await cartService.removeFromCart({ detailUUID: payload.detail.uuid, uuid: getState().cart.uuid });

    return cart;
});

export const increase = createAsyncThunk('cart/increase', async (payload, { getState }) => {
    const cart = await cartService.increase({
        detailUUID: payload.detail.uuid,
        uuid: getState().cart.uuid,
        quantity: payload.detail.quantity + 1,
    });

    return cart;
});

export const decrease = createAsyncThunk('cart/decrease', async (payload, { getState }) => {
    const cart = await cartService.decrease({
        detailUUID: payload.detail.uuid,
        uuid: getState().cart.uuid,
        quantity: payload.detail.quantity - 1,
    });

    return cart;
});

export const checkOut = () => {};
