import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { productService } from '~/services';

const productListSlice = createSlice({
    name: 'productList',
    initialState: {
        productList: [],
        productShow: [],
    },
    reducers: {
        searchProduct(state, action) {
            const searchText = action.payload.toLowerCase();
            state.productShow = [];

            state.productList.forEach((item) => {
                const products = item.products.filter((product) => product.name.toLowerCase().includes(searchText));

                products.length > 0 &&
                    state.productShow.push({
                        type: item.type,
                        products,
                    });
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductList.pending, (state, action) => {})
            .addCase(fetchProductList.fulfilled, (state, action) => {
                state.productList = action.payload;
                state.productShow = action.payload;
            });
    },
});

export const fetchProductList = createAsyncThunk('productLists/fetchProductList', async () => {
    const res = await productService.getAll();

    const types = res.reduce((accu, curr) => (accu.includes(curr.type) ? [...accu] : [...accu, curr.type]), []);

    return types.map((type) => {
        const products = res
            .filter((item) => item.type === type)
            .map((product) => ({
                ...product,
                price: parseInt(product.price.split('.').join('')),
                discOptions: product.discOptions.map((disc) => ({
                    ...disc,
                    subOptions: disc.subOptions
                        .map((subOption) => ({
                            ...subOption,
                            price: parseInt(subOption.price.split('.').join('')),
                        }))
                        .sort((a, b) => a.price - b.price),
                })),
            }));

        return {
            type,
            products,
        };
    });
});

export default productListSlice;
