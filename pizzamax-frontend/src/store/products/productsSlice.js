import { createSlice } from '@reduxjs/toolkit';

import { fetchProducts } from './productThunk';

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        productsShow: [],
    },
    reducers: {
        searchProduct(state, action) {
            const searchText = action.payload.toLowerCase();
            state.productsShow = [];

            state.products.forEach((item) => {
                const products = item.products.filter((product) => product.name.toLowerCase().includes(searchText));

                products.length > 0 &&
                    state.productsShow.push({
                        type: item.type,
                        products,
                    });
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state, action) => {})
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.productsShow = action.payload;
            });
    },
});

export default productsSlice;
