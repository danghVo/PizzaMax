import { createSelector } from '@reduxjs/toolkit';

export const shopAddress = (state) => state.address.shopAddress;
export const shopAddressShow = (state) => state.address.shopAddressShow;
export const shopAddressRaw = (state) => state.address.shopAddressRaw;
export const userAddress = (state) => state.address.userAddress;
export const userAddressRaw = (state) => state.address.userAddressRaw;

// formStatusApi
export const formStatusApi = (state) => state.address.formApiStatus;

export const currentAddress = (state) => state.address.currentAddress;
export const orderType = (state) => state.address.orderType;
export const currentAddressId = (state) => {
    const addressState = state.address;
    const currentAddress = addressState.currentAddress[addressState.orderType];

    return currentAddress.id;
};
