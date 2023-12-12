import { io } from 'socket.io-client';
import { cartSlice, cartThunk } from '~/store/cart';
import { systemSlice } from '~/store/system';
import { dataTransform } from '~/utils';

export const start = () => {
    const socket = io(process.env.REACT_APP_SOCKET_URL);

    // socket.on('disconnect', )

    return {
        socket,
        checkout: async ({ cart, user, addressId, orderWayId, paymentWayId }, dispatch) => {
            console.log(user);
            socket.emit('checkout', { cart, user, addressId, orderWayId, paymentWayId });

            socket.on('payUrl', async (payUrl) => {
                window.open(payUrl, Math.random(), `width=500,height=${window.screen.height},popup`);
            });

            socket.on('vnp_success', (result) => {
                dispatch(systemSlice.actions.updateResult(result.status));
                dispatch(cartSlice.actions.checkout(dataTransform.cart(result.cart)));
                dispatch(systemSlice.actions.setInform({ type: 'success', message: 'Thanh toán thành công' }));
                setTimeout(() => (window.location.href = '/'), 2000);
            });

            socket.on('vnp_fail', (result) => {
                dispatch(systemSlice.actions.updateResult(result.status));
                dispatch(
                    systemSlice.actions.setInform({
                        type: 'error',
                        message: 'Có lỗi xảy ra. Hãy thử lại hoặc thử phương thức thanh toán khác',
                    }),
                );
            });
        },
        orderInform: async (dispatch) => {
            socket.on('orderInform', (result) => {
                dispatch(systemSlice.actions.orderInform(result));
            });
        },
        reFetch: (dispatch) => {
            socket.on('reFetch', () => {
                dispatch(systemSlice.actions.reFetch(true));
            });
        },
        disconnect: () => {
            socket.disconnect();
        },
    };
};
