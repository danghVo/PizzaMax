import { configureStore } from '@reduxjs/toolkit';

import { cartSlice } from './cart';
import { productListSlice } from './productList';
import { userSlice } from './user';

const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        productList: productListSlice.reducer,
        user: userSlice.reducer,
    },
});

export default store;
