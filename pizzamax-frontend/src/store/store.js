import { configureStore } from '@reduxjs/toolkit';

import { cartSlice } from './cart';
import { products } from './products';
import { userSlice } from './user';

const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        products: products.reducer,
        user: userSlice.reducer,
    },
});

export default store;
