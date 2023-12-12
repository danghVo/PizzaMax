import { createSlice } from '@reduxjs/toolkit';
import { checkFailMessage } from '~/utils';

import {
    register,
    login,
    logOut,
    addFavor,
    removeFavor,
    getInforByToken,
    getAllUser,
    addAvatar,
    updateUser,
    updateUserAddress,
    deleteUserAddress,
    createAdmin,
} from './userThunk';

const setUserState = (state, result = {}) => {
    state.name = result.name || '';
    state.avatar = result.avatar || '';
    state.phoneNumber = result.phoneNumber || '';
    state.uuid = result.uuid || '';
    state.favorites = result.favorite || [];
    state.isAdmin = result.role === 'admin';
    state.api.status = 'success' || null;
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        uuid: '',
        name: '',
        phoneNumber: '',
        avatar: '',
        favorites: [],
        isAdmin: null,
        userList: [],
        userListShow: [],
        currentFilter: null,
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
        searchUser(state, action) {
            const searchText = action.payload.toLowerCase();

            state.userListShow = state.userList.filter((user) => user.name.toLowerCase().includes(searchText));
        },
        filterUserByRole(state, action) {
            const filters = action.payload;
            state.currentFilter = action.payload;

            state.userListShow = filters.reduce(
                (accu, curr) => [...accu.filter((item) => item.role === curr.selected)],
                state.userList,
            );
        },
        resetFilter(state, action) {
            state.currentFilter = null;
            state.userListShow = state.userList;
        },
    },
    extraReducers: (builder) => {
        builder
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
                    state.api.status = '';
                    state.api.message = '';
                }
            })

            .addCase(getInforByToken.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setUserState(state, result);
                    state.api.status = '';
                    state.api.message = '';
                }
            })

            .addCase(logOut.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    setUserState(state);
                    state.api.status = '';
                    state.api.message = '';
                }
            })
            .addCase(getAllUser.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    state.userList = result;
                    state.userListShow = result;
                }
            })
            .addCase(addAvatar.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    setUserState(state, result);
                }
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    setUserState(state, result);
                    state.api.status = 'success';
                } else {
                    state.api.status = 'fail';
                    state.api.message = result.error;
                }
            })
            .addCase(updateUserAddress.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    state.api.status = 'success';
                    state.userList = result;
                    state.userListShow = result;
                } else {
                    state.api.status = 'fail';
                    state.api.message = result.error;
                }
            })
            .addCase(deleteUserAddress.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    state.userList = result;
                    state.userListShow = result;
                }
            })
            .addCase(createAdmin.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    state.userList = result;
                    state.userListShow = result;
                }
            });
    },
});

export default userSlice;
