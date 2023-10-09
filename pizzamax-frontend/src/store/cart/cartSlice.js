import { createSlice } from '@reduxjs/toolkit';

import { addToCart, removeFromCart, increase, decrease } from './cartThunk';

const setCartState = (state, result) => {
    state.uuid = result.uuid || '';
    state.total = result.total || 0;
    state.subTotal = result.subTotal || 0;
    state.deliveryCharge = result.deliveryCharge || 0;
    state.products = result.products || [];
    state.totalQuantity = result.products.reduce((accu, current) => {
        return accu + parseInt(current.detail.quantity);
    }, 0);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        uuid: null,
        totalQuantity: 0,
        products: [],
        subTotal: 0,
        deliveryCharge: 0,
        total: 0,
        oldCarts: [],
    },
    reducers: {
        setCartFromUser(state, action) {
            const currentCart = action.payload.currentCart;
            state.oldCarts = action.payload.carts;
            setCartState(state, currentCart);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state, result);
                }
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state, result);
                }
            })
            .addCase(increase.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state, result);
                }
            })
            .addCase(decrease.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state, result);
                }
            });
    },
});

export default cartSlice;
