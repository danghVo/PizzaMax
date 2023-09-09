import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import images from '~/assets/images';

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

export const fetchProductList = createAsyncThunk('productLists/fetchProductList', () => {
    const res = [
        {
            type: 'Value Deals',
            products: [
                {
                    name: 'Promo Medium',
                    saleOff: '50%',
                    price: 100000,
                    currency: 'vnd',
                    src: images.promo[0],
                    description: 'Medium 10" Pizza',
                    discOptions: [],
                },
                {
                    name: 'a Medium',
                    saleOff: '50%',
                    price: 100000,
                    currency: 'vnd',
                    src: images.promo[0],
                    description: 'Medium 10" Pizza',
                    discOptions: [],
                },

                {
                    name: 'Promo Lasagne or Pasta (Large)',
                    saleOff: '20%',
                    price: 120000,
                    currency: 'vnd',
                    src: images.promo[1],
                    description: 'Promo Large Lasagne or Pasta (Select 1)',
                    discOptions: [
                        {
                            name: 'Choose Your Lasagne or Pasta',
                            subOptions: [
                                { name: 'Creamy Chicken Lasagne', signature: true },
                                { name: 'Chicken Lasagne', signature: false },
                                { name: 'Creamy Chicken Pasta', signature: true },
                                { name: 'Chicken Pasta', signature: false },
                            ],
                        },
                        {
                            name: 'Choose Your 345ml Drink',
                            subOptions: [
                                { name: 'Pepsi' },
                                { name: 'Pepsi Diet' },
                                { name: '7up' },
                                { name: '7up Diet' },
                                { name: 'Mirinda' },
                                { name: 'Dew' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: 'Promo Deals',
            products: [
                {
                    name: 'Promo Medium',
                    saleOff: '50%',
                    price: 100000,
                    currency: 'vnd',
                    src: images.promo[0],
                    description: 'Medium 10" Pizza',
                    discOptions: [],
                },
                {
                    name: 'Promo Lasagne or Pasta (Large)',
                    saleOff: '20%',
                    price: 120000,
                    currency: 'vnd',
                    src: images.promo[1],
                    description: 'Promo Large Lasagne or Pasta (Select 1)',
                    discOptions: [
                        {
                            name: 'Choose Your Lasagne or Pasta',
                            subOptions: [
                                { name: 'Creamy Chicken Lasagne', signature: true },
                                { name: 'Chicken Lasagne', signature: false },
                                { name: 'Creamy Chicken Pasta', signature: true },
                                { name: 'Chicken Pasta', signature: false },
                            ],
                        },
                        {
                            name: 'Choose Your 345ml Drink',
                            subOptions: [
                                { name: 'Pepsi' },
                                { name: 'Pepsi Diet' },
                                { name: '7up' },
                                { name: '7up Diet' },
                                { name: 'Mirinda' },
                                { name: 'Dew' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: 'Max Value Deals',
            products: [
                {
                    name: 'Promo Medium',
                    saleOff: '50%',
                    price: 100000,
                    currency: 'vnd',
                    src: images.promo[0],
                    description: 'Medium 10" Pizza',
                    discOptions: [],
                },
            ],
        },
    ];

    return res;
});

export default productListSlice;
