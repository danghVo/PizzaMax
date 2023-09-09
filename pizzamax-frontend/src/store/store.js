import { configureStore } from '@reduxjs/toolkit';

import { cartSlice } from './cart';
import { productListSlice } from './productList';

const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        productList: productListSlice.reducer,
    },
});

export default store;
