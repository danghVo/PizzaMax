import { createSelector } from '@reduxjs/toolkit';

export const productsShow = (state) => state.products.productsShow;
export const products = (state) => state.products.products;
export const rawProducts = (state) => state.products.rawProductsShow;
export const allTypes = (state) => state.products.products.map((item) => item.type);
export const currentFilter = (state) => state.products.currentFilter;
export const getAllTypes = createSelector([products], (products) => products.map((product) => product.type));
export const formApiStatus = (state) => state.products.formApiStatus;
export const rawTypes = (state) => state.products.typesDetailShow;
export const rawTimes = (state) => state.products.timesDetailShow;
export const rawDiscounts = (state) => state.products.discountsDetailShow;
export const getTimesFilter = createSelector([rawTimes], (times) => times.map((time) => time.name));
export const favorite = (state) => state.products.favorite;
