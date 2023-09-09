import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        products: [],
        quantity: 0,
        subTotal: 0,
        deliveryCharge: 0,
        total: 0,
    },
    reducers: {
        addToCart(state, action) {
            const product = action.payload;
            state.products.push(action.payload);
            state.quantity += product.quantity;
            state.subTotal += product.price * product.quantity;
        },
        removeFromCart(state, action) {
            state.products = state.products.filter((product) => product.name != action.payload.name);
            state.quantity -= action.payload.quantity;
            state.subTotal -= action.payload.quantity * action.payload.price;
        },
        increment(state, action) {
            state.products = state.products.map((product) => {
                if (product.name == action.payload.name) {
                    product.quantity++;
                    state.subTotal += product.price;
                }

                return product;
            });
            state.quantity++;
        },
        decrement(state, action) {
            if (action.payload.quantity == 1) {
                state.products = state.products.filter((product) => product.name != action.payload.name);
            } else {
                state.products = state.products.map((product) => {
                    if (product.name == action.payload.name) {
                        product.quantity--;
                    }
                    return product;
                });
            }

            state.subTotal -= action.payload.price;
            state.quantity--;
        },
        chooseSelection(state, action) {
            state.products.map((product) => {
                if (product.name == action.payload.name) {
                    product.discOptions[action.payload.indexOption] = action.payload.selection;
                }

                return product;
            });
        },
    },
});

export default cartSlice;
