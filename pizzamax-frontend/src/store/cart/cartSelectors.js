import { createSelector } from '@reduxjs/toolkit';

export const products = (state) => state.cart.currentCart.products;
export const currentProducts = (state) => state.cart.currentCart.products || [];
export const cart = (state) => state.cart.currentCart;
export const price = (state) => state.cart.currentCart.price;
export const statusId = (state) => state.cart.currentCart.statusId;
export const allCarts = (state) => state.cart.allCarts;
export const allDetails = (state) => state.cart.allDetails;
export const detailData = createSelector(
    [allDetails, (state) => state.products.rawProducts, (state) => state.products.products],
    (allDetails, rawProducts, products) => ({
        allDetails,
        products: rawProducts,
        types: products.map((product) => ({ type: product.type })),
    }),
);
export const allCartsOfUser = (state) => state.cart.allCartsOfUser;
export const cartSuccess = (state) => state.cart.allCarts.success;
export const cartPending = createSelector([allCartsOfUser], (state) => {
    const oldCartPending = state.cart.allCartsOfUser.filter((cart) => cart.statusId === 2);
    const currentCartPending = state.cart.statusId === 2 ? 1 : 0;
    return oldCartPending.length + currentCartPending;
});
