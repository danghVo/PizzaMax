import { createSlice } from '@reduxjs/toolkit';
import { checkFailMessage } from '~/utils';

import { register, login, logOut, addFavor, removeFavor, getInforByToken } from './userThunk';

const setUserState = (state, result = {}) => {
    state.name = result.name || '';
    state.phoneNumber = result.phoneNumber || '';
    state.uuid = result.uuid || '';
    state.favorites = result.favorite || [];
    // state.carts = result.carts.carts || [];
    state.isAdmin = result.isAdmin || null;
    state.api.status = 'success' || null;
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        uuid: '',
        name: '',
        phoneNumber: '',
        favorites: [],
        isAdmin: null,
        api: {
            message: '',
            status: '',
        },
    },
    reducers: {
        renewApiStatus(state, action) {
            state.api = {
                message: '',
                status: '',
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, () => {})

            .addCase(register.fulfilled, (state, action) => {
                const result = action.payload;
                if (result.error) {
                    state.api.status = 'fail';
                    state.api.message = result.error;
                } else state.api.status = 'success';
            })

            .addCase(login.fulfilled, (state, action) => {
                const result = action.payload;

                if (result.error) {
                    state.api.status = 'fail';
                    state.api.message = result.error;
                } else {
                    setUserState(state, result);
                }
            })

            .addCase(getInforByToken.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    setUserState(state, result);
                }
            })

            .addCase(logOut.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    setUserState(state);
                }
            })

            .addCase(addFavor.fulfilled, (state, action) => {
                const result = action.payload.result;
                if (!result.error) {
                    state.favorites = [...state.favorites, action.payload.data.productId];
                }
            })

            .addCase(removeFavor.fulfilled, (state, action) => {
                const result = action.payload.result;
                if (!result.error) {
                    state.favorites = state.favorites.filter((favor) => favor !== action.payload.data.productId);
                }
            });
    },
});

export default userSlice;
