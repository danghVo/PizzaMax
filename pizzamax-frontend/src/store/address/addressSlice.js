import { createSlice } from '@reduxjs/toolkit';

import { getAllShopAddress, getAllUserAddress } from './addressThunk';

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        currentAddress: {},
        userAddress: [],
        shopAddress: [],
    },
    reducers: {
        setCurrentAddress(state, action) {
            state.currentAddress[action.payload.orderType] = action.payload.address;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllShopAddress.fulfilled, (state, action) => {
                state.shopAddress = action.payload;
            })
            .addCase(getAllUserAddress.fulfilled, (state, action) => {
                state.userAddress = action.payload;
            });
    },
});

export default addressSlice;
