import { createAsyncThunk } from '@reduxjs/toolkit';

import { cartService, userService } from '~/services';
import { systemSlice } from '../system';
import cartSlice from './cartSlice';
import { checkTypeAvail } from '~/utils';

const dataTranformReqAddToCart = (data) => {
    return {
        ...data,
        selection: Object.keys(data.selection).map((section) => ({
            section,
            ...data.selection[section],
            indexSelection: undefined,
        })),
    };
};

export const addToCart = createAsyncThunk('cart/addToCart', async (payload, { getState, dispatch }) => {
    const user = getState().user;
    if (user.phoneNumber === '') {
        const productList = getState().products.rawProducts;
        const productSelected = productList.find((product) => product.name === payload.name);
        const payloadTransform = dataTranformReqAddToCart(payload);

        dispatch(
            cartSlice.actions.addToCart({
                ...productSelected,
                Selection: payloadTransform.selection,
                detail: payloadTransform,
            }),
        );
        return { error: 'chua dang nhap' };
    }

    const cart = await cartService.addToCart({
        ...dataTranformReqAddToCart(payload),
        uuid: getState().cart.currentCart.uuid,
    });

    return cart;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (payload, { getState, dispatch }) => {
    const user = getState().user;
    if (user.phoneNumber === '') {
        dispatch(cartSlice.actions.removeFromCart(payload));
        return { error: 'chua dang nhap' };
    }

    const cart = await cartService.removeFromCart({
        detailUUID: payload.detail.uuid,
        uuid: getState().cart.currentCart.uuid,
    });

    return cart;
});

export const increase = createAsyncThunk('cart/increase', async (payload, { getState, dispatch }) => {
    const user = getState().user;
    if (user.phoneNumber === '') {
        dispatch(cartSlice.actions.increase(payload));
        return { error: 'chua dang nhap' };
    }

    const cart = await cartService.increase({
        detailUUID: payload.detail.uuid,
        uuid: getState().cart.currentCart.uuid,
        quantity: payload.detail.quantity + 1,
    });

    return cart;
});

export const decrease = createAsyncThunk('cart/decrease', async (payload, { getState, dispatch }) => {
    const user = getState().user;
    if (user.phoneNumber === '') {
        dispatch(cartSlice.actions.decrease(payload));
        return { error: 'chua dang nhap' };
    }

    const cart = await cartService.decrease({
        detailUUID: payload.detail.uuid,
        uuid: getState().cart.currentCart.uuid,
        quantity: payload.detail.quantity - 1,
    });

    return cart;
});

export const getDeliveryCharge = createAsyncThunk('cart/getDeliveryCharge', async (payload, { getState }) => {
    const cart = await cartService.getDeliveryCharge({
        uuid: getState().cart.currentCart.uuid,
        addressId: payload,
    });

    return cart;
});

export const checkout = createAsyncThunk('cart/checkout', async (payload, { dispatch, getState }) => {
    const productsInCart = getState().cart.currentCart.products;
    const typesDetail = getState().products.typesDetail;

    const check = productsInCart.filter((product) => checkTypeAvail(product.type, typesDetail));
    if (check.length === 0) {
        dispatch(
            systemSlice.actions.setInform({
                type: 'error',
                message: `  Sản phẩm  ${productsInCart[0].name} hiện không khả dụng. Hãy thử sản phẩm khác.`,
            }),
        );
        return { error: 'Sản phẩm hiện không khả dụng' };
    }

    const cart = await cartService.checkout({
        uuid: payload.cart.uuid,
        ...payload,
    });

    if (cart.error) {
        dispatch(
            systemSlice.actions.setInform({
                type: 'error',
                message: 'Có lỗi xảy ra. Hãy thử lại hoặc mua trực tiếp tại cửa hàng',
            }),
        );
    } else {
        dispatch(systemSlice.actions.setInform({ type: 'success', message: 'Đơn hàng thành công.' }));
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }

    return cart;
});

export const createNewCart = createAsyncThunk('cart/createNewCart', async (payload, { getState, dispatch }) => {
    const result = await userService.createNewCart({ ...payload, uuid: getState().user.uuid });

    return {
        carts: result.carts,
        currentCart: result.currentCart,
    };
});

export const getAllCart = createAsyncThunk('cart/getAllCart', async () => {
    const result = await cartService.getAllCart();

    return result;
});

export const updateCartStatus = createAsyncThunk('cart/updateCartStatus', async (payload) => {
    const result = await cartService.updateCartStatus(payload);

    return result;
});

export const getAllDetail = createAsyncThunk('cart/getAllDetail', async (payload) => {
    const result = await cartService.getAllDetail();

    return result;
});
