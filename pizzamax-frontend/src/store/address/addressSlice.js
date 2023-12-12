import { createSlice } from '@reduxjs/toolkit';

import {
    addAddressByUser,
    addShopAddress,
    deleteShopAddress,
    getAllShopAddress,
    getAllUserAddress,
    updateShopAddress,
} from './addressThunk';

const setStateShop = (state, payload) => {
    state.shopAddress = payload.addresses;
    state.shopAddressShow = payload.addresses;
    state.shopAddressRaw = payload.rawAddresses;

    return state;
};

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        currentAddress: JSON.parse(window.localStorage.getItem('currentAddress')) || {
            1: { id: null, address: '' },
            2: { id: null, address: '' },
        },
        orderType: parseInt(window.localStorage.getItem('orderType') || 1),
        userAddress: [],
        userAddressRaw: [],
        shopAddress: [],
        shopAddressShow: [],
        shopAddressRaw: [],
        currentFilter: null,
        formApiStatus: {
            errorMessage: '',
            status: null,
        },
    },
    reducers: {
        setCurrentAddress(state, { payload: { orderType, id, address } }) {
            const checkExist =
                orderType === 1
                    ? state.shopAddress.find((item) => item.address === address)
                    : state.userAddress.find((item) => item.address === address);

            if (checkExist) {
                state.currentAddress = {
                    ...state.currentAddress,
                    [orderType]: {
                        address,
                        id,
                    },
                };
                window.localStorage.setItem('currentAddress', JSON.stringify(state.currentAddress));
            }
        },
        setOrderType(state, action) {
            state.orderType = action.payload.orderType;
            window.localStorage.setItem('orderType', JSON.stringify(state.orderType));
        },
        resetCurrentAddress(state, action) {
            state.currentAddress = {
                1: {
                    id: state.shopAddress[0].id,
                    address: state.shopAddress[0].address,
                },
                2: {
                    address: '',
                    id: null,
                },
            };
            state.orderType = 1;
            window.localStorage.setItem('currentAddress', JSON.stringify(state.currentAddress));
            window.localStorage.setItem('orderType', JSON.stringify(1));
        },
        searchAddress(state, action) {
            const searchText = action.payload.toLowerCase();

            state.shopAddressShow = state.shopAddress.filter((address) =>
                address.address.toLowerCase().includes(searchText),
            );
        },
        filterAddress(state, action) {
            const filters = action.payload;
            state.currentFilter = action.payload;

            state.shopAddressShow = filters.reduce(
                (accu, curr) => [
                    ...accu.filter((item) => item.address.toLowerCase().includes(curr.selected.toLowerCase())),
                ],
                state.shopAddress,
            );
        },
        resetFilter(state, action) {
            state.currentFilter = null;
            state.shopAddressShow = state.shopAddress;
        },
        setApiStart(state, action) {
            if (action.payload) {
                state.formApiStatus.status = action.payload;
            } else
                state.formApiStatus = {
                    status: null,
                    errorMessage: '',
                };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllShopAddress.fulfilled, (state, action) => {
                state = setStateShop(state, action.payload);
            })
            .addCase(getAllUserAddress.fulfilled, (state, action) => {
                state.userAddress = action.payload.addresses;
                state.userAddressRaw = action.payload.rawAddresses;
            })
            .addCase(addAddressByUser.fulfilled, (state, action) => {
                const result = action.payload;
                if (result.error) {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'error';
                } else {
                    const newAddress = result.addresses[result.addresses.length - 1];
                    state.userAddress = result.addresses;
                    state.userAddressRaw = result.rawAddresses;
                    state.currentAddress = {
                        ...state.currentAddress,
                        2: {
                            id: newAddress.id,
                            address: newAddress.address,
                        },
                    };

                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                }
            })
            .addCase(addShopAddress.fulfilled, (state, action) => {
                const result = action.payload;
                if (result.error) {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'fail';
                } else {
                    state = setStateShop(state, result);

                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                }
            })
            .addCase(updateShopAddress.fulfilled, (state, action) => {
                const result = action.payload;
                if (result.error) {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'fail';
                } else {
                    state = setStateShop(state, result);

                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                }
            })
            .addCase(deleteShopAddress.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    state = setStateShop(state, result);
                }
            });
    },
});

export default addressSlice;
