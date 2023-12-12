import { createSlice } from '@reduxjs/toolkit';

import {
    addToCart,
    removeFromCart,
    increase,
    decrease,
    getDeliveryCharge,
    checkout,
    createNewCart,
    getAllCart,
    updateCartStatus,
    getAllDetail,
} from './cartThunk';
import operateCartStatus from '~/utils/operateCartStatus';

const setCartState = (currentCart, cart) => {
    currentCart.uuid = cart.uuid || '';
    currentCart.statusId = cart.statusId || null;
    if (cart.statusId) {
        currentCart.status = operateCartStatus(cart.statusId);
    }
    currentCart.paymentWayId = cart.paymentWayId || null;
    if (cart.paymentWayId) currentCart.paymentWay = cart.paymentWayId === 1 ? 'Cash' : 'Bank';
    currentCart.price.subTotal = cart.subTotal || 0;
    currentCart.price.deliveryCharge = cart.deliveryCharge || 0;
    currentCart.products = cart.products || [];
    currentCart.totalQuantity = cart.products
        ? cart.products.reduce((accu, current) => {
              return accu + parseInt(current.detail.quantity);
          }, 0)
        : 0;
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        currentCart: JSON.parse(window.localStorage.getItem('currentCart')) || {
            uuid: null,
            totalQuantity: 0,
            products: [],
            price: {
                subTotal: 0,
                deliveryCharge: 0,
            },
            cartPending: 0,
            status: 'Thanh toán',
            paymentWay: 'Cash',
            paymentWayId: null,
            statusId: null,
        },
        allCartsOfUser: [],
        allDetails: [],
        allCarts: {
            pending: [],
            success: [],
            fail: [],
            rawData: [],
        },
    },
    reducers: {
        setCartFromUser(state, action) {
            const currentCart = action.payload.currentCart;
            state.allCartsOfUser = [...action.payload.carts, currentCart];
            setCartState(state.currentCart, currentCart);
        },
        checkout(state, action) {
            setCartState(state.currentCart, action.payload);
        },
        emptyCart(state, action) {
            setCartState(state.currentCart, {});
            state.allCartsOfUser = [];
        },
        addToCart(state, action) {
            const product = action.payload;
            const currentCart = state.currentCart;
            product.detail.uuid = currentCart.products.length;

            currentCart.products.push(product);
            currentCart.totalQuantity += product.detail.quantity;
            currentCart.price.subTotal += product.detail.price * product.detail.quantity;

            window.localStorage.setItem('currentCart', JSON.stringify(currentCart));
        },
        removeFromCart(state, action) {
            const currentCart = state.currentCart;

            currentCart.products = currentCart.products.filter(
                (product, index) => index !== action.payload.detail.uuid,
            );
            currentCart.totalQuantity -= action.payload.detail.quantity;
            currentCart.price.subTotal -= action.payload.detail.quantity * action.payload.detail.price;

            window.localStorage.setItem('currentCart', JSON.stringify(currentCart));
        },
        increase(state, action) {
            const currentCart = state.currentCart;

            currentCart.products = currentCart.products.map((product, index) => {
                if (index === action.payload.detail.uuid) {
                    product.detail.quantity++;
                    currentCart.price.subTotal += product.detail.price;
                }

                return product;
            });
            currentCart.totalQuantity++;

            window.localStorage.setItem('currentCart', JSON.stringify(currentCart));
        },
        decrease(state, action) {
            const currentCart = state.currentCart;

            if (action.payload.detail.quantity === 1) {
                currentCart.products = currentCart.products.filter(
                    (product, index) => index !== action.payload.detail.uuid,
                );
            } else {
                currentCart.products = currentCart.products.map((product, index) => {
                    if (index === action.payload.detail.uuid) {
                        product.detail.quantity--;
                    }
                    return product;
                });
            }

            currentCart.price.subTotal -= action.payload.detail.price;
            currentCart.totalQuantity--;
            window.localStorage.setItem('currentCart', JSON.stringify(currentCart));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state.currentCart, result);
                }
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state.currentCart, result);
                }
            })
            .addCase(increase.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state.currentCart, result);
                }
            })
            .addCase(decrease.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state.currentCart, result);
                }
            })
            .addCase(getDeliveryCharge.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state.currentCart, result);
                }
            })
            .addCase(checkout.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state.currentCart, result);
                }
            })
            .addCase(createNewCart.fulfilled, (state, action) => {
                const result = action.payload;

                if (!result.error) {
                    setCartState(state.currentCart, result.currentCart);
                    state.allCartsOfUser = [...result.carts, ...result.currentCart];
                }
            })
            .addCase(getAllCart.fulfilled, (state, action) => {
                state.allCarts = action.payload;

                state.cartPending = action.payload.pending.length;
            })
            .addCase(updateCartStatus.fulfilled, (state, action) => {
                state.allCarts = action.payload;

                state.cartPending = action.payload.pending.length;
            })
            .addCase(getAllDetail.fulfilled, (state, action) => {
                if (!action.payload.error) {
                    state.allDetails = action.payload;
                }
            });
    },
});

export default cartSlice;
