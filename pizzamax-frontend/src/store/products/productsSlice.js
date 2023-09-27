import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { productService } from '~/services';

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

export const fetchProducts = createAsyncThunk('productss/fetchProducts', async () => {
    const res = await productService.getAll();

    const types = res.reduce((accu, curr) => (accu.includes(curr.type) ? [...accu] : [...accu, curr.type]), []);

    const products = types.map((type) => {
        let products = res.filter((item) => item.type === type);

        return {
            type,
            products,
        };
    });

    return products;
});

export default productsSlice;
