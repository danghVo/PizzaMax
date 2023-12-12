import { configureStore } from '@reduxjs/toolkit';

import { cartSlice } from './cart';
import { productsSlice } from './products';
import { userSlice } from './user';
import { addressSlice } from './address';
import { systemSlice } from './system';

const store = configureStore({
    reducer: {
        address: addressSlice.reducer,
        cart: cartSlice.reducer,
        products: productsSlice.reducer,
        user: userSlice.reducer,
        system: systemSlice.reducer,
    },
});

export default store;
