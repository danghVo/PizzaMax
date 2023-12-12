import { createSlice } from '@reduxjs/toolkit';

import {
    addDiscount,
    addProduct,
    addTime,
    addType,
    deleteDiscount,
    deleteProduct,
    deleteTime,
    deleteType,
    discountsDetail,
    fetchProducts,
    timesDetail,
    toggleHideProduct,
    transformProductList,
    typesDetail,
    updateDiscount,
    updateProduct,
    updateTime,
    updateType,
} from './productThunk';
import { checkDiscountAvail, dataTransform } from '~/utils';
import { check } from '~/components/Icons';

const setProductState = (state, payload) => {
    state.products = payload.products;
    state.productsShow = payload.products;
    state.rawProducts = payload.rawData;
    state.rawProductsShow = payload.rawData;

    return state;
};

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        productsShow: [],
        rawProducts: [],
        rawProductsShow: [],
        typesDetail: [],
        typesDetailShow: [],
        timesDetail: [],
        timesDetailShow: [],
        favorite: [],
        discountsDetail: [],
        discountsDetailShow: [],
        currentFilter: null,
        formApiStatus: {
            errorMessage: '',
            status: null,
        },
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

            state.rawProductsShow = state.rawProducts.filter((item) => item.name.toLowerCase().includes(searchText));
        },
        searchType(state, action) {
            const searchText = action.payload.toLowerCase();

            state.typesDetailShow = [];

            state.typesDetailShow = state.typesDetail.filter((item) => item.name.toLowerCase().includes(searchText));
        },
        searchTime(state, action) {
            const searchText = action.payload.toLowerCase();

            state.timesDetailShow = [];

            state.timesDetailShow = state.timesDetail.filter((item) => item.name.toLowerCase().includes(searchText));
        },
        filterRawProduct(state, action) {
            const filters = action.payload;
            state.currentFilter = action.payload;

            state.rawProductsShow = filters.reduce(
                (accu, curr) => [...accu.filter((item) => item[curr.name] === curr.selected)],
                state.rawProducts,
            );
        },
        filterRawType(state, action) {
            const filters = action.payload;
            state.currentFilter = action.payload;

            state.typesDetailShow = filters.reduce(
                (accu, curr) => [...accu.filter((item) => item.timeName === curr.selected)],
                state.typesDetail,
            );
        },
        resetFilter(state, action) {
            state.rawProductsShow = state.rawProducts;
            state.typesDetailShow = state.typesDetail;
            state.productsShow = state.products;
            state.currentFilter = null;
            state.discountsDetailShow = state.discountsDetail;
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
        setFavoriteOfUser(state, action) {
            if (action.payload) {
                state.favorite = action.payload;
            }
        },
        filterHome(state, action) {
            const filters = action.payload;
            let productsFilter = state.rawProducts;
            filters.forEach((filter) => {
                switch (filter.selected) {
                    case 'Yêu thích': {
                        productsFilter = productsFilter.filter((product) => state.favorite.includes(product.id));
                        break;
                    }
                    case 'Đang giảm giá': {
                        productsFilter = productsFilter.filter((product) =>
                            product.discountId ? checkDiscountAvail(product.Discount) : false,
                        );
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });

            state.productsShow = transformProductList({ products: productsFilter }).products;
            state.currentFilter = filters;
        },
        filterRawDiscount(state, action) {
            const filters = action.payload;
            state.currentFilter = filters;
            const currnetDate = Date.now().toLocaleString;

            state.discountsDetailShow = state.discountsDetail.filter((item) => {
                if (filters[0].selected === 'Còn hạn') {
                    return Date.parse(item.startAt) >= currnetDate;
                } else return Date.parse(item.startAt) < currnetDate;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state = setProductState(state, action.payload);
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                const result = action.payload;
                if (result.error) {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'fail';
                } else {
                    state = setProductState(state, result);
                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                }
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const result = action.payload;
                if (result.error) {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'fail';
                } else {
                    state = setProductState(state, result);
                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                if (!action.payload.error) state = setProductState(state, action.payload);
            })
            .addCase(toggleHideProduct.fulfilled, (state, action) => {
                if (!action.payload.error) state = setProductState(state, action.payload);
            })
            .addCase(typesDetail.fulfilled, (state, action) => {
                if (!action.payload.error) {
                    state.typesDetail = action.payload;
                    state.typesDetailShow = action.payload;
                }
            })
            .addCase(addType.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    state.typesDetail = result;
                    state.typesDetailShow = result;
                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                } else {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'fail';
                }
            })
            .addCase(updateType.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    state.typesDetail = result;
                    state.typesDetailShow = result;
                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                } else {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'fail';
                }
            })
            .addCase(deleteType.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    state.typesDetail = result;
                    state.typesDetailShow = result;
                }
            })
            .addCase(timesDetail.fulfilled, (state, action) => {
                if (!action.payload.error) {
                    state.timesDetail = action.payload;
                    state.timesDetailShow = action.payload;
                }
            })
            .addCase(addTime.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    state.timesDetail = result;
                    state.timesDetailShow = result;

                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                } else {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'fail';
                }
            })
            .addCase(updateTime.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    state.timesDetail = result;
                    state.timesDetailShow = result;

                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                } else {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'fail';
                }
            })
            .addCase(deleteTime.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    state.timesDetail = result;
                    state.timesDetailShow = result;
                }
            })
            .addCase(discountsDetail.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    state.discountsDetail = result;
                    state.discountsDetailShow = result;
                }
            })
            .addCase(addDiscount.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    state.discountsDetail = result;
                    state.discountsDetailShow = result;

                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                } else {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'fail';
                }
            })
            .addCase(updateDiscount.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    state.discountsDetail = result;
                    state.discountsDetailShow = result;

                    state.formApiStatus = {
                        ...state.formApiStatus,
                        status: 'success',
                    };
                } else {
                    state.formApiStatus.errorMessage = result.error;
                    state.formApiStatus.status = 'fail';
                }
            })
            .addCase(deleteDiscount.fulfilled, (state, action) => {
                const result = action.payload;
                if (!result.error) {
                    state.discountsDetail = result;
                    state.discountsDetailShow = result;
                }
            });
    },
});

export default productsSlice;
