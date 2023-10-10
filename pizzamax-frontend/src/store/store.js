import { configureStore } from '@reduxjs/toolkit';

import { cartSlice } from './cart';
import { productsSlice } from './products';
import { userSlice } from './user';
import { addressSlice } from './address';

const store = configureStore({
    reducer: {
        address: addressSlice.reducer,
        cart: cartSlice.reducer,
        products: productsSlice.reducer,
        user: userSlice.reducer,
    },
});

export default store;
